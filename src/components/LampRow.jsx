import { useCallback, useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { actions, getState } from '../lib/store.js';
import { useStore } from '../lib/useStore.js';
import { emit, on } from '../lib/events.js';
import { announce } from '../lib/announce.js';
import { scrollToId } from '../lib/nav.js';
import { haptic } from '../lib/haptic.js';
import { lampRegistry } from '../lib/lampRegistry.js';
import { engine } from '../lib/flame.js';
import Lamp from './Lamp.jsx';
import Flame from './Flame.jsx';

// The lamp row: press-and-hold lighting, a flame that travels from the previous lamp, tap / Enter / click
// as an exact no-hold alternative, "Light all", the row's breath, and lamp six (proposed, never lights).
const HOLD = 900, TAP_MS = 350, TAP_MOVE = 10, SHORT = 450;
const ease = (p) => p * p * (3 - 2 * p);
const quad = (a, c, b, t) => ({ x: (1 - t) * (1 - t) * a.x + 2 * (1 - t) * t * c.x + t * t * b.x, y: (1 - t) * (1 - t) * a.y + 2 * (1 - t) * t * c.y + t * t * b.y });
const names = copy.lamps.map((l) => l.kicker.split(' · ')[1]);

export default function LampRow() {
  const lamps = useStore((s) => s.lamps), litCount = useStore((s) => s.litCount), calm = useStore((s) => s.calm);
  const [line, setLine] = useState(null), [hint, setHint] = useState(false), [tip, setTip] = useState(0);
  const [pulse, setPulse] = useState(0), [flash, setFlash] = useState(0), [fill6, setFill6] = useState(0);
  const [six, setSix] = useState({ phase: 'idle', scale: 0.33, line: null, ember: false });
  const rings = useRef({}), trav = useRef(null), seq = useRef(null), warm = useRef({ n: 0, p: 0, t: 0 }), handled = useRef(false), busy = useRef(false), lineT = useRef(0), allBusy = useRef(false), lastSpark = useRef(0), sixHeld = useRef(false);
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);

  const showLine = useCallback((text, ms = 4000) => { clearTimeout(lineT.current); setLine(text); if (ms) lineT.current = setTimeout(() => setLine(null), ms); }, []);
  const ring = (n, p) => { const r = rings.current[n]; if (r) r.style.strokeDashoffset = String(1 - p); };
  const place = (pos, p) => { const t = trav.current; if (!t) return; t.style.opacity = pos ? 1 : 0; if (pos) t.style.transform = `translate(${pos.x}px, ${pos.y}px) scale(${(0.5 + 0.5 * p).toFixed(2)})`; };
  const srcOf = (n) => lampRegistry.wick(n === 1 ? 0 : n - 1);
  const pathOf = (n) => {
    const a = srcOf(n), b = lampRegistry.wick(n);
    if (!a || !b) return null;
    const d = Math.hypot(b.x - a.x, b.y - a.y), c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - Math.max(40, 0.35 * d) };
    return { a, b, c };
  };
  const lean = (n, on_) => { // the previous lamp never dims: glow up a little and leans toward the traveller; the lamp ahead leans in, curious
    const src = n === 1 ? 0 : n - 1;
    engine.set(src, { leanExtra: on_ ? 6 : 0, glowBoost: on_ ? 1.1 : 1 });
    if (n < 5) engine.set(n + 1, { leanExtra: on_ ? -4 : 0 });
  };
  const sparkAt = (pos, now) => { if (now - lastSpark.current > 40) { lastSpark.current = now; emit('fx:burst', { kind: 'spark', x: pos.x, y: pos.y }); } };

  const ignite = useCallback((n, fromKeyboard) => {
    const b = lampRegistry.wick(n) || { x: 0, y: 0 };
    actions.finishLighting(n, b.x, b.y);
    place(null, 0); ring(n, 0); lean(n, false); engine.set(n, { scale: 1 });
    emit('fx:burst', { kind: 'ignite', x: b.x, y: b.y });
    if (!fromKeyboard) haptic(20);
    if (!allBusy.current) announce(tpl(X('lampLitLive'), { n }));
    const lit = n === 1 ? copy.opening.awe1 : copy.lamps[n - 1].lit;
    showLine(lit, 4000); setTip(0); setFlash(n); setTimeout(() => setFlash(0), 450);
    busy.current = false; seq.current = null;
  }, []);

  const notReady = (n) => { const k = getState().litCount + 1; setPulse(k); setTimeout(() => setPulse(0), 800); announce(tpl(X('lightFirst'), { k })); };

  // run a progress animation p0 -> p1 over ms along the curve, then call done
  const animate = (n, path, p0, p1, ms, done, keyboard) => {
    const t0 = performance.now(); let raf = 0, stopped = false;
    const step = (now) => {
      if (stopped) return;
      const k = ms <= 0 ? 1 : Math.min(1, (now - t0) / ms), p = p0 + (p1 - p0) * k;
      actions.setProgress(n, p); ring(n, p); engine.set(n, { scale: 0.12 + 0.88 * p });
      const pos = quad(path.a, path.c, path.b, ease(p)); place(pos, p); sparkAt(pos, now);
      if (k < 1) raf = requestAnimationFrame(step); else done && done();
    };
    raf = requestAnimationFrame(step);
    return () => { stopped = true; cancelAnimationFrame(raf); };
  };

  const begin = (n) => { // returns path or null
    if (getState().lamps[n] === 'lit') return null;
    if (!actions.startLighting(n)) return null;
    const path = pathOf(n);
    lean(n, true); busy.current = true; setHint(false); showLine(copy.lamps[n - 1].holding || copy.ui.travelling, 0);
    return path || { a: { x: 0, y: 0 }, c: { x: 0, y: 0 }, b: { x: 0, y: 0 } };
  };
  const shortIgnite = (n, p0 = 0, keyboard = false, existing = null) => {
    const path = existing || begin(n);
    if (!path) return;
    seq.current = { n, path, cancel: animate(n, path, p0, 1, SHORT * (1 - p0), () => setTimeout(() => ignite(n, keyboard), 150), keyboard) };
  };
  const instant = (n, keyboard) => { // Calm: any press lights at once
    const s = getState();
    if (s.lamps[n] === 'lit') return;
    if (n > 1 && s.lamps[n - 1] !== 'lit') return notReady(n);
    if (!actions.startLighting(n)) return;
    ignite(n, keyboard);
  };

  const press = useCallback((n, e) => {
    if (n === 6) return;
    const s = getState();
    if (s.lamps[n] === 'lit') { scrollToId('lamp-' + n); return; }
    if (n > 1 && s.lamps[n - 1] !== 'lit') return notReady(n);
    if (s.calm) return; // handled on pointer up / click
    if (busy.current) return;
    const path = begin(n);
    if (!path) return;
    const now = performance.now(), w = warm.current;
    const p0 = w.n === n ? 0.5 * w.p * Math.max(0, 1 - (now - w.t) / 4000) : 0;
    const startX = e.clientX, startY = e.clientY, t0 = now;
    let held = true, moved = false, done = false;
    setTip(n);
    const cancelAnim = animate(n, path, p0, 1, HOLD * (1 - p0), () => { done = true; cleanup(); setTimeout(() => ignite(n, false), 0); });
    const mv = (ev) => { if (Math.hypot(ev.clientX - startX, ev.clientY - startY) > TAP_MOVE) moved = true; };
    const up = () => {
      if (done) return;
      cleanup(); held = false; cancelAnim();
      const p = getState().progress, el = performance.now() - t0;
      if (el < TAP_MS && !moved) { setTip(0); shortIgnite(n, p, false, path); return; }
      // early release: ring and ember drain back over 300 ms, the traveller walks home, the hint returns
      warm.current = { n, p, t: performance.now() }; setTip(0);
      animate(n, path, p, 0, 300, () => { actions.cancelLighting(n); place(null, 0); ring(n, 0); lean(n, false); engine.set(n, { scale: 1 }); busy.current = false; setHint(true); setTimeout(() => setHint(false), 4000); showLine(null, 0); });
    };
    const cleanup = () => { window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); window.removeEventListener('pointermove', mv); };
    window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up); window.addEventListener('pointermove', mv);
  }, [ignite]);

  const onPointerDown = (n) => (e) => {
    if (e.button !== undefined && e.button > 0) return;
    handled.current = true; setTimeout(() => { handled.current = false; }, 700);
    if (n === 6) return trySix(true);
    if (getState().calm) {
      const up = () => { window.removeEventListener('pointerup', up); if (getState().lamps[n] === 'lit') scrollToId('lamp-' + n); else instant(n, false); };
      window.addEventListener('pointerup', up, { once: true });
      return;
    }
    press(n, e);
  };
  const onClick = (n) => () => {
    if (handled.current) { handled.current = false; return; }       // a pointer sequence already handled it
    if (n === 6) return trySix(false);
    const s = getState();
    if (s.lamps[n] === 'lit') return scrollToId('lamp-' + n);
    if (n > 1 && s.lamps[n - 1] !== 'lit') return notReady(n);
    if (s.calm) return instant(n, true);
    if (!busy.current) shortIgnite(n, 0, true);                      // keyboard, assistive tech, voice control
  };

  // ---- Light all ----
  const lightAll = async () => {
    if (allBusy.current) return;
    allBusy.current = true;
    const s = getState();
    for (let n = 1; n <= 5; n++) {
      if (getState().lamps[n] === 'lit') continue;
      if (getState().calm) { actions.startLighting(n); ignite(n, true); continue; }
      const path = begin(n);
      if (!path) continue;
      await new Promise((res) => { seq.current = { n, path, cancel: animate(n, path, 0, 1, 250, () => { ignite(n, true); res(); }) }; });
      await new Promise((r) => setTimeout(r, 200));
    }
    allBusy.current = false;
  };

  // ---- the breath, after the fifth lamp ----
  useEffect(() => on('diya:allLit', () => {
    announce(X('allLitLive'));
    if (getState().calm) { setFill6(0.55); return; }
    engine.breathe(); setTimeout(() => setFill6(0.55), 0);
  }), []);

  // ---- embers: a tiny one every second or two from each lit lamp ----
  useEffect(() => {
    let alive = true; const timers = {};
    const go = (n) => {
      timers[n] = setTimeout(() => {
        const s = getState();
        if (!alive) return;
        if (s.lamps[n] === 'lit' && !s.calm && s.quality !== 'low' && !document.hidden && (s.quality === 'high' || Math.random() < 0.5)) {
          const p = lampRegistry.wick(n); if (p && p.y > 0 && p.y < innerHeight) emit('fx:burst', { kind: 'ember', x: p.x, y: p.y });
        }
        go(n);
      }, 1000 + Math.random() * 1200);
    };
    [1, 2, 3, 4, 5].forEach(go);
    return () => { alive = false; Object.values(timers).forEach(clearTimeout); };
  }, []);

  // ---- wind: horizontal swipes across the stage lean every flame, then spring back ----
  useEffect(() => {
    const el = document.getElementById('night'); if (!el) return;
    let lx = 0, lt = 0, down = false;
    const d = (e) => { down = e.pointerType !== 'mouse' || true; lx = e.clientX; lt = e.timeStamp; };
    const m = (e) => { if (!down || busy.current || (e.pointerType === 'mouse' && e.buttons === 0)) { lx = e.clientX; lt = e.timeStamp; return; } const dt = Math.max(8, e.timeStamp - lt); const v = (e.clientX - lx) / dt; lx = e.clientX; lt = e.timeStamp; if (Math.abs(v) > 0.2) engine.wind(Math.max(-1, Math.min(1, v)) * 0.25); };
    const u = () => { down = false; };
    el.addEventListener('pointerdown', d); el.addEventListener('pointermove', m); window.addEventListener('pointerup', u);
    return () => { el.removeEventListener('pointerdown', d); el.removeEventListener('pointermove', m); window.removeEventListener('pointerup', u); };
  }, []);

  // ---- lamp six: tries, flickers, and gently dies back. Never lights. Never touches the store. ----
  const trySix = (held) => {
    if (six.phase !== 'idle') return;
    haptic(10);
    announce(X('lamp6Live'));
    const s = getState(), source = s.litCount > 0 ? s.litCount : 0;
    sixHeld.current = held;
    if (held) { const up = () => { sixHeld.current = false; window.removeEventListener('pointerup', up); window.removeEventListener('pointercancel', up); }; window.addEventListener('pointerup', up); window.addEventListener('pointercancel', up); }
    const a = lampRegistry.wick(source), b = lampRegistry.wick(6);
    const T = (ms, f) => setTimeout(() => mounted.current && f(), ms);
    if (s.calm) { // steady ember about a second, then off; the line appears with it
      setSix({ phase: 'try', scale: 0.3, line: copy.lamp6.tryLight, ember: false }); T(1000, () => setSix((x) => ({ ...x, phase: 'idle', scale: 0 })));
      return;
    }
    if (a && b) { const d = Math.hypot(b.x - a.x, b.y - a.y), c = { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - Math.max(40, 0.35 * d) }; const t0 = performance.now(); const st = (now) => { const k = Math.min(1, (now - t0) / 450), pos = quad(a, c, b, ease(k)); place(pos, k * 0.5); sparkAt(pos, now); if (k < 1) requestAnimationFrame(st); else place(null, 0); }; requestAnimationFrame(st); }
    setSix({ phase: 'try', scale: 0.01, line: six.line, ember: false });
    const steps = [0.33, 0.22, 0.3, 0.18, 0.26, 0.12];
    steps.forEach((sc, i) => T(450 + (i * 800) / 5, () => setSix((x) => ({ ...x, scale: sc }))));
    const die = () => {
      setSix((x) => ({ ...x, scale: 0, ember: true, line: copy.lamp6.tryLight }));
      const p = lampRegistry.wick(6); if (p) emit('fx:burst', { kind: 'fizzle', x: p.x, y: p.y });
      T(2000, () => setSix((x) => ({ ...x, phase: 'idle', ember: false })));
    };
    T(1250, () => { const wait = () => (sixHeld.current ? setTimeout(wait, 120) : die()); wait(); });
  };

  const api = useRef({}); api.current = { lightAll, request: (n) => { handled.current = false; onClick(n)(); } };
  useEffect(() => { const a = on('lamp:lightAll', () => api.current.lightAll()), b = on('lamp:request', ({ n }) => api.current.request(n)); return () => { a(); b(); }; }, []);
  const ringR = 'var(--ring-r)';
  const lit5 = litCount === 5;
  const doneLine = litCount === 5 ? copy.ui.progress.all : tpl(copy.ui.progress.some, { n: litCount, rest: 5 - litCount });
  const shown = six.line && line === null ? six.line : line || '';

  return (
    <div className="lamp-stage" data-calm={calm ? '1' : '0'}>
      <div className="home-wrap" aria-hidden="true">
        <Lamp n={0} state="lit"><Flame id={0} /></Lamp>
      </div>
      <p className="status-line" aria-hidden="true">{rich(shown)}</p>
      {litCount === 0 && !hint ? <p className="hold-label"><span className="mono">{copy.opening.holdLabel}</span> <span>{rich(copy.ui.holdHint)}</span></p> : hint ? <p className="hold-label">{rich(copy.ui.holdHint)}</p> : <p className="hold-label empty">&nbsp;</p>}
      <ol className="lamp-row" aria-label={X('lampRow')}>
        {copy.lamps.map((l, i) => {
          const n = i + 1, st = lamps[n], lit = st === 'lit';
          const project = copy.ui.extra.projectNames[i];
          const label = lit ? tpl(X('litLamp'), { n, project }) : tpl(X('lightLamp'), { n, project });
          const desc = lit ? tpl(copy.ui.sr.lit, { n }) : tpl(n === 1 ? copy.ui.sr.unlit.replace('lamp {prev}', X('fromHomeFlame')) : copy.ui.sr.unlit, { n, prev: n - 1 });
          return (
            <li key={n}>
              <button className={`lamp-btn ${lit ? 'lit' : ''} ${pulse === n ? 'pulse' : ''} ${flash === n ? 'flash' : ''}`} aria-label={label} aria-describedby={`ld${n}`}
                onPointerDown={onPointerDown(n)} onClick={onClick(n)} onContextMenu={(e) => e.preventDefault()}>
                <Lamp n={n} state={st}>
                  {st !== 'unlit' && <Flame id={n} scale={lit ? 1 : 0.12} />}
                  <svg className="ring" viewBox="-50 -50 100 100" aria-hidden="true"><circle ref={(el) => (rings.current[n] = el)} r="46" pathLength="1" /></svg>
                  {tip === n && <span className="holding-tip" aria-hidden="true">{rich(copy.ui.holding)}</span>}
                </Lamp>
                {lit && <span className="chip mono">{names[i]}<i className="chev" aria-hidden="true">›</i></span>}
              </button>
              <span id={`ld${n}`} className="sr-only">{desc}</span>
            </li>
          );
        })}
        <li>
          <button className="lamp-btn six" aria-label={X('lamp6Aria')} aria-describedby="ld6" onPointerDown={onPointerDown(6)} onClick={onClick(6)} onContextMenu={(e) => e.preventDefault()}>
            <Lamp n={6} fill6={fill6}>
              {six.phase !== 'idle' && six.scale > 0 && <span className="six-flame" style={{ transform: `scale(${six.scale})` }}><Flame id={6} scale={1} /></span>}
              {six.ember && <i className="six-ember" />}
              {six.phase !== 'idle' && !six.ember && <svg className="smoke" viewBox="0 0 20 30" aria-hidden="true"><path d="M10 28c-5-6 5-10 0-16s4-8 0-12" /></svg>}
            </Lamp>
          </button>
          <span id="ld6" className="sr-only">{X('lamp6Aria')}</span>
        </li>
      </ol>
      {calm && <p className="calm-note">{rich(copy.ui.calmNote)}</p>}
      <svg ref={trav} className="traveller" viewBox="-20 -80 40 84" aria-hidden="true" style={{ opacity: 0 }}>
        <path className="f-b" d="M0 0C-11-13-10-44 0-72C10-44 11-13 0 0Z" /><path className="f-c" d="M0 0C-4-8-4-22 0-34C4-22 4-8 0 0Z" />
      </svg>
    </div>
  );
}
