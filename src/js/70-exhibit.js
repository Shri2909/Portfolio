/* Shared exhibit parts: custody strip, Make Your Call, the four beats, cross-exam, verify box, a timeline, run-once-when-seen. */
CF.ex = (function () {
  const ui = () => (CF.data && CF.data.ui) || {};

  function custodyStrip(c) {
    if (!c) return null;
    const rows = [['Source', c.source], ['Tool', c.tool], ['Date', c.date], ['Status', c.status], ['Note', c.note]].filter((r) => has(r[1]));
    if (!rows.length) return null;
    return h('div', { class: 'custody-strip' }, h('p', { class: 'cs-h', text: ui().custody || '' }),
      h('dl', null, rows.map((r) => [h('dt', { text: r[0] }), h('dd', { text: r[1] })])),
      c.verified === true ? h('span', { class: 'stamp-verified', text: 'VERIFIED' }) : null);
  }

  /* run fn once when the element is mostly in view (immediately under reduced motion) */
  function whenVisible(el, fn, threshold) {
    if (CF.reduced || !window.IntersectionObserver) { fn(true); return; }
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { io.disconnect(); fn(false); } }, { threshold: threshold || 0.35 });
    io.observe(el);
  }

  /* MAKE YOUR CALL: guess first, then the reveal. `open()` is called when the card should open. */
  function makeCall(call, id, open, path) {
    if (!call || !has(call.question) || !(call.options || []).length) return null;
    const saved = store.get('call:' + id, null);
    const reveal = h('p', { class: 'call-reveal', 'aria-live': 'polite', path: path ? path + '.reveal' : undefined });
    const btns = call.options.map((o, i) => h('button', { class: 'opt', type: 'button', 'data-i': String(i) }, h('span', { class: 'ol', text: String.fromCharCode(65 + i) }), h('span', { text: o })));
    const skip = h('button', { class: 'linkbtn', type: 'button', text: ui().justShow || '' });
    const box = h('div', { class: 'call' },
      h('p', { class: 'label-brass', text: ui().makeCall || '' }),
      h('p', { class: 'call-q', id: id + '-cq', text: call.question }),
      h('div', { class: 'opts', role: 'group', 'aria-labelledby': id + '-cq' }, btns),
      reveal, has(ui().justShow) ? h('p', { class: 'skiprow' }, skip) : null);
    function answer(pick, instant) {
      btns.forEach((b, i) => { b.disabled = true; b.classList.toggle('right', i === call.answerIndex); b.classList.toggle('pick', i === pick && pick !== call.answerIndex); if (i === pick) b.setAttribute('aria-pressed', 'true'); });
      reveal.textContent = call.reveal || '';
      box.classList.add('answered');
      skip.parentNode && skip.parentNode.remove();
      if (pick !== null) store.set('call:' + id, pick);
      setTimeout(open, CF.reduced || instant ? 0 : 700);
    }
    btns.forEach((b, i) => b.addEventListener('click', () => answer(i)));
    skip.addEventListener('click', () => { box.classList.add('skipped'); skip.parentNode.remove(); setTimeout(open, 0); });
    if (saved !== null && saved !== undefined) { answer(saved, true); }
    return box;
  }

  /* the four beats; each hidden when empty. Labels are the spec's. */
  function beats(b, base) {
    if (!b) return null;
    const rows = [['did', 'What I did'], ['didnt', "What didn't work"], ['learned', 'What I learned'], ['next', 'What I did next']].filter((r) => has(b[r[0]]));
    if (!rows.length) return null;
    return h('div', { class: 'beats' }, rows.map((r) => h('div', { class: 'beat' }, h('h3', { class: 'label-brass', text: r[1] }),
      b[r[0]].split(/\n\s*\n/).map((p) => h('p', { path: base + '.beats.' + r[0], text: p.trim() })))));
  }

  /* cross-exam accordion: items with an empty answer are hidden */
  function crossExam(items, base) {
    const list = (items || []).map((x, i) => ({ x, i })).filter((o) => has(o.x.a) && has(o.x.q));
    if (!list.length) return null;
    return h('div', { class: 'xexam' }, h('h3', { class: 'xe-h', text: ui().crossExam || '' }),
      list.map(({ x, i }) => {
        const body = h('div', { class: 'xe-body' }, h('div', { class: 'xe-in' }, h('p', { path: base + '.crossExam.' + i + '.a', text: x.a })));
        const btn = h('button', { class: 'xe-btn', type: 'button', 'aria-expanded': 'false' }, h('span', { path: base + '.crossExam.' + i + '.q', text: x.q }), CF.icon('chevron'));
        const item = h('div', { class: 'xe-item' }, btn, body);
        btn.addEventListener('click', () => { const o = btn.getAttribute('aria-expanded') === 'true'; btn.setAttribute('aria-expanded', String(!o)); item.classList.toggle('open', !o); });
        return item;
      }));
  }

  /* verify box: steps, a command with a Copy button, expected output, repo link. Hidden when nothing is filled. */
  function verifyBox(v, name) {
    if (!v) return null;
    const url = v.repoUrl || v.url;
    if (!has(v.steps) && !has(v.command) && !has(v.expected) && !has(url)) return null;
    const copyBtn = h('button', { class: 'btn copy', type: 'button', text: ui().copy || 'Copy' });
    const pre = h('pre', { class: 'cmd' }, h('code', { text: v.command || '' }));
    copyBtn.addEventListener('click', async () => {
      let ok = false;
      try { await navigator.clipboard.writeText(v.command); ok = true; } catch (e) { ok = false; }
      if (!ok) { // clipboard refused: select the text so it can be copied by hand
        try { const r = document.createRange(); r.selectNodeContents(pre); const s = window.getSelection(); s.removeAllRanges(); s.addRange(r); } catch (e) { /* nothing more to do */ }
      }
      copyBtn.textContent = ok ? (ui().copied || 'Copied') : (ui().copy || 'Copy');
      if (ok) setTimeout(() => { copyBtn.textContent = ui().copy || 'Copy'; }, 2000);
    });
    return h('div', { class: 'verify' }, h('h3', { class: 'xe-h', text: ui().verify || '' }),
      has(v.steps) ? h('ol', { class: 'v-steps' }, v.steps.map((s) => h('li', { text: s }))) : null,
      has(v.command) ? h('div', { class: 'cmdrow' }, pre, has(ui().copy) ? copyBtn : null) : null,
      has(v.expected) ? h('p', { class: 'v-exp' }, h('span', { class: 'label-brass', text: 'Expected' }), ' ', h('code', { text: v.expected })) : null,
      has(url) ? h('p', null, h('a', { class: 'repo-link', href: url, target: '_blank', rel: 'noopener', text: (name ? name + ': ' : '') + url })) : null);
  }

  /* vertical red-string timeline; the string draws itself when seen */
  function timeline(items, base) {
    const list = (items || []).filter((t) => has(t.label) || has(t.text));
    if (!list.length) return null;
    const ol = h('ol', { class: 'tl' }, list.map((t, i) => h('li', null, h('i', { class: 'tl-dot', 'aria-hidden': 'true' }),
      has(t.date) ? h('p', { class: 'tl-d', text: t.date }) : null,
      has(t.label) ? h('p', { class: 'tl-l', path: base + '.timeline.' + i + '.label', text: t.label }) : null,
      has(t.text) ? h('p', { class: 'tl-t', path: base + '.timeline.' + i + '.text', text: t.text }) : null)));
    const wrap = h('div', { class: 'tlwrap' }, h('i', { class: 'tl-string', 'aria-hidden': 'true' }), ol);
    whenVisible(wrap, () => wrap.classList.add('drawn'), 0.2);
    return wrap;
  }

  /* an exhibit card: title, summary, custody, [call], body (opens after the call) */
  function card(id, d, opts) {
    const ui_ = ui();
    const body = h('div', { class: 'ex-body', id: id + '-body' }, h('div', { class: 'ex-in' }, opts.body));
    const sheet = CF.sheet(id, { title: opts.title, tab: opts.tab, cls: 'exhibit', labelledby: opts.title ? undefined : id + '-h2' });
    const open = () => { if (sheet.classList.contains('opened')) return; sheet.classList.add('opened'); body.removeAttribute('inert'); document.dispatchEvent(new CustomEvent('cf:layout')); if (opts.onOpen) opts.onOpen(); };
    body.setAttribute('inert', '');
    const call = makeCall(opts.call, id, open, opts.callPath);
    const sum = has(opts.summary) ? h('p', { class: 'ex-sum', path: id + '.summary', text: opts.summary }) : null;
    put(sheet, sum, custodyStrip(opts.custody), call, body, CF.pencil(opts.custody && opts.custody.source));
    if (!call) open();
    CF.whenVisible = whenVisible;
    sheet.openCard = open;
    return sheet;
  }
  CF.whenVisible = whenVisible;
  return { custodyStrip, makeCall, beats, crossExam, verifyBox, timeline, card, whenVisible };
})();
