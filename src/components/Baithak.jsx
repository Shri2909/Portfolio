import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';

// Act 2: the sitting room. (The four-pane window and the Meet Shriniwas cards are built in phase 4.)
export default function Baithak() {
  const B = copy.baithak;
  return (
    <section id="baithak" className="sec" aria-labelledby="baithak-h">
      <div className="panel">
        <p className="kicker">{B.kicker}</p>
        <h2 id="baithak-h" tabIndex={-1}>{rich(B.heading)}</h2>
        <p>{rich(B.intro)}</p>
        <p><strong>{B.pull}</strong></p>
        <p className="next-hint">{rich(copy.transitions.toTerrace)}</p>
      </div>
    </section>
  );
}
