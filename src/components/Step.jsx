import copy from '../lib/copy.js';
// One step of the recruiter journey: a small numbered label and its one-line description, above a section's own heading.
export default function Step({ k }) {
  const s = copy.journey && copy.journey[k];
  if (!s) return null;
  return <p className="step"><span className="step-n mono">{s.n}</span><span className="step-sub">{s.sub}</span>{s.self ? <span className="step-self"> · {s.self}</span> : null}</p>;
}
