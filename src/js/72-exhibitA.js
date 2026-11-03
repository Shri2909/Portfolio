/* Exhibit A: certgen. 324 sage tiles, a scan line, then 19 brass tiles that drop in below. Numbers come only from exhibitA.stats. */
CF.defineSection('exhibitA', function (d) {
  const a = d.exhibitA;
  if (!a || !(has(a.title) || has(a.summary))) return null;
  const ui = d.ui || {};
  const tests = a.stats && a.stats.tests, finds = a.stats && a.stats.findings;

  /* ---- the grid ---- */
  let visual = null;
  if (tests > 0) {
    const COLS = 18;
    const mk = (n, cls, off) => Array.from({ length: n }, (_, i) => {
      const t = h('i', { class: 'tile ' + cls, 'data-n': String(i + 1) });
      t.style.setProperty('--d', ((i % COLS) + Math.floor(i / COLS) + off) * 9 + 'ms');
      return t;
    });
    const status = h('p', { class: 'tile-status', 'aria-live': 'polite' });
    const gridT = h('div', { class: 'grid grid-tests', style: '--cols:' + COLS, role: 'group', tabindex: '0', 'aria-label': tests + ' passing tests. Arrow keys move between tiles.' }, mk(tests, 'test', 0));
    const scan = h('i', { class: 'scan', 'aria-hidden': 'true' });
    const gridF = finds > 0 ? h('div', { class: 'grid grid-finds', style: '--cols:' + Math.min(finds, 10), role: 'group', tabindex: '0', 'aria-label': finds + ' findings. Arrow keys move between tiles.' }, mk(finds, 'find', 0)) : null;
    const cap = finds > 0 ? h('div', { class: 'find-cap' }, h('p', { class: 'fc-t', text: finds + ' findings the ' + tests + ' tests never asked about' }), h('span', { class: 'fseal', 'aria-hidden': 'true', text: finds + ' FINDINGS' })) : null;
    const table = h('div', { class: 'sr-only' }, h('table', null, h('caption', { text: a.title || 'certgen' }),
      h('thead', null, h('tr', null, h('th', { text: 'What' }), h('th', { text: 'Count' }))),
      h('tbody', null, h('tr', null, h('td', { text: 'Passing tests' }), h('td', { text: String(tests) })), finds > 0 ? h('tr', null, h('td', { text: 'Findings from the separate audit' }), h('td', { text: String(finds) })) : null)));
    const select = (grid, kind, total, n) => {
      grid.querySelectorAll('.sel').forEach((e) => e.classList.remove('sel'));
      const t = grid.children[n - 1]; if (!t) return;
      t.classList.add('sel'); status.textContent = (kind === 'test' ? 'Test ' : 'Finding ') + n + ' of ' + total;
    };
    [[gridT, 'test', tests], [gridF, 'find', finds]].forEach(([g, kind, total]) => {
      if (!g) return;
      let cur = 1;
      g.addEventListener('click', (e) => { const t = e.target.closest('.tile'); if (t) { cur = +t.dataset.n; select(g, kind, total, cur); } });
      g.addEventListener('keydown', (e) => {
        const step = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: +g.style.getPropertyValue('--cols'), ArrowUp: -g.style.getPropertyValue('--cols') }[e.key];
        if (e.key === 'Home') cur = 1; else if (e.key === 'End') cur = total; else if (step) cur = Math.max(1, Math.min(total, cur + step)); else return;
        e.preventDefault(); select(g, kind, total, cur);
      });
    });
    visual = h('div', { class: 'tiles' }, h('div', { class: 'gridwrap' }, gridT, scan), status, gridF, cap, table);
    CF.ex.whenVisible(visual, (instant) => {
      visual.classList.add('go');
      if (instant) visual.classList.add('final');
    }, 0.08);
  }

  const body = [
    visual,
    CF.ex.timeline(a.timeline, 'exhibitA'),
    CF.ex.beats(a.beats, 'exhibitA'),
    CF.ex.crossExam(a.crossExam, 'exhibitA'),
    CF.ex.verifyBox(a.verify, 'certgen'),
  ];
  return CF.ex.card('exhibitA', d, { title: a.title, tab: 'A', summary: a.summary, custody: a.custody, call: a.call, callPath: 'exhibitA.call', body });
});
