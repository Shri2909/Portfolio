import { X } from '../lib/copy.js';
import { actions } from '../lib/store.js';
import { useStore } from '../lib/useStore.js';
import TiltChip from './TiltChip.jsx';

// Look (Deepavali | Ink) and Tilt live in the Menu. One small Calm button stays in the bottom-right corner (CalmCorner).
export default function DockControls() {
  const ink = useStore((s) => s.ink);
  return (
    <div className="look" role="group" aria-label={X('look')}>
      <div className="seg" role="group" aria-label={X('look')}>
        <button className="btn" aria-pressed={!ink} onClick={() => actions.setInk(false)}>{X('deepavali')}</button>
        <button className="btn" aria-pressed={ink} onClick={() => actions.setInk(true)}>{X('ink')}</button>
      </div>
      <TiltChip />
    </div>
  );
}
export function CalmCorner() {
  const calm = useStore((s) => s.calm), manual = useStore((s) => s.calmManual), reduced = useStore((s) => s.reducedMotion);
  return <button id="calm-corner" className="btn" aria-pressed={calm} aria-label={X('calmCornerAria')} disabled={reduced} onClick={() => actions.setCalm(!manual)}>{X('calmCorner')}</button>;
}
