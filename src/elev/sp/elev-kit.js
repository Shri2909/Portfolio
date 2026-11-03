// Shared set-piece kit (E5.1 step 0): spring, in-view, foreground hush, tier, effect registration.
import { getState, subscribe } from '../../lib/store.js';
import { emit } from '../../lib/events.js';
import { ticker } from '../../lib/ticker.js';
import { registerEffect, isOn } from '../budget.js';

export const tier = () => getState().quality;
export const still = () => { const s = getState(); return s.calm; };   // Calm and reduced motion: final state at once
export const ink = () => getState().ink;
export const spring = (s, target, { k = 170, c = 18 } = {}, dtMs = 16.7) => { const dt = Math.min(dtMs, 32) / 1000; s.v += (-k * (s.x - target) - c * s.v) * dt; s.x += s.v * dt; return s; };
export const easeOutQuint = (t) => 1 - (1 - t) ** 5;
export const inOutQuint = (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2);
export const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
let fgT = 0;
export function foreground(on, id = 'sp') { clearTimeout(fgT); if (on) emit('fx:foreground', { on: true, id }); else fgT = setTimeout(() => emit('fx:foreground', { on: false, id }), 1200); }
export function useInView(el, fn, threshold = 0.6) { const io = new IntersectionObserver(([e]) => fn(e.isIntersecting), { threshold }); io.observe(el); return () => io.disconnect(); }
export function effect(id, o) { return registerEffect({ id: 'sp-' + id, kind: o.kind || 'dom', priority: o.priority || 6, ms: o.ms || 0.5, onShed: o.shed, onRestore: o.restore }); }
export const alive = (id) => isOn('sp-' + id);
export const watch = (fn) => subscribe(fn);
export function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; e.setAttribute('data-e', '1'); e.setAttribute('aria-hidden', 'true'); return e; }
export { getState, emit, ticker };
