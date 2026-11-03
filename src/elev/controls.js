// E2.7: one delegated listener. Press feedback lands in the same frame, independent of :active.
const SEL = '[data-press], .btn, button, a[href], .lamp-btn, input[type=range]';
const down = new Set();
const add = (e) => { const t = e.target.closest && e.target.closest(SEL); if (t && !t.disabled) { t.classList.add('is-down'); down.add(t); } };
const clear = () => { down.forEach((t) => t.classList.remove('is-down')); down.clear(); };
export function start() {
  window.addEventListener('pointerdown', add, { capture: true, passive: true });
  for (const e of ['pointerup', 'pointercancel', 'dragend']) window.addEventListener(e, clear, { capture: true, passive: true });
  document.addEventListener('pointerleave', clear);
}
export function stop() {
  window.removeEventListener('pointerdown', add, { capture: true });
  for (const e of ['pointerup', 'pointercancel', 'dragend']) window.removeEventListener(e, clear, { capture: true });
  document.removeEventListener('pointerleave', clear); clear();
}
