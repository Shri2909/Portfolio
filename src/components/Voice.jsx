import { useMemo, useRef, useState } from 'react';
import copy, { X, flags } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { haptic } from '../lib/haptic.js';
import { takesDiff, viewAt, plainText } from '../lib/takesDiff.js';

// Two real takes, compared. Drag a flame from my voice to Flow's text: the words change one change at a time.
// Always-present plain version below each morph (visually hidden until "Read it plainly" is on).
function Take({ take, calm, quality, plainOn, hintId }) {
  const V = copy.voice, C = V.compare, x = copy.ui.extra;
  const diff = useMemo(() => takesDiff(take.raw, take.out), [take]);
  const M = diff.changeCount, [k, setK] = useState(0), drag = useRef(false);
  const instant = calm || quality === 'low';
  const labels = { trimmed: x.readPlainlyTrimmed, smoothed: x.readPlainlySmoothed, added: x.readPlainlyAdded };
  const plain = useMemo(() => plainText(diff, labels), [diff]);
  const view = viewAt(diff, diff.plainOnly ? 0 : k);
  const spoken = k === 0 ? x.takeValue0 : k === M ? x.takeValueLast : tpl(x.takeValueN, { k, m: M });
  const sid = `slider-${take.id}`;
  const set = (v) => { const n = Math.max(0, Math.min(M, v)); if (n !== k) { setK(n); if (drag.current) haptic(8); } };
  const onKey = (e) => { if (e.key === 'PageUp') { e.preventDefault(); set(k + 5); } else if (e.key === 'PageDown') { e.preventDefault(); set(k - 5); } };
  return (
    <article className={`take ${instant ? 'instant' : ''}`} aria-labelledby={`${take.id}-l`}>
      <p className="chip-line"><span className="chip-pill">{V.chip}</span></p>
      <p className="take-label" id={`${take.id}-l`}><strong>{take.label}</strong> · {take.when} · <strong>{take.badge}</strong></p>
      <div className="take-card">
        {!plainOn && !diff.plainOnly && (
          <>
            <p className="morph" aria-hidden="true">
              {view.map((w, i) => (
                <span key={i}><span className={`w ${w.kind}`}>{w.text}</span>{w.brk ? <><br /><br /></> : ' '}</span>
              ))}
            </p>
            <div className="slider-row" data-no-swipe>
              <span className="ends">{C.asIsaid}</span>
              <input id={sid} type="range" min="0" max={M} step="1" value={k} aria-label={take.label + ': ' + C.asIsaid + ' / ' + C.asFlow} aria-valuetext={spoken} aria-describedby={hintId}
                onPointerDown={() => { drag.current = true; }} onPointerUp={() => { drag.current = false; }} onChange={(e) => set(+e.target.value)} onKeyDown={onKey} />
              <span className="ends">{C.asFlow}</span>
            </div>
          </>
        )}
        <div className={plainOn || diff.plainOnly ? 'plain-vis' : 'sr-only'}>
          <h3>{C.asIsaid}</h3>{plain.rawParas.map((p, i) => <p key={i}>{p}</p>)}
          <h3>{C.asFlow}</h3><p>{plain.flowText}</p>
          <p className="counts mono">{tpl(x.countsLine, { a: diff.trimmedWords, b: diff.smoothedWords + diff.addedWords })}</p>
        </div>
      </div>
    </article>
  );
}
export default function Voice() {
  const V = copy.voice, C = V.compare, calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const [plainOn, setPlain] = useState(false), [which, setWhich] = useState(1);
  const show = flags.flowIntoEmergentRecorded && V.recordingLink && V.gatedBuildLine;
  const parts = show ? V.gatedBuildLine.split('linked here') : null;
  return (
    <section id="voice" className="sec" aria-labelledby="voice-h">
      <div className="panel">
        <p className="kicker">{V.kicker}</p>
        <h2 id="voice-h" tabIndex={-1}>{rich(V.heading)}</h2>
        <p className="sub"><em>{V.sub}</em></p>
        {V.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
        {show && <p className="recording-line">{parts[0]}<a href={V.recordingLink} target="_blank" rel="noopener noreferrer">{X('recordingLinkText')}</a>{parts[1]}</p>}
      </div>
      <div className="compare">
        <p className="compare-h mono">{C.label}</p>
        <p id="compare-hint" className="hint">{rich(C.instruction)}</p>
        <p className="legend"><span className="sw trim-sw" aria-hidden="true">abc</span><span className="sw new-sw" aria-hidden="true">abc</span> {C.legend}</p>
        <button role="switch" aria-checked={plainOn} className="btn plain-switch" onClick={() => setPlain(!plainOn)}>{C.plainToggle}</button>
        <p className="sr-only">{C.altText}</p>
        <button className="btn" onClick={() => setWhich(which ? 0 : 1)}>{rich(V.otherTake)}</button>
        {V.takes.map((t, i) => <div key={t.id} hidden={i !== which}><Take take={t} calm={calm} quality={quality} plainOn={plainOn} hintId="compare-hint" /></div>)}
        <p className="provenance"><strong>{V.provenance.heading}</strong> {V.provenance.text}</p>
      </div>
    </section>
  );
}
