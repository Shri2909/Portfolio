import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { openEvidence, openSixty, openText, scrollToId } from '../lib/nav.js';
import { inviteVisible, contactHref } from '../lib/mail.js';
import { getState } from '../lib/store.js';

export default function TopBar() {
  const [open, setOpen] = useState(false);
  const btn = useRef(null);
  useEffect(() => {
    if (!open) return;
    const k = (e) => { if (e.key === 'Escape') { setOpen(false); btn.current && btn.current.focus(); } };
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [open]);
  const go = (fn) => () => { setOpen(false); fn(); };
  const nav = copy.ui.nav;
  return (
    <header id="topbar">
      <a className="wordmark" href="#night" onClick={(e) => { e.preventDefault(); scrollToId('night'); }}>{copy.opening.label.split(' · ')[0]}</a>
      <div className="right">
        {inviteVisible() && <a className="btn btn-primary" href={contactHref(getState().row.count + 1)} aria-label={copy.ui.invite.long + ', ' + X('mailAria')}>{copy.ui.invite.short}</a>}
        <button ref={btn} className="btn" aria-expanded={open} aria-controls="menu" aria-label={X('menu')} onClick={() => setOpen(!open)}>{X('menu')}</button>
      </div>
      {open && (
        <nav id="menu" className="menu" aria-label={X('menu')}>
          <a href="#lamps" onClick={(e) => { e.preventDefault(); go(() => scrollToId('lamps'))(); }}>{nav[0].label}</a>
          <a href="#evidence" onClick={(e) => { e.preventDefault(); go(() => openEvidence())(); }}>{nav[1].label}</a>
          <a href="#sixty" onClick={(e) => { e.preventDefault(); go(openSixty)(); }}>{nav[2].label}</a>
          <button onClick={go(openText)} aria-label={X('fullTextAria')} lang="hi-Latn">{X('fullText')}</button>
        </nav>
      )}
    </header>
  );
}
