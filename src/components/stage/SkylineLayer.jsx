import { useEffect, useMemo, useRef } from 'react';
import { mulberry32, shuffle } from '../../lib/rand.js';
import { useStore } from '../../lib/useStore.js';

// Indian apartment-block skyline in three SVG layers. 64 windows (+1 for the visitor), each a home.
// Lit count by tone (LIT below); three lamps step the tone 0, 2, 4, 5, then the visitor's lamp is 6. The first 14 are fixed ("already home").
const W = 1200, H = 500, LIT = [14, 20, 28, 36, 44, 56, 64];
const LAMP_X = [250, 600, 950]; // viewBox x of the lamp row (approximate), used only to order windows

function layer(r, name, nBlocks, hMin, hMax, nWin, ww, wh) {
  const bw = (W + 20) / nBlocks, blocks = [];
  for (let i = 0; i < nBlocks; i++) blocks.push({ x: i * bw - 10 + r() * 6, w: bw * 0.93, h: hMin + r() * (hMax - hMin) });
  const cand = [];
  blocks.forEach((b, bi) => {
    const sx = ww * 2.3, sy = wh * 2.2, cols = Math.max(1, Math.floor((b.w - 10) / sx)), rows = Math.max(1, Math.floor((b.h - 16) / sy));
    for (let c = 0; c < cols; c++) for (let rr = 0; rr < rows; rr++) cand.push({ x: b.x + 6 + c * sx, y: H - b.h + 10 + rr * sy, w: ww, h: wh, layer: name, block: bi });
  });
  return { blocks, wins: shuffle(cand, r).slice(0, nWin + (name === 'near' ? 1 : 0)) };
}
function build() {
  const r = mulberry32(2026);
  const far = layer(r, 'far', 13, 150, 270, 16, 3, 4), mid = layer(r, 'mid', 8, 190, 330, 24, 6, 8), near = layer(r, 'near', 4, 260, 420, 24, 10, 13);
  const visitor = near.wins.pop(); visitor.visitor = true;
  const all = [...far.wins, ...mid.wins, ...near.wins].map((w, i) => ({ ...w, id: i }));
  // colours: 70 flame-core, 20 flame-a, 6 cream, 4 TV blue (3 windows flicker)
  const order = shuffle(all.map((w) => w.id), r);
  order.forEach((id, k) => { const w = all[id]; w.color = k < 3 ? 'tv' : (() => { const q = r(); return q < 0.7 ? 'core' : q < 0.9 ? 'a' : 'cream'; })(); w.tvDur = 1.7 + r() * 1.5; });
  // fixed five, from the visible centre band across the layers
  const band = (l, n) => all.filter((w) => w.layer === l && w.x > 300 && w.x < 900 && w.color !== 'tv').slice(0, n);
  const fixed = [...band('far', 3), ...band('mid', 5), ...band('near', 5)];
  for (const f of all) if (!fixed.includes(f) && fixed.length < 14 && f.x > 250 && f.x < 950 && f.color !== 'tv') fixed.push(f);
  const rank = new Map(); fixed.forEach((w, i) => rank.set(w.id, i));
  let pool = all.filter((w) => !rank.has(w.id)), k = 14;
  [14, 16, 12].forEach((cnt, lamp) => { pool.sort((a, b) => Math.abs(a.x - LAMP_X[lamp]) - Math.abs(b.x - LAMP_X[lamp])); pool.splice(0, cnt).forEach((w) => rank.set(w.id, k++)); });
  pool.sort((a, b) => Math.abs(a.x - LAMP_X[1]) - Math.abs(b.x - LAMP_X[1])); pool.splice(0, 8).forEach((w) => rank.set(w.id, k++));
  pool.forEach((w) => rank.set(w.id, k++));
  all.forEach((w) => { w.rank = rank.get(w.id); });
  far.wins = all.filter((w) => w.layer === 'far'); mid.wins = all.filter((w) => w.layer === 'mid'); near.wins = all.filter((w) => w.layer === 'near');
  const fan = all.find((w) => w.layer === 'near' && w.rank >= 14 && w.rank < 28);
  // rooftop kit on the mid layer
  const roof = [];
  const rr = mulberry32(77);
  mid.blocks.forEach((b, i) => {
    const y = H - b.h, cx = b.x + b.w / 2;
    if (i % 3 === 0) roof.push({ t: 'tank', x: cx - 14, y });
    if (i % 2 === 1) roof.push({ t: 'antenna', x: cx + 12, y });
    if (i === 2) roof.push({ t: 'dish', x: cx + 4, y });
    if (i === 4 || i === 6) roof.push({ t: 'stair', x: b.x + 8, y });
    if (i === 5) roof.push({ t: 'line', x: b.x + 14, y });
  });
  roof.push({ t: 'tank', x: mid.blocks[7].x + 20, y: H - mid.blocks[7].h });
  roof.push({ t: 'antenna', x: mid.blocks[0].x + 30, y: H - mid.blocks[0].h }, { t: 'antenna', x: mid.blocks[4].x + 40, y: H - mid.blocks[4].h });
  const solar = { x: near.blocks[1].x + 40, y: H - near.blocks[1].h };
  // decorative side blocks (no windows) so wide screens stay filled; separate seed keeps the central scene stable
  const rs = mulberry32(99), side = (L, n, hMin, hMax) => { const bw = (W + 20) / n, out = []; for (let k = 1; k <= Math.ceil(700 / bw); k++) { out.push({ x: -10 - k * bw, w: bw * 0.93, h: hMin + rs() * (hMax - hMin) }); out.push({ x: W - 10 + (k - 1) * bw + bw, w: bw * 0.93, h: hMin + rs() * (hMax - hMin) }); } L.sideBlocks = out; };
  side(far, 13, 150, 270); side(mid, 8, 190, 330); side(near, 4, 260, 420);
  return { far, mid, near, all, visitor, fan, roof, solar, rr };
}
let SCENE = null;
const WinRects = ({ w, on, delay, calm }) => {
  const cls = `win c-${w.color}`;
  return (
    <g className={cls} style={{ opacity: on ? 1 : 0, transitionDelay: on && !calm ? delay + 'ms' : '0ms' }}>
      <rect className="halo" x={w.x - 1.5} y={w.y - 1.5} width={w.w + 3} height={w.h + 3} />
      <rect className="pane" x={w.x} y={w.y} width={w.w} height={w.h} style={w.color === 'tv' ? { animationDuration: w.tvDur + 's' } : undefined} />
    </g>
  );
};
function Roof({ it }) {
  const { t, x, y } = it;
  if (t === 'tank') return <g transform={`translate(${x} ${y})`}><rect x="0" y="-32" width="26" height="30" rx="3" /><path d="M0-32q13-10 26 0z" /><path d="M3-2l-2 4M13-2v4M23-2l2 4" /></g>;
  if (t === 'antenna') return <g transform={`translate(${x} ${y})`} className="stroke"><path d="M0 0V-34M-6-28h12M-8-22h16M-5-16h10" /></g>;
  if (t === 'dish') return <g transform={`translate(${x} ${y})`}><ellipse cx="0" cy="-16" rx="7" ry="5" /><path className="stroke" d="M0-11l-3 11" /></g>;
  if (t === 'stair') return <rect x={x} y={y - 18} width="22" height="18" />;
  return <g transform={`translate(${x} ${y})`} className="stroke"><path d="M0-22h70M0-22V0M70-22V0" /><path d="M12-22v14h8v-14M34-22v10h10v-10M54-22v16h6v-16" className="cloth" /></g>;
}
export default function SkylineLayer() {
  if (!SCENE) SCENE = build();
  const S = SCENE;
  const tone = useStore((s) => s.tone), calm = useStore((s) => s.calm), visitor = useStore((s) => s.visitorLit);
  const pt = useRef(0), lit = LIT[tone], prev = LIT[pt.current] || 0;
  useEffect(() => { pt.current = tone; }, [tone]);
  const win = (w) => <WinRects key={w.id} w={w} on={w.rank < lit} delay={Math.max(0, w.rank - prev) * 90 + (tone === 5 ? 800 : 0)} calm={calm} />;
  const tilt = S.near.blocks[0];
  return (
    <div id="skyline" aria-hidden="true">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMax slice">
        <defs>
          <pattern id="rail" width="6" height="14" patternUnits="userSpaceOnUse"><path d="M3 0v14" stroke="var(--ground-4)" strokeWidth="1.2" /></pattern>
        </defs>
        <g data-par="0.2" className="lay far">{[...S.far.blocks, ...S.far.sideBlocks].map((b, i) => <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} />)}{S.far.wins.map(win)}</g>
        <g data-par="0.5" className="lay mid">
          {[...S.mid.blocks, ...S.mid.sideBlocks].map((b, i) => <rect key={i} x={b.x} y={H - b.h} width={b.w} height={b.h} />)}
          <g className="roof">{S.roof.map((it, i) => <Roof key={i} it={it} />)}</g>
          {S.mid.wins.map(win)}
        </g>
        <g data-par="1" className="lay near">
          {S.near.sideBlocks.map((b, i) => <rect key={'s' + i} x={b.x} y={H - b.h} width={b.w} height={b.h} />)}
          {S.near.blocks.map((b, i) => (
            <g key={i}>
              <rect x={b.x} y={H - b.h} width={b.w} height={b.h} />
              {[0.3, 0.55, 0.8].map((f, j) => <g key={j}><rect x={b.x} y={H - b.h * (1 - f) - 14} width={b.w} height="14" fill="url(#rail)" /><path className="stroke" d={`M${b.x} ${H - b.h * (1 - f) - 14}h${b.w}`} />{(i % 2 === 0 && j === 1) && <rect className="unit" x={b.x + b.w - 30} y={H - b.h * (1 - f) - 10} width="14" height="10" />}</g>)}
            </g>
          ))}
          <g className="solar" transform={`translate(${S.solar.x} ${S.solar.y})`}><path d="M0 0l30-8v6L0 6z" /><rect x="34" y="-14" width="14" height="10" rx="3" /></g>
          {S.near.wins.map(win)}
          {S.fan && <g className="fan" style={{ transformOrigin: `${S.fan.x + 5}px ${S.fan.y + 6}px`, opacity: tone >= 2 ? 1 : 0 }}><ellipse cx={S.fan.x + 5} cy={S.fan.y + 6} rx="4.500" ry="1" /><ellipse cx={S.fan.x + 5} cy={S.fan.y + 6} rx="4.500" ry="1" transform={`rotate(60 ${S.fan.x + 5} ${S.fan.y + 6})`} /><ellipse cx={S.fan.x + 5} cy={S.fan.y + 6} rx="4.500" ry="1" transform={`rotate(120 ${S.fan.x + 5} ${S.fan.y + 6})`} /></g>}
          <g className={`win c-core visitor ${visitor ? 'on' : ''}`} style={{ opacity: visitor ? 1 : 0 }}>
            <rect className="halo" x={S.visitor.x - 5} y={S.visitor.y - 5} width={S.visitor.w + 10} height={S.visitor.h + 10} />
            <rect className="pane" x={S.visitor.x} y={S.visitor.y} width={S.visitor.w} height={S.visitor.h} />
          </g>
        </g>
      </svg>
    </div>
  );
}
