import { useEffect, useMemo, useRef, useState } from 'react';
import { mulberry32 } from '../../lib/rand.js';
import { useStore } from '../../lib/useStore.js';
import { on } from '../../lib/events.js';
import { getState } from '../../lib/store.js';
import { announce } from '../../lib/announce.js';
import copy, { X } from '../../lib/copy.js';
import { tpl } from '../../lib/tpl.js';
import { useWindowSize } from '../../lib/useWindowSize.js';

const rad = (d) => (d * Math.PI) / 180;
const pt = (r, a) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];
const f = (n) => +n.toFixed(2);
const circle = (r) => `M${r},0A${r},${r} 0 1 1 ${-r},0A${r},${r} 0 1 1 ${r},0`;
const dot = (x, y) => `M${f(x)},${f(y)}h.001`;
const PETAL = 'M0,-22 C14,-36 14,-60 0,-72 C-14,-60 -14,-36 0,-22 Z';

// Rangoli layers L1..L5. Each path has pathLength 1 so one dashoffset draws it.
function layers() {
  const L = [[], [], [], [], []];
  L[0].push({ d: dot(0, 0), w: 10 }, { d: circle(20) });
  for (let i = 0; i < 8; i++) { const [x, y] = pt(34, i * 45); L[0].push({ d: dot(x, y), w: 4.4 }); }
  for (let i = 0; i < 8; i++) L[1].push({ d: PETAL, t: `rotate(${i * 45})`, fill: 'petal' }, { d: PETAL, t: `rotate(${22.5 + i * 45}) scale(.72)`, fill: 'small' });
  for (let i = 0; i < 16; i++) { const a = i * 22.5, [x1, y1] = pt(80, a), [x2, y2] = pt(80, a + 22.5); L[2].push({ d: `M${f(x1)},${f(y1)}A16 16 0 0 1 ${f(x2)},${f(y2)}`, fill: 'scallop' }); }
  L[3].push({ d: 'M-70,-70H70V70H-70Z', fill: 'star' }, { d: 'M-70,-70H70V70H-70Z', t: 'rotate(45)', fill: 'star' }, { d: circle(106) });
  const arc = (r) => { const [x1, y1] = pt(r, 60), [x2, y2] = pt(r, 30); return `M${f(x1)},${f(y1)}A${r} ${r} 0 1 1 ${f(x2)},${f(y2)}`; };
  L[4].push({ d: arc(126) }, { d: arc(132) });
  for (let i = 0; i < 24; i++) { const a = i * 15; if (a >= 30 && a <= 60) continue; L[4].push({ d: 'M0,-3L2,0L0,3L-2,0Z', t: `rotate(${a}) translate(0,-129)` }); }
  return L;
}
const LAYERS = layers();

function Rangoli() {
  const calm = useStore((s) => s.calm);
  const refs = useRef([]);
  useEffect(() => {
    const set = (i, p, anim) => { const g = refs.current[i]; if (!g) return; g.style.transition = anim ? 'none' : ''; g.style.setProperty('--p', String(p)); };
    getState().litCount && [1, 2, 3, 4, 5].forEach((n) => getState().lamps[n] === 'lit' && set(n - 1, 1, true));
    const a = on('diya:lighting', ({ n, progress }) => { if (n <= 5) set(n - 1, progress, true); });
    const b = on('diya:lit', ({ n }) => { const g = refs.current[n - 1]; if (g) { g.style.transition = ''; g.style.setProperty('--p', '1'); } });
    return () => { a(); b(); };
  }, []);
  const [gx, gy] = pt(129, 45);
  return (
    <svg className="rangoli deco" viewBox="-150 -150 300 300" preserveAspectRatio="none" aria-hidden="true" data-calm-final={calm ? '1' : '0'}>
      {LAYERS.map((layer, i) => (
        <g key={i} ref={(el) => (refs.current[i] = el)} className="rl" style={{ '--p': 0 }}>
          {layer.map((s, j) => <g key={j} transform={s.t}><path className="glow" pathLength="1" d={s.d} style={s.w ? { strokeWidth: s.w + 4 } : undefined} /><path className={`ln ${s.fill ? 'fill-' + s.fill : ''}`} pathLength="1" d={s.d} style={s.w ? { strokeWidth: s.w } : undefined} /></g>)}
        </g>
      ))}
      <path className="dotted-arc" d={`M${f(pt(129, 32)[0])},${f(pt(129, 32)[1])}A129 129 0 0 1 ${f(pt(129, 58)[0])},${f(pt(129, 58)[1])}`} />
    </svg>
  );
}

function Toran({ w }) {
  const n = w < 400 || window.innerHeight < 680 ? 7 : 11;
  const r = useMemo(() => mulberry32(11), []);
  const strands = [];
  const sag = 18, W = w;
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n, x = t * W, y = 6 + 4 * sag * t * (1 - t), len = i % 2 ? 58 : 38;
    strands.push({ x, y, len, dur: 5 + (i % 3), delay: -(i * 0.7), gust: i * 0.18 });
  }
  const d = `M0 6Q${W / 2} ${6 + 2 * sag} ${W} 6`;
  return (
    <svg className="toran deco" width={W} height="90" viewBox={`0 0 ${W} 90`} aria-hidden="true">
      <path d={d} fill="none" stroke="#CDB894" strokeWidth="2" />
      {strands.map((s, i) => (
        <g key={i} className="gust" style={{ transformOrigin: `${s.x}px ${s.y}px`, animationDelay: s.gust + 's' }}>
          <g className="strand" style={{ transformOrigin: `${s.x}px ${s.y}px`, animationDuration: s.dur + 's', animationDelay: s.delay + 's' }}>
            <path d={`M${s.x} ${s.y}v${s.len}`} stroke="#CDB894" strokeWidth="1" />
            {[0.2, 0.5, 0.8].map((q, j) => <g key={j}><circle cx={s.x} cy={s.y + s.len * q} r="7" fill={j % 2 ? '#FFB347' : '#F5A623'} /><circle cx={s.x} cy={s.y + s.len * q} r="3" fill="#E8890C" /></g>)}
            <path d={`M${s.x} ${s.y + s.len}q-7 8 0 16q7-8 0-16z`} fill="#2F6B4F" />
          </g>
        </g>
      ))}
      <rect className="toran-warm" x="0" y="0" width={W} height="90" fill="#F5A623" />
    </svg>
  );
}

const MODES = ['steady', 'chase', 'twinkle', 'fade'];
const BULB = ['#FFD27A', '#FFB347', '#F5A623', '#FFF3DC', '#9FD3B0'];
function StringLights({ w, mode }) {
  const quality = useStore((s) => s.quality);
  const n = { high: 14, mid: 12, low: 8 }[quality], sag = 22;
  const bulbs = Array.from({ length: n }, (_, i) => { const t = (i + 0.5) / n; return { x: t * w, y: 8 + 4 * sag * t * (1 - t), c: BULB[i % 5], i }; });
  return (
    <svg className={`lights deco mode-${mode} q-${quality}`} width={w} height="48" viewBox={`0 0 ${w} 48`} aria-hidden="true">
      <path d={`M0 8Q${w / 2} ${8 + 2 * sag} ${w} 8`} fill="none" stroke="#2b2118" strokeWidth="1.5" />
      {bulbs.map((b) => <g key={b.i}><circle className="bglow" cx={b.x} cy={b.y + 6} r="9" fill={b.c} /><circle className="bulb" cx={b.x} cy={b.y + 5} r="3.500" fill={b.c} style={{ animationDelay: (mode === 'chase' ? (b.i % 3) * 0.4 : (b.i * 0.37) % 3) + 's' }} /></g>)}
    </svg>
  );
}

const star = (R, r, n = 16) => Array.from({ length: n * 2 }, (_, i) => { const a = (i * Math.PI) / n - Math.PI / 2, q = i % 2 ? r : R; return [Math.cos(a) * q, Math.sin(a) * q]; });
const STAR = star(24, 11);
function Lantern({ size, color, len, lit, left, hide, idx }) {
  const el = useRef(null);
  const tap = () => { if (getState().calm || !el.current) return; el.current.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(14deg)' }, { transform: 'rotate(-9deg)' }, { transform: 'rotate(5deg)' }, { transform: 'rotate(-2deg)' }, { transform: 'rotate(0)' }], { duration: 1900, easing: 'ease-out' }); };
  return (
    <div className={`lantern deco stage-hit ${lit ? 'lit' : ''} ${hide || ''}`} style={{ left: left + '%', '--dur': 4 + idx + 's' }} onClick={tap} aria-hidden="true">
      <div ref={el} className="pend">
        <svg width={size} height={len + size + 14} viewBox={`${-size / 2} 0 ${size} ${len + size + 14}`}>
          <path d={`M0 0V${len}`} stroke="#CDB894" strokeWidth="1.500" />
          <g transform={`translate(0 ${len + size / 2})`}>
            <circle className="lglow" r={size * 0.9} fill="url(#lgl)" />
            <g transform={`scale(${size / 48})`}>
              {STAR.map((p, i) => i % 2 === 0 && <path key={i} d={`M0 0L${f(p[0])} ${f(p[1])}L${f(STAR[(i + 1) % 32][0])} ${f(STAR[(i + 1) % 32][1])}Z`} fill={color} opacity={(i / 2) % 2 ? 0.95 : 0.7} />)}
              <circle r="9" fill="url(#lcore)" />
            </g>
            {[-6, 0, 6].map((x) => <path key={x} d={`M${x} ${size / 2 - 2}v14`} stroke="#F5A623" strokeWidth="1.200" />)}
          </g>
        </svg>
      </div>
    </div>
  );
}
function Cat({ lamp3 }) {
  const tail = useRef(null);
  const flick = () => { if (getState().calm || !tail.current) return; tail.current.animate([{ transform: 'rotate(0)' }, { transform: 'rotate(-26deg)' }, { transform: 'rotate(8deg)' }, { transform: 'rotate(0)' }], { duration: 700 }); };
  useEffect(() => { const t = setInterval(flick, 9000); return () => clearInterval(t); }, []);
  return (
    <svg className="cat deco stage-hit" viewBox="0 0 48 52" width="40" height="44" onClick={flick} aria-hidden="true">
      <path d="M10 50C4 40 6 28 14 24c-2-4-2-9 0-13l5 5h8l5-5c2 4 2 9 0 13 8 4 10 16 4 26z" fill="#050403" />
      <g ref={tail} style={{ transformOrigin: '36px 46px' }}><path d="M36 48c10 0 12-12 6-18" fill="none" stroke="#050403" strokeWidth="4" strokeLinecap="round" /></g>
      {lamp3 && <><circle cx="19" cy="21" r="1.600" fill="#FFD27A" /><circle cx="28" cy="21" r="1.600" fill="#FFD27A" /></>}
    </svg>
  );
}

export default function Terrace() {
  const { w } = useWindowSize();
  const lit = useStore((s) => s.litCount), tone = useStore((s) => s.tone);
  const [mode, setMode] = useState(0);
  const cycle = () => { const m = (mode + 1) % 4; setMode(m); announce(tpl(X('stringMode'), { mode: copy.ui.extra.stringModes[m] })); };
  const lampX = [0.1, 0.3, 0.5, 0.7, 0.9];
  return (
    <>
      <div id="terrace" aria-hidden="true">
        <svg width="0" height="0" style={{ position: 'absolute' }}><defs>
          <radialGradient id="lgl"><stop offset="0" stopColor="#FFD27A" stopOpacity=".55" /><stop offset="1" stopColor="#FFB347" stopOpacity="0" /></radialGradient>
          <radialGradient id="lcore"><stop offset="0" stopColor="#FFD27A" /><stop offset="1" stopColor="#FF7A1A" /></radialGradient>
        </defs></svg>
        <div className="toran-wrap"><Toran w={w} /></div>
        <div className="lights-wrap"><StringLights w={w} mode={MODES[mode]} /></div>
        <Lantern idx={0} size={48} color="#FFD9A0" len={28} left={14} lit={lit >= 2 || tone >= 5} />
        <Lantern idx={1} size={36} color="#C2410C" len={20} left={86} lit={lit >= 3 || tone >= 5} />
        <Lantern idx={2} size={30} color="#2F6B4F" len={36} left={70} lit={lit >= 4 || tone >= 5} hide="lantern-3" />
        <div className="floor" />
        <div className="parapet"><i className="cap" style={{ left: '8%' }} /><i className="cap" style={{ left: '48%' }} /><i className="cap" style={{ left: '88%' }} /></div>
        <div className="cat-wrap"><Cat lamp3={lit >= 3} /></div>
        <div className="rangoli-wrap"><Rangoli /></div>
        <div className="pools">{lampX.map((x, i) => <i key={i} className={i < lit ? 'on' : ''} style={{ left: x * 100 + '%' }} />)}</div>
        <svg className="inkline" viewBox="0 0 100 2" preserveAspectRatio="none"><path pathLength="1" d="M10 1H90" style={{ strokeDashoffset: 1 - Math.max(0, lit - 1) / 4 }} /></svg>
      </div>
      <button className="lights-ctl" onClick={cycle} aria-label={X('stringAria')} aria-describedby="lights-mode"><i /></button>
      <span id="lights-mode" className="sr-only">{copy.ui.extra.stringModes[mode]}</span>
    </>
  );
}
