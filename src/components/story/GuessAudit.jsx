import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../../lib/copy.js';
import { rich } from '../../lib/rich.jsx';
import { useStore } from '../../lib/useStore.js';
import { ticker } from '../../lib/ticker.js';
import { mulberry32, shuffle } from '../../lib/rand.js';

// 324 balcony lights: 12 sagging strings of 27 bulbs, drawn on Canvas 2D from one pre-rendered sprite.
// Guess; the wall flickers once; exactly 19 bulbs (the same 19 every time, two brighter) get rings.
// A picture, not a map: the 19 problems are not 19 of the 324 tests.
const STRINGS = 12, PER = 27, W = 320, H = 150;
const FLICKER = (() => { const r = mulberry32(324); const ids = shuffle(Array.from({ length: STRINGS * PER }, (_, i) => i), r); return ids.slice(0, 19); })();
function layout() {
  const pts = [];
  for (let s = 0; s < STRINGS; s++) for (let i = 0; i < PER; i++) { const t = i / (PER - 1), x = 10 + t * (W - 20), sag = 5 * Math.sin(Math.PI * t), y = 12 + s * 11.2 + sag; pts.push({ x, y, s, i }); }
  return pts;
}
const PTS = layout();
function sprite(color) { const c = document.createElement('canvas'); c.width = c.height = 16; const g = c.getContext('2d'); const gr = g.createRadialGradient(8, 8, 0, 8, 8, 8); gr.addColorStop(0, color); gr.addColorStop(0.35, color); gr.addColorStop(1, 'rgba(255,179,71,0)'); g.fillStyle = gr; g.fillRect(0, 0, 16, 16); return c; }

export default function GuessAudit() {
  const cv = useRef(null), st = useRef({ phase: 'idle', t0: 0, ripple: null }), [guess, setGuess] = useState(null), [stage, setStage] = useState(0);
  const calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const g = copy.guess;
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, quality === 'high' ? 2 : 1);
    c.width = W * dpr; c.height = H * dpr;
    const ctx = c.getContext('2d'); ctx.scale(dpr, dpr);
    const sp = sprite('rgba(255,210,122,1)'), spHot = sprite('rgba(255,243,220,1)');
    const draw = (now) => {
      const S = st.current, dt = now - S.t0;
      ctx.clearRect(0, 0, W, H);
      ctx.strokeStyle = 'rgba(60,40,20,.6)'; ctx.lineWidth = 0.8;
      for (let s = 0; s < STRINGS; s++) { ctx.beginPath(); for (let i = 0; i < PER; i++) { const p = PTS[s * PER + i]; i ? ctx.lineTo(p.x, p.y - 2) : ctx.moveTo(p.x, p.y - 2); } ctx.stroke(); }
      const dim = S.phase === 'dim' ? 0.25 : 1;
      for (let k = 0; k < PTS.length; k++) {
        const p = PTS[k]; let a = dim;
        if (!calm && S.phase !== 'dim') {
          const chase = 0.65 + 0.35 * Math.sin(now / 420 - p.i * 0.35 - p.s * 0.6);
          a = S.phase === 'idle' ? chase : 0.85;
          if (S.ripple) { const d = Math.hypot(p.x - S.ripple.x, p.y - S.ripple.y), r = (now - S.ripple.t) / 9; if (Math.abs(d - r) < 14) a = Math.min(1.3, a + 0.6 * (1 - Math.abs(d - r) / 14)); }
        }
        ctx.globalAlpha = Math.min(1, a); ctx.drawImage(sp, p.x - 5, p.y - 5, 10, 10);
      }
      ctx.globalAlpha = 1;
      if (S.phase === 'found') {
        FLICKER.forEach((id, j) => {
          const p = PTS[id], hi = j < 2, f = calm ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(now / (150 + (id % 7) * 55) + id));
          ctx.globalAlpha = f; ctx.drawImage(spHot, p.x - (hi ? 8 : 6), p.y - (hi ? 8 : 6), hi ? 16 : 12, hi ? 16 : 12); ctx.globalAlpha = 1;
          ctx.strokeStyle = calm ? '#C2410C' : 'rgba(255,243,220,.85)'; ctx.lineWidth = hi ? 1.6 : 1; ctx.beginPath(); ctx.arc(p.x, p.y, hi ? 8 : 6, 0, 7); ctx.stroke();
        });
      }
    };
    let stop = null; const fpsGap = quality === 'high' ? 33 : 50; let last = 0;
    const loop = (_, now) => { if (now - last < fpsGap) return; last = now; draw(now); };
    draw(performance.now());
    const animated = !calm && quality !== 'low';
    if (animated) stop = ticker.add(loop);
    c._draw = draw;
    return () => stop && stop();
  }, [calm, quality]);
  const pick = (v) => {
    setGuess(v); setStage(0);
    const S = st.current; S.phase = calm ? 'found' : 'dim'; S.t0 = performance.now(); cv.current._draw && cv.current._draw(performance.now());
    if (calm) { setStage(2); return; }
    setTimeout(() => { S.phase = 'found'; setStage(1); }, 500); setTimeout(() => setStage(2), 1100);
  };
  const again = () => { st.current.phase = 'idle'; setGuess(null); setStage(0); if (cv.current && cv.current._draw) cv.current._draw(performance.now()); };
  const onTap = (e) => { if (calm) return; const r = cv.current.getBoundingClientRect(); st.current.ripple = { x: (e.clientX - r.left) / r.width * W, y: (e.clientY - r.top) / r.height * H, t: performance.now() }; };
  return (
    <div className="device audit" data-no-swipe>
      <p className="chip-line"><span className="chip-pill">{g.chip}</span></p>
      <canvas ref={cv} className="wall" style={{ width: '100%', aspectRatio: `${W} / ${H}` }} onPointerDown={onTap} aria-hidden="true" />
      <p className="picture-only">{X('pictureOnly')}</p>
      <p className="plain">{g.plain}</p>
      <fieldset className="guess">
        <legend>{g.question}</legend>
        <div className="opts">
          {g.options.map((o) => (
            <label key={o} className={guess === o ? 'sel' : ''}>
              <input type="radio" name="audit-guess" value={o} checked={guess === o} onChange={() => pick(o)} /><span>{o}</span>
            </label>
          ))}
        </div>
        <p className="ask">{rich(g.ask)}</p>
      </fieldset>
      <div className="reveal" aria-live="polite" data-show={stage >= 1 || calm && guess !== null ? '1' : '0'}>
        {guess !== null && stage >= 1 && <p>{g.reveal}</p>}
        {guess !== null && stage >= 2 && <p className="branch">{rich(guess < g.answer ? g.below : g.exact)}</p>}
        {guess !== null && stage >= 2 && <button className="btn" onClick={again}>{rich(copy.ui.startAgain)}</button>}
      </div>
    </div>
  );
}
