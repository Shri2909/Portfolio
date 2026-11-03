import copy, { c, X } from '../lib/copy.js';
import { tpl } from '../lib/tpl.js';
import { R } from '../lib/rich.jsx';

// One evidence folder body, used by the drawer and the full-text view.
// Fields come from copy.json (copied word for word from reference/content.json). Empty fields are skipped.
export default function EvidenceBody({ folder }) {
  const b = folder.body, L = { ...copy.evidence.fieldLabels, ...(b.labels || {}) };
  const Field = ({ k, children }) => (children ? <div className="ev-field"><h4>{L[k]}</h4>{children}</div> : null);
  const project = (folder.name || '').split(':')[0];
  const ins = b.inspect;
  return (
    <div className="ev-body">
      {b.fields && b.fields.map(([lab, txt]) => <div className="ev-field" key={lab}><h4>{lab}</h4><p>{txt}</p></div>)}
      <Field k="purpose">{b.purpose && <p>{b.purpose}</p>}</Field>
      <Field k="finding">{b.finding && <p>{b.finding}</p>}</Field>
      <Field k="mine">{b.mine && <p>{b.mine}</p>}</Field>
      <Field k="results">{b.results && <p>{b.results}</p>}</Field>
      {ins && (
        <div className="ev-field">
          <h4>{L.inspect}</h4>
          {ins.url && copy.evidence.linkOverrides && copy.evidence.linkOverrides[folder.id] === 'on-request' && <p>{X('onRequest')}</p>}
          {ins.url && !(copy.evidence.linkOverrides && copy.evidence.linkOverrides[folder.id]) && <p><a href={ins.url} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('repoAria'), { project, label: ins.label })}>{ins.label}</a></p>}
          {ins.files && ins.files.length > 0 && <ul className="mono">{ins.files.map((f) => <li key={f}>{f}</li>)}</ul>}
          {ins.note && <p>{ins.note}</p>}
        </div>
      )}
      {b.links && b.links.length > 0 && (
        <div className="ev-field">
          <ul className="plain">{b.links.map((l) => {
            const href = copy.site.links[l.key];
            return href ? <li key={l.key}><a href={href} target="_blank" rel="noopener noreferrer" aria-label={tpl(X('driveAria'), { label: l.label })}>{l.label}</a></li> : null;
          })}</ul>
        </div>
      )}
      {b.status && b.status.length > 0 && (
        <div className="ev-field">
          <h4>{L.status}</h4>
          <ul className="ev-status">{b.status.map(([tag, note], i) => <li key={i}><span className="mono tag">{tag}</span> {note}</li>)}</ul>
        </div>
      )}
      {b.more && b.more.length > 0 && <div className="ev-field"><h4>{L.more}</h4><ul>{b.more.map((m, i) => <li key={i}>{m}</li>)}</ul></div>}
    </div>
  );
}
