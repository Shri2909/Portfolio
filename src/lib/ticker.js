// One shared animation ticker. Stops completely when the tab is hidden or nobody is listening.
const subs = new Set();
let raf = 0, last = 0;
const frame = (t) => {
  raf = 0;
  if (document.hidden || !subs.size) { last = 0; return; }
  const dt = last ? Math.min(t - last, 100) : 16.7;
  last = t;
  for (const fn of [...subs]) fn(dt, t);
  if (subs.size) raf = requestAnimationFrame(frame);
};
const kick = () => { if (!raf && !document.hidden && subs.size) { last = 0; raf = requestAnimationFrame(frame); } };
document.addEventListener('visibilitychange', () => { if (!document.hidden) kick(); else { cancelAnimationFrame(raf); raf = 0; last = 0; } });
export const ticker = {
  add(fn) { subs.add(fn); kick(); return () => { subs.delete(fn); }; },
  get running() { return !!raf; },
  get size() { return subs.size; },
};
