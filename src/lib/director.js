import copy, { X } from './copy.js';
import { on, emit, hooks } from './events.js';
import { getState, subscribe } from './store.js';
import { lampRegistry } from './lampRegistry.js';
import { haptic } from './haptic.js';
import { spawn, burst, glow, fxLights, countType, liveCount, TYPES as T, initFx } from './fx.js';

// FxDirector: the one place that decides which effect fires when. It never draws; it sends fx:burst events (and still glows).
// Crackers only fire after a reader action or a beat the reader triggered. Persons / voice / verdict: no effects.
const tier = (a, b, c) => ({ high: a, mid: b, low: c }[getState().quality]);
const roofY = () => innerHeight * 0.6;
let recent = [], lastLitT = 0, anarTimer = 0, anarPending = null, duskPlayed = false, vlPlayed = false;
const rate = () => { const now = performance.now(); recent = recent.filter((t) => now - t < 500); if (recent.length >= 4) return false; recent.push(now); return true; }; // max 4 non-ambient bursts per 500 ms
const fire = (d) => { if (rate()) emit('fx:burst', d); };

export function startDirector() {
  initFx();
  if (import.meta.env.DEV) window.__fx = { burst, spawn, countType, liveCount };
  // C1 holding: ember at the wick, scaled by progress
  let lastE = 0;
  on('diya:lighting', ({ n, progress }) => { const s = getState(); if (s.calm || !progress) return; const gap = tier(90, 160, 300), now = performance.now(); if (now - lastE < gap / Math.max(0.2, progress)) return; lastE = now; const p = lampRegistry.wick(n); p && emit('fx:burst', { kind: 'ember', x: p.x, y: p.y, count: 1 }); });
  // C2 lamp lit
  on('diya:lit', ({ n, x, y }) => {
    fxLights.push({ x, y });
    const s = getState(), now = performance.now(), coalesce = now - lastLitT < 600; lastLitT = now;
    document.querySelectorAll('.lights').forEach((e) => { e.classList.add('wave'); setTimeout(() => e.classList.remove('wave'), 900); });
    if (s.calm) { glow({ x, y, r: 90, color: 'rgba(255,179,71,.5)', fadeIn: 800, hold: 1600, fadeOut: 800 }); return; }
    fire({ kind: 'spark', x, y, count: tier(10, 7, 4) });
    // coalescing: lamps lit within 600 ms of each other: only the last one gets an anar (power 6), the rest a spark pop
    anarPending = { x, power: coalesce ? 6 : null }; clearTimeout(anarTimer);
    anarTimer = setTimeout(() => { const a = anarPending; anarPending = null; if (a && !getState().calm) fire({ kind: 'anar', x: a.x, y: roofY(), power: a.power ?? getState().tone, rate: tier(110, 60, 24) }); }, coalesce ? 650 : 120);
  });
  // C4 all five lit: rockets bloom behind the skyline after the card closes
  on('diya:allLit', () => {
    if (duskPlayed) return; duskPlayed = true;
    if (hooks.choreo && hooks.choreo('allLit', {})) return; // elevation: the cue-sheet choreography takes over
    const t0 = performance.now(), go = () => {
      const s = getState(); if (s.lampCard && performance.now() - t0 < 20000) return setTimeout(go, 400);
      const W = innerWidth, H = innerHeight, targets = [[0.3, 'chrysanthemum', 1.4], [0.7, 'willow', 3.2], [0.5, 'chrysanthemum', 5.0]];
      const plan = s.quality === 'low' ? [targets[1]] : s.quality === 'mid' ? targets.slice(0, 2) : targets;
      const stillGlows = s.calm || s.ink || s.lampCard;
      plan.forEach(([fx, shape, at]) => setTimeout(() => {
        const st = getState(); if (document.hidden || window.scrollY > (document.getElementById('lamp-5') || document.body).offsetTop + innerHeight * 2) return;
        if (stillGlows || st.calm) glow({ x: W * fx, y: H * 0.28, r: 140, color: st.ink ? 'rgba(255,243,220,.3)' : 'rgba(255,210,122,.3)', fadeIn: 2400, hold: 0, fadeOut: 0 });
        else fire({ kind: 'rocket', x: W * fx, y: roofY(), tx: W * fx, ty: H * 0.28, shape });
      }, at * 1000));
      if (!stillGlows) setTimeout(() => !getState().calm && emit('fx:burst', { kind: 'petals', x: W / 2, y: 0, count: 12 }), 7500);
    };
    setTimeout(go, 1500);
  });
  // C8 the visitor's lamp: spark, a tall soft anar, and a flight of row lanterns (one per diya in the count, up to 12, the visitor's last and brightest)
  on('diya:visitorLit', ({ x, y }) => {
    if (vlPlayed) return; vlPlayed = true; const s = getState();
    if (hooks.choreo && hooks.choreo('visitorLit', { x, y })) return;
    if (s.calm) { glow({ x, y, r: 110, color: 'rgba(255,210,122,.45)', fadeIn: 800, hold: 3000, fadeOut: 1500 }); return; }
    fire({ kind: 'spark', x, y, count: tier(12, 8, 5) }); fire({ kind: 'anar', x, y, power: 6, rate: tier(110, 60, 24) });
    const n = Math.min(12, s.row.count - 1), maxL = tier(13, 8, 3), count = Math.min(n, maxL - 1);
    for (let k = 0; k < count; k++) setTimeout(() => emit('fx:burst', { kind: 'lantern', x: innerWidth * ((k + 1) / (count + 2)), y: innerHeight * 0.9, count: 1 }), 300 * k);
    setTimeout(() => emit('fx:burst', { kind: 'lantern', x: x || innerWidth / 2, y: innerHeight * 0.9, count: 1, bright: true }), 300 * count + 200);
  });
  // C6 wish ready
  on('wish:ready', ({ el }) => {
    const r = el && el.getBoundingClientRect && el.getBoundingClientRect(); if (!r) return; const s = getState(), cx = r.left + r.width / 2, cy = r.top + r.height / 2;
    if (s.calm) { glow({ x: cx, y: cy, r: 180, color: 'rgba(255,179,71,.35)', fadeIn: 800, hold: 0, fadeOut: 0 }); return; }
    const n = tier(8, 4, 0); for (let k = 0; k < n; k++) setTimeout(() => emit('fx:burst', { kind: 'twinkle', x: cx + Math.cos(k / n * 6.28) * r.width * 0.55 - 40, y: cy + Math.sin(k / n * 6.28) * r.height * 0.5 - 40 }), k * 150);
    floatCard(el);
  });
  // C7 wish sent: a copy of the card rises like a paper lantern; the real card stays
  on('wish:sent', () => releaseCard(document.querySelector('.stage-wrap')));
  startAmbient(); startSparkler(); startDelights();
}

// ---- floating card ----
let parallaxOn = null;
export function floatCard(el) {
  const host = el && el.closest('.card-stage'); if (!host || parallaxOn === host) return; parallaxOn = host; let last = window.scrollY, cur = 0;
  const h = () => { if (getState().calm) { host.style.transform = ''; return; } cur += ((Math.max(-14, Math.min(14, -0.04 * (window.scrollY - last)))) - cur) * 0.12; host.style.transform = `translateY(${cur.toFixed(1)}px)`; last += (window.scrollY - last) * 0.3; };
  window.addEventListener('scroll', h, { passive: true });
}
export function releaseCard(el) {
  if (!el) return; const a = el.querySelector('canvas.art'), t = el.querySelector('canvas.txt'); if (!a || !t) return;
  const r = el.getBoundingClientRect(), c = document.createElement('canvas'); c.width = a.width; c.height = a.height; const g = c.getContext('2d'); g.drawImage(a, 0, 0); g.drawImage(t, 0, 0); // a picture only; no words go anywhere else
  c.setAttribute('aria-hidden', 'true'); c.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;z-index:7;pointer-events:none;border-radius:4px`; document.body.appendChild(c);
  if (getState().calm) { c.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 600 }).onfinish = () => c.remove(); return; }
  const dy = -innerHeight * 0.9; c.animate([{ transform: 'translate(0,0) scale(1)', opacity: 1 }, { transform: `translate(12px,${dy * 0.5}px) scale(.95)`, opacity: 1, offset: 0.5 }, { transform: `translate(-12px,${dy}px) scale(.9)`, opacity: 0 }], { duration: 2600, easing: 'cubic-bezier(.5,0,1,.5)' }).onfinish = () => c.remove();
  let k = 0; const id = setInterval(() => { if (++k > 8) return clearInterval(id); emit('fx:burst', { kind: 'ember', x: r.left + r.width / 2, y: r.top + r.height * 0.5 + dy * (k / 8) * 0.8, count: 1 }); }, 120);
}
export const FxDirector = { floatCard, releaseCard };

// ---- ambient life: petals, fireflies, sky lamps (soft, aria-hidden, under the caps) ----
function startAmbient() {
  setInterval(() => {
    const s = getState(); if (s.calm || document.hidden) return;
    const lit = s.litCount;
    if (lit > 0 && countType(T.petal) < Math.round(tier(18, 10, 4) * lit / 5)) spawn({ type: T.petal, x: Math.random() * innerWidth, y: -10, vy: 40 + Math.random() * 30, life: 9 + Math.random() * 5, size: 13, ph: Math.random() * 6, a: 0.8, prio: 1 });
    if (countType(T.firefly) < tier(8, 5, 2)) spawn({ type: T.firefly, x: Math.random() * innerWidth, y: innerHeight * (0.5 + Math.random() * 0.4), life: 24, size: 7, col: 0, a: 0.6, ph: Math.random() * 6, prio: 1, add: true });
    if (lit >= 3 && countType(T.lantern) < tier(4, 3, 1)) spawn({ type: T.lantern, x: Math.random() * innerWidth, y: innerHeight + 10, vy: -(innerHeight / 35), life: 33, size: 26, ph: Math.random() * 6, a: 0.7, prio: 1 });
  }, 1500);
}

// ---- phuljhadi: press and hold about half a second on empty sky and your finger becomes a sparkler ----
const emptyTarget = (t) => t === document.documentElement || t === document.body || t.id === 'root' || t.id === 'main' || t.classList.contains('sec');
function startSparkler() {
  let timer = 0, x0 = 0, y0 = 0, active = null, whisperShown = false, pid = -1;
  const blocked = () => { const s = getState(); return s.calm || s.ink || document.querySelector('dialog[open]'); };
  const down = (e) => {
    if (blocked() || active || !emptyTarget(e.target) || e.clientY > innerHeight * 0.62) return;
    x0 = e.clientX; y0 = e.clientY; pid = e.pointerId; clearTimeout(timer);
    timer = setTimeout(() => begin(x0, y0), 450);
  };
  const mv = (e) => { if (timer && Math.hypot(e.clientX - x0, e.clientY - y0) > 10) { clearTimeout(timer); timer = 0; } };
  const up = () => { clearTimeout(timer); timer = 0; if (active) { active.lifted = true; active.endAt = performance.now() + 1500; } };
  function begin() {
    timer = 0; const wire = document.createElement('i'); wire.className = 'sparkler-wire'; wire.setAttribute('aria-hidden', 'true'); document.body.appendChild(wire);
    const s = { x: x0, y: y0, tx: x0, ty: y0, t0: performance.now(), lifted: false, endAt: 0, buzz: 0, last: performance.now(), wire };
    active = s; document.documentElement.classList.add('sparkling');
    const block = (e) => e.preventDefault(); document.addEventListener('touchmove', block, { passive: false }); document.addEventListener('contextmenu', block);
    const mm = (e) => { if (!s.lifted) { const dx = e.clientX - s.tx, dy = e.clientY - s.ty; s.pvx = dx; s.pvy = dy; s.tx = e.clientX; s.ty = e.clientY; if (s.buzz < 6 && Math.hypot(dx, dy) > 30) { s.buzz++; haptic(6); } } };
    window.addEventListener('pointermove', mm);
    const trail = []; const loop = setInterval(() => {
      const now = performance.now(), el = (now - s.t0) / 1000, dt = (now - s.last) / 1000; s.last = now;
      if (getState().calm || el > 8 || (s.lifted && now > s.endAt) || document.hidden) { clearInterval(loop); window.removeEventListener('pointermove', mm); document.removeEventListener('touchmove', block); document.removeEventListener('contextmenu', block); wire.remove(); document.documentElement.classList.remove('sparkling'); active = null; return; }
      s.x += (s.tx - s.x) * 0.18; s.y += (s.ty - s.y) * 0.18;
      const I = Math.max(0, 1 - Math.pow(el / 8, 1.6)), perSec = tier(90, 60, 30) * I, n = perSec * dt + Math.random();
      for (let k = 0; k < Math.floor(n); k++) { const a = Math.random() * 6.28, v = (60 + Math.random() * 120) * (0.5 + 0.5 * I); spawn({ type: T.sparkler, x: s.x, y: s.y, vx: Math.cos(a) * v + (s.pvx || 0) * 3, vy: Math.sin(a) * v + (s.pvy || 0) * 3, life: 0.35 + Math.random() * 0.55, size: 6 + Math.random() * 3, col: 0, grav: 520, drag: 0.98, a: 0.8, prio: 3, add: true, cool: true }); }
      trail.push([s.x, s.y]); if (trail.length > 12) trail.shift(); if (trail.length > 6) spawn({ type: T.trail, x: trail[0][0], y: trail[0][1], life: 0.3, size: 7, col: 1, a: 0.5, prio: 2, add: true });
      const len = 8 + 28 * I; wire.style.cssText = `left:${s.x}px;top:${s.y}px;height:${len}px`;
    }, 33);
  }
  window.addEventListener('pointerdown', down); window.addEventListener('pointermove', mv); window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up);
  on('diya:lit', ({ n }) => { if (n === 2 && !whisperShown && !getState().calm && !getState().ink) { whisperShown = true; const w = document.createElement('div'); w.className = 'whisper'; w.setAttribute('aria-hidden', 'true'); w.textContent = X('whisper'); document.body.appendChild(w); setTimeout(() => { w.style.opacity = 0; setTimeout(() => w.remove(), 900); }, 5000); } });
}

// ---- little delights: chakri on the rangoli floor, a shooting star on a quick tap of the sky ----
function startDelights() {
  let timer = 0, x0 = 0, y0 = 0, lastC = 0, alive = 0, lastT = 0, t0 = 0;
  const blocked = () => { const s = getState(); return s.calm || s.ink || document.querySelector('dialog[open]'); };
  window.addEventListener('pointerdown', (e) => {
    if (blocked() || !emptyTarget(e.target)) return; x0 = e.clientX; y0 = e.clientY; t0 = performance.now();
    if (e.clientY >= innerHeight * 0.62 && e.clientY < innerHeight * 0.9) timer = setTimeout(() => { const now = performance.now(); if (alive >= 2 || now - lastC < 1500) return; alive++; lastC = now; emit('fx:burst', { kind: 'chakri', x: x0, y: y0 }); setTimeout(() => { alive--; glow({ x: x0, y: y0, r: 70, color: 'rgba(255,179,71,.45)', fadeIn: 200, hold: 100, fadeOut: 1200 }); }, 3200); }, 450);
  });
  window.addEventListener('pointermove', (e) => { if (timer && Math.hypot(e.clientX - x0, e.clientY - y0) > 10) { clearTimeout(timer); timer = 0; } });
  window.addEventListener('pointerup', (e) => { clearTimeout(timer); timer = 0; const now = performance.now(); if (blocked() || !emptyTarget(e.target) || now - t0 > 250 || Math.hypot(e.clientX - x0, e.clientY - y0) > 10 || e.clientY > innerHeight * 0.62 || now - lastT < 700) return; lastT = now; emit('fx:burst', { kind: 'twinkle', x: e.clientX, y: e.clientY }); });
}
