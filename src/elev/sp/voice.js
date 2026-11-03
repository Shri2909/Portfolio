// E5.8: Voice as pressed cloth. Words that are still in the spoken take get a small tilt (set from the word index); as the
// slider processes them they flatten (CSS transition). When every word is processed a single highlight band sweeps the
// paragraph. The V3 slider, Plain toggle, Take switch and provenance block are untouched. "Spoken with Wispr Flow" is not touched.
import { tier, still, effect, alive, foreground } from './elev-kit.js';

export function mount(sec) {
  let done = false, sweepT = 0;
  const index = () => { const card = sec.querySelector('.take-card'); if (!card) return; card.querySelectorAll('.w').forEach((w, i) => { if (w.style.getPropertyValue('--i') !== String(i)) w.style.setProperty('--i', i); }); const raw = card.querySelector('.w.struck-trim, .w.struck-smooth'); card.toggleAttribute('data-raw-e', !!raw); const fin = !raw && !!card.querySelector('.w.gone, .w.new'); if (fin && !done && !still() && alive('voice') && tier() !== 'low') { card.classList.add('sweep-e'); clearTimeout(sweepT); sweepT = setTimeout(() => card.classList.remove('sweep-e'), 1000); } done = fin; };
  const mo = new MutationObserver(index); mo.observe(sec, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] }); index();
  const down = (e) => { if (e.target.closest && e.target.closest('input[type=range]')) foreground(true, 'voice'); }, up = () => foreground(false, 'voice');
  sec.addEventListener('pointerdown', down); addEventListener('pointerup', up);
  const unreg = effect('voice', { priority: 6, ms: 0.3, shed: () => sec.setAttribute('data-sp-flat', '1'), restore: () => sec.removeAttribute('data-sp-flat') });
  return () => { mo.disconnect(); clearTimeout(sweepT); sec.removeEventListener('pointerdown', down); removeEventListener('pointerup', up); unreg(); sec.querySelectorAll('.w').forEach((w) => w.style.removeProperty('--i')); sec.removeAttribute('data-sp-flat'); };
}
