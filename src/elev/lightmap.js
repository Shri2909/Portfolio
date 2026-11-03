// E4.2: the light-map. A small canvas (viewport / 4) between Terrace and #cast; additive radial sprites for every light,
// squashed on the terrace plane so light pools on the floor and parapet instead of lighting the sky. Redrawn only when the
// light engine says something changed, plus a slow 8 Hz breath on the high tier. No blend mode (screen layers cost too
// much under the software rasteriser), the canvas simply holds warm alpha. Mean luminance is fed back to the energy rules.
import { getState } from '../lib/store.js';
import { on } from '../lib/events.js';
import { light, LIGHT } from './light.js';
import { energy, measured } from './energy.js';
import { registerEffect, isOn, scale as fxScale, tickAwake, measure } from './budget.js';

let scrolling = false, scT = 0, cv = null, ctx = null, sprites = [], offs = [], tickStop = null, unreg = [], sctx = null, off_ = null, bloomPts = [], lastList = [], lastEx = 1, w = 0, h = 0;

function sprite(rgb) { const c = document.createElement('canvas'); c.width = c.height = 64; const g = c.getContext('2d'), r = g.createRadialGradient(32, 32, 0, 32, 32, 32); r.addColorStop(0, `rgba(${rgb},1)`); r.addColorStop(0.35, `rgba(${rgb},.55)`); r.addColorStop(1, `rgba(${rgb},0)`); g.fillStyle = r; g.fillRect(0, 0, 64, 64); return c; }
function size() { w = Math.max(24, Math.ceil(innerWidth / 4)); h = Math.max(24, Math.ceil(innerHeight / 4)); if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; } }
function draw(list = lastList, ex = lastEx) { return measure('lightmap-pool', () => draw_(list, ex)); }
function draw_(list, ex) {
  if (!ctx || document.hidden || fxScale('lightmap-pool') < 0.02) return; lastList = list; lastEx = ex;
  const s = getState(), q = s.quality; if (q === 'low') return;
  ctx.clearRect(0, 0, w, h); ctx.globalCompositeOperation = 'lighter';
  const ink = s.ink, br = s.calm ? 0.5 : light.breath() , lim = q === 'high' ? 24 : 14;
  let k = 0;
  for (const l of list) {
    if (k++ >= lim) break;
    const hue = ink ? 4 : l.hue || 0, sp = sprites[hue], pr = l.kind === 'window' ? 0.5 : 0.55, fl = l.kind === 'flame' ? 0.92 + 0.08 * br : 1;
    ctx.globalAlpha = Math.min(0.9, l.i * ex * pr * fl * (ink ? 0.55 : 1));
    const rr = (l.r * 2) / 4, sq = l.kind === 'window' ? 1 : 0.55; // flames pool on the floor plane
    ctx.drawImage(sp, l.x / 4 - rr / 2, l.y / 4 - (rr * sq) / 2, rr, rr * sq);
  }
  const nlit = s.litCount;
  if (q === 'high' && !ink) { // one wide haze band at the horizon
    ctx.globalAlpha = Math.min(0.12, (0.04 + 0.01 * nlit) * ex); ctx.fillStyle = 'rgb(255,170,90)'; ctx.fillRect(0, h * 0.58, w, h * 0.1);
  }
  for (let i = bloomPts.length - 1; i >= 0; i--) { const b = bloomPts[i], e = performance.now() - b.t0; if (e > b.dur) { bloomPts.splice(i, 1); continue; } ctx.globalAlpha = Math.min(0.8, b.i * (1 - e / b.dur) * ex); const rr = (b.r * 2) / 4; ctx.drawImage(sprites[b.hue || 0], b.x / 4 - rr / 2, b.y / 4 - rr / 2, rr, rr); }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}
function sample() { // 8x8 downscale, mean of alpha*luma
  if (!sctx || document.hidden || getState().quality === 'low') return;
  sctx.clearRect(0, 0, 8, 8); sctx.drawImage(cv, 0, 0, 8, 8);
  const d = sctx.getImageData(0, 0, 8, 8).data; let m = 0;
  for (let i = 0; i < d.length; i += 4) m += (d[i + 3] / 255) * ((0.3 * d[i] + 0.59 * d[i + 1] + 0.11 * d[i + 2]) / 255);
  measured(m / 64);
}
export function start() {
  const stage = document.getElementById('stage'), cast = document.getElementById('cast'); if (!stage) return;
  cv = document.createElement('canvas'); cv.id = 'lightmap'; cv.setAttribute('aria-hidden', 'true'); cv.setAttribute('data-e', '1'); stage.insertBefore(cv, cast); ctx = cv.getContext('2d'); size();
  sprites = LIGHT.hues.map((c) => sprite(c.join(',')));
  off_ = document.createElement('canvas'); off_.width = off_.height = 8; sctx = off_.getContext('2d', { willReadFrequently: true });
  offs.push(light.onDraw((list, ex) => { draw(list, ex); if (scrolling && !scT) scT = 1; }));
  // lights are anchored to the page, the canvas to the viewport: hide it while scrolling, show it again at scroll end
  let hideT = 0; const sc = () => { if (!scrolling) { scrolling = true; cv.style.opacity = '0'; } clearTimeout(hideT); hideT = setTimeout(() => { scrolling = false; scT = 0; draw(); cv.style.opacity = ''; }, 220); };
  window.addEventListener('scroll', sc, { passive: true }); offs.push(() => { window.removeEventListener('scroll', sc); clearTimeout(hideT); });
  offs.push(on('bloom:set', (d) => { bloomPts.push({ x: d.x, y: d.y, r: d.r || 120, i: d.i || 0.6, dur: d.dur || 600, t0: performance.now(), hue: d.hue }); draw(); }));
  const rs = () => { size(); draw(); }; window.addEventListener('resize', rs); offs.push(() => window.removeEventListener('resize', rs));
  // slow breath: 8 Hz redraw, high tier only, never in Calm, never while hushed or hidden
  let a1 = 0, a2 = 0; // ticker accumulators (no setInterval): breath every 125 ms, sampler every 500 ms
  tickStop = tickAwake((dt) => {
    a1 += dt; a2 += dt;
    if (a1 >= 125) { a1 = 0; const s = getState(); if (!(s.calm || s.ink || s.quality !== 'high' || document.hidden || !isOn('lightmap-breath'))) { const hu = document.documentElement.dataset.hush; if (!hu || hu === '0') draw(); } }
    if (a2 >= 500) { a2 = 0; sample(); }
  });
  unreg.push(registerEffect({ id: 'lightmap-pool', kind: 'canvas', priority: 4, ms: 0.5, onRestore: () => draw() }), registerEffect({ id: 'lightmap-breath', kind: 'canvas', priority: 7, ms: 0.3 }));
  light.mark(); setTimeout(() => { draw(); if (!getState().calm) sample(); }, 600);
}
export function stop() { tickStop && tickStop(); tickStop = null; unreg.splice(0).forEach((f) => f()); offs.splice(0).forEach((f) => f()); cv && cv.remove(); cv = ctx = null; bloomPts = []; }
export const name = 'lightmap';
