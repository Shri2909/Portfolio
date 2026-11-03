// E3.7: a shared link shows a few far-off diyas along the rooftops (decoration only, no words, no count claim), the 60 second
// link gets aria-keyshortcuts="s" and an S key, and deep links skip the film (elev-boot.js decides that before first paint).
// Nothing is stored or sent.
import { getState } from '../lib/store.js';
import { on } from '../lib/events.js';
import { mulberry32 } from '../lib/rand.js';

let offs = [], box = null, timers = [];
const cap = () => ({ high: 12, mid: 8, low: 4 }[getState().quality] || 4);
function build() {
  box && box.remove(); box = null; timers.splice(0).forEach(clearTimeout);
  const N = Math.min(getState().row.count || 0, cap()); if (N < 1) return;
  const blocks = [...document.querySelectorAll('#skyline g.lay.far > rect')].map((r) => r.getBoundingClientRect()).filter((b) => b.width > 8 && b.top > 0 && b.top < innerHeight); // lint:ok one-shot read at start/event time
  const stage = document.getElementById('stage'); if (!blocks.length || !stage) return;
  box = document.createElement('div'); box.className = 'far-diyas'; box.setAttribute('aria-hidden', 'true'); box.setAttribute('data-e', '1'); stage.appendChild(box);
  const rnd = mulberry32(2026);
  for (let i = 0; i < N; i++) {
    const b = blocks[Math.floor(rnd() * blocks.length)], x = b.left + b.width * (0.15 + 0.7 * rnd()), d = document.createElement('i');
    d.style.cssText = `left:${x.toFixed(0)}px;top:${(b.top - 3).toFixed(0)}px`; box.appendChild(d);
    const calm = getState().calm, at = calm ? 0 : 1600 + i * 110, wait = document.documentElement.getAttribute('data-open') === 'cold' ? 0 : -1600;
    timers.push(setTimeout(() => d.classList.add('on'), Math.max(0, at + wait)));
  }
}
function sixtyKey(e) {
  if (e.key !== 's' && e.key !== 'S') return; if (e.ctrlKey || e.metaKey || e.altKey) return;
  const t = e.target; if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return; if (document.querySelector('dialog[open]')) return;
  window.dispatchEvent(new CustomEvent('sixty:open'));
}
export function start() {
  document.querySelectorAll('.sixty-link a').forEach((a) => a.setAttribute('aria-keyshortcuts', 's'));
  addEventListener('keydown', sixtyKey); offs.push(() => removeEventListener('keydown', sixtyKey));
  setTimeout(build, 200); offs.push(on('row:changed', () => build()));
  const flare = (e) => { if (e.detail && e.detail.name === 'wake:go' && box) { box.classList.add('flare'); setTimeout(() => box && box.classList.remove('flare'), 1400); } };
  addEventListener('cue:play', flare); offs.push(() => removeEventListener('cue:play', flare));
}
export function stop() { offs.splice(0).forEach((f) => f()); box && box.remove(); box = null; timers.splice(0).forEach(clearTimeout); document.querySelectorAll('.sixty-link a').forEach((a) => a.removeAttribute('aria-keyshortcuts')); }
export const name = 'shared';
