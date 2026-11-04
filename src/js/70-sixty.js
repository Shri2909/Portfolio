/* The 60-second file: a modal with the whole story in one read, linking to the same lamps and drawer. Also opens from #sixty. */
EK.openSixty = function (opener) {
  const x = EK.data && EK.data.sixty;
  if (!x) return;
  let dlg = document.getElementById('sixty');
  if (!dlg) {
    const ui = EK.data.ui || {};
    dlg = h('dialog', { class: 'plain sixty', id: 'sixty', 'aria-labelledby': 'sixty-h' },
      h('div', { class: 'dlg-in' },
        h('p', { class: 'label-brass', text: x.label }),
        h('h2', { class: 'sixty-h', id: 'sixty-h', text: x.headline }),
        EK.prose(x.body),
        has(x.line) ? h('p', { class: 'pull', text: x.line }) : null,
        h('div', { class: 'cta-row' },
          x.ctaReceipt ? h('button', { class: 'btn primary', type: 'button', text: x.ctaReceipt.label, onclick: () => { dlg.close(); EK.openEvidence(x.ctaReceipt.folder); } }) : null,
          EK.interview(x.ctaInterview, 'btn'),
          h('button', { class: 'btn', type: 'button', text: ui.close || 'Close', onclick: () => dlg.close() }))));
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
    dlg.addEventListener('close', () => { const o = dlg._opener; if (o && o.focus) o.focus(); });
    EK.trapFocus(dlg);
    document.body.appendChild(dlg);
  }
  dlg._opener = opener || null;
  if (!dlg.open) dlg.showModal();
};
EK.onReady.push(() => { if (location.hash === '#sixty') EK.openSixty(null); });
