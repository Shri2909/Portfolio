// E4.4 (lean): wick glow, a warm clay lip, a shared wind with gusts, and wisps that break off the tip.
// Deviations (logged): the five-layer Catmull-Rom flame, the heat ripple filter and the oil mirror are NOT shipped; the
// existing noise-driven three-teardrop flame plus soft blue base stays (a filter on an element that moves every frame
// re-rasterises each frame, which V3 cannot afford).
import { getState } from '../lib/store.js';
import { on, emit } from '../lib/events.js';
import { engine } from '../lib/flame.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { registry } from './registry.js';

const NS = 'http://www.w3.org/2000/svg';
let offs = [], gustT = 0, wispT = 0, defs = null;
const hushed = () => { const h = document.documentElement.dataset.hush; return !!h && h !== '0'; };
const rnd = (a, b) => a + Math.random() * (b - a);

function augment() {
  if (!defs) {
    defs = document.createElementNS(NS, 'svg'); defs.setAttribute('width', '0'); defs.setAttribute('height', '0'); defs.setAttribute('aria-hidden', 'true'); defs.setAttribute('data-e', '1'); defs.style.cssText = 'position:absolute;pointer-events:none';
    defs.innerHTML = '<defs><radialGradient id="e-lip"><stop offset="0" stop-color="#FFD27A" stop-opacity=".9"/><stop offset=".5" stop-color="#FF9A3C" stop-opacity=".35"/><stop offset="1" stop-color="#FF7A1A" stop-opacity="0"/></radialGradient><radialGradient id="e-wick"><stop offset="0" stop-color="#FFE9B0"/><stop offset="1" stop-color="#FF8A2A" stop-opacity="0"/></radialGradient></defs>';
    document.body.appendChild(defs);
  }
  document.querySelectorAll('svg.flame').forEach((f) => {
    if (f.querySelector('.f-wick')) return;
    const c = document.createElementNS(NS, 'circle'); c.setAttribute('class', 'f-wick'); c.setAttribute('cx', '0'); c.setAttribute('cy', '-1'); c.setAttribute('r', '2.6'); c.setAttribute('fill', 'url(#e-wick)'); c.setAttribute('data-e', '1'); f.appendChild(c);
  });
  document.querySelectorAll('.lamp svg').forEach((s) => {
    if (s.querySelector('.e-lip')) return;
    const clip = s.querySelector('clipPath[id^="bowl"]'), n = clip && +clip.id.replace('bowl', ''), rim = s.querySelector('.clay-rim'); if (!clip || !rim || n === 6) return;
    const cx = +rim.getAttribute('cx'), cy = +rim.getAttribute('cy');
    const e = document.createElementNS(NS, 'ellipse'); e.setAttribute('class', 'e-lip'); e.setAttribute('data-e', '1'); e.setAttribute('cx', cx + 18); e.setAttribute('cy', cy - 1); e.setAttribute('rx', '20'); e.setAttribute('ry', '9'); e.setAttribute('fill', 'url(#e-lip)'); e.setAttribute('clip-path', `url(#${clip.id})`);
    rim.after(e);
  });
}
function litWicks() { const s = getState(), out = []; const h = lampRegistry.wick(0); h && out.push(h); for (let n = 1; n <= 5; n++) if (s.lamps[n] === 'lit') { const p = lampRegistry.wick(n); p && out.push(p); } return out.filter((p) => p.y > 0 && p.y < innerHeight); }
function gust() { gustT = setTimeout(gust, rnd(9000, 14000)); const s = getState(); if (s.calm || document.hidden || hushed()) return; const v = rnd(0.3, 0.6) * (Math.random() < 0.5 ? -1 : 1); engine.wind(v); emit('wind:gust', { v }); }
function wisp() { wispT = setTimeout(wisp, rnd(2500, 6000)); const s = getState(); if (s.calm || s.ink || s.quality === 'low' || document.hidden || hushed()) return; const w = litWicks(); if (!w.length) return; const p = w[Math.floor(Math.random() * w.length)]; emit('fx:burst', { kind: 'ember', x: p.x, y: p.y - 30, count: 1 }); }
export function start() {
  augment();
  offs.push(on('diya:lit', () => setTimeout(augment, 60)));
  gustT = setTimeout(gust, rnd(6000, 10000)); wispT = setTimeout(wisp, rnd(3000, 6000));
  registry.register('flames', { kind: 'ambient', cost: 0.1, shed() { clearTimeout(wispT); } });
}
export function stop() { offs.splice(0).forEach((f) => f()); clearTimeout(gustT); clearTimeout(wispT); document.querySelectorAll('.f-wick, .e-lip').forEach((n) => n.remove()); defs && defs.remove(); defs = null; }
export const name = 'flames';
