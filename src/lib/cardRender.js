import { mulberry32 } from './rand.js';

// CardRenderer: one function draws the whole card in a fixed 1080 x 1350 space. Art layer (cached per theme and scale)
// and text layer (redrawn when the words change). The preview (half size) and the export (full size) use the same code,
// so what the visitor sees is exactly what they send. System font stacks only; no web fonts.
export const W = 1080, H = 1350;
const INDIC = '"Noto Serif Devanagari", "Noto Sans Devanagari", "Noto Sans Kannada", "Noto Sans Tamil", "Noto Sans Telugu", "Noto Sans Bengali", "Noto Sans Gujarati", "Noto Sans Gurmukhi", "Noto Sans Malayalam", "Noto Naskh Arabic", "Noto Sans Arabic", "Nirmala UI", "Kohinoor Devanagari", "Kohinoor Kannada", "Kohinoor Tamil", "Kohinoor Telugu", Mukta';
const EMOJI = 'system-ui, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji"';
export const STACK_WISH = `Georgia, "Noto Serif", ${INDIC}, ${EMOJI}, serif`;
export const STACK_UI = `system-ui, "Noto Sans", ${INDIC}, "Apple Color Emoji", "Noto Color Emoji", "Segoe UI Emoji", sans-serif`;

export function makeSeed(c) { // FNV-1a over (to + text + from); never stored, never sent
  let h = 0x811c9dc5; const s = (c.to || '') + (c.text || '') + (c.from || '');
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193) >>> 0; }
  return h >>> 0;
}
const seg = (s, g) => (typeof Intl !== 'undefined' && Intl.Segmenter ? Array.from(new Intl.Segmenter(undefined, { granularity: g }).segment(s), (x) => x.segment) : g === 'word' ? s.split(/(\s+)/).filter(Boolean) : Array.from(s));
const graphemes = (s) => seg(s, 'grapheme');
export const countGraphemes = (s) => graphemes(s || '').length;
export const cutGraphemes = (s, n) => graphemes(s || '').slice(0, n).join('');

const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };
const lens = (ctx, len, w) => { ctx.beginPath(); ctx.moveTo(0, 0); ctx.quadraticCurveTo(w, -len / 2, 0, -len); ctx.quadraticCurveTo(-w, -len / 2, 0, 0); ctx.closePath(); };
const sparkle = (ctx, x, y, s, a, col = '#FFD27A') => { ctx.globalAlpha = a; ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y - s); ctx.lineTo(x + s * .25, y - s * .25); ctx.lineTo(x + s, y); ctx.lineTo(x + s * .25, y + s * .25); ctx.lineTo(x, y + s); ctx.lineTo(x - s * .25, y + s * .25); ctx.lineTo(x - s, y); ctx.lineTo(x - s * .25, y - s * .25); ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1; };
const glow = (ctx, x, y, r, rgb, a, lean) => { // radial gradient (no shadowBlur). Lean mode: 8 flat concentric circles.
  if (lean) { for (let i = 8; i >= 1; i--) { ctx.fillStyle = `rgba(${rgb},${(a / 8).toFixed(3)})`; ctx.beginPath(); ctx.arc(x, y, r * i / 8, 0, 7); ctx.fill(); } return; }
  const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`); ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
};
const hx = (c) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const vgrad = (ctx, stops, lean) => {
  if (lean) { // lean redraw: 24 flat bands compress far better than a smooth gradient
    const N = 24; for (let i = 0; i < N; i++) { const t = (i + .5) / N; let k = 0; while (k < stops.length - 2 && t > stops[k + 1][0]) k++; const [a, ca] = stops[k], [b, cb] = stops[k + 1], u = Math.max(0, Math.min(1, (t - a) / (b - a))), A = hx(ca), B = hx(cb); ctx.fillStyle = `rgb(${A.map((v, j) => Math.round(v + (B[j] - v) * u)).join(',')})`; ctx.fillRect(0, i * H / N, W, H / N + 1); }
    return;
  }
  const g = ctx.createLinearGradient(0, 0, 0, H); stops.forEach(([o, c]) => g.addColorStop(o, c)); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); };

function artDiya(ctx, rnd, lean) {
  vgrad(ctx, [[0, '#F9E3B4'], [.55, '#F2C97E'], [1, '#E6A650']], lean);
  ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(194,65,12,.85)'; rr(ctx, 36, 36, W - 72, H - 72, 28); ctx.stroke();
  ctx.lineWidth = 2; ctx.strokeStyle = 'rgba(194,65,12,.45)'; rr(ctx, 52, 52, W - 104, H - 104, 22); ctx.stroke();
  const cy = 285; // nudged down from the brief's 235 so the flame clears the header
  glow(ctx, 540, cy - 40, 220, '255,210,122', .55, lean);
  ctx.fillStyle = '#C2410C'; ctx.beginPath(); ctx.ellipse(540, cy, 100, 62, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = '#A33A0A'; ctx.beginPath(); ctx.ellipse(540, cy, 100, 14, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#6B2A06'; ctx.beginPath(); ctx.ellipse(540, cy, 84, 9, 0, 0, 7); ctx.fill();
  ctx.fillStyle = '#FFF3DC'; ctx.fillRect(538, cy - 14, 4, 14);
  const fg = ctx.createLinearGradient(0, cy - 13, 0, cy - 123); fg.addColorStop(0, '#FFB347'); fg.addColorStop(1, '#FFD27A');
  ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(540, cy - 13); ctx.bezierCurveTo(540 - 27, cy - 35, 540 - 30, cy - 85, 540, cy - 123); ctx.bezierCurveTo(540 + 30, cy - 85, 540 + 27, cy - 35, 540, cy - 13); ctx.fill();
  ctx.fillStyle = '#FFF3DC'; ctx.beginPath(); ctx.ellipse(540, cy - 40, 9, 20, 0, 0, 7); ctx.fill();
}
function artInk(ctx) { ctx.fillStyle = '#FFFBF2'; ctx.fillRect(0, 0, W, H); ctx.fillStyle = '#16110C'; ctx.fillRect(120, 169, 840, 2); ctx.fillRect(120, 1169, 840, 2); }
function artRangoli(ctx, rnd) {
  ctx.fillStyle = '#FFF3DC'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = 'rgba(194,65,12,.55)';
  const pts = []; for (let x = 60; x <= W - 60; x += 54) { pts.push([x, 60], [x, H - 60]); } for (let y = 114; y <= H - 114; y += 54) pts.push([60, y], [W - 60, y]);
  for (const [x, y] of pts) { if (y < 120 && Math.abs(x - 540) < 230) continue; ctx.beginPath(); ctx.arc(x, y, 5, 0, 7); ctx.fill(); }
  ctx.save(); ctx.translate(540, 262); ctx.scale(.9, .9);
  ctx.strokeStyle = '#C2410C'; ctx.lineWidth = 6; ctx.beginPath(); ctx.arc(0, 0, 112, 0, 7); ctx.stroke();
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate((22.5 + i * 45) * Math.PI / 180); lens(ctx, 70, 26); ctx.fillStyle = '#2F6B4F'; ctx.fill(); ctx.restore(); }
  for (let i = 0; i < 8; i++) { ctx.save(); ctx.rotate(i * 45 * Math.PI / 180); lens(ctx, 104, 44); ctx.fillStyle = rnd() < .35 ? '#E8890C' : '#F5A623'; ctx.fill(); ctx.strokeStyle = '#C2410C'; ctx.lineWidth = 3; ctx.stroke(); ctx.restore(); }
  ctx.fillStyle = '#C2410C'; ctx.beginPath(); ctx.arc(0, 0, 22, 0, 7); ctx.fill(); ctx.fillStyle = '#FFF3DC'; ctx.beginPath(); ctx.arc(0, 0, 10, 0, 7); ctx.fill();
  ctx.fillStyle = '#2F6B4F'; for (let i = 0; i < 16; i++) { const a = i * Math.PI / 8; ctx.beginPath(); ctx.arc(138 * Math.cos(a), 138 * Math.sin(a), 5, 0, 7); ctx.fill(); }
  ctx.restore();
  const order = Array.from({ length: 15 }, (_, i) => i); if (rnd() > .5) order.reverse();
  order.forEach((k, i) => { const x = 105 + i * 62; ctx.fillStyle = k % 2 ? '#F5A623' : '#C2410C'; ctx.beginPath(); ctx.moveTo(x, 1296 - 15); ctx.lineTo(x + 15, 1296); ctx.lineTo(x, 1296 + 15); ctx.lineTo(x - 15, 1296); ctx.fill(); });
}
function artToran(ctx, rnd, lean) {
  vgrad(ctx, [[0, '#10231A'], [1, '#0C1A13']], lean);
  for (let s = 0; s < 3; s++) {
    const x0 = s * 360, x1 = x0 + 360, mx = x0 + 180, q = (t) => ({ x: (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * mx + t * t * x1, y: (1 - t) * (1 - t) * 70 + 2 * (1 - t) * t * 250 + t * t * 70 });
    ctx.strokeStyle = '#CDB894'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(x0, 70); ctx.quadraticCurveTo(mx, 250, x1, 70); ctx.stroke();
    for (let i = 0; i < 7; i++) {
      const p = q((i + .5) / 7);
      ctx.fillStyle = '#2F6B4F'; ctx.beginPath(); ctx.moveTo(p.x, p.y + 12); ctx.quadraticCurveTo(p.x + 30, p.y + 50, p.x, p.y + 82); ctx.quadraticCurveTo(p.x - 30, p.y + 50, p.x, p.y + 12); ctx.fill(); ctx.strokeStyle = '#1F4A36'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(p.x, p.y + 14); ctx.lineTo(p.x, p.y + 80); ctx.stroke();
    }
    for (let i = 0; i < 7; i++) { const p = q((i + .5) / 7); for (let k = 0; k < 10; k++) { const a = k * Math.PI / 5; ctx.fillStyle = k % 2 ? '#FFB347' : '#F5A623'; ctx.beginPath(); ctx.arc(p.x + 22 * Math.cos(a), p.y + 22 * Math.sin(a), 14, 0, 7); ctx.fill(); } ctx.fillStyle = rnd() < .3 ? '#E8890C' : '#C2410C'; ctx.beginPath(); ctx.arc(p.x, p.y, 16, 0, 7); ctx.fill(); }
  }
}
function artPhul(ctx, rnd, lean) {
  vgrad(ctx, [[0, '#0E0B14'], [1, '#1A1226']], lean);
  const burst = (cx, cy, R, n) => {
    ctx.strokeStyle = '#8A7A66'; ctx.lineWidth = 6; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(cx - 60, cy + 120); ctx.stroke();
    glow(ctx, cx, cy, 44, '255,243,220', .9, lean);
    const nn = lean ? n / 2 : n;
    for (let i = 0; i < nn; i++) {
      const a = (i / nn) * Math.PI * 2 + (rnd() - .5) * .08, len = R * (.35 + rnd() * .65), x = cx + len * Math.cos(a), y = cy + len * Math.sin(a);
      const g = ctx.createLinearGradient(cx, cy, x, y); g.addColorStop(0, 'rgba(255,243,220,.9)'); g.addColorStop(1, 'rgba(255,179,71,.3)');
      ctx.strokeStyle = g; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(x, y); ctx.stroke(); ctx.fillStyle = '#FFD27A'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 7); ctx.fill();
    }
  };
  burst(230, 250, 170, 72); burst(840, 190, 140, 72); burst(960, 330, 70, 36);
  if (!lean) for (let i = 0; i < 40; i++) { let x, y, t = 0; do { x = rnd() * W; y = rnd() * H; t++; } while (!(x < 70 || x > 1010 || y > 1240) && t < 40); if (x < 70 || x > 1010 || y > 1240) sparkle(ctx, x, y, 6 + rnd() * 8, .4 + rnd() * .5); }
}
function artKandil(ctx, rnd, lean) {
  vgrad(ctx, [[0, '#0F1530'], [.7, '#2A1A3F'], [1, '#4A2438']], lean);
  ctx.strokeStyle = '#CDB894'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(540, 0); ctx.lineTo(540, 130); ctx.stroke();
  glow(ctx, 540, 260, 200, '255,210,122', .5, lean);
  const pts = Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI / 8 - Math.PI / 2, r = i % 2 ? 62 : 130; return [540 + r * Math.cos(a), 260 + r * Math.sin(a)]; });
  for (let i = 0; i < 16; i += 2) { const a = pts[i], l = pts[(i + 15) % 16], r = pts[(i + 1) % 16]; ctx.fillStyle = '#FFB347'; ctx.beginPath(); ctx.moveTo(540, 260); ctx.lineTo(l[0], l[1]); ctx.lineTo(a[0], a[1]); ctx.fill(); ctx.fillStyle = '#E8890C'; ctx.beginPath(); ctx.moveTo(540, 260); ctx.lineTo(a[0], a[1]); ctx.lineTo(r[0], r[1]); ctx.fill(); }
  ctx.globalAlpha = .9; ctx.fillStyle = '#FFF3DC'; ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4 + Math.PI / 8; ctx.lineTo(540 + 48 * Math.cos(a), 260 + 48 * Math.sin(a)); } ctx.closePath(); ctx.fill(); ctx.globalAlpha = 1;
  ctx.strokeStyle = '#F5A623'; ctx.lineWidth = 3; [520, 540, 560].forEach((x) => { ctx.beginPath(); ctx.moveTo(x, 392); ctx.lineTo(x, 442); ctx.stroke(); });
  if (!lean) for (let i = 0; i < 24; i++) { const x = rnd() < .5 ? rnd() * 380 : 700 + rnd() * 380, y = rnd() * 300; sparkle(ctx, x, y, 6 + rnd() * 8, .5 + rnd() * .4); }
}

export const THEMES = [
  { id: 'diya', ground: '#F2C97E', ink: '#3A1E0C', names: '#3A1E0C', foot: '#5A3414', textTop: 450, headerY: 130, art: artDiya },
  { id: 'rangoli', ground: '#FFF3DC', ink: '#16110C', names: '#16110C', foot: '#7C2D0A', textTop: 470, headerY: 130, art: artRangoli },
  { id: 'toran', ground: '#10231A', ink: '#FFF3DC', names: '#FFD27A', foot: '#E8D5B0', textTop: 430, headerY: 50, art: artToran },
  { id: 'phuljhadi', ground: '#0E0B14', ink: '#FFF3DC', names: '#FFD27A', foot: '#E8D5B0', textTop: 420, headerY: 130, art: artPhul },
  { id: 'kandil', ground: '#0F1530', ink: '#FFF3DC', names: '#FFD27A', foot: '#E8D5B0', textTop: 520, headerY: 70, art: artKandil },
  { id: 'ink', ground: '#FFFBF2', ink: '#16110C', names: '#16110C', foot: '#4A3F33', textTop: 250, headerY: 130, art: artInk },
];
export const themeById = (id) => THEMES.find((t) => t.id === id) || THEMES[0];

export function drawArt(ctx, theme, seed, lean = false) { theme.art(ctx, mulberry32(seed || 1), lean); }

// ---------- text ----------
const RTL_RANGES = [[0x590, 0x8ff], [0xfb1d, 0xfdff], [0xfe70, 0xfeff]];
export function isRtl(s) { const m = /\p{L}/u.exec(s || ''); if (!m) return false; const c = m[0].codePointAt(0); return RTL_RANGES.some(([a, b]) => c >= a && c <= b); }
function wrap(ctx, text, maxW) {
  const out = [];
  let paras = String(text).replace(/\r/g, '').split('\n'); const joined = paras.join('\n').replace(/\n{3,}/g, '\n\n'); paras = joined.split('\n').slice(0, 8 + 7);
  for (const p of paras) {
    if (!p.trim()) { out.push(''); continue; }
    let line = '';
    for (const sg of seg(p, 'word')) {
      if (ctx.measureText(line + sg).width <= maxW) { line += sg; continue; }
      if (line.trim()) { out.push(line.replace(/\s+$/, '')); line = ''; }
      if (/^\s+$/.test(sg)) continue;
      if (ctx.measureText(sg).width <= maxW) { line = sg; continue; }
      for (const gph of graphemes(sg)) { if (ctx.measureText(line + gph).width > maxW && line) { out.push(line); line = ''; } line += gph; } // a very long word: break between graphemes
    }
    out.push(line.replace(/\s+$/, ''));
  }
  return out;
}
function fit(ctx, text, boxW, boxH, g, rtl) {
  let size = g <= 24 ? 112 : g <= 60 ? 88 : g <= 140 ? 68 : g <= 260 ? 54 : 46;
  const lh = /[؀-ۿऀ-๿]/.test(text) ? 1.5 : 1.32;
  for (;;) {
    ctx.font = `${size}px ${STACK_WISH}`;
    const lines = wrap(ctx, text, boxW);
    if (lines.length * size * lh <= boxH || size <= 30) return { size, lines, lh };
    size -= 2;
  }
}
const setSpacing = (ctx, px) => { if ('letterSpacing' in ctx) ctx.letterSpacing = px + 'px'; };
// content: { to, text, from, footerLine, tag, toLine, fromLine }  (strings already templated from copy.json)
export function drawText(ctx, theme, c) {
  const hasTo = !!(c.to || '').trim(), hasFrom = !!(c.from || '').trim(), t = (c.text || '').trim();
  ctx.save(); ctx.textBaseline = 'alphabetic';
  setSpacing(ctx, 8); ctx.font = `bold 34px ${STACK_UI}`; ctx.fillStyle = theme.names; ctx.textAlign = 'center'; ctx.direction = 'ltr';
  if (!('letterSpacing' in ctx)) ctx.font = `bold 32px ${STACK_UI}`;
  ctx.fillText(c.brand, 540, theme.headerY); setSpacing(ctx, 0);
  const rtlW = isRtl(t), dirOf = (s) => (isRtl(s) ? 'rtl' : 'ltr');
  const top = theme.textTop;
  if (hasTo) { ctx.font = `42px ${STACK_UI}`; ctx.fillStyle = theme.names; ctx.textAlign = 'center'; ctx.direction = dirOf(c.to); let f = 42; while (ctx.measureText(c.toLine).width > 840 && f > 24) { f -= 2; ctx.font = `${f}px ${STACK_UI}`; } ctx.fillText(c.toLine, 540, top); }
  const boxTop = hasTo ? top + 40 : top - 20, boxBot = hasFrom ? 1060 : 1130, boxH = boxBot - boxTop;
  if (t) {
    const g = countGraphemes(t), q = '“' + t + '”', fx = fit(ctx, q, 840, boxH, g, rtlW);
    ctx.font = `${fx.size}px ${STACK_WISH}`; ctx.fillStyle = theme.ink; ctx.direction = rtlW ? 'rtl' : 'ltr';
    const center = g <= 140 || fx.lines.length <= 3; ctx.textAlign = center ? 'center' : (rtlW ? 'right' : 'left');
    const x = center ? 540 : (rtlW ? 960 : 120), blockH = fx.lines.length * fx.size * fx.lh;
    let y = boxTop + (boxH - blockH) / 2 + fx.size * fx.lh * 0.78;
    for (const ln of fx.lines) { ctx.fillText(ln, x, y); y += fx.size * fx.lh; }
  }
  if (hasFrom) { ctx.font = `italic 46px ${STACK_UI}`; ctx.fillStyle = theme.names; const r = isRtl(c.from); ctx.direction = r ? 'rtl' : 'ltr'; ctx.textAlign = r ? 'left' : 'right'; ctx.fillText(c.fromLine, r ? 120 : 960, 1120); }
  ctx.direction = 'ltr'; ctx.textAlign = 'center'; ctx.fillStyle = theme.foot;
  let fs = 30; ctx.font = `${fs}px ${STACK_UI}`; while (ctx.measureText(c.footerLine).width > 840 && fs > 24) { fs -= 1; ctx.font = `${fs}px ${STACK_UI}`; }
  ctx.fillText(c.footerLine, 540, 1215);
  ctx.font = `italic 30px ${STACK_UI}`; ctx.fillText(c.tag, 540, 1268);
  ctx.restore();
}
export function renderCard({ canvas, themeId, content, scale, layers = 'both', lean = false, seed }) {
  const ctx = canvas.getContext('2d'), theme = themeById(themeId), s = seed != null ? seed : makeSeed(content);
  ctx.setTransform(scale, 0, 0, scale, 0, 0); ctx.clearRect(0, 0, W, H);
  if (layers !== 'text') drawArt(ctx, theme, s, lean);
  if (layers !== 'art') drawText(ctx, theme, content);
}
