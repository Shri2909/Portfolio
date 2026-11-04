import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { tpl } from '../lib/tpl.js';
import { scrollToId } from '../lib/nav.js';
import { useStore } from '../lib/useStore.js';
import { announce } from '../lib/announce.js';
import { shape } from './Lamp.jsx';
import Step from './Step.jsx';

// The last lamp: a proposed test, never run. It draws as a sketch and never lights (it never touches the store).
// The Group Admin Tax: a proposed idea, in Shriniwas's own words, with a five-step architecture. Nothing here is a result.
const Line = ({ t }) => { const em = /^\*(?!\*)(.+)\*$/.exec(t); const p = /^\*\*(.+)\*\*$/.test(t); return <p className={p ? 'pull' : undefined}>{em ? <em>{rich(em[1])}</em> : rich(t)}</p>; };
export default function Growth() {
  const g = copy.growth, calm = useStore((s) => s.calm), sec = useRef(null), spark = useRef(null);
  const [seen, setSeen] = useState(calm), [line, setLine] = useState(''), S = shape(6), k = 2;
  useEffect(() => { if (calm) { setSeen(true); return; } const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.2 }); sec.current && io.observe(sec.current); return () => io.disconnect(); }, [calm]);
  const press = () => { setLine(g.tryLight); announce(X('lamp6Live')); const e = spark.current; if (e && !calm) e.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(2.4)' }], { duration: 500, easing: 'ease-out' }); };
  const wx = S.wickTip[0] * k, wy = S.wickTip[1] * k;
  return (
    <section id="lamp-6" className="sec growth" aria-labelledby="lamp-6-h" ref={sec}>
      <div className={`sketch-wrap ${seen ? 'drawn' : ''}`}>
        <p className="badge"><span>{g.badge}</span></p>
        <button className="sketch-btn" aria-label={X('lamp6Aria')} onPointerDown={(e) => { e.preventDefault(); press(); }} onClick={(e) => { if (e.detail === 0) press(); }}>
          <svg viewBox="0 0 240 180" aria-hidden="true" className="sketch">
            <defs><pattern id="grid6" width="12" height="12" patternUnits="userSpaceOnUse"><path d="M12 0H0V12" fill="none" stroke="rgba(160,190,230,.12)" strokeWidth=".6" /></pattern></defs>
            <rect width="240" height="180" fill="url(#grid6)" />
            <g transform="translate(0 6)">
              <path pathLength="1" className="draw" d={`M${S.xl * k} ${S.y0 * k}C${S.xl * k} ${(S.y0 + S.bd * 0.85) * k} ${(S.cx - S.rw * 0.22) * k} ${S.bottom * k} ${S.cx * k} ${S.bottom * k}C${(S.cx + S.rw * 0.22) * k} ${S.bottom * k} ${S.xr * k} ${(S.y0 + S.bd * 0.85) * k} ${S.xr * k} ${S.y0 * k}Q${(S.xr + S.ll * 0.5) * k} ${(S.y0 - 4 - S.v.kink * 0.3) * k} ${S.tipX * k} ${S.tipY * k}`} />
              <ellipse pathLength="1" className="draw" cx={S.cx * k} cy={S.y0 * k} rx={(S.rw / 2) * k} ry={7 * k} />
              <path className="centre" d={`M${S.cx * k} 20V${(S.bottom + 12) * k}`} />
              <path className="flame-dots" d={`M${wx} ${wy}c-8 -16 -9 -30 0 -44c9 14 8 28 0 44z`} />
              <circle ref={spark} cx={wx} cy={wy} r="4" className="spark" style={{ opacity: 0 }} />
            </g>
          </svg>
        </button>
        <p className="live" role="status" aria-live="polite">{line ? rich(line) : ''}</p>
      </div>
      <div className="panel growth-copy">
        <Step k="s4" />
        <p className="kicker">{g.kicker}</p>
        <h2 id="lamp-6-h" tabIndex={-1}>{rich(g.title)}</h2>
        <p className="tagline">{rich(g.sub.replace(/^\*|\*$/g, ''))}</p>
        {g.story.map((t, i) => <Line key={i} t={t} />)}
        <h3>{g.ideaHead}</h3>
        {g.idea.map((t, i) => <Line key={i} t={t} />)}
        <h3>{g.archHead}</h3>
        <ol className="arch">{g.arch.map((a, i) => <li key={i}><strong>{a.h}</strong><span>{a.t}</span></li>)}</ol>
        <p className="next-lamp"><button className="btn btn-ghost" onClick={() => scrollToId('verdict')}>{rich(tpl(X('nextToInvite'), { step: copy.journey.s5.n }))}</button></p>
      </div>
    </section>
  );
}
