import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';

// Revealed once all five lamps are lit (the announcement itself is in the live region).
export default function RowBreathes() {
  const lit = useStore((s) => s.litCount === 5);
  const b = copy.rowBreathes;
  return (
    <section id="row-breathes" className="sec" aria-labelledby="row-breathes-h" data-lit={lit ? '1' : '0'}>
      <div className="panel breathes">
        <h2 id="row-breathes-h" tabIndex={-1}>{rich(b.lines[0])}</h2>
        <p>{rich(b.lines[1])}</p>
        <p><em>{rich(b.after)}</em></p>
      </div>
    </section>
  );
}
