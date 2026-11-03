import copy from '../lib/copy.js';
import { useStore } from '../lib/useStore.js';
import { closeOverlay } from '../lib/nav.js';
import Overlay from './Overlay.jsx';

export default function SixtyDialog() {
  const open = useStore((s) => s.overlay === 'sixty');
  return (
    <Overlay id="sixty" open={open} onClose={closeOverlay} titleId="sixty-h">
      <div className="overlay-in"><h2 id="sixty-h" data-title>{copy.sixty.label}</h2><button className="btn" onClick={closeOverlay}>{copy.ui.close}</button></div>
    </Overlay>
  );
}
