/* Beyond the code (Roots): intro, a red-string timeline, evidence bags, one quiet philosophy card. Renders only with items or at least two timeline events. */
CF.defineSection('effects', function (d) {
  const ui = d.ui || {};
  const e = d.effects || {};
  const items = (e.items || []).filter((i) => has(i.title));
  const tl = (e.timeline || []).filter((t) => has(t.label) || has(t.text));
  if (!items.length && tl.length < 2) return null;

  const TAGS = { document: 'DOCUMENT', link: 'LINK', 'self-reported': 'SELF-REPORTED' };
  const detail = h('div', { class: 'bag-detail', 'aria-live': 'polite' });
  const bags = items.map((it, i) => {
    const self = it.tag === 'self-reported';
    const b = h('button', { class: 'bag' + (self ? ' self' : ''), type: 'button', 'aria-expanded': 'false', 'data-i': String(i) },
      h('span', { class: 'bag-l', text: it.title }), h('span', { class: 'stamp bag-s' + (self ? ' dashed' : ''), 'aria-hidden': 'true', text: TAGS[it.tag] || String(it.tag || '').toUpperCase() }),
      h('span', { class: 'sr-only', text: TAGS[it.tag] || it.tag || '' }));
    b.addEventListener('click', () => {
      const same = b.getAttribute('aria-expanded') === 'true';
      bags.forEach((x) => x.setAttribute('aria-expanded', 'false'));
      detail.textContent = '';
      if (same) return;
      b.setAttribute('aria-expanded', 'true');
      put(detail, h('div', { class: 'slipcard' }, h('h3', { text: it.title }),
        has(it.note) ? h('p', { path: 'effects.items.' + i + '.note', text: it.note }) : null,
        // a PDF or link opens in a new tab; a missing file never blocks anything
        has(it.file) ? h('p', null, h('a', { class: 'repo-link', href: it.file, target: '_blank', rel: 'noopener', text: 'Open the document' })) : null,
        has(it.url) ? h('p', null, h('a', { class: 'repo-link', href: it.url, target: '_blank', rel: 'noopener', text: it.url })) : null));
    });
    return b;
  });
  const intro = has(e.intro) ? e.intro.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean).map((p) => h('p', { class: 'intro-p', path: 'effects.intro', text: p })) : null;
  const phil = e.philosophy && has(e.philosophy.text)
    ? h('aside', { class: 'philo' }, e.philosophy.text.split(/\n\s*\n/).map((p) => h('p', { path: 'effects.philosophy.text', text: p.trim() }))) : null;
  /* the route so far: a hand-drawn SVG route that draws itself as you scroll; one tappable pin per timeline stop.
     A final dashed stop only if the brief says he is willing to relocate to Bengaluru. */
  function journey() {
    if (tl.length < 2) return null;
    const sum = (d.brief && d.brief.summary) || '';
    const stops = tl.map((x) => ({ label: x.label, text: x.text, date: x.date, dashed: false }));
    if (/willing to relocate/i.test(sum) && /Bengaluru/.test(sum)) stops.push({ label: 'Bengaluru', text: 'willing to relocate', dashed: true });
    const detail = h('div', { class: 'jn-detail', 'aria-live': 'polite' });
    const pinBtns = [];
    const ol = h('ol', { class: 'jn-stops' }, stops.map((st, i) => {
      const b = h('button', { class: 'jn-pin' + (st.dashed ? ' dashed' : ''), type: 'button', 'aria-expanded': 'false', 'aria-label': st.label + (st.dashed ? ', ' + st.text : '') }, h('i', { 'aria-hidden': 'true' }));
      b.addEventListener('click', () => {
        const same = b.getAttribute('aria-expanded') === 'true';
        pinBtns.forEach((x) => x.setAttribute('aria-expanded', 'false')); detail.textContent = '';
        if (same) return;
        b.setAttribute('aria-expanded', 'true');
        put(detail, h('div', { class: 'slipcard' }, h('h3', { text: st.label }), has(st.date) ? h('p', { class: 'tl-d', text: st.date }) : null, has(st.text) ? h('p', { text: st.text }) : null));
      });
      pinBtns.push(b);
      return h('li', { class: 'jn-stop ' + (i % 2 ? 'r' : 'l') + (st.dashed ? ' dashed' : '') }, b, h('span', { class: 'jn-l' }, st.label, st.dashed ? h('em', { text: st.text }) : null));
    }));
    const svg = s('svg', { class: 'jn-svg', 'aria-hidden': 'true', focusable: 'false' });
    const wrap = h('div', { class: 'journey' }, h('p', { class: 'label-brass', text: ui.journeyTitle || '' }), has(ui.journeyNote) ? h('p', { class: 'jn-note', text: ui.journeyNote }) : null, h('div', { class: 'jn-body' }, svg, ol), detail);
    let solid = null, dashedP = null, L1 = 0;
    function layout() {
      const br = wrap.querySelector('.jn-body').getBoundingClientRect();
      if (!br.width) return;
      svg.setAttribute('viewBox', '0 0 ' + br.width + ' ' + br.height); svg.style.height = br.height + 'px';
      while (svg.firstChild) svg.removeChild(svg.firstChild);
      const pts = pinBtns.map((b) => { const r = b.getBoundingClientRect(); return [r.left + r.width / 2 - br.left, r.top + r.height / 2 - br.top]; });
      let seed2 = 11; const rnd = () => { seed2 = (seed2 * 16807) % 2147483647; return seed2 / 2147483647; };
      const seg = (a, c) => { const my = (a[1] + c[1]) / 2; const j = (rnd() - .5) * 14; return ' C' + (a[0] + j) + ' ' + (my - 8) + ' ' + (c[0] - j) + ' ' + (my + 8) + ' ' + c[0] + ' ' + c[1]; };
      const lastSolid = stops.reduce((n, st, i) => (st.dashed ? n : i), 0);
      let dS = 'M' + pts[0][0] + ' ' + pts[0][1];
      for (let i = 1; i <= lastSolid; i++) dS += seg(pts[i - 1], pts[i]);
      solid = s('path', { d: dS, class: 'jn-path', fill: 'none' });
      svg.appendChild(solid);
      L1 = solid.getTotalLength();
      dashedP = null;
      if (lastSolid < stops.length - 1) { dashedP = s('path', { d: 'M' + pts[lastSolid][0] + ' ' + pts[lastSolid][1] + seg(pts[lastSolid], pts[lastSolid + 1]), class: 'jn-path dashed', fill: 'none' }); svg.appendChild(dashedP); }
      draw();
    }
    function draw() {
      if (!solid) return;
      const r = wrap.getBoundingClientRect();
      const p = CF.reduced ? 1 : clamp01((window.innerHeight * 0.85 - r.top) / (r.height * 0.9));
      solid.style.strokeDasharray = L1; solid.style.strokeDashoffset = L1 * (1 - p);
      if (dashedP) dashedP.style.opacity = p > 0.97 ? 1 : 0;
      wrap.style.setProperty('--jp', p.toFixed(3));
      pinBtns.forEach((b, i) => b.classList.toggle('lit', p >= (i / Math.max(1, stops.length - 1)) * 0.96));
    }
    let tick = false;
    window.addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(() => { tick = false; draw(); }); } }, { passive: true });
    if (window.ResizeObserver) new ResizeObserver(layout).observe(wrap.querySelector('.jn-body')); else window.addEventListener('resize', layout);
    document.addEventListener('cf:layout', () => requestAnimationFrame(layout));
    setTimeout(layout, 0);
    return wrap;
  }

  return CF.sheet('effects', { title: ui.effectsTitle, cls: 'effects' },
    intro, tl.length >= 2 ? CF.ex.timeline(tl, 'effects') : null, journey(),
    bags.length ? h('div', { class: 'bags' }, bags) : null, bags.length ? detail : null, phil);
});
