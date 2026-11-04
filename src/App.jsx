import { useEffect, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import copy, { X } from './lib/copy.js';
import { getState } from './lib/store.js';
import { useStore } from './lib/useStore.js';
import { announcer } from './lib/announce.js';
import { parseHash } from './lib/hash.js';
import { wireRow } from './lib/row.js';
import { ShareBanner } from './components/RowFragment.jsx';
import { startGovernor } from './lib/quality.js';
import { startFavicon } from './lib/favicon.js';
import { wireOpeners, openSixty, openEvidence, openText, closeOverlay, closeText, scrollToId } from './lib/nav.js';
import { rich } from './lib/rich.jsx';
import Stage from './components/stage/Stage.jsx';
import TopBar from './components/TopBar.jsx';
import { CalmCorner } from './components/Dock.jsx';
import InviteSheet from './components/InviteSheet.jsx';
import Overlay from './components/Overlay.jsx';
import FullTextView from './components/FullTextView.jsx';
import Night from './components/Night.jsx';
import LampRow from './components/LampRow.jsx';
import LampStop from './components/LampStop.jsx';
import Baithak from './components/Baithak.jsx';
import Growth from './components/Growth.jsx';
import Pattern from './components/Pattern.jsx';
import GoDeeper from './components/GoDeeper.jsx';
import Voice from './components/Voice.jsx';
import Verdict from './components/Verdict.jsx';
import Wish from './components/Wish.jsx';
import Closure from './components/Closure.jsx';
import Footer from './components/Footer.jsx';
import SixtyDialog from './components/SixtyDialog.jsx';
import EvidenceDrawer from './components/EvidenceDrawer.jsx';
import LampCard from './components/LampCard.jsx';

export default function App() {
  const overlay = useStore((s) => s.overlay);
  const text = overlay === 'text';
  const live = useSyncExternalStore(announcer.subscribe, announcer.get);
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    let fgT = 0; const fg = (e) => { if (e.target.closest && e.target.closest('.device,.compare,.guess')) { document.documentElement.dataset.fg = '1'; clearTimeout(fgT); fgT = setTimeout(() => { delete document.documentElement.dataset.fg; }, 4000); } };
    window.addEventListener('pointerdown', fg);
    wireOpeners(); startGovernor(); startFavicon(); const offRow = wireRow();
    const route = () => {
      const r = parseHash(window.location.hash);
      if (!r) return;
      if (r.route === 'sixty') openSixty();
      else if (r.route === 'evidence') openEvidence(r.folder || null);
      else if (r.route === 'text') openText();
    };
    route();
    window.addEventListener('hashchange', route);
    const bp = () => flushSync(() => setPrinting(true)), ap = () => setPrinting(false);
    window.addEventListener('beforeprint', bp); window.addEventListener('afterprint', ap);
    return () => { offRow(); window.removeEventListener('hashchange', route); window.removeEventListener('beforeprint', bp); window.removeEventListener('afterprint', ap); };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById('main'); m.focus(); m.scrollIntoView(); }}>{copy.ui.skip}</a>
      <TopBar />
      <Stage />
      <main id="main" tabIndex={-1}>
        <Night banner={<ShareBanner />}><LampRow /></Night>
        <Baithak />
        {[1, 2, 3].map((n) => <LampStop key={n} n={n} />)}
        <Pattern />
        <Voice />
        <Growth />
        <Verdict />
        <GoDeeper />
        <Wish />
        <Closure />
      </main>
      <Footer />
      <CalmCorner />
      <SixtyDialog />
      <InviteSheet />
      <EvidenceDrawer />
      <LampCard />
      {(text || printing) && <FullTextView onClose={closeText} />}
      <div id="announcer" role="status" aria-live="polite" className="sr-only">{live}</div>
    </>
  );
}
