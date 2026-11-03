import copy from '../lib/copy.js';
import { useStore } from '../lib/useStore.js';
import { closeOverlay } from '../lib/nav.js';
import Overlay from './Overlay.jsx';

export default function EvidenceDrawer() {
  const open = useStore((s) => s.overlay === 'evidence');
  return (
    <Overlay id="evidence" open={open} onClose={closeOverlay} titleId="evidence-h">
      <div className="overlay-in"><h2 id="evidence-h" data-title>{copy.evidence.title}</h2><button className="btn" onClick={closeOverlay}>{copy.ui.close}</button></div>
    </Overlay>
  );
}
