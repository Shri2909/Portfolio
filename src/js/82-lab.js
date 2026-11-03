/* The Voice Lab: n = 1, prediction written first. Every summary line is computed from the data; the only interpretation is one computed sentence. */
CF.defineSection('lab', function (d) {
  const ui = d.ui || {};
  const lab = d.lab || {};
  const tasks = (lab.tasks || []).filter((t) => t && t.typing && t.voice && isFinite(t.typing.seconds) && isFinite(t.voice.seconds));
  if (!has(lab.hypothesis) && !tasks.length) return null;

  const med = (a) => { const s = a.slice().sort((x, y) => x - y), n = s.length; return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; };
  const fmt = (v) => (Math.round(v * 10) / 10).toString();
  const kids = [];
  kids.push(has(ui.labBanner) ? h('p', { class: 'lab-banner', text: ui.labBanner }) : null);

  if (has(lab.hypothesis)) {
    kids.push(h('div', { class: 'prereg' },
      h('div', { class: 'prereg-h' }, h('span', { class: 'stamp prereg-s', 'aria-hidden': 'true', text: String(ui.preRegistered || '').toUpperCase() }),
        h('span', { class: 'sr-only', text: ui.preRegistered || '' }), has(lab.preregisteredAt) ? h('span', { class: 'prereg-d', path: 'lab.preregisteredAt', text: lab.preregisteredAt }) : null),
      h('p', { class: 'hyp', path: 'lab.hypothesis', text: lab.hypothesis }),
      has(lab.usableDefinition) ? h('p', null, h('span', { class: 'label-brass', text: 'Usable means' }), ' ', h('span', { path: 'lab.usableDefinition', text: lab.usableDefinition })) : null,
      has(lab.protocol) ? h('p', { path: 'lab.protocol', text: lab.protocol }) : null));
  }

  if (!tasks.length) {
    kids.push(has(ui.labPending) ? h('p', { class: 'pending', text: ui.labPending }) : null);
  } else {
    const N = tasks.length;
    const all = tasks.flatMap((t) => [t.typing.seconds, t.voice.seconds]);
    const max = Math.max(...all);
    const step = max <= 10 ? 2 : max <= 30 ? 5 : max <= 120 ? 20 : 60;
    const top = Math.ceil(max / step) * step || step;
    const W = 300, L = 6, R = 40;
    const X = (v) => L + (v / top) * (W - L - R);
    const rows = tasks.map((t, i) => {
      const a = t.typing.seconds, b = t.voice.seconds;
      const vFaster = b < a, tFaster = a < b;
      const icon = (u) => (u ? '✓' : '○');
      const svg = s('svg', { viewBox: '0 0 ' + W + ' 34', class: 'dumb', 'aria-hidden': 'true', focusable: 'false' },
        s('line', { x1: X(a), x2: X(b), y1: 17, y2: 17, class: 'dl' }),
        s('circle', { cx: X(a), cy: 17, r: tFaster ? 8 : 5.5, class: 'dt' + (tFaster ? ' fast' : '') }),
        s('circle', { cx: X(b), cy: 17, r: vFaster ? 8 : 5.5, class: 'dv' + (vFaster ? ' fast' : '') }),
        s('text', { x: X(a), y: 8, class: 'dn', 'text-anchor': 'middle' }, fmt(a) + 's'),
        s('text', { x: X(b), y: 32, class: 'dn', 'text-anchor': 'middle' }, fmt(b) + 's'));
      return h('li', { class: 'dumb-row' },
        h('p', { class: 'dtask', text: t.name || ('Task ' + (i + 1)) }),
        h('div', { class: 'dline' }, svg,
          h('span', { class: 'ord', text: t.order === 'voice-first' ? 'V first' : 'T first' }),
          h('span', { class: 'use' }, h('span', { class: 'ut' + (t.typing.usable ? ' yes' : ''), 'aria-hidden': 'true', text: 'T ' + icon(t.typing.usable) }), h('span', { class: 'uv' + (t.voice.usable ? ' yes' : ''), 'aria-hidden': 'true', text: 'V ' + icon(t.voice.usable) }))));
    });
    const axis = s('svg', { viewBox: '0 0 ' + W + ' 22', class: 'dax', 'aria-hidden': 'true', focusable: 'false' },
      ...Array.from({ length: Math.floor(top / step) + 1 }, (_, k) => [s('line', { x1: X(k * step), x2: X(k * step), y1: 0, y2: 5, class: 'gl' }), s('text', { x: X(k * step), y: 17, class: 'dn', 'text-anchor': 'middle' }, String(k * step))]).flat(),
      s('text', { x: W - R + 8, y: 17, class: 'dn' }, 'seconds'));
    const vFast = tasks.filter((t) => t.voice.seconds < t.typing.seconds).length;
    const vLost = tasks.filter((t) => t.voice.seconds > t.typing.seconds).length;
    const uT = tasks.filter((t) => t.typing.usable).length, uV = tasks.filter((t) => t.voice.usable).length;
    const leg = h('p', { class: 'dleg', 'aria-hidden': 'true' }, h('span', { class: 'k kt' }), ' Typing  ', h('span', { class: 'k kv' }), ' Voice  ', h('span', { class: 'kn', text: 'larger dot = faster side' }));
    const table = h('div', { class: 'sr-only' }, h('table', null, h('caption', { text: ui.labTitle || 'Voice Lab' }),
      h('thead', null, h('tr', null, ['Task', 'Order', 'Typing seconds', 'Typing usable', 'Voice seconds', 'Voice usable', 'Edits (typing / voice)'].map((x) => h('th', { text: x })))),
      h('tbody', null, tasks.map((t, i) => h('tr', null, h('td', { text: t.name || 'Task ' + (i + 1) }), h('td', { text: t.order || '' }), h('td', { text: String(t.typing.seconds) }), h('td', { text: t.typing.usable ? 'yes' : 'no' }), h('td', { text: String(t.voice.seconds) }), h('td', { text: t.voice.usable ? 'yes' : 'no' }), h('td', { text: (t.typing.edits ?? '') + ' / ' + (t.voice.edits ?? '') }))))));
    kids.push(h('div', { class: 'dumbwrap' }, leg, h('ol', { class: 'dumbs' }, rows), axis, table));
    kids.push(h('ul', { class: 'lab-sum' },
      h('li', { text: 'Median typing: ' + fmt(med(tasks.map((t) => t.typing.seconds))) + ' s. Median voice: ' + fmt(med(tasks.map((t) => t.voice.seconds))) + ' s.' }),
      h('li', { text: 'Usable: typing ' + uT + ' of ' + N + ', voice ' + uV + ' of ' + N + '.' }),
      h('li', { text: 'Tasks where voice lost: ' + vLost + ' of ' + N + '.' })));
    kids.push(h('p', { class: 'honest', text: 'Voice was faster on ' + vFast + ' of ' + N + ' tasks and usable on ' + uV + ' of ' + N + '.' }));
    if (has(lab.notes)) kids.push(h('p', { class: 'lab-notes', path: 'lab.notes', text: lab.notes }));
  }
  return CF.sheet('lab', { title: ui.labTitle, cls: 'lab' }, ...kids);
});
