// E5.3: the phuljhadi. Pressing the V3 flip control (or the tag) burns a sparkler beside the tag for two seconds while a
// counting numeral goes 3.10 -> 1.02, the last spark drops into a small clay diya, and the withdrawn 3.1x stays as a struck
// ghost. The V3 button, tag, bar and the plain counter sentence are untouched. Particles come from the existing fx pool.
import { tier, still, ink, effect, alive, el, emit, ticker, foreground } from './elev-kit.js';

export function mount(root) {
  const btn = root.querySelector('.btn[aria-pressed]'), val = root.querySelector('.adv .val'), grid = root.querySelector('.pt-grid'); if (!btn || !val || !grid) return null;
  const rig = el('div', 'phul-e', '<b class="stick"></b><i class="tip"></i><svg viewBox="0 0 60 40" class="diya"><path d="M6 14h48c0 14-10 24-24 24S6 28 6 14z" fill="#8a4a22"/><ellipse cx="30" cy="14" rx="24" ry="5" fill="#5a2f14"/><path class="fl" d="M30 12c-5-5-4-10 0-15 4 5 5 10 0 15z" fill="#FFB347"/></svg><span class="rays"></span>');
  const num = el('p', 'val-e'); num.textContent = '3.1×'; val.parentNode.insertBefore(num, val.nextSibling); grid.appendChild(rig); root.setAttribute('data-sp-hide', 'price');
  let timeline = null, stopT = null;
  const sparks = (now, t) => { if (tier() === 'low' || ink()) return; const tip = rig.querySelector('.tip').getBoundingClientRect(); emit('fx:burst', { kind: 'spark', x: tip.left + 3, y: tip.top + 3, count: tier() === 'high' ? 3 : 2, essential: true }); }; // lint:ok event-time read, not per frame
  const finalState = (burned) => { rig.dataset.state = burned ? 'done' : 'idle'; num.textContent = burned ? '1.02×' : '3.1×'; num.dataset.state = burned ? 'done' : ''; };
  const ignite = () => {
    stopT && stopT(); finalState(false);
    if (still()) { finalState(true); return; }
    const t0 = performance.now(); rig.dataset.state = 'burn'; num.dataset.state = 'burn'; foreground(true, 'price'); let lastSpark = 0, ended = false;
    stopT = ticker.add((dt, now) => {
      const t = now - t0; const k = Math.min(1, t / 1900); const v = 3.1 + (1.02 - 3.1) * (1 - (1 - k) ** 3);
      num.textContent = (k < 1 ? v.toFixed(2) : '1.02') + '×'; rig.style.setProperty('--burn', k.toFixed(3));
      if (t < 2000 && alive('price') && now - lastSpark > (tier() === 'high' ? 40 : 80)) { lastSpark = now; sparks(now, t); }
      if (t > 2200 && !rig.classList.contains('lit')) rig.classList.add('lit');
      if (t > 3400 && !ended) { ended = true; rig.dataset.state = 'done'; num.dataset.state = 'done'; stopT(); stopT = null; foreground(false, 'price'); }
    });
  };
  const reset = () => { stopT && stopT(); stopT = null; rig.classList.remove('lit'); finalState(false); foreground(false, 'price'); };
  const onClick = () => { setTimeout(() => (btn.getAttribute('aria-pressed') === 'true' ? ignite() : reset()), 0); };
  const tag = root.querySelector('.tag'); btn.addEventListener('click', onClick); tag && tag.addEventListener('click', onClick);
  const unreg = effect('price', { priority: 6, ms: 1.2, shed: () => {}, restore: () => {} });
  if (btn.getAttribute('aria-pressed') === 'true') { rig.classList.add('lit'); finalState(true); }
  return () => { btn.removeEventListener('click', onClick); tag && tag.removeEventListener('click', onClick); stopT && stopT(); unreg(); rig.remove(); num.remove(); root.removeAttribute('data-sp-hide'); foreground(false, 'price'); };
}
