import { ticker } from './ticker.js';
import { getState, subscribe } from './store.js';
import { on } from './events.js';
import { CAPS } from './quality.js';

// ParticleCanvas engine: ONE shared canvas, a fixed pool in typed arrays, a few pre-rendered glow sprites, no allocation in the loop.
// Kinds: spark ember anar rocket chakri petals lantern twinkle phuljhadi ignite fizzle settle (unknown kinds are ignored) and glow (a DOM halo).
// Standing rules: no audio, effects are decorative, never show a number or a claim, peak alpha 0.8, biggest sprite 96 px,
// crackers (anar, rocket, chakri, phuljhadi) only after a reader action or a beat the reader triggered.
const N = 256, CAP = { high: 220, mid: 120, low: 40 }, DPRC = { high: 1.75, mid: 1.5, low: 1 };
const X = new Float32Array(N), Y = new Float32Array(N), VX = new Float32Array(N), VY = new Float32Array(N), AGE = new Float32Array(N), LIFE = new Float32Array(N), SZ = new Float32Array(N), GRAV = new Float32Array(N), DRAG = new Float32Array(N), A0 = new Float32Array(N), PH = new Float32Array(N), AUX = new Float32Array(N);
const COL = new Uint8Array(N), TYPE = new Uint8Array(N), ALIVE = new Uint8Array(N), PRIO = new Uint8Array(N), FLG = new Uint8Array(N); // FLG bit1 additive, bit2 cooling
const T = { spark: 1, ember: 2, star: 3, petal: 4, lantern: 5, firefly: 6, sparkler: 7, twinkle: 8, trail: 9 };
const AMBIENT = new Set([T.ember, T.petal, T.lantern, T.firefly]);
const HEX = ['#FFD27A', '#FFB347', '#FF7A1A', '#FFF3DC', '#F5A623', '#C2410C', '#6b2a06'];
let cv = null, ctx = null, sprites = [], petals = [], lantern = null, dpr = 1, live = 0, stopLoop = null, lastT = 0, skip = 0, free = 0, pointer = { x: 0, y: 0 };
const rnd = (a, b) => a + Math.random() * (b - a);
export const fxLights = []; // [{x,y}] positions of lit lamps, for fireflies

function mkSprite(c, s = 32) { const k = document.createElement('canvas'); k.width = k.height = s; const g = k.getContext('2d'), r = g.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2); r.addColorStop(0, c); r.addColorStop(0.3, c); r.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = r; g.fillRect(0, 0, s, s); return k; }
function mkPetal(c, tilt) { const k = document.createElement('canvas'); k.width = k.height = 20; const g = k.getContext('2d'); g.translate(10, 10); g.rotate(tilt); g.fillStyle = c; g.beginPath(); g.ellipse(0, 0, 7, 3.2, 0, 0, 7); g.fill(); return k; }
function mkLantern() { const k = document.createElement('canvas'); k.width = 18; k.height = 26; const g = k.getContext('2d'); const r = g.createRadialGradient(9, 15, 0, 9, 15, 12); r.addColorStop(0, 'rgba(255,210,122,.95)'); r.addColorStop(1, 'rgba(255,122,26,0)'); g.fillStyle = r; g.fillRect(0, 0, 18, 26); g.fillStyle = '#FFB347'; g.beginPath(); g.roundRect ? g.roundRect(3, 5, 12, 16, 4) : g.rect(3, 5, 12, 16); g.fill(); g.fillStyle = '#FFD27A'; g.fillRect(6, 9, 6, 8); return k; }

export function initFx() {
  cv = document.getElementById('fx'); if (!cv) return;
  ctx = cv.getContext('2d');
  sprites = HEX.map((c) => mkSprite(c)); petals = [0, 1, 2, 3, 4, 5].map((i) => mkPetal(i % 2 ? '#F5A623' : '#FFB347', i * 0.5)); lantern = mkLantern();
  const size = () => { const q = getState().quality; dpr = Math.min(window.devicePixelRatio || 1, DPRC[q]); cv.width = Math.round(innerWidth * dpr); cv.height = Math.round(innerHeight * dpr); };
  size(); window.addEventListener('resize', size);
  window.addEventListener('pointermove', (e) => { pointer.x = e.clientX; pointer.y = e.clientY; }, { passive: true });
  on('fx:burst', (d) => burst(d));
  on('fx:setQuality', () => { size(); trim(); });
  let wasCalm = getState().calm;
  subscribe(() => { const c = getState().calm; if (c && !wasCalm) fadeAll(0.4); wasCalm = c; if (c && cv) cv.style.visibility = 'hidden'; else if (cv) cv.style.visibility = ''; });
}
const cap = () => CAP[getState().quality];
export const liveCount = () => live;
export const countType = (t) => { let n = 0; for (let i = 0; i < N; i++) if (ALIVE[i] && TYPE[i] === t) n++; return n; };
export const TYPES = T;
function fadeAll(sec) { for (let i = 0; i < N; i++) if (ALIVE[i]) { const rem = LIFE[i] - AGE[i]; if (rem > sec) LIFE[i] = AGE[i] + sec; } }
function trim() { const c = cap(); let over = live - c; if (over <= 0) return; for (let i = 0; i < N && over > 0; i++) if (ALIVE[i] && PRIO[i] < 3) { LIFE[i] = Math.min(LIFE[i], AGE[i] + 0.33); over--; } }

// raw spawn: {x,y,vx,vy,life,size,col,grav,drag,a,type,prio,add,cool,ph,aux}
export function spawn(o) {
  const st = getState(); if (st.calm || !ctx) return -1;
  const c = cap(), prio = o.prio || 1;
  if (AMBIENT.has(o.type) && live > 0.7 * c) return -1;
  let idx = -1;
  for (let k = 0; k < N; k++) { const i = (free + k) % N; if (!ALIVE[i]) { idx = i; free = i + 1; break; } }
  if (live >= c || idx < 0) { // pool full: only higher priority may replace the oldest lower-priority particle
    let w = -1, wa = -1; for (let i = 0; i < N; i++) if (ALIVE[i] && PRIO[i] < prio && AGE[i] > wa) { wa = AGE[i]; w = i; }
    if (w < 0) return -1; idx = w; live--;
  }
  const i = idx; ALIVE[i] = 1; live++;
  X[i] = o.x; Y[i] = o.y; VX[i] = o.vx || 0; VY[i] = o.vy || 0; AGE[i] = 0; LIFE[i] = o.life; SZ[i] = Math.min(96, o.size || 8); COL[i] = o.col || 0; GRAV[i] = o.grav || 0; DRAG[i] = o.drag || 1; A0[i] = Math.min(0.8, o.a == null ? 0.7 : o.a);
  TYPE[i] = o.type || T.spark; PRIO[i] = prio; FLG[i] = (o.add ? 1 : 0) | (o.cool ? 2 : 0); PH[i] = o.ph || 0; AUX[i] = o.aux || 0;
  if (!stopLoop) { lastT = 0; stopLoop = ticker.add(frame); }
  return i;
}
function frame(dt) {
  const st = getState();
  if (!live) { if (ctx) ctx.clearRect(0, 0, cv.width, cv.height); stopLoop && stopLoop(); stopLoop = null; return; }
  let ambientOnly = true; for (let i = 0; i < N; i++) if (ALIVE[i] && !AMBIENT.has(TYPE[i])) { ambientOnly = false; break; }
  if (ambientOnly) { skip ^= 1; if (skip) return; dt *= 2; } // ambient only: 30 fps
  const s = Math.min(dt, 64) / 1000, add = st.quality === 'high', ink = st.ink;
  ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, cv.width, cv.height); ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  for (let pass = 0; pass < 2; pass++) {
    ctx.globalCompositeOperation = pass ? 'lighter' : 'source-over';
    for (let i = 0; i < N; i++) {
      if (!ALIVE[i]) continue;
      if (pass === 0) { // integrate once
        AGE[i] += s;
        if (AGE[i] >= LIFE[i]) { ALIVE[i] = 0; live--; continue; }
        const t = TYPE[i];
        if (t === T.firefly) { const k = AGE[i] * 0.4 + PH[i]; let tx = Math.cos(k * 1.3) * 18, ty = Math.sin(k * 0.9) * 12; for (let q = 0; q < fxLights.length; q++) { const L = fxLights[q], dx = L.x - X[i], dy = L.y - Y[i]; if (dx * dx + dy * dy < 25600) { tx += dx * 0.25; ty += dy * 0.25; } } VX[i] += (tx - VX[i]) * s; VY[i] += (ty - VY[i]) * s; }
        else if (t === T.petal) { VX[i] = Math.sin(AGE[i] * 1.2 + PH[i]) * 30; }
        else if (t === T.lantern) { VX[i] = Math.sin(AGE[i] * 0.9 + PH[i]) * 12; }
        const d = Math.pow(DRAG[i], s * 60); VX[i] *= d; VY[i] = VY[i] * d + GRAV[i] * s; X[i] += VX[i] * s; Y[i] += VY[i] * s;
        if (t === T.sparkler) { AUX[i] = 0; }
      }
      const f = AGE[i] / LIFE[i], isAdd = (FLG[i] & 1) && add; if ((pass === 1) !== !!isAdd) continue;
      let a = A0[i] * (f < 0.08 ? f / 0.08 : 1) * (1 - Math.pow(f, 2.2)); if (TYPE[i] === T.firefly) a = A0[i] * (0.5 + 0.5 * Math.sin(AGE[i] * 1.7 + PH[i])) * Math.min(1, AGE[i]) * Math.min(1, (LIFE[i] - AGE[i]));
      if (TYPE[i] === T.lantern || TYPE[i] === T.petal) a = A0[i] * Math.min(1, AGE[i] * 0.8) * Math.min(1, (LIFE[i] - AGE[i]) * 0.8);
      if (a <= 0.01) continue; ctx.globalAlpha = a; const sz = SZ[i], t = TYPE[i];
      if (t === T.petal) { ctx.drawImage(petals[(i + Math.floor(AGE[i] * 2)) % 6], X[i] - sz / 2, Y[i] - sz / 2, sz, sz); continue; }
      if (t === T.lantern) { ctx.drawImage(lantern, X[i] - sz * 0.35, Y[i] - sz * 0.5, sz * 0.7, sz); continue; }
      let c = COL[i]; if (FLG[i] & 2) c = f < 0.2 ? 3 : f < 0.45 ? 0 : f < 0.7 ? 1 : f < 0.88 ? 2 : 6; if (ink) c = 3;
      ctx.drawImage(sprites[c], X[i] - sz / 2, Y[i] - sz / 2, sz, sz);
    }
  }
  ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
}

// ---- halos (kind "glow"): a still DOM halo, also the Calm replacement for most effects ----
export function glow({ x, y, r = 90, color = 'rgba(255,179,71,.45)', fadeIn = 1200, hold = 1600, fadeOut = 1200 }) {
  const host = document.getElementById('fx-glows'); if (!host) return;
  const d = document.createElement('i'); d.className = 'fx-halo'; d.style.cssText = `left:${x}px;top:${y}px;width:${r * 2}px;height:${r * 2}px;background:radial-gradient(circle,${color},transparent 68%);transition:opacity ${fadeIn}ms ease`;
  host.appendChild(d); requestAnimationFrame(() => { d.style.opacity = 1; });
  if (fadeOut > 0) setTimeout(() => { d.style.transition = `opacity ${fadeOut}ms ease`; d.style.opacity = 0; setTimeout(() => d.remove(), fadeOut + 50); }, fadeIn + hold);
}

// ---- kinds ----
const tier = (a, b, c) => ({ high: a, mid: b, low: c }[getState().quality]);
export function burst(d) {
  const st = getState(), { kind, x, y } = d; if (!kind || x == null) return;
  const calm = st.calm, ink = st.ink;
  if (ink && (kind === 'anar' || kind === 'rocket' || kind === 'chakri' || kind === 'phuljhadi')) return; // crackers dropped in Ink
  if (calm) { // Calm: every effect becomes a still glow or nothing
    if (kind === 'anar') glow({ x, y, r: 90, color: 'rgba(255,179,71,.5)', fadeIn: 1200, hold: 1600, fadeOut: 1200 });
    else if (kind === 'rocket') glow({ x: d.tx ?? x, y: d.ty ?? y, r: 140, color: 'rgba(255,210,122,.3)', fadeIn: 2400, hold: 0, fadeOut: 0 });
    else if (kind === 'glow') glow({ x, y, r: d.radius || 90, color: d.color || 'rgba(255,179,71,.45)', hold: d.hold || 1600 });
    return;
  }
  switch (kind) {
    case 'spark': for (let k = 0; k < (d.count || 8); k++) { const a = rnd(0, 6.28), v = rnd(30, 110); spawn({ type: T.spark, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(0.3, 0.6), size: rnd(5, 9), col: k % 3 ? 0 : 1, drag: 0.94, a: 0.8, prio: 2, add: true, cool: true }); } break;
    case 'ignite': for (let k = 0; k < 10; k++) { const a = (k / 10) * 6.28; spawn({ type: T.spark, x, y, vx: Math.cos(a) * 70, vy: Math.sin(a) * 70, life: 0.45, size: 8, col: k % 2 ? 0 : 1, drag: 0.93, a: 0.8, prio: 2, add: true }); } break;
    case 'fizzle': for (let k = 0; k < 3; k++) spawn({ type: T.ember, x, y, vx: rnd(-12, 12), vy: rnd(-14, -4), life: 0.7, size: 6, col: 2, a: 0.5, prio: 1 }); break;
    case 'settle': for (let k = 0; k < 12; k++) { const a = (k / 12) * 6.28; spawn({ type: T.ember, x: x + Math.cos(a) * 18, y: y + Math.sin(a) * 6, vx: Math.cos(a) * 14, vy: rnd(-34, -20), life: 2, size: 7, col: k % 2 ? 4 : 0, a: 0.6, prio: 1, add: true }); } break;
    case 'ember': for (let k = 0; k < (d.count || 1 + Math.floor(Math.random() * 2)); k++) spawn({ type: T.ember, x, y, vx: rnd(-8, 8) + (d.dir || 0) * 12, vy: -rnd(20, 40), life: rnd(1.5, 3), size: rnd(4, 7), col: 1, a: 0.55, prio: 1 }); break;
    case 'twinkle': spawn({ type: T.twinkle, x, y, vx: 160 / 0.7 * 0.7, vy: 160 / 0.7 * 0.7, life: 0.7, size: 14, col: 3, a: 0.8, prio: 2, add: true }); for (let k = 1; k <= 6; k++) spawn({ type: T.trail, x: x - k * 10, y: y - k * 10, vx: 160, vy: 160, life: 0.3 + k * 0.04, size: 8 - k, col: 0, a: 0.5, prio: 1, add: true }); break;
    case 'petals': for (let k = 0; k < Math.min(24, d.count || 6); k++) spawn({ type: T.petal, x: x + rnd(-40, 40), y, vy: rnd(40, 70), life: rnd(9, 14), size: 13, ph: rnd(0, 6), a: 0.8, prio: 1 }); break;
    case 'lantern': for (let k = 0; k < Math.min(12, d.count || 1); k++) spawn({ type: T.lantern, x: x + (k - 1) * 22, y, vy: -rnd(26, 34), life: rnd(8, 13), size: d.bright ? 36 : 26, ph: rnd(0, 6), a: d.bright ? 0.8 : 0.7, prio: 1 }); break;
    case 'anar': { // fountain, cone +-18 deg, scaled by power; one alive at a time
      const m = 0.4 + 0.6 * ((d.power ?? st.tone) / 6), rate = d.rate || tier(110, 60, 24); let n = 0; const total = Math.round(rate * m * 2.2 * 0.5);
      const id = setInterval(() => { if (getState().calm || ++n > 22) return clearInterval(id); for (let k = 0; k < Math.ceil(total / 22); k++) { const a = -Math.PI / 2 + rnd(-0.314, 0.314), v = rnd(260, 420) * m; spawn({ type: T.spark, x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rnd(0.6, 1.2), size: rnd(5, 8), col: 0, grav: 600, drag: 0.99, a: 0.75, prio: 2, add: true, cool: true }); } }, 100); break; }
    case 'chakri': { let n = 0; const id = setInterval(() => { if (getState().calm || ++n > 32) return clearInterval(id); const w = 6 + (1 - n / 32) * 2, a = n * w * 0.35, r = 40 * Math.sin(n * 0.2); for (let arm = 0; arm < 2; arm++) { const t = a + arm * Math.PI; spawn({ type: T.spark, x: x + r * Math.cos(n * 0.2), y: y + r * 0.4 * Math.sin(n * 0.2), vx: Math.cos(t) * 90, vy: Math.sin(t) * 40, life: 0.5, size: 6, col: 0, drag: 0.95, a: 0.7, prio: 2, add: true, cool: true }); } }, 100); break; }
    case 'rocket': rocket(d); break;
    default: break; // unknown kinds are ignored, never an error
  }
}
function rocket(d) {
  const { x, y } = d, tx = d.tx ?? x, ty = d.ty ?? y * 0.4, dur = rnd(1.4, 1.9), sh = d.shape || 'chrysanthemum'; let t = 0;
  const id = setInterval(() => { if (getState().calm || document.hidden) return; t += 0.05; const k = Math.min(1, t / dur), px = x + (tx - x) * k + Math.sin(k * 14) * 3, py = y + (ty - y) * (1 - Math.pow(1 - k, 2)); spawn({ type: T.trail, x: px, y: py, life: 0.3, size: 6, col: 1, a: 0.6, prio: 2, add: true }); spawn({ type: T.spark, x: px, y: py, life: 0.2, size: 8, col: 0, a: 0.8, prio: 3, add: true });
    if (k >= 1) { clearInterval(id); const n = sh === 'willow' ? tier(40, 24, 10) : tier(54, 32, 14); for (let q = 0; q < n; q++) { const a = (q / n) * 6.28 + rnd(-0.05, 0.05), v = sh === 'willow' ? rnd(80, 110) : rnd(110, 150); spawn({ type: T.star, x: px, y: py, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: sh === 'willow' ? rnd(3.6, 4.5) : rnd(2.4, 3.2), size: sh === 'willow' ? 10 : 8, col: sh === 'willow' ? 0 : q % 2, grav: sh === 'willow' ? 70 : 40, drag: sh === 'willow' ? 0.985 : 0.965, a: 0.65, prio: 2, add: true }); } } }, 50);
}
export const fxPointer = pointer;
