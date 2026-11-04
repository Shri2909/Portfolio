import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { useStore } from '../lib/useStore.js';
import { on } from '../lib/events.js';
import { engine } from '../lib/flame.js';
import Lamp from './Lamp.jsx';
import Flame from './Flame.jsx';

// A quiet writing desk at night: one pool of warm lamplight, a lit desk lamp, a shelf with the five lamps from the page
// and a sixth dark one for the visitor (id visitor-lamp; not the proposed lamp), a pen and a cup of chai. Nothing else.
export default function DeskScene() {
  const lamps = useStore((s) => s.lamps), vl = useStore((s) => s.visitorLit), calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const [half, setHalf] = useState(false);
  useEffect(() => {
    const a = on('wish:empty', () => { engine.set(20, { scale: 0.55 }); setTimeout(() => engine.set(20, { scale: 1 }), 400); });
    const b = on('wish:chunk', () => { engine.set(20, { glowBoost: 1.5 }); setTimeout(() => engine.set(20, { glowBoost: 1 }), 1200); });
    const c = on('wish:half', () => setHalf(true));
    return () => { a(); b(); c(); };
  }, []);
  return (
    <div className="desk" aria-hidden="false">
      <i className="pool" aria-hidden="true" />
      <div className="desk-lamp" id="desk-lamp" aria-hidden="true"><Lamp n={0} state="lit"><Flame id={20} pers={0} /></Lamp></div>
      <ol className="shelf" aria-hidden="true">
        {[1, 2, 3].map((n) => <li key={n}><Lamp n={n} state={lamps[n]}>{lamps[n] === 'lit' && <Flame id={20 + n} pers={n} />}</Lamp></li>)}
        <li id="visitor-lamp" role="img" aria-label={X('visitorLampAria')} style={{ outline: 'none' }}>
          <Lamp n={0} state={vl ? 'lit' : 'unlit'}>{(vl || half) && <Flame id={30} pers={1} scale={vl ? 1 : 0.6} />}</Lamp>
        </li>
      </ol>
      <svg className="props" viewBox="0 0 120 70" aria-hidden="true">
        <path d="M6 62L70 54" stroke="#cdb894" strokeWidth="3" strokeLinecap="round" /><path d="M6 62l-3 2" stroke="#16110C" strokeWidth="3" strokeLinecap="round" />
        <g transform="translate(88 30)"><path d="M0 0h22l-3 24h-16z" fill="#9aa1a8" /><ellipse cx="11" cy="0" rx="11" ry="3" fill="#cfd5da" /><path d="M22 6q8 2 0 12" fill="none" stroke="#9aa1a8" strokeWidth="2" /></g>
        {quality !== 'low' && !calm && [0, 1, 2].map((i) => <path key={i} className="steam" style={{ animationDelay: i * 0.9 + 's' }} d={`M${92 + i * 6} 28q-4-6 0-12t0-12`} />)}
      </svg>
      {quality === 'high' && !calm && <svg className="moth" viewBox="0 0 14 14" aria-hidden="true"><path d="M7 7C3 2 0 5 2 8c2 2 4 0 5-1c1 1 3 3 5 1c2-3-1-6-5-1z" fill="#cbbba0" /></svg>}
    </div>
  );
}
