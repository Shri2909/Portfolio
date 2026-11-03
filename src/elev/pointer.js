// E7.2 (lean): a warm light follows a mouse or pen, cards and buttons catch a lit edge, primary controls lean up to 6 px
// towards it. The system cursor is never hidden. Touch, keyboard navigation and Calm remove it. Not built: the long-press
// sparkler (first item in the cut order) and the custom cursor image.
import { getState } from '../lib/store.js';
import { spring2, spring, FEEL } from './physics.js';
import { registerEffect, isOn } from './budget.js';

const MAGNET = '.btn-primary, .lamp-btn, #calm-corner, [data-magnetic]';
const EDGE = '.panel, .btn, .menu a, .take-card, .sheet, .lamp-btn';
let el = null, sp = null, offs = [], active = false, unreg = null, edgeEl = null, magEl = null, mag = null, idleT = 0;
const fine = () => matchMedia('(hover: hover) and (pointer: fine)').matches;

function show() { if (!el) return; el.classList.add('on'); el.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => el && el.classList.add('idle'), 3000); }
function hide() { el && el.classList.remove('on'); active = false; }
function move(e) {
  if (e.pointerType === 'touch' || !fine()) { hide(); return; }
  if (!isOn('pointer')) return;
  if (!el) {
    el = document.createElement('div'); el.id = 'lamp-cursor'; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el);
    sp = spring2(FEEL.cursorGlow, { scale: 100 }); sp.set(e.clientX, e.clientY);
    sp.onUpdate((x, y) => { el.style.translate = `${x}px ${y}px`; });
  }
  const st = getState();
  active = true; show();
  if (st.calm || st.quality === 'low') { sp.set(e.clientX, e.clientY); el.style.translate = `${e.clientX}px ${e.clientY}px`; } else sp.to(e.clientX, e.clientY);
  const t = e.target.closest ? e.target : null;
  el.classList.toggle('hot', !!(t && t.closest && t.closest('.lamp-btn, .btn-primary, a, button')));
  if (st.calm || st.quality === 'low') return;
  const c = t && t.closest && t.closest(EDGE);
  if (c) {
    if (edgeEl !== c) { edgeEl && edgeEl.style.removeProperty('--mx'); edgeEl = c; c.setAttribute('data-edge', '1'); }
    const r = c.getBoundingClientRect(); c.style.setProperty('--mx', e.clientX - r.left + 'px'); c.style.setProperty('--my', e.clientY - r.top + 'px'); // lint:ok one element, only while the mouse moves
  } else if (edgeEl) { edgeEl.removeAttribute('data-edge'); edgeEl = null; }
  if (st.quality !== 'high') return;
  const m = t && t.closest && t.closest(MAGNET);
  if (m && m.offsetWidth >= 44 && // lint:ok one element, only while the mouse moves
     !m.closest('dialog') && !m.disabled && !m.classList.contains('is-down')) {
    if (magEl !== m) { release(); magEl = m; mag = spring2(FEEL.magnet, { scale: 8 }); mag.onUpdate((x, y) => { m.style.translate = `${x.toFixed(2)}px ${y.toFixed(2)}px`; }); mag.set(0, 0); }
    const r = m.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1, k = Math.min(d * 0.18, 6) / d; // lint:ok one element, only while the mouse moves
    mag.to(dx * k, dy * k);
  } else release();
}
function release() { if (magEl) { const m = magEl; mag && mag.to(0, 0); setTimeout(() => { if (magEl !== m) m.style.removeProperty('translate'); }, 400); magEl = null; } }
const away = () => { hide(); release(); };
const key = (e) => { if (['Tab', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Home', 'End', 'PageUp', 'PageDown'].includes(e.key)) away(); };
const down = (e) => { if (e.pointerType === 'touch') away(); else if (el) el.classList.add('press'); };
const up = () => el && el.classList.remove('press');
export function start() {
  if (!fine()) return; // never present on touch-first devices
  unreg = registerEffect({ id: 'pointer', kind: 'dom', priority: 8, ms: 0.2, onShed: away });
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerdown', down, { passive: true, capture: true });
  window.addEventListener('pointerup', up, { passive: true, capture: true });
  window.addEventListener('touchstart', away, { passive: true });
  window.addEventListener('keydown', key, { passive: true });
  document.addEventListener('pointerleave', away); document.addEventListener('visibilitychange', away);
}
export function stop() {
  window.removeEventListener('pointermove', move); window.removeEventListener('pointerdown', down, { capture: true }); window.removeEventListener('pointerup', up, { capture: true });
  window.removeEventListener('touchstart', away); window.removeEventListener('keydown', key);
  document.removeEventListener('pointerleave', away); document.removeEventListener('visibilitychange', away);
  release(); sp && sp.destroy(); el && el.remove(); el = null; sp = null; unreg && unreg(); unreg = null; clearTimeout(idleT);
}
