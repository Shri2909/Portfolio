import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { openEvidence, openSixty, openText, scrollToId } from '../lib/nav.js';
import { emit } from '../lib/events.js';
import InviteButton from './InviteButton.jsx';
import DockControls from './Dock.jsx';

export default function TopBar() {
  const [open, setOpen] = useState(false), [after2, setAfter2] = useState(false);
  useEffect(() => { const h = () => { const e = document.getElementById('lamp-2'); if (e && e.getBoundingClientRect().top < innerHeight * 0.9) setAfter2(true); }; h(); window.addEventListener('scroll', h, { passive: true }); return () => window.removeEventListener('scroll', h); }, []);
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
        <span className="quick" role="group" aria-label={X('quickNav')}>
          <a href={copy.site.links.resume} target="_blank" rel="noopener noreferrer" aria-label={X('quickResume') + X('inviteTabAria')}><span className="qf">{X('quickResume')}</span><span className="qs" aria-hidden="true">{X('quickResumeShort')}</span></a>
          {copy.site.contact.linkedin && <a href={copy.site.contact.linkedin} target="_blank" rel="noopener noreferrer" aria-label={X('quickLinkedin') + X('inviteTabAria')}><span className="qf">{X('quickLinkedin')}</span><span className="qs" aria-hidden="true">{X('quickLinkedinShort')}</span></a>}
          {copy.site.contact.github && <a href={copy.site.contact.github} target="_blank" rel="noopener noreferrer" aria-label={X('quickGithub') + X('inviteTabAria')}><span className="qf">{X('quickGithub')}</span><span className="qs" aria-hidden="true">{X('quickGithubShort')}</span></a>}
        </span>
        {after2 && <InviteButton short />}
        <button ref={btn} className="btn" aria-expanded={open} aria-controls="menu" aria-label={X('menu')} onClick={() => setOpen(!open)}>{X('menu')}</button>
      </div>
      {open && (
        <nav id="menu" className="menu" aria-label={X('menu')}>
          <button onClick={go(openText)} aria-label={X('fullTextAria')} lang="hi-Latn">{X('menuFullText')}</button>
          <button onClick={go(openSixty)}>{X('menuSixty')}</button>
          <button onClick={go(() => openEvidence())}>{X('menuEvidence')}</button>
          <button onClick={go(() => emit('lamp:lightAll'))} lang="hi-Latn">{X('menuLightAll')}</button>
          <button onClick={go(() => scrollToId('lamp-6'))} lang="hi-Latn">{X('menuLast')}</button>
          <DockControls />
        </nav>
      )}
    </header>
  );
}
