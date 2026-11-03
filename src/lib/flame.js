import { ticker } from './ticker.js';
import { getState, subscribe } from './store.js';
import { emit, on } from './events.js';

// FlameEngine: one shared loop for every flame. Stops when the tab is hidden, when a flame is off screen,
// and when Calm is on. Quality tier decides how it is drawn: high = noise-driven control points,
// mid = transforms only, low = CSS flicker (the loop is not used).
const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };
const smooth = (t) => t * t * (3 - 2 * t);
export const noise = (x) => { const i = Math.floor(x), f = x - i; return hash(i) + (hash(i + 1) - hash(i)) * smooth(f); }; // 0..1, smooth, never loops visibly

// Personalities (atmosphere only, no claims)
export const PERSONALITY = {
  0: { rate: 0.5, amp: 0.05, glow: 1.25, h: 1.0 },          // home flame: calmest, largest glow
  1: { rate: 0.6, amp: 0.07, glow: 1, h: 1.0 },             // steady, slow breath
  2: { rate: 0.8, amp: 0.07, glow: 1, h: 1.0, pulse: 1.2 }, // small regular pulse about every 1.2 s
  3: { rate: 1.6, amp: 0.1, glow: 1, h: 1.0, twitch: true }, // quick twitch, then settles
  4: { rate: 0.7, amp: 0.06, glow: 1, h: 1.0, hiccup: [7, 9] }, // lean-and-return every 7 to 9 s (never dims)
  5: { rate: 0.55, amp: 0.06, glow: 1, h: 1.12 },           // slow, slightly taller
  6: { rate: 2.2, amp: 0.12, glow: 0.8, h: 0.33 },          // the honest lamp
};

const flames = new Map(); // id -> record
let wind = 0, windT = 0, breathT0 = -1, stopLoop = null, t = 0;
const BREATH_MS = 600, BLEND_MS = 1000;

const drop = (w, h, sway, tipx) =>
  `M0 0C${(-w).toFixed(2)} ${(-h * 0.18).toFixed(2)} ${(-w * 0.95 + sway).toFixed(2)} ${(-h * 0.62).toFixed(2)} ${tipx.toFixed(2)} ${(-h).toFixed(2)}C${(w * 0.95 + sway).toFixed(2)} ${(-h * 0.62).toFixed(2)} ${w.toFixed(2)} ${(-h * 0.18).toFixed(2)} 0 0Z`;

function frame(dt, now) {
  const st = getState();
  if (st.calm) return;
  t = now;
  wind *= Math.pow(0.5, dt / 700); // half-life about 700 ms
  const br = breathT0 >= 0 ? now - breathT0 : -1;
  let breath = 0, blend = 1;
  if (br >= 0 && br < BREATH_MS) { breath = Math.sin((br / BREATH_MS) * Math.PI); blend = 0; }
  else if (br >= BREATH_MS && br < BREATH_MS + BLEND_MS) blend = (br - BREATH_MS) / BLEND_MS;
  else breathT0 = -1;
  for (const f of flames.values()) {
    if (!f.visible || !f.el) continue;
    const P = f.p, ts = now / 1000 * P.rate, ph = f.seed;
    let s = 1 + (noise(ts + ph) - 0.5) * 2 * P.amp * blend;
    if (P.pulse) s += 0.05 * Math.pow(Math.max(0, Math.sin((now / 1000 / P.pulse) * Math.PI * 2)), 4) * blend;
    if (P.twitch) s += Math.max(0, 0.12 - ((now % 3200) / 1000) * 0.06) * (noise(ts * 3 + ph) > 0.55 ? 1 : 0) * blend;
    let lean = (noise(ts * 0.8 + ph + 40) - 0.5) * 5 * blend;
    if (P.hiccup) { const per = (P.hiccup[0] + P.hiccup[1]) / 2 * 1000, k = (now + f.seed * 1000) % per; if (k < 900) lean += Math.sin((k / 900) * Math.PI) * 9; }
    s = s * (1 + 0.14 * breath);
    f.lc += (f.leanExtra - f.lc) * 0.12; f.gc += (f.glowBoost - f.gc) * 0.12;
    lean += wind * 20;
    const sc = Math.max(0.8, s) * f.scale;
    if (st.quality === 'high' && f.outer) {
      const h = 72 * P.h, w = 11, sw = (noise(ts * 1.3 + ph + 10) - 0.5) * 7;
      f.outer.setAttribute('d', drop(w, h, sw, sw * 1.2 + lean * 0.2));
      f.mid.setAttribute('d', drop(w * 0.7, h * 0.72, sw * 0.8, sw * 0.9 + lean * 0.15));
      f.core.setAttribute('d', drop(w * 0.38, h * 0.38, sw * 0.4, sw * 0.4));
    }
    f.el.style.transform = `translate(-50%,-100%) rotate(${(lean + f.lc).toFixed(2)}deg) scale(${sc.toFixed(3)})`;
    if (f.glow) f.glow.style.transform = `translate(-50%,-62%) scale(${((1 + 0.5 * breath) * f.gc * P.glow * (0.97 + 0.06 * noise(ts + ph + 7)) ).toFixed(3)})`;
  }
}
const ensure = () => {
  const run = !getState().calm && getState().quality !== 'low' && [...flames.values()].some((f) => f.visible);
  if (run && !stopLoop) stopLoop = ticker.add(frame);
  else if (!run && stopLoop) { stopLoop(); stopLoop = null; }
};
const io = typeof IntersectionObserver !== 'undefined' ? new IntersectionObserver((es) => {
  es.forEach((e) => { for (const f of flames.values()) if (f.el === e.target) f.visible = e.isIntersecting; });
  ensure();
}) : null;

export const engine = {
  register(id, rec) {
    const f = { id, seed: id * 13.37 + 1, p: PERSONALITY[id] || PERSONALITY[1], visible: true, scale: 1, leanExtra: 0, glowBoost: 1, lc: 0, gc: 1, ...rec };
    flames.set(id, f); io && f.el && io.observe(f.el); ensure();
    return () => { flames.delete(id); io && f.el && io.unobserve(f.el); ensure(); };
  },
  set(id, patch) { const f = flames.get(id); if (f) Object.assign(f, patch); },
  breathe() { if (!getState().calm) { breathT0 = performance.now(); } },
  wind(v) { if (!getState().calm) wind = Math.max(-1, Math.min(1, wind + v)); },
  refresh: ensure,
};
// Re-evaluate when Calm or the quality tier changes, and reset flames to a steady shape in Calm.
on('fx:setQuality', () => ensure());
subscribe(() => { ensure(); if (getState().calm) for (const f of flames.values()) { if (f.el) f.el.style.transform = ''; if (f.glow) f.glow.style.transform = ''; } });
