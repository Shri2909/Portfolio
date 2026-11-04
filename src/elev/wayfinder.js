// E7.4 (lean): the burning thread along the topbar (scroll progress, a flame head that leans into the scroll) and the six-diya
// rail (real links, 44 px hit boxes, aria-current). Not on the first screen. Not built: ember shedding from the head, act-name
// labels (cut order), desktop hover labels.
import copy, { X } from '../lib/copy.js';
import { getState, subscribe } from '../lib/store.js';
import { on } from '../lib/events.js';
import { ticker } from '../lib/ticker.js';
import { scrollToId } from '../lib/nav.js';
import { haptic } from '../lib/haptic.js';
import { spring, FEEL } from './physics.js';
import { registerEffect, isOn } from './budget.js';
import { tpl } from '../lib/tpl.js';

let wrap, fill, head, rail, dots = [], offs = [], sx = null, lean = null, unreg = null, io = null, ticking = false, lastY = 0, vel = 0, lastT = 0;
const names = () => (copy.ui.extra.projectNames || []).concat(['']);
const label = (n, lit) => (n === 6 ? X('lamp6Aria') : tpl(lit ? X('litLamp') : X('lightLamp'), { n, project: names()[n - 1] || '' }));

function build() {
  wrap = document.createElement('div'); wrap.id = 'wayfinder'; wrap.setAttribute('data-e', '1');
  wrap.innerHTML = '<div class="way-track" aria-hidden="true"><i class="way-fill"></i><svg class="way-head" viewBox="0 0 12 18" width="12" height="18"><path d="M6 1c3 4 5 7 5 10a5 5 0 0 1-10 0c0-3 2-5 3-7 1 2 2 2 2-3z" fill="#FFB347"/><path d="M6 8c1.5 2 2.5 3.5 2.5 5a2.5 2.5 0 0 1-5 0C3.5 11.5 5 10 6 8z" fill="#FFF3DC"/></svg></div><nav class="way-rail" aria-label="' + X('wayNav') + '"><ol></ol></nav>';
  document.body.appendChild(wrap);
  fill = wrap.querySelector('.way-fill'); head = wrap.querySelector('.way-head'); rail = wrap.querySelector('ol');
  for (let n = 1; n <= 6; n++) {
    const li = document.createElement('li'), a = document.createElement('a');
    a.href = '#lamp-' + n; a.className = 'way-dot' + (n === 6 ? ' six' : ''); a.dataset.n = n; a.innerHTML = '<i></i>';
    a.addEventListener('click', (e) => { e.preventDefault(); scrollToId('lamp-' + n); });
    li.appendChild(a); rail.appendChild(li); dots.push(a);
  }
  paint();
}
function paint() {
  const s = getState();
  dots.forEach((a, i) => { const n = i + 1, lit = n < 6 && s.lamps[n] === 'lit'; a.classList.toggle('lit', lit); a.setAttribute('aria-label', label(n, lit)); });
  const last = [1, 2, 3, 4, 5].filter((n) => s.lamps[n] === 'lit').length; wrap.style.setProperty('--wl', last / 5);
  vis();
}
function vis() {
  const s = getState(), on_ = scrollY > 0.6 * innerHeight || s.litCount >= 1;
  document.documentElement.toggleAttribute('data-way', on_ && !s.overlay && !s.lampCard && !document.documentElement.dataset.text && innerHeight >= 520);
}
function frame(dt, t) {
  const max = Math.max(1, document.documentElement.scrollHeight - innerHeight), p = Math.min(1, Math.max(0, scrollY / max));
  const dy = scrollY - lastY; lastY = scrollY; vel += ((dy / Math.max(dt, 1)) * 1000 - vel) * 0.25;
  fill.style.transform = `scaleX(${p.toFixed(4)})`;
  const st = getState(), lowOrCalm = st.calm || st.quality === 'low';
  const x = p * (wrap.clientWidth - 12);
  if (lowOrCalm) { head.style.transform = `translateX(${x}px)`; ticking = false; return false; }
  sx.to(x); lean.to(Math.max(-16, Math.min(16, -vel * 0.012)));
  head.style.transform = `translateX(${sx.x}px) skewX(${lean.x}deg)`;
  if (Math.abs(vel) < 4 && Math.abs(lean.x) < 0.05 && Math.abs(sx.x - x) < 0.3) { ticking = false; return false; }
  return true;
}
let stopT = null;
function kick() { vis(); if (stopT) return; stopT = ticker.add((dt, t) => { if (!frame(dt, t)) { stopT(); stopT = null; } }); }
function mote(n) {
  if (getState().calm || n < 2) return;
  const a = dots[n - 2], b = dots[n - 1]; if (!a || !b) return;
  const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect(), m = document.createElement('i'); m.className = 'way-mote'; m.setAttribute('aria-hidden', 'true'); // lint:ok event-time read
  m.style.cssText = `left:${ra.left + ra.width / 2 - 3}px;top:${ra.top + ra.height / 2 - 3}px`; document.body.appendChild(m);
  const an = m.animate([{ transform: 'translateY(0)' }, { transform: `translateY(${rb.top - ra.top}px)` }], { duration: 600, easing: 'cubic-bezier(.83,0,.17,1)', fill: 'forwards' });
  an.finished.then(() => { m.remove(); haptic('hop'); }, () => m.remove());
}
export function start() {
  unreg = registerEffect({ still: 'finished glowing frame, nothing moving (Calm)', id: 'way', kind: 'dom', priority: 5, ms: 0.1, onShed: () => wrap && wrap.classList.add('plain'), onRestore: () => wrap && wrap.classList.remove('plain') });
  build();
  sx = spring(FEEL.trailHead, { scale: 100, decor: true }); lean = spring(FEEL.lean, { scale: 10, decor: true });
  offs.push(subscribe(paint), on('diya:lit', ({ n }) => { paint(); const d = dots[n - 1]; if (d && !getState().calm) d.animate([{ transform: 'scale(0)' }, { transform: 'scale(1)' }], { duration: 360, easing: 'cubic-bezier(.34,1.45,.64,1)' }); mote(n); }));
  window.addEventListener('scroll', kick, { passive: true }); window.addEventListener('resize', kick, { passive: true });
  offs.push(() => window.removeEventListener('scroll', kick), () => window.removeEventListener('resize', kick));
  io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { const n = +e.target.id.slice(5); dots.forEach((d, i) => { if (i + 1 === n) d.setAttribute('aria-current', 'location'); else d.removeAttribute('aria-current'); }); } }), { rootMargin: '-45% 0px -45% 0px' });
  for (let n = 1; n <= 6; n++) { const s = document.getElementById('lamp-' + n); s && io.observe(s); }
  kick();
}
export function stop() {
  offs.splice(0).forEach((f) => f()); io && io.disconnect(); io = null; stopT && stopT(); stopT = null;
  sx && sx.destroy(); lean && lean.destroy(); wrap && wrap.remove(); wrap = null; dots = []; unreg && unreg(); unreg = null;
  document.documentElement.removeAttribute('data-way');
}
