/* Small text helpers: **bold** and `code` inline markup, paragraphs, buttons and links that the sections share. */
CF.rich = function (text) {
  const out = [];
  String(text == null ? '' : text).split(/(\*\*[^*]+\*\*|`[^`]+`)/).forEach((p) => {
    if (!p) return;
    if (p.startsWith('**') && p.endsWith('**') && p.length > 4) out.push(h('strong', { text: p.slice(2, -2) }));
    else if (p.startsWith('`') && p.endsWith('`') && p.length > 2) out.push(h('code', { text: p.slice(1, -1) }));
    else out.push(p);
  });
  return out;
};

/* Paragraphs from an array of strings. A paragraph that is one bold sentence becomes a pull line. */
CF.prose = function (arr, cls) {
  return h('div', { class: 'prose' + (cls ? ' ' + cls : '') }, (arr || []).filter(has).flatMap((t) => String(t).split(/\n\s*\n/)).map((t) =>
    h('p', { class: /^\*\*[^*]+\*\*$/.test(t.trim()) ? 'pull' : null }, CF.rich(t))));
};

/* A sheet of paper with a brass index tab. */
CF.sheet = function (id, tab, labelledby, ...kids) {
  return h('section', { class: 'sheet', id, 'data-section': id, 'aria-labelledby': labelledby },
    has(tab) ? h('div', { class: 'tab', 'aria-hidden': 'true', text: tab }) : null, ...kids);
};

CF.heading = (id, text) => h('h2', { class: 'sheet-title', id: id + '-h', text });

/* External link that looks like a button. */
CF.ext = (label, url, cls) => has(label) && has(url) ? h('a', { class: cls || 'btn', href: url, target: '_blank', rel: 'noopener noreferrer', text: label }) : null;

/* The interview call to action goes to a real contact only. With no contact in the content, it renders nothing. */
CF.interview = function (label, cls) {
  const c = (CF.data && CF.data.site && CF.data.site.contact) || {};
  if (!has(label)) return null;
  if (has(c.email)) return h('a', { class: cls || 'btn primary', href: 'mailto:' + c.email, text: label });
  if (has(c.linkedin)) return CF.ext(label, c.linkedin, cls || 'btn primary');
  return null;
};

/* A button that opens a case in the evidence drawer. */
CF.receiptBtn = (r, cls) => r && has(r.label) ? h('button', { class: cls || 'btn', type: 'button', text: r.label, onclick: () => CF.openEvidence(r.case) }) : null;
