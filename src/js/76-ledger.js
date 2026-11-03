/* Plot twists, and what I did next: case-file rows with rubber-stamp status, filter chips, counts computed from the data. */
CF.defineSection('ledger', function (d) {
  const ui = d.ui || {};
  const cases = ((d.ledger && d.ledger.cases) || []).filter((c) => has(c.title));
  if (!cases.length) return null;
  const ORDER = ['closed', 'narrowed', 'dropped', 'open'];
  const counts = {}; cases.forEach((c) => { counts[c.status] = (counts[c.status] || 0) + 1; });
  const statuses = ORDER.filter((s) => counts[s]).concat(Object.keys(counts).filter((s) => !ORDER.includes(s)));
  let filter = 'all';
  const rows = cases.map((c, i) => {
    const body = h('div', { class: 'case-body', id: 'case-b-' + c.id, role: 'region' }, h('div', { class: 'case-in' },
      has(c.what) ? h('p', null, h('span', { class: 'label-brass', text: 'The plot twist' }), ' ', h('span', { path: 'ledger.cases.' + i + '.what', text: c.what })) : null,
      has(c.resolution) ? h('p', null, h('span', { class: 'label-brass', text: 'What I did next' }), ' ', h('span', { path: 'ledger.cases.' + i + '.resolution', text: c.resolution })) : null,
      has(c.note) ? h('p', null, h('span', { class: 'label-brass', text: c.project }), ' ', h('span', { path: 'ledger.cases.' + i + '.note', text: c.note })) : null));
    const stamp = h('span', { class: 'stamp s-' + c.status, 'aria-hidden': 'true', text: String(c.status).toUpperCase() });
    const btn = h('button', { class: 'case-head', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'case-b-' + c.id },
      h('span', { class: 'cp', text: c.project || '' }), h('span', { class: 'ct', text: c.title }), stamp, h('span', { class: 'sr-only', text: String(c.status) }));
    const li = h('li', { class: 'case st-' + c.status, 'data-status': c.status }, btn, body);
    btn.addEventListener('click', () => { const o = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!o)); li.classList.toggle('open', !o); });
    return li;
  });
  const list = h('ol', { class: 'cases' }, rows);
  const live = h('p', { class: 'sr-only', 'aria-live': 'polite' });
  const chipBtns = [['all', 'All', cases.length]].concat(statuses.map((s) => [s, String(s).toUpperCase(), counts[s]])).map(([key, label, n]) => {
    const b = h('button', { class: 'fchip', type: 'button', 'aria-pressed': key === 'all' ? 'true' : 'false', 'data-f': key }, h('span', { text: label }), h('b', { text: String(n) }));
    b.addEventListener('click', () => {
      filter = key;
      chipBtns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === key)));
      rows.forEach((li) => { li.hidden = key !== 'all' && li.dataset.status !== key; });
      live.textContent = 'Showing ' + rows.filter((r) => !r.hidden).length + ' of ' + cases.length;
    });
    return b;
  });
  return CF.sheet('ledger', { title: ui.ledgerTitle, cls: 'ledger' }, h('div', { class: 'fchips', role: 'group', 'aria-label': 'Filter by status' }, chipBtns), live, list);
});
