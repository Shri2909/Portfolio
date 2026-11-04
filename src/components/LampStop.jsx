import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { emit } from '../lib/events.js';
import { openLampCard } from '../lib/nav.js';
import { LAMPS } from '../lib/lamps.js';
import Step from './Step.jsx';
import GuessAudit from './story/GuessAudit.jsx';
import LateReplySlider from './story/LateReplySlider.jsx';
import StoryPriceTag from './story/StoryPriceTag.jsx';

const DEVICE = { 1: GuessAudit, 2: StoryPriceTag, 3: LateReplySlider };
// One lamp, three levels. LEVEL 1 is on the page at once: the headline, a short summary and the one capability this project shows, with the lamp's own
// interaction. LEVEL 2 is the complete story (the lamp card, "Poora kissa"). LEVEL 3 is for curious reviewers: the repository link, the files and the receipt.
export default function LampStop({ n }) {
  const l = copy.lamps[n - 1], st = l.stop || {}, lit = useStore((s) => s.lamps[n] === 'lit');
  const Device = DEVICE[n], project = copy.ui.extra.projectNames[n - 1], LV = copy.ui.extra.levelLabels;
  const folder = copy.evidence.folders.find((f) => f.id === l.level3.folder), insp = folder && folder.body && folder.body.inspect;
  return (
    <section id={`lamp-${n}`} className={`sec stop ${lit ? 'is-lit' : ''}`} aria-labelledby={`lamp-${n}-h`}>
      <div className="panel">
        {n === 1 && <Step k="s2" />}
        {n === 2 && <><p className="kicker">{copy.terrace.kicker}</p><p className="entry">{rich(copy.terrace.entry)}</p></>}
        <p className="kicker">{l.kicker}</p>
        <div className="level l1">
          <p className="level-tag mono">{LV.level1}</p>
          <h2 id={`lamp-${n}-h`} tabIndex={-1}>{rich(l.title)}</h2>
          <p className="tagline">{l.tagline}</p>
          <p className="hook">{l.level1.summary}</p>
          <div className="capability"><p className="level-tag mono">{LV.capLabel}</p><p>{rich(l.level1.capability.replace(/^([^:]+:)/, '**$1**'))}</p></div>
        </div>
        {Device && <Device />}
        {st.twin && <p className="sr-only">{st.twin}</p>}
        <p className="chip-line"><button className="btn level-btn l2" aria-label={LV.level2 + ': ' + project} onClick={() => openLampCard(n, 'stop', true)}><span className="mono">{LV.level2}</span><small>{LV.level2Hint}</small></button></p>
        <details className="level l3">
          <summary><span className="mono">{LV.level3}</span><small>{LV.level3Sub}</small></summary>
          <div className="l3-body">
            {insp && <p><a className="repo-link" href={insp.url} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('repoAria'), { project, label: insp.label })}>{insp.label} · {LV.github}</a></p>}
            {l.level3.punch && <p className="punch">{rich(l.level3.punch)}</p>}
          </div>
        </details>
        <p className="stop-foot">
          {!lit && n > 1 && <button className="btn btn-primary" onClick={() => emit('lamp:request', { n })}>{rich(tpl(X('passPrompt'), { n }))}</button>}
          {lit && <span className="litline" role="status">{rich(l.lit)}</span>}
        </p>
        {n === LAMPS && <div className={`auto-beat ${useStore((s) => s.litCount === LAMPS) ? 'on' : ''}`} aria-hidden="true">{copy.terrace.autoBeat.map((t, i) => <p key={i}>{rich(t)}</p>)}</div>}
      </div>
    </section>
  );
}
