// The single entry for every elevation module. Pack authors add their module to MODULES and nowhere else.
// Each module is { name, start(), stop() }; start/stop must be idempotent and remove everything they add.
import { PERF } from '../elevation.js';
import '../styles/elev/index.css';

import { startSkip, stopSkip, installCard, uninstallCard } from './motion.js';
import * as director from './stageDirector.js';
import * as camera from './camera.js';
import * as scrollFeel from './scrollFeel.js';
import * as text from './textMotion.js';
import * as controls from './controls.js';
import * as materials from './materials.js';
import * as art from './art.js';
import * as light from './light.js';
import * as lightmap from './lightmap.js';
import * as flames from './flames.js';
import * as choreo from './choreo.js';
import * as blueprint from './blueprint.js';
import * as energy from './energy.js';
import * as governor from './governor.js';
import * as promoteMod from './promote.js';
import * as render from './render.js';
import * as hushMod from './hush.js';
import * as opening from './opening.js';
import * as wake from './wake.js';
import * as hold from './hold.js';
import * as attract from './attract.js';
import * as shared from './shared.js';
import * as setpieces from './setpieces.js';
import * as touch from './touch.js';
import * as pointer from './pointer.js';
import * as wayfinder from './wayfinder.js';
import * as menu from './menu.js';
import * as keys from './keys.js';
import * as session from './session.js';
import * as invite from './invite.js';

const MODULES = [
  { name: 'motion', start() { startSkip(); installCard(); }, stop() { stopSkip(); uninstallCard(); } },
  text, // before the director so its data-cue attributes are observed
  director, camera, scrollFeel, controls, materials, art, energy, light, lightmap, flames, choreo, blueprint, render, promoteMod, hushMod, opening, wake, hold, attract, shared, setpieces, touch, pointer, wayfinder, menu, keys, session, invite, governor,
].map((m, i) => ({ name: m.name || ['motion', 'text', 'director', 'camera', 'scrollFeel', 'controls', 'materials', 'art', 'energy', 'light', 'lightmap', 'flames', 'choreo', 'blueprint', 'render', 'promote', 'hush', 'opening', 'wake', 'hold', 'attract', 'shared', 'setpieces', 'touch', 'pointer', 'wayfinder', 'menu', 'keys', 'session', 'invite', 'governor'][i], start: m.start, stop: m.stop }));
const started = [];
let panicOn = false, panicTimer = 0;

export function disableElevation(reason) {
  const root = document.documentElement;
  root.setAttribute('data-elev', '0');
  panicOn = false;
  window.removeEventListener('error', onErr);
  window.removeEventListener('unhandledrejection', onRej);
  clearTimeout(panicTimer);
  for (const m of started.splice(0).reverse()) { try { m.stop && m.stop(); } catch { /* keep going */ } }
  const fx = document.getElementById('fx');
  if (fx && fx.getContext) { const c = fx.getContext('2d'); c && c.clearRect(0, 0, fx.width, fx.height); }
  root.dataset.elevReason = reason || '';
}

const ours = (s) => /\/elev\/|elev[-.]/i.test(String(s || ''));
const onErr = (e) => { if (panicOn && ours((e.error && e.error.stack) || e.filename)) disableElevation('error'); };
const onRej = (e) => { if (panicOn && ours(e.reason && e.reason.stack)) disableElevation('rejection'); };

export function startElevation() {
  document.documentElement.setAttribute('data-elev', '1');
  panicOn = true;
  window.addEventListener('error', onErr);
  window.addEventListener('unhandledrejection', onRej);
  panicTimer = setTimeout(() => { panicOn = false; window.removeEventListener('error', onErr); window.removeEventListener('unhandledrejection', onRej); }, 5000);
  const off = PERF ? (new URLSearchParams(location.search).get('off') || '').split(',') : []; // perf build only: bisect modules
  for (const m of MODULES) {
    if (off.includes(m.name)) continue;
    try { m.start(); started.push(m); } catch { disableElevation('init:' + m.name); return; }
  }
}
