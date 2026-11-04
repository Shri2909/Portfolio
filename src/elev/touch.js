// E7.1 + E7.3 (lean): parallax on the spring solver, the fingertip bloom, a lit bead (thumb flame) that rides the thumb of any
// native range input while it is used, the visual twin of every named haptic, and the in-session Haptics switch.
// Not built: the self-teaching nudges (hold ring, slider thumb, sheet pill) and the LampCard tracker/project swipe.
import { getState } from '../lib/store.js';
import { hooks } from '../lib/events.js';
import { spring, spring2, FEEL } from './physics.js';
import { registerEffect, isOn } from './budget.js';

let px = null, glow = null, glowT = 0, offs = [], beads = new Map(), unreg = null, buzzT = 0;
export const session = { haptics: true };
const ok = () => !getState().calm && isOn('touch');

function bloom(e) {
  if (!ok()) return;
  const t = e.target.closest && e.target.closest('.btn, .lamp-btn, button, a[href], [data-press]');
  if (!t || t.disabled) return;
  if (!glow) { glow = document.createElement('i'); glow.id = 'touch-glow'; glow.setAttribute('aria-hidden', 'true'); document.body.appendChild(glow); }
  glow.style.translate = `${e.clientX - 48}px ${e.clientY - 48}px`; glow.classList.add('on'); clearTimeout(glowT);
}
const unbloom = () => { if (glow) { glow.classList.remove('on'); } };

// thumb flame: a small bead, fixed-position, that follows the range thumb by a spring while the input is being used
function bead(inp) {
  let b = beads.get(inp); if (b) return b;
  const el = document.createElement('i'); el.className = 'thumb-flame'; el.setAttribute('aria-hidden', 'true'); document.body.appendChild(el);
  const sp = spring2(FEEL.thumb, { scale: 100, decor: false }); let ready = false;
  b = { el, sp, hide: 0, place() {
    const r = inp.getBoundingClientRect(), min = +inp.min || 0, max = +inp.max || 100, f = (inp.value - min) / (max - min || 1); // lint:ok event-time read
    const x = r.left + 14 + f * Math.max(0, r.width - 28), y = r.top + r.height / 2;
    if (!ready) { sp.set(x, y); ready = true; } else sp.to(x, y);
    el.classList.add('on'); clearTimeout(b.hide); b.hide = setTimeout(() => el.classList.remove('on'), 1400);
  } };
  sp.onUpdate((x, y) => { el.style.translate = `${x - 9}px ${y - 12}px`; const v = Math.abs(sp.x.v); el.style.scale = `${1 + Math.min(0.06, v / 6000)} 1`; });
  beads.set(inp, b); return b;
}
const onRange = (e) => { const t = e.target; if (t && t.matches && t.matches('input[type=range]') && ok()) bead(t).place(); };

function buzz(name) {
  const t = document.activeElement && document.activeElement !== document.body ? document.activeElement : null;
  if (!t || !t.setAttribute) return;
  t.setAttribute('data-buzz', name); clearTimeout(buzzT); buzzT = setTimeout(() => t.removeAttribute('data-buzz'), 260);
}

export function start() {
  unreg = registerEffect({ still: 'finished glowing frame, nothing moving (Calm)', id: 'touch', kind: 'dom', priority: 8, ms: 0.1 });
  // parallax: the spring solver replaces the 0.08 lerp (R5: parallax.js has one owner; this is the only change here)
  px = spring2(FEEL.parallax, { scale: 1 }); let first = true;
  hooks.parallaxStep = (cur, tgt) => {
    const st = getState(); if (st.calm) { cur.x = tgt.x; cur.y = tgt.y; return; }
    if (first) { px.set(cur.x, cur.y); first = false; }
    px.x.to(tgt.x); px.y.to(tgt.y); cur.x = px.x.x; cur.y = px.y.x;
  };
  hooks.buzz = buzz;
  window.addEventListener('pointerdown', bloom, { passive: true, capture: true });
  for (const ev of ['pointerup', 'pointercancel']) window.addEventListener(ev, unbloom, { passive: true, capture: true });
  document.addEventListener('input', onRange, true);
  document.addEventListener('pointerdown', onRange, true);
  offs.push(() => document.removeEventListener('input', onRange, true), () => document.removeEventListener('pointerdown', onRange, true));
}
export function stop() {
  hooks.parallaxStep = null; hooks.buzz = null; hooks.hapticsOff = false;
  window.removeEventListener('pointerdown', bloom, { capture: true });
  for (const ev of ['pointerup', 'pointercancel']) window.removeEventListener(ev, unbloom, { capture: true });
  offs.splice(0).forEach((f) => f()); beads.forEach((b) => { b.sp.destroy(); b.el.remove(); }); beads.clear();
  glow && glow.remove(); glow = null; px && px.destroy(); px = null; unreg && unreg(); unreg = null;
}
export const setHaptics = (on) => { session.haptics = on; hooks.hapticsOff = !on; };
