// The single entry for every elevation module. Pack authors add their module to MODULES and nowhere else.
// Each module is { name, start(), stop() }; start/stop must be idempotent and remove everything they add.
import '../styles/elev/index.css';

const MODULES = []; // e.g. { name: 'motion', start, stop }
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
  for (const m of MODULES) {
    try { m.start(); started.push(m); } catch { disableElevation('init:' + m.name); return; }
  }
}
