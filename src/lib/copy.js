import copy from '../data/copy.json';
import { tpl } from './tpl.js';
export default copy;
// Copy hook: returns '' (render nothing) when the path is empty or missing.
export const c = (path, vars) => {
  let v = copy;
  for (const k of path.split('.')) { v = v == null ? undefined : v[k]; }
  return typeof v === 'string' ? (vars ? tpl(v, vars) : v) : '';
};
export const X = (k, vars) => c('ui.extra.' + k, vars);
export const flags = copy.flags || {};
