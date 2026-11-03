import { useEffect, useRef, useState } from 'react';
import copy from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { personParas } from '../lib/personText.js';
import { useStore } from '../lib/useStore.js';
import { engine } from '../lib/flame.js';
import { haptic } from '../lib/haptic.js';
import Lamp from './Lamp.jsx';
import Flame from './Flame.jsx';

// The person behind the file, in window light. A quiet scene with no people: a dark wall, a window with four warm panes,
// a sill, one small diya, and a few far-away lit windows. The first sentence is gated by flags.ledgerGate_personFirstSentence.
export default function Person() {
  const P = copy.person, calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const ref = useRef(null), [seen, setSeen] = useState(calm);
  useEffect(() => {
    if (calm) { setSeen(true); return; }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect(); } }, { threshold: 0.3 });
    ref.current && io.observe(ref.current); return () => io.disconnect();
  }, [calm]);
  if (!P.enabled) return null;
  const [p1, p2] = personParas();
  const lean = () => { if (calm) return; engine.set(40, { leanExtra: 9 }); setTimeout(() => engine.set(40, { leanExtra: 0 }), 600); haptic(10); };
  const far = [[18, 14], [34, 38], [52, 12], [70, 30], [84, 16], [26, 56], [62, 52]];
  return (
    <section id="person" className={`sec ${seen ? 'seen' : ''} q-${quality}`} aria-labelledby="person-h" ref={ref}>
      <div className="window-scene" aria-hidden="true">
        <svg viewBox="0 0 100 70" preserveAspectRatio="xMidYMid slice">
          <rect width="100" height="70" fill="#0b0806" />
          <g className="farwin">{far.map(([x, y], i) => <rect key={i} x={x} y={y} width="2.2" height="2.8" style={{ transitionDelay: (0.4 + i * 0.22) + 's' }} />)}</g>
          <rect className="frame" x="26" y="6" width="48" height="46" rx="1.5" />
          <g className="panes">{[0, 1, 2, 3].map((i) => <rect key={i} x={28 + (i % 2) * 23} y={8 + Math.floor(i / 2) * 21.500} width="21" height="19.500" />)}</g>
          <rect x="22" y="52" width="56" height="3.500" className="sill" />
        </svg>
        <div className="sill-diya" onClick={lean}><Lamp n={0} state="lit"><Flame id={40} pers={0} /></Lamp></div>
      </div>
      <div className="panel person-panel">
        <p className="kicker">{P.kicker}</p>
        <h2 id="person-h" tabIndex={-1}>{rich(P.heading)}</h2>
        <p className="pp" style={{ '--d': 1 }}>{p1}</p>
        <p className="pp" style={{ '--d': 2 }}>{p2}</p>
        <p className="pp pull" style={{ '--d': 3 }}><strong><span>{P.pull}</span></strong></p>
      </div>
    </section>
  );
}
