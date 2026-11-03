// Injected with page.addInitScript by scripts/motion-qa.mjs only. Never shipped, never stores, never sends.
(() => {
  const P = (window.__mq = { dt: [], long: [], cls: 0, inp: 0, acts: [], anims: 0, errs: [] });
  const po = (type, fn, o = {}) => { try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...o }); } catch {} };
  po('long-animation-frame', (e) => P.long.push(Math.round(e.duration)));
  po('layout-shift', (e) => { if (!e.hadRecentInput) P.cls += e.value; });
  po('event', (e) => { P.inp = Math.max(P.inp, e.duration); }, { durationThreshold: 40 });
  let last = performance.now();
  const loop = (t) => { P.dt.push(t - last); last = t; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  setInterval(() => { P.anims = Math.max(P.anims, document.getAnimations().length); }, 250);
  window.addEventListener('stage:act', (e) => P.acts.push({ id: e.detail.id, jump: e.detail.jump }));
  window.addEventListener('error', (e) => P.errs.push(String(e.message)));
})();
