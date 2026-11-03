/* Fair warning: up to three index cards with brass paper clips. Each unfolds in place on tap. Renders only when there is text. */
CF.defineSection('against', function (d) {
  const ui = d.ui || {};
  const reasons = ((d.against && d.against.reasons) || []).filter((r) => has(r.title) || has(r.text)).slice(0, 3);
  if (!reasons.length) return null;
  const clip = () => { const i = h('i', { class: 'paperclip', 'aria-hidden': 'true' }); i.innerHTML = '<svg viewBox="0 0 24 56" focusable="false"><path d="M8 40 V12 a6 6 0 0 1 12 0 V44 a9 9 0 0 1 -18 0 V14" fill="none" stroke="#B8872B" stroke-width="2.6" stroke-linecap="round"/></svg>'; return i; };
  const cards = reasons.map((r, i) => {
    const body = h('div', { class: 'ic-body', id: 'warn-b' + i, role: 'region', 'aria-labelledby': 'warn-t' + i }, h('div', { class: 'ic-in' }, has(r.text) ? h('p', { path: 'against.reasons.' + i + '.text', text: r.text }) : null));
    const btn = h('button', { class: 'ic-btn', type: 'button', 'aria-expanded': 'false', 'aria-controls': 'warn-b' + i },
      h('span', { class: 'ic-t', id: 'warn-t' + i, path: 'against.reasons.' + i + '.title', text: r.title || '' }), CF.icon('chevron'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      card.classList.toggle('open', !open);
    });
    const card = h('li', { class: 'icard c' + i }, clip(), btn, body);
    return card;
  });
  return CF.sheet('against', { title: ui.warningTitle, tab: 'F', cls: 'against' },
    has(ui.warningSub) ? h('p', { class: 'sub', text: ui.warningSub }) : null,
    h('ul', { class: 'icards' }, cards),
    has(ui.afterWarning) ? h('p', { class: 'after', text: ui.afterWarning }) : null);
});
