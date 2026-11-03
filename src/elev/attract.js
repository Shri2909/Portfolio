// E3.6: idle attract. After 6 s with no input (and nothing lit), the host flame leans toward lamp 1, the wick answers with a
// faint glow and one ember drifts part-way: an invitation, three times, never a nag. Any input cancels within a frame.
// Afterwards (and in Calm, from the start) a still 35% warm dot stays on lamp 1's wick. No text, no audio.
import { getState } from '../lib/store.js';
import { emit } from '../lib/events.js';
import { engine } from '../lib/flame.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { registerEffect, isOn } from './budget.js';
import { hostWick } from './opening.js';

let offs = [], timer = 0, cycle = 0, last = performance.now(), live = null, dot = null, unreg = null, raf = 0;
const blocked = () => { const s = getState(); return s.calm || s.ink || s.litCount > 0 || document.hidden || document.querySelector('dialog[open]') || scrollY > 0.4 * innerHeight || document.documentElement.getAttribute('data-open') === 'cold'; };
function placeDot() { if (!dot) return; const w = lampRegistry.wick(1); if (w) { dot.style.left = w.x - 5 + 'px'; dot.style.top = w.y - 5 + 'px'; } }
function ensureDot() { if (dot) return dot; dot = document.createElement('i'); dot.className = 'attract-dot'; dot.setAttribute('aria-hidden', 'true'); dot.setAttribute('data-e', '1'); document.body.appendChild(dot); placeDot(); return dot; }
function stillCue() { if (getState().litCount > 0) { dot && dot.remove(); dot = null; return; } const d = ensureDot(); d.classList.add('rest'); placeDot(); }
function reset() { live && live.forEach((a) => { try { a.cancel(); } catch {} }); live = null; engine.set(0, { leanExtra: 0, scale: 1 }); }
function run() {
  timer = 0; if (cycle >= 3 || blocked() || !isOn('attract') || performance.now() - last < 2800) return schedule(cycle >= 3 ? 0 : 1200);
  cycle++; emit('cue:play', { name: 'attract:start' });
  const q = getState().quality, d = ensureDot(); d.classList.remove('rest'); placeDot();
  engine.set(0, { leanExtra: 9, scale: 1.075 });
  live = [];
  if (q !== 'low') live.push(d.animate([{ opacity: 0 }, { opacity: 0.35, offset: 0.5 }, { opacity: 0 }], { duration: 1000, delay: 400, easing: 'ease-in-out', fill: 'both' }));
  if (q === 'high') { const a = hostWick(); a && emit('fx:burst', { kind: 'ember', x: a.x, y: a.y, count: 1 }); }
  timer = setTimeout(() => { reset(); emit('cue:play', { name: 'attract:stop' }); if (cycle >= 3) stillCue(); else schedule(9000 - 2600); }, 2600);
}
function schedule(ms) { clearTimeout(timer); if (cycle >= 3 && !ms) { stillCue(); return; } timer = setTimeout(run, ms); }
function cancel() { last = performance.now(); if (live || (timer && cycle > 0 && !dot?.classList.contains('rest'))) { reset(); emit('cue:play', { name: 'attract:stop' }); clearTimeout(timer); if (cycle < 3) schedule(9000); else stillCue(); } }
export function start() {
  unreg = registerEffect({ id: 'attract', kind: 'dom', priority: 5, ms: 0.1, onShed: reset });
  const ev = ['pointerdown', 'keydown', 'wheel', 'touchstart', 'scroll', 'focusin']; ev.forEach((e) => addEventListener(e, cancel, { passive: true, capture: true }));
  let lm = 0; const mv = (e) => { if (Math.hypot(e.clientX - lm, 0) > 8) cancel(); lm = e.clientX; }; addEventListener('pointermove', mv, { passive: true });
  const rp = () => { raf = 0; placeDot(); }; const sc = () => { if (dot && !raf) raf = requestAnimationFrame(rp); }; addEventListener('scroll', sc, { passive: true }); addEventListener('resize', sc);
  offs.push(() => { ev.forEach((e) => removeEventListener(e, cancel, true)); removeEventListener('pointermove', mv); removeEventListener('scroll', sc); removeEventListener('resize', sc); });
  const s = getState();
  if (s.calm) { setTimeout(stillCue, 300); return; }
  schedule(Math.max(500, 6000 - performance.now()));
}
export function stop() { offs.splice(0).forEach((f) => f()); clearTimeout(timer); reset(); dot && dot.remove(); dot = null; unreg && unreg(); cancelAnimationFrame(raf); }
export const name = 'attract';
