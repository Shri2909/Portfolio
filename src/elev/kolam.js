// E6.1: rangoli/kolam-inspired generator. Pure functions plus a canvas painter. Geometry only (dots, lenses, scallops).
// Not a traditional or single-loop kolam, and never labelled one. Same seed, same pattern.
import { mulberry32 } from '../lib/rand.js';

export const presetSeeds = [{ seed: 11, folds: 6 }, { seed: 23, folds: 8 }, { seed: 37, folds: 8 }, { seed: 41, folds: 10 }, { seed: 53, folds: 12 }, { seed: 67, folds: 12 }];
const f4 = (v) => +v.toFixed(4);
const pickFolds = (r) => { const t = r() * 10; return t < 1 ? 6 : t < 5 ? 8 : t < 7 ? 10 : 12; };

// a lens (two quadratic curves) centred on (cx,cy) along angle a, length L, half-width hw; returns sampled points and a path
function lens(cx, cy, a, L, hw, kind) {
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const p0 = [cx - ux * L / 2, cy - uy * L / 2], p1 = [cx + ux * L / 2, cy + uy * L / 2];
  const c1 = [cx + nx * hw * 2, cy + ny * hw * 2], c2 = [cx - nx * hw * 2, cy - ny * hw * 2];
  const pts = [], q = (A, C, B, t) => [(1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * C[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * C[1] + t * t * B[1]];
  for (let i = 0; i <= 8; i++) pts.push(q(p0, c1, p1, i / 8));
  for (let i = 1; i <= 8; i++) pts.push(q(p1, c2, p0, i / 8));
  const d = `M${f4(p0[0])} ${f4(p0[1])}Q${f4(c1[0])} ${f4(c1[1])} ${f4(p1[0])} ${f4(p1[1])}Q${f4(c2[0])} ${f4(c2[1])} ${f4(p0[0])} ${f4(p0[1])}Z`;
  return { d, pts, kind, ring: 0 };
}
function scallop(A, B, bulge, kind) {
  const mx = (A[0] + B[0]) / 2, my = (A[1] + B[1]) / 2, dx = B[0] - A[0], dy = B[1] - A[1], l = Math.hypot(dx, dy) || 1, c = [mx - dy / l * bulge, my + dx / l * bulge], pts = [];
  for (let i = 0; i <= 10; i++) { const t = i / 10; pts.push([(1 - t) * (1 - t) * A[0] + 2 * (1 - t) * t * c[0] + t * t * B[0], (1 - t) * (1 - t) * A[1] + 2 * (1 - t) * t * c[1] + t * t * B[1]]); }
  return { d: `M${f4(A[0])} ${f4(A[1])}Q${f4(c[0])} ${f4(c[1])} ${f4(B[0])} ${f4(B[1])}`, pts, kind, ring: 0 };
}
const plen = (p) => { let s = 0; for (let i = 1; i < p.length; i++) s += Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); return s; };

export function makeKolam({ seed = 1, folds, rings } = {}) {
  const r = mulberry32(seed >>> 0 || 1), F = folds || pickFolds(r), R = rings || 3 + Math.floor(r() * 3);
  const dots = [{ x: 0, y: 0, r: 0.02, ring: 0 }], strokes = [], dotAt = [[]];
  const outward = []; for (let k = 1; k <= R; k++) outward[k] = r() < 0.5;
  for (let k = 1; k <= R; k++) {
    const rad = 0.94 * k / R, n = F * (k % 2 ? 1 : 2), off = k % 2 ? 0.5 : 0, arr = [];
    for (let j = 0; j < n; j++) { const th = (j + off) * 2 * Math.PI / n; dots.push({ x: rad * Math.cos(th), y: rad * Math.sin(th), r: 0.012, ring: k }); arr.push({ th, rad, x: rad * Math.cos(th), y: rad * Math.sin(th) }); }
    dotAt[k] = arr;
  }
  for (let k = 1; k <= R; k++) {
    for (const d of dotAt[k]) {
      const a = lens(d.x, d.y, d.th, 0.11, 0.035, 'knot'); a.ring = k; strokes.push(a);
      const b = lens(d.x, d.y, d.th + Math.PI / 2, 0.11, 0.035, 'knot'); b.ring = k; strokes.push(b);
    }
    // scallops from each outer knot tip to the nearest dot's inner tip on the next ring, bulging by seed
    if (k < R) {
      const gap = 0.94 / R, a = dotAt[k], b = dotAt[k + 1];
      for (const d of a) {
        let best = null, bd = 9; for (const e of b) { const dd = Math.abs(((e.th - d.th + 3 * Math.PI) % (2 * Math.PI)) - Math.PI); if (dd < bd) { bd = dd; best = e; } }
        const A = [(d.rad + 0.055) * Math.cos(d.th), (d.rad + 0.055) * Math.sin(d.th)], B = [(best.rad - 0.055) * Math.cos(best.th), (best.rad - 0.055) * Math.sin(best.th)];
        const s = scallop(A, B, (outward[k] ? 1 : -1) * 0.25 * gap, 'scallop'); s.ring = k + 0.5; strokes.push(s);
      }
    }
  }
  strokes.forEach((s) => { s.len = plen(s.pts); });
  return { folds: F, rings: R, seed, dots, strokes, lengths: strokes.map((s) => s.len) };
}

const ease = (t) => 1 - Math.pow(1 - Math.min(1, Math.max(0, t)), 4);
// progress 0..1: dots pop in by ring (first 45%), strokes draw outward in the rest. palette { core, glow, dot }
export function drawKolam(ctx, k, { cx, cy, R, progress = 1, palette = {}, glow = true } = {}) {
  const core = palette.core || '#FFF3DC', gl = palette.glow || 'rgba(255,179,71,1)', dotc = palette.dot || '#FFF3DC';
  ctx.save(); ctx.translate(cx, cy); ctx.scale(R, R);
  const pw = progress;
  for (const d of k.dots) {
    const t = ease((pw - (d.ring / k.rings) * 0.45 * 0.6) / 0.35); if (t <= 0) continue;
    ctx.fillStyle = dotc; ctx.beginPath(); ctx.arc(d.x, d.y, d.r * t, 0, 7); ctx.fill();
  }
  const sp = Math.max(0, (pw - 0.45) / 0.55);
  const maxRing = k.rings + 0.5;
  const passes = glow ? [[0.026, 0.12, gl, 'lighter'], [0.0075, 1, core, 'source-over']] : [[0.0075, 1, core, 'source-over']];
  for (const [w, a, col, op] of passes) {
    ctx.globalCompositeOperation = op; ctx.lineWidth = w; ctx.strokeStyle = col; ctx.globalAlpha = a; ctx.lineCap = 'round';
    for (const s of k.strokes) {
      const t = sp * 1.35 - (s.ring / maxRing) * 0.35; if (t <= 0) continue;
      const P = new Path2D(s.d);
      if (t < 1) { ctx.setLineDash([s.len * t, s.len * 2]); } else ctx.setLineDash([]);
      ctx.stroke(P);
    }
  }
  ctx.restore(); ctx.setLineDash([]); ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
// static, accessible-by-parent SVG for Calm, thumbnails and tests
export function kolamToSVG(k, { stroke = '#FFF3DC', dot = '#FFF3DC', size = 96, label = '' } = {}) {
  const p = k.strokes.map((s) => `<path d="${s.d}"/>`).join(''), d = k.dots.map((x) => `<circle cx="${f4(x.x)}" cy="${f4(x.y)}" r="${x.r}"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-1.05 -1.05 2.1 2.1" width="${size}" height="${size}" ${label ? `role="img" aria-label="${label}"` : 'aria-hidden="true"'}><g fill="none" stroke="${stroke}" stroke-width="0.018" stroke-linecap="round">${p}</g><g fill="${dot}">${d}</g></svg>`;
}
