// takesDiff: word-level compare of "As I said it" (raw, hand-transcribed) against "As Flow wrote it".
// Pure function, plain JavaScript, no libraries. Steps follow the brief: tokenise, key, LCS, gaps, output, verbatim guard.

// 1. TOKENISE. Split on whitespace; paragraph breaks become a breakAfter flag on the last word of the paragraph.
//    A token that is only punctuation joins the previous token's display text.
function tokenise(paragraphs) {
  const out = [];
  paragraphs.forEach((p, pi) => {
    const words = String(p).split(/\s+/).filter(Boolean);
    words.forEach((w) => {
      if (out.length && !/[\p{L}\p{N}]/u.test(w)) out[out.length - 1].display += w; // punctuation-only token
      else out.push({ display: w, key: keyOf(w), breakAfter: false });
    });
    if (pi < paragraphs.length - 1 && out.length) out[out.length - 1].breakAfter = true;
  });
  return out;
}
// 2. KEY. Lowercase, curly apostrophes to straight, strip leading and trailing non-letters/digits; inner apostrophes stay.
const keyOf = (w) => w.toLowerCase().replace(/[‘’]/g, "'").replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');

export function takesDiff(rawParagraphs, flowText) {
  const R = tokenise(rawParagraphs), F = tokenise([flowText]);
  // 3. LCS over the two key lists (suffix table), walked forward. On a tie prefer the match that uses the earlier raw word.
  const n = R.length, m = F.length, dp = Array.from({ length: n + 1 }, () => new Int32Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) dp[i][j] = R[i].key === F[j].key ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
  const matches = [];
  for (let i = 0, j = 0; i < n && j < m;) {
    if (R[i].key === F[j].key && dp[i][j] === dp[i + 1][j + 1] + 1) { matches.push([i, j]); i++; j++; }
    else if (dp[i][j + 1] >= dp[i + 1][j]) j++; else i++;
  }
  // 4. GAPS between matches: raw only = trimmed; Flow only = added; both = smoothed (raw marked trimmed, Flow marked smoothed).
  const cells = []; let pi = 0, pj = 0, changes = 0, trimmedWords = 0, smoothedWords = 0, addedWords = 0;
  const gap = (ei, ej) => {
    const raw = R.slice(pi, ei), flow = F.slice(pj, ej);
    if (raw.length && flow.length) { cells.push({ type: 'smooth', raw, flow, change: ++changes }); trimmedWords += raw.length; smoothedWords += flow.length; }
    else if (raw.length) { cells.push({ type: 'trim', raw, flow: [], change: ++changes }); trimmedWords += raw.length; }
    else if (flow.length) { cells.push({ type: 'add', raw: [], flow, change: ++changes }); addedWords += flow.length; }
  };
  for (const [i, j] of matches) { gap(i, j); cells.push({ type: 'keep', raw: [R[i]], flow: [F[j]], before: changes }); pi = i + 1; pj = j + 1; }
  gap(n, m);
  // 5. A paragraph break dissolves at the first change after it (after the last change: at the last change).
  const posOfRaw = new Map(); cells.forEach((c, ci) => c.raw.forEach((t) => posOfRaw.set(t, ci)));
  for (const t of R) {
    if (!t.breakAfter) continue;
    const ci = posOfRaw.get(t); let at = changes;
    for (let k = ci; k < cells.length; k++) if (cells[k].type !== 'keep') { at = cells[k].change; break; }
    t.dissolveAt = Math.max(1, at);
  }
  // 6. VERBATIM GUARD: re-join and compare with the sources (whitespace collapsed). If it differs, the take is plain text only.
  const collapse = (s) => String(s).replace(/\s+/g, ' ').trim();
  const rawBack = collapse(cells.flatMap((c) => c.raw.map((t) => t.display)).join(' ')), flowBack = collapse(cells.flatMap((c) => c.flow.map((t) => t.display)).join(' '));
  const plainOnly = rawBack !== collapse(rawParagraphs.join(' ')) || flowBack !== collapse(flowText);
  if (plainOnly) console.warn('takesDiff: verbatim guard failed; showing this take as plain text'); // console only, nothing visible
  return { cells, changeCount: changes, trimmedWords, smoothedWords, addedWords, plainOnly, raw: R, flow: F };
}

// The state of the morph at step k (0 = As I said it, changeCount = As Flow wrote it): what each cell shows.
export function viewAt(diff, k) {
  const M = diff.changeCount, words = [];
  for (const c of diff.cells) {
    if (c.type === 'keep') { words.push({ text: (k >= Math.max(1, c.before) ? c.flow[0] : c.raw[0]).display, kind: 'keep', brk: c.raw[0].breakAfter && k < (c.raw[0].dissolveAt || M + 1) }); continue; }
    const applied = k >= c.change;
    if (c.type === 'trim' || c.type === 'smooth') c.raw.forEach((t, i) => words.push({ text: t.display, kind: applied ? 'gone' : 'struck-' + c.type, brk: t.breakAfter && k < (t.dissolveAt || M + 1) }));
    if (c.type === 'smooth' || c.type === 'add') c.flow.forEach((t) => words.push({ text: t.display, kind: applied ? 'new' : 'hidden', brk: false }));
  }
  return words;
}
// Read-it-plainly text: trimmed and added words are marked in the text itself, not only by colour.
export function plainText(diff, labels) {
  const mark = (run, label) => `[${label}: ${run.map((t) => t.display).join(' ')}]`;
  const raw = [], flow = [];
  for (const c of diff.cells) {
    if (c.type === 'keep') { raw.push({ w: c.raw[0].display, brk: c.raw[0].breakAfter }); flow.push(c.flow[0].display); continue; }
    if (c.raw.length) raw.push({ w: mark(c.raw, labels.trimmed), brk: c.raw[c.raw.length - 1].breakAfter });
    if (c.flow.length) flow.push(mark(c.flow, c.type === 'add' ? labels.added : labels.smoothed));
  }
  const paras = []; let cur = [];
  raw.forEach((r) => { cur.push(r.w); if (r.brk) { paras.push(cur.join(' ')); cur = []; } }); if (cur.length) paras.push(cur.join(' '));
  return { rawParas: paras, flowText: flow.join(' ') };
}
