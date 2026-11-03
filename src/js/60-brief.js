/* The Briefing: a cream envelope that opens by itself, the leads (luggage tags on phones, the cork case board from 768px),
   and the red string that runs from a lead to the pins of its exhibits. */
CF.board = { afterRail() {} };

CF.defineSection('brief', function (d) {
  const ui = d.ui || {};
  const leads = (d.specialties || []).filter((s) => has(s.title));
  const summary = d.brief && d.brief.summary;
  if (!has(summary) && !leads.length) return null;

  const SVGS = {
    ring: '<svg viewBox="0 0 80 80" focusable="false"><circle cx="40" cy="40" r="28" fill="none" stroke="#7a4a22" stroke-width="5"/><path d="M62 30 A28 28 0 0 1 46 67" fill="none" stroke="#7a4a22" stroke-width="2" opacity=".7"/></svg>',
  };

  /* ---- envelope ---- */
  const art = h('span', { class: 'env-art', 'aria-hidden': 'true' },
    h('i', { class: 'env-body' }), h('i', { class: 'env-flap' }), h('i', { class: 'env-wax' }));
  const envBtn = h('button', { class: 'env-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'brief-letter' }, art,
    has(ui.openBriefing) ? h('span', { class: 'env-cap', text: ui.openBriefing }) : null);

  /* ---- leads ---- */
  const sel = { id: null, timers: [] };
  const info = h('div', { class: 'lead-info', 'aria-live': 'polite' });
  const leadBtns = leads.map((s) => {
    const b = h('button', { class: 'lead' + (s.status === 'not_shown' ? ' notyet' : ''), type: 'button', 'aria-pressed': 'false', 'data-id': s.id },
      CF.icon('magnifier'), h('span', { class: 'lt' }, s.title,
        s.status === 'not_shown' && has(ui.notYet) ? h('span', { class: 'ny', text: ui.notYet }) : null));
    b.addEventListener('click', () => select(s, b));
    return b;
  });
  const leadList = h('ul', { class: 'leads' }, leadBtns.map((b) => h('li', null, b)));

  /* ---- the case board (>= 768px) ---- */
  const boardIds = CF.order.filter((id) => id !== 'brief' && id !== 'exhibitZ');
  const pinBtns = {};
  const pinList = h('ul', { class: 'bpins' });
  const stringsBoard = s('svg', { class: 'board-strings', 'aria-hidden': 'true', focusable: 'false' });
  const board = h('div', { class: 'board' }, h('div', { class: 'cork' }, leadList, pinList, stringsBoard));

  function buildPins() {
    if (!CF.visibleSections) return;
    pinList.textContent = '';
    boardIds.filter((id) => CF.visibleSections.includes(id)).forEach((id) => {
      const label = CF.sectionLabel(id);
      if (!has(label)) return;
      const b = h('button', { class: 'bpin' + (CF.reached.has(id) ? ' reached' : ''), type: 'button', 'data-id': id, 'aria-label': 'Go to ' + label },
        h('span', { class: 'dot', 'aria-hidden': 'true' }), h('span', { class: 'plbl', text: label }));
      b.addEventListener('click', () => { const t = document.getElementById(id); t.scrollIntoView({ behavior: CF.reduced ? 'auto' : 'smooth', block: 'start' }); if (!t.hasAttribute('tabindex')) t.setAttribute('tabindex', '-1'); t.focus({ preventScroll: true }); });
      pinBtns[id] = b;
      pinList.appendChild(h('li', null, b));
    });
  }
  document.addEventListener('cf:reached', () => { Object.keys(pinBtns).forEach((id) => pinBtns[id].classList.toggle('reached', CF.reached.has(id))); });

  /* ---- strings ---- */
  const wide = () => window.matchMedia('(min-width: 768px)').matches;
  let pageLayer = null;
  function layer() {
    if (!pageLayer) { pageLayer = s('svg', { class: 'page-strings', 'aria-hidden': 'true', focusable: 'false' }); document.getElementById('page').appendChild(pageLayer); }
    return pageLayer;
  }
  function clearStrings() {
    sel.timers.forEach(clearTimeout); sel.timers = [];
    while (stringsBoard.firstChild) stringsBoard.removeChild(stringsBoard.firstChild);
    if (pageLayer) while (pageLayer.firstChild) pageLayer.removeChild(pageLayer.firstChild);
    document.querySelectorAll('.sheet.hl').forEach((e) => e.classList.remove('hl'));
    document.querySelectorAll('.bpin.pulse').forEach((e) => e.classList.remove('pulse'));
  }
  function addPath(svg, dStr, animate) {
    const p = s('path', { d: dStr, class: 'string-path', fill: 'none' });
    svg.appendChild(p);
    if (animate && !CF.reduced) {
      const L = p.getTotalLength();
      p.style.strokeDasharray = L; p.style.strokeDashoffset = L;
      void p.getBoundingClientRect();
      p.style.transition = 'stroke-dashoffset .6s cubic-bezier(.22,.61,.36,1)';
      p.style.strokeDashoffset = 0;
    }
    return p;
  }
  function draw(lead, animate) {
    if (CF.rail && !wide()) CF.rail.place(true);
    const targets = (lead.exhibits || []).filter((id) => CF.visibleSections.includes(id));
    const from = leadBtns.find((b) => b.dataset.id === lead.id);
    if (!from || !targets.length) return;
    if (wide() && pinList.children.length) {
      const cr = stringsBoard.getBoundingClientRect(), fr = from.getBoundingClientRect();
      stringsBoard.setAttribute('viewBox', '0 0 ' + cr.width + ' ' + cr.height);
      targets.forEach((id) => {
        const pb = pinBtns[id]; if (!pb) return;
        const pr = pb.querySelector('.dot').getBoundingClientRect();
        const x0 = fr.right - cr.left, y0 = fr.top + fr.height / 2 - cr.top, x1 = pr.left + pr.width / 2 - cr.left, y1 = pr.top + pr.height / 2 - cr.top;
        const mx = (x0 + x1) / 2;
        addPath(stringsBoard, 'M' + x0 + ' ' + y0 + ' C' + mx + ' ' + y0 + ' ' + mx + ' ' + y1 + ' ' + x1 + ' ' + y1, animate);
        pb.classList.add('pulse');
      });
    } else {
      const page = document.getElementById('page'), pgr = page.getBoundingClientRect(), svg = layer();
      svg.setAttribute('viewBox', '0 0 ' + pgr.width + ' ' + page.scrollHeight);
      svg.style.height = page.scrollHeight + 'px';
      const fr = from.getBoundingClientRect();
      const x0 = fr.left - pgr.left, y0 = fr.top + fr.height / 2 - pgr.top;
      targets.forEach((id, i) => {
        const pin = CF.rail && CF.rail.pins[id]; if (!pin) return;
        const pr = pin.getBoundingClientRect();
        const rx = pr.left + pr.width / 2 - pgr.left, y1 = pr.top + pr.height / 2 - pgr.top;
        const dir = y1 >= y0 ? 1 : -1;
        addPath(svg, 'M' + x0 + ' ' + y0 + ' L' + (rx + 14) + ' ' + y0 + ' Q' + rx + ' ' + y0 + ' ' + rx + ' ' + (y0 + 14 * dir) + ' L' + rx + ' ' + y1, animate);
      });
    }
    targets.forEach((id) => { const sheet = document.getElementById(id); if (sheet) sheet.classList.add('hl'); });
    sel.timers.push(setTimeout(() => { document.querySelectorAll('.sheet.hl').forEach((e) => e.classList.remove('hl')); document.querySelectorAll('.bpin.pulse').forEach((e) => e.classList.remove('pulse')); }, 3000));
  }
  function renderInfo(lead) {
    info.textContent = '';
    if (!lead) return;
    put(info, 
      has(lead.evidence) ? h('p', null, h('span', { class: 'label-brass', text: ui.evidence || '' }), ' ', lead.evidence) : null,
      has(lead.worth) ? h('p', { path: 'specialties.' + d.specialties.indexOf(lead) + '.worth' }, h('span', { class: 'label-brass', text: ui.worth || '' }), ' ', lead.worth) : null);
  }
  function select(lead, btn) {
    const same = sel.id === lead.id;
    clearStrings();
    leadBtns.forEach((b) => b.setAttribute('aria-pressed', 'false'));
    if (same) { sel.id = null; renderInfo(null); return; }
    sel.id = lead.id;
    btn.setAttribute('aria-pressed', 'true');
    renderInfo(lead);
    draw(lead, true);
  }
  const redraw = () => { if (!sel.id) return; const lead = leads.find((l) => l.id === sel.id); const keep = sel.timers.slice(); clearStrings(); sel.timers = keep; draw(lead, false); };
  document.addEventListener('cf:layout', redraw);
  window.addEventListener('resize', () => { if (sel.id) { const lead = leads.find((l) => l.id === sel.id); const keep = sel.timers.slice(); clearStrings(); sel.timers = keep; draw(lead, false); } });

  /* ---- the letter ---- */
  const coffee = h('button', { class: 'coffee-ring', type: 'button', 'aria-label': 'Coffee ring', onclick: () => CF.slip(ui.coffeeRingSlip, 4000) });
  coffee.innerHTML = SVGS.ring;
  const paras = has(summary) ? summary.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean) : [];
  const letterIn = h('div', { class: 'letter-in' },
    h('div', { class: 'paper' },
      coffee,
      h('h2', { class: 'greeting', id: 'brief-greeting', text: ui.greeting || '' }),
      paras.map((p) => h('p', { class: 'summary', path: 'brief.summary', text: p })),
      leads.length ? [
        h('h3', { class: 'leads-title', text: ui.leadsTitle || '' }),
        has(ui.leadsHint) ? h('p', { class: 'leads-hint', text: ui.leadsHint }) : null,
        h('div', { class: 'leads-wrap' }, board), info,
      ] : null));
  const letter = h('div', { class: 'letter', id: 'brief-letter', inert: true }, letterIn);
  const sheet = CF.sheet('brief', { labelledby: 'brief-greeting', cls: 'brief' }, h('div', { class: 'envelope' }, envBtn, letter));

  function open() {
    if (sheet.classList.contains('open')) return;
    sheet.classList.add('open');
    envBtn.setAttribute('aria-expanded', 'true');
    letter.removeAttribute('inert');
    buildPins();
  }
  envBtn.addEventListener('click', open);
  if (CF.reduced || !window.IntersectionObserver) open();
  else {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.intersectionRatio >= 0.4)) { open(); io.disconnect(); } }, { threshold: [0.4] });
    io.observe(sheet);
  }
  // pins can only be built once the other sections are known; the letter is built after all sections mount
  CF.board.afterRail = () => { if (sheet.classList.contains('open')) buildPins(); };
  return sheet;
});
