// E5.9: the receipt sheet. Pack 2 already opens the card as an iris from the wick. This adds the paper: three crease lines that
// unfold away as it opens, a small settling wobble (the individual `rotate` property, so it never fights the card's transform),
// and a lamp-lit backdrop. The native dialog, focus handling, Escape and the receipt text are untouched.
import { tier, still, effect, alive, el } from './elev-kit.js';

export function mount(dlg) {
  let creases = null;
  const open = () => {
    const card = dlg.querySelector('.card'); if (!card) return;
    creases && creases.remove(); creases = el('div', 'creases-e', '<i></i><i></i><i></i>'); card.appendChild(creases);
    if (still() || !alive('card') || tier() === 'low') { creases.style.opacity = 0; return; }
    if (tier() === 'mid') { creases.style.opacity = 0.3; return; }
    creases.animate([{ opacity: 1 }, { opacity: 1, offset: 0.3 }, { opacity: 0 }], { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' });
    card.animate([{ rotate: '-1.2deg' }, { rotate: '0.6deg', offset: 0.55 }, { rotate: '0deg' }], { duration: 700, delay: 380, easing: 'ease-out' });
  };
  const mo = new MutationObserver(() => { if (dlg.open) open(); }); mo.observe(dlg, { attributes: true, attributeFilter: ['open'] });
  const unreg = effect('card', { priority: 6, ms: 0.5, shed: () => {}, restore: () => {} });
  return () => { mo.disconnect(); creases && creases.remove(); unreg(); };
}
