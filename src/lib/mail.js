import copy, { X } from './copy.js';
import { tpl } from './tpl.js';
import { getState } from './store.js';
// The interview button renders only when contact.email is set.
export const inviteVisible = () => !!(copy.site.contact && (copy.site.contact.email || copy.site.contact.linkedin));
export function contactHref(lampNumber) {
  const email = copy.site.contact && copy.site.contact.email;
  if (!email) return copy.site.contact && copy.site.contact.linkedin ? copy.site.contact.linkedin : '#';
  const [hello, want, lamp] = copy.ui.extra.emailBody;
  const n = lampNumber == null ? '' : (lampNumber > 100 ? X('moreThan99') : String(lampNumber));
  const lines = [hello, '', want, '', tpl(lamp, { n }), ''];
  return 'mailto:' + email + '?subject=' + encodeURIComponent(copy.ui.extra.emailSubject) + '&body=' + encodeURIComponent(lines.join('\r\n'));
}
