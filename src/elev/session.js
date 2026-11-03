// E7.7 (lean): the lamp-hop cut for long jumps, history discipline (Back closes the layer you
// opened; nothing in the URL changes), top-of-page loads, the idle ladder and the welcome-back pulse. All in memory.
// Not built: the footfall bob, flame lean against travel, the second-visit shortcuts, the hidden-tab title swap (off by default).
import { getState, subscribe } from '../lib/store.js';
import { hooks } from '../lib/events.js';
import { closeOverlay, closeLampCard } from '../lib/nav.js';
import { glide } from './stageDirector.js';
import { registerEffect, isOn } from './budget.js';

const root = document.documentElement;
let offs = [], prevScroll = null, unreg = null, dip = null;
// ---- scroll signals ----
// --sv / --dir were written to <html> here, but an inherited custom-property write restyles the whole tree every frame
// (measured: 89 long tasks over a scroll at 4x CPU) and nothing consumes them until the bob/lean are built. Not written.
let downT = 0; let ly = 0;
const condense = () => { const d = scrollY - ly; ly = scrollY; if (d > 6) { if (!root.hasAttribute('data-down')) root.setAttribute('data-down', ''); } else if (d < -6) root.removeAttribute('data-down'); };

// ---- the lamp-hop cut ----
function install() {
  prevScroll = hooks.scrollTo;
  hooks.scrollTo = (el) => {
    const st = getState(), top = el.getBoundingClientRect().top + scrollY - (parseFloat(getComputedStyle(root).scrollPaddingTop) || 0); // lint:ok event-time read
    if (st.calm || st.quality === 'low' || Math.abs(top - scrollY) < 2.2 * innerHeight || !isOn('hop')) return prevScroll ? prevScroll(el) : false;
    root.setAttribute('data-hop', ''); glide.on = true;
    setTimeout(() => { const b = root.style.scrollBehavior, s = root.style.scrollSnapType; root.style.scrollBehavior = 'auto'; root.style.scrollSnapType = 'none'; window.scrollTo(0, Math.max(0, top)); root.style.scrollBehavior = b; root.style.scrollSnapType = s; }, 140);
    setTimeout(() => { root.removeAttribute('data-hop'); glide.on = false; window.dispatchEvent(new Event('scroll')); }, 520); // the director re-reads the probe once the cut is over
    return true;
  };
}

// ---- history: the layers (card, overlay, menu) each push one entry; popstate is the single closer ----
const layers = []; let fromPop = false, selfBack = 0;
const closers = {
  overlay: () => closeOverlay(), card: () => closeLampCard(),
  menu: () => document.querySelector('#topbar [aria-controls=menu]')?.click(),
};
const now = () => { const s = getState(), l = []; if (s.overlay) l.push('overlay'); if (s.lampCard) l.push('card'); if (document.getElementById('menu')) l.push('menu'); return l; };
function sync() {
  const want = now();
  for (const id of want) if (!layers.includes(id)) {
    layers.push(id);
    try { if (layers.length > 2) history.replaceState({ ek: id }, '', location.href); else history.pushState({ ek: id }, '', location.href); } catch { /* ignore */ }
  }
  for (const id of [...layers]) if (!want.includes(id)) {
    layers.splice(layers.indexOf(id), 1);
    if (!fromPop && history.state && history.state.ek) { selfBack++; try { history.back(); } catch { selfBack--; } }
  }
}
function pop() {
  if (selfBack > 0) { selfBack--; return; }
  const top = layers[layers.length - 1]; if (!top) return;
  fromPop = true; try { closers[top] && closers[top](); } finally { fromPop = false; }
  setTimeout(sync, 0);
}

// ---- idle ladder ----
let lastIn = performance.now(), idleLvl = 0, idleI = 0, hidAt = 0;
const wake = () => { lastIn = performance.now(); if (idleLvl) { idleLvl = 0; root.removeAttribute('data-idle'); root.setAttribute('data-swell', ''); setTimeout(() => root.removeAttribute('data-swell'), 650); } };
const tickIdle = () => { const d = performance.now() - lastIn, l = d > 90000 ? 2 : d > 25000 ? 1 : 0; if (l !== idleLvl) { idleLvl = l; l ? root.setAttribute('data-idle', String(l)) : root.removeAttribute('data-idle'); } };
const vis = () => {
  if (document.hidden) { hidAt = performance.now(); return; }
  if (hidAt && performance.now() - hidAt > 30000 && !getState().calm) { root.setAttribute('data-return', ''); setTimeout(() => root.removeAttribute('data-return'), 1300); }
  hidAt = 0; wake();
};
const show = (e) => { if (e.persisted && !getState().calm) { root.setAttribute('data-return', ''); setTimeout(() => root.removeAttribute('data-return'), 1300); } };

export function start() {
  unreg = registerEffect({ id: 'hop', kind: 'dom', priority: 5, ms: 0.1 });
  try { history.scrollRestoration = 'manual'; if (history.state && history.state.ek) history.replaceState(null, '', location.href); } catch { /* ignore */ }
  if (!location.hash && scrollY > 0) window.scrollTo(0, 0);
  dip = document.createElement('i'); dip.id = 'hop-dip'; dip.setAttribute('aria-hidden', 'true'); document.body.appendChild(dip);
  ly = scrollY;
  install();
  window.addEventListener('scroll', condense, { passive: true });
  window.addEventListener('popstate', pop);
  offs.push(subscribe(sync), () => window.removeEventListener('scroll', condense), () => window.removeEventListener('popstate', pop));
  const mo = new MutationObserver(sync); mo.observe(document.getElementById('root'), { childList: true, subtree: true }); offs.push(() => mo.disconnect());
  for (const e of ['pointerdown', 'keydown', 'scroll', 'touchstart', 'pointermove']) { window.addEventListener(e, wake, { passive: true }); offs.push(() => window.removeEventListener(e, wake)); }
  const loop = () => { tickIdle(); idleI = setTimeout(loop, 1000); }; idleI = setTimeout(loop, 1000); // a 1 s timeout chain, not the ticker (which must be able to sleep)
  document.addEventListener('visibilitychange', vis); window.addEventListener('pageshow', show);
}
export function stop() {
  hooks.scrollTo = prevScroll; prevScroll = null; offs.splice(0).forEach((f) => f()); clearTimeout(idleI);
  document.removeEventListener('visibilitychange', vis); window.removeEventListener('pageshow', show);
  dip && dip.remove(); dip = null; glide.on = false; unreg && unreg();
  for (const a of ['data-hop', 'data-idle', 'data-swell', 'data-return', 'data-down']) root.removeAttribute(a);
  layers.length = 0;
}
