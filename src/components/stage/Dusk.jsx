import { useEffect, useRef } from 'react';
import { on } from '../../lib/events.js';
import { getState } from '../../lib/store.js';

// Dusk-gold moments (P2.5): one ring of warm light from lamp 5, then one flock of birds, once, never replayed.
// Mid quality: no ring, no birds. Calm: nothing (the state itself is applied by tone). Particle fireworks are Pack 5.
export default function Dusk() {
  const ring = useRef(null), birds = useRef(null), last = useRef(null), played = useRef(false);
  useEffect(() => {
    const a = on('diya:lit', ({ n, x, y }) => { if (n === 5) last.current = { x, y }; });
    const b = on('diya:allLit', () => {
      const s = getState();
      if (played.current || s.calm || s.quality !== 'high') return;
      played.current = true;
      const p = last.current || { x: innerWidth * 0.8, y: innerHeight * 0.75 };
      const r = ring.current;
      if (r) { r.style.left = p.x + 'px'; r.style.top = p.y + 'px'; r.animate([{ transform: 'translate(-50%,-50%) scale(0)', opacity: 0.35 }, { transform: 'translate(-50%,-50%) scale(3.2)', opacity: 0 }], { duration: 1600, easing: 'ease-out' }); }
      setTimeout(() => {
        const g = birds.current;
        if (!g || getState().calm) return;
        g.style.display = 'block';
        g.animate([{ transform: 'translateX(-20vw)' }, { transform: 'translateX(120vw)' }], { duration: 7000, easing: 'linear' }).onfinish = () => { g.style.display = 'none'; };
      }, 2000);
    });
    return () => { a(); b(); };
  }, []);
  const flock = Array.from({ length: 9 }, (_, i) => ({ x: i * 34 + (i % 3) * 12, y: (i * 37) % 52 + 14, d: (i % 4) * 0.12 }));
  return (
    <div className="dusk deco" aria-hidden="true">
      <div ref={ring} className="dusk-ring" />
      <svg ref={birds} className="birds" viewBox="0 0 340 90" style={{ display: 'none' }}>
        {flock.map((b, i) => <path key={i} className="bird" style={{ animationDelay: b.d + 's' }} d={`M${b.x} ${b.y}q6-7 12 0q6-7 12 0`} />)}
      </svg>
    </div>
  );
}
