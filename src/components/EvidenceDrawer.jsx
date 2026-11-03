import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { closeOverlay } from '../lib/nav.js';
import Overlay from './Overlay.jsx';
import EvidenceBody from './EvidenceBody.jsx';

// The evidence drawer: eight folders as an accordion of paper tabs, one open at a time. Statuses are plain grey text.
export default function EvidenceDrawer() {
  const open = useStore((s) => s.overlay === 'evidence'), want = useStore((s) => s.evidenceCase), calm = useStore((s) => s.calm);
  const [cur, setCur] = useState(null), refs = useRef({});
  const E = copy.evidence;
  useEffect(() => {
    if (!open) return;
    setCur(want || null);
    if (want) setTimeout(() => { const b = refs.current[want]; if (b) { b.focus({ preventScroll: true }); b.scrollIntoView({ block: 'start', behavior: 'auto' }); } }, 60);
  }, [open, want]);
  const toggle = (id) => { setCur(cur === id ? null : id); setTimeout(() => refs.current[id] && refs.current[id].scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' }), 30); };
  const key = (e, i) => {
    const ids = E.folders.map((f) => f.id); let n = -1;
    if (e.key === 'ArrowDown') n = Math.min(ids.length - 1, i + 1); else if (e.key === 'ArrowUp') n = Math.max(0, i - 1); else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = ids.length - 1;
    if (n >= 0) { e.preventDefault(); refs.current[ids[n]].focus(); }
  };
  return (
    <Overlay id="evidence" open={open} onClose={closeOverlay} titleId="evidence-h">
      <div className="overlay-in evidence">
        <div className="overlay-head"><h2 id="evidence-h" data-title>{E.title}</h2><button className="btn" onClick={closeOverlay}>{copy.ui.close}</button></div>
        <p>{rich(E.intro)}</p>
        <div className="folders">
          {E.folders.map((f, i) => {
            const isOpen = cur === f.id;
            return (
              <div key={f.id} className={`folder ${isOpen ? 'open' : ''}`} style={{ '--off': (i % 3) * 10 + 'px', '--rot': (i % 2 ? 0.4 : -0.4) + 'deg' }}>
                <button ref={(el) => (refs.current[f.id] = el)} id={`tab-${f.id}`} className="tab" aria-expanded={isOpen} aria-controls={`panel-${f.id}`} onClick={() => toggle(f.id)} onKeyDown={(e) => key(e, i)}>
                  <strong>{f.name}</strong><span>{rich(f.blurb)}</span>
                </button>
                {isOpen && <div id={`panel-${f.id}`} role="region" aria-labelledby={`tab-${f.id}`} className="folder-body"><EvidenceBody folder={f} /></div>}
              </div>
            );
          })}
        </div>
      </div>
    </Overlay>
  );
}
