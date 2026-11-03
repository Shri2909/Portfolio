import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { emit } from '../lib/events.js';
import { openLampCard, scrollToId } from '../lib/nav.js';
import GuessAudit from './story/GuessAudit.jsx';
import LateReplySlider from './story/LateReplySlider.jsx';
import StoryPriceTag from './story/StoryPriceTag.jsx';
import StoryHandoff from './story/StoryHandoff.jsx';
import StoryCutoffClock from './story/StoryCutoffClock.jsx';

const DEVICE = { 1: GuessAudit, 2: LateReplySlider, 3: StoryPriceTag, 4: StoryHandoff, 5: StoryCutoffClock };
// One lamp, one screen, on the page (no sheet): kicker, title, one hook sentence, the interaction, one "what I did next" sentence,
// one Fair warning, a status chip, and "Poora kissa" (the receipt sheet, v2 text word for word).
export default function LampStop({ n }) {
  const l = copy.lamps[n - 1], st = l.stop, lit = useStore((s) => s.lamps[n] === 'lit'), prevLit = useStore((s) => n === 1 || s.lamps[n - 1] === 'lit'), all = useStore((s) => s.litCount === 5);
  const Device = DEVICE[n], project = copy.ui.extra.projectNames[n - 1];
  return (
    <section id={`lamp-${n}`} className={`sec stop ${lit ? 'is-lit' : ''}`} aria-labelledby={`lamp-${n}-h`}>
      <div className="panel">
        {n === 2 && <><p className="kicker">{copy.terrace.kicker}</p><p className="entry">{rich(copy.terrace.entry)}</p></>}
        <p className="kicker">{l.kicker}</p>
        <h2 id={`lamp-${n}-h`} tabIndex={-1}>{rich(l.title)}</h2>
        <p className="hook">{rich(st.hook)}</p>
        {Device && <Device />}
        <h3>{rich(st.nextHeading)}</h3>
        <p>{rich(st.next)}</p>
        <h3>{l.warning.heading}</h3>
        <p>{st.warning}</p>
        <p className="chip-line"><span className="chip-pill">{st.chip}</span></p>
        {st.twin && n !== 1 && <p className="sr-only">{st.twin}</p>}
        <p className="stop-foot">
          {!lit && n > 1 && <button className="btn btn-primary" onClick={() => emit('lamp:request', { n })}>{rich(tpl(X('passPrompt'), { n }))}</button>}
          {lit && <span className="litline" role="status">{rich(l.lit)}</span>}
          <button className="btn" aria-label={tpl(X('poorakissaAria'), { project })} onClick={() => openLampCard(n, 'stop', true)}>{rich(copy.ui.lampOpen)}</button>
        </p>
        {n === 1 && lit && <p className="next-hint"><button className="btn btn-ghost" onClick={() => scrollToId('baithak')}>{rich(copy.ui.idleHint)}</button> <span>{rich(copy.transitions.toBaithak)}</span></p>}
        {n === 5 && <div className={`auto-beat ${all ? 'on' : ''}`} aria-hidden="true">{copy.terrace.autoBeat.map((t, i) => <p key={i}>{rich(t)}</p>)}</div>}
      </div>
    </section>
  );
}
