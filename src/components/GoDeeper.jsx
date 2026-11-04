import copy, { X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { openLampCard, scrollToId } from '../lib/nav.js';
// Step 06, self-paced: the evidence receipts, the longer stories, the personal details, the visitor's lamp and the essay link.
export default function GoDeeper() {
  const x = copy.ui.extra, s = copy.journey.s6;
  return (
    <section id="deeper" className="sec deeper" aria-labelledby="deeper-h">
      <div className="panel">
        <h2 id="deeper-h" tabIndex={-1}>{s.n}</h2>
        <p className="step"><span className="step-sub">{s.sub}</span><span className="step-self"> · {s.self}</span></p>
        <p className="cta-row">
          {copy.lamps.map((l) => <button key={l.id} className="btn" onClick={() => openLampCard(l.n, 'deeper', true)}>{x.goDeeperStories}: {l.name}</button>)}
          <button className="btn" onClick={() => scrollToId('baithak')}>{x.goDeeperPerson}</button>
          <button className="btn" data-evidence="">{x.goDeeperEvidence}</button>
          <button className="btn" onClick={() => scrollToId('wish')}>{x.visitorLamp}</button>
          <a className="btn" href={copy.site.links.essay} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('driveAria'), { label: x.goDeeperEssay })}>{x.goDeeperEssay}</a>
        </p>
      </div>
    </section>
  );
}
