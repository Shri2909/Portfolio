import { createElement as h } from 'react';
// Reads only **bold** and <hi>Hinglish</hi>. Builds elements; never uses innerHTML.
export function rich(text) {
  const toks = String(text ?? '').split(/(\*\*|<hi>|<\/hi>)/).filter((t) => t !== '');
  const root = { type: 'root', kids: [] };
  const stack = [root];
  for (const t of toks) {
    const top = stack[stack.length - 1];
    if (t === '**') {
      if (top.type === 'b') stack.pop();
      else { const n = { type: 'b', kids: [] }; top.kids.push(n); stack.push(n); }
    } else if (t === '<hi>') { const n = { type: 'hi', kids: [] }; top.kids.push(n); stack.push(n); }
    else if (t === '</hi>') { const i = stack.map((x) => x.type).lastIndexOf('hi'); if (i > 0) stack.length = i; }
    else top.kids.push(t);
  }
  const r = (n, k) => typeof n === 'string' ? n
    : h(n.type === 'b' ? 'strong' : 'span', n.type === 'hi' ? { key: k, lang: 'hi-Latn' } : { key: k }, ...n.kids.map(r));
  return root.kids.map(r);
}
export const R = ({ t, as: Tag = 'span', ...p }) => (t ? <Tag {...p}>{rich(t)}</Tag> : null);
