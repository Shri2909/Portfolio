import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { announce } from '../lib/announce.js';
import { shape } from './Lamp.jsx';
import InviteButton from './InviteButton.jsx';
import Step from './Step.jsx';

// The last lamp: a proposed test, never run. It draws as a sketch and never lights (it never touches the store).
// The Handover Test: three small taps (all labelled as illustrations, documented behaviour or simulated), the experiment in short,
// and links to Wispr's own pages. Nothing here is a result.
const WORDS_STEP = 250;
function TapOne({ g }) {
  const [lang, setLang] = useState('hinglish'), t = g.taps.t1;
  return (
    <div className="tap">
      <h3>{rich(t.label)}</h3>
      <div className="chips" role="group" aria-label={t.label.replace(/<\/?hi>/g, '')}>
        {['hindi', 'hinglish'].map((k) => <button key={k} type="button" className="btn" aria-pressed={lang === k} onClick={() => setLang(k)}>{X(k + 'Chip')}</button>)}
      </div>
      <p className="illus" lang={lang === 'hindi' ? 'hi' : 'hi-Latn'}>{lang === 'hindi' ? t.hindi : t.hinglish}</p>
      <p>{t.caption}</p><p className="caption">{t.note}</p>
      <p className="twin">{t.hindi} · {t.hinglish}. {t.caption}</p>
    </div>
  );
}
function TapTwo({ g }) {
  const t = g.taps.t2, [a, setA] = useState(3), [b, setB] = useState(3);
  const fires = b >= 4 && b - a >= 2 ? 'scale' : b - a === 1 ? 'change' : a >= b ? 'kill' : '';
  return (
    <div className="tap">
      <h3>{rich(t.label)}</h3>
      <label>{t.a}<span className="val">{a}</span><input type="range" min="0" max="6" step="1" value={a} aria-label={X('sliderA') + ': ' + t.a} onChange={(e) => setA(+e.target.value)} /></label>
      <label>{t.b}<span className="val">{b}</span><input type="range" min="0" max="6" step="1" value={b} aria-label={X('sliderB') + ': ' + t.b} onChange={(e) => setB(+e.target.value)} /></label>
      <p role="status" aria-live="polite" className="fires">{fires ? X('firesLabel') + ' ' + fires[0].toUpperCase() + fires.slice(1) + '.' : X('firesNone')}</p>
      <ul className="rule" aria-label={X('handoverRuleAria')}>{['scale', 'change', 'kill'].map((k) => <li key={k} className={fires === k ? 'hit' : ''}>{t[k]}</li>)}</ul>
      <p className="caption">{t.note}</p>
    </div>
  );
}
function TapThree({ g }) {
  const t = g.taps.t3, [n, setN] = useState(0), done = n >= 2000;
  return (
    <div className="tap">
      <h3>{rich(t.label)}</h3>
      <button type="button" className="btn btn-primary" onClick={() => { const m = Math.min(2000, n + WORDS_STEP); setN(m); if (m >= 2000) announce(t.rule); }}>{X('wordsMore')}</button>
      <p className={`counter mono ${done ? 'done' : ''}`} role="status" aria-live="polite">{tpl(X('wordsCounter'), { n: n.toLocaleString('en-IN') })}</p>
      <p>{t.rule}</p><p className="caption">{t.note}</p>
    </div>
  );
}
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
        <p className="hook"><strong>{g.hook}</strong></p>
        <p>{rich(g.body)}</p>
        <h3>{g.taps.head}</h3>
        <TapOne g={g} /><TapTwo g={g} /><TapThree g={g} />
        <h3>{g.cardHead}</h3>
        <p>{g.card}</p>
        <p>{g.why}</p>
        <p><strong>{g.limits}</strong></p>
        <p className="btn-row"><button className="btn" data-evidence="c8">{rich(g.protocol)}</button></p>
        <h3>{g.sourcesHead}</h3>
        <ul className="sources">{g.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label + X('inviteTabAria')}>{s.label}</a>{s.what ? ': ' + s.what : ''} <span className="mono tag">[{s.tag}]</span></li>)}</ul>
        <div className="growth-invite"><InviteButton /> <span>{rich(g.inviteLine)}</span></div>
        <p className="next-hint">{rich(g.exit)}</p>
      </div>
    </section>
  );
}
