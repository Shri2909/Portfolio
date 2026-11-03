import { useRef, useState } from 'react';
import copy, { X } from '../../lib/copy.js';
import { rich } from '../../lib/rich.jsx';
import { hiOf } from '../../lib/tpl.js';
import { useStore } from '../../lib/useStore.js';

// A paper price tag that sways, then settles when flipped. The number that sparkled was the one withdrawn;
// the true one is still. The advertised-advantage bar deflates from 3.1× to 1.02×. CSS transforms only.
export default function StoryPriceTag() {
  const calm = useStore((s) => s.calm), quality = useStore((s) => s.quality);
  const [flipped, setFlipped] = useState(false), [num, setNum] = useState('3.1');
  const tag = useRef(null);
  const flip = () => {
    const to = !flipped; setFlipped(to);
    if (to) {
      if (calm) { setNum('1.02'); return; }
      const t0 = performance.now();
      const step = (now) => { const k = Math.min(1, (now - t0) / 700); const v = 3.1 + (1.02 - 3.1) * k; setNum(k < 1 ? v.toFixed(2) : '1.02'); if (k < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    } else setNum('3.1');
  };
  const bar = flipped ? 1.02 / 3.1 : 1;
  return (
    <div className="device pricetag" data-no-swipe>
      <div className="pt-grid">
        <div className="tag-wrap">
          <div ref={tag} className={`tag ${flipped ? 'flipped settled' : ''} ${quality === 'low' ? 'noshimmer' : ''}`} onClick={flip} aria-hidden="true">
            <div className="tag-face front"><i className="hole" /><b>{X('priceTagFront')}</b><span>{X('priceTagLine')}</span></div>
            <div className="tag-face back"><i className="hole" /><b>{X('priceTagBack')}</b><span>{X('priceTagChip')}</span></div>
          </div>
          <button className="btn" onClick={flip} aria-pressed={flipped}>{X('flipTag')}</button>
        </div>
        <div className="adv">
          <p className="lbl">{X('advertisedAdvantage')}</p>
          <div className="bar" role="img" aria-label={X('barAlt')}><i className={flipped ? 'deflated' : ''} style={{ transform: `scaleX(${bar})` }} /></div>
          <p className="val" aria-hidden="true">{num}×</p>
        </div>
      </div>
      <p className="caption">{rich(hiOf(copy.lamps[2].next.paras[0]))}</p>
    </div>
  );
}
