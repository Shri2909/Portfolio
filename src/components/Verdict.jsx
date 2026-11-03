import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';

// Seedhi baat: a signed note on warm paper under the lit row. The third paragraph is the signature line, set large.
export default function Verdict() {
  const V = copy.verdict, calm = useStore((s) => s.calm), ref = useRef(null), [seen, setSeen] = useState(calm);
  useEffect(() => {
    if (calm) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.4 });
    ref.current && io.observe(ref.current); return () => io.disconnect();
  }, [calm]);
  return (
    <section id="verdict" className={`sec ${seen ? 'seen' : ''}`} aria-labelledby="verdict-h" ref={ref}>
      <div className="note-paper">
        <i className="tape l" aria-hidden="true" /><i className="tape r" aria-hidden="true" /><i className="crease" aria-hidden="true" />
        <p className="kicker">{V.kicker}</p>
        <h2 id="verdict-h" tabIndex={-1}>{rich(V.heading)}</h2>
        {V.paras.map((p, i) => <p key={i}>{rich(p)}</p>)}
        <p className="signature"><span>{V.pull}</span>
          <svg viewBox="0 0 300 12" preserveAspectRatio="none" aria-hidden="true"><path pathLength="1" d="M2 7C60 2 120 11 180 5S270 8 298 4" /></svg>
        </p>
        <p className="signed" aria-label={V.signed}><span>{V.signed}</span></p>
        <p className="afterword"><button className="btn btn-ghost" data-evidence="c6">{rich(V.rolesLink)}</button></p>
      </div>
      <p className="verdict-btns">
        <a className="btn" href={copy.site.links.resume} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('driveAria'), { label: V.resume.label })}>{V.resume.label}</a>
        <button className="btn" data-evidence="">{V.evidenceLabel}</button>
      </p>
    </section>
  );
}
