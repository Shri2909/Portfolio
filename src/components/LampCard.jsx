import { useCallback, useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { actions, getState } from '../lib/store.js';
import { useStore } from '../lib/useStore.js';
import { closeLampCard, scrollToId, wireLampCard } from '../lib/nav.js';
import { emit, on, hooks } from '../lib/events.js';
import Flame from './Flame.jsx';
import { LAMPS } from '../lib/lamps.js';

// A letter that rises out of the lamp it belongs to. Native dialog (top layer, Escape, focus trap), styled as a floating card.
// Three parts that ink in as you read, a receipt, a quiet "Agla diya" corner, swipe down to close.

function Part({ part, idx, on_, className = '', children, device }) {
  return (
    <section className={`part ${on_ ? 'on' : ''} ${className}`} data-part={idx} {...(part.heading ? { 'aria-labelledby': `part-h-${idx}` } : { 'aria-label': copy.ui.extra.levelLabels.level2Hint })}>
      {part.heading ? <h3 id={`part-h-${idx}`}>{rich(part.heading)}{part.gloss ? <small> ({part.gloss})</small> : null}</h3> : null}
      <div className="lines">
        {device === 'before' && children}
        {part.paras.map((p, i) => <p key={i} style={{ '--i': Math.min(i, 5) }}>{rich(p)}</p>)}
        {(part.list || []).length ? <ul className="reveals">{part.list.map((t, i) => <li key={i} style={{ '--i': Math.min(i, 5) }}>{rich(t)}</li>)}</ul> : null}
        {device === 'after' && children}
      </div>
    </section>
  );
}

export default function LampCard() {
  const n = useStore((s) => s.lampCard), overlay = useStore((s) => s.overlay), calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const dlg = useRef(null), body = useRef(null), scroller = useRef(null), saved = useRef(0), hiddenForDrawer = useRef(false), cur = useRef(null);
  const [k, setK] = useState(0);                         // how many parts have inked in
  const visible = useRef(new Set());
  const lamp = n ? copy.lamps[n - 1] : null;

  useEffect(() => wireLampCard(), []);

  const lampEl = (m) => document.querySelectorAll('.lamp-btn')[m - 1];
  const flare = (m) => { const e = lampEl(m); if (e) { e.classList.add('flash'); setTimeout(() => e.classList.remove('flash'), 480); } };

  // open: rise from the lamp (transform and opacity only). Calm: fade in place.
  useEffect(() => {
    const d = dlg.current;
    if (!d) return;
    if (n && !d.open && !hiddenForDrawer.current) {
      cur.current = n; setK(0); visible.current = new Set();
      d.showModal();
      const b = body.current, lr = lampEl(n) && lampEl(n).getBoundingClientRect(), br = b.getBoundingClientRect();
      const reduce = getState().calm;
      if (hooks.cardOpen && hooks.cardOpen(b, lampEl(n))) { /* elevation plays the open */ }
      else if (reduce) b.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 });
      else if (lr) { const dx = lr.left + lr.width / 2 - (br.left + br.width / 2), dy = lr.top + lr.height / 2 - (br.top + br.height / 2); b.animate([{ transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: 450, easing: 'cubic-bezier(.2,.8,.2,1)' }); emit('fx:burst', { kind: 'spark', x: lr.left + lr.width / 2, y: lr.top }); }
      const t = d.querySelector('[data-title]'); if (t) { t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); }
      setTimeout(() => setK((x) => { let y = Math.max(x, 1); while (y < 3 && visible.current.has(y)) y++; return y; }), reduce ? 0 : 480);
    }
    if (n && cur.current !== n && d.open) { cur.current = n; setK(reduce0()); visible.current = new Set(); if (scroller.current) scroller.current.scrollTop = 0; const t = d.querySelector('[data-title]'); t && t.focus({ preventScroll: true }); }
    if (!n && d.open) d.close();
  }, [n]);
  const reduce0 = () => (getState().calm ? 3 : 1);

  // hide (not destroy) while the evidence drawer is open; come back at the same scroll position
  useEffect(() => {
    const d = dlg.current; if (!d || !n) return;
    if (overlay === 'evidence' && d.open) { saved.current = scroller.current ? scroller.current.scrollTop : 0; hiddenForDrawer.current = true; d.close(); }
    else if (overlay !== 'evidence' && hiddenForDrawer.current) {
      hiddenForDrawer.current = false; d.showModal();
      if (scroller.current) scroller.current.scrollTop = saved.current;
      const r = d.querySelector('[data-receipt]'); r && r.focus({ preventScroll: true });
    }
  }, [overlay, n]);

  const requestClose = useCallback((after) => {
    const d = dlg.current, b = body.current, m = cur.current;
    const finish = () => { flare(m); closeLampCard(); after && after(); };
    if (!d || !d.open) return finish();
    const lr = lampEl(m) && lampEl(m).getBoundingClientRect(), br = b.getBoundingClientRect();
    if (hooks.cardClose && hooks.cardClose(b, lampEl(m), finish)) return;
    if (getState().calm || !lr) { finish(); return; }
    const dx = lr.left + lr.width / 2 - (br.left + br.width / 2), dy = lr.top + lr.height / 2 - (br.top + br.height / 2);
    b.animate([{ transform: 'none', opacity: 1 }, { transform: `translate(${dx}px, ${dy}px) scale(.12)`, opacity: 0 }], { duration: 300, easing: 'ease-in', fill: 'forwards' }).onfinish = finish;
  }, []);

  // reveal each part when 35% of it is in view, never before the part above it
  useEffect(() => {
    const root = scroller.current; if (!n || !root) return;
    if (getState().calm) { setK(3); return; }
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { const i = +e.target.dataset.part; e.isIntersecting ? visible.current.add(i) : visible.current.delete(i); });
      setK((x) => { let y = x; while (y < 3 && (y === 0 ? false : visible.current.has(y))) y++; return y; });
    }, { root, threshold: 0.35 });
    root.querySelectorAll('.part').forEach((p) => io.observe(p));
    return () => io.disconnect();
  }, [n]);

  // tilt (mouse; Android device orientation, no prompt), sheen opposite, settles flat after 1 s of stillness
  useEffect(() => {
    const el = body.current; if (!n || !el || calm || quality === 'low') return;
    const max = quality === 'mid' ? 2 : 4; let tx = 0, ty = 0, cx = 0, cy = 0, last = 0, raf = 0, still = 0;
    const apply = () => { cx += (tx - cx) * 0.2; cy += (ty - cy) * 0.2; el.style.setProperty('--rx', cx.toFixed(2) + 'deg'); el.style.setProperty('--ry', cy.toFixed(2) + 'deg'); el.style.setProperty('--sx', (50 - cy * 12) + '%'); el.style.setProperty('--sy', (30 + cx * 12) + '%'); if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.02) raf = requestAnimationFrame(apply); else { el.classList.remove('moving'); raf = 0; } };
    const aim = (x, y) => { const now = performance.now(); if (now - last < 33) return; last = now; tx = -y * max; ty = x * max; el.classList.add('moving'); if (!raf) raf = requestAnimationFrame(apply); clearTimeout(still); still = setTimeout(() => { tx = 0; ty = 0; if (!raf) raf = requestAnimationFrame(apply); }, 1000); };
    const pm = (e) => { if (e.pointerType !== 'mouse') return; const r = el.getBoundingClientRect(); aim(((e.clientX - r.left) / r.width - 0.5) * 2, ((e.clientY - r.top) / r.height - 0.5) * 2); };
    const D = window.DeviceOrientationEvent, canOrient = D && typeof D.requestPermission !== 'function' && /Android/i.test(navigator.userAgent);
    const dor = (e) => { if (e.gamma == null) return; aim(Math.max(-1, Math.min(1, e.gamma / 25)), Math.max(-1, Math.min(1, ((e.beta || 0) - 45) / 25))); };
    window.addEventListener('pointermove', pm); canOrient && window.addEventListener('deviceorientation', dor);
    return () => { window.removeEventListener('pointermove', pm); canOrient && window.removeEventListener('deviceorientation', dor); cancelAnimationFrame(raf); clearTimeout(still); };
  }, [n, calm, quality]);

  // swipe down to close: from the grab pill, or from anywhere when scrolled to the top; never from a slider or canvas
  useEffect(() => {
    const root = body.current, sc = scroller.current; if (!n || !root) return;
    let y0 = 0, t0 = 0, dy = 0, on_ = false;
    const blocked = (t) => t.closest && t.closest('[data-no-swipe],input,canvas,button,a,textarea');
    const ts = (e) => { const t = e.target; on_ = !blocked(t) && (t.closest('.grab') || sc.scrollTop <= 0); y0 = e.touches[0].clientY; t0 = performance.now(); dy = 0; };
    const tm = (e) => { if (!on_) return; dy = e.touches[0].clientY - y0; if (dy > 0 && (sc.scrollTop <= 0)) { e.preventDefault(); root.style.transform = `translateY(${dy}px)`; } else if (dy <= 0) { root.style.transform = ''; } };
    const te = () => { if (!on_) return; on_ = false; const v = dy / Math.max(1, performance.now() - t0); root.style.transition = 'transform .2s'; if (dy > 90 || (dy > 30 && v > 0.6)) requestClose(); root.style.transform = ''; setTimeout(() => { root.style.transition = ''; }, 220); };
    root.addEventListener('touchstart', ts, { passive: true }); root.addEventListener('touchmove', tm, { passive: false }); root.addEventListener('touchend', te);
    return () => { root.removeEventListener('touchstart', ts); root.removeEventListener('touchmove', tm); root.removeEventListener('touchend', te); };
  }, [n, requestClose]);

  const next = () => {
    if (n < LAMPS && getState().lamps[n + 1] === 'lit') { actions.setLampCard(n + 1); return; }
    requestClose(() => { if (n < LAMPS) { const e = document.querySelectorAll('.lamp-btn')[n]; e && e.focus(); } else scrollToId('lamp-6'); });
  };
  const nextLabel = n === LAMPS ? X('aglaLamp6') : X('aglaNext');
  return (
    <dialog ref={dlg} id="lamp-card" className="lamp-card" aria-labelledby="card-title" onCancel={(e) => { e.preventDefault(); requestClose(); }} onClick={(e) => { if (e.target === dlg.current) requestClose(); }}>
      {n && lamp && (
        <div ref={body} className="card" data-lamp={n} style={{ '--k': k }}>
          <i className="paper-noise" aria-hidden="true" /><i className="card-glow" aria-hidden="true" />
          <div className="card-flame" aria-hidden="true"><Flame id={10 + n} pers={n} /></div>
          <div className="grab" aria-hidden="true"><i /></div>
          <div ref={scroller} className="card-scroll">
            <p className="kicker">{lamp.kicker}</p>
            <h2 id="card-title" data-title>{rich(lamp.title)}</h2>
            <div className="parts">
              <Part part={lamp.what} idx={0} on_={k >= 1} />
              <Part part={lamp.next} idx={1} on_={k >= 2} />
              <Part part={lamp.warning} idx={2} on_={k >= 3} />
            </div>
            <div className="card-foot">
              <button className="btn btn-primary receipt" data-receipt data-evidence={lamp.receipt.folder}>{lamp.receipt.label}</button>
              <button className="btn close" onClick={() => requestClose()}>{rich(copy.ui.lampClose)}</button>
            </div>
          </div>
          <button className="fold" onClick={next} aria-label={nextLabel}><span lang="hi-Latn">{X('aglaDiya')}</span></button>
        </div>
      )}
    </dialog>
  );
}
