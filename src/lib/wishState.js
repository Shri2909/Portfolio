// Tiny shared state for the wish step. Holds no words: only whether a card has been made, which theme, and the art seed.
import { makeSeed } from './cardRender.js';
let s = { made: false, theme: 'diya', seed: 1, v: 0 };
const subs = new Set();
export const wishState = {
  get: () => s,
  subscribe: (f) => { subs.add(f); return () => subs.delete(f); },
  set(p) { s = { ...s, ...p, v: s.v + 1 }; subs.forEach((f) => f()); },
  makeSeedFrom: (c) => makeSeed(c),
};
