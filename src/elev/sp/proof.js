// E5.10: proof chips that fly. The V3 `.proof-chip` buttons already scroll to their lamp and ring it. This adds, after the scroll
// settles, an ember that arcs from the bottom of the screen to that lamp's wick, a short ring on the lamp section, and (when
// the label is approved in ui.extra) a quiet return chip for 8 s. One flight at a time; Calm gets an outline only.
import { still, tier, emit, ticker, el, alive, effect } from './elev-kit.js';
import { lampRegistry } from '../../lib/lampRegistry.js';
import { announce } from '../../lib/announce.js';
import { scrollToId } from '../../lib/nav.js';
import copy from '../../lib/copy.js';

let flight = null;
function cancel() { if (!flight) return; flight.stop && flight.stop(); flight.nodes.forEach((n) => n.remove()); flight.timers.forEach(clearTimeout); flight = null; }
function land(n, chip) {
  const sec = document.getElementById('lamp-' + n); if (!sec) return;
  sec.setAttribute('data-proof', '1'); setTimeout(() => sec.removeAttribute('data-proof'), still() ? 2000 : 1600);
  const w = lampRegistry.wick(n); if (w && !still()) emit('bloom:set', { x: w.x, y: w.y, r: 110, i: 0.8 });
  announce('Proof: Lamp ' + n);
  const label = copy.ui && copy.ui.extra && copy.ui.extra.proofBack; if (!label) return;
  const back = document.createElement('button'); back.type = 'button'; back.className = 'btn btn-ghost proof-back-e'; back.textContent = label; sec.appendChild(back);
  const go = () => { back.remove(); chip.isConnected && (scrollToId('baithak'), setTimeout(() => chip.focus({ preventScroll: true }), 700)); };
  back.addEventListener('click', go); const key = (e) => { if (e.key === 'Escape') back.remove(); }; back.addEventListener('keydown', key);
  flight.timers.push(setTimeout(() => back.remove(), 8000)); flight.nodes.push(back);
}
function fly(chip, n) {
  cancel(); flight = { nodes: [], timers: [], stop: null };
  if (still() || tier() === 'low') { flight.timers.push(setTimeout(() => land(n, chip), 300)); return; }
  let lastY = scrollY, quiet = 0, started = false;
  const begin = () => {
    if (started) return; started = true; const w = lampRegistry.wick(n); if (!w || w.y < 0 || w.y > innerHeight) { land(n, chip); return; }
    const x0 = innerWidth / 2, y0 = innerHeight - 8, cx = (x0 + w.x) / 2, cy = Math.min(y0, w.y) - 140, dur = Math.min(900, 650 + Math.hypot(w.x - x0, w.y - y0) * 0.1), t0 = performance.now();
    const head = el('i', 'proof-ember'); document.body.appendChild(head); flight.nodes.push(head);
    const trail = tier() === 'high' ? Array.from({ length: 6 }, () => { const d = el('i', 'proof-ember tr'); document.body.appendChild(d); flight.nodes.push(d); return d; }) : [];
    const at = (k) => { const u = 1 - k; return [u * u * x0 + 2 * u * k * cx + k * k * w.x, u * u * y0 + 2 * u * k * cy + k * k * w.y]; };
    flight.stop = ticker.add((dt, now) => {
      const k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 16 * k ** 5 : 1 - (-2 * k + 2) ** 5 / 2; const [x, y] = at(e); head.style.transform = `translate(${x - 5}px,${y - 5}px)`;
      trail.forEach((d, i) => { const [tx, ty] = at(Math.max(0, e - (i + 1) * 0.035)); d.style.transform = `translate(${tx - 3}px,${ty - 3}px) scale(${1 - i * 0.14})`; d.style.opacity = 0.5 - i * 0.07; });
      if (k >= 1) { flight.stop(); flight.stop = null; head.remove(); trail.forEach((d) => d.remove()); land(n, chip); }
    });
  };
  const poll = () => { if (!flight) return; const y = scrollY; if (Math.abs(y - lastY) < 1) quiet += 60; else quiet = 0; lastY = y; if (quiet >= 120 || (flight.waited = (flight.waited || 0) + 60) > 1800) begin(); else flight.timers.push(setTimeout(poll, 60)); };
  flight.timers.push(setTimeout(poll, 120));
}
export function mount() {
  const onClick = (e) => { const chip = e.target.closest && e.target.closest('.proof-chip'); if (!chip || !alive('proof')) return; const m = /Lamp (\d)/.exec(chip.textContent); if (m) fly(chip, +m[1]); };
  const unreg = effect('proof', { priority: 6, ms: 0.3, shed: () => cancel(), restore: () => {} });
  document.addEventListener('click', onClick);
  const cancelOnInput = () => cancel(); addEventListener('wheel', cancelOnInput, { passive: true });
  return () => { document.removeEventListener('click', onClick); removeEventListener('wheel', cancelOnInput); cancel(); unreg(); };
}
