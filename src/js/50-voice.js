/* Beat 6: the voice clue. Interaction 3 compares my hand transcription with Flow's real text, word by word (the engine computes every mark). */
function compareWidget(x, ui) {
  const takes = (x.takes || []).filter((t) => has(t.raw) && has(t.output));
  if (!takes.length) return null;
  let ti = 0, stream = [], N = 0, k = 0;

  const text = h('div', { class: 'cmp-text', 'aria-hidden': 'true' });
  const range = h('input', { type: 'range', class: 'string', id: 'cmp-r', min: 0, max: 1, step: 1, value: 0, 'aria-label': ui.hint || '', oninput: () => { k = parseInt(range.value, 10); render(); } });
  const plainBox = h('div', { class: 'plain-box' });
  const takeBtns = takes.map((t, i) => h('button', { type: 'button', class: 'btn', 'aria-pressed': i === 0 ? 'true' : 'false', text: t.label || ui['take' + (i + 1)] || '', onclick: () => setTake(i) }));

  function render() {
    const parts = [];
    stream.forEach((t, i) => {
      const res = i < k;
      if (t.t === 'br') { if (!res) parts.push(h('span', { class: 'pb' })); return; }
      let cls, word;
      if (t.t === 'm') { cls = res ? 'w flow' : 'w raw'; word = res ? t.out : t.raw; }
      else if (t.t === 'ro') { cls = res ? 'w raw cut' : 'w raw'; word = t.raw; }
      else { if (!res) return; cls = 'w flow add'; word = t.out; }
      parts.push(h('span', { class: cls, text: word }), ' ');
    });
    text.textContent = '';
    put(text, parts);
    range.value = k;
    range.style.setProperty('--f', (N ? k / N : 0).toFixed(3));
    range.setAttribute('aria-valuetext', k === 0 ? (ui.raw || '') : k >= N ? (ui.flow || '') : Math.round(100 * k / N) + '% of the way from my words to Flow’s words');
  }
  /* Reserve the height of the taller end state so nothing below moves while the string is dragged. */
  function reserve() {
    if (!text.offsetParent) return;
    const keep = k;
    text.style.minHeight = '';
    let tallest = 0;
    [0, N].forEach((v) => { k = v; render(); tallest = Math.max(tallest, text.offsetHeight); });
    k = keep; render();
    text.style.minHeight = tallest + 'px';
  }
  const recorded = () => [takes[ti].label, takes[ti].recordedAt].filter(has).join(' \u00b7 ');
  function setTake(i) {
    ti = i; k = 0;
    const t = takes[i];
    stream = CF.engine.buildStream(t.raw, t.output);
    N = stream.length;
    range.max = N;
    takeBtns.forEach((b, j) => b.setAttribute('aria-pressed', String(j === i)));
    plainBox.textContent = '';
    put(plainBox,
      h('p', { class: 'lbl', text: ui.raw }), h('p', { class: 'rawp' }, t.raw.split(/\n\s*\n/).map((p) => [p, h('br')])),
      h('p', { class: 'lbl', text: ui.flow }), h('p', { class: 'outp', text: t.output }));
    const rec = root.querySelector('.rec');
    if (rec) rec.textContent = recorded();
    render();
    reserve();
  }

  const c = x.custody || {};
  const rows = [['Source', c.source], ['Tool', c.tool], ['Date', c.date], ['Recorded', null], ['Status', c.status], ['Note', c.note]];
  const custody = h('details', { class: 'chipd' },
    h('summary', { class: 'chip' }, CF.icon('magnifier'), h('span', { text: ui.chip || ui.custody || '' })),
    h('div', { class: 'custody' }, h('p', { class: 'cs-h', text: ui.custody }),
      h('dl', null, rows.map(([k2, v]) => {
        const val = k2 === 'Recorded' ? recorded() : v;
        return has(val) ? [h('dt', { text: k2 }), h('dd', { class: k2 === 'Recorded' ? 'rec' : null, text: val })] : null;
      }))));
  const root = h('div', { class: 'widget compare', role: 'group', 'aria-labelledby': 'cmp-l' },
    h('p', { class: 'label-brass', id: 'cmp-l', text: x.compareLabel }),
    takes.length > 1 ? h('div', { class: 'seg', role: 'group', 'aria-label': ui.takes || '' }, takeBtns) : null,
    h('div', { class: 'cmp-ends', 'aria-hidden': 'true' }, h('span', { text: ui.raw }), h('span', { text: ui.flow })),
    text, range,
    has(ui.hint) ? h('p', { class: 'hint', text: ui.hint }) : null,
    has(ui.legend) ? h('p', { class: 'legend', text: ui.legend }) : null,
    custody,
    h('details', { class: 'readplain' }, h('summary', { class: 'linkbtn', text: ui.readBoth || '' }), plainBox));
  setTake(0);
  CF.onReady.push(reserve);
  let rz = 0;
  window.addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(reserve, 120); });
  return root;
}

CF.defineSection('voice', (d) => {
  const x = d.voice;
  if (!x) return null;
  const body = (x.body || []).filter(has);
  const at = Math.min(body.length, Math.max(0, x.compareAfter == null ? body.length : x.compareAfter));
  const widget = compareWidget(x, d.ui || {});
  return CF.sheet('voice', '6', 'voice-h', CF.heading('voice', x.heading),
    CF.prose(body.slice(0, at)), widget, CF.prose(body.slice(at)),
    x.growthCta ? h('div', { class: 'cta-row' }, CF.receiptBtn(x.growthCta)) : null);
});
