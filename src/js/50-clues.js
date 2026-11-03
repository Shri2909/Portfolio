/* Clues: small brass magnifiers peeking from sheet edges, the clue notebook (a modal dialog) and the friendly rank. No timers, no scores, nothing locked. */
CF.clues = (function () {
  let list = [], found = new Set(), btn = null, notebook = null, d = null;
  const ui = () => d.ui || {};

  const rankFor = (n) => {
    const rs = (d.ranks || []).filter((r) => has(r.title)).sort((a, b) => a.minClues - b.minClues);
    let cur = rs[0] || null;
    rs.forEach((r) => { if (r.minClues <= n) cur = r; });
    return cur ? cur.title : '';
  };
  const save = () => store.set('found', [...found]);
  function ping(el) {
    if (CF.reduced || !el) return;
    el.classList.remove('ping'); void el.offsetWidth; el.classList.add('ping');
  }

  function renderButton() {
    const n = found.size, N = list.length, rank = rankFor(n);
    btn.textContent = '';
    put(btn, h('span', { class: 'l1', text: (ui().clues || '') + ' ' + n + '/' + N }), has(rank) ? h('span', { class: 'l2', text: rank }) : null);
    btn.setAttribute('aria-label', (ui().clues || '') + ' ' + n + ' of ' + N + (has(rank) ? '. ' + (ui().rankLabel || '') + ': ' + rank : ''));
  }

  function renderNotebook() {
    const n = found.size, N = list.length, rank = rankFor(n);
    notebook.textContent = '';
    const dots = h('div', { class: 'dots', 'aria-hidden': 'true' }, list.map((c) => h('i', { class: found.has(c.id) ? 'on' : '' })));
    const items = list.map((c, i) => found.has(c.id)
      ? h('li', { class: 'found' }, h('p', { class: 'ct', text: c.text }), has(c.source) ? h('p', { class: 'cs', text: 'Verified in: ' + c.source }) : null)
      : h('li', { class: 'locked' }, h('p', { class: 'ct', text: '???' }), h('p', { class: 'cs', text: (ui().clueLocked || '') + ' ' + CF.sectionLabel(c.section) })));
    put(notebook, 
      h('div', { class: 'nb-head' }, h('h2', { id: 'nb-h', text: ui().notebookTitle || '' }),
        h('button', { class: 'btn nb-close', type: 'button', 'aria-label': 'Close', onclick: () => notebook.close() }, h('span', { 'aria-hidden': 'true', text: '×' }))),
      has(rank) ? h('p', { class: 'nb-rank', text: (ui().rankLabel || '') + ': ' + rank }) : null,
      h('div', { class: 'nb-prog' }, dots, h('span', { class: 'nb-count', text: n + '/' + N })),
      n === 0 && has(ui().notebookEmpty) ? h('p', { class: 'nb-empty', text: ui().notebookEmpty }) : null,
      n === N && has(ui().cluesDone) ? h('p', { class: 'nb-done', text: ui().cluesDone }) : null,
      h('ol', { class: 'nb-list' }, items));
  }

  function openNotebook() {
    renderNotebook();
    if (typeof notebook.showModal === 'function') notebook.showModal(); else notebook.setAttribute('open', '');
  }

  function openClue(c, tag) {
    const i = list.indexOf(c);
    const dlg = h('dialog', { class: 'clue-dlg', 'aria-labelledby': 'clue-h' });
    const wasFound = found.has(c.id);
    put(dlg, 
      h('h2', { id: 'clue-h', class: 'label-brass', text: 'Clue ' + (i + 1) + ' of ' + list.length }),
      h('p', { class: 'clue-text', text: c.text }),
      has(c.source) ? h('p', { class: 'clue-src', text: 'Verified in: ' + c.source }) : null,
      h('form', { method: 'dialog', class: 'clue-actions' },
        h('button', { class: 'btn', type: 'submit', text: ui().close || 'Close' })));
    dlg.addEventListener('close', () => { dlg.remove(); tag.focus({ preventScroll: true }); });
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    CF.trapFocus(dlg);
    document.body.appendChild(dlg);
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
    if (!wasFound) {
      const before = rankFor(found.size);
      found.add(c.id); save(); renderButton();
      ping(btn);
      if (rankFor(found.size) !== before) setTimeout(() => ping(btn), 350);
      document.dispatchEvent(new CustomEvent('cf:clue'));
    }
  }

  function init() {
    d = CF.data;
    list = (d.clues || []).filter((c) => has(c.text) && CF.visibleSections.includes(c.section));
    if (!list.length) return;
    found = new Set((store.get('found', []) || []).filter((id) => list.some((c) => c.id === id)));
    // tags peek from the top edge of each sheet (from the bottom edge of the opening dossier, whose top edge sits under the top bar)
    const perSection = {};
    list.forEach((c) => {
      const sec = document.getElementById(c.section);
      if (!sec) return;
      const k = perSection[c.section] = (perSection[c.section] || 0) + 1;
      const tag = h('button', { class: 'clue-tag' + (c.section === 'exhibit0' ? ' bottom' : ''), type: 'button', style: 'right:' + (28 + (k - 1) * 46) + 'px', 'aria-label': 'Clue ' + (list.indexOf(c) + 1) + ' of ' + list.length },
        h('span', { class: 'tag-art', 'aria-hidden': 'true' }, CF.icon('magnifier')));
      tag.addEventListener('click', () => openClue(c, tag));
      sec.appendChild(tag);
    });
    btn = h('button', { class: 'tb-btn clues', type: 'button', 'aria-haspopup': 'dialog', onclick: openNotebook });
    document.getElementById('topbar-right').prepend(btn);
    notebook = h('dialog', { class: 'notebook', 'aria-labelledby': 'nb-h' });
    notebook.addEventListener('click', (e) => { if (e.target === notebook) notebook.close(); });
    notebook.addEventListener('close', () => btn.focus({ preventScroll: true }));
    CF.trapFocus(notebook);
    document.body.appendChild(notebook);
    renderButton();
  }
  return { init, state: () => ({ found: found.size, total: list.length, rank: d ? rankFor(found.size) : '' }) };
})();
