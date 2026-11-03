import { useEffect, useRef, useState } from 'react';
import copy, { flags, X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { announce } from '../lib/announce.js';
import { shape } from './Lamp.jsx';

// Lamp six, the proposed one, drawn as a sketch: thin blueprint lines on the dark ground, no fill, a dashed outline,
// a faint grid, a dash-dot centre line, dimension ticks, a dotted outline where a flame would be.
// It never lights. It never touches the lit count, the tone or the lamps in the store.
export default function Lamp6() {
  const L = copy.lamp6, calm = useStore((s) => s.calm);
  const sec = useRef(null), spark = useRef(null);
  const [seen, setSeen] = useState(calm), [line, setLine] = useState('');
  const S = shape(6), k = 2;
  useEffect(() => {
    if (calm) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.35 });
    sec.current && io.observe(sec.current);
    return () => io.disconnect();
  }, [calm]);
  const press = () => {
    setLine(L.tryLight); announce(X('lamp6Live'));
    const e = spark.current; if (e && !calm) e.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(2.4)' }], { duration: 500, easing: 'ease-out' });
  };
  const wx = S.wickTip[0] * k, wy = S.wickTip[1] * k;
  const dim = (x1, y1, x2, y2) => <path d={`M${x1} ${y1}L${x2} ${y2}M${x1} ${y1 - 3}v6M${x2} ${y2 - 3}v6`} className="dim-line" />;
  return (
    <section id="lamp-6" className="sec" aria-labelledby="lamp-6-h" ref={sec}>
      <div className="apart" />
      <div className={`sketch-wrap ${seen ? 'drawn' : ''}`}>
        <p className="badge"><span>{L.badge}</span></p>
        <button className="sketch-btn" aria-label={X('lamp6Aria')} onPointerDown={(e) => { e.preventDefault(); press(); }} onClick={(e) => { if (e.detail === 0) press(); }}>
          <svg viewBox="0 0 240 180" aria-hidden="true" className="sketch">
            <defs><pattern id="grid6" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="rgba(160,190,230,.12)" strokeWidth=".6" /></pattern></defs>
            <rect width="240" height="180" fill="url(#grid6)" />
            <g transform="translate(0 6)">
              <path pathLength="1" className="draw" d={`M${S.xl * k} ${S.y0 * k}C${S.xl * k} ${(S.y0 + S.bd * 0.85) * k} ${(S.cx - S.rw * 0.22) * k} ${S.bottom * k} ${S.cx * k} ${S.bottom * k}C${(S.cx + S.rw * 0.22) * k} ${S.bottom * k} ${S.xr * k} ${(S.y0 + S.bd * 0.85) * k} ${S.xr * k} ${S.y0 * k}Q${(S.xr + S.ll * 0.5) * k} ${(S.y0 - 4 - S.v.kink * 0.3) * k} ${S.tipX * k} ${S.tipY * k}`} />
              <ellipse pathLength="1" className="draw" cx={S.cx * k} cy={S.y0 * k} rx={(S.rw / 2) * k} ry={7 * k} />
              <path className="centre" d={`M${S.cx * k} 20V${(S.bottom + 12) * k}`} />
              {dim(S.xl * k, (S.bottom + 10) * k, S.xr * k, (S.bottom + 10) * k)}{dim((S.xl - 10) * k, S.y0 * k, (S.xl - 10) * k, S.bottom * k)}
              <path className="flame-dots" d={`M${wx} ${wy}c-8 -16 -9 -30 0 -44c9 14 8 28 0 44z`} />
              <circle ref={spark} cx={wx} cy={wy} r="4" className="spark" style={{ opacity: 0 }} />
            </g>
          </svg>
        </button>
        <p className="live" role="status" aria-live="polite">{line ? rich(line) : ''}</p>
      </div>
      <div className="panel lamp6-copy">
        <p className="kicker">{L.kicker}</p>
        <h2 id="lamp-6-h" tabIndex={-1}>{rich(L.title)}</h2>
        <h3>{L.idea.heading}</h3>
        {L.idea.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
        <ul className="index-cards">{L.idea.variants.map((v) => <li key={v.id}><span className="mono">{v.label}</span><q>{v.text.replace(/^"|"$/g, '')}</q></li>)}</ul>
        {flags.lamp6LanguageLine && <p className="opt">{L.optionalNote.text}</p>}
        <h3>{L.warning.heading}</h3>
        {L.warning.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
        <button className="btn btn-primary" data-evidence={L.cta.folder}>{L.cta.label}</button>
      </div>
    </section>
  );
}
