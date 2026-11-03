// E5.6 / E5.7: the baithak. Panes: the window panes are tappable (same handler as the tabs), unselected panes dim, and the
// selected card grows out of the window (clip-path, never scaled text). Loop: the six stops sit on a ring joined by a dashed
// wire with an ember that walks it (high), stopping when the reader chooses. Shelf: five brass lamps. Plain twins untouched.
import { tier, still, effect, alive, ticker, el, useInView } from './elev-kit.js';

export function mount(sec) {
  const un = [];
  const tabs = () => [...sec.querySelectorAll('[role=tab]')];
  const panes = sec.querySelector('.window-scene .panes');
  if (panes) { const click = (e) => { const r = e.target.closest && e.target.closest('rect'); if (!r || !panes.contains(r)) return; const i = [...panes.children].indexOf(r); const t = tabs()[i]; if (t) { t.click(); t.focus({ preventScroll: true }); } }; panes.addEventListener('click', click); panes.style.cursor = 'pointer'; un.push(() => { panes.removeEventListener('click', click); panes.style.cursor = ''; }); }
  let cur = sec.getAttribute('data-pane');
  const grow = () => {
    const p = sec.getAttribute('data-pane'); if (p === cur) return; cur = p;
    if (still() || tier() === 'low' || !alive('baithak')) return;
    const body = sec.querySelector('.pane-body:not([hidden])'); if (!body) return;
    const col = (+p % 2) * 46, kf = tier() === 'high' ? [{ clipPath: `inset(0 ${46 - col}% 96% ${col}% round 18px)`, opacity: 0.6 }, { clipPath: 'inset(0 0 0 0 round 18px)', opacity: 1 }] : [{ opacity: 0, translate: '0 8px' }, { opacity: 1, translate: '0 0' }];
    body.animate(kf, { duration: tier() === 'high' ? 520 : 300, easing: 'cubic-bezier(.16,1,.3,1)' });
  };
  const mo = new MutationObserver(grow); mo.observe(sec, { attributes: true, attributeFilter: ['data-pane'] }); un.push(() => mo.disconnect());
  // loop ring
  let stop = null, ang = 0, ember = null, visible = false;
  const ring = sec.querySelector('.loop-ring');
  if (ring) {
    const stops = [...ring.querySelectorAll('.loop-stop')]; ring.setAttribute('data-sp-ring', '1'); stops.forEach((b, i) => b.style.setProperty('--i', i));
    const NS = 'http://www.w3.org/2000/svg', svg = document.createElementNS(NS, 'svg'); svg.setAttribute('viewBox', '-125 -125 250 250'); svg.setAttribute('class', 'wire-e'); svg.setAttribute('data-e', '1'); svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML = '<circle r="100" fill="none" stroke="#F5A623" stroke-opacity=".45" stroke-width="1.6" stroke-dasharray="5 5"/><path d="M-6 -106 l10 6 l-10 6" fill="none" stroke="#F5A623" stroke-opacity=".7" stroke-width="1.6"/>';
    ring.insertBefore(svg, ring.firstChild); ember = el('i', 'walker-e'); ring.appendChild(ember);
    const place = (a) => { ember.style.transform = `translate(${(100 * Math.cos(a)).toFixed(1)}px,${(100 * Math.sin(a)).toFixed(1)}px)`; };
    const loop = (dt) => { if (!visible || !alive('baithak') || still() || tier() !== 'high' || ring.querySelector('.loop-stop:focus-visible')) return; ang += dt / 14000 * Math.PI * 2; place(ang - Math.PI / 2); };
    const sel = () => { const on = ring.querySelector('.loop-stop.on'); if (on && ember) { ang = (+on.style.getPropertyValue('--i')) * Math.PI / 3 + Math.PI / 2 - Math.PI / 2; place(ang - Math.PI / 2); } stops.forEach((b, i) => b.classList.toggle('visited-e', i < +(on && on.style.getPropertyValue('--i')))); };
    ring.addEventListener('click', () => setTimeout(sel, 0)); un.push(useInView(ring, (v) => { visible = v; }, 0.2));
    place(-Math.PI / 2); stop = ticker.add(loop); sel();
    un.push(() => { stop && stop(); svg.remove(); ember.remove(); ring.removeAttribute('data-sp-ring'); stops.forEach((b) => { b.style.removeProperty('--i'); b.classList.remove('visited-e'); }); });
  }
  const shelf = sec.querySelector('.bring-lamps'); if (shelf) { shelf.setAttribute('data-sp-shelf', '1'); un.push(() => shelf.removeAttribute('data-sp-shelf')); }
  const unreg = effect('baithak', { priority: 6, ms: 0.8, shed: () => {}, restore: () => {} });
  return () => { un.forEach((f) => f()); unreg(); };
}
