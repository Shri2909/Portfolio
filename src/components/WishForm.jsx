import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { actions, getWish, subscribeWish, wishVersionNow } from '../lib/store.js';
import { emit } from '../lib/events.js';
import { countGraphemes, cutGraphemes } from '../lib/cardRender.js';
import { wishState } from '../lib/wishState.js';
import { announce } from '../lib/announce.js';
import { sanitiseName } from '../lib/rowhash.js';

const MAX = 400, TO_MAX = 30, FROM_MAX = 20;
export const useWishVersion = () => useSyncExternalStore(subscribeWish, wishVersionNow);

// The wish step's form. Real labels, no name attributes, no form action; it never submits (a GET would put the wish in the URL).
// The wish lives in memory only. `plain` renders just the fields (used by the full-text view).
export default function WishForm({ plain = false, onMake }) {
  useWishVersion();
  const w = getWish(), W = copy.wish, id = plain ? 'ft-' : '';
  const [chip, setChip] = useState(null), [msg, setMsg] = useState(''), [counter, setCounter] = useState(countGraphemes(w.text));
  const ta = useRef(null), composing = useRef(false), lastBig = useRef(0);
  const g = countGraphemes(w.text);
  useEffect(() => { const t = setTimeout(() => setCounter(g), 1000); return () => clearTimeout(t); }, [g]);
  useEffect(() => { const e = ta.current; if (!e) return; e.style.height = 'auto'; e.style.height = Math.min(e.scrollHeight + 2, window.innerHeight * 0.4) + 'px'; }, [w.text]);
  const onText = (e) => {
    let v = e.target.value; const before = (getWish().text || '');
    if (!composing.current && countGraphemes(v) > MAX) v = cutGraphemes(v, MAX);   // text pasted beyond the cap is cut at 400
    actions.setWish({ text: v });
    if (v.length - before.length > 8) { const now = Date.now(); if (now - lastBig.current > 6000) { lastBig.current = now; emit('wish:chunk', {}); } } // detail carries no words
  };
  const onTo = (e) => actions.setWish({ to: composing.current ? e.target.value : cutGraphemes(e.target.value, TO_MAX) });
  const onFrom = (e) => { actions.setWish({ from: composing.current ? e.target.value : cutGraphemes(e.target.value, FROM_MAX) }); emit('wish:from', {}); };
  const make = () => {
    if (!(getWish().text || '').trim()) { setMsg(W.micro.empty); emit('wish:empty', {}); ta.current && ta.current.focus(); return; }
    setMsg(''); onMake && onMake();
  };
  const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); make(); } };
  const ring = Math.min(1, g / MAX), col = g <= 240 ? 'var(--leaf)' : 'var(--marigold)';
  return (
    <form className={`wish-form ${plain ? 'plain' : ''}`} onSubmit={(e) => e.preventDefault()} noValidate autoComplete="off">
      {!plain && (
        <details className="ideas">
          <summary>{rich(W.ideasOpen)}</summary>
          <div className="chips" role="group" aria-label={W.ideas.heading.replace(/<\/?hi>/g, '')}>
            <p className="chips-h">{rich(W.ideas.heading)}</p>
            {W.ideas.chips.map((c, i) => <button type="button" key={i} className="btn chip-btn" aria-pressed={chip === i} onClick={() => { setChip(chip === i ? null : i); ta.current && ta.current.focus(); }}>{rich(c)}</button>)}
          </div>
        </details>
      )}
      <label htmlFor={id + 'wish-to'}>{rich(W.form.toLabel)}</label>
      <input id={id + 'wish-to'} type="text" value={w.to || ''} onChange={onTo} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={(e) => { composing.current = false; actions.setWish({ to: cutGraphemes(e.target.value, TO_MAX) }); }} autoComplete="off" spellCheck="false" dir="auto" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} />
      <label htmlFor={id + 'wish-text'}>{rich(W.form.wishLabel)}</label>
      {!plain && chip !== null && <p className="reminder" aria-live="polite">{rich(W.ideas.chips[chip])}</p>}
      <div className="wish-box">
        <textarea id={id + 'wish-text'} ref={ta} rows={5} value={w.text || ''} onChange={onText} onKeyDown={onKey} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={(e) => { composing.current = false; onText(e); }}
          placeholder={W.form.wishPlaceholder.replace(/<\/?hi>/g, '')} autoComplete="off" spellCheck="false" dir="auto" aria-describedby={id + 'wish-count'} />
        <svg className="ring-c" viewBox="0 0 36 36" aria-hidden="true"><circle cx="18" cy="18" r="15" className="trk" /><circle cx="18" cy="18" r="15" className="val" style={{ stroke: col, strokeDasharray: `${ring * 94.2} 94.2` }} /><text x="18" y="21.500" textAnchor="middle">{g}</text></svg>
        <span id={id + 'wish-count'} className="sr-only">{tpl(X('wishCounterAria'), { n: counter })}</span>
      </div>
      <label htmlFor={id + 'wish-from'}>{rich(W.form.fromLabel)}</label>
      <input id={id + 'wish-from'} type="text" value={w.from || ''} onChange={onFrom} onCompositionStart={() => { composing.current = true; }} onCompositionEnd={(e) => { composing.current = false; actions.setWish({ from: cutGraphemes(e.target.value, FROM_MAX) }); emit('wish:from', {}); }} autoComplete="off" spellCheck="false" dir="auto" onKeyDown={(e) => e.key === 'Enter' && e.preventDefault()} />
      <p className="msg" role="status" aria-live="polite">{msg ? rich(msg) : ''}</p>
      <button type="button" className="btn btn-primary make" onClick={make}>{rich(W.submit)}</button>
      <div className="privacy">
        {plain ? <><p>{rich(W.privacy.hi)}</p><p className="en">{W.privacy.en}</p></> : (
          <><p>{rich(W.privacyShort)}</p><details><summary>{rich(W.privacyOpen)}</summary><p>{rich(W.privacy.hi)}</p><p className="en">{W.privacy.en}</p></details></>
        )}
      </div>
    </form>
  );
}
