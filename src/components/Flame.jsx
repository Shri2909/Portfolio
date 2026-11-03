import { useEffect, useRef } from 'react';
import { engine, PERSONALITY } from '../lib/flame.js';

// Three stacked teardrops (flame-b, flame-a, flame-core), a soft blue base, and a glow (radial gradient, not a blur).
// Positioned by its parent at the wick tip. `id` picks the personality (0 = home flame, 1..5 lamps, 6 = the honest lamp).
const D0 = (w, h) => `M0 0C${-w} ${-h * 0.18} ${-w * 0.95} ${-h * 0.62} 0 ${-h}C${w * 0.95} ${-h * 0.62} ${w} ${-h * 0.18} 0 0Z`;
export default function Flame({ id, scale = 1, pers, className = '' }) {
  const el = useRef(null), glow = useRef(null), outer = useRef(null), mid = useRef(null), core = useRef(null);
  useEffect(() => engine.register(id, { ...(pers ? { p: PERSONALITY[pers] } : {}), el: el.current, glow: glow.current, outer: outer.current, mid: mid.current, core: core.current, scale }), [id]);
  useEffect(() => engine.set(id, { scale }), [id, scale]);
  return (
    <>
      <i ref={glow} className={`flame-glow ${className}`} aria-hidden="true" />
      <svg ref={el} className={`flame ${className}`} viewBox="-20 -80 40 84" aria-hidden="true" data-fid={id} style={{ '--sc': scale }}>
        <path ref={outer} className="f-b" d={D0(11, 72)} />
        <path ref={mid} className="f-a" d={D0(7.7, 52)} />
        <path ref={core} className="f-c" d={D0(4.2, 27)} />
        <ellipse className="f-base" cx="0" cy="-1" rx="4.500" ry="2.200" />
      </svg>
    </>
  );
}
