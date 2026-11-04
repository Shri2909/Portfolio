// Compatibility wrapper: the effect registry now lives in budget.js (E8.3).
import { registerEffect, shed, shedList, list } from './budget.js';
export const registry = { register(id, o = {}) { return registerEffect({ still: 'finished glowing frame, nothing moving (Calm)', id, kind: o.kind === 'light' ? 'canvas' : 'dom', priority: o.priority || 5, ms: o.cost || 0.3, onShed: o.shed || null, onRestore: o.restore || null }); }, shed, shedKind() {}, list };
