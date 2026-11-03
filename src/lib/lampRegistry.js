// Where each lamp's wick tip is on screen (viewport pixels), so other parts can find it. 0 = the home flame.
const reg = new Map();
export const lampRegistry = {
  set(n, fn) { reg.set(n, fn); return () => reg.delete(n); },
  wick(n) { const f = reg.get(n); return f ? f() : null; },
};
