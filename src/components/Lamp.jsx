import { useEffect, useRef } from 'react';
import { mulberry32 } from '../lib/rand.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import Flame from './Flame.jsx';

// Hand-thrown clay diya, inline SVG, seen from slightly above and the side. All lips point right.
// Each lamp has its own fixed seed, so the five are not clones and look identical on every visit.
const VARS = {
  1: { rw: 62, bd: 30, ll: 14, kink: 5, tilt: -2, seed: 11, light: true },
  2: { rw: 56, bd: 38, ll: 22, kink: 8, tilt: 1.5, seed: 22 },
  3: { rw: 70, bd: 22, ll: 12, kink: 0, tilt: 0, seed: 33, dent: true },
  4: { rw: 52, bd: 34, ll: 16, kink: 6, tilt: -1, seed: 44, curl: true },
  5: { rw: 76, bd: 28, ll: 14, kink: -6, tilt: 2, seed: 55, fleck: true },
  6: { rw: 76, bd: 28, ll: 14, kink: -6, tilt: 2, seed: 55 },
  0: { rw: 66, bd: 32, ll: 16, kink: 4, tilt: -1, seed: 7 },
};
export function shape(n) {
  const v = VARS[n], r = mulberry32(v.seed), j = () => (r() - 0.5) * 2;
  const rw = v.rw + j(), bd = v.bd + j(), ll = v.ll + j(), cx = 50, y0 = 42, xl = cx - rw / 2, xr = cx + rw / 2, bottom = y0 + bd, k = v.kink;
  const tipX = xr + ll, tipY = y0 - 5 - k;
  const body = `M${xl} ${y0}C${xl} ${y0 + bd * 0.85} ${cx - rw * 0.22} ${bottom} ${cx} ${bottom}C${cx + rw * 0.22} ${bottom} ${xr} ${y0 + bd * 0.85} ${xr} ${y0}Q${xr + ll * 0.5} ${y0 - 4 - k * 0.3} ${tipX} ${tipY}Q${tipX + 4} ${y0 - 2 - k * 0.4} ${tipX - 3} ${y0 + 5}Q${xr + ll * 0.3} ${y0 + 9} ${xr - 4} ${y0 + 10}Z`;
  const wickBase = [tipX - 1, tipY + 1], wickTip = [tipX + 4, tipY - 11];
  return { v, rw, bd, ll, cx, y0, xl, xr, bottom, tipX, tipY, body, wickBase, wickTip };
}
export default function Lamp({ n, state = 'unlit', fill6 = 0, children }) {
  const S = shape(n), { v } = S;
  const tip = useRef(null);
  useEffect(() => lampRegistry.set(n, () => { const r = tip.current && tip.current.getBoundingClientRect(); return r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : null; }), [n]);
  const lit = state === 'lit', dashed = n === 6;
  const pct = (x, y) => ({ '--wx': (x / 120 * 100) + '%', '--wy': (y / 90 * 100) + '%' });
  return (
    <div className={`lamp l${n} ${lit ? 'is-lit' : ''} ${state === 'lighting' ? 'is-lighting' : ''}`} style={pct(S.wickTip[0], S.wickTip[1])}>
      <svg viewBox="0 0 120 90" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id={`clay${n}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" className="clay-hi-stop" /><stop offset=".45" className="clay-mid-stop" /><stop offset="1" className="clay-dark-stop" /></linearGradient>
          <clipPath id={`bowl${n}`}><path d={S.body} /></clipPath>
        </defs>
        <g transform={`rotate(${v.tilt} 50 60)`}>
          {dashed ? (
            <>
              <path d={S.body} className="l6-fill" clipPath={`url(#bowl${n})`} style={{ opacity: fill6 }} />
              <path d={S.body} className="l6-line" />
              <ellipse cx={S.cx} cy={S.y0} rx={S.rw / 2} ry="7" className="l6-line" />
            </>
          ) : (
            <>
              <path d={S.body} fill={`url(#clay${n})`} />
              <ellipse cx={S.cx} cy={S.y0} rx={S.rw / 2} ry="7.500" className="clay-rim" />
              <ellipse cx={S.cx} cy={S.y0 + 0.8} rx={S.rw / 2 - 5} ry="4.600" className="oil" />
              <path d={`M${S.cx - S.rw / 4} ${S.y0 + 1}q${S.rw / 5} -3 ${S.rw / 2.600} 0`} className="sheen" />
              {v.dent && <ellipse cx={S.xl + 4} cy={S.y0 + 1} rx="3.200" ry="2" className="dent" />}
              {v.fleck && <ellipse cx={S.cx + 10} cy={S.y0 + 18} rx="2" ry="1.200" className="fleck" />}
              {v.curl && <path d={`M${S.tipX - 3} ${S.tipY}q4 -4 7 -1`} className="curl" />}
              <ellipse className="soot" cx={S.tipX - 7} cy={S.tipY + 2} rx="5" ry="2" />
              <path d={`M${S.wickBase[0]} ${S.wickBase[1]}q1 -6 ${S.wickTip[0] - S.wickBase[0] - 1} ${S.wickTip[1] - S.wickBase[1] + 2}`} className="wick" />
              <circle className="wick-char" cx={S.wickTip[0]} cy={S.wickTip[1]} r="2" />
            </>
          )}
          <circle ref={tip} cx={S.wickTip[0]} cy={S.wickTip[1]} r="0.5" fill="none" />
        </g>
      </svg>
      {children}
    </div>
  );
}
export { Flame };
