import { useEffect, useRef, useState } from 'react';
import copy from '../../lib/copy.js';
import { tpl, hiOf } from '../../lib/tpl.js';
import { rich } from '../../lib/rich.jsx';
import { haptic } from '../../lib/haptic.js';
import { useStore } from '../../lib/useStore.js';

// A flame message travelling a wire towards a 3-second gate. The wire is the real range input.
// MODEL OF DOCUMENTED BEHAVIOR: a simulated connection, not real monitoring.
// Slider uses an integer index 0..15 with t = index x 0.4, so exactly 3.0 s can never be chosen (reconciliation R9).
export default function LateReplySlider() {
  const L = copy.lateReply, sl = L.slider, calm = useStore((s) => s.calm);
  const start = Math.round(sl.start / sl.step);
  const [i, setI] = useState(start), [logic, setLogic] = useState('original'), [shownI, setShownI] = useState(start), [swing, setSwing] = useState(0);
  const last = useRef(0), prevAfter = useRef(false);
  const t = +(i * sl.step).toFixed(1), after = t > sl.deadline, tt = t.toFixed(1);
  // readout and live region update at most every 400 ms
  useEffect(() => { const id = setTimeout(() => setShownI(i), 400); return () => clearTimeout(id); }, [i]);
  useEffect(() => { if (after !== prevAfter.current) { prevAfter.current = after; haptic(10); } }, [after]);
  const ts = +(shownI * sl.step).toFixed(1), shownAfter = ts > sl.deadline, tts = ts.toFixed(1);
  const readout = !shownAfter ? L.readout.before : logic === 'original' ? L.readout.afterOriginal : L.readout.afterCorrected;
  const pct = (i / Math.round(sl.max / sl.step)) * 100;
  const counted = !after || logic === 'original';
  const flip = (id) => { if (id !== logic) { setLogic(id); if (!calm) { setSwing((x) => x + 1); } } };
  return (
    <div className="device late" data-no-swipe>
      <p className="badge-line"><span className="model-badge">{L.badge}</span> <span>{L.badgeNote}</span></p>
      <p className="plain">{L.plain}</p>
      <p className="inst">{rich(L.instruction)}</p>
      <div role="group" aria-label={L.logicLabel} className="seg-logic">
        <span className="lbl">{L.logicLabel}</span>
        {L.logics.map((o) => <button key={o.id} className="btn" aria-pressed={logic === o.id} onClick={() => flip(o.id)}>{o.label}</button>)}
      </div>
      <div className={`wire ${after ? 'after' : 'before'} ${!counted ? 'dim' : ''}`} style={{ '--pos': pct + '%' }}>
        <div className="gate" aria-hidden="true">
          <i className="post l" /><i className="post r" />
          <b key={swing} className={`garland ${swing ? 'swing' : ''}`}>{Array.from({ length: 5 }, (_, j) => <em key={j} />)}</b>
          <span className="gate-label">{sl.deadlineLabel}</span>
        </div>
        <input type="range" min="0" max={Math.round(sl.max / sl.step)} step="1" value={i} aria-label={sl.assistive}
          aria-valuetext={tpl(after ? sl.spokenAfter : sl.spokenBefore, { t: tt })} onChange={(e) => setI(+e.target.value)} />
        {after && <span className={`reply-mark ${counted ? 'counted' : 'not-counted'}`} aria-hidden="true" />}
      </div>
      {after && <p className="caption">{rich(copy.lamps[2].stop[logic === 'original' ? 'flameOriginal' : 'flameCorrected'])}</p>}
      <p className="readout" role="status" aria-live="polite">{rich(tpl(readout, { t: tts }))}</p>
    </div>
  );
}
