// E5.1: the green wall. 18 strands x 18 bulbs = 324 on a full-width canvas laid over the V3 device. Guess -> the wall dims,
import { tier, still, ink, spring, easeOutQuint, inOutQuint, clamp, foreground, useInView, effect, alive, watch, el, getState, ticker } from './elev-kit.js';
import { mulberry32, shuffle } from '../../lib/rand.js';

const N = 18, FOUND = (() => { const r = mulberry32(324); return shuffle(Array.from({ length: N * N }, (_, i) => i), r).slice(0, 19); })();
const sprite = (core, halo) => { const c = document.createElement('canvas'); c.width = c.height = 24; const g = c.getContext('2d'), gr = g.createRadialGradient(12, 12, 0, 12, 12, 12); gr.addColorStop(0, core); gr.addColorStop(0.3, core); gr.addColorStop(0.55, halo); gr.addColorStop(1, 'rgba(0,0,0,0)'); g.fillStyle = gr; g.fillRect(0, 0, 24, 24); return c; };

export function mount(root) {
  const old = root.querySelector('canvas.wall'); if (!old) return null;
  const box = el('div', 'wall-e'), cv = document.createElement('canvas'); box.appendChild(cv); box.removeAttribute('aria-hidden'); cv.setAttribute('aria-hidden', 'true');
  old.parentNode.insertBefore(box, old); root.setAttribute('data-sp-hide', 'wall');
  const ctx = cv.getContext('2d');
  const green = sprite('#7EE0A0', '#2F6B4F'), cream = sprite('#FFF3DC', '#6a5a46'), amber = sprite('#FFD27A', '#FFB347'), hot = sprite('#FFF3DC', '#FFB347');
  const S = { W: 0, H: 0, dpr: 1, ang: Array.from({ length: N }, () => ({ x: 0, v: 0 })), px: -999, py: -999, pvx: 0, ripple: null, phase: 'idle', t0: 0, guess: 0, cam: 1, camT: -1, camTarget: 0, visible: false, last: 0, lens: [] };
  const un = [];
  const size = () => {
    const q = tier(), dpr = Math.min(devicePixelRatio || 1, q === 'high' ? 2 : q === 'mid' ? 1.5 : 1);
    S.W = Math.round(box.clientWidth) || 340; S.H = Math.round(S.W * (innerWidth < 640 ? 0.8 : 7 / 16)); S.dpr = dpr;
    cv.width = Math.round(S.W * dpr); cv.height = Math.round(S.H * dpr); cv.style.height = S.H + 'px'; box.style.height = S.H + 'px'; draw(performance.now());
  };
  const pad = () => Math.max(14, S.W * 0.05);
  const pos = (id, now) => {
    const s = Math.floor(id / N), j = id % N, pd = pad(), x0 = pd + s * (S.W - 2 * pd) / (N - 1), sp = 0.042 * S.H, a = still() ? 0 : tier() === 'high' ? S.ang[s].x : (tier() === 'mid' ? 0.05 * Math.sin(now / 1100 + s) : 0);
    const idle = still() || tier() !== 'high' ? 0 : 0.18 * 0.18 * Math.sin(now / 4200 * 6.283 - s * 0.35);
    const L = (j + 1) * sp, ang = (a + idle) * (j / 17 + 0.15);
    return { x: x0 + Math.sin(ang) * L, y: 14 + Math.cos(ang) * L };
  };
  const phaseT = (now) => now - S.t0;
  function brightness(id, now) {
    const s = Math.floor(id / N), j = id % N, t = phaseT(now);
    if (S.phase === 'idle') return still() ? 1 : 0.7 + 0.3 * Math.sin(now / 420 - j * 0.35 - s * 0.6);
    if (S.phase === 'dim') { const k = still() ? 1 : clamp(t / 500, 0, 1); return 1 - 0.8 * inOutQuint(k); }
    return 0.2;
  }
  function draw(now) {
    const dpr = S.dpr, W = S.W, H = S.H, t = phaseT(now), calm = still(), inkOn = ink();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, W, H);
    // camera push about bulb #1
    let sc = 1, cx = 0, cy = 0;
    if (S.phase === 'found' && !calm && tier() !== 'low') {
      const T = t - 1900; if (T > 0) { const up = clamp(T / 1100, 0, 1), hold = T > 2300, down = clamp((T - 2300 - 1200) / 700, 0, 1); sc = 1 + 1.6 * (T <= 1100 ? inOutQuint(up) : T < 3500 ? 1 : 1 - inOutQuint(down)); const b = pos(FOUND[S.camTarget], now); cx = b.x; cy = b.y; }
    }
    cv.dataset.cam = sc.toFixed(2);
    if (sc !== 1) { ctx.translate(W / 2, H / 2); ctx.scale(sc, sc); ctx.translate(-cx, -cy); }
    // rail with 18 hooks
    ctx.fillStyle = '#6b4a2a'; ctx.fillRect(pad() - 6, 10, W - 2 * pad() + 12, 3);
    ctx.fillStyle = '#3a2814'; for (let s = 0; s < N; s++) ctx.fillRect(pad() + s * (W - 2 * pad()) / (N - 1) - 1, 8, 2, 7);
    const base = inkOn ? cream : green, fin = S.phase === 'found';
    const foundSet = fin ? new Set(FOUND) : null, ghosts = S.phase === 'dim' && t < 900 && !calm ? new Set(shuffle(Array.from({ length: N * N }, (_, i) => i), mulberry32(S.guess + 7)).slice(0, S.guess)) : null;
    for (let id = 0; id < N * N; id++) {
      const p = pos(id, now); let a = brightness(id, now);
      if (!calm && S.phase === 'idle' && S.ripple) { const d = Math.hypot(p.x - S.ripple.x, p.y - S.ripple.y), r = (now - S.ripple.t) / 9; if (Math.abs(d - r) < 14) a = Math.min(1.3, a + 0.6 * (1 - Math.abs(d - r) / 14)); }
      if (!calm && S.px > -900 && tier() === 'high') { const d = Math.hypot(p.x - S.px, p.y - S.py); if (d < 64) a = Math.min(1.25, a + 0.5 * (1 - d / 64)); }
      if (sc > 1.2 && !(foundSet && foundSet.has(id)) && tier() === 'high') a *= clamp(1 - Math.hypot(p.x - cx, p.y - cy) / 120, 0.25, 1);
      ctx.globalAlpha = clamp(a, 0, 1); ctx.drawImage(base, p.x - 5.5, p.y - 5.5, 11, 11);
      if (ghosts && ghosts.has(id)) { ctx.globalAlpha = 0.35; ctx.drawImage(amber, p.x - 5.5, p.y - 5.5, 11, 11); }
    }
    ctx.globalAlpha = 1;
    if (fin) {
      let up = 0;
      FOUND.forEach((id, j) => {
        const rise = calm || tier() === 'low' ? 1 : clamp((t - 800 - j * 70) / 300, 0, 1); if (rise <= 0) return; up++;
        const p = pos(id, now), big = j < 2, f = calm ? 1 : 0.55 + 0.45 * Math.abs(Math.sin(now / (500 + (id % 5) * 60) + id)), z = (big ? 16 : 11) * (0.6 + 0.4 * rise);
        ctx.globalAlpha = f * rise; ctx.drawImage(inkOn ? hot : amber, p.x - z / 2, p.y - z / 2, z, z);
        ctx.globalAlpha = rise; ctx.strokeStyle = calm || inkOn ? '#C2410C' : 'rgba(255,243,220,.85)'; ctx.lineWidth = big ? 1.6 : 1; ctx.beginPath(); ctx.arc(p.x, p.y, big ? 9 : 6.5, 0, 7); ctx.stroke();
        if (big) { ctx.globalAlpha = 0.35 * rise; ctx.beginPath(); ctx.arc(p.x, p.y, 13, 0, 7); ctx.stroke(); }
      });
      ctx.globalAlpha = 1; cv.dataset.found = String(up);
    } else cv.dataset.found = '0';
    // vignette edge
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); const vg = ctx.createRadialGradient(W / 2, H / 2, H * 0.4, W / 2, H / 2, W * 0.65); vg.addColorStop(0, 'rgba(10,7,5,0)'); vg.addColorStop(1, 'rgba(10,7,5,.55)'); ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  }
  // physics + loop (high: 60 fps strand pendulums, mid: 30 fps, low: no loop)
  let stopT = null;
  const tick = (dt, now) => {
    if (!S.visible || !alive('wall')) return;
    const q = tier(); if (q === 'mid' && now - S.last < 33) return; S.last = now;
    if (q === 'high' && !still()) for (let s = 0; s < N; s++) { const a = S.ang[s]; a.v += (-26 * a.x - 2.4 * a.v) * Math.min(dt, 32) / 1000; a.x += a.v * Math.min(dt, 32) / 1000; }
    if (S.phase === 'found' && S.camTarget < 0) S.camTarget = 0;
    draw(now);
  };
  const run = () => { const want = !still() && tier() !== 'low' && S.visible; if (want && !stopT) stopT = ticker.add(tick); else if (!want && stopT) { stopT(); stopT = null; } };
  const unreg = effect('wall', { kind: 'canvas', priority: 6, ms: 2.2, shed: () => { run(); draw(performance.now()); }, restore: run });
  const setPhase = (ph) => { S.phase = ph; S.t0 = performance.now(); run(); draw(S.t0); };
  const onPick = (e) => {
    const t = e.target; if (!t || t.name !== 'audit-guess') return; S.guess = +t.value || 0; S.camTarget = 0;
    if (still()) { setPhase('found'); return; }
    foreground(true, 'wall'); setPhase('dim'); S.t0 = performance.now(); const t0 = S.t0;
    setTimeout(() => { if (S.t0 === t0) { S.phase = 'found'; S.t0 = t0; draw(performance.now()); } }, 800); // hold ends at 800 ms; the rise is timed from the same clock
    setTimeout(() => foreground(false, 'wall'), 5200);
  };
  const onAgain = (e) => { if (e.target.closest && e.target.closest('.reveal .btn')) setPhase('idle'); };
  root.addEventListener('change', onPick); root.addEventListener('click', onAgain);
  box.addEventListener('pointermove', (e) => { const r = box.getBoundingClientRect(); const x = e.clientX - r.left, y = e.clientY - r.top; S.pvx = x - S.px; S.px = x; S.py = y; if (tier() === 'high' && !still()) for (let s = 0; s < N; s++) { const sx = pad() + s * (S.W - 2 * pad()) / (N - 1), d = Math.abs(sx - x); if (d < 56) S.ang[s].v += clamp(S.pvx * 0.0035, -0.5, 0.5) * 60 * Math.cos(d / 56 * 1.5708); } if (tier() !== 'high' || still()) draw(performance.now()); }); // lint:ok event-time read, not per frame
  box.addEventListener('pointerleave', () => { S.px = S.py = -999; });
  box.addEventListener('pointerdown', (e) => { const r = box.getBoundingClientRect(); if (S.phase === 'found' && S.camTarget === 0 && phaseT(performance.now()) > 1900 && phaseT(performance.now()) < 5000) S.camTarget = 1; else S.ripple = { x: e.clientX - r.left, y: e.clientY - r.top, t: performance.now() }; if (still() || tier() === 'low') draw(performance.now()); }); // lint:ok event-time read, not per frame
  const ro = new ResizeObserver(size); ro.observe(box);
  un.push(() => ro.disconnect(), useInView(root, (v) => { S.visible = v; run(); if (v && S.phase === 'idle' && !still()) S.t0 = performance.now(); }, 0.3), watch(() => { size(); run(); }));
  // a guess already made (the page was revisited): show the final picture
  if (root.querySelector('input[name=audit-guess]:checked')) { S.phase = 'found'; S.t0 = performance.now() - 6000; }
  size(); run();
  return () => { un.forEach((f) => f()); stopT && stopT(); unreg(); root.removeEventListener('change', onPick); root.removeEventListener('click', onAgain); box.remove(); root.removeAttribute('data-sp-hide'); };
}
