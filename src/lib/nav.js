import { actions, getState } from './store.js';
import { emit } from './events.js';
// Overlay openers. They never write to the address bar (the fragment belongs to the lamp count).
export const openSixty = () => actions.setOverlay('sixty');
export const openEvidence = (caseId = null) => { actions.setOverlay('evidence', caseId); emit('evidence:opened', { caseId }); };
export const openText = () => { actions.setOverlay('text'); document.documentElement.dataset.text = '1'; };
export const closeText = () => { actions.setOverlay(null); delete document.documentElement.dataset.text; };
export const closeOverlay = () => { if (getState().overlay === 'text') closeText(); else { const was = getState().overlay; actions.setOverlay(null); if (was === 'evidence') emit('evidence:closed', {}); } };
export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  const calm = getState().calm;
  el.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' });
  const h = el.querySelector('h1,h2,h3');
  if (h) { h.setAttribute('tabindex', '-1'); h.focus({ preventScroll: true }); }
};
// Delegated attributes (data-sixty, data-evidence) and the two custom events.
export function wireOpeners() {
  document.addEventListener('click', (e) => {
    const t = e.target.closest && e.target.closest('[data-sixty],[data-evidence]');
    if (!t) return;
    e.preventDefault();
    if (t.hasAttribute('data-sixty')) openSixty(); else openEvidence(t.getAttribute('data-evidence') || null);
  });
  window.addEventListener('sixty:open', () => openSixty());
  window.addEventListener('evidence:open', (e) => openEvidence((e.detail && e.detail.caseId) || null));
}

// ---- lamp card (G1): the lamp announces lamp:open, the card listens. Also callable directly. ----
import { emit as _emit, on as _on } from './events.js';
let cardOpener = null;
export const openLampCard = (n, source = 'direct') => {
  const s = getState();
  if (!(n >= 1 && n <= 5) || s.lamps[n] !== 'lit') return false;     // unlit lamps never open a card
  cardOpener = document.querySelectorAll('.lamp-btn')[n - 1] || document.activeElement;
  actions.setLampCard(n);
  return true;
};
export const closeLampCard = () => { actions.setLampCard(null); const o = cardOpener; cardOpener = null; requestAnimationFrame(() => o && o.isConnected && o.focus && o.focus({ preventScroll: true })); };
export const wireLampCard = () => _on('lamp:open', ({ n, source }) => openLampCard(n, source));
