// E2.3 runtime half: marks the stage as moving while the camera travels, ripples windows, handles "cut by light" jumps.
// The poses themselves live in styles/elev/camera.css (individual translate/scale properties, so parallax's transform composes).
import { on } from '../lib/events.js';
import { getState } from '../lib/store.js';
import { play, stagger } from './motion.js';
import { CAMERA } from '../elevation.js';
import { registerEffect } from './budget.js';

let unreg = null;

let off = null, tMove = 0;
const lit = () => Array.from(document.querySelectorAll('#skyline .win')).filter((g) => g.style.opacity === '1' || getComputedStyle(g).opacity > 0.5); // lint:ok event-time read, not per frame
function ripple(toward = 'right', count = 12, step = 70) {
  const st = getState(); if (st.calm || st.quality === 'low') return;
  let ws = lit().map((g) => ({ g, x: g.getBoundingClientRect().left })).sort((a, b) => (toward === 'right' ? a.x - b.x : b.x - a.x)); // lint:ok event-time read, not per frame
  if (st.quality === 'mid') ws = ws.filter((_, i) => i % 2 === 0);
  const pick = ws.filter((_, i) => i % Math.max(1, Math.floor(ws.length / count)) === 0).slice(0, count), delays = stagger(pick.length, { step, total: 900 });
  pick.forEach(({ g }, i) => play(g, [{ opacity: 1 }, { opacity: 0.45, offset: 0.4 }, { opacity: 1 }], { dur: 'l', ease: 'inOutQuint', delay: delays[i], key: 'ripple' }));
}
export function start() {
  const root = document.documentElement, stage = document.getElementById('stage');
  if (CAMERA) { // the layer camera lives behind the governor: it is shed (priority 5) before DPR and particle caps, and restorable
    root.setAttribute('data-camera', '1');
    unreg = registerEffect({ id: 'camera-layers', kind: 'dom', priority: 5, ms: 1.5, onShed: () => root.removeAttribute('data-camera'), onRestore: () => root.setAttribute('data-camera', '1') });
  }
  off = on('stage:act', ({ id, prev, jump }) => {
    if (stage) { stage.classList.add('moving'); clearTimeout(tMove); tMove = setTimeout(() => stage.classList.remove('moving'), 1600 + 300 + 120); }
    if (jump) { const v = document.getElementById('veil'); v && play(v, [{ filter: 'brightness(1)' }, { filter: 'brightness(1.8)', offset: 0.5 }, { filter: 'brightness(1)' }], { dur: 240, ease: 'outQuart', key: 'cut' }); return; }
    if (id === 'baithak') ripple('left');
    else if (id === 'chhat' && prev === 'baithak') ripple('right');
    else if (id === 'vidaai') ripple('right', 12, 80);
    root.dataset.actAt = String(Math.round(performance.now()));
  });
}
export function stop() { off && off(); off = null; unreg && unreg(); unreg = null; document.documentElement.removeAttribute('data-camera'); clearTimeout(tMove); const s = document.getElementById('stage'); s && s.classList.remove('moving'); }
