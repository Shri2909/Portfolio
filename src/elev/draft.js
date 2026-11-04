// Memory-only rangoli draft (E6.2). Never written to storage, the address bar or the network.
let s = { strokes: [], folds: 8, mirror: true, preset: null };
const subs = new Set();
export const draft = {
  get: () => s,
  set(p) { s = { ...s, ...p }; subs.forEach((f) => f()); },
  clear() { s = { strokes: [], folds: s.folds, mirror: s.mirror, preset: null }; subs.forEach((f) => f()); },
  subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  count: () => s.strokes.length + (s.preset ? 1 : 0),
};
