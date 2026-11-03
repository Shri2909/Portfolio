import { useEffect, useState } from 'react';
import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';

// Act 1. The headline arrives in three beats (324 tests passed. / Then an audit found 19 problems. / Ship karte?), then the two lines.
// Any tap completes it at once; reduced motion and Calm show it all at once. All text is in the page from the start (opacity only).
export default function Night({ children, banner }) {
  const o = copy.opening, calm = useStore((s) => s.calm);
  const [beat, setBeat] = useState(calm ? 4 : 0);
  useEffect(() => {
    if (calm) { setBeat(4); return; }
    const ts = [400, 1400, 2400, 3200].map((ms, i) => setTimeout(() => setBeat((b) => Math.max(b, i + 1)), ms));
    const done = () => setBeat(4); window.addEventListener('pointerdown', done, { once: true }); window.addEventListener('keydown', done, { once: true });
    return () => { ts.forEach(clearTimeout); window.removeEventListener('pointerdown', done); window.removeEventListener('keydown', done); };
  }, [calm]);
  return (
    <section id="night" className="sec" aria-labelledby="night-h" data-beat={beat}>
      <div className="night-copy">
        {banner}
        <p className="kicker">{o.label}</p>
        <h1 id="night-h" tabIndex={-1}><span className="b b1">{o.headlineA}</span> <span className="b b2">{o.headlineB}</span></h1>
        <p className="ask b b3"><strong>{rich(o.ask)}</strong></p>
        <div className="b b4">{o.lines.map((l, i) => <p key={i} className="lines">{rich(l)}</p>)}</div>
      </div>
      <p className="sr-only">{o.altText}</p>
      {children}
      <p className="sixty-link"><a href="#sixty" data-sixty>{rich(o.quick)}</a></p>
    </section>
  );
}
