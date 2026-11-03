import { useCallback, useEffect, useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { actions, getState } from '../lib/store.js';
import { useStore } from '../lib/useStore.js';
import { emit } from '../lib/events.js';
import { announce } from '../lib/announce.js';
import { haptic } from '../lib/haptic.js';
import { emailOf, inviteVisible } from '../lib/mail.js';
import InviteButton from './InviteButton.jsx';
import { signoffLines } from '../lib/signoff.js';
import { captionFor } from './RowFragment.jsx';

// The emotional end. When all five lamps are lit and this section is half in view, one calm sequence plays:
// caption, a row of small lit lamps, a quiet beat, a flame leaves the last lamp and lights the empty slot (the visitor's lamp),
// one soft settle, then the lines fade in. All text is in the page from the start; only opacity changes.
// This component is the only place that fires diya:visitorLit (through the store), once.
const T = { lamps: 300, beat: 1600, ignite: 2800, settle: 3000 };
export default function Closure() {
  const C = copy.closure, row = useStore((s) => s.row), lamps = useStore((s) => s.lamps), litCount = useStore((s) => s.litCount), vl = useStore((s) => s.visitorLit), calm = useStore((s) => s.calm);
  const [phase, setPhase] = useState(calm && vl ? 'done' : 'idle'); // idle | playing | done
  const sec = useRef(null), rowEl = useRef(null), slot = useRef(null), spark = useRef(null), timers = useRef([]), scrollY0 = useRef(0), fired = useRef(false);
  const base = row.base, show = Math.min(base, 7), lit5 = litCount === 5;

  const fire = useCallback(() => {
    if (fired.current) return; fired.current = true;
    const r = slot.current && slot.current.getBoundingClientRect(), x = r ? r.left + r.width / 2 : 0, y = r ? r.top + r.height / 2 : 0;
    actions.lightVisitor(x, y);
    announce(C.headings[0].replace(/<\/?hi>/g, ''));
    if (!getState().calm) emit('fx:burst', { kind: 'settle', x, y });
  }, []);
  const finish = useCallback(() => { timers.current.forEach(clearTimeout); timers.current = []; fire(); setPhase('done'); }, [fire]);

  // start when the section is half in view with five lit lamps
  useEffect(() => {
    if (phase !== 'idle' || !lit5) return;
    const el = sec.current; if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      if (getState().calm) { finish(); return; }
      setPhase('playing'); scrollY0.current = window.scrollY;
      const t = (ms, f) => timers.current.push(setTimeout(f, ms));
      t(T.beat, () => {
        const a = rowEl.current && rowEl.current.querySelectorAll('.cl-lamp.lit'), last = a && a[a.length - 1], sp = spark.current, sl = slot.current;
        if (!last || !sp || !sl) return;
        const rr = rowEl.current.getBoundingClientRect(), lr = last.getBoundingClientRect(), s2 = sl.getBoundingClientRect();
        const x0 = lr.left - rr.left + lr.width / 2, y0 = lr.top - rr.top, x1 = s2.left - rr.left + s2.width / 2, y1 = s2.top - rr.top;
        sp.animate([{ transform: `translate(${x0}px,${y0}px)`, opacity: 1 }, { transform: `translate(${(x0 + x1) / 2}px,${Math.min(y0, y1) - 28}px)`, opacity: 1 }, { transform: `translate(${x1}px,${y1}px)`, opacity: 0.2 }], { duration: 1200, easing: 'ease-in-out', fill: 'forwards' });
        last.animate([{ filter: 'brightness(1)' }, { filter: 'brightness(.8)' }, { filter: 'brightness(1)' }], { duration: 1200 });
      });
      t(T.ignite, () => fire());
      t(7600, () => setPhase('done'));
    }, { threshold: 0, rootMargin: '0px 0px -50% 0px' });
    io.observe(el); return () => io.disconnect();
  }, [phase, lit5, finish]);

  // skip: a tap on non-interactive space or a scroll of more than 40 px jumps to the end state
  useEffect(() => {
    if (phase !== 'playing') return;
    const tap = (e) => { if (!e.target.closest('a,button,input,textarea,[role=button]')) finish(); };
    const sc = () => { if (Math.abs(window.scrollY - scrollY0.current) > 40) finish(); };
    window.addEventListener('pointerdown', tap); window.addEventListener('scroll', sc, { passive: true });
    return () => { window.removeEventListener('pointerdown', tap); window.removeEventListener('scroll', sc); };
  }, [phase, finish]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => { if (vl && phase === 'idle') { fired.current = true; setPhase('done'); } }, [vl, phase]);

  const [flick, setFlick] = useState(false);
  const tapLamp = () => { if (!vl) return; haptic(10); if (calm) return; setFlick(true); setTimeout(() => setFlick(false), 600); };
  const caption = captionFor(base), so = signoffLines();
  const ended = phase === 'done', playing = phase === 'playing';
  const email = emailOf();
  return (
    <section id="closure" ref={sec} className={`sec ${ended ? 'ended' : ''} ${playing ? 'playing' : ''}`} aria-labelledby="closure-h">
      <p className="cl-cap">{rich(caption)}</p>
      <p className="fine">{copy.ui.rowFine}</p>
      <div ref={rowEl} className="cl-row" role="img" aria-label={C.altText} data-row-mount>
        <div aria-hidden="true" className="cl-lamps">
          {base > 7 && <i className="cl-dots" />}
          {[1, 2, 3, 4, 5].map((n) => <i key={n} className={`cl-lamp mine ${lamps[n] === 'lit' || ended || playing ? 'lit' : ''}`} style={{ '--i': n }} />)}
          <i className="cl-gap" />
          {Array.from({ length: show }, (_, i) => <i key={i} className="cl-lamp theirs lit" style={{ '--i': 6 + i }} />)}
          <button className="cl-slot-btn" aria-label={X('yourLampAria')} data-visitor-lamp onClick={tapLamp} tabIndex={vl ? 0 : -1}><i ref={slot} className={`cl-lamp slot ${vl ? 'lit newest' : ''} ${flick ? 'flicker' : ''}`} /></button>
          <i ref={spark} className="cl-spark" />
        </div>
      </div>
      {!lit5 && <p><button className="btn" onClick={() => actions.lightAll()}>{rich(copy.ui.lightAll)}</button></p>}
      <p className="kicker cl-fade" style={{ '--at': '3.4s' }}>{C.kicker}</p>
      <h2 id="closure-h" tabIndex={-1}><span className="cl-fade" style={{ '--at': '3.6s' }}>{rich(C.headings[0])}</span> <span className="cl-fade" style={{ '--at': '4.4s' }}>{rich(C.headings[1])}</span></h2>
      <p className="cl-fade" style={{ '--at': '5.2s' }}>{rich(C.para)}</p>
      {inviteVisible() && (
        <div className="cl-invite cl-fade" style={{ '--at': '5.8s' }}>
          <InviteButton label={C.invite.label} />
          <p className="sub">{rich(C.invite.sub)}</p>
          {email && <p className="mono addr">{email}</p>}
        </div>
      )}
      <p className="cl-links cl-fade" style={{ '--at': '6.2s' }}>
        <a href={copy.site.links.resume} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('driveAria'), { label: C.links.resume })}>{C.links.resume}</a> · <a href="#evidence" data-evidence="">{C.links.evidence}</a>
      </p>
      <div className="cl-fade" style={{ '--at': '6.6s' }}>
        <p>{rich(C.recap)}</p><p>{rich(C.closing)}</p>
      </div>
      <p className="signoff cl-fade" style={{ '--at': '7s' }}><span className="s1">{rich(so[0])}</span><br /><span className="s2"><span>{so[1]}</span></span></p>
    </section>
  );
}
