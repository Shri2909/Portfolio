// E3.1 / E3.2 / E3.6 (skim): the cold open. One clock; the light radius, the lantern type, the flame and the pull-back
// are pure functions of clock.t. Silent. Any tap, key, wheel or scroll fast-forwards it (6x -> done in about half a second);
// text is in the DOM from t=0 and never hidden by this module. Calm / reduced motion / deep links never start it.
// Deviations (logged): no #world wrapper or layer dolly (camera is off, R1); the veil's darkness pass is built here because
// light.js has none; `bloom:set` is not emitted per frame; glow tints on the headline are omitted (a text-shadow shows
// through a clipped gradient fill), the lantern is a gradient clip on the h1 and the ask (React owns those text nodes).
import { ticker } from '../lib/ticker.js';
import { getState } from '../lib/store.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { engine, noise } from '../lib/flame.js';
import { emit } from '../lib/events.js';
import { registerEffect } from './budget.js';
import { PERF } from '../elevation.js';

export const clock = { t: 0, scale: 1 };
const END = 5200, BEATS = [400, 1400, 2400, 3200];
const q5 = (x) => 1 - (1 - x) ** 5, c01 = (x) => Math.min(1, Math.max(0, x));
let rm = null, cv = null, ctx = null, W = 0, H = 0, wx = 0, wy = 0, targets = [], anims = new Set(), offs = [], unreg = null, skimmed = false, running = false, tier = 'high', lastDraw = 0, home = null;
const root = () => document.documentElement;
const mark = (n) => { try { performance.mark(n); } catch {} };

export const lightRadius = (t) => {
  const rend = 1.1 * Math.max(innerWidth, innerHeight), s = c01((t - 240) / 4000);
  let R = rend * (1 - (1 - s) ** 3);
  for (const b of BEATS) if (t > b) R *= 1 + 0.14 * Math.exp(-(t - b) / 180) * (t < b + 600 ? 1 : 0);
  return R;
};
export const flameScale = (t) => (t < 240 ? 0.06 : t < 600 ? 0.06 + 0.24 * ((t - 240) / 360) : t < 1400 ? 0.3 + 0.7 * q5((t - 600) / 800) : 1);

// lampRegistry.wick(0) is registered by more than one lamp 0 on the page (the last mounted wins), so find the host diya's own wick
export function hostWick() { const c = document.querySelector('.home-wrap circle[r="0.5"]'); if (!c) return null; const r = c.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; } // lint:ok one-shot read
function measure() {
  const p = hostWick() || { x: 46, y: innerHeight * 0.54 };
  wx = p.x; wy = p.y;
  const r = root(); r.style.setProperty('--fx', wx.toFixed(1) + 'px'); r.style.setProperty('--fy', wy.toFixed(1) + 'px');
  targets = [...document.querySelectorAll('#night h1, #night .ask')].map((el) => { const b = el.getBoundingClientRect(); return { el, x: wx - b.left, y: wy - b.top }; });
  targets.forEach((t) => { t.el.style.setProperty('--wx', t.x.toFixed(1) + 'px'); t.el.style.setProperty('--wy', t.y.toFixed(1) + 'px'); });
  if (cv) { W = Math.ceil(innerWidth / 2); H = Math.ceil(innerHeight / 2); cv.width = W; cv.height = H; }
}

function drawVeil(t, R, quality) {
  if (!ctx) return;
  const a = t < 3000 ? 0.97 : 0.97 + (0.3 - 0.97) * (1 - (1 - c01((t - 3000) / 2200)) ** 3);
  ctx.globalCompositeOperation = 'source-over'; ctx.clearRect(0, 0, W, H);
  ctx.fillStyle = `rgba(5,4,8,${a.toFixed(3)})`; ctx.fillRect(0, 0, W, H);
  const x = wx / 2, y = wy / 2, r = Math.max(1, R / 2);
  ctx.globalCompositeOperation = 'destination-out';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, 'rgba(0,0,0,1)'); g.addColorStop(0.3, 'rgba(0,0,0,.92)'); g.addColorStop(0.62, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  if (quality === 'high') { // warm lift at the flame
    ctx.globalCompositeOperation = 'source-over'; const w = ctx.createRadialGradient(x, y, 0, x, y, r * 0.8); w.addColorStop(0, 'rgba(255,150,60,.10)'); w.addColorStop(1, 'rgba(255,150,60,0)'); ctx.fillStyle = w; ctx.fillRect(0, 0, W, H);
  }
}
function writeType(R) {
  const op = Math.max(0, (R - 110) / Math.max(1, R) * 100);
  for (const t of targets) { t.el.style.setProperty('--or', R.toFixed(0)); t.el.style.setProperty('--op', op.toFixed(1)); }
}
function finish() {
  if (!running) return; running = false;
  stopTick && stopTick(); stopTick = null;
  clock.t = END;
  writeType(lightRadius(END)); engine.set(0, { scale: 1 });
  const r = root(); r.setAttribute('data-open', 'done'); mark('ek:rest');
  targets.forEach((t) => { ['--wx', '--wy', '--or', '--op'].forEach((k) => t.el.style.removeProperty(k)); });
  if (cv) { cv.style.opacity = '0'; const c = cv; setTimeout(() => c.remove(), 700); cv = null; ctx = null; }
  anims.forEach((a) => { try { a.finish(); } catch {} }); anims.clear();
  emit('cue:play', { name: 'open:done' });
  unreg && unreg();
}
let stopTick = null;
function frame(dt) {
  clock.scale += (clock.target - clock.scale) * Math.min(1, dt / 40);
  clock.t += dt * clock.scale; const t = clock.t;
  render(t);
  if (t >= END) finish();
}
function render(t) {
  const R = lightRadius(t) * (1 + 0.025 * (noise(t / 180) - 0.5) * 2);
  if (tier !== 'low' && (tier === 'high' || ((lastDraw ^= 1) === 1))) drawVeil(t, R, tier);
  if (t < 4400) writeType(Math.min(R, 1.1 * Math.max(innerWidth, innerHeight)));
  if (t < 1400) engine.set(0, { scale: flameScale(t) });
  BEATS.forEach((b, i) => { if (t >= b && !render['b' + i]) { render['b' + i] = 1; mark('ek:beat' + (i + 1)); emit('cue:play', { name: 'open:beat', n: i + 1 }); } });
}
function skim() {
  if (skimmed || !running) return; skimmed = true;
  clock.target = 11; anims.forEach((a) => { try { a.playbackRate = 8; } catch {} });
  // V3's beat timers complete on pointerdown/keydown; a scroll or wheel skim hands them the same signal (a bare Shift keydown on window; a pointerdown there trips V3's sparkler)
  try { window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Shift' })); } catch {}
  emit('cue:play', { name: 'open:skim' });
}
export function seek(ms) { // verification only (?cue=seek)
  clock.scale = 0; clock.target = 0; clock.t = ms;
  Object.keys(render).forEach((k) => delete render[k]);
  render(ms); anims.forEach((a) => { try { a.pause(); a.currentTime = ms; } catch {} });
  if (ms >= END) finish();
}

export function start() {
  const r = root();
  if (r.getAttribute('data-open') !== 'cold') { r.setAttribute('data-live', '1'); mark('ek:rest'); return; }
  const s = getState();
  if (s.calm || s.ink) { r.setAttribute('data-open', 'done'); r.setAttribute('data-live', '1'); return; }
  // one clock from navigation start: a slow load joins the film part-way. ?cue=seek (verification) parks it at 0 until __open.seek()
  const SEEK = /[?&]cue=seek/.test(location.search);
  tier = s.quality || 'high'; running = true; skimmed = false; clock.t = SEEK ? 0 : Math.min(performance.now(), 1000); clock.scale = SEEK ? 0 : 1; clock.target = SEEK ? 0 : 1;
  measure();
  unreg = registerEffect({ id: 'opening', kind: 'canvas', priority: 8, ms: 1.2, onShed: () => { if (!skimmed) { clock.target = 11; } } });
  const stage = document.getElementById('stage');
  if (tier !== 'low' && stage) {
    cv = document.createElement('canvas'); cv.setAttribute('aria-hidden', 'true'); cv.setAttribute('data-e', '1'); cv.id = 'open-veil';
    W = Math.ceil(innerWidth / 2); H = Math.ceil(innerHeight / 2); cv.width = W; cv.height = H; ctx = cv.getContext('2d'); stage.appendChild(cv); drawVeil(0, 1, tier);
  }
  r.setAttribute('data-live', '1'); mark('ek:flame');
  const poster = document.getElementById('poster');
  if (poster) { requestAnimationFrame(() => requestAnimationFrame(() => { poster.classList.add('out'); setTimeout(() => poster.remove(), 320); })); }
  // the host diya starts as a hero (2.4x about its wick) and settles
  home = document.querySelector('.home-wrap');
  if (home) {
    const b = home.getBoundingClientRect(); home.style.transformOrigin = `${(wx - b.left).toFixed(0)}px ${(wy - b.top).toFixed(0)}px`; // lint:ok one-shot read at start/event time
    const a = home.animate([{ scale: '2.4' }, { scale: '1' }], { duration: tier === 'low' ? 1800 : 4200, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'both' }); anims.add(a);
    a.onfinish = () => { a.cancel(); anims.delete(a); home && (home.style.transformOrigin = ''); };
  }
  if (tier === 'low' && stage) { const a = stage.animate([{ opacity: 0 }, { opacity: 0.5, offset: 0.44 }, { opacity: 1 }], { duration: 1800, easing: 'linear', fill: 'none' }); anims.add(a); a.onfinish = () => anims.delete(a); }
  const onSkim = () => skim();
  const wheel = (e) => { if (Math.abs(e.deltaY) > 20) skim(); };
  let y0 = scrollY; const scr = () => { if (Math.abs(scrollY - y0) > 24) skim(); };
  const foc = (e) => { if (e.target.closest && e.target.closest('a,button,[tabindex]')) skim(); };
  addEventListener('pointerdown', onSkim, true); addEventListener('keydown', onSkim, true); addEventListener('wheel', wheel, { passive: true, capture: true }); addEventListener('scroll', scr, { passive: true }); addEventListener('focusin', foc, true);
  const rs = () => measure(); let rt = 0; const onRs = () => { clearTimeout(rt); rt = setTimeout(rs, 150); }; addEventListener('resize', onRs);
  offs.push(() => { removeEventListener('pointerdown', onSkim, true); removeEventListener('keydown', onSkim, true); removeEventListener('wheel', wheel, true); removeEventListener('scroll', scr); removeEventListener('focusin', foc, true); removeEventListener('resize', onRs); clearTimeout(rt); });
  if (PERF || /[?&]cue=seek/.test(location.search)) window.__open = { seek, clock, wick: hostWick, re: measure, setTier: (q) => { tier = q; }, skim };
  stopTick = ticker.add(frame); render(0);
}
export function stop() {
  offs.splice(0).forEach((f) => f()); stopTick && stopTick(); stopTick = null; running = false;
  const r = root(); if (r.getAttribute('data-open') === 'cold') r.setAttribute('data-open', 'done');
  cv && cv.remove(); cv = null; anims.forEach((a) => { try { a.cancel(); } catch {} }); anims.clear(); unreg && unreg(); engine.set(0, { scale: 1 });
  const p = document.getElementById('poster'); p && p.remove();
  targets.forEach((t) => ['--wx', '--wy', '--or', '--op'].forEach((k) => t.el.style.removeProperty(k)));
}
export const name = 'opening';
