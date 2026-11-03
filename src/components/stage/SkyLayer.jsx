import { useEffect, useMemo, useRef } from 'react';
import { mulberry32 } from '../../lib/rand.js';
import { useStore } from '../../lib/useStore.js';
import { on } from '../../lib/events.js';

// Sky: three stacked gradients cross-faded by opacity, stars (one path + 14 twinklers), a hairline moon,
// three drifting wisps, one shooting star the first time lamp three is lit. Code only.
const TINTS = ['#FFF3DC', 'rgba(255,210,122,.6)', '#DCE8FF'];
export default function SkyLayer() {
  const quality = useStore((s) => s.quality);
  const { stars, twinkle } = useMemo(() => {
    const N = { high: 120, mid: 70, low: 40 }[quality];
    const r = mulberry32(2026), S = [], T = [];
    for (let i = 0; i < 120 + 14; i++) {
      const y = Math.pow(r(), 1.5) * 55 * 1.0, x = r() * 100, rad = 0.08 + r() * 0.12, tint = Math.floor(r() * 3);
      if (r() > (1 - y / 70)) { i--; continue; } // thin out toward the horizon
      (i < 14 ? T : S).push({ x, y, rad, tint, dur: 2.5 + r() * 3.5, delay: r() * 5 });
    }
    return { stars: S.slice(0, N), twinkle: T };
  }, [quality]);
  const shoot = useRef(null), played = useRef(false);
  useEffect(() => on('diya:lit', ({ n }) => {
    if (n !== 3 || played.current || document.documentElement.dataset.calm === '1' || !shoot.current) return;
    played.current = true;
    shoot.current.animate([{ opacity: 0, transform: 'translate(0,0) rotate(45deg)' }, { opacity: 1, offset: .15 }, { opacity: 0, transform: 'translate(220px,220px) rotate(45deg)' }], { duration: 800, easing: 'ease-out' });
  }), []);
  const path = (i) => stars.filter((s) => s.tint === i).map((s) => `M${s.x.toFixed(2)} ${s.y.toFixed(2)}m-${s.rad.toFixed(2)} 0a${s.rad.toFixed(2)} ${s.rad.toFixed(2)} 0 1 0 ${(s.rad * 2).toFixed(2)} 0a${s.rad.toFixed(2)} ${s.rad.toFixed(2)} 0 1 0 -${(s.rad * 2).toFixed(2)} 0z`).join('');
  return (
    <div id="sky" aria-hidden="true" data-par="0.05">
      <div className="sky-g sky-night" /><div className="sky-g sky-ember" /><div className="sky-g sky-gold" />
      <svg className="stars" viewBox="0 0 100 60" preserveAspectRatio="xMidYMin slice">
        {TINTS.map((t, i) => <path key={i} d={path(i)} fill={t} />)}
        {twinkle.map((s, i) => <circle key={i} className="tw" cx={s.x} cy={s.y} r={s.rad * 0.9} fill={TINTS[s.tint]} style={{ animationDuration: s.dur + 's', animationDelay: s.delay + 's' }} />)}
      </svg>
      <svg className="moon" viewBox="-60 -60 120 120" width="120" height="120" style={{ overflow: 'visible' }}>
        <defs>
          <radialGradient id="halo"><stop offset="0" stopColor="#FFF3DC" stopOpacity=".07" /><stop offset="1" stopColor="#FFF3DC" stopOpacity="0" /></radialGradient>
          <mask id="crescent"><rect x="-60" y="-60" width="120" height="120" fill="#fff" /><circle cx="17" cy="-2" r="19" fill="#000" /></mask>
        </defs>
        <circle r="90" fill="url(#halo)" /><circle r="20" fill="#FFF3DC" opacity=".9" mask="url(#crescent)" />
      </svg>
      {[0, 1, 2].map((i) => <div key={i} className={`cloud cloud-${i}`}><i /><i className="rim" /></div>)}
      <div ref={shoot} className="shooting" style={{ opacity: 0 }} />
    </div>
  );
}
