import { X } from '../lib/copy.js';
import { actions } from '../lib/store.js';
import { useStore } from '../lib/useStore.js';

// Bottom dock: Calm toggle (always visible), Look (Deepavali | Ink). Memory only, never stored.
export default function Dock({ children }) {
  const calm = useStore((s) => s.calm), manual = useStore((s) => s.calmManual), reduced = useStore((s) => s.reducedMotion), ink = useStore((s) => s.ink);
  return (
    <div id="dock" role="group" aria-label={X('look')}>
      <button className="btn" aria-pressed={calm} aria-label={X('calmAria')} disabled={reduced} onClick={() => actions.setCalm(!manual)}>
        <span lang="hi-Latn">{calm ? X('calmOnHi') : X('calmHi')}</span><span className="sr-only"> ({X('calm')})</span>
      </button>
      <div className="seg" role="group" aria-label={X('look')}>
        <button className="btn" aria-pressed={!ink} onClick={() => actions.setInk(false)}>{X('deepavali')}</button>
        <button className="btn" aria-pressed={ink} onClick={() => actions.setInk(true)}>{X('ink')}</button>
      </div>
      {children}
    </div>
  );
}
