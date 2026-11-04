// E6.6: the homely hour. A handful of tiny, silent moments (a curtain stirring, a soft shadow behind glass, steam, a
// loose bulb, birds going home, one cool phone glow) so the apartment feels lived in. No faces, no figures in detail,
// nothing near text. Discoverable, not noisy: none before 18 s, at most 3 alive, 28 s mean gap, 150 s cooldown.
import { getState } from '../lib/store.js';
import { emit } from '../lib/events.js';
import { mulberry32 } from '../lib/rand.js';
import { registerEffect, isOn } from './budget.js';

const NS = 'http://www.w3.org/2000/svg', RM = () => getState().calm || getState().quality === 'low' || !isOn('homely');
const HIDE = { fill: 'none', opacity: 0 };
const svg = (tag, a) => { const e = document.createElementNS(NS, tag); for (const k in a) e.setAttribute(k, a[k]); e.setAttribute('data-e', '1'); e.setAttribute('aria-hidden', 'true'); e.style.pointerEvents = 'none'; return e; };
const litPanes = () => [...document.querySelectorAll('#skyline g.win rect.pane')].filter((p) => p.parentNode.style.opacity === '1' && p.getBoundingClientRect().top > 60 && p.getBoundingClientRect().bottom < innerHeight - 40); // lint:ok (event-time or once-per-33ms read, before any write)
const darkPanes = () => [...document.querySelectorAll('#skyline g.win rect.pane')].filter((p) => p.parentNode.style.opacity === '0' && p.getBoundingClientRect().top > 60 && p.getBoundingClientRect().bottom < innerHeight - 40); // lint:ok (event-time or once-per-33ms read, before any write)
const fade = (e, to, ms) => e.animate([{ opacity: to ? 0 : e.style.opacity || 1 }, { opacity: to }], { duration: ms, fill: 'forwards' });
const pick = (a, r) => a[Math.floor(r() * a.length)];

const MOMENTS = {
  curtain(r) { const p = pick(litPanes(), r); if (!p) return null; const b = p.parentNode, x = +p.getAttribute('x'), y = +p.getAttribute('y'), w = +p.getAttribute('width'), h = +p.getAttribute('height');
    const c = svg('path', { d: `M${x} ${y}h${w * 0.4}q-${w * 0.1} ${h * 0.5} ${w * 0.04} ${h}h-${w * 0.44}z`, fill: 'rgba(120,60,20,.55)' }); c.style.transformBox = 'fill-box'; c.style.transformOrigin = 'left top'; b.appendChild(c);
    const a = c.animate([{ opacity: 0, transform: 'translateX(0) skewX(0)' }, { opacity: 1, transform: 'translateX(3px) skewX(-1.5deg)', offset: 0.15 }, { transform: 'translateX(0) skewX(0)', offset: 0.4 }, { transform: 'translateX(3px) skewX(-1.5deg)', offset: 0.65 }, { transform: 'translateX(0) skewX(0)', offset: 0.85 }, { opacity: 0, transform: 'translateX(0)' }], { duration: 3200 });
    return { done: a.finished.finally(() => c.remove()), cancel: () => { a.cancel(); c.remove(); } }; },
  passer(r) { const p = pick(litPanes(), r); if (!p) return null; const b = p.parentNode, x = +p.getAttribute('x'), y = +p.getAttribute('y'), w = +p.getAttribute('width'), h = +p.getAttribute('height');
    const s = svg('rect', { x, y: y + h * 0.3, width: w * 0.22, height: h * 0.7, rx: w * 0.1, fill: 'rgba(5,4,3,.62)' }); b.appendChild(s);
    const a = s.animate([{ opacity: 0, transform: 'translateX(0)' }, { opacity: 1, offset: 0.2 }, { opacity: 1, offset: 0.8 }, { opacity: 0, transform: `translateX(${w * 0.75}px)` }], { duration: 3400 });
    return { done: a.finished.finally(() => s.remove()), cancel: () => { a.cancel(); s.remove(); } }; },
  phone(r) { const p = pick(darkPanes(), r); if (!p) return null; const b = p.parentNode, o = svg('rect', { x: p.getAttribute('x'), y: p.getAttribute('y'), width: p.getAttribute('width'), height: p.getAttribute('height'), fill: '#C9DDFF' }); b.appendChild(o);
    const a = o.animate([{ opacity: 0 }, { opacity: 0.16, offset: 0.15 }, { opacity: 0.07, offset: 0.4 }, { opacity: 0.16, offset: 0.55 }, { opacity: 0 }], { duration: 2200 });
    return { done: a.finished.finally(() => o.remove()), cancel: () => { a.cancel(); o.remove(); } }; },
  bulb(r) { const bs = [...document.querySelectorAll('.lights .bulb')]; if (!bs.length) return null; const b = pick(bs, r);
    const a = b.animate([{ opacity: 1 }, { opacity: 0.2, offset: 0.12 }, { opacity: 1, offset: 0.25 }, { opacity: 0.35, offset: 0.5 }, { opacity: 1, offset: 0.62 }, { opacity: 0.55, offset: 0.85 }, { opacity: 1 }], { duration: 1600 });
    return { done: a.finished, cancel: () => a.cancel() }; },
  chai() { const par = document.querySelector('.parapet'); if (!par) return null; const w = document.createElement('div'); w.className = 'homely-steam'; w.setAttribute('data-e', '1'); w.setAttribute('aria-hidden', 'true');
    w.innerHTML = '<i></i><i></i><i></i>'; par.appendChild(w); const as = [...w.children].map((c, i) => c.animate([{ opacity: 0, transform: 'translate(0,0) scaleX(.6)' }, { opacity: 0.45, offset: 0.3 }, { opacity: 0, transform: `translate(${(i - 1) * 4}px,-34px) scaleX(1.2)` }], { duration: 5000, delay: i * 700, fill: 'both' }));
    return { done: Promise.all(as.map((a) => a.finished)).finally(() => w.remove()), cancel: () => { as.forEach((a) => a.cancel()); w.remove(); } }; },
  birds() { const st = document.getElementById('stage'); if (!st) return null; const g = svg('svg', { viewBox: '0 0 120 40', width: 120, height: 40 }); g.style.cssText = 'position:absolute;left:0;top:18%;'; g.innerHTML = [0, 1, 2, 3, 4].map((i) => `<path d="M${6 + i * 22} ${20 + (i % 2) * 8}l5 -4l5 4" fill="none" stroke="#050403" stroke-width="1.4" stroke-linecap="round" opacity=".7"/>`).join(''); st.appendChild(g);
    const a = g.animate([{ transform: `translateX(-130px)`, opacity: 0 }, { opacity: 1, offset: 0.1 }, { opacity: 1, offset: 0.9 }, { transform: `translateX(${innerWidth + 10}px)`, opacity: 0 }], { duration: 7500 });
    return { done: a.finished.finally(() => g.remove()), cancel: () => { a.cancel(); g.remove(); } }; },
};
const ACT_POOL = { doorstep: ['bulb'], baithak: ['curtain', 'passer', 'chai'], chhat: ['birds', 'phone', 'bulb'], vidaai: ['curtain', 'passer'] };
const mid = new Set(['curtain', 'passer', 'bulb', 'chai']);

let timer = 0, alive = new Set(), plays = {}, lastPlay = {}, started = 0, rnd = null, staticEls = [];
const busy = () => document.hidden || document.querySelector('dialog[open]') || +(document.documentElement.getAttribute('data-hush') || 0) > 0 || document.documentElement.getAttribute('data-busy') === '1' || document.querySelector('.kpad[open] :focus');
function once() {
  timer = setTimeout(once, 5000 + rnd() * 3000);
  if (RM() || busy() || alive.size >= 3 || performance.now() - started < 18000) return;
  const act = document.documentElement.getAttribute('data-act') || 'doorstep', tone = +(document.documentElement.getAttribute('data-tone') || 0), q = getState().quality;
  const pool = (ACT_POOL[act] || []).filter((m) => (m !== 'birds' || tone >= 3) && (q === 'high' || mid.has(m)) && (plays[m] || 0) < 2 && performance.now() - (lastPlay[m] || -1e9) > 150000);
  if (!pool.length || rnd() > 0.28 / (5 / 5.5)) { return; }
  const id = pick(pool, rnd), m = MOMENTS[id](rnd); if (!m) return;
  plays[id] = (plays[id] || 0) + 1; lastPlay[id] = performance.now(); const tok = { id, m }; alive.add(tok); emit('moment:start', { id });
  m.done.catch(() => {}).finally(() => { alive.delete(tok); emit('moment:end', { id }); });
}
function statics() { // always there, not counted as alive: a drawn curtain in one lit window, and a pair of chappals at the doorstep edge
  const t = document.getElementById('terrace');
  if (t && !t.querySelector('.homely-chappal')) { const s = svg('svg', { viewBox: '0 0 40 14', width: 40, height: 14 }); s.setAttribute('class', 'homely-chappal'); s.style.cssText = 'position:absolute;left:5%;bottom:6px'; s.innerHTML = '<ellipse cx="9" cy="8" rx="8" ry="4" fill="#050403" opacity=".7"/><ellipse cx="29" cy="7" rx="8" ry="4" fill="#050403" opacity=".7" transform="rotate(-8 29 7)"/>'; t.appendChild(s); staticEls.push(s); }
}
export function mount() {
  rnd = mulberry32((Date.now() >>> 8) | 1); started = performance.now(); statics();
  registerEffect({ id: 'homely', kind: 'dom', priority: 4, ms: 0.3 });
  if (getState().calm) { const p = litPanes()[0]; if (p) { const b = p.parentNode, x = +p.getAttribute('x'), y = +p.getAttribute('y'), w = +p.getAttribute('width'), h = +p.getAttribute('height'); const c = svg('path', { d: `M${x} ${y}h${w * 0.4}q-${w * 0.1} ${h * 0.5} ${w * 0.04} ${h}h-${w * 0.44}z`, fill: 'rgba(120,60,20,.55)' }); b.appendChild(c); staticEls.push(c); } }
  timer = setTimeout(once, 18000);
  return () => { clearTimeout(timer); alive.forEach((t) => t.m.cancel()); alive.clear(); staticEls.splice(0).forEach((e) => e.remove()); plays = {}; lastPlay = {}; };
}
