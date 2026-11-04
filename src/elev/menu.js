// E7.5 (lean): the Menu is enhanced in place, not rebuilt (V3's Menu is a React popover, and the kill-switch rule keeps V3 files
// untouched): rows enter one after another with a flame bullet igniting down the list, arrow/Home/End move between rows,
// outside tap closes, phones get a bottom sheet (CSS), the Haptics and Keys rows are added, and the Calm corner becomes a
// diya glyph (CSS; its accessible name is unchanged). Not built: a native <dialog> rebuild, the "where you are" minimap row.
import { getState } from '../lib/store.js';
import { X } from '../lib/copy.js';
import { setHaptics, session } from './touch.js';
import { openKeys } from './keys.js';
import { registerEffect, isOn } from './budget.js';

let mo = null, unreg = null, offs = [];
const rows = (m) => [...m.querySelectorAll(':scope > button, :scope > a')];
function enter(m) {
  if (m.dataset.lit) return; m.dataset.lit = '1';
  // extra rows (new labels are in ui.extra, awaiting approval)
  if (!m.querySelector('[data-k="haptics"]')) {
    const h = document.createElement('button'); h.dataset.k = 'haptics'; h.setAttribute('aria-pressed', String(session.haptics)); h.textContent = X('hapticsLabel');
    if (!/Android/i.test(navigator.userAgent)) h.hidden = true;
    h.onclick = () => { setHaptics(!session.haptics); h.setAttribute('aria-pressed', String(session.haptics)); };
    const k = document.createElement('button'); k.dataset.k = 'keys'; k.textContent = X('menuKeys'); k.onclick = () => { m.closest('header')?.querySelector('[aria-controls=menu]')?.click(); openKeys(); };
    if (matchMedia('(pointer: fine)').matches) m.insertBefore(k, m.querySelector('.look'));
    m.insertBefore(h, m.querySelector('.look'));
  }
  const rs = rows(m).filter((r) => !r.hidden);
  rs.forEach((r) => r.style.setProperty('--ri', Math.min(rs.indexOf(r), 8)));
  m.setAttribute('data-stagger', getState().calm || getState().quality === 'low' || !isOn('menu') ? 'none' : getState().quality);
  m.addEventListener('keydown', (e) => {
    const list = rows(m).filter((r) => !r.hidden), i = list.indexOf(document.activeElement);
    const go = (j) => { e.preventDefault(); list[(j + list.length) % list.length].focus(); };
    if (e.key === 'ArrowDown') go(i + 1); else if (e.key === 'ArrowUp') go(i - 1); else if (e.key === 'Home') go(0); else if (e.key === 'End') go(list.length - 1);
  });
}
const outside = (e) => {
  const m = document.getElementById('menu'); if (!m) return;
  const b = m.closest('header')?.querySelector('[aria-controls=menu]');
  if (m.contains(e.target) || (b && b.contains(e.target))) return;
  b && b.click();
};
export function start() {
  unreg = registerEffect({ still: 'finished glowing frame, nothing moving (Calm)', id: 'menu', kind: 'dom', priority: 5, ms: 0.1 });
  const scan = () => { const m = document.getElementById('menu'); if (m) enter(m); document.documentElement.toggleAttribute('data-menu', !!m); };
  mo = new MutationObserver(scan); mo.observe(document.getElementById('root'), { childList: true, subtree: true }); scan();
  document.addEventListener('pointerdown', outside, true);
  // the Calm corner: a diya glyph (tooltip from existing copy), rises after first scroll or 4 s, dims while scrolling down
  const cc = document.getElementById('calm-corner'); let t1 = 0, t2 = 0;
  const show = () => document.documentElement.setAttribute('data-corner', '1');
  const tm = setTimeout(show, 4000); window.addEventListener('scroll', show, { once: true, passive: true });
  let last = scrollY; const sc = () => { const d = scrollY - last; last = scrollY; if (d > 2) { document.documentElement.setAttribute('data-scrolling', ''); clearTimeout(t2); t2 = setTimeout(() => document.documentElement.removeAttribute('data-scrolling'), 220); } };
  window.addEventListener('scroll', sc, { passive: true });
  cc && cc.setAttribute('title', X('calmCorner'));
  offs.push(() => { clearTimeout(tm); clearTimeout(t2); window.removeEventListener('scroll', sc); window.removeEventListener('scroll', show); document.removeEventListener('pointerdown', outside, true); });
}
export function stop() {
  mo && mo.disconnect(); mo = null; offs.splice(0).forEach((f) => f()); unreg && unreg();
  document.querySelectorAll('#menu [data-k]').forEach((n) => n.remove()); const m = document.getElementById('menu'); m && delete m.dataset.lit;
  ['data-menu', 'data-corner', 'data-scrolling'].forEach((a) => document.documentElement.removeAttribute(a));
}
