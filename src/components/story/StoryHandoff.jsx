import { useEffect, useRef, useState } from 'react';
import copy, { X } from '../../lib/copy.js';
import { tpl, hiOf } from '../../lib/tpl.js';
import { rich } from '../../lib/rich.jsx';
import { haptic } from '../../lib/haptic.js';
import { useStore } from '../../lib/useStore.js';

// Two halves, kept visibly separate. Upper: a baton of light from the Codex lantern to the Claude Code lantern.
// Lower: a rangoli of exactly 820 dots (20 arms of 41), one dot per completed measurement round in the campaign record.
// The count never goes above 820 and the dots belong to the whole record, not to the time after the handoff.
const TOTAL = 820, ARMS = 20, RINGS = 41, SIZE = 200;
const COLORS = ['#F5A623', '#C2410C', '#2F6B4F', '#FFF3DC'];
export default function StoryHandoff() {
  const calm = useStore((s) => s.calm);
  const [baton, setBaton] = useState(calm ? 4 : 0);         // 0 dim, 1..3 stones, 4 landed
  const [count, setCount] = useState(calm ? TOTAL : 0), [done, setDone] = useState(calm);
  const cv = useRef(null), drawn = useRef(0), raf = useRef(0), holdRef = useRef(null);
  useEffect(() => {
    const c = cv.current; if (!c) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2); c.width = SIZE * dpr; c.height = SIZE * dpr; const ctx = c.getContext('2d'); ctx.scale(dpr, dpr); c._ctx = ctx; drawn.current = 0;
    ctx.fillStyle = 'rgba(255,243,220,.18)'; ctx.beginPath(); ctx.arc(SIZE / 2, SIZE / 2, 2, 0, 7); ctx.fill();
    if (calm) fill(TOTAL);
  }, [calm]);
  function fill(upTo) { // incremental: never clears
    const ctx = cv.current && cv.current._ctx; if (!ctx) return;
    for (let i = drawn.current; i < Math.min(upTo, TOTAL); i++) {
      const ring = Math.floor(i / ARMS), arm = i % ARMS, r = 10 + ring * (88 / RINGS), a = (arm * 360 / ARMS + ring * 2.6) * Math.PI / 180;
      ctx.fillStyle = COLORS[ring % 4]; ctx.beginPath(); ctx.arc(SIZE / 2 + r * Math.cos(a), SIZE / 2 + r * Math.sin(a), 1.6, 0, 7); ctx.fill();
    }
    drawn.current = Math.max(drawn.current, Math.min(upTo, TOTAL));
  }
  const sendBaton = () => {
    if (baton !== 0 && baton !== 4) return; if (baton === 4) return;
    if (calm) { setBaton(4); return; }
    [1, 2, 3, 4].forEach((s, i) => setTimeout(() => setBaton(s), 450 * (i + 1)));
  };
  const finish = () => { cancelAnimationFrame(raf.current); fill(TOTAL); setCount(TOTAL); if (!done) { setDone(true); haptic(30); } };
  const runTo = (from, ms) => { const t0 = performance.now(), n0 = from; const step = (now) => { const k = Math.min(1, (now - t0) / ms), v = Math.round(n0 + (TOTAL - n0) * k); fill(v); setCount(v); if (k < 1) raf.current = requestAnimationFrame(step); else finish(); }; raf.current = requestAnimationFrame(step); };
  const down = () => { if (done) return; if (calm) return finish(); const t0 = performance.now(); let v = count; holdRef.current = { t0, moved: false }; const step = (now) => { v = Math.min(TOTAL, count + Math.round((now - t0) * TOTAL / 2500)); fill(v); setCount(v); if (v >= TOTAL) finish(); else raf.current = requestAnimationFrame(step); }; raf.current = requestAnimationFrame(step); };
  const up = () => { const h = holdRef.current; if (!h || done) return; holdRef.current = null; const dt = performance.now() - h.t0; if (dt < 350) { cancelAnimationFrame(raf.current); runTo(drawn.current, 2500 * (1 - drawn.current / TOTAL) + 50); } else cancelAnimationFrame(raf.current); };
  const click = (e) => { if (e.detail === 0 && !done) { if (calm) finish(); else runTo(drawn.current, 2500); } };
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const ex = copy.ui.extra, p0 = copy.lamps[3].what.paras[0], p1 = copy.lamps[3].next.paras[1];
  return (
    <div className="device handoff" data-no-swipe>
      <div className="half upper">
        <button className="baton-btn" onClick={sendBaton} aria-label={ex.batonAria} disabled={baton === 4}>
          <span className={`lantern-l left ${baton >= 4 ? 'lit' : ''}`}><i />{ex.codex}</span>
          <span className="path" aria-hidden="true">
            {ex.stones.map((s, i) => <span key={s} className={`stone ${baton > i && baton < 5 ? 'on' : ''} ${baton >= 4 ? 'on' : ''}`}><i />{s}</span>)}
            <span className={`dashline ${baton >= 4 ? 'solid' : ''}`} />
          </span>
          <span className={`lantern-l right ${baton >= 4 ? 'lit' : ''}`}><i />{ex.claudeCode}</span>
        </button>
        <p className="caption">{rich(hiOf(p0))}</p>
      </div>
      <div className="half lower">
        <p className="chip-line"><span className="chip-pill">{ex.roundsChip}</span></p>
        <canvas ref={cv} className="dots" style={{ width: SIZE, height: SIZE }} aria-hidden="true" />
        <p className="counter" aria-hidden="true">{tpl(ex.roundsCounter, { n: count })}</p>
        <span className="sr-only" role="status" aria-live="polite">{done ? tpl(ex.roundsCounter, { n: TOTAL }) : ''}</span>
        <button className="btn" onPointerDown={down} onPointerUp={up} onPointerCancel={up} onClick={click} disabled={done}>{ex.holdRounds}</button>
        <p className="caption">{rich(p1)}</p>
      </div>
    </div>
  );
}
