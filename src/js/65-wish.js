/* Your turn: one short wish for one real person. Made in this tab only: nothing is uploaded, saved or stored. Making the card lights the visitor's lamp. */
EK.defineSection('wish', (d) => {
  const x = d.wish;
  if (!x) return null;
  const forIn = h('input', { type: 'text', id: 'wish-for', maxlength: 40, autocomplete: 'off' });
  const wishIn = h('textarea', { id: 'wish-text', rows: 4, maxlength: 400, placeholder: x.wishPlaceholder || '' });
  const fromIn = h('input', { type: 'text', id: 'wish-from', maxlength: 40, autocomplete: 'given-name' });
  const msg = h('p', { class: 'wish-msg', role: 'status', 'aria-live': 'polite' });
  const out = h('div', { class: 'wish-out', hidden: true });
  const visitor = h('div', { class: 'visitor', 'aria-hidden': 'true' }, EK.diya('v'));
  const clean = (t) => String(t || '').replace(/\s+/g, ' ').trim();
  const pageLink = () => location.href.split('#')[0];

  function cardText() {
    const to = clean(forIn.value), me = clean(fromIn.value), wish = String(wishIn.value || '').trim();
    const lines = [x.cardTitle, ''];
    if (to) lines.push((x.cardFor || '').replace('{name}', to), '');
    lines.push('"' + wish + '"', '');
    if (me) lines.push('— ' + me, '');
    lines.push((x.cardTail || '').replace('{link}', pageLink()), '', x.cardEn);
    return lines.join('\n');
  }
  function copy(text) {
    const done = () => { msg.textContent = x.copied; };
    const fail = () => { msg.textContent = x.copyFail; };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(done, fail);
    else {
      const ta = h('textarea', { 'aria-hidden': 'true', style: 'position:fixed;opacity:0' }); ta.value = text; document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy') ? done() : fail(); } catch (e) { fail(); }
      ta.remove();
    }
  }
  function make(e) {
    e.preventDefault();
    if (!clean(wishIn.value)) { msg.textContent = x.empty; wishIn.focus(); return; }
    const to = clean(forIn.value), me = clean(fromIn.value), wish = clean(wishIn.value);
    const text = cardText();
    out.textContent = '';
    put(out,
      h('h3', { class: 'mini big lit-head', text: x.litHeading }),
      h('blockquote', { class: 'wish-card' },
        h('p', { class: 'wc-title', text: x.cardTitle }),
        to ? h('p', { text: (x.cardFor || '').replace('{name}', to) }) : null,
        h('p', { class: 'wc-wish', text: '“' + wish + '”' }),
        me ? h('p', { class: 'wc-from', text: '— ' + me }) : null,
        h('p', { class: 'wc-tail', text: (x.cardTail || '').replace('{link}', pageLink()) }),
        h('p', { class: 'wc-en', text: x.cardEn })),
      h('p', { class: 'wish-ready', text: x.ready }),
      h('div', { class: 'cta-row' },
        h('a', { class: 'btn primary', href: 'https://wa.me/?text=' + encodeURIComponent(text), target: '_blank', rel: 'noopener noreferrer', text: x.whatsapp }),
        h('button', { class: 'btn', type: 'button', text: x.copyText, onclick: () => copy(text) }),
        h('button', { class: 'btn', type: 'button', text: x.copyLink, onclick: () => copy(pageLink()) }),
        h('button', { class: 'btn', type: 'button', text: x.change, onclick: () => { out.hidden = true; form.hidden = false; wishIn.focus(); } })),
      h('p', { class: 'note-line', text: x.under }));
    out.hidden = false; form.hidden = true; msg.textContent = '';
    EK.lamps.lightVisitor();
    out.querySelector('h3').setAttribute('tabindex', '-1'); out.querySelector('h3').focus({ preventScroll: false });
  }

  const ideas = (x.ideas || []).filter(has).map((t) => h('button', { type: 'button', class: 'idea', text: t, onclick: () => { forIn.focus(); msg.textContent = t; } }));
  const form = h('form', { class: 'wish-form', onsubmit: make, novalidate: true },
    ideas.length ? h('div', { class: 'ideas', role: 'group', 'aria-label': x.ideasLabel }, h('p', { class: 'lbl', text: x.ideasLabel }), ideas) : null,
    h('label', { class: 'lbl', for: 'wish-for', text: x.forLabel }), forIn,
    h('label', { class: 'lbl', for: 'wish-text', text: x.wishLabel }), wishIn,
    h('label', { class: 'lbl', for: 'wish-from', text: x.fromLabel }), fromIn,
    h('div', { class: 'cta-row' }, h('button', { type: 'submit', class: 'btn primary', text: x.make })),
    msg);
  return EK.sheet('wish', 'wish-h', EK.kicker(x.kicker), EK.heading('wish', x.heading),
    h('div', { class: 'wish-top' }, h('div', { class: 'wish-intro' }, EK.prose(x.intro), h('p', { class: 'en-line', text: x.english })), visitor),
    form, out,
    h('p', { class: 'privacy' }, x.privacy, h('br'), h('em', { text: x.privacyEn })));
});
