// E2.5: eased programmatic scroll that any input aborts, plus snap restraint hooks (CSS does the rest).
import { ticker } from '../lib/ticker.js';
import { getState } from '../lib/store.js';
import { hooks } from '../lib/events.js';
import { EASE } from './motion.js';
import { glide } from './stageDirector.js';

const root = document.documentElement;
const inOutQuint = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);
let off = null, abortFns = [], saved = null;
const finish = () => {
  off && off(); off = null; glide.on = false;
  abortFns.splice(0).forEach((f) => f());
  if (saved) { root.style.scrollSnapType = saved[0]; root.style.scrollBehavior = saved[1]; saved = null; }
};
export function scrollTo(y, { dur } = {}) {
  finish();
  const y0 = scrollY, dy = y - y0;
  if (getState().calm || Math.abs(dy) < 2) { scrollTo_instant(y); return; }
  const d = dur ?? Math.max(500, Math.min(1500, 380 + 0.42 * Math.abs(dy) ** 0.82));
  saved = [root.style.scrollSnapType, root.style.scrollBehavior];
  root.style.scrollSnapType = 'none'; root.style.scrollBehavior = 'auto'; glide.on = true;
  let t = 0;
  for (const e of ['wheel', 'touchstart', 'keydown', 'pointerdown']) { window.addEventListener(e, finish, { passive: true, once: true }); abortFns.push(() => window.removeEventListener(e, finish)); }
  off = ticker.add((dt) => {
    t += dt; const k = Math.min(1, t / d);
    window.scrollTo(0, y0 + dy * inOutQuint(k));
    if (k >= 1) finish();
  });
}
function scrollTo_instant(y) { const r = root.style.scrollBehavior; root.style.scrollBehavior = 'auto'; window.scrollTo(0, y); root.style.scrollBehavior = r; }
export const start = () => {
  hooks.scrollTo = (el) => {
    const top = el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0); // lint:ok event-time read, not per frame
    scrollTo(Math.max(0, top)); return true;
  };
};
export const stop = () => { finish(); hooks.scrollTo = null; };
export { EASE };
