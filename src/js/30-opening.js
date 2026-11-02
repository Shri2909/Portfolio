/* Exhibit 0: the opening. One dossier on the desk, a red string to drag, a name under tape. */
CF.mountOpening = function (data, mount) {
  const ex = data.exhibit0 || {};
  const ui = data.ui || {};
  const site = data.site || {};
  const takes = (ex.takes || []).filter((t) => has(t.raw) && has(t.output));
  if (!takes.length) return null;

  const S = {
    takeIdx: 0, stream: [], tokens: [], N: 0, k: 0, p: 0,
    phase: 'idle', running: false, landed: false, last: 0, clock: 0, pt: 0, ht: 0, tt: 0,
    typeSeq: [], typeTotal: 0, typePtr: 0, partial: null, timers: [], dragging: false,
  };
  const subjectWords = (site.subject || '').split(/\s+/).filter(Boolean);
  const chapter = (data.chapters || []).find((c) => c.section === 'exhibit0');

  /* ---------- the seal ---------- */
  const seal = h('div', { class: 'seal', 'aria-hidden': 'true' });
  seal.innerHTML =
    '<svg viewBox="0 0 200 200" focusable="false"><defs>' +
    '<filter id="sealrough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="3" seed="7" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="3.2"/></filter>' +
    '<path id="sealring" d="M100,100 m-68,0 a68,68 0 1,1 136,0 a68,68 0 1,1 -136,0"/></defs>' +
    '<g filter="url(#sealrough)" fill="none" stroke="#D2452E">' +
    '<circle cx="100" cy="100" r="94" stroke-width="6"/><circle cx="100" cy="100" r="84" stroke-width="2"/><circle cx="100" cy="100" r="52" stroke-width="2"/>' +
    '<text fill="#D2452E" stroke="none" font-size="15" font-weight="800" style="font-family:var(--display)"><textPath href="#sealring" textLength="418" lengthAdjust="spacing">CASE FILE No. 001 - COME IN, DETECTIVE -</textPath></text>' +
    '<circle cx="100" cy="82" r="10" stroke-width="4"/><path d="M107.5 89.5 L117 99" stroke-width="5" stroke-linecap="round"/>' +
    '<text x="100" y="128" text-anchor="middle" fill="#D2452E" stroke="none" font-size="27" font-weight="800" letter-spacing="2" style="font-family:var(--display)">OPEN</text>' +
    '</g></svg>';
  seal.appendChild(h('i', { class: 'ripple' }));
  seal.play = function () {
    seal.classList.add('on');
    if (CF.reduced) return;
    seal.classList.remove('thud'); void seal.offsetWidth; seal.classList.add('thud');
    root.classList.add('glint');
    S.timers.push(setTimeout(() => root.classList.remove('glint'), 900));
  };
  seal.hide = function () { seal.classList.remove('on', 'thud', 'rip'); };
  let lastTap = 0;
  seal.addEventListener('pointerup', (e) => {
    const now = e.timeStamp;
    if (now - lastTap < 380) { ripple(); lastTap = 0; } else lastTap = now;
  });
  seal.addEventListener('dblclick', ripple);
  function ripple() {
    if (CF.reduced) return;
    seal.classList.remove('rip'); void seal.offsetWidth; seal.classList.add('rip');
    S.timers.push(setTimeout(() => seal.classList.remove('rip'), 1700));
  }

  /* ---------- name under tape ---------- */
  const nameEl = h('span', { class: 'nm', 'aria-hidden': 'true' });
  const wordEls = subjectWords.map((w, i) => {
    const el = h('span', { class: 'w' }, h('span', { class: 't' }, w),
      h('span', { class: 'tape t' + (i % 2 + 1) }, h('span', { class: 'tape-in' }, '?')),
      h('i', { class: 'curl' }));
    nameEl.appendChild(el);
    return el;
  });

  /* ---------- controls ---------- */
  const skipBtn = h('button', { class: 'btn skipbtn', type: 'button', text: ui.skip || '' });
  const slider = h('input', {
    class: 'string', type: 'range', min: 0, max: 1, step: 1, value: 0, 'aria-labelledby': 'cf-hint',
  });
  const block = h('div', { class: 'textblock', 'aria-hidden': 'true' });
  const caret = h('i', { class: 'caret', hidden: true });
  const hint = h('p', { class: 'hint', id: 'cf-hint', text: ui.hint || '' });
  const tagline = h('p', { class: 'tagline', text: site.tagline || '' });
  const takeBtns = takes.map((t, i) => h('button', {
    class: 'btn', type: 'button', 'aria-pressed': i === 0 ? 'true' : 'false', text: t.label || ('Take ' + (i + 1)),
    onclick: () => setTake(i),
  }));
  const replayBtn = h('button', { class: 'btn', type: 'button', text: ui.replay || '', onclick: () => start() });
  const plainBtn = h('button', { class: 'btn', type: 'button', text: ui.readBoth || '', onclick: openPlain });
  const controls = h('div', { class: 'controls' },
    takes.length > 1 ? h('div', { class: 'seg', role: 'group', 'aria-label': (ui.take1 && ui.take2) ? ui.take1 + ' / ' + ui.take2 : 'Takes' }, takeBtns) : null,
    has(ui.replay) ? replayBtn : null,
    has(ui.readBoth) ? plainBtn : null);

  /* legend: the words "trimmed" and "added" in ui.legend get their sample styling */
  const legend = h('p', { class: 'legend' });
  (function () {
    let txt = ui.legend || '';
    const frag = [];
    const rx = /(trimmed|added)/;
    const m = txt.match(rx);
    // first occurrence of each sample word gets styled; everything else stays plain text
    let rest = txt, seen = { trimmed: false, added: false };
    while (rest) {
      const mm = rest.match(rx);
      if (!mm) { frag.push(rest); break; }
      frag.push(rest.slice(0, mm.index));
      if (!seen[mm[1]]) { seen[mm[1]] = true; frag.push(h('span', { class: mm[1] === 'trimmed' ? 's-strike' : 's-hl', text: mm[1] })); }
      else frag.push(mm[1]);
      rest = rest.slice(mm.index + mm[1].length);
    }
    legend.append(...frag.map((f) => typeof f === 'string' ? document.createTextNode(f) : f));
  })();

  /* custody chip (compact, tap to expand) */
  const custody = ex.custody || {};
  const chipPanel = h('div', { class: 'custody', id: 'cf-custody', role: 'region', 'aria-label': ui.custody || '', hidden: true });
  const chip = h('button', { class: 'chip', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'cf-custody' },
    CF.icon('magnifier'), h('span', { text: ui.chip || '' }), CF.icon('chevron'));
  chip.lastChild.setAttribute('class', 'chev');
  function renderCustody() {
    const take = takes[S.takeIdx];
    const rows = [
      ['Source', custody.source], ['Tool', custody.tool], ['Date', custody.date],
      ['Recorded', take.recordedAt ? ((take.label ? take.label + ', ' : '') + take.recordedAt) : ''],
      ['Status', custody.status], ['Note', custody.note],
    ].filter((r) => has(r[1]));
    chipPanel.textContent = '';
    chipPanel.append(h('h3', { text: ui.custody || '' }),
      h('dl', null, rows.map((r) => [h('dt', { text: r[0] }), h('dd', { text: r[1] })])),
      custody.verified === true ? h('span', { class: 'stamp-verified', text: 'VERIFIED' }) : null);
  }
  function toggleChip(open) {
    const want = open === undefined ? chipPanel.hidden : open;
    chipPanel.hidden = !want;
    chip.setAttribute('aria-expanded', String(!!want));
  }
  chip.addEventListener('click', () => toggleChip());
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !chipPanel.hidden) { toggleChip(false); chip.focus(); } });
  document.addEventListener('pointerdown', (e) => { if (!chipPanel.hidden && !e.target.closest('.chipwrap')) toggleChip(false); });

  /* cue: "Open the file" and the first chapter's teaser */
  const cue = h('button', { class: 'btn cue', type: 'button', onclick: openFile }, h('span', { text: ui.cue || '' }), CF.icon('down'));
  const cueWrap = h('div', { class: 'cuewrap' }, has(ui.cue) ? cue : null,
    chapter && has(chapter.teaser) ? h('p', { class: 'teaser', text: chapter.teaser }) : null);
  function openFile() {
    const next = document.querySelector('#main > section:not(#exhibit0)');
    if (next) {
      next.scrollIntoView({ behavior: CF.reduced ? 'auto' : 'smooth', block: 'start' });
      if (!next.hasAttribute('tabindex')) next.setAttribute('tabindex', '-1');
      next.focus({ preventScroll: true });
    } else {
      window.scrollTo({ top: document.documentElement.scrollHeight, behavior: CF.reduced ? 'auto' : 'smooth' });
    }
  }

  /* plain-reading dialog: both texts, no animation */
  const plain = h('dialog', { class: 'plain', 'aria-labelledby': 'cf-plain-h' });
  function openPlain() {
    const take = takes[S.takeIdx];
    plain.textContent = '';
    plain.append(
      h('h2', { id: 'cf-plain-h', text: ui.raw || '' }),
      ...take.raw.split(/\n\s*\n/).map((p) => h('p', { class: 'rawp', text: p.replace(/\s+/g, ' ').trim() })),
      h('h2', { text: ui.flow || '' }),
      h('p', { class: 'outp', text: take.output }),
      h('form', { method: 'dialog' }, h('button', { class: 'btn', type: 'submit', text: ui.close || 'Close' })));
    if (typeof plain.showModal === 'function') plain.showModal(); else plain.setAttribute('open', '');
  }
  plain.addEventListener('click', (e) => { if (e.target === plain) plain.close(); });

  /* screen readers get both texts; the animated block is decoration of the same words */
  const a11y = h('div', { class: 'sr-only', id: 'cf-a11y' });

  /* ---------- the dossier ---------- */
  const root = h('section', { class: 'dossier', id: 'exhibit0', 'aria-labelledby': 'cf-title' },
    h('i', { class: 'corner-pro', 'aria-hidden': 'true' }),
    h('div', { class: 'mtab', 'aria-hidden': 'true', text: '0' }),
    skipBtn, seal,
    h('div', { class: 'intro' },
      h('h1', { class: 'casehead', id: 'cf-title' }, h('span', { text: 'CASE FILE' }), h('span', { class: 'no', text: 'No. 001' })),
      h('p', { class: 'subject' },
        h('span', { class: 'lbl', 'aria-hidden': 'true', text: 'Subject:' }), nameEl,
        h('span', { class: 'sr-only', text: 'Subject: ' + (site.subject || '') })),
      h('p', { class: 'q' }, has(ex.label) ? h('span', { class: 'ex', text: ex.label }) : null, h('em', { text: ex.question || '' }))),
    a11y, block,
    h('div', { class: 'sliderwrap' }, slider,
      h('div', { class: 'slabels', 'aria-hidden': 'true' }, h('span', { text: ui.raw || '' }), h('span', { text: ui.flow || '' }))),
    h('div', { class: 'slot' }, hint, tagline),
    h('div', { class: 'aids' }, legend, h('div', { class: 'chipwrap' }, chip, chipPanel), controls),
    cueWrap, plain);

  /* ---------- tokens ---------- */
  function mountTokens() {
    const take = takes[S.takeIdx];
    S.stream = CF.engine.buildStream(take.raw, take.output);
    S.N = S.stream.length;
    S.tokens = S.stream;
    const els = S.tokens.map((t) => {
      const el = h('span', { class: 'tk ' + t.t + (t.t === 'br' ? '' : ' untyped') });
      if (t.t !== 'br') { t.inn = h('span', { class: 'in', text: t.t === 'ad' ? t.out : t.raw }); el.appendChild(t.inn); }
      t.el = el; t.res = false;
      return el;
    });
    block.textContent = '';
    block.append(...els, caret);
    caret.hidden = true;
    S.k = 0; S.p = 0;
    slider.max = S.N; slider.value = 0;
    a11y.textContent = '';
    a11y.append(h('p', { text: (ui.raw || '') + ': ' + take.raw.replace(/\s+/g, ' ').trim() }), h('p', { text: (ui.flow || '') + ': ' + take.output }));
    buildTypeSeq();
    renderCustody();
  }

  /* Reserve the height of the TALLEST state (not only p=0 and p=1: mixed states can be taller), so nothing below ever moves. */
  function measure() {
    if (!S.tokens.length) return;
    const keepK = S.k, keepP = S.p;
    block.classList.add('instant');
    block.style.removeProperty('--th');
    S.tokens.forEach((t) => {
      if (t.t === 'ro' || t.t === 'ad') t.el.style.setProperty('--w', (t.inn.offsetWidth + 1) + 'px');
    });
    let tallest = 0;
    const steps = 16;
    for (let i = 0; i <= steps; i++) {
      setK(Math.round((S.N * i) / steps), { instant: true, force: true, noCaret: true });
      tallest = Math.max(tallest, block.offsetHeight);
    }
    block.style.setProperty('--th', tallest + 'px');
    setK(keepK, { instant: true, force: true });
    S.p = keepP;
    void block.offsetHeight;
    block.classList.remove('instant');
  }

  /* ---------- state: one value p, frontier k ---------- */
  function applyTok(i, resolved, fwd, instant) {
    const t = S.tokens[i];
    if (t.res === resolved) return;
    t.res = resolved;
    const el = t.el;
    if (t.t === 'br') { el.classList.toggle('res', resolved); return; }
    el.classList.toggle('res', resolved);
    if (t.t === 'm') {
      t.inn.textContent = resolved ? t.out : t.raw;
      if (!instant && !CF.reduced && t.inn.animate) t.inn.animate([{ opacity: .15 }, { opacity: 1 }], { duration: 140, easing: 'ease-out' });
    } else if (t.t === 'ro') {
      el.classList.toggle('fwd', resolved && fwd && !instant);
    }
  }
  function setK(k, o) {
    o = o || {};
    k = Math.max(0, Math.min(S.N, k));
    const old = S.k;
    if (k === old && !o.force) return;
    if (o.force) {
      for (let i = 0; i < S.N; i++) applyTok(i, i < k, k > old, o.instant);
    } else {
      const a = Math.min(old, k), b = Math.max(old, k);
      for (let i = a; i < b; i++) applyTok(i, i < k, k > old, o.instant);
    }
    S.k = k;
    if (!o.noCaret) placeCaret();
  }
  function placeCaret() {
    if (S.k <= 0 || S.k >= S.N) { caret.hidden = true; return; }
    caret.hidden = false;
    block.insertBefore(caret, S.tokens[S.k].el);
  }
  function wordCounts() {
    let total = 0, done = 0;
    S.tokens.forEach((t, i) => { if (t.t !== 'br') { total++; if (i < S.k) done++; } });
    return [done, total];
  }
  function setP(p, o) {
    o = o || {};
    S.p = clamp01(p);
    const prevK = S.k;
    setK(Math.round(S.p * S.N), o);
    if (S.k !== prevK && S.dragging && navigator.vibrate && S.k > prevK) {
      for (let i = prevK; i < S.k; i++) if (S.tokens[i].t === 'ro') { try { navigator.vibrate(8); } catch (e) { /* optional */ } break; }
    }
    slider.value = S.k;
    slider.style.setProperty('--f', S.N ? (S.k / S.N).toFixed(4) : 0);
    const [done, total] = wordCounts();
    slider.setAttribute('aria-valuetext', 'Trimmed ' + done + ' of ' + total + ' words');
    updateTape();
    if (S.k === S.N && !S.landed) {
      S.landed = true;
      S.timers.push(setTimeout(land, CF.reduced || o.noDelay ? 0 : 300));
    }
  }
  function updateTape() {
    wordEls.forEach((w, i) => {
      const start = 0.55 + i * 0.2;
      const peel = S.k >= S.N ? 1 : easeOut((S.p - start) / 0.25);
      w.style.setProperty('--peel', peel.toFixed(3));
      w.classList.toggle('peeling', peel > 0.02 && peel < 0.98);
    });
  }
  function land() {
    root.classList.add('landed');
    skipBtn.hidden = true;
    seal.play();
  }

  /* ---------- typing ---------- */
  function buildTypeSeq() {
    const seq = []; let t = 0;
    S.tokens.forEach((tk, i) => {
      if (tk.t === 'ad') return;
      if (tk.t === 'br') { t += .25; return; }
      const dur = (tk.raw.length + 1) / 90;
      seq.push({ i, t0: t, dur }); t += dur;
    });
    S.typeSeq = seq; S.typeTotal = t; S.typePtr = 0; S.partial = null;
  }
  function typeTo(elapsed) {
    while (S.typePtr < S.typeSeq.length) {
      const e = S.typeSeq[S.typePtr];
      const tk = S.tokens[e.i];
      if (elapsed >= e.t0 + e.dur) {
        if (S.partial === e.i) { tk.inn.textContent = tk.raw; S.partial = null; }
        tk.el.classList.remove('untyped');
        S.typePtr++;
      } else if (elapsed >= e.t0) {
        const n = Math.max(1, Math.floor(((elapsed - e.t0) / e.dur) * tk.raw.length));
        tk.el.classList.remove('untyped');
        tk.inn.textContent = '';
        tk.inn.append(document.createTextNode(tk.raw.slice(0, n)), h('span', { class: 'ghost', text: tk.raw.slice(n) }));
        S.partial = e.i;
        break;
      } else break;
    }
  }
  function finishTyping() {
    if (S.partial !== null) { const pt = S.tokens[S.partial]; pt.inn.textContent = pt.raw; S.partial = null; }
    S.tokens.forEach((tk) => { if (tk.t !== 'br') tk.el.classList.remove('untyped'); });
    S.typePtr = S.typeSeq.length;
  }

  /* ---------- run control ---------- */
  let raf = 0;
  function stopRun() { S.running = false; if (raf) cancelAnimationFrame(raf); raf = 0; }
  function clearTimers() { S.timers.forEach(clearTimeout); S.timers = []; }
  function frame(now) {
    if (!S.running) return;
    const dt = Math.min(now - S.last, 100) / 1000; S.last = now;
    if (S.phase === 'wait') { S.clock += dt; if (S.clock >= .4) { S.phase = 'typing'; S.pt = 0; } }
    else if (S.phase === 'typing') {
      S.pt += dt; typeTo(S.pt);
      if (S.pt >= S.typeTotal) { finishTyping(); S.phase = 'hold'; S.ht = 0; }
    } else if (S.phase === 'hold') { S.ht += dt; if (S.ht >= .5) { S.phase = 'trim'; S.tt = 0; } }
    else if (S.phase === 'trim') {
      S.tt += dt; setP(easeInOut(S.tt / 3.5));
      if (S.tt >= 3.5) { setP(1); S.phase = 'done'; S.running = false; }
    }
    if (S.running) raf = requestAnimationFrame(frame);
  }
  function resetState() {
    stopRun(); clearTimers();
    S.landed = false; S.phase = 'idle'; S.clock = 0;
    root.classList.remove('landed', 'glint');
    seal.hide();
    skipBtn.hidden = false;
    block.classList.add('instant');
    S.tokens.forEach((t) => {
      if (t.t !== 'br') { t.el.classList.add('untyped'); t.inn.textContent = t.t === 'ad' ? t.out : t.raw; }
    });
    S.partial = null; S.typePtr = 0;
    setK(0, { instant: true, force: true });
    setP(0, { instant: true });
    void block.offsetHeight;
    block.classList.remove('instant');
  }
  function start() {
    resetState();
    if (CF.reduced) { finalState(); return; }
    S.phase = 'wait'; S.running = true; S.last = performance.now();
    raf = requestAnimationFrame(frame);
  }
  function finalState() {
    stopRun();
    finishTyping();
    block.classList.add('instant');
    setP(1, { instant: true, noDelay: true });
    void block.offsetHeight;
    block.classList.remove('instant');
    S.phase = 'done';
  }
  function skip() {
    if (!(S.phase === 'wait' || S.phase === 'typing' || S.phase === 'hold' || S.phase === 'trim' || S.phase === 'manual')) return;
    finalState();
  }
  function takeControl() {
    if (S.running) { stopRun(); finishTyping(); }
    if (S.phase !== 'done') S.phase = 'manual';
  }
  function setTake(i) {
    if (i === S.takeIdx && S.tokens.length) { start(); return; }
    S.takeIdx = i;
    takeBtns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    resetState();
    mountTokens();
    measure();
    start();
  }

  /* ---------- wiring ---------- */
  skipBtn.addEventListener('click', skip);
  root.addEventListener('click', (e) => {
    if (e.target.closest('button, input, a, dialog, .chipwrap, .seal')) return;
    skip();
  });
  slider.addEventListener('pointerdown', () => { S.dragging = true; takeControl(); });
  window.addEventListener('pointerup', () => { S.dragging = false; });
  slider.addEventListener('keydown', (e) => { if (/^(Arrow|Home|End|Page)/.test(e.key)) takeControl(); });
  slider.addEventListener('input', () => { takeControl(); setP(Number(slider.value) / S.N); });

  mount.appendChild(root);
  mountTokens();
  measure();
  const remeasure = () => measure();
  let rt = 0;
  window.addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(remeasure, 120); });
  start();

  /* test and tooling hooks (read-only views plus the same controls a visitor has) */
  CF.opening = {
    get N() { return S.N; }, get k() { return S.k; }, get p() { return S.p; }, get phase() { return S.phase; }, get landed() { return S.landed; },
    get takeIdx() { return S.takeIdx; },
    setP: (p) => { takeControl(); setP(p); }, setK: (k) => { takeControl(); setP(k / S.N); },
    visibleText: () => CF.engine.textAt(S.stream, S.k),
    skip, replay: start, setTake, seal, root,
  };
  return root;
};
