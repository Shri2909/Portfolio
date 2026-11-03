// E7.1: spring kit bound to the shared ticker. A spring is awake (subscribed) only while it moves.
import { ticker } from '../lib/ticker.js';
import { getState } from '../lib/store.js';
import { makeSpring, stepSpring, FEEL } from './physicsCore.js';
export { FEEL, tracker, project, rubber } from './physicsCore.js';

const awake = new Set();
let off = null;
const pump = () => {
  if (off) return;
  off = ticker.add((dt) => {
    awake.forEach((s) => {
      if (!stepSpring(s.s, dt)) awake.delete(s);
      s.cb && s.cb(s.s.x, s.s.v);
    });
    if (!awake.size) { off(); off = null; }
  });
};
const mode = () => { const st = getState(); return { calm: st.calm, low: st.quality === 'low', mid: st.quality === 'mid' }; };
// spring(FEEL.press, {scale, x, decor}) -> { to, set, kick, onUpdate, destroy, get x }
export function spring(preset, opts = {}) {
  const [omega, zeta] = Array.isArray(preset) ? preset : [16, 1];
  const s = makeSpring({ omega, zeta, ...opts });
  const h = { s, cb: null };
  const prep = () => {
    const m = mode();
    if (m.low) { s.c = 2 * Math.sqrt(s.k * s.m); } // zeta 1: no ringing
    if (m.calm) { if (s.decor) return 'snap'; const k = s.m * 40 * 40; s.k = k; s.c = 2 * Math.sqrt(k * s.m); }
    if (m.mid && s.decor && awake.size > 6 && !awake.has(h)) return 'snap';
    return 'run';
  };
  const api = {
    get x() { return s.x; }, get v() { return s.v; },
    to(t, v0) { s.target = t; if (v0 != null) s.v = v0; if (prep() === 'snap') { s.x = t; s.v = 0; h.cb && h.cb(s.x, 0); return api; } awake.add(h); pump(); return api; },
    set(x) { s.x = s.target = x; s.v = 0; awake.delete(h); h.cb && h.cb(x, 0); return api; },
    kick(dv) { s.v += dv; awake.add(h); pump(); return api; },
    onUpdate(fn) { h.cb = fn; return api; },
    destroy() { awake.delete(h); h.cb = null; },
  };
  return api;
}
export function spring2(preset, opts = {}) {
  const a = spring(preset, opts), b = spring(preset, opts);
  return { x: a, y: b, to(x, y) { a.to(x); b.to(y); }, set(x, y) { a.set(x); b.set(y); }, onUpdate(fn) { const f = () => fn(a.x, b.x); a.onUpdate(f); b.onUpdate(f); }, destroy() { a.destroy(); b.destroy(); } };
}
export const awakeCount = () => awake.size;
