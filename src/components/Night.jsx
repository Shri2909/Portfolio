import copy from '../lib/copy.js';
import { rich, R } from '../lib/rich.jsx';

// Opening. Pack 3 adds the lamp row, Pack 6 the shared-link banner.
export default function Night({ children, banner }) {
  const o = copy.opening;
  return (
    <section id="night" className="sec" aria-labelledby="night-h">
      <div className="night-copy">
        {banner}
        <p className="kicker">{o.label}</p>
        <h1 id="night-h" tabIndex={-1}>{o.headline}</h1>
        <p className="ask"><strong>{rich(o.ask)}</strong></p>
        {o.lines.map((l, i) => <p key={i} className="lines">{rich(l)}</p>)}
      </div>
      <p className="sr-only">{o.altText}</p>
      {children}
      <p className="sixty-link">{rich(o.sixtyPrompt)} <a href="#sixty" data-sixty>{o.sixtyCta}</a></p>
    </section>
  );
}
