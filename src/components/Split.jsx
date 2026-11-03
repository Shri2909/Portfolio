import { Children, cloneElement, isValidElement } from 'react';
// Kinetic-ready text: wraps plain text nodes only (leaves .num, <hi> and links intact). The outer element keeps the original
// text as aria-label; the split units are aria-hidden. Use mode="chars" ONLY for monospaced or tabular runs (kicker, numerals,
// dates); serif headlines split by "words" because inline-block letters break serif kerning.
let k = 0;
function split(node, mode, counter) {
  if (typeof node === 'string') {
    const parts = mode === 'chars' ? Array.from(node) : node.split(/(\s+)/);
    return parts.map((p) => (/^\s+$/.test(p) || p === '' ? p : <span key={'s' + k++} className={mode === 'chars' ? 'c' : 'w'} style={{ '--i': counter.n++ }} aria-hidden="true">{p}</span>));
  }
  if (isValidElement(node) && node.props.children !== undefined && !node.props.className?.includes?.('num')) return cloneElement(node, { key: node.key ?? 'e' + k++ }, ...Children.toArray(node.props.children).map((c) => split(c, mode, counter)));
  return node;
}
const text = (c) => Children.toArray(c).map((x) => (typeof x === 'string' ? x : isValidElement(x) ? text(x.props.children) : '')).join('');
export default function Split({ as: Tag = 'span', mode = 'words', className = '', children, ...rest }) {
  const counter = { n: 0 };
  return <Tag className={className} aria-label={text(children)} {...rest}>{Children.toArray(children).map((c) => split(c, mode, counter))}</Tag>;
}
