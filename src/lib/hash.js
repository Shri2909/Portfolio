// Hash grammar. Pure functions, no DOM writes. Share fragments (#v...) are recognised, never edited.
const SCROLL = ['night', 'lamps', 'row-breathes', 'lamp-6', 'person', 'voice', 'verdict', 'wish', 'closure'];
export const isShareFragment = (hash) => /^#v/i.test(hash || '');
export function parseHash(hash) {
  const h = String(hash || '');
  if (!h || h === '#') return null;
  if (h.length > 240) return null;
  if (isShareFragment(h)) return { route: 'share' };
  const s = h.slice(1);
  if (s === 'sixty') return { route: 'sixty' };
  if (s === 'text') return { route: 'text' };
  if (s === 'evidence') return { route: 'evidence' };
  const m = /^evidence\/(c[1-8])$/.exec(s);
  if (m) return { route: 'evidence', folder: m[1] };
  if (/^evidence\//.test(s)) return { route: 'evidence' };
  if (SCROLL.includes(s)) return { route: 'scroll', id: s };
  return null;
}
