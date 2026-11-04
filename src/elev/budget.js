// E8.3: the effect registry. Every elevation effect registers an id, a kind, a shed priority (1 sheds first) and
// optionally onShed/onRestore. shed(id) never cuts: scale(id) eases 1 -> 0 over 600 ms; restore() ramps up over 900 ms
// with a 120 ms ease-in (a wick catching). Effects read scale(id) / isOn(id); the ramp is also written to --fxs-<id>
// on <html> so CSS effects dim without JS. Never registered here: lamp state, the diya flame, text, focus, act END states.
import { ticker } from '../lib/ticker.js';
import { getState, subscribe } from '../lib/store.js';

export const KIND_MS = { canvas: 4, dom: 3, gl: 5 }; // per-frame budgets at 60 fps (reported, enforced by shedding order)
const E = new Map();
let stopRamp = null;
const q5 = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);
const now = () => performance.now();

function sc(e, t = now()) {
  if (!e.dur) return e.to;
  const k = Math.min(1, Math.max(0, (t - e.t0) / e.dur));
  if (k >= 1) return e.to;
  let v = e.to < e.from ? q5(k) : (k < 0.13 ? 0.15 * (k / 0.13) ** 2 : 0.15 + 0.85 * q5((k - 0.13) / 0.87)); // restore: 120 ms of ease-in, then the ramp
  return e.from + (e.to - e.from) * v;
}
function pump() {
  if (stopRamp || typeof document === 'undefined') return;
  stopRamp = ticker.add(() => {
    const t = now(); let busy = false;
    E.forEach((e) => {
      const v = sc(e, t), done = !e.dur || t - e.t0 >= e.dur;
      if (Math.abs(v - e.last) > 0.004 || (done && e.last !== v)) { e.last = v; document.documentElement.style.setProperty('--fxs-' + e.id, v.toFixed(3)); }
      if (!done) busy = true; else if (e.dur) { e.dur = 0; e.from = e.to; }
    });
    if (!busy) { stopRamp(); stopRamp = null; }
  });
}
function ramp(e, to, dur, t = now()) { e.from = sc(e, t); e.to = to; e.t0 = t; e.dur = dur; pump(); }

export function registerEffect({ still = '', id, kind = 'dom', priority = 5, minTier = 'low', ms = 0.3, onShed = null, onRestore = null }) {
  if (!still && typeof console !== 'undefined' && import.meta.env.DEV) console.warn('effect without a still equivalent: ' + id);
  const e = { id, still, kind, priority, minTier, ms, onShed, onRestore, from: 1, to: 1, t0: 0, dur: 0, last: 1, on: true, tierShed: false, pinned: false, restores: 0, restoredAt: 0, shedAt: 0, shedCount: 0, ewma: 0, active: 0, frames: 0 };
  E.set(id, e);
  return () => { E.delete(id); typeof document !== 'undefined' && document.documentElement.style.removeProperty('--fxs-' + id); };
}
export function shed(id, { tier = false, instant = false, t = now() } = {}) {
  const e = E.get(id); if (!e || !e.on) return false;
  e.on = false; e.tierShed = tier; e.shedAt = t; e.shedCount++;
  if (e.restoredAt && t - e.restoredAt < 8000) e.pinned = true; // flap guard: shed again within 8 s of a restore
  ramp(e, 0, instant ? 0 : 600, t); e.onShed && e.onShed(); return true;
}
export function restore(id, { t = now() } = {}) {
  const e = E.get(id); if (!e || e.on || e.pinned || e.restores >= 2) return false;
  e.on = true; e.tierShed = false; e.restores++; e.restoredAt = t;
  ramp(e, 1, 900, t); e.onRestore && e.onRestore(); return true;
}
export const isOn = (id) => { const e = E.get(id); return !e || e.on; };
export const scale = (id) => { const e = E.get(id); return e ? sc(e) : 1; };
export function measure(id, fn) { const e = E.get(id); if (!e) return fn(); const t = now(); const r = fn(); const d = now() - t; e.ewma += 0.1 * (d - e.ewma); e.active++; return r; }
// shed order: lowest priority number first. Tier-shed effects are not restorable by the governor.
export const shedList = () => [...E.values()].filter((e) => e.on).sort((a, b) => a.priority - b.priority).map((e) => e.id);
export const restoreList = () => [...E.values()].filter((e) => !e.on && !e.tierShed && !e.pinned && e.restores < 2).sort((a, b) => b.shedAt - a.shedAt).map((e) => e.id);
export const list = () => [...E.values()];
// tier presets: mid pre-sheds priorities 1-3, low pre-sheds 1-7 (instant, owned by the tier, not the governor)
export function applyTier(tier) {
  const cut = tier === 'low' ? 7 : tier === 'mid' ? 3 : 0;
  E.forEach((e) => { if (e.priority <= cut) shed(e.id, { tier: true, instant: true }); else if (e.tierShed) { e.on = true; e.tierShed = false; ramp(e, 1, 0); e.onRestore && e.onRestore(); } });
}
export const cost = () => [...E.values()].map((e) => ({ id: e.id, kind: e.kind, priority: e.priority, ms: +(e.ewma || e.ms).toFixed(3), active: e.active, scale: +sc(e).toFixed(2), shedCount: e.shedCount, pinned: e.pinned })).sort((a, b) => b.ms - a.ms);
// A ticker subscription that exists only outside Calm, so Calm keeps zero rAF requests (the page is still).
export function tickAwake(fn) {
  let stop = null;
  const sync = () => { const c = getState().calm; if (c && stop) { stop(); stop = null; } else if (!c && !stop) stop = ticker.add(fn); };
  const un = subscribe(sync); sync();
  return () => { un(); stop && stop(); stop = null; };
}
