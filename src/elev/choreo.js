// E4.6: two silent firework choreographies as cue sheets on the shared ticker (no setTimeout chains):
// "Paanch diye" (starts 3.2 s after the fifth lamp) and "Aapka diya" (the visitor's lamp).
// Built from the existing fx kinds (rocket shapes, anar, lantern, petals, ember); the E4.5 particle rewrite is not shipped,
// so willow/chrysanthemum are the V3 shapes and crossette is approximated by a small chrysanthemum.
// Any tap, key, or scrolling more than a viewport away completes it into the resting state. Calm and Ink keep V3's still glows.
import { getState } from '../lib/store.js';
import { on, emit, hooks } from '../lib/events.js';
import { engine } from '../lib/flame.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { ticker } from '../lib/ticker.js';
import { light } from './light.js';
import { energy, setBias } from './energy.js';

const tier = (a, b, c) => ({ high: a, mid: b, low: c }[getState().quality]);
const W = () => innerWidth, H = () => innerHeight;
let run = null, stopT = null, offs = [], played = new Set(), recent = [];
const okRate = () => { const n = performance.now(); recent = recent.filter((t) => n - t < 500); if (recent.length >= 4) return false; recent.push(n); return true; };
const fire = (d) => { if (okRate()) emit('fx:burst', d); };
const wk = (n) => lampRegistry.wick(n) || { x: W() * (0.2 + 0.12 * n), y: H() * 0.75 };
const skyPulse = (fx, hue, a) => { const x = W() * fx, y = H() * 0.28; emit('bloom:set', { x, y, r: 160, i: 0.7, hue, dur: 700 }); light.pulse({ x, y, r: 260, i: 0.5, hue, attack: 60, decay: 440, amp: a }); };
const rocket = (n, fx, shape) => { const p = wk(n); fire({ kind: 'rocket', x: p.x, y: p.y, tx: W() * fx, ty: H() * 0.28, shape }); };
const cue = (name) => emit('choreo:cue', { name });

// seconds; each cue is [t, name, fn, minTier] (minTier: 2 high only, 1 mid and up, 0 all)
const ALL_LIT = [
  [0.0, 'hush', () => { setBias(0.85); engine.breathe(); }, 0],
  [0.8, 'inhale', () => { for (let n = 1; n <= 5; n++) engine.set(n, { glowBoost: 1.3 }); }, 0],
  [1.1, 'launch-1', () => rocket(3, 0.5, 'chrysanthemum'), 0],
  [2.4, 'first-star', () => skyPulse(0.5, 0, 0.3), 0],
  [3.6, 'tilt', () => { engine.wind(0.5); emit('fx:burst', { kind: 'petals', x: W() / 2, y: 0, count: tier(6, 4, 2) }); }, 0],
  [4.8, 'fountains', () => { [2, 4].forEach((n) => { const p = wk(n); fire({ kind: 'anar', x: p.x, y: p.y, power: 4, rate: tier(110, 60, 24) }); }); }, 1],
  [5.9, 'launch-2', () => rocket(2, 0.3, 'chrysanthemum'), 1],
  [6.15, 'launch-3', () => rocket(4, 0.7, 'chrysanthemum'), 2],
  [7.2, 'twin-willows', () => { rocket(2, 0.28, 'willow'); tier(1, 1, 0) && rocket(4, 0.72, 'willow'); skyPulse(0.5, 1, 0.3); }, 0],
  [8.4, 'lantern-rise', () => { [1, 3, 5].slice(0, tier(3, 2, 1)).forEach((n, k) => { const p = wk(n); setTimeout(() => emit('fx:burst', { kind: 'lantern', x: p.x, y: H() * 0.9, count: 1 }), 0 * k); }); }, 0],
  [9.6, 'crossette', () => rocket(3, 0.38, 'chrysanthemum'), 2],
  [10.7, 'launch-4', () => rocket(5, 0.62, 'chrysanthemum'), 1],
  [12.0, 'chrysanthemum', () => { rocket(3, 0.5, 'chrysanthemum'); skyPulse(0.5, 2, 0.4); energy.boost = true; }, 0],
  [13.0, 'gold-rain', () => emit('fx:burst', { kind: 'petals', x: W() / 2, y: 0, count: tier(12, 8, 4) }), 0],
  [13.8, 'exhale', () => { setBias(1); energy.boost = false; for (let n = 1; n <= 5; n++) engine.set(n, { glowBoost: 1.1 }); }, 0],
  [15.0, 'rest', () => {}, 0],
];
const VISITOR = (p) => [
  [0.0, 'ignition', () => { fire({ kind: 'spark', x: p.x, y: p.y, count: tier(10, 8, 4) }); light.pulse({ x: p.x, y: p.y, r: 160, i: 0.6, hue: 0, amp: 0.3 }); }, 0],
  [0.6, 'inhale', () => { for (let n = 0; n <= 5; n++) setTimeout(() => engine.set(n, { glowBoost: 1.2 }), n * 90); engine.set(30, { glowBoost: 1.5 }); }, 0],
  [2.4, 'tall-fountain', () => fire({ kind: 'anar', x: p.x, y: p.y, power: 6, rate: tier(110, 60, 24) }), 1],
  [4.8, 'lantern-flight', () => { const n = Math.min(6, Math.max(1, getState().row.count - 1)), c = Math.min(n, tier(5, 3, 1)); for (let k = 0; k < c; k++) setTimeout(() => emit('fx:burst', { kind: 'lantern', x: W() * ((k + 1) / (c + 2)), y: H() * 0.9, count: 1 }), 300 * k); setTimeout(() => emit('fx:burst', { kind: 'lantern', x: p.x || W() / 2, y: H() * 0.9, count: 1, bright: true }), 300 * c + 200); }, 0],
  [7.2, 'slow-peony', () => { fire({ kind: 'rocket', x: p.x, y: p.y, tx: W() * 0.5, ty: H() * 0.3, shape: 'chrysanthemum' }); skyPulse(0.5, 2, 0.3); }, 1],
  [9.6, 'unison', () => { for (let n = 0; n <= 5; n++) engine.set(n, { glowBoost: 1.25 }); engine.set(30, { glowBoost: 1.5 }); engine.breathe(); }, 0],
  [10.8, 'settle', () => { for (let n = 0; n <= 5; n++) engine.set(n, { glowBoost: 1 }); engine.set(30, { glowBoost: 1 }); }, 0],
  [12.0, 'rest', () => {}, 0],
];
const tierRank = () => ({ high: 2, mid: 1, low: 0 }[getState().quality]);
function rest(name) { setBias(1); energy.boost = false; for (let n = 0; n <= 5; n++) engine.set(n, { glowBoost: 1 }); engine.set(30, { glowBoost: 1 }); }
function play(name, sheet, delay, y0) {
  if (played.has(name)) return true; played.add(name);
  run = { name, sheet: sheet.slice().sort((a, b) => a[0] - b[0]), t: -delay, i: 0, y0 };
  stopT = ticker.add((dt) => {
    const s = getState(); if (!run) return;
    if (s.lampCard || document.hidden) return; // pauses while a lamp card is open
    run.t += dt / 1000;
    while (run.i < run.sheet.length && run.sheet[run.i][0] <= run.t) { const [, n, fn, min] = run.sheet[run.i++]; if (tierRank() >= min) { try { fn(); } catch { /* a cue never breaks the page */ } cue(n); } }
    if (run.i >= run.sheet.length) finish();
  });
  return true;
}
function finish() { run && rest(run.name); run = null; stopT && stopT(); stopT = null; }
function abort() { if (!run) return; // complete into the resting state, remaining cues are skipped (in-flight particles die naturally)
  finish(); }
const resolver = (name, d) => {
  const s = getState(); if (s.calm || s.ink) return false; // Calm and Ink: V3 still glows
  if (name === 'allLit') return play('allLit', ALL_LIT, 3.2, window.scrollY);
  if (name === 'visitorLit') return play('visitorLit', VISITOR({ x: d.x || W() / 2, y: d.y || H() * 0.6 }), 0, window.scrollY);
  return false;
};
export function start() {
  hooks.choreo = resolver;
  const a = () => abort(); ['pointerdown', 'keydown'].forEach((e) => window.addEventListener(e, a, { passive: true, capture: true }));
  const sc = () => { if (run && Math.abs(window.scrollY - run.y0) > H()) abort(); }; window.addEventListener('scroll', sc, { passive: true });
  offs.push(() => { ['pointerdown', 'keydown'].forEach((e) => window.removeEventListener(e, a, true)); window.removeEventListener('scroll', sc); });
}
export function stop() { hooks.choreo = null; offs.splice(0).forEach((f) => f()); finish(); played.clear(); }
export const name = 'choreo';
