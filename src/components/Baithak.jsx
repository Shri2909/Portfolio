import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { engine } from '../lib/flame.js';
import { haptic } from '../lib/haptic.js';
import { scrollToId } from '../lib/nav.js';
import { meetCards } from '../lib/meet.js';
import Lamp from './Lamp.jsx';
import Flame from './Flame.jsx';

// Act 2: the sitting room. A window with four panes; tap a pane and one card opens beneath it (one hook line, "Aur dekhiye" for the rest).
// Every card keeps a Plain text disclosure in the page. With every flag OFF only verified sentences render.
const far = [[18, 14], [34, 38], [52, 12], [70, 30], [84, 16], [26, 56], [62, 52]];
const highlight = (id) => { const el = document.getElementById(id); if (!el) return; scrollToId(id); el.classList.add('hl'); setTimeout(() => el.classList.remove('hl'), 2600); };

function Proof({ lamp }) {
  if (!lamp) return null;
  return <button type="button" className="btn btn-ghost proof-chip" onClick={() => highlight(lamp === 6 ? 'lamp-6' : `lamp-${lamp}`)}>{X('proofLabel')} · Lamp {lamp}</button>;
}
function Card({ c, children, proof }) {
  const [open, setOpen] = useState(false);
  return (
    <article className="meet-card" aria-labelledby={`mc-${c.id}`}>
      <h3 id={`mc-${c.id}`}>{rich(c.title)}</h3>
      <p className="hook">{rich(c.hook)}</p>
      <button type="button" className="btn" aria-expanded={open} aria-controls={`mb-${c.id}`} onClick={() => setOpen(!open)}>{rich(X('moreLabel'))}</button>
      <div id={`mb-${c.id}`} hidden={!open} className="meet-body">
        {c.body && c.body.filter(Boolean).map((t, i) => <p key={i}>{rich(t)}</p>)}
        {children}
        {proof}
      </div>
      <details className="plain"><summary>{X('plainLabel')}</summary>
        <p>{rich([c.hook, ...(c.body || [])].filter(Boolean).join(' '))}</p>
      </details>
    </article>
  );
}
function EssayRing({ e }) {
  const [on, setOn] = useState(false);
  return (
    <div className="essay-ring">
      <button type="button" className="btn" aria-pressed={on} onClick={() => setOn(!on)}>{rich(e.tap)}</button>
      <svg viewBox="0 0 120 80" aria-hidden="true">{[0, 1, 2].map((i) => { const a = (i * 120 - 90) * Math.PI / 180; return <circle key={i} cx={60 + 20 * Math.cos(a)} cy={44 + 20 * Math.sin(a)} r="5" className="ring-lamp on" />; })}
        <circle cx="60" cy="44" r="20" className="ring-line" /><circle cx={on ? 100 : 60} cy={on ? 20 : 44} r="5" className={`ring-lamp outer ${on ? 'on' : ''}`} style={{ opacity: on ? 1 : 0 }} /></svg>
      <p className="mono small">{on ? e.ringLabel : ''}</p>
      <p className="caption">{e.caption}</p>
      {on && <p className="quote">{e.back}</p>}
    </div>
  );
}
function DebateFlip({ d }) {
  const [flip, setFlip] = useState(false);
  return (
    <div className="debate-flip">
      <button type="button" className="btn" aria-pressed={flip} onClick={() => setFlip(!flip)}>{rich(d.flip)}</button>
      <p><em>{(flip ? d.sideTwo : d.sideOne)[0]}</em> {(flip ? d.sideTwo : d.sideOne)[1]}</p>
      <p className="caption">{d.caption}</p>
    </div>
  );
}
function Loop({ L }) {
  const [i, setI] = useState(0);
  return (
    <div className="loop">
      <div className="loop-ring" role="group" aria-label={L.title.replace(/<\/?hi>/g, '')}>{L.steps.map((s, k) => <button key={k} type="button" className={`btn loop-stop ${i === k ? 'on' : ''}`} aria-pressed={i === k} aria-label={`${k + 1}. ${s.g}`} onClick={() => setI(k)}>{k + 1}</button>)}</div>
      <p className="loop-step"><strong>{rich(L.steps[i].h)}</strong> <em>({L.steps[i].g})</em> {L.steps[i].t}</p>
      {i === L.steps.length - 1 && <p className="warn"><strong>{copy.lamps[0].warning.heading}:</strong> {L.warning}</p>}
      {L.extra.map((t, k) => <p key={k}>{t}</p>)}
      <details className="plain"><summary>{X('plainLabel')}</summary><ol>{L.steps.map((s, k) => <li key={k}><strong>{rich(s.h)}</strong> ({s.g}). {s.t}</li>)}</ol><p><strong>{copy.lamps[0].warning.heading}.</strong> {L.warning}</p></details>
    </div>
  );
}
function Bring({ b }) {
  const [i, setI] = useState(0), it = b.items[i];
  return (
    <div className="bring">
      <div className="bring-lamps" role="group" aria-label={b.title}>{b.items.map((x, k) => <button key={k} type="button" className={`btn bring-lamp ${i === k ? 'on' : ''}`} aria-pressed={i === k} aria-label={x.h} onClick={() => setI(k)}>{k + 1}</button>)}</div>
      <p><strong>{it.h}</strong></p>
      <p>{it.proof}</p>
      {it.filledLine && <p>{it.filledLine}</p>}
      <p><strong>{copy.lamps[0].warning.heading}:</strong> {it.warn}</p>
      {it.view && <p><em>{it.view}</em></p>}
      {it.share && <p>{it.share}</p>}
      <Proof lamp={it.lamp} />
      <details className="plain"><summary>{X('plainLabel')}</summary><table><tbody>{b.items.map((x, k) => <tr key={k}><th scope="row">{x.h}</th><td>{x.proof} {x.filledLine} {copy.lamps[0].warning.heading}: {x.warn} {x.view} {x.share}</td></tr>)}</tbody></table></details>
    </div>
  );
}
export default function Baithak() {
  const B = copy.baithak, calm = useStore((s) => s.calm), quality = useStore((s) => s.quality), [pane, setPane] = useState(0), [seen, setSeen] = useState(calm), ref = useRef(null), tabs = useRef([]);
  const { cards } = meetCards();
  useEffect(() => { if (calm) { setSeen(true); return; } const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 }); ref.current && io.observe(ref.current); return () => io.disconnect(); }, [calm]);
  const key = (e, i) => { const n = e.key === 'ArrowRight' ? (i + 1) % 4 : e.key === 'ArrowLeft' ? (i + 3) % 4 : e.key === 'Home' ? 0 : e.key === 'End' ? 3 : -1; if (n >= 0) { e.preventDefault(); setPane(n); tabs.current[n].focus(); } };
  const lean = () => { if (calm) return; engine.set(40, { leanExtra: 9 }); setTimeout(() => engine.set(40, { leanExtra: 0 }), 600); haptic(10); };
  return (
    <section id="baithak" ref={ref} className={`sec ${seen ? 'seen' : ''} q-${quality}`} aria-labelledby="baithak-h" data-pane={pane}>
      <div className="window-scene" aria-hidden="true">
        <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice"><rect width="100" height="70" fill="#0b0806" />
          <g className="farwin">{far.map(([x, y], i) => <rect key={i} x={x} y={y} width="2.2" height="2.8" style={{ transitionDelay: (0.4 + i * 0.22) + 's' }} />)}</g>
          <rect className="frame" x="26" y="6" width="48" height="46" rx="1.5" />
          <g className="panes">{[0, 1, 2, 3].map((i) => <rect key={i} className={pane === i ? 'act' : ''} x={28 + (i % 2) * 23} y={8 + Math.floor(i / 2) * 21.5} width="21" height="19.5" />)}</g>
          <rect x="22" y="52" width="56" height="3.5" className="sill" /></svg>
        <div className="sill-diya" onClick={lean}><Lamp n={0} state="lit"><Flame id={40} pers={0} /></Lamp></div>
      </div>
      <div className="panel">
        <p className="kicker">{B.kicker}</p>
        <h2 id="baithak-h" tabIndex={-1}>{rich(B.heading)}</h2>
        <p>{rich(B.intro)}</p>
        <p className="hint">{rich(B.hint)}</p>
        <div role="tablist" aria-label={B.kicker} className="pane-tabs">
          {B.panes.map((t, i) => <button key={t} ref={(el) => (tabs.current[i] = el)} role="tab" id={`pt-${i}`} aria-selected={pane === i} aria-controls={`pp-${i}`} tabIndex={pane === i ? 0 : -1} className="btn" onClick={() => setPane(i)} onKeyDown={(e) => key(e, i)}>{t}</button>)}
        </div>
        {[0, 1, 2, 3].map((i) => (
          <div key={i} role="tabpanel" id={`pp-${i}`} aria-labelledby={`pt-${i}`} hidden={pane !== i} className="pane-body">
            {i === 0 && <><Card c={cards.who}><div className="chips">{cards.who.chips.map((c) => <button key={c} type="button" className="btn btn-ghost" onClick={() => { setPane({ Builds: 2, Debates: 1, Writes: 1, Studies: 0 }[c]); }}>{c}</button>)}</div><a className="btn" href={copy.site.links.resume} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('driveAria'), { label: cards.who.proof })}>{cards.who.proof}</a></Card><Card c={cards.roots} /></>}
            {i === 1 && <><Card c={cards.debate}>{cards.debate.flip && <DebateFlip d={cards.debate.flip} />}</Card><Card c={cards.essay}><EssayRing e={cards.essay.essay} /><a className="btn" href={copy.site.links.essay} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('driveAria'), { label: cards.essay.essay.link })}>{cards.essay.essay.link}</a></Card></>}
            {i === 2 && <>{cards.research && <Card c={cards.research} />}<article className="meet-card" aria-labelledby="mc-loop"><h3 id="mc-loop">{rich(cards.loop.title)}</h3><Loop L={cards.loop} /></article></>}
            {i === 3 && <article className="meet-card" aria-labelledby="mc-bring"><h3 id="mc-bring">{cards.bring.title}</h3><p className="hook">{rich(cards.bring.hook)}</p><Bring b={cards.bring} /></article>}
          </div>
        ))}
        <p className="pull"><strong>{B.pull}</strong></p>
        <p className="next-hint">{rich(copy.transitions.toTerrace)}</p>
      </div>
    </section>
  );
}
