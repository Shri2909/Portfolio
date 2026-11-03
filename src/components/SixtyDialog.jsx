import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { closeOverlay } from '../lib/nav.js';
import InviteButton from './InviteButton.jsx';
import Overlay from './Overlay.jsx';

// The 60-second file: a bottom sheet (native modal dialog). Never writes to the address bar.
export default function SixtyDialog() {
  const open = useStore((s) => s.overlay === 'sixty'), row = useStore((s) => s.row), vl = useStore((s) => s.visitorLit), S = copy.sixty;
  return (
    <Overlay id="sixty" open={open} onClose={closeOverlay} titleId="sixty-h">
      <div className="overlay-in sixty">
        <i className="wick" aria-hidden="true" />
        <div className="overlay-head">
          <p className="kicker" id="sixty-h" data-title>{S.label} <span className="hi-note">{rich(S.hi)}</span></p>
          <button className="btn" onClick={closeOverlay}>{copy.ui.close}</button>
        </div>
        <h2>{S.headline}</h2>
        {S.paras.map((p, i) => <p key={i}>{p}</p>)}
        <p><em>{S.pull}</em></p>
        <p className="btn-row">
          <button className="btn btn-primary" data-evidence="c1">{S.receiptCta}</button>
          <InviteButton label={S.inviteCta} className="btn" />
        </p>
      </div>
    </Overlay>
  );
}
