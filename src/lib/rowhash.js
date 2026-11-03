// Row fragment: #v1.<count in base 36>[.<first name>]. Reference code from the brief.
export const NAME_MAX = 20;
export function sanitiseName(raw) {
  let s = String(raw || '');
  try { s = s.normalize('NFC'); } catch (e) { /* ignore */ }
  s = s.replace(/[^\p{L}\p{M}]/gu, '');
  const parts = (typeof Intl !== 'undefined' && Intl.Segmenter)
    ? Array.from(new Intl.Segmenter(undefined, { granularity: 'grapheme' }).segment(s), (x) => x.segment)
    : Array.from(s);
  return parts.slice(0, NAME_MAX).join('');
}
export function parseRowHash(hash) {
  const h = String(hash || '').replace(/^#/, '');
  if (!/^v/i.test(h)) return { kind: 'none' };
  if (h.length > 240) return { kind: 'bad' };
  const p = h.split('.');
  if (p[0] !== 'v1' || p.length < 2 || p.length > 3) return { kind: 'bad' };
  if (!/^[0-9a-z]{1,3}$/i.test(p[1])) return { kind: 'bad' };
  const count = parseInt(p[1].toLowerCase(), 36);
  let name = '';
  if (p[2]) { try { name = sanitiseName(decodeURIComponent(p[2])); } catch (e) { return { kind: 'bad' }; } }
  return { kind: 'ok', count, name };
}
export function formatRowHash(count, name) {
  const c = Math.max(0, Math.min(46655, Math.floor(count) || 0));
  const n = sanitiseName(name);
  return '#v1.' + c.toString(36) + (n ? '.' + encodeURIComponent(n) : '');
}
export const shownCount = (n) => (n > 99 ? '99+' : String(n));
export const plusBeyondTwelve = (n) => (n > 99 ? '87+' : String(n - 12));
