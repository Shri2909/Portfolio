import { useRef, useState } from 'react';
import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';
import { useStore } from '../lib/useStore.js';
import { closeOverlay } from '../lib/nav.js';
import { copyText } from '../lib/cardActions.js';
import { inviteUrls, linkedinOf, emailOf } from '../lib/mail.js';
import Overlay from './Overlay.jsx';

// One sheet behind every INVITE ME. Works with no mail app (Gmail tab, Outlook tab, copy). Nothing is sent from this page;
// no request leaves until the visitor taps a link.
export default function InviteSheet() {
  const open = useStore((s) => s.overlay === 'invite'), visitorLit = useStore((s) => s.visitorLit), count = useStore((s) => s.row.count);
  const [status, setStatus] = useState(''), t = useRef(0), addr = useRef(null);
  const u = open ? inviteUrls() : null, coarse = typeof matchMedia !== 'undefined' && matchMedia('(pointer: coarse)').matches;
  const say = (m) => { setStatus(m); clearTimeout(t.current); t.current = setTimeout(() => setStatus(''), 2500); };
  const copy_ = async (text, ok) => {
    if (await copyText(text)) return say(ok);
    const el = addr.current; if (el) { const r = document.createRange(); r.selectNodeContents(el); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
    say(X('inviteCopyFail'));
  };
  const ext = { target: '_blank', rel: 'noopener noreferrer' };
  const Gmail = (p) => <li key="g"><a className="btn btn-primary" href={u.gmail} {...ext} aria-label={X('inviteGmail') + X('inviteTabAria')}>{X('inviteGmail')}</a><small>{X('inviteGmailSub')}</small></li>;
  const Mail = () => <li key="m"><a className="btn" href={u.mailto} aria-label={X('inviteMailApp')}>{X('inviteMailApp')}</a><small>{X('inviteMailSub')}</small></li>;
  const Outlook = () => <li key="o"><a className="btn" href={u.outlook} {...ext} aria-label={X('inviteOutlook') + X('inviteTabAria')}>{X('inviteOutlook')}</a></li>;
  const email = emailOf(), li = linkedinOf();
  return (
    <Overlay id="invite" open={open} onClose={closeOverlay} titleId="invite-h">
      {u && (
        <div className="overlay-in invite">
          <div className="overlay-head"><h2 id="invite-h" data-title>{X('inviteTitle')}</h2><button className="btn" onClick={closeOverlay}>{copy.ui.close}</button></div>
          <p>{rich(X('inviteSub'))}</p>
          {email && (
            <>
              <ul className="invite-paths">
                {coarse ? [<Mail />, <Gmail />, <Outlook />] : [<Gmail />, <Mail />, <Outlook />]}
                <li><button className="btn" onClick={() => copy_(email, X('inviteAddrCopied'))}>{X('inviteCopyAddr')}</button></li>
                <li><button className="btn" onClick={() => copy_(u.subject + '\n\n' + u.body, X('inviteMsgCopied'))}>{X('inviteCopyMsg')}</button></li>
              </ul>
              <p className="mono sub" role="status" aria-live="polite">{status}</p>
              <p className="mono addr" ref={addr} id="invite-addr">{email}</p>
              <p className="fallback">{rich(X('inviteFallback'))} <span className="mono">{email}</span></p>
              <details><summary>{X('invitePreview')}</summary><pre className="preview">{u.subject + '\n\n' + u.body}</pre></details>
            </>
          )}
          {li && <a className="btn btn-ghost" href={li} {...ext} aria-label={X('inviteLinkedin') + X('inviteTabAria')}>{X('inviteLinkedin')}</a>}
        </div>
      )}
    </Overlay>
  );
}
