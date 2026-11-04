import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
// "Three Lamps. One Pattern.": the transition after all three lamps, before the growth question.
export default function Pattern() {
  const T = copy.transition;
  if (!T) return null;
  return (
    <section id="pattern" className="sec pattern" aria-labelledby="pattern-h">
      <div className="panel">
        <h2 id="pattern-h" tabIndex={-1}>{T.heading}</h2>
        {T.body.map((t, i) => { const em = /^\*(?!\*)(.+)\*$/.exec(t); return <p key={i} className={/^\*\*.+\*\*$/.test(t) ? 'pull' : undefined}>{em ? <em>{rich(em[1])}</em> : rich(t)}</p>; })}
      </div>
    </section>
  );
}
