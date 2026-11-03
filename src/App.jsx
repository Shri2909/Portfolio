import { useEffect, useState, useSyncExternalStore } from 'react';
import { flushSync } from 'react-dom';
import copy, { X } from './lib/copy.js';
import { getState } from './lib/store.js';
import { useStore } from './lib/useStore.js';
import { announcer } from './lib/announce.js';
import { parseHash } from './lib/hash.js';
import { startGovernor } from './lib/quality.js';
import { startFavicon } from './lib/favicon.js';
import { wireOpeners, openSixty, openEvidence, openText, closeOverlay, closeText, scrollToId } from './lib/nav.js';
import { rich } from './lib/rich.jsx';
import TopBar from './components/TopBar.jsx';
import Dock from './components/Dock.jsx';
import Overlay from './components/Overlay.jsx';
import FullTextView from './components/FullTextView.jsx';
import Night from './components/Night.jsx';
import Lamps from './components/Lamps.jsx';
import RowBreathes from './components/RowBreathes.jsx';
import Lamp6 from './components/Lamp6.jsx';
import Person from './components/Person.jsx';
import Voice from './components/Voice.jsx';
import Verdict from './components/Verdict.jsx';
import Wish from './components/Wish.jsx';
import Closure from './components/Closure.jsx';
import Footer from './components/Footer.jsx';
import SixtyDialog from './components/SixtyDialog.jsx';
import EvidenceDrawer from './components/EvidenceDrawer.jsx';

export default function App() {
  const overlay = useStore((s) => s.overlay);
  const text = overlay === 'text';
  const live = useSyncExternalStore(announcer.subscribe, announcer.get);
  const [printing, setPrinting] = useState(false);
  useEffect(() => {
    wireOpeners(); startGovernor(); startFavicon();
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
    return () => { window.removeEventListener('hashchange', route); window.removeEventListener('beforeprint', bp); window.removeEventListener('afterprint', ap); };
  }, []);
  return (
    <>
      <a className="skip-link" href="#main" onClick={(e) => { e.preventDefault(); const m = document.getElementById('main'); m.focus(); m.scrollIntoView(); }}>{copy.ui.skip}</a>
      <TopBar />
      <div id="stage" aria-hidden="true"><div id="sky" /><div id="skyline" /><canvas id="fx" /></div>
      <main id="main" tabIndex={-1}>
        <Night />
        <Lamps />
        <RowBreathes />
        <Lamp6 />
        <Person />
        <Voice />
        <Verdict />
        <Wish />
        <Closure />
      </main>
      <Footer />
      <Dock />
      <SixtyDialog />
      <EvidenceDrawer />
      <dialog id="lamp-sheet" className="overlay sheet" aria-label="Lamp story" />
      {(text || printing) && <FullTextView onClose={closeText} />}
      <div id="announcer" role="status" aria-live="polite" className="sr-only">{live}</div>
    </>
  );
}
