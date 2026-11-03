// E8.4 rules 4: pause every infinite CSS animation that is not on screen, and everything while the tab is hidden.
import { on } from '../lib/events.js';
let io = null, offs = [];
export const name = 'render';
export function start() {
  const root = document.documentElement;
  io = new IntersectionObserver((es) => es.forEach((e) => { e.target.dataset.off = e.isIntersecting ? '0' : '1'; }), { rootMargin: '10% 0px' });
  const watch = () => document.querySelectorAll('main section.sec').forEach((s) => io.observe(s));
  watch(); offs.push(on('stage:act', watch)); // sections that mount later are picked up on the next act
  const vis = () => { root.dataset.hidden = document.hidden ? '1' : '0'; };
  document.addEventListener('visibilitychange', vis); vis(); offs.push(() => document.removeEventListener('visibilitychange', vis));
}
export function stop() {
  io && io.disconnect(); io = null; offs.splice(0).forEach((f) => f());
  document.querySelectorAll('[data-off]').forEach((e) => delete e.dataset.off); delete document.documentElement.dataset.hidden;
}
