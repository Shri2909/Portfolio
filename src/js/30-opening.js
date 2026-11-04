/* The opening: the night scene behind, one flame already lit, and a row of lamps. Lamp 1 lights from the home flame, lamp 2 from lamp 1, and so on.
   Lighting: HOLD (a pressure ring fills around the wick, the flame travels along an arc as you hold), TAP (the whole path in about 450 ms),
   or Enter / Space / assistive click. Holding is never required. Calm lights instantly. Lamp 4 is proposed, not run: it tries, flickers and never lights. */
EK.defineSection('opening', (d) => {
  const x = d.opening, ui = d.ui || {};
  if (!x || !has(x.headline)) return null;
  const head = x.headline.split(/(324|19)/).map((p) => p === '324' ? h('span', { class: 'n324', text: p }) : p === '19' ? h('span', { class: 'n19', text: p }) : p);
  const status = h('p', { class: 'row-status', id: 'row-status' });
  const live = h('p', { class: 'sr-only', id: 'row-live', role: 'status', 'aria-live': 'polite' });
  const lamps = [1, 2, 3].map((n) => d['lamp' + n]).filter(Boolean);
  const home = EK.diya('home');
  const svgs = {};
  let stat = '', statTimer = 0, active = null, hintTimer = 0;

  /* ---------- overlay: the travelling flame, the pressure ring, the line above the lamp ---------- */
  const trav = s('svg', { class: 'trav', viewBox: '-10 -22 20 30', width: 22, height: 32, 'aria-hidden': 'true', focusable: 'false' }, s('path', { class: 'fl-out', d: 'M0 4 C5 -2 6 -10 0 -18 C-6 -10 -5 -2 0 4Z' }), s('path', { class: 'fl-in', d: 'M0 4 C2 0 2 -5 0 -10 C-2 -5 -2 0 0 4Z' }));
  const ringEl = s('svg', { class: 'pring', viewBox: '-30 -30 60 60', width: 60, height: 60, 'aria-hidden': 'true', focusable: 'false' }, s('circle', { r: 26, class: 'pr-bg' }), s('circle', { r: 26, class: 'pr-fg', pathLength: 1, 'stroke-dasharray': 1, 'stroke-dashoffset': 1, transform: 'rotate(-90)' }));
  const holdText = h('p', { class: 'hold-text', text: ui.holdWarm });
  const over = h('div', { class: 'fx-over', 'aria-hidden': 'true', hidden: true }, trav, ringEl, holdText);
  const show = (v) => { over.hidden = !v; };

  const wickOf = (n) => EK.fx.wick(n === 0 ? home : svgs[n]);
  const vib = (ms, kb) => { if (!EK.mode.calm && !kb && navigator.vibrate) { try { navigator.vibrate(ms); } catch (e) { /* none */ } } };
  function setStatus(t, hold) {
    clearTimeout(statTimer); status.textContent = t || '';
    if (!hold) statTimer = setTimeout(progress, 4000);
  }
  function progress() { const c = EK.lamps.count(); status.textContent = c === 3 ? (ui.progressDone || '') : (ui.progress || '').replace('{n}', c).replace('{r}', 3 - c); }

  /* a quadratic arc that bows upward, worked out from where the two wicks really are on screen */
  function pathFor(n) {
    const a = wickOf(n - 1), b = wickOf(n);
    const dist = Math.hypot(b.x - a.x, b.y - a.y), cx = (a.x + b.x) / 2, cy = (a.y + b.y) / 2 - Math.max(40, dist * .35);
    return { a, b, cx, cy };
  }
  const at = (P, t) => ({ x: (1 - t) * (1 - t) * P.a.x + 2 * (1 - t) * t * P.cx + t * t * P.b.x, y: (1 - t) * (1 - t) * P.a.y + 2 * (1 - t) * t * P.cy + t * t * P.b.y });
  function place(P, n, p) {
    const q = at(P, easeInOut(p)), sc = .5 + .5 * p;
    trav.style.transform = 'translate(' + (q.x - 11) + 'px,' + (q.y - 28) + 'px) scale(' + sc.toFixed(2) + ')';
    ringEl.style.transform = 'translate(' + (P.b.x - 30) + 'px,' + (P.b.y - 30) + 'px)';
    ringEl.querySelector('.pr-fg').setAttribute('stroke-dashoffset', (1 - p).toFixed(3));
    holdText.style.transform = 'translate(' + (P.b.x - 90) + 'px,' + (P.b.y - 96) + 'px)';
    return q;
  }

  /* ---------- lighting ---------- */
  function ignite(n, kb) {
    if (EK.lamps.isLit(n)) return;
    const b = wickOf(n);
    active = null; show(false); EK.fx.setHolding(false);
    EK.fx.set(svgs[n], 1);
    EK.bus.emit('fx:burst', { kind: 'ignite', x: b.x, y: b.y - 10 });
    vib(20, kb);
    EK.lamps.light(n, { x: b.x, y: b.y });
    setStatus(lamps[n - 1].litMsg || '');
    live.textContent = (ui.liveLit || '').replace(/\{n\}/g, n);
    if (n === 3) setTimeout(() => EK.fx.breath(), EK.mode.calm ? 0 : 500);
  }
  /* run the travel from a progress up to 1 over ms, then ignite */
  function finish(n, from, ms, kb) {
    if (EK.mode.calm) { ignite(n, kb); return; }
    const P = pathFor(n), t0 = performance.now(); let lastSpark = 0;
    active = { n, P, anim: true };
    show(true); holdText.hidden = true; setStatus(ui.travel, true);
    (function step(now) {
      if (!active || active.n !== n || !active.anim) return;
      const p = from + (1 - from) * clamp01((now - t0) / ms);
      const q = place(P, n, p); EK.fx.set(svgs[n], .15 + .85 * p); EK.bus.emit('diya:lighting', { n, p });
      if (now - lastSpark > 40) { lastSpark = now; EK.bus.emit('fx:burst', { kind: 'spark', x: q.x, y: q.y - 10 }); }
      if (p < 1) requestAnimationFrame(step); else setTimeout(() => ignite(n, kb), 120);
    })(t0);
  }
  function bind(el, n) {
    let t0 = 0, x0 = 0, y0 = 0, raf = 0, warm = 0, litAtDown = false, ptr = false;
    el.addEventListener('contextmenu', (e) => e.preventDefault());
    el.addEventListener('pointerdown', (e) => {
      if (e.button) return;
      ptr = true; litAtDown = EK.lamps.isLit(n);
      if (litAtDown) return;
      if (active) return;
      if (n > 1 && !EK.lamps.isLit(n - 1)) {
        const k = EK.lamps.count() + 1, sv = svgs[k]; if (sv) { sv.classList.remove('pulse'); void sv.getBoundingClientRect(); sv.classList.add('pulse'); }
        live.textContent = (ui.notReady || '').replace('{k}', k); setStatus((ui.notReady || '').replace('{k}', k));
        return;
      }
      try { el.setPointerCapture(e.pointerId); } catch (er) { /* ok */ }
      vib(10);
      t0 = performance.now(); x0 = e.clientX; y0 = e.clientY;
      if (EK.mode.calm) return;
      const P = pathFor(n); active = { n, P, hold: true }; show(true); holdText.hidden = false; EK.fx.setHolding(true);
      setStatus(ui.travel, true); el.classList.add('warming');
      let lastSpark = 0;
      (function tick(now) {
        if (!active || active.n !== n || !active.hold) return;
        const p = clamp01(warm + (now - t0) / 900);
        const q = place(P, n, p); EK.fx.set(svgs[n], .15 + .85 * p); EK.bus.emit('diya:lighting', { n, p });
        if (now - lastSpark > 40) { lastSpark = now; EK.bus.emit('fx:burst', { kind: 'spark', x: q.x, y: q.y - 10 }); }
        if (p >= 1) { el.classList.remove('warming'); ignite(n); return; }
        raf = requestAnimationFrame(tick);
      })(t0);
    });
    const end = (e) => {
      if (!ptr || litAtDown) return;
      const dt = performance.now() - t0, moved = Math.hypot((e.clientX || 0) - x0, (e.clientY || 0) - y0);
      el.classList.remove('warming');
      if (!active || active.n !== n) { if (EK.mode.calm && e.type === 'pointerup' && !EK.lamps.isLit(n) && (n === 1 || EK.lamps.isLit(n - 1))) ignite(n); return; }
      if (active.hold) {
        cancelAnimationFrame(raf); active.hold = false;
        const cur = parseFloat(ringEl.querySelector('.pr-fg').getAttribute('stroke-dashoffset'));
        const p = 1 - cur;
        if (e.type === 'pointerup' && dt < 350 && moved < 10) { finish(n, p, 450, false); return; }
        // early release: ring and ember drain back over 300 ms, then show the hint for a few seconds
        warm = p * .5; setTimeout(() => { warm = 0; }, 4000);
        const P = active.P, t1 = performance.now(), from = p; active = { n, drain: true };
        (function back(now) { const k = clamp01((now - t1) / 300), v = from * (1 - k); place(P, n, v); EK.fx.set(svgs[n], v > .02 ? .15 + .85 * v : 0); EK.bus.emit('diya:lighting', { n, p: v }); if (k < 1) requestAnimationFrame(back); else { active = null; show(false); EK.fx.setHolding(false); progress(); const hint = document.getElementById('hold-hint'); if (hint) { hint.classList.add('flash'); clearTimeout(hintTimer); hintTimer = setTimeout(() => hint.classList.remove('flash'), 4000); } } })(t1);
      }
    };
    el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
    el.addEventListener('click', (e) => {
      const wasLit = e.detail === 0 ? EK.lamps.isLit(n) : litAtDown;
      if (wasLit) { EK.openStory('lamp' + n); ptr = false; return; }
      if (e.detail === 0 && !ptr) {            // Enter, Space or an assistive click: no hold needed
        if (active) return;
        if (n > 1 && !EK.lamps.isLit(n - 1)) { const k = EK.lamps.count() + 1; live.textContent = (ui.notReady || '').replace('{k}', k); setStatus((ui.notReady || '').replace('{k}', k)); return; }
        finish(n, 0, 450, true);
      }
      ptr = false;
    });
  }

  /* ---------- the row ---------- */
  const items = lamps.map((l) => {
    const n = l.n, sv = EK.diya(n); svgs[n] = sv;
    const name = (ui.unlit || '').replace('{n}', n).replace('{name}', l.name);
    const desc = (ui.unlitDesc || '').replace('{n}', n).replace('{from}', n === 1 ? ui.fromHome : (ui.fromLamp || '').replace('{n}', n - 1));
    const btn = h('button', { type: 'button', class: 'lamp-btn', id: 'lampbtn-' + n, 'aria-label': name, 'aria-describedby': 'lampdesc-' + n }, sv, h('span', { class: 'chip-name', text: l.name.toUpperCase() }));
    const dsc = h('span', { class: 'sr-only', id: 'lampdesc-' + n, text: desc });
    bind(btn, n);
    EK.lamps.onChange(() => {
      const on = EK.lamps.isLit(n);
      btn.classList.toggle('lit', on);
      btn.setAttribute('aria-label', on ? (ui.lit || '').replace('{n}', n).replace('{name}', l.name) : name);
      dsc.textContent = on ? (ui.litDesc || '').replace('{n}', n) : desc;
      btn.classList.toggle('next', !on && n === EK.lamps.count() + 1);
    });
    if (n === 1) btn.classList.add('next');
    return h('li', { class: 'row-item' }, btn, dsc);
  });
  const homeItem = h('li', { class: 'row-item home' }, h('div', { class: 'home-lamp lit', 'aria-hidden': 'true' }, home, h('span', { class: 'chip-name', text: 'EK DIYA' })));

  /* Lamp 4: proposed, not run. It tries, flickers three times, fizzles and never lights. */
  let tries = false;
  const sv4 = d.growth ? EK.diya(4, { dashed: true }) : null; if (sv4) svgs[4] = sv4;
  function tryFour() {
    if (tries || !sv4) return; tries = true;
    const lastLit = Math.max(0, ...[1, 2, 3].filter((k) => EK.lamps.isLit(k)));
    const a = wickOf(lastLit), b = EK.fx.wick(sv4);
    vib(10);
    const finish4 = () => {
      setStatus(ui.lamp4Try || '', true); live.textContent = ui.lamp4Desc || '';
      if (EK.mode.calm) { EK.fx.set(sv4, .3); setTimeout(() => { EK.fx.set(sv4, 0); tries = false; }, 1000); return; }
      [.33, .22, .3, .18, .26, .12].forEach((v, i) => setTimeout(() => EK.fx.set(sv4, v), i * 150));
      setTimeout(() => { EK.fx.set(sv4, .05); EK.bus.emit('fx:burst', { kind: 'fizzle', x: b.x, y: b.y - 6 }); }, 1250);
      setTimeout(() => { EK.fx.set(sv4, 0); tries = false; }, 2200);
    };
    if (EK.mode.calm) { finish4(); return; }
    const P = { a, b, cx: (a.x + b.x) / 2, cy: (a.y + b.y) / 2 - Math.max(40, Math.hypot(b.x - a.x, b.y - a.y) * .35) };
    show(true); holdText.hidden = true; const t0 = performance.now();
    (function step(now) { const p = clamp01((now - t0) / 450), q = at(P, easeInOut(p)); trav.style.transform = 'translate(' + (q.x - 11) + 'px,' + (q.y - 28) + 'px) scale(' + (.5 + .5 * p) + ')'; ringEl.style.transform = 'translate(-999px,-999px)'; if (p < 1) requestAnimationFrame(step); else { show(false); finish4(); } })(t0);
  }
  const four = sv4 ? h('li', { class: 'row-item four' }, h('button', { type: 'button', class: 'lamp-btn dashed', id: 'lampbtn-4', 'aria-label': ui.lamp4, 'aria-describedby': 'lampdesc-4', onclick: tryFour }, sv4, h('span', { class: 'chip-name', text: ui.lamp4Chip })),
    h('span', { class: 'sr-only', id: 'lampdesc-4', text: ui.lamp4Desc })) : null;

  const holdBtn = h('button', { type: 'button', class: 'btn primary hold', id: 'hold-first', 'aria-describedby': 'hold-hint' }, h('span', { text: x.hold }));
  bind(holdBtn, 1);
  const allBtn = h('button', { type: 'button', class: 'linkbtn', id: 'light-all', text: ui.lightAll, onclick: () => EK.lamps.lightAll() });
  const rowMsg = d.row ? h('div', { class: 'row-msg', hidden: true }, h('p', { class: 'row-lit', text: d.row.lit }), h('p', { text: d.row.body }), h('p', { class: 'row-dusk', text: d.row.dusk })) : null;

  /* Light all: every remaining lamp in order, about 200 ms apart, with a short travel each. Same events as lighting by hand. */
  EK.lamps.sequence = function () {
    const todo = [1, 2, 3].filter((k) => !EK.lamps.isLit(k));
    allBtn.hidden = true;
    let i = 0;
    (function next() {
      if (i >= todo.length) return;
      const n = todo[i++];
      if (EK.mode.calm) { ignite(n); next(); return; }
      finish(n, .5, 250, false);
      setTimeout(next, 250 + 120 + 200);
    })();
  };
  EK.lamps.onChange((n) => {
    const c = EK.lamps.count();
    holdBtn.hidden = EK.lamps.isLit(1);
    const hh = document.getElementById('hold-hint'); if (hh) hh.hidden = EK.lamps.isLit(1);
    allBtn.hidden = c === 3;
    for (let k = 1; k <= 3; k++) if (EK.lamps.isLit(k)) EK.fx.set(svgs[k], 1);
    if (c === 3) { document.getElementById('lampbtn-4') && document.getElementById('lampbtn-4').classList.add('warm'); }
  });
  EK.bus.on('diya:allLit', () => {
    EK.fx.breath();
    live.textContent = (ui.allLitLive || '');
    setTimeout(() => { if (rowMsg) rowMsg.hidden = false; }, EK.mode.calm ? 0 : 700);
  });
  EK.bus.on('diya:lit', () => { EK.scene.inkLine(EK.lamps.count()); });
  progress();
  const sectionEl = h('section', { class: 'opening', id: 'top', 'aria-labelledby': 'top-h' },
    h('div', { class: 'op-top' },
      h('p', { class: 'kicker', text: x.label }),
      h('h1', { class: 'headline', id: 'top-h' }, head),
      has(x.ship) ? h('p', { class: 'ship', text: x.ship }) : null,
      h('p', { class: 'ek-lines' }, x.lines.filter(has).map((t) => [t, h('br')])), rowMsg),
    h('div', { class: 'op-bottom' },
      h('div', { class: 'hold-wrap' }, holdBtn, h('p', { class: 'hold-hint', id: 'hold-hint', text: x.holdHint })),
      status,
      h('div', { class: 'scene', id: 'night', role: 'group', 'aria-label': x.alt }, h('ol', { class: 'row' }, homeItem, items, four)),
      h('div', { class: 'cta-row center' }, allBtn)),
    live, over);
  EK.onReady.push(() => { document.body.appendChild(over); });
  EK.onReady.push(() => { EK.lamps.notify(0); });
  return sectionEl;
});

EK.defineSection('intro', (d) => {
  const x = d.opening;
  if (!x) return null;
  return h('section', { class: 'panel more-panel', id: 'intro', 'aria-label': x.label },
    d.sixty ? h('p', { class: 'sixty-line' }, x.sixtyLine + ' ', h('button', { type: 'button', class: 'btn', text: x.sixtyBtn, onclick: (e) => EK.openSixty(e.currentTarget) })) : null,
    has(x.below) ? h('p', { class: 'below', text: x.below }) : null,
    has(x.intro) ? h('p', { class: 'intro-p', text: x.intro }) : null);
});
