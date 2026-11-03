import { emit } from './events.js';

// One small global store. Only actions change state. Nothing is ever persisted.
// The wish lives in a separate slot that is excluded from every snapshot, log and URL.
const mq = typeof window !== 'undefined' && window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

const startQuality = () => {
  try {
    const nav = navigator;
    const mem = nav.deviceMemory, cores = nav.hardwareConcurrency || 4;
    if (nav.connection && nav.connection.saveData) return 'low';
    if ((mem && mem <= 2) || cores <= 2) return 'low';
    if ((mem && mem <= 4) || cores <= 4) return 'mid';
  } catch (e) { /* ignore */ }
  return 'high';
};

let state = {
  litCount: 0,
  lamps: { 1: 'unlit', 2: 'unlit', 3: 'unlit', 4: 'unlit', 5: 'unlit' },
  tone: 0,
  calm: !!(mq && mq.matches),
  quality: startQuality(),
  row: { count: 0, name: '', status: 'none', base: 0, from: '' },
  visitorLit: false, ink: false, reducedMotion: !!(mq && mq.matches), calmManual: false,
  overlay: null, evidenceCase: null, lampCard: null, // UI routing (memory only)
  progress: 0, lighting: 0,
};
const subs = new Set();
const wish = { to: '', text: '', from: '' };
const wishSubs = new Set();
const wishVersion = { n: 0 };

export const getState = () => state;
export const subscribe = (fn) => { subs.add(fn); return () => subs.delete(fn); };

function syncRoot() {
  const r = document.documentElement;
  r.dataset.tone = String(state.tone);
  r.dataset.calm = state.calm ? '1' : '0';
  r.dataset.quality = state.quality;
  r.dataset.ink = state.ink ? '1' : '0';
  r.style.setProperty('--tone', String(state.tone));
}
function set(patch) {
  const next = { ...state, ...patch };
  next.litCount = [1, 2, 3, 4, 5].filter((n) => next.lamps[n] === 'lit').length;
  next.tone = next.visitorLit ? 6 : next.litCount;
  next.calm = next.reducedMotion || next.calmManual;
  state = next;
  if (typeof document !== 'undefined') syncRoot();
  subs.forEach((f) => f());
}

let allLitTimer = 0;
export const actions = {
  startLighting(n) {
    if (state.lamps[n] === 'lit' || state.lamps[n] === 'lighting') return false;
    if (n > 1 && state.lamps[n - 1] !== 'lit') return false;
    if ([1, 2, 3, 4, 5].some((k) => state.lamps[k] === 'lighting')) return false;
    set({ lamps: { ...state.lamps, [n]: 'lighting' }, lighting: n, progress: 0 });
    emit('diya:lighting', { n, progress: 0 });
    return true;
  },
  setProgress(n, p) {
    if (state.lamps[n] !== 'lighting') return;
    state = { ...state, progress: p };
    emit('diya:lighting', { n, progress: p });
  },
  cancelLighting(n) {
    if (state.lamps[n] !== 'lighting') return;
    set({ lamps: { ...state.lamps, [n]: 'unlit' }, lighting: 0, progress: 0 });
    emit('diya:lighting', { n, progress: 0 });
  },
  finishLighting(n, x = 0, y = 0) {
    if (state.lamps[n] === 'lit') return;
    set({ lamps: { ...state.lamps, [n]: 'lit' }, lighting: 0, progress: 0 });
    emit('diya:lit', { n, x, y });
    if (state.litCount === 5) {
      clearTimeout(allLitTimer);
      allLitTimer = setTimeout(() => emit('diya:allLit', {}), state.calm ? 0 : 500);
    }
  },
  lightAll() {
    for (let n = 1; n <= 5; n++) {
      if (state.lamps[n] === 'lighting') actions.cancelLighting(n);
      if (state.lamps[n] !== 'lit') { set({ lamps: { ...state.lamps, [n]: 'lighting' } }); actions.finishLighting(n, 0, 0); }
    }
  },
  lightVisitor(x = 0, y = 0) {
    if (state.visitorLit || state.litCount < 5) return false;
    set({ visitorLit: true });
    emit('diya:visitorLit', { x, y });
    return true;
  },
  setCalm(b) { set({ calmManual: !!b }); },
  setInk(b) { set({ ink: !!b }); },
  setQuality(tier) {
    if (tier === state.quality) return;
    set({ quality: tier });
    emit('fx:setQuality', { tier });
  },
  setRow(row) { set({ row: { ...state.row, ...row } }); emit('row:changed', { count: state.row.count, name: state.row.name }); },
  setOverlay(overlay, evidenceCase = null) { set({ overlay, evidenceCase }); },
  setLampCard(n) { set({ lampCard: n }); },
  reducedMotion(b) { set({ reducedMotion: !!b }); },
  setWish(w) { Object.assign(wish, w); wishVersion.n++; wishSubs.forEach((f) => f()); },
  clearWish() { wish.to = ''; wish.text = ''; wish.from = ''; wishVersion.n++; wishSubs.forEach((f) => f()); },
  reset() { actions.clearWish(); },
};
// The wish never enters the main snapshot, any event detail, any log or the URL. This is only a version counter for the two forms.
export const getWish = () => wish;
export const subscribeWish = (f) => { wishSubs.add(f); return () => wishSubs.delete(f); };
export const wishVersionNow = () => wishVersion.n;

if (typeof window !== 'undefined') {
  if (import.meta.env.DEV) window.__ek = { actions, getState }; // development builds only
  mq && mq.addEventListener && mq.addEventListener('change', (e) => set({ reducedMotion: e.matches }));
  syncRoot();
}
