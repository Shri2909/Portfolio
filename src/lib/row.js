import { actions, getState, getWish } from './store.js';
import { emit, on } from './events.js';
import { parseRowHash, formatRowHash, sanitiseName } from './rowhash.js';

// The row lives only in the part of the web address after the hash: #v1.<count in base 36>[.<first name>].
// store.row = { count, name, base, from, status }  (base = the count that was in the link when the page opened).
let visitorDone = false;
export function initRow() {
  const r = parseRowHash(window.location.hash);
  if (r.kind === 'ok') actions.setRow({ count: r.count, name: r.name, base: r.count, from: r.name, status: 'shared' });
  else if (r.kind === 'bad') actions.setRow({ count: 0, name: '', base: 0, from: '', status: 'bad' });
  else actions.setRow({ count: 0, name: '', base: 0, from: '', status: 'none' });
}
export const rowFragment = () => { const { row } = getState(); return formatRowHash(row.count, row.name); };
// Outgoing link: origin + pathname + search + fragment for base + 1 and the sender name. Never location.href.
export function outgoingLink() {
  const { row, visitorLit } = getState();
  const count = visitorLit ? row.count : Math.min(row.base + 1, 46655);
  return window.location.origin + window.location.pathname + window.location.search + formatRowHash(count, sanitiseName(getWish().from));
}
export const siteAddress = () => window.location.host + window.location.pathname;

export function wireRow() {
  const off = [];
  // The visitor's lamp: count goes up by one, once. Rewrite the fragment without reloading or adding a history entry.
  off.push(on('diya:visitorLit', () => {
    if (visitorDone) return; visitorDone = true;
    const { row } = getState(), count = Math.min(row.base + 1, 46655), name = sanitiseName(getWish().from);
    actions.setRow({ count, name });
    try { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + formatRowHash(count, name)); } catch (e) { /* ignore */ }
    emit('row:changed', { count, name, lit: true });
  }));
  // When the sender name changes after the lamp is lit, rewrite only the name.
  off.push(on('wish:from', () => {
    if (!visitorDone) return;
    const { row } = getState(), name = sanitiseName(getWish().from);
    if (name === row.name) return;
    actions.setRow({ name });
    try { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + formatRowHash(row.count, name)); } catch (e) { /* ignore */ }
    emit('row:changed', { count: row.count, name, lit: true });
  }));
  const hc = () => {
    const h = window.location.hash;
    if (/^#v/i.test(h)) { const r = parseRowHash(h); if (r.kind === 'ok') actions.setRow({ base: r.count, from: r.name }); else if (r.kind === 'bad') actions.setRow({ status: 'bad' }); return; }
    // some other anchor: let the browser scroll, then put the row fragment back
    const { row } = getState();
    if (visitorDone || row.status === 'shared') requestAnimationFrame(() => { try { window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search + formatRowHash(row.count, row.name)); } catch (e) { /* ignore */ } });
  };
  window.addEventListener('hashchange', hc);
  return () => { off.forEach((f) => f()); window.removeEventListener('hashchange', hc); };
}
