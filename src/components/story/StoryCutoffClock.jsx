import { useRef, useState } from 'react';
import copy, { X } from '../../lib/copy.js';
import { tpl, hiOf } from '../../lib/tpl.js';
import { rich } from '../../lib/rich.jsx';
import { haptic } from '../../lib/haptic.js';
import { useStore } from '../../lib/useStore.js';

// A minute dial around six o'clock: top 06:00, three o'clock 06:15, nine o'clock 05:45. The real control is a range input with three stops.
// MODEL OF DOCUMENTED BEHAVIOR: a simulated cutoff, not a live database. One documented direct-ingestion daylight-saving fold case.
const STOPS = ['05:45', '06:00', '06:15'];
export default function StoryCutoffClock() {
  const calm = useStore((s) => s.calm), ex = copy.ui.extra, L = copy.lateReply;
  const [stop, setStop] = useState(1), [route, setRoute] = useState('direct'), [drag, setDrag] = useState(null);
  const dial = useRef(null);
  const time = STOPS[stop];
  const visible = route === 'direct' ? stop >= 1 : stop === 2;
  const ghost = route === 'direct' && stop === 1;
  const text = route === 'direct' ? [ex.cutoffDirect0545, ex.cutoffDirect0600, ex.cutoffDirect0615][stop] : stop === 2 ? ex.cutoffCsv0615 : tpl(ex.cutoffCsvEarly, { time });
  const ang = drag != null ? drag : (stop - 1) * 90;
  const set = (s) => { if (s !== stop) haptic(8); setStop(s); };
  const angleOf = (e) => { const r = dial.current.getBoundingClientRect(), a = Math.atan2(e.clientY - (r.top + r.height / 2), e.clientX - (r.left + r.width / 2)) * 180 / Math.PI + 90; return Math.max(-90, Math.min(90, a > 180 ? a - 360 : a)); };
  const pd = (e) => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(angleOf(e)); };
  const pm = (e) => { if (drag != null) setDrag(angleOf(e)); };
  const pu = () => { if (drag == null) return; const s = Math.round(drag / 90) + 1; setDrag(null); set(s); };
  const flameCls = visible ? (ghost && !calm ? 'ghost drift' : ghost ? 'ghost' : 'solid') : 'off';
  return (
    <div className="device clock" data-no-swipe>
      <p className="badge-line"><span className="model-badge">{L.badge}</span> <span>{ex.cutoffSentence}</span></p>
      <div className="seg-logic" role="group" aria-label={ex.routeDirect + ' / ' + ex.routeCsv}>
        <button className="btn" aria-pressed={route === 'direct'} onClick={() => setRoute('direct')}>{ex.routeDirect}</button>
        <button className="btn" aria-pressed={route === 'csv'} onClick={() => setRoute('csv')}>{ex.routeCsv}</button>
      </div>
      <p className="note">{ex.routeNote}</p>
      <svg ref={dial} className="dial" viewBox="-100 -100 200 200" role="presentation" onPointerDown={pd} onPointerMove={pm} onPointerUp={pu} onPointerCancel={pu} style={{ touchAction: 'none' }}>
        <circle r="84" className="face" />
        {[-90, 0, 90].map((a) => <g key={a} transform={`rotate(${a})`}><path d="M0-84v-8" className="tick" /><text y="-98" className="tlabel" textAnchor="middle" transform={`rotate(${-a} 0 -98)`}>{STOPS[a / 90 + 1]}</text></g>)}
        <text className="utc" y="6" textAnchor="middle">UTC</text>
        <g className={`flame6 ${flameCls}`} transform="translate(60 0)"><circle r="14" className="halo" /><path d="M0 8C-7 2-5-8 0-14C5-8 7 2 0 8Z" /></g>
        <g className="hand" style={{ transform: `rotate(${ang}deg)`, transition: drag == null && !calm ? 'transform .25s' : 'none' }}><path d="M0 0V-72" /><circle cy="-72" r="7" /></g>
        <circle r="4" className="hub" />
      </svg>
      <label className="rng"><span className="sr-only">{ex.cutoffLabel}</span>
        <input type="range" min="0" max="2" step="1" value={stop} aria-label={ex.cutoffLabel} aria-valuetext={tpl(ex.cutoffSpoken, { time })} onChange={(e) => set(+e.target.value)} />
      </label>
      <p className="readout" role="status" aria-live="polite">{text}</p>
      <p className="tap-line">{rich(copy.lamps[4].stop.clock)}</p>
      <p className="caption">{rich(copy.lamps[4].stop.caption)}</p>
      <p className="band-note"><strong>{copy.lamps[4].warning.paras[0].match(/\*\*(.*?)\*\*/)[1]}</strong></p>
    </div>
  );
}
