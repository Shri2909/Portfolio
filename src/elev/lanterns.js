// E6.5: Kandil rises. The closure gets a quiet sky with one hung paper lantern (a kandil, with tassels) for every diya
// written in the link (what the link carries, not a visitor count), capped at 24 drawn, plus the visitor's own lantern,
// whose panels glow with their rangoli. The V3 caption and the "not a visitor count" line stay on screen with it.
import { getState } from '../lib/store.js';
import { on, emit } from '../lib/events.js';
import { ticker } from '../lib/ticker.js';
import { mulberry32 } from '../lib/rand.js';
import { makeKolam, drawKolam } from './kolam.js';
import { palette } from './palette.js';
import { registerEffect, isOn } from './budget.js';
import { draft } from './draft.js';
import { wishState } from '../lib/wishState.js';

const TONES = [['#F5A623', '#FFD27A'], ['#C2410C', '#FFB347'], ['#FFF3DC', '#FFD27A']];
const cap = { high: 24, mid: 16, low: 8 };
let sprites = null;
function makeSprite(ink, i) {
  { // one sprite per idle slice (see mount): a single sprite costs a few ms, six in one go was a long task
    const c = document.createElement('canvas'); c.width = 76; c.height = 112; const x = c.getContext('2d'), [body, hot] = TONES[i % 3];
    const g = x.createRadialGradient(38, 56, 2, 38, 56, 44); g.addColorStop(0, ink ? 'rgba(255,255,255,.55)' : 'rgba(255,210,122,.65)'); g.addColorStop(1, 'rgba(255,200,110,0)'); x.fillStyle = g; x.fillRect(0, 0, 76, 112);
    x.fillStyle = ink ? '#2a2420' : '#3a2412'; x.fillRect(22, 14, 32, 4); // cap ring
    x.fillStyle = ink ? 'rgba(255,243,220,.25)' : body; x.globalAlpha = ink ? 1 : 0.88; x.beginPath(); x.moveTo(26, 18); x.lineTo(50, 18); x.lineTo(58, 56); x.lineTo(50, 92); x.lineTo(26, 92); x.lineTo(18, 56); x.closePath(); x.fill(); x.globalAlpha = 1;
    if (ink) { x.strokeStyle = '#FFF3DC'; x.lineWidth = 1.5; x.stroke(); }
    const ig = x.createRadialGradient(38, 58, 0, 38, 58, 22); ig.addColorStop(0, ink ? 'rgba(255,255,255,.9)' : hot); ig.addColorStop(1, 'rgba(255,255,255,0)'); x.globalCompositeOperation = 'lighter'; x.fillStyle = ig; x.fillRect(14, 30, 48, 56); x.globalCompositeOperation = 'source-over';
    x.save(); x.beginPath(); x.rect(20, 20, 36, 70); x.clip(); drawKolam(x, makeKolam({ seed: 7 + i * 13, folds: [6, 8, 6, 8, 10, 12][i], rings: 3 }), { cx: 38, cy: 56, R: 22, progress: 1, palette: { core: ink ? '#8A8378' : 'rgba(80,30,6,.7)', dot: 'rgba(0,0,0,0)' }, glow: false }); x.restore();
    x.fillStyle = ink ? '#2a2420' : '#3a2412'; x.fillRect(24, 92, 28, 4); x.strokeStyle = ink ? '#FFF3DC' : '#F5A623'; x.lineWidth = 1.5; for (const px of [30, 38, 46]) { x.beginPath(); x.moveTo(px, 96); x.lineTo(px, 108); x.stroke(); }
    x.strokeStyle = ink ? '#8A8378' : '#CDB894'; x.beginPath(); x.moveTo(38, 0); x.lineTo(38, 14); x.stroke();
    return c;
  }
}
function visitorSprite(ink) { // the visitor's lantern: their rangoli glows through the paper
  const c = document.createElement('canvas'); c.width = 76; c.height = 112; const x = c.getContext('2d'), base = sprites[0] || makeSprite(ink, 0);
  x.drawImage(base, 0, 0); const d = draft.get(); x.save(); x.beginPath(); x.rect(20, 20, 36, 70); x.clip();
  x.fillStyle = ink ? 'rgba(255,255,255,.35)' : 'rgba(255,200,110,.45)'; x.fillRect(20, 20, 36, 70);
  const k = makeKolam(d.preset ? { seed: d.preset.seed, folds: d.preset.folds } : { seed: wishState.get().seed || 1, rings: 4 });
  drawKolam(x, k, { cx: 38, cy: 56, R: 25, progress: 1, palette: { core: ink ? '#16110C' : 'rgba(110,40,6,.9)', dot: 'rgba(0,0,0,0)' }, glow: false }); x.restore();
  return c;
}

export function mount() {
  const sec = document.getElementById('closure'); if (!sec || sec.querySelector('canvas.lsky')) return () => {};
  const ink = () => getState().ink;
  sprites = [];
  const fill = () => { if (sprites.length >= 6 || !sec.isConnected) return; sprites.push(makeSprite(ink(), sprites.length)); try { draw(performance.now()); } catch { /* not ready yet */ } (window.requestIdleCallback ? requestIdleCallback(fill, { timeout: 300 }) : setTimeout(fill, 60)); };
  setTimeout(fill, 0);
  sec.setAttribute('data-lsky', '1');
  const cv = document.createElement('canvas'); cv.className = 'lsky'; cv.setAttribute('aria-hidden', 'true'); cv.setAttribute('data-e', '1'); sec.prepend(cv);
  const fx = registerEffect({ still: 'finished glowing frame, nothing moving (Calm)', id: 'lantern-sky', kind: 'canvas', priority: 6, ms: 1.2 });
  let ctx = cv.getContext('2d'), w = 0, h = 0, dpr = 1, items = [], visitor = null, inView = false, t0 = performance.now(), offs = [], rise = null, lastEmber = 0, acc = 0;
  const base = () => getState().row.base || 0;
  const layout = () => {
    const q = getState().quality, r = cv.getBoundingClientRect(); w = Math.round(r.width); h = Math.round(r.height); dpr = Math.min(devicePixelRatio || 1, q === 'high' ? 2 : 1.5); // lint:ok (event-time or once-per-33ms read, before any write)
    cv.width = w * dpr; cv.height = h * dpr;
    const n = Math.min(base(), cap[q] || 16), rnd = mulberry32(base() * 7919 + 13); items = [];
    for (let i = 0; i < n; i++) { const depth = [0.55, 0.75, 1][Math.floor(rnd() * 3)]; let x = 0.06 + rnd() * 0.88; if (Math.abs(x - 0.5) < 0.1) x += 0.14; items.push({ x, y: 0.1 + rnd() * 0.7, s: depth, ph: rnd() * 6.28, amp: 3 + rnd() * 4, v: (6 + rnd() * 8) * (rnd() < 0.5 ? -1 : 1), sp: Math.floor(rnd() * 6), on: 0 }); }
    items.sort((a, b) => a.s - b.s); sec.setAttribute('data-lanterns', String(items.length + (visitor ? 1 : 0))); cv.dataset.lanterns = String(items.length + (visitor ? 1 : 0)); cv.dataset.more = base() > 24 ? '1' : '0';
    draw(performance.now());
  };
  const slot = () => ({ x: w * 0.5, y: h * 0.38 });
  function drawOne(sp, x, y, s, a) { ctx.globalAlpha = a; const sw = 76 * s * 0.6, sh = 112 * s * 0.6; ctx.drawImage(sp, x - sw / 2, y - sh * 0.15, sw, sh); }
  function draw(now) {
    const q = getState().quality, calm = getState().calm, t = (now - t0) / 1000;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, w, h);
    if (base() > 24) { const g = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, w * 0.6); g.addColorStop(0, 'rgba(255,200,110,.12)'); g.addColorStop(1, 'rgba(255,200,110,0)'); ctx.fillStyle = g; ctx.fillRect(0, 0, w, h); }
    items.forEach((it, i) => {
      const fade = calm || q === 'low' ? 1 : Math.min(1, Math.max(0, (t - 1 - i * 0.09) / 0.5)), sway = calm || q === 'low' ? 0 : Math.sin(t * 0.8 * 6.283 + it.ph) * it.amp;
      let x = it.x * w + (calm || q === 'low' ? 0 : ((it.v * t) % w)); x = ((x % w) + w) % w;
      if (sprites[it.sp]) drawOne(sprites[it.sp], x + sway, it.y * h, it.s, 0.8 * fade * (0.55 + 0.45 * it.s));
    });
    if (visitor) { const s = slot(); const p = rise ? rise.p : 1; const x = rise ? rise.x0 + (s.x - rise.x0) * p + Math.sin(p * 3.1) * 14 * (1 - p) : s.x, y = rise ? rise.y0 + (s.y - rise.y0) * (1 - (1 - p) * (1 - p)) : s.y; drawOne(visitor, x + (calm ? 0 : Math.sin(t * 5.0) * 3 * (rise ? 1 - p : 1)), y, 1.15, 1); }
    ctx.globalAlpha = 1;
  }
  function addVisitor(x, y) {
    visitor = visitorSprite(ink()); sec.setAttribute('data-lanterns', String(items.length + 1)); cv.dataset.lanterns = String(items.length + 1);
    const calm = getState().calm, q = getState().quality, r = cv.getBoundingClientRect(); // lint:ok (event-time or once-per-33ms read, before any write)
    if (calm || !isOn('lantern-sky')) { rise = null; draw(performance.now()); return; }
    rise = { p: 0, t: performance.now(), x0: (x || r.left + r.width / 2) - r.left, y0: (y || r.bottom) - r.top, dur: q === 'low' ? 1200 : 4200 };
    const stopRise = () => { if (rise) { rise = null; emit('fx:burst', { kind: 'settle', x: r.left + slot().x, y: r.top + slot().y }); draw(performance.now()); } removeSkip(); };
    const tap = (e) => { if (!e.target.closest('a,button,input,textarea')) stopRise(); }, sc0 = scrollY, sc = () => { if (Math.abs(scrollY - sc0) > 40) stopRise(); };
    const removeSkip = () => { removeEventListener('pointerdown', tap); removeEventListener('scroll', sc); }; addEventListener('pointerdown', tap); addEventListener('scroll', sc, { passive: true });
    rise.stop = stopRise;
  }
  const tick = (dt) => {
    const calm = getState().calm, q = getState().quality; if (!inView || document.hidden) return;
    if (rise) { const now = performance.now(), p = Math.min(1, (now - rise.t) / rise.dur); rise.p = p; if (now - lastEmber > 120 && q !== 'mid') { lastEmber = now; const r = cv.getBoundingClientRect(), s = slot(); emit('fx:burst', { kind: 'ember', x: r.left + rise.x0 + (s.x - rise.x0) * p, y: r.top + rise.y0 + (s.y - rise.y0) * p, count: 1 }); } draw(now); if (p >= 1 && rise.stop) rise.stop(); return; } // lint:ok (event-time or once-per-33ms read, before any write)
    if (calm || q === 'low' || !isOn('lantern-sky')) return;
    acc += dt; if (acc < 33) return; acc = 0; draw(performance.now());
  };
  offs.push(ticker.add(tick));
  const io = new IntersectionObserver(([e]) => { inView = e.isIntersecting; if (inView) { t0 = performance.now() - 1500; draw(performance.now()); } }); io.observe(sec); offs.push(() => io.disconnect());
  const ro = new ResizeObserver(layout); ro.observe(sec); offs.push(() => ro.disconnect());
  offs.push(on('diya:visitorLit', (d) => { if (!visitor) addVisitor(d.x, d.y); }));
  if (getState().visitorLit) { visitor = visitorSprite(ink()); }
  layout();
  return () => { offs.splice(0).forEach((f) => f()); cv.remove(); sec.removeAttribute('data-lsky'); sec.removeAttribute('data-lanterns'); fx && 0; };
}
