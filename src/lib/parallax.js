import { ticker } from './ticker.js';
import { getState } from './store.js';
// Pointer (desktop) or Tilt (phones, opt-in) parallax. Far 0.2, mid 0.5, near 1.0, sky 0.05. Max 10 px.
const cur = { x: 0, y: 0 }, tgt = { x: 0, y: 0 };
let stop = null;
const apply = () => {
  document.querySelectorAll('[data-par]').forEach((el) => {
    const f = parseFloat(el.dataset.par);
    el.style.transform = `translate3d(${(cur.x * f * 10).toFixed(2)}px, ${(cur.y * f * 4).toFixed(2)}px, 0)`;
  });
};
const run = () => {
  if (stop) return;
  stop = ticker.add(() => {
    cur.x += (tgt.x - cur.x) * 0.08; cur.y += (tgt.y - cur.y) * 0.08;
    apply();
    if (Math.abs(tgt.x - cur.x) < 0.002 && Math.abs(tgt.y - cur.y) < 0.002) { stop(); stop = null; }
  });
};
export const parallaxTarget = (x, y) => {
  const s = getState();
  if (s.calm || s.quality === 'low') { tgt.x = tgt.y = 0; }
  else { tgt.x = Math.max(-1, Math.min(1, x)); tgt.y = Math.max(-1, Math.min(1, y)); }
  run();
};
export function startPointerParallax() {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  window.addEventListener('pointermove', (e) => parallaxTarget((e.clientX / innerWidth - 0.5) * 2, (e.clientY / innerHeight - 0.5) * 2), { passive: true });
}
