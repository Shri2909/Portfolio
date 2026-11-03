import { subscribe, getState } from './store.js';
// Favicon as a data: URL (no request). A lit dot per lamp; theme-color follows tone.
const GROUND = ['#0A0705', '#110B07', '#19100A', '#251609', '#35200C', '#4A2F10', '#5C3A14'];
const svg = (n) => {
  const dots = [0, 1, 2, 3, 4].map((i) => `<circle cx="${12 + i * 10}" cy="59" r="2.2" fill="${i < n ? '#FFB347' : 'none'}" stroke="#FFB347" stroke-width="1"/>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="12" fill="#16110C"/><path d="M12 36h40c0 8-8 14-20 14S12 44 12 36z" fill="#F5A623"/><rect x="29.5" y="27" width="5" height="9" rx="2" fill="#FFF3DC"/><path d="M32 6c7 8 9 12 9 17a9 9 0 0 1-18 0c0-5 2-9 9-17z" fill="#FFB347"/><path d="M32 14c3 4 4 6 4 9a4 4 0 0 1-8 0c0-3 1-5 4-9z" fill="#FFD27A"/>${dots}</svg>`;
};
export const faviconUrl = (n) => 'data:image/svg+xml,' + encodeURIComponent(svg(n));
let lastN = -1, lastTone = -1;
export function startFavicon() {
  const link = document.querySelector('link[rel="icon"]');
  const meta = document.querySelector('meta[name="theme-color"]');
  const baseTitle = document.title;
  const run = () => {
    const { litCount, tone } = getState();
    if (link && litCount !== lastN) { lastN = litCount; link.type = 'image/svg+xml'; link.href = faviconUrl(litCount); document.title = (litCount >= 1 ? `(${litCount}/5) ` : '') + baseTitle; }
    if (meta && tone !== lastTone) { lastTone = tone; meta.content = GROUND[tone] || GROUND[0]; }
  };
  subscribe(run); run();
}
