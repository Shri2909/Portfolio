import { useCallback, useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { getState } from '../lib/store.js';
import { emit, on } from '../lib/events.js';
import { announce } from '../lib/announce.js';
import { haptic } from '../lib/haptic.js';
import { THEMES, renderCard, W, H, isRtl } from '../lib/cardRender.js';
import { cardContent, shareText, exportCard, exportSoon, sendCard, copyText, download } from '../lib/cardActions.js';
import { outgoingLink } from '../lib/row.js';
import { wishState } from '../lib/wishState.js';
import { useWishVersion } from './WishForm.jsx';

// The made card: six themes, swipe or dots or arrow keys to change, floats and tilts in 3D, catches light from the visitor's lamp.
export default function CardStage({ onEdit, onAgain }) {
  useWishVersion();
  const calm = useStore((s) => s.calm), quality = useStore((s) => s.quality), ink = useStore((s) => s.ink);
  const [st, setSt] = useState(wishState.get());
  useEffect(() => wishState.subscribe(() => setSt(wishState.get())), []);
  const names = copy.ui.extra.themeNames;
  const art = useRef(null), txt = useRef(null), body = useRef(null), wrap = useRef(null), stage = useRef(null), sheen = useRef(null);
  const [status, setStatus] = useState(''), [selBox, setSelBox] = useState(''), [w, setW] = useState(360);
  const idx = THEMES.findIndex((t) => t.id === st.theme);
  const lightedOnce = useRef(0);

  const draw = useCallback((layers) => {
    const cA = art.current, cT = txt.current; if (!cA || !cT) return;
    const px = Math.min(Math.round(w * (window.devicePixelRatio || 1)), 810), scale = px / W, hh = Math.round(px * H / W);
    for (const c of [cA, cT]) { if (c.width !== px) { c.width = px; c.height = hh; } }
    const content = cardContent();
    if (layers !== 'text') renderCard({ canvas: cA, themeId: st.theme, content, scale, layers: 'art', seed: st.seed });
    renderCard({ canvas: cT, themeId: st.theme, content, scale, layers: 'text', seed: st.seed });
  }, [w, st.theme, st.seed]);
  useEffect(() => { const el = body.current; if (!el) return; const ro = new ResizeObserver(() => setW(el.clientWidth || 360)); ro.observe(el); return () => ro.disconnect(); }, []);
  // art when theme/seed/size change; text layer only (debounced 120 ms, in rAF) when the words change
  useEffect(() => { draw('both'); }, [draw]);
  const ver = useRef(0);
  const redrawText = () => { clearTimeout(ver.current); ver.current = setTimeout(() => requestAnimationFrame(() => draw('text')), 120); };
  useEffect(() => on('wish:from', redrawText), [draw]);
  useEffect(() => { const t = setInterval(() => { redrawText(); }, 1500); return () => clearInterval(t); }, [draw]);

  // theme change: old card slides and fades, new arrives; a tiny matching puff. Ink and Calm: instant.
  const setTheme = useCallback((i) => {
    const n = Math.max(0, Math.min(THEMES.length - 1, i)), el = body.current;
    if (n === idx) { if (el && !getState().calm) el.animate([{ transform: 'translateX(0)' }, { transform: `translateX(${i < 0 ? 12 : -12}px)` }, { transform: 'translateX(0)' }], { duration: 220 }); return; }
    const instant = getState().calm || getState().quality === 'low';
    const go = () => { wishState.set({ theme: THEMES[n].id }); announce(names[n]); const q = getState().quality; if (!getState().calm && !getState().ink && (q === 'mid' || q === 'high') && THEMES[n].id !== 'ink') { const r = body.current.getBoundingClientRect(); const kind = { toran: 'petals', phuljhadi: 'spark', kandil: 'twinkle', diya: 'ember' }[THEMES[n].id]; kind && emit('fx:burst', { kind, x: r.left + r.width / 2, y: r.top }); } };
    if (instant || !el) { go(); return; }
    el.animate([{ transform: 'translateX(0)', opacity: 1 }, { transform: 'translateX(40px)', opacity: 0 }], { duration: 160, fill: 'forwards' }).onfinish = () => { go(); el.animate([{ transform: 'translateX(-40px)', opacity: 0 }, { transform: 'translateX(0)', opacity: 1 }], { duration: 220 }); };
  }, [idx, names]);
  // swipe: horizontal beyond 48 px and 1.5x vertical, or fast. Vertical scrolling keeps working (touch-action pan-y).
  useEffect(() => {
    const el = wrap.current; if (!el) return; let x0 = 0, y0 = 0, t0 = 0, on_ = false;
    const d = (e) => { on_ = true; x0 = e.clientX; y0 = e.clientY; t0 = e.timeStamp; };
    const u = (e) => { if (!on_) return; on_ = false; const dx = e.clientX - x0, dy = e.clientY - y0, v = Math.abs(dx) / Math.max(1, e.timeStamp - t0); if ((Math.abs(dx) > 48 && Math.abs(dx) > 1.5 * Math.abs(dy)) || (v > 0.4 && Math.abs(dx) > 24 && Math.abs(dx) > Math.abs(dy))) { setTheme(idx + (dx < 0 ? 1 : -1)); haptic(8); } };
    el.addEventListener('pointerdown', d); el.addEventListener('pointerup', u); el.addEventListener('pointercancel', () => { on_ = false; });
    return () => { el.removeEventListener('pointerdown', d); el.removeEventListener('pointerup', u); };
  }, [idx, setTheme]);
  const arrows = (e) => { if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); setTheme(idx + 1); } if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); setTheme(idx - 1); } };

  // tilt toward the finger or pointer (up to 9 degrees); Android: toward the way the phone is tilted. 12% per frame smoothing.
  useEffect(() => {
    const el = body.current, wrp = wrap.current; if (!el || calm || quality === 'low') return;
    let tx = 0, ty = 0, cx = 0, cy = 0, raf = 0, rest = 0;
    const loop = () => { cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12; el.style.transform = `rotateX(${cx.toFixed(2)}deg) rotateY(${cy.toFixed(2)}deg)`; const sx = 50 + cy * 6, sy = 30 - cx * 6; el.style.setProperty('--sx', sx + '%'); el.style.setProperty('--sy', sy + '%'); if (Math.abs(tx - cx) + Math.abs(ty - cy) > 0.02) raf = requestAnimationFrame(loop); else raf = 0; };
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const m = (e) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height; ty = Math.max(-9, Math.min(9, (x - 0.5) * 18)); tx = Math.max(-9, Math.min(9, (0.5 - y) * 18)); kick(); };
    const leave = () => { tx = ty = 0; kick(); };
    wrp.addEventListener('pointermove', m); wrp.addEventListener('pointerleave', leave); wrp.addEventListener('pointerup', leave);
    const D = window.DeviceOrientationEvent; const canO = D && typeof D.requestPermission !== 'function' && /Android/i.test(navigator.userAgent); let seen = false;
    const dor = (e) => { if (!seen) return; if (e.gamma == null) return; const g = Math.abs(e.gamma) < 1 ? 0 : e.gamma, b = Math.abs((e.beta || 0) - 50) < 1 ? 0 : (e.beta || 0) - 50; ty += (Math.max(-9, Math.min(9, g * 0.25)) - ty) * 0.1; tx += (Math.max(-9, Math.min(9, b * 0.2)) - tx) * 0.1; kick(); };
    const io = new IntersectionObserver(([en]) => { seen = en.isIntersecting; }); io.observe(el); canO && window.addEventListener('deviceorientation', dor);
    return () => { wrp.removeEventListener('pointermove', m); wrp.removeEventListener('pointerleave', leave); wrp.removeEventListener('pointerup', leave); canO && window.removeEventListener('deviceorientation', dor); io.disconnect(); cancelAnimationFrame(raf); };
  }, [calm, quality]);

  // the lighting moment, once each time a card is made (at most every 3 s)
  useEffect(() => {
    if (!st.made || !body.current) return;
    const el = body.current, tx = txt.current, now = Date.now();
    const q = getState().quality, c = getState().calm;
    const rtl = isRtl(cardContent().text);
    const finish = () => { emit('wish:ready', { themeId: st.theme, el: wrap.current }); exportSoon(st.theme, st.seed); haptic(12); };
    if (c || q === 'low' || now - lightedOnce.current < 3000) { tx.style.clipPath = 'none'; el.querySelector('.dim').style.opacity = 0; setTimeout(finish, c ? 0 : 200); if (c) emit('wish:half', {}); return; }
    lightedOnce.current = now;
    const dim = el.querySelector('.dim'), edge = el.querySelector('.edge-light'), sweep = el.querySelector('.sweep');
    dim.style.opacity = 0.28; tx.style.clipPath = rtl ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)';
    const T = (ms, f) => setTimeout(f, ms);
    if (q === 'high') T(200, () => {
      const a = document.getElementById('desk-lamp'), b = document.getElementById('visitor-lamp'); if (!a || !b) return;
      const ar = a.getBoundingClientRect(), br = b.getBoundingClientRect(), dot = document.createElement('i'); dot.className = 'ember-dot'; document.body.appendChild(dot);
      const x0 = ar.left + ar.width * .7, y0 = ar.top + ar.height * .3, x1 = br.left + br.width * .65, y1 = br.top + br.height * .3;
      dot.animate([{ transform: `translate(${x0}px,${y0}px)` }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 30}px)` }, { transform: `translate(${x1}px,${y1}px)` }], { duration: 400, easing: 'ease-in-out' }).onfinish = () => { dot.remove(); emit('fx:burst', { kind: 'ember', x: x1, y: y1 }); emit('wish:half', {}); };
    }); else T(200, () => emit('wish:half', {}));
    T(600, () => { dim.animate([{ opacity: 0.28 }, { opacity: 0 }], { duration: 600, fill: 'forwards' }); sweep.animate([{ transform: 'translateX(60%)', opacity: .9 }, { transform: 'translateX(-60%)', opacity: 0 }], { duration: 600, easing: 'ease-out' }); edge.animate([{ opacity: 0 }, { opacity: 1 }, { opacity: .2 }], { duration: 700, fill: 'forwards' }); });
    T(700, () => { tx.animate([{ clipPath: tx.style.clipPath }, { clipPath: 'inset(0 0 0 0)' }], { duration: 900, easing: 'ease-in-out', fill: 'forwards' }).onfinish = () => { tx.style.clipPath = 'none'; }; });
    T(1400, finish);
  }, [st.made, st.v]);

  // actions
  const flash = (t) => { setStatus(t); setTimeout(() => setStatus(''), 6000); };
  const hiplain = (s) => s.replace(/<\/?hi>/g, '');
  const A = copy.wish.actions;
  const onSend = async () => {
    const r = await sendCard(st.theme, st.seed);
    if (r === 'shared') { const b = body.current.getBoundingClientRect(); const q = getState().quality; if ((q === 'mid' || q === 'high') && !getState().calm) emit('fx:burst', { kind: 'lantern', x: b.left + b.width / 2, y: b.top + b.height / 2 }); emit('wish:sent', {}); }
    else if (r === 'copied') { flash(hiplain(copy.wish.micro.copied)); emit('wish:sent', {}); } else if (r === 'failed') { setSelBox(shareText()); flash(hiplain(copy.wish.micro.copyFailed)); }
    else if (r === 'opened') emit('wish:sent', {});
  };
  const doCopy = async (text) => { if (await copyText(text)) { flash(hiplain(copy.wish.micro.copied)); emit('wish:sent', {}); } else { setSelBox(text); flash(hiplain(copy.wish.micro.copyFailed)); } };
  const onDownload = async () => { try { download(await exportCard(st.theme, st.seed)); } catch (e) { /* ignore */ } };
  const content = cardContent();
  const sel = selBox ? <textarea className="sel-box" readOnly value={selBox} rows={4} onFocus={(e) => e.target.select()} /> : null;
  return (
    <div className="card-stage" ref={stage} data-theme={st.theme}>
      <div className="stage-wrap" ref={wrap} tabIndex={0} role="group" aria-label={copy.wish.card.altText} onKeyDown={arrows} style={{ touchAction: 'pan-y' }}>
        <i className="card-shadow" aria-hidden="true" />
        <div className={`card3d ${!calm && quality !== 'low' ? 'floats' : ''}`}>
          <div className="card-body" ref={body} style={{ '--sx': '85%', '--sy': '0%' }}>
            <canvas ref={art} className="art" aria-hidden="true" /><canvas ref={txt} className="txt" role="img" aria-label={copy.wish.card.altText} />
            <i className="sheen" ref={sheen} aria-hidden="true" /><i className="dim" aria-hidden="true" /><i className="edge-light" aria-hidden="true" /><i className="sweep" aria-hidden="true" />
          </div>
        </div>
      </div>
      <div role="radiogroup" aria-label={X('themeGroupAria')} className="theme-dots">
        {THEMES.map((t, i) => (
          <button key={t.id} type="button" role="radio" aria-checked={i === idx} aria-label={names[i]} tabIndex={i === idx ? 0 : -1} className={i === idx ? 'on' : ''} onClick={() => setTheme(i)}
            onKeyDown={(e) => { arrows(e); if (e.key.startsWith('Arrow')) setTimeout(() => stage.current && stage.current.querySelectorAll('[role=radio]')[Math.max(0, Math.min(5, i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1)))].focus(), 0); }}>
            <i /><span className="dot-name">{names[i]}</span>
          </button>
        ))}
      </div>
      <p className="ready" role="status" aria-live="polite">{st.made ? rich(copy.wish.micro.ready) : ''}</p>
      <div className="twin" dir="auto"><p className="sr-only">{copy.wish.card.altText}</p><pre>{shareText()}</pre></div>
      <div className="actions">
        <button type="button" className="btn btn-primary wa" aria-label={A.whatsapp.aria} onClick={onSend}>{rich(A.whatsapp.label)}</button>
        <div className="grid2">
          <button type="button" className="btn" aria-label={A.copyText.aria} onClick={() => doCopy(shareText())}>{rich(A.copyText.label)}</button>
          <button type="button" className="btn" aria-label={A.copyLink.aria} onClick={() => doCopy(outgoingLink())}>{rich(A.copyLink.label)}</button>
          <button type="button" className="btn" onClick={onDownload}>{X('download')}</button>
          <button type="button" className="btn" aria-label={A.edit.aria} onClick={onEdit}>{rich(A.edit.label)}</button>
        </div>
        {sel}
        <p className="status" role="status" aria-live="polite">{status}</p>
        <p className="under">{rich(copy.wish.micro.underCard)}</p>
        <button type="button" className="btn btn-ghost" onClick={onAgain}>{rich(copy.ui.startAgain)}</button>
      </div>
    </div>
  );
}
