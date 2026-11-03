/* Forks in the road: options as branches, the chosen one drawn in red string, the others grey and "not taken". */
CF.defineSection('decisions', function (d) {
  const ui = d.ui || {};
  const forks = ((d.decisions && d.decisions.forks) || []).filter((f) => has(f.title) && (f.options || []).length);
  if (!forks.length) return null;
  const items = forks.map((f, fi) => {
    const branches = f.options.map((o, i) => {
      const chosen = i === f.chosen;
      return h('li', { class: 'branch' + (chosen ? ' chosen' : ' skipped') },
        h('i', { class: 'bdotf', 'aria-hidden': 'true' }),
        h('p', { class: 'bt' }, h('span', { text: o }), chosen ? null : h('span', { class: 'nt', text: 'not taken' })),
        chosen && has(f.evidence) ? h('p', { class: 'bev', path: 'decisions.forks.' + fi + '.evidence', text: f.evidence }) : null);
    });
    const ico = h('i', { class: 'forkico', 'aria-hidden': 'true' });
    ico.innerHTML = '<svg viewBox="0 0 40 40" focusable="false"><path d="M20 38 V22 Q20 16 12 8" fill="none" stroke="#B8B0A0" stroke-width="3" stroke-linecap="round"/><path d="M20 38 V22 Q20 16 28 8" fill="none" stroke="#D2452E" stroke-width="3.4" stroke-linecap="round"/></svg>';
    return h('li', { class: 'fork' }, h('div', { class: 'fork-h' }, ico, h('h3', { text: f.title })),
      h('ul', { class: 'branches', 'aria-label': 'Options' }, branches),
      has(f.changeMyMind) ? h('aside', { class: 'cmm' }, h('p', { class: 'label-brass', text: 'What would change my mind' }), h('p', { path: 'decisions.forks.' + fi + '.changeMyMind', text: f.changeMyMind })) : null);
  });
  return CF.sheet('decisions', { title: ui.decisionsTitle, cls: 'forks' }, h('ol', { class: 'forklist' }, items));
});
