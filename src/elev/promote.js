// E8.4: layer discipline. will-change exists only while something moves: promote(el, props, ms) adds .promoted
// (CSS holds the will-change) and removes it when the animation or transition ends, or after ms + 100.
// Hard cap: 6 / 4 / 2 promoted layers on high / mid / low; Calm promotes nothing.
import { getState } from '../lib/store.js';
const live = new Set();
export const LIMIT = { high: 6, mid: 4, low: 2 };
export const promotedCount = () => live.size;
export function promote(el, props = 'transform, opacity', ms = 1200) {
  const s = getState(); if (!el || s.calm || live.size >= (LIMIT[s.quality] || 2)) return () => {};
  if (props) el.style.willChange = props;
  el.classList.add('promoted'); live.add(el);
  let done = false;
  const end = () => { if (done) return; done = true; clearTimeout(t); el.removeEventListener('animationend', end); el.removeEventListener('transitionend', end); el.classList.remove('promoted'); el.style.willChange = ''; live.delete(el); };
  const t = setTimeout(end, ms + 100);
  el.addEventListener('animationend', end, { once: true }); el.addEventListener('transitionend', end, { once: true });
  return end;
}
export function releaseAll() { [...live].forEach((el) => { el.classList.remove('promoted'); el.style.willChange = ''; }); live.clear(); }
export const name = 'promote';
export const start = () => {};
export const stop = releaseAll;
