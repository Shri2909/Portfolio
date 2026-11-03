// E3.4: gali jag uthi. When lamp 1 catches, one soft front of light leaves it and the street answers in order: string-light
// bulbs, apartment windows (in clusters of three), the toran. All timing is data: each element gets --wd (ms) once and CSS
// transitions do the rest, so there is zero JS per frame during the wave. Plays once per page load; if the page starts
// lit (deep link, Calm, a lamp already lit) the final state is shown with no wave.
// Not built (cut order): balcony diyas, birds, rangoli draw (V3 owns it). V3's LIT table is not edited (R11): at rest,
// windows are thinned to 6 evenly spread homes by a runtime class, and the rest wake with the wave.
import { getState } from '../lib/store.js';
import { on, emit } from '../lib/events.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { hush } from './hush.js';
import { registerEffect, isOn } from './budget.js';

const root = () => document.documentElement;
let offs = [], front = null, unreg = null, tm = 0, relHush = null;
const mark = (n) => { try { performance.mark(n); } catch {} };
const OFFSET = { bulb: 0, toran: 100, win: 260 };

function pre() { // tag the elements that will wake, thin the windows
  const wins = [...document.querySelectorAll('#skyline g.win')].filter((g) => !g.classList.contains('visitor'));
  const lit = wins.filter((g) => g.style.opacity === '1').map((g) => ({ g, x: g.getBoundingClientRect().left })).sort((a, b) => a.x - b.x); // lint:ok one-shot read at start/event time
  const keep = new Set(); for (let k = 0; k < 6 && lit.length; k++) keep.add(lit[Math.floor(((k + 0.5) * lit.length) / 6)].g);
  lit.forEach(({ g }) => { if (!keep.has(g)) g.setAttribute('data-wk', 'win'); });
}
function go(origin) {
  const r = root(); if (r.getAttribute('data-wake') !== 'pre') return;
  r.setAttribute('data-wake', 'go'); mark('ek:wake-go');
  const q = isOn('wake') ? getState().quality : 'low', O = origin || lampRegistry.wick(1) || { x: innerWidth / 2, y: innerHeight * 0.6 };
  const dist = (x, y) => Math.hypot(x - O.x, 1.6 * (y - O.y));
  const rmax = Math.max(...[[0, 0], [innerWidth, 0], [0, innerHeight], [innerWidth, innerHeight]].map(([x, y]) => dist(x, y))) || 1;
  const delay = (x, y, cls) => 180 + 3000 * (1 - Math.sqrt(1 - Math.min(1, dist(x, y) / rmax))) + (OFFSET[cls] || 0);
  const set = (el, ms) => el.style.setProperty('--wd', Math.round(ms) + '');
  // string-light bulbs (and their glow)
  document.querySelectorAll('.lights').forEach((L) => L.querySelectorAll('.bulb').forEach((b, i) => { const br = b.getBoundingClientRect(), d = q === 'low' ? 180 + 3000 * (i / 8) : delay(br.left, br.top, 'bulb'); set(b, d); const g = b.previousElementSibling; g && g.classList.contains('bglow') && set(g, d + 60); })); // lint:ok one-shot read at start/event time
  // windows: clusters of three per layer, sorted by x
  document.querySelectorAll('#skyline g.lay').forEach((layer) => {
    const ws = [...layer.querySelectorAll('g.win')].map((g) => ({ g, r: g.getBoundingClientRect() })).sort((a, b) => a.r.left - b.r.left); // lint:ok one-shot read at start/event time
    for (let k = 0; k < ws.length; k += 3) {
      const c = ws.slice(k, k + 3), cx = c.reduce((s, w) => s + w.r.left, 0) / c.length, cy = c.reduce((s, w) => s + w.r.top, 0) / c.length, base = q === 'mid' && k % 6 ? 180 + 1500 : delay(cx, cy, 'win');
      c.forEach((w, i) => set(w.g, q === 'low' ? 180 + 1800 : base + i * 70));
    }
  });
  // toran: outer strands first (distance from the toran's midpoint is the same metric)
  document.querySelectorAll('.toran .gust').forEach((g, i, all) => { const b = g.getBoundingClientRect(); set(g, q === 'low' ? 700 : delay(b.left, b.top, 'toran')); }); // lint:ok one-shot read at start/event time
  // the front
  if (q !== 'low' && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    front = document.createElement('div'); front.className = 'wake-front'; front.setAttribute('aria-hidden', 'true'); front.setAttribute('data-e', '1');
    front.style.cssText = `left:${O.x - 120}px;top:${O.y - 120}px`; document.body.appendChild(front);
    const a = front.animate([{ transform: 'scale(0)', opacity: 0.5, offset: 0 }, { transform: `scale(${(rmax / 120).toFixed(2)})`, opacity: 0, offset: 1 }], { duration: 3180, easing: 'cubic-bezier(.5,1,.89,1)', fill: 'forwards' });
    a.onfinish = () => { front && front.remove(); front = null; };
  }
  relHush = hush(1, 'wake');
  emit('cue:play', { name: 'wake:go', x: O.x, y: O.y });
  tm = setTimeout(end, 4300);
}
function end() {
  const r = root(); r.setAttribute('data-wake', 'done'); mark('ek:wake-end');
  document.querySelectorAll('[data-wk]').forEach((e) => e.removeAttribute('data-wk'));
  document.querySelectorAll('[style*="--wd"]').forEach((e) => e.style.removeProperty('--wd'));
  relHush && relHush(); relHush = null; emit('cue:play', { name: 'wake:end' });
}
export function start() {
  const r = root();
  if (r.getAttribute('data-wake') !== 'pre') { r.setAttribute('data-wake', 'done'); return; }
  const s = getState();
  if (s.litCount > 0 || s.calm || s.ink) { r.setAttribute('data-wake', 'done'); return; }
  pre();
  unreg = registerEffect({ id: 'wake', kind: 'dom', priority: 8, ms: 0.2, });
  offs.push(on('diya:lit', ({ n, x, y }) => { if (r.getAttribute('data-wake') === 'pre') go(x || y ? { x, y } : null); }));
  offs.push(on('diya:allLit', () => { if (r.getAttribute('data-wake') === 'pre') { r.setAttribute('data-wake', 'done'); } }));
  if (/[?&]cue=seek/.test(location.search) || window.__open) window.__wake = { go };
}
export function stop() {
  offs.splice(0).forEach((f) => f()); clearTimeout(tm); unreg && unreg(); unreg = null; front && front.remove(); front = null; relHush && relHush(); relHush = null;
  document.documentElement.setAttribute('data-wake', 'done'); document.querySelectorAll('[data-wk]').forEach((e) => e.removeAttribute('data-wk'));
}
export const name = 'wake';
