// E7.1: pure spring math (no DOM). Semi-implicit Euler in fixed 1/240 s substeps, at most 8 per frame.
export const FEEL = {
  press: [30, 1.0], release: [25, 0.55], thumb: [23, 0.8], sheetClose: [17, 1.0], sheetSnap: [19, 0.8], flip: [13, 0.62], wind: [9.5, 0.45],
  trailHead: [16, 0.9], lean: [14, 0.5], cursorGlow: [16, 0.85], cursorWick: [30, 1.0], magnet: [15.5, 0.7], parallax: [12, 1.0],
  focusFlame: [20, 0.85], menuItem: [22, 0.8], invitePill: [20, 0.55],
};
const H = 1 / 240;
export function makeSpring({ omega = 16, zeta = 1, k, c, m = 1, scale = 1, x = 0, decor = true } = {}) {
  if (k == null) k = m * omega * omega;
  if (c == null) c = 2 * zeta * Math.sqrt(k * m);
  return { x, v: 0, target: x, k, c, m, scale, decor, awake: false };
}
export const settled = (s) => Math.abs(s.x - s.target) < 0.002 * s.scale && Math.abs(s.v) < 0.02 * s.scale;
// advance by dt milliseconds; returns true while still moving
export function stepSpring(s, dtMs) {
  let t = Math.min(dtMs, 100) / 1000, n = 0;
  while (t > 1e-9 && n < 8) {
    const h = Math.min(H, t), a = (-s.k * (s.x - s.target) - s.c * s.v) / s.m;
    s.v += a * h; s.x += s.v * h; t -= h; n++;
  }
  if (settled(s)) { s.x = s.target; s.v = 0; return false; }
  return true;
}
export function tracker() {
  const a = [];
  return {
    push(t, x, y) { a.push({ t, x, y }); if (a.length > 8) a.shift(); },
    clear() { a.length = 0; },
    velocity(now) { // px per ms, least squares over samples younger than 100 ms
      const p = a.filter((s) => now - s.t <= 100); if (p.length < 2) return { x: 0, y: 0 };
      const t0 = p[0].t, mt = p.reduce((q, s) => q + (s.t - t0), 0) / p.length;
      let den = 0, nx = 0, ny = 0; const mx = p.reduce((q, s) => q + s.x, 0) / p.length, my = p.reduce((q, s) => q + s.y, 0) / p.length;
      for (const s of p) { const dt = s.t - t0 - mt; den += dt * dt; nx += dt * (s.x - mx); ny += dt * (s.y - my); }
      return den ? { x: nx / den, y: ny / den } : { x: 0, y: 0 };
    },
  };
}
export const project = (x, v, rate = 0.998) => x + (v * rate) / (1 - rate);
export const rubber = (x, min, max, dim, c = 0.55) => {
  const over = x < min ? x - min : x > max ? x - max : 0; if (!over) return x;
  const b = (1 - 1 / ((Math.abs(over) * c) / dim + 1)) * dim * Math.sign(over);
  return (over < 0 ? min : max) + b;
};
