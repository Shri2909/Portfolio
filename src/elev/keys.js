// E7.6 (lean): the travelling focus flame (native outline stays the instant fallback), single-key shortcuts with the WCAG 2.1.4
// off switch, and a short Keys list. Shortcuts never fire in fields or dialogs and are never required.
// Not built: the three-link skip tray, announcements of acts on keyboard navigation (the rail already announces through aria-current).
import { getState, actions } from '../lib/store.js';
import { X } from '../lib/copy.js';
import { openText, openInvite, scrollToId } from '../lib/nav.js';
import { inviteVisible } from '../lib/mail.js';
import { spring, FEEL } from './physics.js';
import { currentAct, ACTS } from './stageDirector.js';
import { registerEffect, isOn } from './budget.js';

let ff = null, sp = null, offs = [], tgt = null, unreg = null, keysOn = true, dlg = null, hintShown = false, kbd = false;
const root = document.documentElement;
const inField = (t) => t && t.closest && t.closest('input, textarea, select, [contenteditable=""], [contenteditable="true"]');
const dialogOpen = () => !!document.querySelector('dialog[open]');

function flameRect(el) {
  const r = el.getBoundingClientRect(); // lint:ok event-time read
  return { x: r.left - 3, y: r.top - 3, w: r.width + 6, h: r.height + 6, r: getComputedStyle(el).borderRadius }; // lint:ok event-time read
}
function place(instant) {
  if (!tgt || !tgt.isConnected) return;
  const b = flameRect(tgt), calmLow = getState().calm || getState().quality === 'low' || instant;
  ff.style.borderRadius = b.r;
  if (calmLow) { for (const k of ['x', 'y', 'w', 'h']) sp[k].set(b[k]); paint(); } else for (const k of ['x', 'y', 'w', 'h']) sp[k].to(b[k]);
}
const paint = () => { ff.style.translate = `${sp.x.x}px ${sp.y.x}px`; ff.style.width = Math.max(0, sp.w.x) + 'px'; ff.style.height = Math.max(0, sp.h.x) + 'px'; };
function focusin(e) {
  const t = e.target;
  if (!ff || getState().calm || !isOn('focusflame') || dialogOpen() || !t.matches || !t.matches(':focus-visible') || matchMedia('(forced-colors: active)').matches) { root.removeAttribute('data-focusfx'); ff && ff.classList.remove('on'); return; }
  const first = !ff.classList.contains('on'); tgt = t;
  if (first) { const b = flameRect(t); for (const k of ['x', 'y', 'w', 'h']) sp[k].set(b[k]); paint(); }
  place(); ff.classList.add('on'); root.setAttribute('data-focusfx', '1');
  if (!kbd) { kbd = true; hint(); }
}
const focusout = () => { ff && ff.classList.remove('on'); root.removeAttribute('data-focusfx'); tgt = null; };
let rafT = 0; const follow = () => { if (!tgt || rafT) return; rafT = requestAnimationFrame(() => { rafT = 0; place(true); }); };

function hint() {
  if (hintShown || !matchMedia('(pointer: fine)').matches || !keysOn) return; hintShown = true;
  const h = document.createElement('p'); h.id = 'keys-hint'; h.className = 'mono'; h.setAttribute('aria-hidden', 'true'); h.textContent = X('keysHint'); document.body.appendChild(h); setTimeout(() => h.remove(), 4000);
}
const nextUnlit = () => { const s = getState(); for (let n = 1; n <= 5; n++) if (s.lamps[n] !== 'lit') return n; return 6; };
function keydown(e) {
  if (e.ctrlKey || e.metaKey || e.altKey || inField(e.target) || dialogOpen()) return;
  if (e.key === '?') { openKeys(); e.preventDefault(); return; }
  if (!keysOn) return;
  const k = e.key.toLowerCase();
  if (k === 'm') document.querySelector('#topbar [aria-controls=menu]')?.click();
  else if (k === 'c') { const b = document.getElementById('calm-corner'); b && !b.disabled && b.click(); }
  else if (k === 'l') scrollToId('lamp-' + nextUnlit());
  else if (e.key === '[' || e.key === ']') { const i = ACTS.indexOf(currentAct()), j = Math.max(0, Math.min(ACTS.length - 1, i + (e.key === ']' ? 1 : -1))); const ids = ['night', 'baithak', 'lamp-2', 'voice', 'lamp-6', 'verdict']; scrollToId(ids[j]); }
  else if (k === 'i' && inviteVisible()) openInvite();
  else if (k === 't') openText();
  else return;
  e.preventDefault();
}
export function openKeys() {
  if (!dlg) {
    dlg = document.createElement('dialog'); dlg.id = 'keys-list'; dlg.className = 'overlay'; dlg.setAttribute('aria-labelledby', 'keys-h'); dlg.setAttribute('data-e', '1');
    const row = (k, t) => `<li><kbd>${k}</kbd> ${t}</li>`;
    dlg.innerHTML = `<div class="overlay-in"><h2 id="keys-h" data-title tabindex="-1">${X('keysTitle')}</h2><ul class="keys">${row('m', X('menu'))}${row('c', X('calm'))}${row('l', X('aglaDiya'))}${row('[ ]', X('keyAct'))}${inviteVisible() ? row('i', X('inviteTitle')) : ''}${row('t', X('fullText'))}</ul><label class="keys-on"><input type="checkbox" checked> ${X('keysOn')}</label><button class="btn" type="button">${X('close') || 'Close'}</button></div>`;
    document.body.appendChild(dlg);
    dlg.querySelector('input').onchange = (e) => { keysOn = e.target.checked; };
    dlg.querySelector('button').onclick = () => dlg.close();
    dlg.addEventListener('click', (e) => { if (e.target === dlg) dlg.close(); });
  }
  dlg.querySelector('input').checked = keysOn; dlg.showModal(); dlg.querySelector('[data-title]').focus();
}
export function start() {
  unreg = registerEffect({ id: 'focusflame', kind: 'dom', priority: 8, ms: 0.1, onShed: focusout });
  ff = document.createElement('i'); ff.id = 'focus-flame'; ff.setAttribute('aria-hidden', 'true'); document.body.appendChild(ff);
  sp = {}; for (const k of ['x', 'y', 'w', 'h']) { sp[k] = spring(FEEL.focusFlame, { scale: 100, decor: false }); sp[k].onUpdate(paint); }
  document.addEventListener('focusin', focusin); document.addEventListener('focusout', focusout);
  window.addEventListener('keydown', keydown); window.addEventListener('scroll', follow, { passive: true }); window.addEventListener('resize', follow, { passive: true });
  window.addEventListener('pointerdown', focusout, { passive: true, capture: true });
}
export function stop() {
  document.removeEventListener('focusin', focusin); document.removeEventListener('focusout', focusout);
  window.removeEventListener('keydown', keydown); window.removeEventListener('scroll', follow); window.removeEventListener('resize', follow); window.removeEventListener('pointerdown', focusout, { capture: true });
  for (const k in sp) sp[k].destroy(); ff && ff.remove(); ff = null; dlg && dlg.remove(); dlg = null; root.removeAttribute('data-focusfx'); unreg && unreg();
}
