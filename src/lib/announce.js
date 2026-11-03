// One polite live region, English only. The App renders it from this tiny store.
let text = '';
const subs = new Set();
export const announce = (t) => {
  text = '';
  subs.forEach((f) => f());
  setTimeout(() => { text = t; subs.forEach((f) => f()); }, 30);
};
export const announcer = { subscribe: (f) => { subs.add(f); return () => subs.delete(f); }, get: () => text };
