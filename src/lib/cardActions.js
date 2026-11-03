import copy from './copy.js';
import { tpl, plain } from './tpl.js';
import { getWish } from './store.js';
import { outgoingLink, siteAddress } from './row.js';
import { sanitiseName } from './rowhash.js';
import { renderCard, W, H } from './cardRender.js';

// Content for the card, templated from copy.json. Lines drop out when their field is empty.
export function cardContent() {
  const w = getWish(), c = copy.wish.card, to = (w.to || '').trim(), text = (w.text || '').trim(), from = sanitiseName(w.from);
  return {
    brand: c.brand, to, text, from,
    toLine: plain(tpl(c.toLine, { to })), fromLine: plain(tpl(c.fromLine, { from })),
    footerLine: plain(tpl(c.footer, { link: siteAddress() })), tag: c.tag,
  };
}
// The share text and the plain-text twin: exactly the card lines, blank lines between groups. {link} is the full link.
export function shareText() {
  const w = getWish(), c = copy.wish.card, to = (w.to || '').trim(), text = (w.text || '').trim(), from = sanitiseName(w.from);
  const g = [c.brand];
  if (to) g.push(plain(tpl(c.toLine, { to })));
  g.push(plain(tpl(c.wishLine, { wish: text })));
  if (from) g.push(plain(tpl(c.fromLine, { from })));
  g.push(plain(tpl(c.footer, { link: outgoingLink() })), c.tag);
  return g.join('\n\n');
}
// PNG export: 1080 x 1350, under 300 KB. Lean redraw if too big, then 864 x 1080 as a last step. Never blocks sharing.
const LIMIT = 307200;
const toBlob = (cv) => new Promise((res) => cv.toBlob(res, 'image/png'));
let cache = { key: '', file: null };
export async function exportCard(themeId, seed) {
  const c = cardContent(), key = [themeId, seed, c.to, c.text, c.from, outgoingLink()].join('\u0001');
  if (cache.key === key && cache.file) return cache.file;
  const make = async (w, h, lean) => { const cv = document.createElement('canvas'); cv.width = w; cv.height = h; renderCard({ canvas: cv, themeId, content: c, scale: w / W, lean, seed }); return toBlob(cv); };
  let blob = await make(W, H, false);
  if (blob && blob.size > LIMIT) blob = await make(W, H, true);
  if (blob && blob.size > LIMIT) blob = await make(864, 1080, true);
  const file = new File([blob], 'ek-diya-se-doosra-card.png', { type: 'image/png' });
  cache = { key, file }; return file;
}
export const exportSoon = (themeId, seed) => { const run = () => exportCard(themeId, seed).catch(() => {}); (window.requestIdleCallback || ((f) => setTimeout(f, 400)))(run); };

export async function copyText(text) { // clipboard, then a hidden textarea, else report failure so a selectable box can be shown
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) { /* fall through */ }
  try { const t = document.createElement('textarea'); t.value = text; t.setAttribute('readonly', ''); t.style.cssText = 'position:fixed;left:-9999px;top:0;'; document.body.appendChild(t); t.select(); const ok = document.execCommand('copy'); document.body.removeChild(t); return !!ok; } catch (e) { return false; }
}
export function download(file) {
  const url = URL.createObjectURL(file), a = document.createElement('a');
  if ('download' in a) { a.href = url; a.download = file.name; document.body.appendChild(a); a.click(); document.body.removeChild(a); }
  else window.open(url, '_blank', 'noopener');
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
// The chain: native share with the picture first; wa.me text-only second (only on a tap); copy last.
// Returns 'shared' | 'cancelled' | 'opened' | 'copied' | 'failed'
export async function sendCard(themeId, seed) {
  const text = shareText();
  let file = null; try { file = await exportCard(themeId, seed); } catch (e) { /* ignore */ }
  try {
    if (file && navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text }); return 'shared'; }
  } catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
  const enc = encodeURIComponent(text);
  if (enc.length <= 1800) { const w = window.open('https://wa.me/?text=' + enc, '_blank'); if (w) { try { w.opener = null; } catch (e) { /* ignore */ } return 'opened'; } }
  return (await copyText(text)) ? 'copied' : 'failed';
}
