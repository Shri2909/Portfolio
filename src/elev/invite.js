// E7.8 (lean): the INVITE pill kindles once when it first appears, the sheet's rows rise one by one (CSS), and "Copied" is a ring
// of warm light plus a small ember. Only acts if the page has a contact (V3 renders no pill or sheet otherwise). Tapping the
// address copies it. Not built: perimeter conic sweep spark head, prefetch (nothing to prefetch: URLs are cheap strings).
import { X } from '../lib/copy.js';
import { emit } from '../lib/events.js';
import { getState } from '../lib/store.js';
import { haptic } from '../lib/haptic.js';
import { registerEffect, isOn } from './budget.js';

let mo = null, unreg = null, last = null, offs = [], kindled = new WeakSet(), done = false;
const pill = () => document.querySelector('#topbar [data-invite]');
function scan() {
  const p = pill(); if (p && !done && !kindled.has(p)) { kindled.add(p); done = true; if (!getState().calm && isOn('invite')) { p.setAttribute('data-kindle', ''); setTimeout(() => p.removeAttribute('data-kindle'), 900); } }
  const st = document.querySelector('#invite [role=status]');
  if (st && !st.dataset.w) { st.dataset.w = '1'; new MutationObserver(() => { if (st.textContent.trim() && last) { copied(last); } }).observe(st, { childList: true, characterData: true, subtree: true }); }
  const a = document.getElementById('invite-addr');
  if (a && !a.dataset.w) { a.dataset.w = '1'; a.setAttribute('data-copy', ''); a.addEventListener('click', () => [...document.querySelectorAll('#invite button')].find((b) => b.textContent.trim() === X('inviteCopyAddr'))?.click()); }
}
function copied(b) {
  const failed = (document.querySelector('#invite [role=status]')?.textContent || '').trim() === X('inviteCopyFail');
  b.setAttribute('data-copied', failed ? 'no' : 'yes'); setTimeout(() => b.removeAttribute('data-copied'), 1800);
  if (failed) { haptic('nudge'); return; }
  haptic('settle'); const r = b.getBoundingClientRect(); // lint:ok event-time read
  if (!getState().calm && isOn('invite')) emit('fx:burst', { kind: 'ember', x: r.left + r.width / 2, y: r.top + r.height / 2 });
}
const click = (e) => { const b = e.target.closest && e.target.closest('#invite button'); if (b) last = b; };
export function start() {
  unreg = registerEffect({ id: 'invite', kind: 'dom', priority: 5, ms: 0.1 });
  mo = new MutationObserver(scan); mo.observe(document.getElementById('root'), { childList: true, subtree: true }); scan();
  document.addEventListener('click', click, true); offs.push(() => document.removeEventListener('click', click, true));
}
export function stop() { mo && mo.disconnect(); offs.splice(0).forEach((f) => f()); unreg && unreg(); }
