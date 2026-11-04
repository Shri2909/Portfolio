import copy, { X } from '../lib/copy.js';
import { rich } from '../lib/rich.jsx';

// A tab to Wispr Flow, opened only when the visitor taps it (a new tab; nothing is requested on load).
export default function FlowTab({ compact = false }) {
  return (
    <a className={`flow-tab ${compact ? 'compact' : ''}`} href={copy.site.links.flow} target="_blank" rel="noopener noreferrer" aria-label={X('flowTab') + X('inviteTabAria')}>
      <svg viewBox="0 0 24 16" aria-hidden="true"><rect x="2" y="5" width="3" height="6" rx="1.500" /><rect x="7" y="2" width="3" height="12" rx="1.500" /><rect x="12" y="4" width="3" height="8" rx="1.500" /><rect x="17" y="1" width="3" height="14" rx="1.500" /></svg>
      <span className="ft-name">{X('flowTab')}</span>{!compact && <small>{rich(X('flowTabHint'))} ↗</small>}{compact && <small aria-hidden="true">↗</small>}
    </a>
  );
}
