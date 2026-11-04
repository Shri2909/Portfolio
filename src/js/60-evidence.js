/* The evidence drawer: one folder per project, every status in plain text. */
EK.openEvidence = function (id) {
  const sec = document.getElementById('evidence');
  if (!sec) return;
  const det = id ? document.getElementById('ev-' + id) : null;
  if (det) det.open = true;
  EK.goTo(det || sec, false);
  const f = det ? det.querySelector('summary') : sec.querySelector('h2');
  if (f) { if (!f.hasAttribute('tabindex') && f.tagName !== 'SUMMARY') f.setAttribute('tabindex', '-1'); f.focus({ preventScroll: true }); }
};

function evField(label, text) {
  if (!has(text)) return null;
  return h('div', { class: 'field' }, h('h3', { text: label }), EK.prose([text]));
}

function evFolder(c, d) {
  const ui = d.ui || {}, site = d.site || {}, L = c.labels || {};
  const insp = c.inspect;
  const files = insp && (insp.files || []).length ? h('ul', { class: 'files' }, insp.files.map((f) => h('li', null, h('code', { text: f })))) : null;
  return h('details', { class: 'folder', id: 'ev-' + c.id },
    h('summary', null, h('span', { class: 'sum-t' }, h('span', { text: c.name }), has(c.blurb) ? h('span', { class: 'blurb', text: c.blurb }) : null), EK.icon('chevron')),
    h('div', { class: 'folder-body' },
      evField(L.purpose || ui.purpose, c.purpose),
      evField(L.finding || ui.finding, c.finding),
      evField(L.mine || ui.mine, c.mine),
      evField(L.results || ui.results, c.results),
      insp ? h('div', { class: 'field' }, h('h3', { text: ui.inspect }), EK.ext(insp.label, insp.url, 'repo-link'), files, has(insp.note) ? h('p', { class: 'note', text: insp.note }) : null) : null,
      (c.links || []).length ? h('div', { class: 'field' }, c.links.map((l) => EK.ext(l.label, site[l.key], 'repo-link'))) : null,
      (c.status || []).length ? h('div', { class: 'field' }, h('h3', { text: ui.status }),
        h('ul', { class: 'status' }, c.status.map(([code, what]) => h('li', null, h('span', { class: 'st', text: code }), ' ', what)))) : null,
      (c.more || []).length ? h('div', { class: 'field' }, h('h3', { text: L.more || ui.more }), h('ul', { class: 'morelist' }, c.more.map((t) => h('li', null, EK.rich(t))))) : null));
}

EK.defineSection('deeper', (d) => {
  const x = d.deeper;
  if (!x) return null;
  const site = d.site || {};
  const stories = ['lamp1', 'lamp2', 'lamp3'].filter((k) => d[k]).map((k) => h('button', { class: 'btn', type: 'button', text: x.stories + ': ' + d[k].name, onclick: () => EK.openStory(k) }));
  return EK.sheet('deeper', 'deeper-h', EK.step(x), EK.heading('deeper', x.heading),
    h('div', { class: 'cta-row deeper' }, stories,
      d.person && has(x.personal) ? h('a', { class: 'btn', href: '#person', text: x.personal }) : null,
      d.evidence && has(x.evidence) ? h('a', { class: 'btn', href: '#evidence', text: x.evidence }) : null,
      EK.ext(x.essay, site.essay)));
});

EK.defineSection('evidence', (d) => {
  const x = d.evidence;
  if (!x || !(x.folders || []).length) return null;
  const ui = d.ui || {};
  return EK.sheet('evidence', 'evidence-h',
    EK.heading('evidence', ui.evidenceTitle || '', 'sub-title'),
    has(ui.evidenceIntro) ? h('p', { class: 'sub', text: ui.evidenceIntro }) : null,
    h('div', { class: 'folders' }, x.folders.map((c) => evFolder(c, d))));
});
