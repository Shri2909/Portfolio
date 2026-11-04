// E6.8: which script is the wish mostly in, and what line rhythm does it need. The table holds design defaults to
// be calibrated on a device, never facts about a language. Nothing is translated or transliterated.
const SCRIPTS = ['Latin', 'Devanagari', 'Bengali', 'Gurmukhi', 'Gujarati', 'Tamil', 'Telugu', 'Kannada', 'Malayalam', 'Arabic'];
const RE = Object.fromEntries(SCRIPTS.map((s) => [s, new RegExp(`\\p{Script=${s}}`, 'gu')]));
export const METRICS = { Latin: { lh: 1.32, scale: 1 }, Devanagari: { lh: 1.55, scale: 0.94 }, Bengali: { lh: 1.55, scale: 0.94 }, Gurmukhi: { lh: 1.5, scale: 0.95 }, Gujarati: { lh: 1.5, scale: 0.95 }, Tamil: { lh: 1.5, scale: 0.92 }, Telugu: { lh: 1.7, scale: 0.9 }, Kannada: { lh: 1.7, scale: 0.9 }, Malayalam: { lh: 1.65, scale: 0.88 }, Arabic: { lh: 1.6, scale: 0.92 } };
export function dominantScript(text) {
  let best = 'Latin', n = 0;
  for (const s of SCRIPTS) { const c = (String(text || '').match(RE[s]) || []).length; if (c > n) { n = c; best = s; } }
  return best;
}
// mixed lines take the largest line-height of any script present
export function metricsFor(text) {
  let lh = 0, scale = 1, any = false;
  for (const s of SCRIPTS) if (s !== 'Latin' && RE[s].test(text)) { RE[s].lastIndex = 0; any = true; lh = Math.max(lh, METRICS[s].lh); scale = Math.min(scale, METRICS[s].scale); }
  for (const s of SCRIPTS) RE[s].lastIndex = 0;
  return any ? { lh, scale } : null; // null = V3's own rhythm for Latin
}
// does this device have a font for each non-Latin script in the text? (a tofu probe)
export function missingScripts(text, ctx) {
  const out = [];
  for (const s of SCRIPTS) {
    if (s === 'Latin') continue;
    const m = String(text || '').match(RE[s]); RE[s].lastIndex = 0;
    if (!m) continue;
    const tofu = ctx.measureText('￿').width;
    if (m.every((ch) => Math.abs(ctx.measureText(ch).width - tofu) < 0.01)) out.push(s);
  }
  return out;
}
