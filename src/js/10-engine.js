/* The opening engine: computed, never hand-marked.
   normalize -> word-level LCS -> ONE merged token stream (MATCHED, RAW-ONLY, ADDED, BREAK). */
CF.engine = (function () {
  const norm = (w) => w.toLowerCase().replace(/[‘’]/g, "'").replace(/[^\p{L}\p{N}']/gu, '');

  function words(text) { return text.split(/\s+/).filter(Boolean); }

  /* Word-level longest common subsequence over normalized forms. Empty normalized forms never match. */
  function lcsPairs(a, b) {
    const n = a.length, m = b.length;
    const dp = Array.from({ length: n + 1 }, () => new Int16Array(m + 1));
    for (let i = n - 1; i >= 0; i--) {
      for (let j = m - 1; j >= 0; j--) {
        dp[i][j] = (a[i] && a[i] === b[j]) ? dp[i + 1][j + 1] + 1 : Math.max(dp[i + 1][j], dp[i][j + 1]);
      }
    }
    const pairs = [];
    let i = 0, j = 0;
    while (i < n && j < m) {
      if (a[i] && a[i] === b[j]) { pairs.push([i, j]); i++; j++; }
      else if (dp[i + 1][j] >= dp[i][j + 1]) i++;
      else j++;
    }
    return pairs;
  }

  /* Returns [{t:'m'|'ro'|'ad'|'br', raw, out}] in display order. */
  function buildStream(raw, output) {
    const paras = raw.split(/\n\s*\n/).map(words).filter((p) => p.length);
    const rawWords = [];
    paras.forEach((p, pi) => p.forEach((w, wi) => rawWords.push({ w, pi, last: wi === p.length - 1 && pi < paras.length - 1 })));
    const outWords = words(output);
    const pairs = lcsPairs(rawWords.map((r) => norm(r.w)), outWords.map(norm));

    const stream = [];
    const pushRaw = (r, type, out) => {
      stream.push({ t: type, raw: r.w, out: out });
      if (r.last) stream.push({ t: 'br', raw: '', out: '' });
    };
    let ri = 0, oi = 0;
    for (const [pi, pj] of pairs.concat([[rawWords.length, outWords.length]])) {
      while (ri < pi) { pushRaw(rawWords[ri], 'ro', ''); ri++; }
      while (oi < pj) { stream.push({ t: 'ad', raw: '', out: outWords[oi] }); oi++; }
      if (pi < rawWords.length) { pushRaw(rawWords[pi], 'm', outWords[pj]); ri = pi + 1; oi = pj + 1; }
    }
    return stream;
  }

  /* Pure text of the stream at frontier k: tokens with index < k are resolved. */
  function textAt(stream, k) {
    const parts = [];
    stream.forEach((t, i) => {
      const res = i < k;
      if (t.t === 'br') parts.push(res ? ' ' : '\n\n');
      else if (t.t === 'm') parts.push(res ? t.out : t.raw);
      else if (t.t === 'ro') { if (!res) parts.push(t.raw); }
      else if (res) parts.push(t.out);
    });
    return parts.join(' ').replace(/\s+/g, ' ').trim();
  }

  return { norm, words, lcsPairs, buildStream, textAt };
})();
