/* The night scene, drawn in code: sky (gradients, stars, hairline moon, clouds, one shooting star), a three-layer Indian apartment skyline where every
   window is a home, the terrace (parapet, rangoli that draws itself, toran, string lights, star lanterns, cat), dusk-gold and the visitor's window.
   Everything is decorative (aria-hidden) and reads its state from the lamps through the event bus. */
EK.scene = (function () {
  const rnd = EK.rng(2026);
  const R = (a, b) => a + (b - a) * rnd();
  const TONES = { ember: [0, 0.25, 0.5, 0.75, 1, 1, 1], gold: [0, 0, 0, 0, 0, 1, 1], gold2: [0, 0, 0, 0, 0, 0, 1], stars: [1, 1, .95, .9, .8, .4, .3], veil: [.55, .52, .48, .44, .4, .26, .22] };
  const COUNTS = [5, 14, 23, 32, 41, 56, 64];
  const toneOfLit = (n) => [0, 2, 4, 5][Math.min(3, n)];
  let T = 0, tweenId = 0, stage, wins = [], pool = [], pools = [], rangoli = [], lanterns = [], visitorWin = null, cat = null, ringed = false, birded = false, shot = false;
  const root = document.documentElement;

  const lerpTab = (tab, t) => { const i = Math.min(5, Math.floor(t)), f = t - i; return tab[i] + (tab[i + 1] - tab[i]) * f; };
  function applyTone(t) {
    T = t;
    const st = root.style;
    st.setProperty('--o-ember', lerpTab(TONES.ember, t).toFixed(3));
    st.setProperty('--o-gold', lerpTab(TONES.gold, t).toFixed(3));
    st.setProperty('--o-gold2', lerpTab(TONES.gold2, t).toFixed(3));
    st.setProperty('--stars', lerpTab(TONES.stars, t).toFixed(3));
    st.setProperty('--veil', lerpTab(TONES.veil, t).toFixed(3));
    st.setProperty('--warm', Math.max(0, Math.min(.25, (t - 3) * .125)).toFixed(3));
  }
  function setTone(target, ms, delay) {
    const id = ++tweenId, from = T;
    const go = () => {
      if (id !== tweenId) return;
      if (EK.mode.calm || !ms) { applyTone(target); return; }
      const t0 = performance.now();
      (function step(now) {
        if (id !== tweenId) return;
        const k = easeInOut((now - t0) / ms);
        applyTone(from + (target - from) * k);
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    };
    if (delay && !EK.mode.calm) setTimeout(go, delay); else go();
  }

  /* ---------- sky ---------- */
  function buildSky() {
    const sky = h('div', { class: 'sk' }, h('i', { class: 'sk-night' }), h('i', { class: 'sk-ember' }), h('i', { class: 'sk-gold' }), h('i', { class: 'sk-gold2' }));
    const W = 1000, H = 1000;
    let path = '';
    const n = 120;
    for (let i = 0; i < n; i++) { const y = Math.pow(rnd(), 1.6) * H * .6, x = rnd() * W, r = R(.6, 1.6) / 2.2; path += 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'h' + (r * 2).toFixed(1) + 'v' + (r * 2).toFixed(1) + 'h-' + (r * 2).toFixed(1) + 'z'; }
    const tw = [];
    for (let i = 0; i < 14; i++) tw.push(s('circle', { class: 'tw', cx: (rnd() * W).toFixed(0), cy: (rnd() * H * .45).toFixed(0), r: R(.8, 1.5).toFixed(1), style: 'animation-duration:' + R(2.5, 6).toFixed(1) + 's;animation-delay:-' + R(0, 6).toFixed(1) + 's' }));
    const stars = s('svg', { class: 'sk-stars', viewBox: '0 0 ' + W + ' ' + H, preserveAspectRatio: 'xMidYMin slice', focusable: 'false' }, s('path', { d: path, fill: '#FFF3DC', opacity: '.85' }), tw);
    const moon = s('svg', { class: 'sk-moon', viewBox: '-90 -90 180 180', focusable: 'false' },
      s('defs', null, s('radialGradient', { id: 'ek-halo' }, s('stop', { offset: '0', 'stop-color': '#FFF3DC', 'stop-opacity': '.07' }), s('stop', { offset: '1', 'stop-color': '#FFF3DC', 'stop-opacity': '0' })),
        s('mask', { id: 'ek-crescent' }, s('rect', { x: -90, y: -90, width: 180, height: 180, fill: '#fff' }), s('circle', { cx: 17, cy: -2, r: 19, fill: '#000' }))),
      s('circle', { r: 90, fill: 'url(#ek-halo)' }), s('circle', { r: 20, fill: '#FFF3DC', opacity: '.9', mask: 'url(#ek-crescent)' }));
    const clouds = [90, 120, 140].map((d, i) => h('i', { class: 'cloud c' + i, style: 'animation-duration:' + d + 's;animation-delay:-' + (i * 37) + 's;top:' + (10 + i * 11) + '%' }));
    sky.append(stars, moon, ...clouds, h('i', { class: 'shoot' }));
    return sky;
  }

  /* ---------- skyline ---------- */
  function addWindow(layer, svg, x, y, w, hh, tv) {
    const halo = s('rect', { class: 'wh', x: x - 1.5, y: y - 1.5, width: w + 3, height: hh + 3, rx: 1 });
    const r = s('rect', { class: 'win' + (tv ? ' tv' : ''), x, y, width: w, height: hh });
    const g = s('g', { class: 'w' }, halo, r);
    if (tv) g.style.setProperty('--d', R(2, 5).toFixed(1) + 's');
    svg.appendChild(g);
    const o = { el: g, layer, x, y, w, h: hh, on: false, tv: !!tv };
    const k = rnd(); o.col = k < .70 ? 'a' : k < .90 ? 'b' : k < .96 ? 'c' : 'd';
    g.setAttribute('data-c', tv ? 'd' : o.col);
    return o;
  }
  function buildSkyline() {
    const box = h('div', { class: 'skyline' });
    const mk = (cls) => { const svg = s('svg', { class: 'layer ' + cls, viewBox: '0 0 1200 500', preserveAspectRatio: 'xMidYMax slice', focusable: 'false' }); box.appendChild(svg); return svg; };
    const far = mk('far'), mid = mk('mid'), near = mk('near');
    // FAR: 13 blocks
    let x = -10; const farBlocks = [];
    for (let i = 0; i < 13; i++) { const w = R(80, 105), hh = R(150, 270); far.appendChild(s('rect', { class: 'bl far-fill', x, y: 500 - hh, width: w, height: hh })); farBlocks.push({ x, w, hh }); x += w + 2; }
    for (let i = 0; i < 16; i++) { const b = farBlocks[i % 13]; wins.push(addWindow('far', far, b.x + R(8, b.w - 12), 500 - b.hh + R(14, b.hh - 24), 3, 4)); }
    // MID: 8 blocks + rooftop kit
    x = 10; const midBlocks = [];
    for (let i = 0; i < 8; i++) { const w = R(130, 160), hh = R(190, 330); mid.appendChild(s('rect', { class: 'bl mid-fill', x, y: 500 - hh, width: w, height: hh })); midBlocks.push({ x, w, hh, top: 500 - hh }); x += w + R(8, 20); }
    for (let i = 0; i < 24; i++) { const b = midBlocks[i % 8]; wins.push(addWindow('mid', mid, b.x + 10 + ((i % 3) * (b.w - 30) / 2.4), b.top + 20 + Math.floor(i / 8) * R(36, 48) + R(0, 14), 6, 8, i === 5 || i === 17)); }
    const kit = s('g', { class: 'kit' });
    [0, 3, 6].forEach((bi) => { const b = midBlocks[bi], tx = b.x + b.w * .3; kit.append(s('rect', { class: 'tank', x: tx, y: b.top - 32, width: 26, height: 32 }), s('ellipse', { class: 'tank', cx: tx + 13, cy: b.top - 32, rx: 13, ry: 5 }), s('path', { class: 'ln', d: 'M' + (tx + 3) + ' ' + b.top + 'v-3 M' + (tx + 13) + ' ' + b.top + 'v-3 M' + (tx + 23) + ' ' + b.top + 'v-3' })); });
    [1, 2, 4, 7].forEach((bi) => { const b = midBlocks[bi], ax = b.x + b.w * .7; kit.append(s('path', { class: 'ln', d: 'M' + ax + ' ' + b.top + 'v-30 M' + (ax - 7) + ' ' + (b.top - 24) + 'h14 M' + (ax - 5) + ' ' + (b.top - 18) + 'h10 M' + (ax - 4) + ' ' + (b.top - 12) + 'h8' })); });
    const bd = midBlocks[5]; kit.append(s('path', { class: 'ln', d: 'M' + (bd.x + 30) + ' ' + bd.top + 'v-8' }), s('ellipse', { class: 'tank', cx: bd.x + 30, cy: bd.top - 12, rx: 7, ry: 5, transform: 'rotate(-25 ' + (bd.x + 30) + ' ' + (bd.top - 12) + ')' }));
    [midBlocks[2], midBlocks[6]].forEach((b) => kit.append(s('rect', { class: 'tank', x: b.x + b.w * .45, y: b.top - 16, width: 22, height: 16 })));
    const cb = midBlocks[4]; kit.append(s('path', { class: 'ln', d: 'M' + (cb.x + 12) + ' ' + (cb.top - 20) + ' Q' + (cb.x + 47) + ' ' + (cb.top - 12) + ' ' + (cb.x + 82) + ' ' + (cb.top - 20) + ' M' + (cb.x + 12) + ' ' + cb.top + 'v-20 M' + (cb.x + 82) + ' ' + cb.top + 'v-20' }), s('path', { class: 'cloth', d: 'M' + (cb.x + 28) + ' ' + (cb.top - 16) + 'h8v14h-8z M' + (cb.x + 46) + ' ' + (cb.top - 15) + 'h8v18h-8z M' + (cb.x + 62) + ' ' + (cb.top - 16) + 'h8v12h-8z' }));
    mid.appendChild(kit);
    // NEAR: 4 blocks + balconies, units, solar heater, ceiling fan
    x = 40; const nearBlocks = [];
    for (let i = 0; i < 4; i++) { const w = R(250, 290), hh = R(260, 420); near.appendChild(s('rect', { class: 'bl near-fill', x, y: 500 - hh, width: w, height: hh })); nearBlocks.push({ x, w, hh, top: 500 - hh }); x += w + R(30, 60); }
    nearBlocks.forEach((b, bi) => {
      for (let f = 0; f < 3; f++) {
        const ry = b.top + 60 + f * 90;
        let d = 'M' + (b.x + 14) + ' ' + ry + 'h' + (b.w - 28);
        for (let vx = b.x + 14; vx <= b.x + b.w - 14; vx += 6) d += 'M' + vx + ' ' + ry + 'v12';
        near.appendChild(s('path', { class: 'rail', d }));
      }
      if (bi % 2 === 0) near.appendChild(s('rect', { class: 'unit', x: b.x + b.w - 40, y: b.top + 106, width: 14, height: 10 }));
    });
    const sb = nearBlocks[1]; near.append(s('path', { class: 'solar', d: 'M' + (sb.x + 40) + ' ' + sb.top + 'l34 -18 l6 10 l-34 18z' }), s('rect', { class: 'tank', x: sb.x + 82, y: sb.top - 16, width: 18, height: 14, rx: 3 }));
    for (let i = 0; i < 24; i++) { const b = nearBlocks[i % 4], col = Math.floor(i / 4) % 3, row = Math.floor(i / 12); wins.push(addWindow('near', near, b.x + 30 + col * (b.w - 90) / 2, b.top + 24 + row * 90 + R(0, 6), 10, 13, i === 9)); }
    // ceiling fan in one near window (visible from tone 2)
    const fw = wins.filter((w) => w.layer === 'near')[7];
    const fan = s('g', { transform: 'translate(' + (fw.x + 5) + ' ' + (fw.y + 6) + ')' }, s('g', { class: 'fan' }, [0, 120, 240].map((a) => s('ellipse', { cx: 0, cy: 0, rx: 4.5, ry: 1, transform: 'rotate(' + a + ') translate(3 0)' }))));
    near.appendChild(fan); fw.fan = fan;
    visitorWin = addWindow('near', near, nearBlocks[2].x + nearBlocks[2].w - 48, nearBlocks[2].top + 24, 10, 13); visitorWin.el.classList.add('visitor-win');
    wins.pop();
    // pre-shuffle (seed 2026); the first 5 are fixed, spread across all layers
    const fixed = []; ['far', 'mid', 'near', 'mid', 'near'].forEach((ly) => { const c = wins.find((w) => w.layer === ly && fixed.indexOf(w) < 0 && !w.tv); if (c) fixed.push(c); });
    pool = wins.filter((w) => fixed.indexOf(w) < 0).map((w) => [rnd(), w]).sort((a, b) => a[0] - b[0]).map((p) => p[1]);
    fixed.forEach((w) => lightWin(w, true));
    return box;
  }
  function lightWin(w, now) { if (w.on) return; w.on = true; if (now || EK.mode.calm) w.el.classList.add('on', 'now'); else w.el.classList.add('on'); }
  function lightMore(k, lampX) {
    const centre = (w) => { const r = w.el.getBoundingClientRect(); return r.left + r.width / 2; };
    const take = pool.slice().sort((a, b) => Math.abs(centre(a) - lampX) - Math.abs(centre(b) - lampX)).slice(0, k);
    take.forEach((w, i) => { pool.splice(pool.indexOf(w), 1); if (EK.mode.calm) lightWin(w, true); else setTimeout(() => lightWin(w), i * 90); });
  }

  /* ---------- terrace: rangoli ---------- */
  const polar = (r, deg) => [r * Math.cos(deg * Math.PI / 180), r * Math.sin(deg * Math.PI / 180)];
  const f1 = (n) => n.toFixed(2);
  function rangoliPaths() {
    const L = [[], [], [], [], []];
    L[0].push({ d: 'M-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0', fill: 1 }, { d: 'M-20 0a20 20 0 1 0 40 0a20 20 0 1 0 -40 0' });
    for (let k = 0; k < 8; k++) { const [x, y] = polar(34, k * 45); L[0].push({ d: 'M' + f1(x - 2.2) + ' ' + f1(y) + 'a2.2 2.2 0 1 0 4.4 0a2.2 2.2 0 1 0 -4.4 0', fill: 1 }); }
    const petal = 'M0,-22 C14,-36 14,-60 0,-72 C-14,-60 -14,-36 0,-22 Z', small = 'M0,-30 C7,-37 7,-46 0,-52 C-7,-46 -7,-37 0,-30 Z';
    for (let k = 0; k < 8; k++) { L[1].push({ d: petal, rot: k * 45, role: 'petal' }); L[1].push({ d: small, rot: 22.5 + k * 45, role: 'small' }); }
    for (let k = 0; k < 16; k++) { const [x1, y1] = polar(80, k * 22.5), [x2, y2] = polar(80, (k + 1) * 22.5); L[2].push({ d: 'M' + f1(x1) + ' ' + f1(y1) + 'A16 16 0 0 1 ' + f1(x2) + ' ' + f1(y2), role: 'scallop' }); }
    L[3].push({ d: 'M-70 -70H70V70H-70Z', role: 'star' }, { d: 'M-70 -70H70V70H-70Z', rot: 45, role: 'star' }, { d: 'M-106 0a106 106 0 1 0 212 0a106 106 0 1 0 -212 0' });
    const arc = (r) => { const [x1, y1] = polar(r, 60), [x2, y2] = polar(r, 30 + 360); return 'M' + f1(x1) + ' ' + f1(y1) + 'A' + r + ' ' + r + ' 0 1 1 ' + f1(polar(r, 30)[0]) + ' ' + f1(polar(r, 30)[1]); };
    L[4].push({ d: arc(126) }, { d: arc(132) });
    for (let k = 0; k < 24; k++) { const a = k * 15; if (a >= 30 && a <= 60) continue; const [x, y] = polar(129, a); L[4].push({ d: 'M' + f1(x) + ' ' + f1(y - 3) + 'l2.2 3l-2.2 3l-2.2 -3z', fill: 1 }); }
    return L;
  }
  function buildRangoli() {
    const svg = s('svg', { class: 'rangoli deco', viewBox: '-150 -150 300 300', focusable: 'false' });
    const layers = rangoliPaths();
    layers.forEach((paths, li) => {
      const g = s('g', { class: 'rl rl' + (li + 1) }); const els = [];
      paths.forEach((p) => {
        const mk = (cls, w, op) => { const e = s('path', { class: cls, d: p.d, pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, 'stroke-width': w, transform: p.rot ? 'rotate(' + p.rot + ')' : null }); if (p.role) e.setAttribute('data-role', p.role); if (p.fill) e.setAttribute('data-fill', '1'); return e; };
        const under = mk('under', 6), line = mk('line', 1.4); g.append(under, line); els.push(under, line);
      });
      svg.appendChild(g); rangoli.push({ g, els, p: 0 });
    });
    // the one arc that stays dotted, a quiet nod to the lamp that has not been run
    const [x1, y1] = polar(129, 30), [x2, y2] = polar(129, 60);
    svg.appendChild(s('path', { class: 'dotted', d: 'M' + f1(x1) + ' ' + f1(y1) + 'A129 129 0 0 1 ' + f1(x2) + ' ' + f1(y2) }));
    return svg;
  }
  function drawLayer(i, p) { const L = rangoli[i]; if (!L) return; L.p = p; L.els.forEach((e, k) => { const stag = EK.mode.tier === 'high' ? (k % 12) * .004 : 0; const v = clamp01((p - stag) / (1 - stag || 1)); e.setAttribute('stroke-dashoffset', (1 - v).toFixed(3)); if (e.getAttribute('data-fill')) e.style.fillOpacity = (v >= 1 ? .8 : 0); }); }
  const LAYERS_OF = { 1: [0, 1], 2: [2, 3], 3: [4] };
  /* progress 0..1 of lamp n's rangoli layers (hold progress or the lighting tween) */
  function rangoliProgress(n, p) { const ls = LAYERS_OF[n] || []; ls.forEach((li, k) => drawLayer(li, clamp01(p * ls.length - k))); }
  function animateRangoli(n, ms) {
    if (EK.mode.calm) { rangoliProgress(n, 1); return; }
    const t0 = performance.now(); (function step(now) { const k = easeOut((now - t0) / ms); rangoliProgress(n, k); if (k < 1) requestAnimationFrame(step); })(t0);
  }

  /* ---------- terrace: toran, string lights, lanterns, cat, floor pools ---------- */
  function buildToran() {
    const W = 360, svg = s('svg', { class: 'toran deco', viewBox: '0 0 360 96', preserveAspectRatio: 'xMidYMin slice', focusable: 'false' });
    svg.appendChild(s('path', { class: 'rope', d: 'M-4 8 Q180 44 364 8', fill: 'none' }));
    const N = 11;
    for (let i = 0; i < N; i++) {
      const t = (i + .5) / N, x = -4 + 368 * t, y = (1 - t) * (1 - t) * 8 + 2 * (1 - t) * t * 44 + t * t * 8, len = i % 2 ? 58 : 38;
      const g = s('g', { class: 'strand' + (i >= 7 ? ' extra' : ''), style: 'transform-origin:' + x.toFixed(0) + 'px ' + y.toFixed(0) + 'px;animation-duration:' + R(5, 7).toFixed(1) + 's;animation-delay:-' + R(0, 6).toFixed(1) + 's', 'data-i': i });
      g.appendChild(s('path', { class: 'thread', d: 'M' + x.toFixed(1) + ' ' + y.toFixed(1) + 'v' + len }));
      for (let f = 0; f < 3; f++) { const cy = y + 6 + f * ((len - 14) / 2); g.append(s('circle', { class: 'fl', cx: x.toFixed(1), cy: cy.toFixed(1), r: 7 }), s('circle', { class: 'fl2', cx: x.toFixed(1), cy: cy.toFixed(1), r: 3 })); }
      g.appendChild(s('path', { class: 'leaf', d: 'M' + x.toFixed(1) + ' ' + (y + len - 2).toFixed(1) + 'c-6 4 -7 12 0 18 c7 -6 6 -14 0 -18z' }));
      svg.appendChild(g);
    }
    return svg;
  }
  function buildStringLights() {
    const svg = s('svg', { class: 'strlights deco', viewBox: '0 0 360 40', preserveAspectRatio: 'xMidYMid slice', focusable: 'false', 'data-mode': 'steady' });
    svg.appendChild(s('path', { class: 'wire', d: 'M-4 6 Q180 34 364 6', fill: 'none' }));
    const cols = ['#FFD27A', '#FFB347', '#F5A623', '#FFF3DC', '#8FD3A8'];
    for (let i = 0; i < 18; i++) { const t = (i + .5) / 18, x = -4 + 368 * t, y = (1 - t) * (1 - t) * 6 + 2 * (1 - t) * t * 34 + t * t * 6; svg.appendChild(s('circle', { class: 'bulb', cx: x.toFixed(1), cy: (y + 5).toFixed(1), r: 3.6, fill: cols[(i * 7) % 5], style: '--i:' + i + ';--g:' + (i % 3) + ';--r:' + R(0, 2).toFixed(2) + 's' })); }
    return svg;
  }
  function buildLantern(size, color, len, cls) {
    const pts = (r, a0) => Array.from({ length: 16 }, (_, k) => { const a = (k * 22.5 + a0) * Math.PI / 180, rr = k % 2 ? 11 : r; return (24 + rr * Math.cos(a)).toFixed(1) + ',' + (24 + rr * Math.sin(a)).toFixed(1); }).join(' ');
    const facets = Array.from({ length: 16 }, (_, k) => { const a1 = k * 22.5 * Math.PI / 180, a2 = (k + 1) * 22.5 * Math.PI / 180, ro = k % 2 ? 11 : 24; return s('path', { d: 'M24 24L' + (24 + ro * Math.cos(a1)).toFixed(1) + ' ' + (24 + ro * Math.sin(a1)).toFixed(1) + 'L' + (24 + (k % 2 ? 24 : 11) * Math.cos(a2)).toFixed(1) + ' ' + (24 + (k % 2 ? 24 : 11) * Math.sin(a2)).toFixed(1) + 'Z', fill: color, opacity: k % 2 ? .95 : .7 }); });
    const svg = s('svg', { viewBox: '0 0 48 ' + (60 + len), focusable: 'false', width: size, height: size * (60 + len) / 48, 'aria-hidden': 'true' },
      s('path', { class: 'ln', d: 'M24 0v' + len, transform: '' }),
      s('g', { transform: 'translate(0 ' + len + ')' }, s('circle', { class: 'lglow', cx: 24, cy: 24, r: 26, fill: 'url(#ek-lant)' }), facets, s('path', { class: 'tas', d: 'M16 45v14M24 47v14M32 45v14' })));
    return svg;
  }
  function buildLanterns() {
    const defs = [{ size: 48, color: '#E9B866', len: 28, pos: 'l1' }, { size: 36, color: '#C2410C', len: 20, pos: 'l2' }, { size: 30, color: '#2F6B4F', len: 36, pos: 'l3' }];
    return defs.map((d, i) => {
      const b = h('button', { type: 'button', class: 'lantern deco ' + d.pos, 'aria-label': 'Star lantern: tap to make it swing', onclick: () => { b.classList.remove('swing'); void b.offsetWidth; if (!EK.mode.calm) b.classList.add('swing'); } }, buildLantern(d.size, d.color, d.len));
      lanterns.push(b); return b;
    });
  }
  function buildCat() {
    const b = h('button', { type: 'button', class: 'cat deco', 'aria-label': 'Cat on the parapet: tap to flick its tail', onclick: () => { b.classList.remove('flick'); void b.offsetWidth; if (!EK.mode.calm) b.classList.add('flick'); } },
      s('svg', { viewBox: '0 0 60 56', width: 54, height: 50, focusable: 'false', 'aria-hidden': 'true' },
        s('path', { class: 'tail', d: 'M42 50 C58 50 58 30 50 26' }),
        s('path', { class: 'body', d: 'M12 52 C8 36 16 24 24 22 L22 10 L28 16 L36 16 L40 10 L40 22 C46 28 48 44 44 52 Z' }),
        s('circle', { class: 'eye', cx: 28, cy: 22, r: 1.6 }), s('circle', { class: 'eye', cx: 36, cy: 22, r: 1.6 })));
    cat = b; return b;
  }
  function buildFloor() {
    const fl = h('div', { class: 'floor' }, h('div', { class: 'parapet' }, h('i', { class: 'cap c1' }), h('i', { class: 'cap c2' }), h('i', { class: 'cap c3' })), h('div', { class: 'tfloor' }, buildRangoli(),
      h('svg', { class: 'inkline', viewBox: '0 0 100 4', preserveAspectRatio: 'none', 'aria-hidden': 'true' })));
    for (let i = 0; i < 3; i++) { const p = h('i', { class: 'pool deco' }); pools.push(p); fl.appendChild(p); }
    const il = fl.querySelector('.inkline'); il.innerHTML = '<line x1="0" y1="2" x2="100" y2="2" pathLength="1" stroke-dasharray="1" stroke-dashoffset="1"/>';
    return fl;
  }

  /* ---------- the big moments ---------- */
  function ring(x, y) {
    if (EK.mode.calm || EK.mode.tier === 'low') return;
    const r = h('i', { class: 'ring', style: 'left:' + x + 'px;top:' + y + 'px' }); stage.appendChild(r); setTimeout(() => r.remove(), 1800);
  }
  function birds() {
    if (birded || EK.mode.calm || EK.mode.tier === 'low') return; birded = true;
    const wrap = h('div', { class: 'birds' });
    for (let i = 0; i < 9; i++) wrap.appendChild(h('i', { style: 'left:' + (-12 - i * 5 - R(0, 6)).toFixed(0) + 'px;top:' + (R(0, 12)).toFixed(0) + '%;animation-delay:' + (i * .12).toFixed(2) + 's', html: null }, s('svg', { viewBox: '0 0 20 10', width: 18, height: 9, focusable: 'false' }, s('path', { class: 'bird', d: 'M0 2 Q5 0 10 6 Q15 0 20 2 Q15 4 10 10 Q5 4 0 2Z' }))));
    stage.appendChild(wrap); setTimeout(() => wrap.remove(), 9000);
  }
  function shoot() { if (shot || EK.mode.calm) return; shot = true; const e = stage.querySelector('.shoot'); if (e) { e.classList.add('go'); } }
  function lampX(n) { const el = document.getElementById('lampbtn-' + n); if (!el) return innerWidth / 2; const r = el.getBoundingClientRect(); return r.left + r.width / 2; }

  function onLit(d) {
    const n = d.n, c = EK.lamps.count(), x = d.x || lampX(n);
    animateRangoli(n, 1400);
    lanterns[Math.min(2, n - 1)] && lanterns[n - 1].classList.add('lit');
    pools[n - 1] && (pools[n - 1].style.left = x + 'px', pools[n - 1].classList.add('on'));
    if (n === 3) { shoot(); if (cat) cat.classList.add('eyes'); }
    if (c < 3) { setTone(toneOfLit(c), 1200); lightMore(9, x); }
    else {
      lightMore(9, x);
      setTimeout(() => { EK.bus.emit('diya:allLit', { x, y: d.y }); }, EK.mode.calm ? 0 : 500);
    }
  }
  function onAllLit(d) {
    setTone(5, 1500, 700);
    setTimeout(() => lightMore(15, d.x || innerWidth / 2), EK.mode.calm ? 0 : 800);
    if (!ringed) { ringed = true; ring(d.x || innerWidth / 2, d.y || innerHeight * .7); setTimeout(birds, 2000); }
    document.documentElement.classList.add('dusk');
  }
  function onVisitor() { setTone(6, 1600); lightWin(visitorWin, EK.mode.calm); visitorWin.el.classList.add('bright'); rangoli.forEach((L) => L.g.classList.add('colour')); lanterns.forEach((l) => l.classList.add('lit')); }

  function parallax() {
    if (!window.matchMedia || !matchMedia('(pointer: fine)').matches) return;
    let tx = 0, cx = 0, raf = 0;
    addEventListener('pointermove', (e) => { tx = (e.clientX / innerWidth - .5) * 2; if (!raf && !EK.mode.calm) raf = requestAnimationFrame(loop); }, { passive: true });
    function loop() { cx += (tx - cx) * .08; stage.style.setProperty('--px', (cx * 10).toFixed(2) + 'px'); raf = Math.abs(tx - cx) > .002 && !EK.mode.calm ? requestAnimationFrame(loop) : 0; }
  }

  function build() {
    const defs = s('svg', { class: 'defs', width: 0, height: 0, 'aria-hidden': 'true', focusable: 'false' }, s('defs', null,
      s('radialGradient', { id: 'ek-glow' }, s('stop', { offset: '0', 'stop-color': '#FFB347', 'stop-opacity': '.75' }), s('stop', { offset: '.5', 'stop-color': '#FF7A1A', 'stop-opacity': '.25' }), s('stop', { offset: '1', 'stop-color': '#FF7A1A', 'stop-opacity': '0' })),
      s('radialGradient', { id: 'ek-lant' }, s('stop', { offset: '0', 'stop-color': '#FFD27A', 'stop-opacity': '.9' }), s('stop', { offset: '1', 'stop-color': '#FF7A1A', 'stop-opacity': '0' }))));
    stage = h('div', { class: 'stage', 'aria-hidden': 'true' }, defs, buildSky(), buildSkyline(), buildFloor(), buildToran(), buildStringLights());
    document.body.insertBefore(stage, document.body.firstChild);
    const ui = h('div', { class: 'stage-ui' }, buildLanterns(), buildCat(), h('button', { type: 'button', class: 'ctl deco', 'aria-label': 'String lights: change the pattern', onclick: cycle }, h('i', { class: 'ctl-dot' })), h('p', { class: 'sr-only', id: 'lights-live', role: 'status', 'aria-live': 'polite' }));
    document.body.appendChild(ui);
    EK.bus.on('diya:lit', onLit); EK.bus.on('diya:allLit', onAllLit); EK.bus.on('diya:visitorLit', onVisitor);
    EK.bus.on('diya:lighting', (d) => rangoliProgress(d.n, d.p * (EK.lamps.isLit(d.n) ? 0 : 1)));
    parallax();
    setInterval(() => { if (cat && !document.hidden && !EK.mode.calm) { cat.classList.remove('flick'); void cat.offsetWidth; cat.classList.add('flick'); } }, 9000);
    setInterval(() => { if (document.hidden || EK.mode.calm) return; stage.querySelectorAll('.strand').forEach((g, i) => { g.classList.remove('gust'); setTimeout(() => g.classList.add('gust'), i * 140); setTimeout(() => g.classList.remove('gust'), 2400 + i * 140); }); }, 12000);
    applyTone(0);
  }
  function cycle() {
    const modes = ['steady', 'chase', 'twinkle', 'fade'], el = stage.querySelector('.strlights');
    const next = modes[(modes.indexOf(el.getAttribute('data-mode')) + 1) % 4];
    el.setAttribute('data-mode', next); document.getElementById('lights-live').textContent = 'String lights: ' + next + '.';
  }
  return { build, setTone, applyTone, currentTone: () => T, rangoliProgress, toneOfLit, lampX, inkLine(c) { const l = stage && stage.querySelector('.inkline line'); if (l) l.setAttribute('stroke-dashoffset', (1 - c / 3).toFixed(2)); } };
})();
