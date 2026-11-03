import { useEffect } from 'react';
import copy, { flags } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';

// Seven lines. Lines gated by a flag stay out until Shriniwas turns the flag on. Line 5 (how this page was made) is empty and hidden.
const EV = 'Evidence drawer';
function Line({ text }) {
  const i = text.indexOf(EV);
  if (i < 0) return <>{rich(text)}</>;
  const a = text.slice(0, i), b = text.slice(i + EV.length), inHi = (a.match(/<hi>/g) || []).length > (a.match(/<\/hi>/g) || []).length;
  return <>{rich(a + (inHi ? '</hi>' : ''))}<a href="#evidence" data-evidence="">{EV}</a>{rich((inHi ? '<hi>' : '') + b)}</>;
}
export default function Footer() {
  const vl = useStore((s) => s.visitorLit || s.tone === 6);
  const lines = copy.footer.lines.filter((l) => !l.flag || flags[l.flag]);
  const how = flags.footerHowMade && copy.footer.howMade;
  useEffect(() => { // console only, nothing visible: which lines are hidden right now (no visitor text is ever in this list)
    const hidden = copy.footer.lines.filter((l) => l.flag && !flags[l.flag]).map((l) => `hidden: footer line ${l.id.slice(1)} (${l.flag} false)`);
    if (!how) hidden.push('hidden: footer line 5 (how this page was made: empty)');
    if (!flags.ledgerGate_personFirstSentence) hidden.push('hidden: person first sentence (ledgerGate_personFirstSentence false)');
    for (const f of Object.keys(flags)) if ((f.startsWith('meet.') && f !== 'meet.mergeThin') || f.startsWith('bring.')) if (!flags[f]) hidden.push(`hidden: ${f} (false)`);
    if (!(flags.flowIntoEmergentRecorded && copy.voice.recordingLink)) hidden.push('hidden: recorded-build line (flowIntoEmergentRecorded false or no recording link)');
    console.info(hidden.join('\n'));
  }, []);
  return (
    <footer id="footer">
      {lines.map((l) => l.id === 'l7'
        ? <p key={l.id} className="copyright"><i className={`glyph ${vl ? 'lit' : ''}`} aria-hidden="true" /> {l.text}</p>
        : <p key={l.id}><Line text={l.text} /></p>)}
      {how ? <p>{rich(copy.footer.howMade)}</p> : null}
    </footer>
  );
}
