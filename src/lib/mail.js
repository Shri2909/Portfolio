import copy, { X } from './copy.js';
import { tpl } from './tpl.js';
import { getState } from './store.js';
// Invite builders. Every INVITE ME opens the InviteSheet; these URLs are built at open time from the current store (never at render time).
export const inviteVisible = () => !!(copy.site.contact && (copy.site.contact.email || copy.site.contact.linkedin));
export const emailOf = () => (copy.site.contact && copy.site.contact.email) || '';
export const linkedinOf = () => (copy.site.contact && copy.site.contact.linkedin) || '';
// "My lamp number on your page: N" appears only after the visitor's own lamp is lit; N is the closure's number everywhere.
export function inviteMessage() {
  const s = getState(), [hello, want, lamp, details, regards] = copy.ui.extra.inviteBody;
  const n = s.row.count > 100 ? X('moreThan99') : String(s.row.count);
  const parts = [hello, want]; if (s.visitorLit) parts.push(tpl(lamp, { n })); parts.push(details, regards);
  return { subject: copy.ui.extra.inviteSubject, body: parts.join('\n\n') };
}
const enc = encodeURIComponent;
export function inviteUrls() {
  const email = emailOf(), { subject, body } = inviteMessage();
  return {
    email, subject, body,
    gmail: `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${enc(email)}&su=${enc(subject)}&body=${enc(body)}`,
    outlook: `https://outlook.live.com/mail/0/deeplink/compose?to=${enc(email)}&subject=${enc(subject)}&body=${enc(body)}`,
    mailto: `mailto:${email}?subject=${enc(subject)}&body=${enc(body.replace(/\n/g, '\r\n'))}`,
  };
}
