// E8.3 hooks (minimal): every elevation effect registers an id, a kind and a shed() so the governor can drop it.
const fx = new Map();
export const registry = {
  register(id, { kind = 'ambient', cost = 0.5, shed = null } = {}) { fx.set(id, { id, kind, cost, shed, shed_n: 0 }); return () => fx.delete(id); },
  shed(id) { const e = fx.get(id); if (e && e.shed) { e.shed(); e.shed_n++; } },
  shedKind(kind) { fx.forEach((e) => { if (e.kind === kind) this.shed(e.id); }); },
  list() { return [...fx.values()]; },
};
