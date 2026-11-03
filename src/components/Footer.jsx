import copy, { flags } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';

// Pack 7 adds the lamp glyph and the evidence-drawer link in line 1.
export default function Footer() {
  const lines = copy.footer.lines.filter((l) => !l.flag || flags[l.flag]);
  return (
    <footer id="footer">
      {lines.map((l) => <p key={l.id}>{rich(l.text)}</p>)}
      {flags.footerHowMade && copy.footer.howMade ? <p>{rich(copy.footer.howMade)}</p> : null}
    </footer>
  );
}
