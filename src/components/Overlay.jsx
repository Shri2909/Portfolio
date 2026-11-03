import { useEffect, useRef } from 'react';

// Native modal dialog shell: top layer, Escape, focus trap. Focus lands on the title;
// closing returns focus to whatever opened it. Backdrop tap closes. Never touches the URL.
export default function Overlay({ id, open, onClose, titleId, className = '', children, sheet = true, hidden = false }) {
  const ref = useRef(null);
  const opener = useRef(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !hidden && !d.open) {
      if (!opener.current) opener.current = document.activeElement;
      d.showModal();
      const t = d.querySelector('[data-title]');
      if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
    } else if ((!open || hidden) && d.open) d.close();
    if (!open && opener.current) {
      const o = opener.current; opener.current = null;
      requestAnimationFrame(() => { if (o && o.isConnected && o.focus) o.focus(); else document.getElementById('night-h')?.focus(); });
    }
  }, [open, hidden]);
  return (
    <dialog
      ref={ref} id={id} className={`overlay ${sheet ? 'sheet' : ''} ${className}`} aria-labelledby={titleId}
      onCancel={(e) => { e.preventDefault(); onClose && onClose(); }}
      onClick={(e) => { if (e.target === ref.current) onClose && onClose(); }}
    >
      {open ? children : null}
    </dialog>
  );
}
