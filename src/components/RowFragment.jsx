import { useEffect, useRef, useState } from 'react';
import copy from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { shownCount, plusBeyondTwelve } from '../lib/rowhash.js';

// Tiny row of lamps: up to 12 lit, then a "+" pill, then the visitor's own dark socket. Aria-hidden: the banner or caption is its twin.
export function captionFor(n) {
  const c = copy.closure.rowCaption;
  return n === 0 ? c.zero : n === 1 ? c.one : tpl(c.many, { count: shownCount(n) });
}
export function RowLamps({ count, lit, variant = 'wish' }) {
  const calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const shown = Math.min(count, 12), [on_, setOn] = useState(calm ? shown : 0);
  const el = useRef(null);
  useEffect(() => {
    if (calm || quality === 'low') { setOn(shown); return; }
    let i = 0, started = false;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) { started = true; const t = setInterval(() => { i++; setOn(i); if (i >= shown) clearInterval(t); }, 70); } });
    el.current && io.observe(el.current);
    return () => io.disconnect();
  }, [shown, calm, quality]);
  return (
    <div ref={el} className={`row-lamps ${variant}`} aria-hidden="true">
      {Array.from({ length: shown }, (_, i) => <i key={i} className={`rl-lamp ${i < on_ ? 'on' : ''}`} style={{ animationDelay: (i * 0.25) + 's' }} />)}
      {count > 12 && <b className="plus">+{plusBeyondTwelve(count)}</b>}
      <i className={`rl-lamp socket ${lit ? 'on newest' : ''}`} data-visitor-socket />
    </div>
  );
}
// Opening banner: only when the link has a count of 1 or more; the bad-link line when the link is garbled.
export function ShareBanner() {
  const row = useStore((s) => s.row);
  if (row.status === 'bad') return <p className="share-banner"><span>{rich(copy.ui.badLink)}</span></p>;
  if (row.status !== 'shared' || row.base < 1) return null;
  const t = row.from ? copy.opening.sharedWithName : copy.opening.sharedNoName;
  return (
    <div className="share-banner">
      <p>{rich(tpl(t, { name: row.from, count: shownCount(row.base) }))}</p>
      <p className="fine">{copy.ui.rowFine}</p>
      <RowLamps count={row.base} lit={false} variant="banner" />
    </div>
  );
}
export function WishRow() {
  const row = useStore((s) => s.row), vl = useStore((s) => s.visitorLit);
  return (
    <div className="wish-row">
      <RowLamps count={row.base} lit={vl} variant="wish" />
      <p className="cap">{rich(captionFor(row.base))}</p>
      <p className="fine">{copy.ui.rowFine}</p>
    </div>
  );
}
