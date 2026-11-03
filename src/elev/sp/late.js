// E5.2: the late flame. The V3 range input stays the control and its flame-shaped thumb is the follower. This adds: a dashed
// catenary (the dashes are the "simulated" signal; MODEL OF DOCUMENTED BEHAVIOR stays in the V3 badge line), a spring-lagged
// ember tail, per-bead toran lift as the flame passes, and the two late states (alive / guttering with a smoke wisp).
import { tier, still, spring, foreground, effect, alive, el, ticker, useInView } from './elev-kit.js';

export function mount(root) {
  const wire = root.querySelector('.wire'), input = wire && wire.querySelector('input[type=range]'); if (!wire || !input) return null;
  const NS = 'http://www.w3.org/2000/svg';
  const cat = document.createElementNS(NS, 'svg'); cat.setAttribute('class', 'cat-e'); cat.setAttribute('data-e', '1'); cat.setAttribute('aria-hidden', 'true'); cat.setAttribute('viewBox', '0 0 100 20'); cat.setAttribute('preserveAspectRatio', 'none');
  cat.innerHTML = '<path d="M0 7 Q50 15 100 7" fill="none" stroke="#F5A623" stroke-opacity=".55" stroke-width="1.6" stroke-dasharray="4 3.5" vector-effect="non-scaling-stroke"/>';
  const tail = Array.from({ length: tier() === 'high' ? 6 : tier() === 'mid' ? 3 : 0 }, () => { const i = el('i', 'tail-e'); wire.appendChild(i); return i; });
  const smoke = el('div', 'smoke-e', '<i></i><i></i><i></i>'); wire.appendChild(smoke); wire.insertBefore(cat, wire.firstChild);
  root.setAttribute('data-sp-hide', 'late');
  const S = { x: 0, v: 0, tgt: 0, hist: [], last: 0 };
  const max = +input.max || 15, W = () => wire.clientWidth;
  const target = () => (+input.value / max) * W();
  S.x = S.tgt = target();
  const state = () => { const after = wire.classList.contains('after'), dim = wire.classList.contains('dim'); wire.dataset.state = !after ? 'before' : dim ? 'guttering' : 'alive'; };
  let stopT = null, passedAt = -1;
  const draw = () => {
    tail.forEach((d, k) => { const p = S.hist[Math.min(S.hist.length - 1, (k + 1) * 2)]; if (!p) { d.style.opacity = 0; return; } d.style.transform = `translate(${p.toFixed(1)}px,0)`; d.style.opacity = (0.5 * (1 - k / tail.length) * Math.min(1, Math.abs(S.v) / 40)).toFixed(2); });
    // toran lift as the flame passes the gate (x at 3 s = 1/2)
    const g = W() / 2, near = Math.abs(S.x - g) < 26; wire.classList.toggle('pass-e', near && Math.abs(S.v) > 8);
  };
  const tick = (dt, now) => {
    S.tgt = target(); spring(S, S.tgt, { k: 150, c: 15 }, dt); S.hist.unshift(S.x); if (S.hist.length > 14) S.hist.pop(); draw();
    if (Math.abs(S.v) < 0.5 && Math.abs(S.x - S.tgt) < 0.4) { stopT && stopT(); stopT = null; S.v = 0; tail.forEach((d) => (d.style.opacity = 0)); wire.classList.remove('pass-e'); foreground(false, 'late'); }
  };
  const wake = () => { if (still() || tier() === 'low' || !alive('late')) return; if (!stopT) stopT = ticker.add(tick); };
  const onInput = () => { foreground(true, 'late'); wake(); };
  input.addEventListener('input', onInput);
  const mo = new MutationObserver(state); mo.observe(wire, { attributes: true, attributeFilter: ['class'] }); state();
  const unreg = effect('late', { priority: 6, ms: 1, shed: () => { stopT && stopT(); stopT = null; tail.forEach((d) => (d.style.opacity = 0)); }, restore: () => {} });
  return () => { input.removeEventListener('input', onInput); mo.disconnect(); stopT && stopT(); unreg(); cat.remove(); smoke.remove(); tail.forEach((d) => d.remove()); root.removeAttribute('data-sp-hide'); delete wire.dataset.state; foreground(false, 'late'); };
}
