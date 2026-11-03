// E3.5 / R2: the one hush mechanism. hush(level, key) is reference counted, sets html[data-hush] to the highest active
// level and returns a release function. `fx:foreground {on, id}` is a thin wrapper. Foreground interactions (guess,
// late reply, handoff, price tag, clock) hold hush(1) while the reader is inside one and for 600 ms after.
import { on, emit } from '../lib/events.js';

const held = new Map(); // key -> level
let offs = [], timers = new Map(), fgKeys = new Map();
const apply = () => {
  const lv = Math.max(0, ...held.values());
  const r = document.documentElement;
  if ((r.getAttribute('data-hush') || '0') !== String(lv)) { r.setAttribute('data-hush', String(lv)); emit('cue:play', { name: 'hush', level: lv }); }
};
export function hush(level, key) {
  held.set(key, level); apply();
  return () => { held.delete(key); apply(); };
}
export const level = () => +(document.documentElement.getAttribute('data-hush') || 0);

const SEL = '.device';
let io = null, inside = new Set(), rel = new Map();
function enter(key) { clearTimeout(timers.get(key)); timers.delete(key); if (!rel.has(key)) rel.set(key, hush(1, 'fg:' + key)); }
function leave(key, ms = 600) { clearTimeout(timers.get(key)); timers.set(key, setTimeout(() => { const f = rel.get(key); f && f(); rel.delete(key); }, ms)); }
export function start() {
  document.documentElement.setAttribute('data-hush', '0');
  const down = (e) => { const d = e.target.closest && e.target.closest(SEL); if (d) { d.__k = d.__k || 'dev' + Math.random().toString(36).slice(2, 6); enter(d.__k); d.__act = performance.now(); } };
  const up = () => { document.querySelectorAll(SEL).forEach((d) => { if (d.__k && rel.has(d.__k)) leave(d.__k, 900); }); };
  document.addEventListener('pointerdown', down, true); document.addEventListener('focusin', down, true);
  document.addEventListener('pointerup', up, true); document.addEventListener('focusout', up, true);
  io = new IntersectionObserver((es) => es.forEach((e) => { if (!e.isIntersecting && e.target.__k && rel.has(e.target.__k)) leave(e.target.__k, 0); }), { threshold: 0 });
  document.querySelectorAll(SEL).forEach((d) => io.observe(d));
  offs.push(() => { document.removeEventListener('pointerdown', down, true); document.removeEventListener('focusin', down, true); document.removeEventListener('pointerup', up, true); document.removeEventListener('focusout', up, true); });
  offs.push(on('fx:foreground', ({ on: o, id = 'fg' }) => { if (o) { if (!fgKeys.has(id)) fgKeys.set(id, hush(1, 'fg:' + id)); } else { const f = fgKeys.get(id); f && f(); fgKeys.delete(id); } }));
}
export function stop() {
  offs.splice(0).forEach((f) => f()); io && io.disconnect(); io = null;
  timers.forEach(clearTimeout); timers.clear(); rel.clear(); fgKeys.clear(); held.clear(); document.documentElement.removeAttribute('data-hush');
}
export const name = 'hush';
