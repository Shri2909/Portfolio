/* Flames and sparks. One shared loop drives every flame (three stacked teardrops, a blue base and a soft glow, wobbling on smooth noise) and one
   shared canvas draws sparks, embers, petals and fireflies. A frame-time governor drops to a lighter tier on slow phones. Calm draws still flames. */
EK.fx = (function () {
  const flames = [];
  let wind = 0, lastX = null, breathT = -1, holding = false, last = performance.now(), slow = 0, frames = 0, running = false;
  const n1 = (t) => (Math.sin(t * 1.3) + Math.sin(t * 2.1 + 1.7) * .5 + Math.sin(t * 3.7 + .3) * .25) / 1.75;

  /* The clay diya. kind sets the silhouette (lip length, tilt) so the lamps are a family, not clones. */
  const VAR = { 1: { lip: 14, tilt: -2, mood: 'steady' }, 2: { lip: 18, tilt: 1.5, mood: 'pulse' }, 3: { lip: 12, tilt: 0, mood: 'twitch' }, 4: { lip: 14, tilt: 2, mood: 'steady' }, v: { lip: 16, tilt: -1, mood: 'steady' }, home: { lip: 14, tilt: 0, mood: 'breath' } };
  EK.diya = function (kind, opts) {
    const o = opts || {}, k = VAR[kind] || VAR[1], dashed = !!o.dashed, fx = 62 + k.lip;
    const tear = (cls) => s('path', { class: cls, d: '' });
    const outer = tear('fl-out'), mid = tear('fl-mid'), core = tear('fl-in');
    const base = s('ellipse', { class: 'fl-base', cx: 0, cy: -1, rx: 3.2, ry: 1.8 });
    const glow = s('ellipse', { class: 'glow', cx: 0, cy: -12, rx: 30, ry: 26 });
    const fg = s('g', { class: 'fgrp' }, glow, outer, mid, core, base);
    const wrap = s('g', { transform: 'translate(' + fx + ' 32)' }, fg);
    const svg = s('svg', { class: 'diya' + (dashed ? ' dashed' : ''), viewBox: '0 -28 130 104', 'aria-hidden': 'true', focusable: 'false', style: 'transform:rotate(' + k.tilt + 'deg)' },
      s('path', { class: 'clay', d: 'M12 40 C12 62 34 72 62 72 C86 72 104 62 108 50 L' + (fx + 18) + ' 44 C' + (fx + 10) + ' 46 ' + (fx + 4) + ' 46 ' + fx + ' 44 L108 40 Z' }),
      s('path', { class: 'rim', d: 'M12 40 C30 34 90 34 108 40 C90 46 30 46 12 40 Z' }),
      s('ellipse', { class: 'oil', cx: 60, cy: 40, rx: 36, ry: 4 }),
      s('rect', { class: 'wick', x: fx - 2, y: 30, width: 4, height: 12, rx: 2 }), wrap);
    const f = { svg, g: fg, outer, mid, core, base, glow, amt: 0, target: 0, kind: kind === 'home' ? 0 : kind, mood: k.mood, seed: Math.random() * 100, vis: true };
    svg._f = f; flames.push(f);
    if (kind === 'home') { f.target = 1; f.amt = 1; }
    draw(f, 0, true);
    start();
    return svg;
  };

  function teardrop(h, w, a, b, c) {
    return 'M0 0 C' + (-w).toFixed(2) + ' ' + (-h * .25).toFixed(2) + ' ' + (-w * .9 + a).toFixed(2) + ' ' + (-h * .7).toFixed(2) + ' ' + b.toFixed(2) + ' ' + (-h).toFixed(2) +
      ' C' + (w * .9 + c).toFixed(2) + ' ' + (-h * .7).toFixed(2) + ' ' + w.toFixed(2) + ' ' + (-h * .25).toFixed(2) + ' 0 0Z';
  }
  function draw(f, t, still) {
    const a = f.amt;
    f.g.style.opacity = a <= .01 ? 0 : 1;
    if (a <= .01) return;
    let sc = a, lean = 0, glowS = 1;
    if (!still) {
      const w = Math.min(1, Math.abs(wind));
      sc *= (1 - .2 * w);
      if (f.mood === 'pulse') sc *= 1 + .06 * Math.sin(t * Math.PI * 2 / 1.2);
      else if (f.mood === 'twitch') sc *= 1 + .05 * Math.max(0, n1(t * 3 + f.seed)) * 2;
      else if (f.mood === 'breath') { sc *= 1 + .03 * Math.sin(t * .9); glowS = 1.1; }
      if (breathT >= 0) { const k = Math.sin(Math.min(1, breathT / 600) * Math.PI); sc *= 1 + .14 * k; glowS *= 1 + .5 * k; }
      lean = wind * 20 * (holding ? 0 : 1);
    }
    const j = still || EK.mode.calm ? [0, 0, 0] : [n1(t * 1.1 + f.seed) * 2, n1(t * 1.7 + f.seed * 2) * 2.4, n1(t * 1.4 + f.seed * 3) * 2];
    f.outer.setAttribute('d', teardrop(26, 8, j[0], j[1], j[2]));
    f.mid.setAttribute('d', teardrop(19, 5.8, j[2] * .7, j[0] * .8, j[1] * .6));
    f.core.setAttribute('d', teardrop(11, 3.4, j[1] * .4, j[2] * .4, j[0] * .4));
    f.g.setAttribute('transform', 'rotate(' + lean.toFixed(1) + ') scale(' + sc.toFixed(3) + ')');
    f.glow.setAttribute('rx', (30 * glowS).toFixed(1)); f.glow.setAttribute('ry', (26 * glowS).toFixed(1));
    f.glow.style.opacity = Math.max(.8 * a, a > 0 ? .0 : 0);
  }

  /* ---------- particles (one canvas, pooled) ---------- */
  const CAP = { high: 220, low: 40 };
  const parts = []; let canvas, ctx, dpr = 1;
  const amb = { fire: [], petal: [] };
  function buildCanvas() {
    canvas = h('canvas', { class: 'fxcanvas', 'aria-hidden': 'true' }); document.body.appendChild(canvas);
    ctx = canvas.getContext('2d'); size();
    addEventListener('resize', size);
    const r = EK.rng(11);
    for (let i = 0; i < 7; i++) amb.fire.push({ x: r(), y: .35 + r() * .45, p: r() * 6, s: .02 + r() * .03 });
    for (let i = 0; i < 8; i++) amb.petal.push({ x: r(), y: r(), p: r() * 6, s: .012 + r() * .02 });
  }
  function size() { dpr = EK.mode.tier === 'high' ? Math.min(devicePixelRatio || 1, 1.75) : 1; canvas.width = Math.round(innerWidth * dpr); canvas.height = Math.round(innerHeight * dpr); }
  function burst(kind, x, y, o) {
    if (EK.mode.calm || !ctx) return;
    const cap = CAP[EK.mode.tier] || 40;
    const add = (n, mk) => { for (let i = 0; i < n && parts.length < cap; i++) parts.push(mk(i)); };
    const rr = Math.random;
    if (kind === 'spark') add(1, () => ({ k: 's', x, y, vx: (rr() - .5) * 30, vy: (rr() - .7) * 20, life: 350, age: 0, r: 1.6 }));
    else if (kind === 'ignite') add(10, (i) => { const a = i / 10 * 6.283; return { k: 'i', x, y, vx: Math.cos(a) * (60 + rr() * 40), vy: Math.sin(a) * (60 + rr() * 40), life: 450, age: 0, r: 2.2 }; });
    else if (kind === 'ember') add(1 + (rr() < .5 ? 1 : 0), () => ({ k: 'e', x, y, vx: (rr() - .5) * 14 + ((o && o.dir) || 0) * 10, vy: -(20 + rr() * 20), life: 2000, age: 0, r: 1.8 }));
    else if (kind === 'fizzle') add(3, () => ({ k: 'z', x, y, vx: (rr() - .5) * 24, vy: -(4 + rr() * 10), life: 700, age: 0, r: 1.8 }));
    start();
  }
  function drawParts(dt, t) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, innerWidth, innerHeight);
    if (EK.mode.calm) return;
    ctx.globalCompositeOperation = EK.mode.tier === 'high' ? 'lighter' : 'source-over';
    for (let i = parts.length - 1; i >= 0; i--) {
      const p = parts[i]; p.age += dt;
      if (p.age >= p.life) { parts.splice(i, 1); continue; }
      const k = 1 - p.age / p.life; p.x += p.vx * dt / 1000; p.y += p.vy * dt / 1000;
      ctx.globalAlpha = Math.min(.8, k);
      ctx.fillStyle = p.k === 'z' ? '#C2561A' : p.k === 'e' ? '#FFB347' : '#FFD27A';
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r * (p.k === 'e' ? 1 : .6 + k * .6), 0, 6.283); ctx.fill();
    }
    if (EK.mode.tier === 'high' && parts.length < CAP.high * .7) {
      const lit = EK.lamps.count();
      ctx.globalAlpha = .55;
      amb.fire.forEach((f) => { const x = (f.x + n1(t / 1000 * f.s * 6 + f.p) * .08) * innerWidth, y = (f.y + n1(t / 1000 * f.s * 5 + f.p * 2) * .06) * innerHeight, g = .3 + .7 * Math.max(0, Math.sin(t / 1000 * 1.1 + f.p)); ctx.fillStyle = 'rgba(255,210,122,' + (g * (.25 + lit * .2)).toFixed(2) + ')'; ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill(); });
      if (lit > 0) { ctx.globalCompositeOperation = 'source-over'; amb.petal.forEach((f) => { const y = ((f.y + t / 1000 * f.s) % 1) * innerHeight, x = (f.x + Math.sin(t / 1000 * .6 + f.p) * .04) * innerWidth; ctx.globalAlpha = .45; ctx.fillStyle = '#F5A623'; ctx.beginPath(); ctx.ellipse(x, y, 3.2, 1.8, f.p + t / 1500, 0, 6.283); ctx.fill(); }); }
    }
    ctx.globalAlpha = 1; ctx.globalCompositeOperation = 'source-over';
  }

  /* ---------- the shared loop ---------- */
  function start() { if (running) return; running = true; last = performance.now(); requestAnimationFrame(loop); }
  function loop(now) {
    if (document.hidden) { running = false; return; }
    const dt = Math.min(50, now - last); last = now;
    wind *= Math.pow(.5, dt / 700); if (Math.abs(wind) < .01) wind = 0;
    if (breathT >= 0) { breathT += dt; if (breathT > 600) breathT = -1; }
    flames.forEach((f) => {
      const d = f.target - f.amt;
      if (EK.mode.calm) f.amt = f.target; else f.amt += d * Math.min(1, dt / 220);
      if (f.vis) draw(f, now / 1000, EK.mode.calm);
    });
    if (ctx) drawParts(dt, now);
    // governor: a slow phone drops to the light tier (no additive glow, no ambient, no embers)
    frames++; slow += dt > 28 ? 1 : 0;
    if (frames === 60 && slow > 20 && EK.mode.tier === 'high') { EK.mode.tier = 'low'; document.documentElement.classList.add('q-low'); size(); }
    if (frames === 60) { frames = 0; slow = 0; }
    requestAnimationFrame(loop);
  }
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });

  /* embers rise from lit lamps now and then */
  function emberTick() {
    setTimeout(emberTick, 1000 + Math.random() * 1200);
    if (document.hidden || EK.mode.calm || EK.mode.tier !== 'high') return;
    flames.forEach((f) => { if (f.amt > .9 && Math.random() < .45) { const r = f.svg.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) burst('ember', r.left + r.width * (62 + 14) / 130, r.top + r.height * .25, { dir: wind }); } });
  }

  function init() {
    buildCanvas();
    EK.bus.on('fx:burst', (d) => burst(d.kind, d.x, d.y, d));
    addEventListener('pointermove', (e) => { if (lastX !== null && !EK.mode.calm) { wind = Math.max(-1, Math.min(1, wind + (e.clientX - lastX) * .012)); } lastX = e.clientX; }, { passive: true });
    addEventListener('pointerleave', () => { lastX = null; });
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((es) => es.forEach((e) => { e.target._f && (e.target._f.vis = e.isIntersecting); }));
      flames.forEach((f) => io.observe(f.svg));
    }
    setTimeout(emberTick, 2000);
    start();
  }
  return {
    init, burst,
    breath() { if (!EK.mode.calm) breathT = 0; },
    setHolding(v) { holding = v; },
    set(svg, target) { if (svg && svg._f) { svg._f.target = target; if (EK.mode.calm) svg._f.amt = target; start(); } },
    wick(svg) { const r = svg.getBoundingClientRect(), vb = svg.viewBox.baseVal; const f = VAR[svg._f && svg._f.kind || 1] || VAR[1]; const lip = svg._f && svg._f.kind === 0 ? 14 : (VAR[svg._f.kind] || VAR[1]).lip; return { x: r.left + r.width * (62 + lip) / vb.width, y: r.top + r.height * (32 - vb.y) / vb.height, w: r.width }; },
  };
})();
