import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { openLampCard } from '../lib/nav.js';

// #lamps: the story list. Each lit lamp has a "Kissa kholiye" button that opens its card. Unlit lamps offer none.
export default function Lamps({ children }) {
  const lamps = useStore((s) => s.lamps);
  return (
    <section id="lamps" className="sec" aria-label={copy.ui.nav[0].label}>
      <div className="panel">
        {copy.opening.below.map((b, i) => <p key={i}>{rich(b)}</p>)}
        <ul className="story-list">
          {copy.lamps.map((l) => lamps[l.n] === 'lit' && (
            <li key={l.n}>
              <p className="kicker">{l.kicker}</p>
              <p className="story-title">{rich(l.title)}</p>
              <button className="btn" aria-label={`${X('lampCardAria').replace('{n}', l.n)}: ${copy.ui.extra.projectNames[l.n - 1]}`} onClick={() => openLampCard(l.n, 'list')}>{rich(copy.ui.lampOpen)}</button>
            </li>
          ))}
        </ul>
      </div>
      {children}
    </section>
  );
}
