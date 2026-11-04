// E6.7: five little secrets. One pointer router, nothing labelled, listed or counted. Each plays at most once per 20 s,
// never during a foreground interaction, and every one has a Calm version (a 400 ms opacity pulse of its target).
// Harmless, silent and never required. Results only touch pictures: no words, no persistence.
import { getState } from '../lib/store.js';
import { emit, on } from '../lib/events.js';
import { wishState } from '../lib/wishState.js';
import { makeKolam, drawKolam } from './kolam.js';
import { palette } from './palette.js';
import { isOn } from './budget.js';

const GAP = 20000, HOLD_MS = 1200;
let last = -1e9, offs = [], taps = [], holdT = 0, toranDrag = null, overlay = null;
const q = (s) => document.querySelector(s);
const calm = () => getState().calm;
const rectOf = (e) => (e ? e.getBoundingClientRect() : null); // lint:ok (event-time or once-per-33ms read, before any write)
const inR = (r, x, y, pad = 0) => r && x >= r.left - pad && x <= r.right + pad && y >= r.top - pad && y <= r.bottom + pad;
const interactive = (t) => t && t.closest && t.closest('a,button,input,textarea,select,summary,label,dialog,.device,[role="button"],[role="application"],.kpad');
const busy = () => performance.now() - last < GAP || +(document.documentElement.getAttribute('data-hush') || 0) > 0 || document.hidden || document.querySelector('dialog[open]') || !isOn('secrets');
const found = (id) => { last = performance.now(); emit('egg:found', { id }); };
const pulse = (el) => { el && el.animate([{ opacity: 1 }, { opacity: 0.35 }, { opacity: 1 }], { duration: 400 }); };
const stage = () => document.getElementById('stage');

function moon(x, y) {
  taps = taps.filter((t) => performance.now() - t < 2000); taps.push(performance.now()); if (taps.length < 3) return; taps = [];
  const m = q('#stage .moon'); if (calm()) { pulse(m); return found('moon'); }
  const r = rectOf(m), st = stage(); if (!r || !st) return;
  const c = document.createElement('div'); c.setAttribute('data-e', '1'); c.style.cssText = `position:absolute;left:${r.left + r.width / 2 - 70}px;top:${r.top + r.height / 2 - 6}px;width:140px;height:14px;border-radius:7px;background:rgba(255,243,220,.16);filter:none;pointer-events:none`;
  st.appendChild(c); c.animate([{ transform: 'translateX(-80px)', opacity: 0 }, { opacity: 1, offset: 0.3 }, { opacity: 1, offset: 0.7 }, { transform: 'translateX(80px)', opacity: 0 }], { duration: 2400 }).finished.finally(() => c.remove());
  if (getState().quality === 'high') { const s = document.createElement('div'); s.setAttribute('data-e', '1'); s.style.cssText = `position:absolute;left:${innerWidth * 0.55}px;top:${Math.max(40, r.top - 40)}px;width:60px;height:2px;background:linear-gradient(90deg,transparent,#FFF3DC);pointer-events:none;transform:rotate(25deg)`; st.appendChild(s); s.animate([{ transform: 'rotate(25deg) translateX(0)', opacity: 0 }, { opacity: 1, offset: 0.2 }, { transform: 'rotate(25deg) translateX(140px)', opacity: 0 }], { duration: 700, delay: 600, fill: 'both' }).finished.finally(() => s.remove()); }
  found('moon');
}
function rocket(x, y) { // a rocket that bursts as a 12-spoke kolam of sparks
  if (calm()) { pulse(stage()); return found('rocket'); }
  const q2 = getState().quality, cx = innerWidth / 2 + (Math.random() - 0.5) * 80, cy = innerHeight * 0.28, k = makeKolam({ seed: 12, folds: 12, rings: q2 === 'high' ? 3 : 2 });
  emit('fx:burst', { kind: 'rocket', x: cx, y: innerHeight * 0.78, tx: cx, ty: cy, shape: 'willow' });
  setTimeout(() => k.dots.forEach((d, i) => { if (q2 !== 'high' && i % 2) return; emit('fx:burst', { kind: 'spark', x: cx + d.x * 90, y: cy + d.y * 90, count: q2 === 'high' ? 2 : 1 }); }), 1500);
  found('rocket');
}
function cat(x, y) {
  const c = q('#stage .cat'), r = rectOf(c); clearTimeout(holdT);
  holdT = setTimeout(() => {
    if (busy()) return; if (calm()) { pulse(c); return found('cat'); }
    const eyes = [...c.querySelectorAll('circle')]; eyes.forEach((e) => { e.style.transformBox = 'fill-box'; e.style.transformOrigin = 'center'; e.animate([{ transform: 'scaleY(1)' }, { transform: 'scaleY(.1)', offset: 0.5 }, { transform: 'scaleY(1)' }], { duration: 560, iterations: 2 }); });
    const st = stage(); for (let i = 0; i < 4 && st; i++) { const g = document.createElement('div'); g.setAttribute('data-e', '1'); g.style.cssText = `position:absolute;left:${r.left + r.width / 2 - 22}px;top:${r.top + r.height / 2 - 22}px;width:44px;height:44px;border-radius:50%;border:1px solid rgba(255,200,110,.5);pointer-events:none`; st.appendChild(g); g.animate([{ transform: 'scale(.4)', opacity: 0.7 }, { transform: 'scale(1.8)', opacity: 0 }], { duration: 1200, delay: i * 1400, fill: 'both' }).finished.finally(() => g.remove()); }
    found('cat');
  }, HOLD_MS);
}
function toranDown(x, y) { const ss = [...document.querySelectorAll('#stage .toran .strand')]; const i = ss.findIndex((s) => inR(rectOf(s), x, y, 6)); if (i >= 0) toranDrag = { i, ss, x, y }; }
function toranUp(x, y) {
  const d = toranDrag; toranDrag = null; if (!d || y - d.y < 24 || busy()) return;
  if (calm()) { pulse(q('#stage .toran')); return found('toran'); }
  d.ss.forEach((s, j) => { const dist = Math.abs(j - d.i); if (dist > 4) return; const A = 12 * Math.pow(0.5, dist), kf = []; for (let n = 0; n <= 16; n++) { const t = n / 16; kf.push({ rotate: `${(A * Math.exp(-0.55 * t * 3) * Math.sin(t * (3 / 1.2) * 6.283)).toFixed(2)}deg`, offset: t }); } s.animate(kf, { duration: 3000, composite: 'add', easing: 'linear' }); });
  const r = rectOf(d.ss[d.i]); emit('fx:burst', { kind: 'petals', x: r.left + r.width / 2, y: r.bottom, count: 4 }); found('toran');
}
function rangoli(x, y) {
  const card = q('.card-stage .card-body'), cr = rectOf(card);
  if (inR(cr, x, y)) { if (calm()) { pulse(card); } else card.animate([{ opacity: 1 }, { opacity: 0.4 }, { opacity: 1 }], { duration: 600 }); wishState.set({ seed: (Math.random() * 4294967295) >>> 0 }); return found('rangoli'); }
  const w = q('#stage .rangoli-wrap'); if (!w) return; const r = rectOf(w); if (!inR(r, x, y)) return;
  if (calm()) { pulse(w); return found('rangoli'); }
  const st = stage(); if (!overlay) { overlay = document.createElement('canvas'); overlay.setAttribute('data-e', '1'); overlay.setAttribute('aria-hidden', 'true'); overlay.style.cssText = 'position:absolute;pointer-events:none'; st.appendChild(overlay); }
  const side = Math.min(r.width, r.height * 2.2), D = Math.round(side); overlay.width = overlay.height = D; overlay.style.left = r.left + r.width / 2 - D / 2 + 'px'; overlay.style.top = r.top + r.height / 2 - D / 2 + 'px'; overlay.style.width = overlay.style.height = D + 'px';
  const f = [6, 8, 10, 12][Math.floor(Math.random() * 4)], k = makeKolam({ seed: (Math.random() * 1e9) >>> 0, folds: f }), p = palette(getState().ink), c = overlay.getContext('2d');
  w.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }); const t0 = performance.now() + 500;
  const go = (t) => { const pr = Math.min(1, (t - t0) / 1600); c.clearRect(0, 0, D, D); if (pr > 0) drawKolam(c, k, { cx: D / 2, cy: D / 2, R: D * 0.46, progress: pr, palette: p, glow: getState().quality === 'high' }); if (pr < 1 && overlay) requestAnimationFrame(go); }; requestAnimationFrame(go);
  found('rangoli');
}
export function mount() {
  const down = (e) => {
    if (interactive(e.target)) return;
    const x = e.clientX, y = e.clientY;
    toranDown(x, y);
    if (busy()) return;
    const m = q('#stage .moon'); if (inR(rectOf(m), x, y, 8) && Math.hypot(x - (rectOf(m).left + rectOf(m).width / 2), y - (rectOf(m).top + rectOf(m).height / 2)) < 28) moon(x, y);
    if (inR(rectOf(q('#stage .cat')), x, y, 6)) cat(x, y);
    if (e.shiftKey && e.pointerType !== 'touch' && y < innerHeight * 0.5) rocket(x, y);
  };
  const up = (e) => { clearTimeout(holdT); if (toranDrag) toranUp(e.clientX, e.clientY); };
  const ts = (e) => { if (e.touches.length === 3 && [...e.touches].every((t) => t.clientY < innerHeight * 0.55) && !interactive(e.target) && !busy()) rocket(); };
  const dbl = (e) => { if (!interactive(e.target) && !busy()) rangoli(e.clientX, e.clientY); };
  addEventListener('pointerdown', down, true); addEventListener('pointerup', up, true); addEventListener('pointercancel', up, true); addEventListener('touchstart', ts, { passive: true }); addEventListener('dblclick', dbl);
  return () => { removeEventListener('pointerdown', down, true); removeEventListener('pointerup', up, true); removeEventListener('pointercancel', up, true); removeEventListener('touchstart', ts); removeEventListener('dblclick', dbl); clearTimeout(holdT); overlay && overlay.remove(); overlay = null; q('#stage .rangoli-wrap') && q('#stage .rangoli-wrap').getAnimations().forEach((a) => a.cancel()); };
}
