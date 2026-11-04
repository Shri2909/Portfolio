// E2.2: one passive scroll listener, one probe line with a dead band, one observer for cues. Sets html[data-act].
import { ticker } from '../lib/ticker.js';
import { getState } from '../lib/store.js';
import { emit } from '../lib/events.js';
import { read } from './motion.js';
import { CAMERA } from '../elevation.js';

export const glide = { on: false }; // set by scrollFeel during a programmatic glide: intersections are ignored (R12)
export const ACTS = ['doorstep', 'baithak', 'chhat', 'awaaz', 'aakhri', 'vidaai'];
const BY_ID = { night: 'doorstep', 'lamp-1': 'chhat', baithak: 'baithak', 'lamp-2': 'chhat', 'lamp-3': 'chhat', pattern: 'chhat', 'row-breathes': 'chhat', voice: 'awaaz', 'lamp-6': 'aakhri', verdict: 'vidaai', wish: 'vidaai', deeper: 'vidaai', closure: 'vidaai', footer: 'vidaai' };
const root = document.documentElement;
let gate = false, geo = [], y = 0, lastY = 0, dir = 1, v = 0, dirty = false, act = '', cand = '', candSince = 0, lastCommit = -1e9, calmSince = 0, offTick = null;
let progQ = -1, io = null, ro = null, cleanups = [], quiet = 0;

function measure() {
  read(() => {
    geo = [];
    document.querySelectorAll('main > section[id], footer#footer').forEach((el) => {
      let a = el.dataset.act || BY_ID[el.id];
      if (!a) return;
      el.dataset.act = a;
      geo.push({ el, a, top: el.offsetTop, h: el.offsetHeight });
    });
    // sections may be nested in wrappers: offsetTop is relative to offsetParent, so use page rects
    geo.forEach((g) => { const r = g.el.getBoundingClientRect(); g.top = r.top + scrollY; g.h = r.height; });
    geo.sort((p, q) => p.top - q.top);
    dirty = true; kick();
  });
}
const actAt = (probe) => {
  let hit = geo[0] && geo[0].a;
  for (const g of geo) { if (g.top <= probe) hit = g.a; else break; }
  return hit || 'doorstep';
};
const busy = () => root.dataset.busy === '1' || root.dataset.fg === '1' || !!document.querySelector('dialog[open]');

function commit(next, jump) {
  const prev = act; act = next; lastCommit = performance.now();
  root.dataset.act = next; root.dataset.dir = dir > 0 ? 'down' : 'up';
  root.dataset.veil = next === 'doorstep' ? '0' : '1'; // derived, kept alive for V3 rules
  progQ = -1;
  emit('stage:act', { id: next, progress: 0, prev, dir, jump: !!jump });
}
function frame(dt, now) {
  const dy = y - lastY; lastY = y;
  if (Math.abs(dy) >= 4) dir = dy > 0 ? 1 : -1;
  if (Math.abs(dy) > 2.5 * innerHeight) { v = 0; gate = false; calmSince = 0; } // a teleport (hash link, Menu jump, scrollIntoView) is not a fling: do not wait for its velocity to decay
  else v = v * 0.7 + (dy / Math.max(1, dt)) * 0.3;
  // velocity gate: closed above 2.5 px/ms, reopened after 80 ms under 0.6 px/ms
  if (Math.abs(v) > 2.5) { gate = true; calmSince = 0; }
  else if (gate) { if (Math.abs(v) < 0.6) { calmSince = calmSince || now; if (now - calmSince > 80) gate = false; } else calmSince = 0; }
  const settled = !gate;
  if (dirty && !busy()) {
    const probe = y + innerHeight * (dir > 0 ? 0.5 : 0.62);
    const want = actAt(probe);
    if (!act) commit(want, true);
    else if (want !== act && settled && !glide.on) {
      if (cand !== want) { cand = want; candSince = now; }
      const far = Math.abs(ACTS.indexOf(want) - ACTS.indexOf(act)) >= 2;
      if (far) commit(want, true);
      else if (now - candSince >= 120 && now - lastCommit >= 700) commit(want, false);
    } else if (want === act) cand = '';
    // --act-progress, quantised to 1/64, written only when it changes
    if (CAMERA && getState().quality === 'high') { // consumers: camera drift only; inherited custom-property writes are costly, so no writes without it
      const gs = geo.filter((g) => g.a === act);
      if (gs.length) {
        const a0 = gs[0].top, a1 = gs[gs.length - 1].top + gs[gs.length - 1].h;
        const q = Math.round(Math.max(0, Math.min(1, (y + innerHeight * 0.5 - a0) / Math.max(1, a1 - a0))) * 64);
        if (q !== progQ) { progQ = q; root.style.setProperty('--act-progress', (q / 64).toFixed(3)); document.getElementById('stage') && document.getElementById('stage').style.setProperty('--cam', (q / 64).toFixed(3)); }
      }
    }
  }
  if (Math.abs(dy) < 0.5 && Math.abs(v) < 0.1 && !cand) { if (++quiet > 30) { dirty = false; quiet = 0; offTick && offTick(); offTick = null; } } else quiet = 0;
}
function kick() { if (!offTick) offTick = ticker.add(frame); }
const onScroll = () => { y = scrollY; dirty = true; kick(); };

// ---- cues: data-cue elements fire once at 60% visible after 150 ms ----
export const onCue = (name, fn) => { const h = (e) => e.detail && e.detail.name === name && fn(e.detail); window.addEventListener('stage:cue', h); return () => window.removeEventListener('stage:cue', h); };
function watchCues() {
  const timers = new Map();
  io = new IntersectionObserver((es) => es.forEach((e) => {
    const el = e.target;
    if (e.isIntersecting && e.intersectionRatio >= 0.6) {
      const fire = () => { el.classList.add('cued'); if (getState().calm) el.dataset.final = '1'; emit('stage:cue', { name: el.dataset.cue, el }); io.unobserve(el); timers.delete(el); };
      if (getState().calm) fire(); else timers.set(el, setTimeout(() => (Math.abs(v) > 2.5 ? setTimeout(fire, 200) : fire()), 150));
    } else { clearTimeout(timers.get(el)); timers.delete(el); }
  }), { threshold: [0.6] });
  document.querySelectorAll('[data-cue]').forEach((el) => io.observe(el));
  cleanups.push(() => timers.forEach(clearTimeout));
}

export function start() {
  y = lastY = scrollY;
  // lamp stops are cued as they arrive (E2.5)
  document.querySelectorAll('#lamp-1,#lamp-2,#lamp-3,#lamp-6').forEach((el) => { if (!el.dataset.cue) el.dataset.cue = 'lamp-arrive'; });
  window.addEventListener('scroll', onScroll, { passive: true });
  ro = new ResizeObserver(measure); const m = document.querySelector('main'); m && ro.observe(m);
  document.fonts && document.fonts.ready.then(measure);
  window.addEventListener('resize', measure);
  watchCues(); measure();
}
export function stop() {
  window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', measure);
  ro && ro.disconnect(); io && io.disconnect(); cleanups.splice(0).forEach((f) => f());
  offTick && offTick(); offTick = null; act = ''; cand = '';
  ['act', 'dir'].forEach((k) => delete root.dataset[k]); root.style.removeProperty('--act-progress');
}
export const currentAct = () => act;
