import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';

// #lamps: the story list. Pack 3 and 4 add the lamp stage and the lamp cards.
export default function Lamps({ children }) {
  return (
    <section id="lamps" className="sec" aria-label={copy.ui.nav[0].label}>
      <div className="panel">
        {copy.opening.below.map((b, i) => <p key={i}>{rich(b)}</p>)}
      </div>
      {children}
    </section>
  );
}
