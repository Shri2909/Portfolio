// E4.1: the light engine. Every flame is a point light; panels, cards, rangoli and headings are lit by the nearest two.
// Lights are kept in plain arrays (max 32). Surfaces are updated only when something changed (lamp lit, resize,
// scroll end, a transient light moving), never from a free-running loop, because V3 has no frame-time headroom.
import { getState, subscribe } from '../lib/store.js';
import { on, emit } from '../lib/events.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { ticker } from '../lib/ticker.js';
import { energy, flash } from './energy.js';
import { registry } from './registry.js';

export const LIGHT = { hues: [[255, 196, 110], [255, 150, 60], [238, 118, 138], [96, 104, 230], [255, 243, 220], [170, 190, 235]], LIT_CAP: 0.30, PERIOD: 4.8 };
export const att = (s) => (s >= 1 ? 0 : ((1 - s * s) ** 2) / (1 + 4 * s * s));
export const breath = (t) => 0.5 - 0.5 * Math.cos((2 * Math.PI * t) / LIGHT.PERIOD);
const MAX = 32;
const lights = new Map(); // id -> { x,y,r,i,hue,kind,get?,el? }
const trans = [];          // transients: pulses and travellers
const subs = new Set();    // draw listeners (lightmap)
let surfaces = [], visible = new Set(), io = null, ro = null, offs = [], dirty = false, raf = 0, stopTick = null, accum = 0, started = false, scrollT = 0;
const SURF = '.sec .panel, .person-panel, .take-card, .rangoli-wrap, .sec h2, #night h1';
const tierMax = () => ({ high: 12, mid: 8, low: 4 }[getState().quality] || 8);
const tierHz = () => ({ high: 30, mid: 20, low: 8 }[getState().quality] || 20);
const off = () => getState().calm || getState().ink;

export const light = {
  exposure: 1,
  add(id, p) { if (lights.size >= MAX && !lights.has(id)) return; lights.set(id, { x: 0, y: 0, r: 200, i: 0.9, hue: 0, kind: 'flame', ...p }); mark(); },
  set(id, patch) { const l = lights.get(id); if (l) { Object.assign(l, patch); mark(); } },
  remove(id) { lights.delete(id); mark(); },
  has: (id) => lights.has(id),
  all: () => lights,
  // sum of att*I at a viewport point, 0..1.5
  sample(x, y) { let s = 0; for (const l of lights.values()) s += att(Math.hypot(x - l.x, y - l.y) / l.r) * l.i; for (const t of trans) s += att(Math.hypot(x - t.x, y - t.y) / t.r) * t.cur; return Math.min(1.5, s); },
  pulse({ x, y, r = 220, i = 0.8, hue = 0, attack = 60, decay = 440, amp = 0.3 }) {
    if (off()) return false;
    let ok = flash.request(amp); const a = ok ? attack : 600; // a refused flash degrades to a slow swell
    trans.push({ x, y, r, peak: ok ? i : i * 0.6, hue, t0: performance.now(), a, d: decay, cur: 0, kind: 'pulse' }); run(); return ok;
  },
  traveller({ from, to, dur = 900, r = 200, i = 0.9, hue = 0 }) {
    if (!from || !to || off()) return;
    const d = Math.hypot(to.x - from.x, to.y - from.y), c = { x: (from.x + to.x) / 2, y: (from.y + to.y) / 2 - Math.max(40, 0.35 * d) };
    trans.push({ x: from.x, y: from.y, r, peak: i, hue, t0: performance.now(), dur, from, to, c, cur: 0, kind: 'travel' }); run();
  },
  breath: () => breath(performance.now() / 1000),
  transients: () => trans,
  onDraw(fn) { subs.add(fn); return () => subs.delete(fn); },
  mark: () => mark(),
  flashStats: () => ({ flashes: energy.flashCount, refused: energy.refused }),
};
const ease = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - ((-2 * t + 2) ** 5) / 2); // in-out quint

function run() { if (stopTick) return; accum = 0; stopTick = ticker.add((dt, now) => { accum += dt; if (accum < 1000 / tierHz() - 1) return; accum = 0; step(now); }); }
function step(now) {
  for (let k = trans.length - 1; k >= 0; k--) {
    const t = trans[k], e = now - t.t0;
    if (t.kind === 'pulse') { t.cur = e < t.a ? t.peak * (e / t.a) : t.peak * Math.max(0, 1 - (e - t.a) / t.d); if (e > t.a + t.d) { trans.splice(k, 1); continue; } }
    else { const p = Math.min(1, e / t.dur), q = ease(p), u = 1 - q; t.x = u * u * t.from.x + 2 * u * q * t.c.x + q * q * t.to.x; t.y = u * u * t.from.y + 2 * u * q * t.c.y + q * q * t.to.y; t.cur = t.peak * Math.sin(Math.PI * Math.min(1, p)) ** 0.6; if (p >= 1) { trans.splice(k, 1); continue; } }
  }
  recompute();
  if (!trans.length && stopTick) { stopTick(); stopTick = null; mark(); }
}
function mark() { if (dirty || !started) return; dirty = true; raf = requestAnimationFrame(() => { dirty = false; refreshLamps(); recompute(); }); }

// -- sources
function refreshLamps() {
  const s = getState();
  const put = (id, n, r, i) => { const p = lampRegistry.wick(n); if (p && (n === 0 || s.lamps[n] === 'lit')) { const l = lights.get(id); if (l) { l.x = p.x; l.y = p.y; } else lights.set(id, { x: p.x, y: p.y, r, i, hue: 0, kind: 'flame' }); } else lights.delete(id); };
  put('f0', 0, 320, 0.9); for (let n = 1; n <= 5; n++) put('f' + n, n, 240, 0.9);
  if (s.visitorLit) { const p = lampRegistry.wick(30); p && lights.set('f30', { x: p.x, y: p.y, r: 280, i: 0.9, hue: 0, kind: 'flame' }); }
}

// -- surfaces
function collect() {
  io && io.disconnect(); surfaces = [];
  document.querySelectorAll(SURF).forEach((el) => {
    if (el.dataset.elit) { /* already ours */ } else {
      el.dataset.elit = el.matches('h2, h1') ? 'text' : el.matches('.rangoli-wrap') ? 'rangoli' : el.matches('.take-card, .person-panel') ? 'card' : 'panel';
      el.dataset.elitOwn = '1';
      if (el.dataset.elit !== 'text' && getComputedStyle(el).position === 'static') { el.style.position = 'relative'; el.dataset.elitPos = '1'; }
    }
    surfaces.push({ el, lx: -1, ly: -1, li: -1, rect: null }); io && io.observe(el);
  });
}
const surfOf = new WeakMap();
function recompute() {
  if (!started) return;
  const ex = energy.exposure; light.exposure = ex;
  const st = tierMax(); let n = 0;
  const list = [];
  for (const l of lights.values()) list.push(l);
  for (const t of trans) list.push({ x: t.x, y: t.y, r: t.r, i: t.cur });
  if (getState().quality !== 'low') {
    // clusters of lit windows (drawn by the lightmap too)
    for (const l of windowLights) list.push(l);
  }
  const act = list.length > 0;
  for (const s of surfaces) {
    if (!visible.has(s.el)) continue;
    if (n++ >= st) break;
    const r = s.el.getBoundingClientRect(); // only visible, capped surfaces: at most 12 reads per recompute
    let a1 = 0, a2 = 0, x1 = 0, y1 = 0, x2 = 0, y2 = 0;
    if (act) for (const l of list) { const a = att(Math.hypot(r.left + r.width / 2 - l.x, r.top + r.height / 2 - l.y) / (l.r + Math.max(r.width, r.height) * 0.25)) * l.i; if (a > a1) { a2 = a1; x2 = x1; y2 = y1; a1 = a; x1 = l.x; y1 = l.y; } else if (a > a2) { a2 = a; x2 = l.x; y2 = l.y; } }
    const w = a1 + a2 * 0.6, li = Math.round(Math.min(1, w) * ex * 50) / 50;
    const lx = w > 0 ? Math.round(((a1 * x1 + a2 * 0.6 * x2) / w - r.left) * 0.5) * 2 : 0, ly = w > 0 ? Math.round(((a1 * y1 + a2 * 0.6 * y2) / w - r.top) * 0.5) * 2 : 0;
    if (li !== s.li) { s.el.style.setProperty('--li', li); s.li = li; }
    if (lx !== s.lx) { s.el.style.setProperty('--lx', lx + 'px'); s.lx = lx; }
    if (ly !== s.ly) { s.el.style.setProperty('--ly', ly + 'px'); s.ly = ly; }
  }
  subs.forEach((f) => f(list, ex));
}

// -- lit windows -> clusters (8 columns), read once per lit-state change (the windows fade in over about 1 s)
let windowLights = [], winT = 0;
function readWindows() {
  const q = getState().quality; if (q === 'low') { windowLights = []; return; }
  const cols = Array.from({ length: 8 }, () => ({ n: 0, x: 0, y: 0 }));
  document.querySelectorAll('#skyline .win').forEach((w) => {
    if (w.style.opacity !== '1') return; const r = w.getBoundingClientRect(); if (!r.width) return;
    const c = cols[Math.max(0, Math.min(7, Math.floor((r.left / innerWidth) * 8)))]; c.n++; c.x += r.left + r.width / 2; c.y += r.top + r.height / 2;
  });
  windowLights = cols.filter((c) => c.n).map((c) => ({ x: c.x / c.n, y: c.y / c.n, r: 90 + Math.min(40, c.n * 4), i: 0.1 + 0.012 * c.n, hue: 4, kind: 'window' }));
  mark();
}
export const windows = () => windowLights;

export function start() {
  started = true; light.exposure = energy.exposure;
  io = new IntersectionObserver((es) => { es.forEach((e) => (e.isIntersecting ? visible.add(e.target) : visible.delete(e.target))); mark(); }, { rootMargin: '20% 0px' });
  collect();
  ro = new ResizeObserver(() => { clearTimeout(winT); winT = setTimeout(readWindows, 200); mark(); }); ro.observe(document.documentElement);
  offs.push(subscribe(() => { mark(); clearTimeout(winT); winT = setTimeout(readWindows, 1400); }));
  offs.push(on('diya:lit', () => mark()), on('diya:visitorLit', () => setTimeout(mark, 50)), on('fx:setQuality', () => mark()));
  const sc = () => { clearTimeout(scrollT); scrollT = setTimeout(mark, 140); }; window.addEventListener('scroll', sc, { passive: true }); offs.push(() => window.removeEventListener('scroll', sc));
  energy.listeners.add(mark);
  // keyboard users carry a light too (focus-visible)
  const fin = (e) => { const t = e.target; if (!t || !t.matches || !t.matches(':focus-visible') || off()) return; const r = t.getBoundingClientRect(); light.add('focus', { x: r.left + r.width / 2, y: r.top + r.height / 2, r: 90, i: 0.4, hue: 4, kind: 'follow' }); };
  const fout = () => light.remove('focus');
  document.addEventListener('focusin', fin); document.addEventListener('focusout', fout); offs.push(() => { document.removeEventListener('focusin', fin); document.removeEventListener('focusout', fout); });
  // the travelling light: the ember that hops lamp to lamp is a real light
  offs.push(on('diya:lighting', ({ n, progress }) => { if (progress || off() || getState().quality === 'low') return; const a = lampRegistry.wick(n === 1 ? 0 : n - 1), b = lampRegistry.wick(n); a && b && light.traveller({ from: a, to: b, dur: 900, r: 200, i: 0.9 }); }));
  // light wipe across the act heading on each act change
  offs.push(on('stage:act', ({ id, jump }) => { if (jump || off() || getState().quality === 'low') return; const sec = document.querySelector(`[data-act="${id}"]`), h = sec && sec.querySelector('h1, h2'); if (!h) return; const r = h.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; light.traveller({ from: { x: r.left, y: r.top + r.height / 2 }, to: { x: r.right, y: r.top + r.height / 2 }, dur: 700, r: 120, i: 0.6 }); }));
  registry.register('light-surfaces', { kind: 'light', cost: 0.4, shed() { visible.clear(); } });
  mark(); setTimeout(readWindows, 800);
  if (import.meta.env.VITE_PERF === '1' && /[?&]qa=1/.test(location.search)) window.__light = { lights, trans, energy, att, light, sample: light.sample, flash: () => light.flashStats() };
}
export function stop() {
  started = false; cancelAnimationFrame(raf); dirty = false; offs.splice(0).forEach((f) => f()); stopTick && stopTick(); stopTick = null; trans.length = 0; lights.clear(); subs.clear();
  io && io.disconnect(); ro && ro.disconnect(); clearTimeout(winT); clearTimeout(scrollT); windowLights = [];
  document.querySelectorAll('[data-elit-own]').forEach((el) => { ['--li', '--lx', '--ly'].forEach((p) => el.style.removeProperty(p)); if (el.dataset.elitPos) el.style.position = ''; delete el.dataset.elit; delete el.dataset.elitOwn; delete el.dataset.elitPos; });
  surfaces = []; visible = new Set();
}
export const refreshSurfaces = () => { if (started) { collect(); mark(); } };
export const name = 'light';
