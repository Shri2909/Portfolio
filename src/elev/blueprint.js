// E4.7: "hold a flame to the blueprint". On lamp six the engineering detail (grid, centre line, flame dots) shows only inside
// a circle of light that follows the pointer or finger, or keyboard focus on the sketch button; a one-shot auto-demo sweeps
// across when the section is first seen. The base outline is always visible. Calm and Ink show all detail, no animation.
// Nothing is revealed only by light: the plain text twin carries the same facts.
import { getState, subscribe } from '../lib/store.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { ticker } from '../lib/ticker.js';
import { light } from './light.js';

const NS = 'http://www.w3.org/2000/svg';
let offs = [], svg = null, circles = [], masked = [], rr = 0, tgt = { x: 120, y: 90, r: 0 }, cur = { x: 120, y: 90, r: 0 }, stopT = null, demo = false;
const mk = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); e.setAttribute('data-e', '1'); return e; };
const full = () => { const s = getState(); return s.calm || s.ink; };
function paint() { // g items sit under translate(0 6)
  circles[0].setAttribute('cx', cur.x.toFixed(1)); circles[0].setAttribute('cy', cur.y.toFixed(1)); circles[0].setAttribute('r', cur.r.toFixed(1));
  circles[1].setAttribute('cx', cur.x.toFixed(1)); circles[1].setAttribute('cy', (cur.y - 6).toFixed(1)); circles[1].setAttribute('r', cur.r.toFixed(1));
}
function tick() {
  const k = 0.25; cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k; cur.r += (tgt.r - cur.r) * 0.18; paint();
  if (Math.abs(tgt.x - cur.x) < 0.3 && Math.abs(tgt.y - cur.y) < 0.3 && Math.abs(tgt.r - cur.r) < 0.3 && !demo) { stopT && stopT(); stopT = null; }
}
const go = () => { if (!stopT) stopT = ticker.add(tick); };
function setFull() { masked.forEach((m) => (full() ? m.el.removeAttribute('mask') : m.el.setAttribute('mask', m.mask))); }
function toSvg(e) { const r = svg.getBoundingClientRect(); return { x: ((e.clientX - r.left) / r.width) * 240, y: ((e.clientY - r.top) / r.height) * 180 }; } // lint:ok event-time read, not per frame
export function start() {
  svg = document.querySelector('svg.sketch'); if (!svg || svg.querySelector('#bpMask')) return;
  const btn = svg.closest('.sketch-btn'), grid = svg.querySelector('rect[fill^="url"]'), g = svg.querySelector('g[transform]');
  if (!btn || !grid || !g) return;
  const defs = svg.querySelector('defs'), grad = mk('radialGradient', { id: 'bpGrad' });
  grad.innerHTML = '<stop offset="0" stop-color="#fff"/><stop offset=".72" stop-color="#fff"/><stop offset="1" stop-color="#000"/>';
  const fill = getState().quality === 'low' ? '#fff' : 'url(#bpGrad)';
  const m1 = mk('mask', { id: 'bpMask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 240, height: 180 }), m2 = mk('mask', { id: 'bpMaskG', maskUnits: 'userSpaceOnUse', x: 0, y: -6, width: 240, height: 180 });
  circles = [mk('circle', { id: 'bpC', r: 0, cx: 120, cy: 90, fill }), mk('circle', { r: 0, cx: 120, cy: 84, fill })];
  m1.appendChild(circles[0]); m2.appendChild(circles[1]); defs.append(grad, m1, m2);
  masked = [{ el: grid, mask: 'url(#bpMask)' }, ...['.centre', '.flame-dots'].map((s) => ({ el: g.querySelector(s), mask: 'url(#bpMaskG)' })).filter((m) => m.el)];
  masked.forEach((m) => m.el.setAttribute('data-e-mask', '1'));
  setFull();
  const move = (e) => { if (full()) return; const p = toSvg(e); tgt = { x: p.x, y: p.y, r: e.pointerType === 'mouse' && !(e.buttons) ? 70 : 90 }; go(); };
  const leave = () => { tgt.r = 0; go(); };
  btn.addEventListener('pointermove', move); btn.addEventListener('pointerdown', move); btn.addEventListener('pointerleave', leave); btn.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') leave(); });
  const fin = () => { if (full()) return; tgt = { x: 120, y: 90, r: 80 }; go(); }; btn.addEventListener('focus', fin); btn.addEventListener('blur', leave);
  // pressing the sketch: the wick glows cool white-blue (the lamp stays unlit) and recedes
  const press = () => { if (full()) return; const p = lampRegistry.wick(6); p && light.pulse({ x: p.x, y: p.y, r: 120, i: 0.9, hue: 5, attack: 300, decay: 1400, amp: 0.3 }); };
  btn.addEventListener('pointerdown', press); btn.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') press(); });
  // one-shot auto-demo when the section is first seen, so a skimming reader still sees it
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; io.disconnect(); if (full()) return;
    const t0 = performance.now(); demo = true; cur = { x: 10, y: 90, r: 60 };
    const d = ticker.add((dt, now) => { const k = Math.min(1, (now - t0) / 2400); tgt = { x: 10 + 220 * k, y: 90 + Math.sin(k * 6.28) * 18, r: 60 }; cur.x = tgt.x; cur.y = tgt.y; cur.r = 60; paint(); if (k >= 1) { d(); demo = false; tgt.r = 0; go(); } });
  }, { threshold: 0.6 }); io.observe(svg);
  offs.push(() => io.disconnect());
  offs.push(subscribe(setFull));
}
export function stop() {
  stopT && stopT(); stopT = null; offs.splice(0).forEach((f) => f());
  document.querySelectorAll('[data-e-mask]').forEach((e) => { e.removeAttribute('mask'); e.removeAttribute('data-e-mask'); });
  document.querySelectorAll('#bpMask, #bpMaskG, #bpGrad').forEach((e) => e.remove()); svg = null; circles = []; masked = [];
}
export const name = 'blueprint';
