// E5.4: the relay and the rangoli. The V3 baton button and hold button keep the logic. This adds a flying ember that visits
// each lit stone and lands in the Claude Code lantern (haptic 10 ms per stone, 20 ms at the landing), and a ring pulse and 8 ms
// haptic each time the rangoli passes another hundred dots. Counts never go above 820. No people or hands in the relay.
import { tier, still, effect, alive, el } from './elev-kit.js';
import { haptic } from '../../lib/haptic.js';

export function mount(root) {
  const upper = root.querySelector('.half.upper'), btn = root.querySelector('.baton-btn'), cnt = root.querySelector('.half.lower .counter'), cv = root.querySelector('canvas.dots');
  if (!upper || !btn || !cnt || !cv) return null;
  const ember = el('i', 'ember-e'); upper.appendChild(ember); upper.style.position = upper.style.position || 'relative';
  const place = (target) => { const u = upper.getBoundingClientRect(), r = target.getBoundingClientRect(); ember.style.transform = `translate(${(r.left + r.width / 2 - u.left - 6).toFixed(1)}px,${(r.top + r.height / 2 - u.top - 6).toFixed(1)}px)`; }; // lint:ok event-time read, not per frame
  const left = () => btn.querySelector('.lantern-l.left i'), right = () => btn.querySelector('.lantern-l.right i'), stones = () => [...btn.querySelectorAll('.stone i')];
  let seen = 0, landed = false;
  const mo = new MutationObserver(() => {
    const on = btn.querySelectorAll('.stone.on').length, lit = btn.querySelector('.lantern-l.right.lit');
    if (!alive('relay') || still()) { ember.style.opacity = 0; return; }
    if (!lit && on > seen) { seen = on; ember.style.opacity = 1; place(stones()[on - 1]); haptic(10); stones()[on - 1].parentNode.classList.add('flare-e'); setTimeout(() => stones()[on - 1] && stones()[on - 1].parentNode.classList.remove('flare-e'), 450); }
    if (lit && !landed) { landed = true; place(right()); haptic(20); upper.classList.add('land-e'); setTimeout(() => { ember.style.opacity = 0; upper.classList.remove('land-e'); }, 700); }
  });
  mo.observe(btn, { subtree: true, attributes: true, attributeFilter: ['class'] });
  const lbtn = root.querySelector('.half.lower .btn'); let lastHundred = 0;
  const ring = el('i', 'pulse-e'); cv.parentNode.insertBefore(ring, cv.nextSibling);
  const mo2 = new MutationObserver(() => {
    const n = Math.min(820, parseInt((cnt.textContent.match(/\d+/) || [0])[0], 10) || 0); cv.dataset.dots = String(n);
    const h = Math.floor(n / 100); if (h > lastHundred && !still() && tier() !== 'low' && alive('relay')) { haptic(8); if (tier() === 'high') { ring.classList.remove('go'); void ring.offsetWidth; ring.classList.add('go'); } } // lint:ok event-time read, not per frame
    lastHundred = h;
    if (n >= 820) cv.parentNode.classList.add('bloom-e');
  });
  mo2.observe(cnt, { childList: true, characterData: true, subtree: true });
  const unreg = effect('relay', { priority: 6, ms: 0.6, shed: () => { ember.style.opacity = 0; }, restore: () => {} });
  return () => { mo.disconnect(); mo2.disconnect(); unreg(); ember.remove(); ring.remove(); cv.parentNode.classList.remove('bloom-e'); };
}
