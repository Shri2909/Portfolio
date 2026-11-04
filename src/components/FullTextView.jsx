import { useState } from 'react';
import copy, { c, X, flags } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { rich, R } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { closeText } from '../lib/nav.js';
import { shownCount } from '../lib/rowhash.js';
import EvidenceBody from './EvidenceBody.jsx';
import { inviteVisible, inviteUrls } from '../lib/mail.js';
import { meetCards } from '../lib/meet.js';
import { signoffLines } from '../lib/signoff.js';
import WishForm from './WishForm.jsx';
import { wishState } from '../lib/wishState.js';
import { cardContent, shareText, sendCard, copyText } from '../lib/cardActions.js';
import { outgoingLink } from '../lib/row.js';
import { useWishVersionState } from './wishHooks.js';

const makePlain = () => wishState.set({ made: true, seed: wishState.makeSeedFrom(cardContent()) });
// The plain-text twin of the card, with the same send and copy actions (no picture needed).
function CardTwin() {
  const st = useWishVersionState(), A = copy.wish.actions, [m, setM] = useState('');
  return (
    <div className="twin plain-twin">
      <p role="status">{rich(copy.wish.micro.ready)}</p>
      <pre>{shareText()}</pre>
      <p>
        <button type="button" className="btn" onClick={async () => { const r = await sendCard(st.theme, st.seed); setM(r === 'copied' ? copy.wish.micro.copied : r === 'failed' ? copy.wish.micro.copyFailed : ''); }}>{rich(A.whatsapp.label)}</button>{' '}
        <button type="button" className="btn" onClick={async () => setM((await copyText(shareText())) ? copy.wish.micro.copied : copy.wish.micro.copyFailed)}>{rich(A.copyText.label)}</button>{' '}
        <button type="button" className="btn" onClick={async () => setM((await copyText(outgoingLink())) ? copy.wish.micro.copied : copy.wish.micro.copyFailed)}>{rich(A.copyLink.label)}</button>
      </p>
      <p role="status">{m ? rich(m) : ''}</p>
      <p>{rich(copy.wish.micro.underCard)}</p>
    </div>
  );
}
const P = ({ t }) => (t ? <p>{rich(t)}</p> : null);
const Part = ({ part }) => part && (
  <>
    {part.heading ? <h3>{rich(part.heading)}{part.gloss ? <> <em>({part.gloss})</em></> : null}</h3> : null}
    {part.paras.map((p, i) => <P key={i} t={p} />)}
    {(part.list || []).length ? <ul>{part.list.map((t, i) => <li key={i}>{rich(t)}</li>)}</ul> : null}
  </>
);

// One linear view of the whole page, built from the same copy data.
// No canvas, no animation, no sticky parts. Nothing requires lighting a lamp.
export default function FullTextView({ onClose }) {
  const row = useStore((s) => s.row);
  const made = useWishVersionState().made;
  const n = row.count;
  const caption = n === 0 ? copy.closure.rowCaption.zero : n === 1 ? copy.closure.rowCaption.one : copy.closure.rowCaption.many;
  const so = signoffLines();
  const g = copy.guess, lr = copy.lateReply, v = copy.voice, vd = copy.verdict, w = copy.wish, cl = copy.closure, sx = copy.sixty;
  return (
    <div id="fulltext" className="fulltext" lang="en-IN">
      <a className="skip-link" href="#fulltext-close">{X('closeText')}</a>
      <article className="ft-wrap">
        <header>
          <p className="kicker">{copy.opening.label}</p>
          <h1 id="ft-h1" tabIndex={-1}>{copy.site.title}</h1>
        </header>
        <section aria-labelledby="ft-opening">
          <h2 id="ft-opening">{copy.opening.headline}</h2>
          <p><strong>{rich(copy.opening.ask)}</strong></p>
          {copy.opening.lines.map((l, i) => <P key={i} t={l} />)}
          {copy.opening.below.map((l, i) => <P key={i} t={l} />)}
          <p><a href="#sixty" data-sixty>{rich(copy.opening.quick)}</a></p>
        </section>
        {copy.lamps.map((l) => (
          <section key={l.id} aria-labelledby={`ft-${l.id}`}>
            <h2 id={`ft-${l.id}`}>{l.kicker}: {rich(l.title)}</h2>
            <p><em>{rich(l.tagline)}</em></p>
            <p>{l.level1.summary}</p><p>{l.level1.capability}</p>
            <Part part={l.what} />
            {l.interaction === 'guess' && (
              <>
                <h3>{g.label}</h3>
                <p>{g.question}</p>
                <ul>{g.options.map((o) => <li key={o}>{o}</li>)}</ul>
                <p>{g.plain}</p><p>{g.chip}</p>
                <p>{g.reveal}</p><p>{rich(g.below)}</p><p>{rich(g.exact)}</p>
              </>
            )}
            {l.interaction === 'lateReply' && (
              <>
                <h3>{lr.label}</h3>
                <p><strong>{lr.badge}</strong> {lr.badgeNote}</p>
                <ul>{lr.logics.map((o) => <li key={o.id}>{o.label}</li>)}</ul>
                <p>{lr.slider.deadlineLabel}</p>
                <p>{lr.plain}</p>
                <ul>
                  <li>{rich(tpl(lr.readout.before, { t: '2.0' }))}</li>
                  <li>{rich(tpl(lr.readout.afterOriginal, { t: '4.0' }))}</li>
                  <li>{rich(tpl(lr.readout.afterCorrected, { t: '4.0' }))}</li>
                </ul>
              </>
            )}
            <Part part={l.next} />
            <Part part={l.warning} />
            <p><a href="#evidence" data-evidence={l.receipt.folder}>{l.receipt.label}</a></p>
          </section>
        ))}
        {copy.transition && <section aria-labelledby="ft-pattern"><h2 id="ft-pattern">{copy.transition.heading}</h2>{copy.transition.body.map((t, i) => <P key={i} t={t.replace(/^\*(?!\*)(.+)\*$/, '$1')} />)}</section>}
        <section aria-labelledby="ft-row">
          <h2 id="ft-row">{rich(copy.terrace.autoBeat[0])}</h2>
          <P t={copy.terrace.autoBeat[1]} />
        </section>
        <section aria-labelledby="ft-l6">
          <h2 id="ft-l6">{copy.growth.kicker}: {rich(copy.growth.title)}</h2>
          <p><strong>{copy.growth.badge}</strong></p>
          <P t={copy.growth.hook} /><P t={copy.growth.body} /><p>{rich(copy.growth.tryLight)}</p>
          <h3>{copy.growth.taps.head}</h3>
          <p>{copy.growth.taps.t1.hindi} · {copy.growth.taps.t1.hinglish}. {copy.growth.taps.t1.caption} {copy.growth.taps.t1.note}</p>
          <ul>{['scale', 'change', 'kill'].map((k) => <li key={k}>{copy.growth.taps.t2[k]}</li>)}</ul><p>{copy.growth.taps.t2.note}</p>
          <p>{copy.growth.taps.t3.rule} {copy.growth.taps.t3.note}</p>
          <h3>{copy.growth.cardHead}</h3><P t={copy.growth.card} /><P t={copy.growth.why} /><p><strong>{copy.growth.limits}</strong></p>
          <h3>{copy.growth.sourcesHead}</h3>
          <ul>{copy.growth.sources.map((s) => <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer">{s.label}</a>{s.what ? ': ' + s.what : ''} [{s.tag}]</li>)}</ul>
          <p><a href="#evidence" data-evidence="c8">{rich(copy.growth.protocol)}</a></p>
        </section>
        <section aria-labelledby="ft-baithak">
          <p className="kicker">{copy.baithak.kicker}</p>
          <h2 id="ft-baithak">{rich(copy.baithak.heading)}</h2>
          <P t={copy.baithak.intro} />
          {(() => { const { order } = meetCards(); return order.map((c) => (
            <div key={c.id}>
              <h3>{rich(c.title)}</h3>
              {c.hook && <P t={c.hook} />}
              {(c.body || []).filter(Boolean).map((t, i) => <P key={i} t={t} />)}
              {c.steps && <ol>{c.steps.map((st, i) => <li key={i}>{rich(st.h)} ({st.g}). {st.t}</li>)}</ol>}
              {c.warning && <p><strong>Fair warning.</strong> {c.warning}</p>}
              {(c.extra || []).map((t, i) => <p key={i}>{t}</p>)}
              {c.items && <ol>{c.items.map((it, i) => <li key={i}><strong>{it.h}</strong> {it.proof} {it.filledLine} Fair warning: {it.warn} {it.view} {it.share}</li>)}</ol>}
            </div>)); })()}
          <p><strong>{copy.baithak.pull}</strong></p>
        </section>
        <section aria-labelledby="ft-voice">
          <h2 id="ft-voice">{rich(v.heading)}</h2>
          <p><em>{v.sub}</em></p>
          {v.paras.map((p, i) => <P key={i} t={p} />)}
          {v.takes.map((t) => (
            <div key={t.id}>
              <h3>{t.label} · {t.when} · {t.badge}</h3>
              <h4>{v.compare.asIsaid}</h4>
              {t.raw.map((p, i) => <p key={i}>{p}</p>)}
              <h4>{v.compare.asFlow}</h4>
              <p>{t.out}</p>
            </div>
          ))}
          <p><strong>{v.provenance.heading}</strong> {v.provenance.text}</p>
          <p>{v.chip}</p>
        </section>
        <section aria-labelledby="ft-verdict">
          <h2 id="ft-verdict">{rich(vd.heading)}</h2>
          {vd.paras.map((p, i) => <P key={i} t={p} />)}
          <p><strong>{vd.pull}</strong></p><P t={vd.ask} />
          <p><a href={copy.site.links.resume} target="_blank" rel="noopener noreferrer">{vd.resume.label} ({vd.resume.hint})</a></p>
        </section>
        <section aria-labelledby="ft-wish">
          <h2 id="ft-wish">{rich(w.heading)}</h2>
          {w.lines.map((l, i) => <P key={i} t={l} />)}
          <p>{w.english}</p>
          <h3>{rich(w.ideas.heading)}</h3>
          <ul>{w.ideas.chips.map((x, i) => <li key={i}>{rich(x)}</li>)}</ul>
          <WishForm plain onMake={makePlain} />
          {made && <CardTwin />}
        </section>
        <section aria-labelledby="ft-closure">
          <h2 id="ft-closure">{cl.headings.map((h, i) => <span key={i}>{rich(h)} </span>)}</h2>
          <p>{rich(tpl(caption, { count: shownCount(n) }))}</p><p>{copy.ui.rowFine}</p>
          <P t={cl.para} />
          {inviteVisible() && (() => { const u = inviteUrls(); return (<div><p><strong>{cl.invite.label}</strong> {rich(cl.invite.sub)}</p><p className="mono">{u.email}</p><p><a href={u.gmail} target="_blank" rel="noopener noreferrer">{X('inviteGmail')}</a> · <a href={u.mailto}>{X('inviteMailApp')}</a></p><pre>{u.subject + '\n\n' + u.body}</pre></div>); })()}
          <P t={cl.recap} /><P t={cl.closing} />
          <p>{so.map((l, i) => <span key={i}>{rich(l)} </span>)}</p>
        </section>
        <section aria-labelledby="ft-evidence">
          <h2 id="ft-evidence">{copy.evidence.title}</h2>
          <P t={copy.evidence.intro} />
          {copy.evidence.folders.map((f) => (<div key={f.id}><h3>{f.name}</h3><p>{rich(f.blurb)}</p><EvidenceBody folder={f} /></div>))}
        </section>
        <section aria-labelledby="ft-sixty">
          <h2 id="ft-sixty">{sx.label}</h2>
          <p>{rich(sx.hi)}</p><h3>{sx.headline}</h3>
          {sx.paras.map((p, i) => <p key={i}>{p}</p>)}<p><em>{sx.pull}</em></p>
        </section>
        <footer>
          {copy.footer.lines.filter((l) => !l.flag || flags[l.flag]).map((l) => <P key={l.id} t={l.text} />)}
          {flags.footerHowMade && copy.footer.howMade && <P t={copy.footer.howMade} />}
        </footer>
        <p><button id="fulltext-close" className="btn" onClick={onClose}>{c('ui.close')}</button></p>
      </article>
    </div>
  );
}
