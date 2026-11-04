// E6.3 (lean) + E6.8: the card studio. Fills hooks.card so the SAME renderCard draws the preview and the PNG:
// layered paper (plate, offset shadow, fibre), embossed hairlines, a warm light from the diya, an upgraded Ink card,
// the visitor's rangoli as the rangoli card's medallion, and per-script line rhythm. A live flame canvas runs over the
// preview art (30 fps high, 20 mid, none on low/Calm). The export draws the same layers at a fixed phase.
import { hooks } from '../lib/events.js';
import { getState, subscribe } from '../lib/store.js';
import { mulberry32 } from '../lib/rand.js';
import { ticker } from '../lib/ticker.js';
import { W, H } from '../lib/cardRender.js';
import { palette } from './palette.js';
import { metricsFor } from './script.js';
import { makeKolam, drawKolam } from './kolam.js';
import { registerEffect, isOn } from './budget.js';
import { draft } from './draft.js';

const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255); return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2]; };
export const FOCUS = { diya: [540, 245], rangoli: [540, 262], kandil: [540, 260] };
let tile = null;
function fibre() { // one procedural 128 px tile, quantised to 4 levels so the PNG stays compact
  if (tile) return tile;
  const c = document.createElement('canvas'); c.width = c.height = 128; const x = c.getContext('2d'), im = x.createImageData(128, 128), r = mulberry32(99);
  for (let i = 0; i < im.data.length; i += 4) { const v = [0, 85, 170, 255][Math.floor(r() * 4)]; im.data[i] = im.data[i + 1] = im.data[i + 2] = v; im.data[i + 3] = 255; }
  x.putImageData(im, 0, 0); tile = c.getContext('2d').createPattern(c, 'repeat'); tile.__c = c; return tile;
}
const rr = (ctx, x, y, w, h, r) => { ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath(); };

function inkCard(ctx, lean) { // white paper, three grey sheets, one embossed hairline frame, a grey diya with a cream flame
  const p = palette(true);
  ctx.fillStyle = '#EDEAE4'; ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = '#F6F3EE'; rr(ctx, 30, 30, W - 60, H - 60, 30); ctx.fill();
  ctx.fillStyle = p.paper; rr(ctx, 54, 54, W - 108, H - 108, 24); ctx.fill();
  ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,.9)'; rr(ctx, 79, 79, W - 160, H - 160, 20); ctx.stroke();
  ctx.strokeStyle = 'rgba(22,17,12,.35)'; rr(ctx, 81.5, 81.5, W - 160, H - 160, 20); ctx.stroke();
  ctx.fillStyle = '#16110C'; ctx.fillRect(120, 169, 840, 2); ctx.fillRect(120, 1169, 840, 2);
  // the grey diya shape with an embossed edge
  const cy = 120, g = ctx.createLinearGradient(0, cy, 0, cy + 60); g.addColorStop(0, '#9A948A'); g.addColorStop(1, '#6C665D');
  ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(540, cy, 46, 28, 0, 0, Math.PI); ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,.7)'; ctx.fillRect(500, cy - 2, 80, 2);
  ctx.fillStyle = '#FFF3DC'; ctx.strokeStyle = '#8A8378'; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(540, cy - 4); ctx.bezierCurveTo(528, cy - 16, 528, cy - 34, 540, cy - 48); ctx.bezierCurveTo(552, cy - 34, 552, cy - 16, 540, cy - 4); ctx.fill(); ctx.stroke();
}
function paper(ctx, theme, lean) { // the front plate behind the words, with a flat offset shadow
  const dark = lum(theme.ground) < 0.35, top = Math.max(theme.textTop - 90, 170), bot = 1160;
  ctx.fillStyle = dark ? 'rgba(0,0,0,.28)' : 'rgba(60,30,10,.16)'; rr(ctx, 92, top + 7, W - 184, bot - top, 36); ctx.fill();
  ctx.fillStyle = dark ? 'rgba(10,8,6,.34)' : 'rgba(255,251,242,.5)'; rr(ctx, 90, top, W - 180, bot - top, 36); ctx.fill();
  ctx.lineWidth = 2; ctx.strokeStyle = dark ? 'rgba(255,243,220,.16)' : 'rgba(255,255,255,.7)'; rr(ctx, 91, top + 1, W - 182, bot - top - 2, 35); ctx.stroke();
}
function emboss(ctx, theme) { // a hairline frame lit from the flame's side: cream highlight up-left, umber shadow down-right
  const dark = lum(theme.ground) < 0.35;
  ctx.lineWidth = 2.5; ctx.strokeStyle = dark ? 'rgba(255,243,220,.28)' : 'rgba(255,255,255,.75)'; rr(ctx, 62.5, 62.5, W - 124, H - 124, 26); ctx.stroke();
  ctx.strokeStyle = dark ? 'rgba(0,0,0,.4)' : 'rgba(90,40,10,.28)'; rr(ctx, 65.5, 65.5, W - 124, H - 124, 26); ctx.stroke();
}
function warm(ctx, theme) { // the lit diya's light across the paper (soft, additive, kept low so words stay readable)
  const f = FOCUS[theme.id]; if (!f) return;
  const g = ctx.createRadialGradient(f[0], f[1], 0, f[0], f[1], 520); g.addColorStop(0, 'rgba(255,200,110,.22)'); g.addColorStop(1, 'rgba(255,200,110,0)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(0, 0, W, 900); ctx.globalCompositeOperation = 'source-over';
}
function rangoliMedallion(ctx, theme, seed) { // the visitor's own rangoli replaces the generated medallion
  const d = draft.get(); if (!d.strokes.length && d.preset == null) return;
  ctx.fillStyle = '#FFF3DC'; ctx.beginPath(); ctx.arc(540, 262, 150, 0, 7); ctx.fill();
  ctx.save(); ctx.beginPath(); ctx.arc(540, 262, 148, 0, 7); ctx.clip();
  ctx.fillStyle = '#16110C'; ctx.fillRect(390, 112, 300, 300);
  if (d.preset != null) { const p = d.preset; drawKolam(ctx, makeKolam({ seed: p.seed, folds: p.folds }), { cx: 540, cy: 262, R: 138, progress: 1, palette: { core: '#FFF3DC', glow: 'rgba(255,179,71,1)' }, glow: false }); }
  else {
    ctx.strokeStyle = '#FFE9B8'; ctx.lineWidth = 5; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    for (const s of d.strokes) for (let i = 0; i < d.folds; i++) for (const m of d.mirror ? [1, -1] : [1]) {
      const a = i * 2 * Math.PI / d.folds; ctx.save(); ctx.translate(540, 262); ctx.rotate(a); ctx.scale(m, 1); ctx.beginPath();
      s.forEach(([x, y], j) => (j ? ctx.lineTo(x * 138, y * 138) : ctx.moveTo(x * 138, y * 138))); ctx.stroke(); ctx.restore();
    }
  }
  ctx.restore();
}

const cardHook = {
  art(ctx, theme, seed, lean) {
    const id = theme.id;
    if (id === 'ink') { inkCard(ctx, lean); return; }
    if (id === 'rangoli') rangoliMedallion(ctx, theme, seed);
    paper(ctx, theme, lean); emboss(ctx, theme);
    if (!lean) { ctx.globalAlpha = 0.04; ctx.globalCompositeOperation = 'multiply'; ctx.fillStyle = fibre(); ctx.fillRect(0, 0, W, H); ctx.globalCompositeOperation = 'source-over'; ctx.globalAlpha = 1; warm(ctx, theme); }
  },
  metrics: (text) => metricsFor(text),
};

// ---- the live flame over the preview (high 30 fps, mid 20 fps; none on low, in Calm or when shed) ----
let liveEl = null, mo = null, offTick = null, offSub = null, fx = null, acc = 0;
function flame(ctx, x, y, s, t, ink) {
  const p = palette(ink), n = Math.sin(t * 7.1) * 0.5 + Math.sin(t * 11.3 + 1) * 0.35 + Math.sin(t * 3.7) * 0.4;
  const lean = n * 4 * s, h = (92 + n * 8) * s;
  const g = ctx.createRadialGradient(x, y - 40 * s, 0, x, y - 40 * s, 260 * s); g.addColorStop(0, ink ? 'rgba(255,243,220,.38)' : 'rgba(255,200,110,.45)'); g.addColorStop(1, 'rgba(255,200,110,0)');
  ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g; ctx.fillRect(x - 260 * s, y - 300 * s, 520 * s, 560 * s); ctx.globalCompositeOperation = 'source-over';
  for (const [w, k, col] of [[30, 1, p.flameA], [20, 0.78, p.flameB], [9, 0.45, '#FFF3DC']]) {
    ctx.fillStyle = col; ctx.beginPath(); ctx.moveTo(x, y); ctx.bezierCurveTo(x - w * s, y - h * k * 0.35, x - w * s * 0.9 + lean * k, y - h * k * 0.75, x + lean * k, y - h * k);
    ctx.bezierCurveTo(x + w * s * 0.9 + lean * k, y - h * k * 0.75, x + w * s, y - h * k * 0.35, x, y); ctx.fill();
  }
}
export function drawLive(cv, themeId, t, ink) {
  const f = FOCUS[themeId]; const ctx = cv.getContext('2d'); ctx.clearRect(0, 0, cv.width, cv.height);
  if (!f || themeId === 'ink') return;
  const k = cv.width / W; ctx.save(); ctx.scale(k, k);
  flame(ctx, f[0], f[1] + (themeId === 'diya' ? 40 : 0) - (themeId === 'diya' ? 0 : 0), themeId === 'diya' ? 0.9 : themeId === 'kandil' ? 0.5 : 0.7, t, false);
  ctx.restore();
}
function attach() {
  const body = document.querySelector('.card-stage .card-body'); if (!body || body.querySelector('canvas.live')) return;
  const art = body.querySelector('canvas.art'); if (!art) return;
  const cv = document.createElement('canvas'); cv.className = 'live'; cv.setAttribute('aria-hidden', 'true'); cv.setAttribute('data-e', '1');
  body.insertBefore(cv, body.querySelector('canvas.txt')); liveEl = cv; acc = 0;
}
function tick(dt) {
  const s = getState(); if (!liveEl || !liveEl.isConnected) { liveEl = null; attach(); return; }
  if (s.calm || s.quality === 'low' || !isOn('card-live') || document.hidden) { if (liveEl.__drawn) { liveEl.getContext('2d').clearRect(0, 0, liveEl.width, liveEl.height); liveEl.__drawn = false; } return; }
  acc += dt; const step = s.quality === 'high' ? 33 : 50; if (acc < step) return; acc = 0;
  const art = liveEl.parentElement.querySelector('canvas.art'); if (!art) return;
  const w = Math.max(200, Math.round(art.width / 2)); if (liveEl.width !== w) { liveEl.width = w; liveEl.height = Math.round(w * H / W); }
  if (!liveEl.getBoundingClientRect().height) return; // lint:ok (event-time or once-per-33ms read, before any write)
  const r = liveEl.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; // lint:ok (event-time or once-per-33ms read, before any write)
  drawLive(liveEl, document.querySelector('.card-stage')?.getAttribute('data-theme') || 'diya', performance.now() / 1000, s.ink);
  liveEl.__drawn = true;
}
export function start() {
  hooks.card = cardHook;
  fx = registerEffect({ id: 'card-live', kind: 'canvas', priority: 6, ms: 0.8 });
  attach(); mo = new MutationObserver(() => { if (!liveEl) attach(); }); mo.observe(document.getElementById('wish') || document.body, { childList: true, subtree: true });
  offTick = ticker.add(tick);
}
export function stop() {
  if (hooks.card === cardHook) hooks.card = null;
  mo && mo.disconnect(); mo = null; offTick && offTick(); offTick = null; offSub && offSub();
  document.querySelectorAll('canvas.live[data-e]').forEach((e) => e.remove()); liveEl = null;
}
export const name = 'studio';
