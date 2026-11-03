// E2.6: one text animation per screen. DOM-based (V3 components stay untouched): ember-read on the first headline and
// the Verdict heading, word-rise on short kickers. Final state is always plain cream; text is real text throughout.
import { onCue } from './stageDirector.js';
import { play, DUR } from './motion.js';
import { getState } from '../lib/store.js';

let offs = [], live = null;
const canSweep = () => typeof CSS !== 'undefined' && CSS.supports && CSS.supports('background-clip', 'text') && 'registerProperty' in CSS;
const claim = (el) => { if (live && live.isConnected && live !== el) return false; live = el; return true; };
function ember(el) {
  if (getState().calm || getState().quality === 'low' || !canSweep() || !claim(el)) { el.dataset.final = '1'; return; }
  if (getState().quality === 'mid') { play(el, [{ opacity: 0, translate: '0 .4em' }, { opacity: 1, translate: '0 0' }], { dur: 900, key: 'ember' }); el.dataset.final = '1'; return; }
  el.dataset.textLive = '1'; el.classList.add('ember');
  const a = el.animate([{ '--sweep': '-20%' }, { '--sweep': '120%' }], { duration: DUR.xl, easing: 'cubic-bezier(0.83,0,0.17,1)', fill: 'forwards' });
  a.finished.then(() => { el.classList.remove('ember'); delete el.dataset.textLive; el.dataset.final = '1'; a.cancel(); live = null; }, () => { el.classList.remove('ember'); delete el.dataset.textLive; });
}
// Deviation from E2.6: kickers rise as one block (React owns their text nodes; splitting them in the DOM could break reconciliation).
function wordRise(el) {
  if (getState().calm || getState().quality === 'low') return;
  play(el, [{ opacity: 0, translate: '0 .6em' }, { opacity: 1, translate: '0 0' }], { dur: 'm', key: 'kick' });
}
export function start() {
  const h1 = document.getElementById('night-h');
  if (h1 && !h1.dataset.cue) h1.dataset.cue = 'headline';
  const verdict = document.querySelector('#verdict h2'); if (verdict && !verdict.dataset.cue) verdict.dataset.cue = 'headline';
  document.querySelectorAll('.kicker').forEach((k) => { if (!k.dataset.cue) k.dataset.cue = 'kicker'; });
  offs.push(onCue('headline', ({ el }) => ember(el)), onCue('kicker', ({ el }) => wordRise(el)));
}
export function stop() { offs.splice(0).forEach((f) => f()); live = null; document.querySelectorAll('.ember').forEach((e) => e.classList.remove('ember')); }
