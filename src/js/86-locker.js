/* The evidence drawer: one card per repo that has a url. Tap to open the five-minute verify box. */
CF.defineSection('locker', function (d) {
  const ui = d.ui || {};
  const repos = ((d.locker && d.locker.repos) || []).filter((r) => has(r.url) && has(r.name));
  if (!repos.length) return null;
  const cards = repos.map((r, i) => {
    const vb = CF.ex.verifyBox(Object.assign({}, r.verify || {}, { repoUrl: r.url }), r.name);
    const body = h('div', { class: 'dr-body', id: 'dr-b' + i }, h('div', { class: 'dr-in' }, vb));
    const btn = h('button', { class: 'dr-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'dr-b' + i },
      h('span', { class: 'dr-n', text: r.name }), has(r.summary) ? h('span', { class: 'dr-s', text: r.summary }) : null, CF.icon('chevron'));
    const li = h('li', { class: 'drawer' }, btn, body);
    btn.addEventListener('click', () => { const o = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!o)); li.classList.toggle('open', !o); });
    return li;
  });
  return CF.sheet('locker', { title: ui.lockerTitle, cls: 'locker' }, h('ul', { class: 'drawers' }, cards));
});
