// E4.8: flash guard, act energy caps and auto-exposure. Accessibility beats spectacle: when in doubt, lower exposure.
import { getState } from '../lib/store.js';
import { on } from '../lib/events.js';

// act -> { cap: mean lightmap coverage-luminance, emit: simultaneous emitters, bloom, parts }
export const ACT_CAP = {
  doorstep: { cap: 0.10, emit: 3, bloom: 0.45, parts: 120 }, baithak: { cap: 0.14, emit: 3, bloom: 0.40, parts: 60 },
  chhat: { cap: 0.16, emit: 5, bloom: 0.55, parts: 300 }, awaaz: { cap: 0.08, emit: 2, bloom: 0.30, parts: 40 },
  aakhri: { cap: 0.06, emit: 1, bloom: 0.25, parts: 40 }, vidaai: { cap: 0.22, emit: 6, bloom: 0.90, parts: 520 },
};
export const energy = { exposure: 1, bias: 1, act: 'doorstep', boost: false, meanLum: 0, listeners: new Set(), flashes: [], flashCount: 0, refused: 0 };
const notify = () => energy.listeners.forEach((f) => f());

// token bucket: at most 2 per rolling second, 400 ms apart, at most 3 in any 3 s (WCAG 2.3.1 is 3 per second)
export const flash = {
  request(amp = 0.3) {
    const now = performance.now(), L = energy.flashes;
    while (L.length && now - L[0] > 3000) L.shift();
    const lastS = L.filter((t) => now - t < 1000).length, gap = L.length ? now - L[L.length - 1] : 9999;
    if (amp > 0.4 || lastS >= 2 || gap < 400 || L.length >= 3) { energy.refused++; return false; }
    L.push(now); energy.flashCount++; return true;
  },
};
export const setBias = (v) => { energy.bias = v; apply(); };
export function capNow() { const a = ACT_CAP[energy.act] || ACT_CAP.doorstep; const c = energy.act === 'chhat' ? a.cap + 0.06 * (getState().litCount / 5) : a.cap; return energy.boost ? Math.max(c, 0.30) : c; }
let target = 1;
function apply() { const e = Math.max(0.55, Math.min(1, target)) * energy.bias; if (Math.abs(e - energy.exposure) > 0.004) { energy.exposure = e; notify(); } }
// called by the lightmap after each draw with the measured mean (0..1)
export function measured(m) {
  energy.meanLum = m; const cap = capNow();
  if (m > cap + 0.02) target = Math.max(0.55, target * 0.92); else if (m < cap * 0.85) target = Math.min(1, target + 0.04);
  apply();
}
let offs = [];
export const start = () => { offs = [on('stage:act', ({ id }) => { if (ACT_CAP[id]) { energy.act = id; } })]; };
export const stop = () => { offs.forEach((f) => f()); offs = []; energy.exposure = 1; energy.bias = 1; target = 1; energy.listeners.clear(); };
