import copy, { X } from '../lib/copy.js';
import { inviteVisible } from '../lib/mail.js';
import { rich } from '../lib/rich.jsx';
// Every INVITE ME is a button that opens the invite sheet. Renders only if contact is set.
export default function InviteButton({ label, short = false, className = 'btn btn-primary' }) {
  if (!inviteVisible()) return null;
  const text = label || (short ? copy.ui.invite.short : copy.ui.invite.long);
  return <button type="button" className={className} data-invite aria-label={text + X('inviteAria')}>{rich(text)}</button>;
}
