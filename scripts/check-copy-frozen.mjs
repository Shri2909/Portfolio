// E8.7 copy diff: every string in src/data/copy.json is hashed against scripts/copy.lock.json (made from the v3-baseline tag).
// Any changed or removed string fails; any added string fails unless its path is in scripts/copy-approved.json.
import fs from 'node:fs'; import crypto from 'node:crypto'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const flat = (o, p = '', r = {}) => { if (typeof o === 'string') r[p] = o; else if (o && typeof o === 'object') for (const k in o) flat(o[k], p + '/' + k, r); return r; };
const B = flat(JSON.parse(fs.readFileSync(path.join(root, 'src/data/copy.json'), 'utf8')));
const lock = JSON.parse(fs.readFileSync(path.join(root, 'scripts/copy.lock.json'), 'utf8'));
const ok = new Set(JSON.parse(fs.readFileSync(path.join(root, 'scripts/copy-approved.json'), 'utf8')).paths);
const h = (s) => crypto.createHash('sha1').update(s).digest('hex'); const bad = [];
for (const k in lock) { if (!(k in B)) bad.push('removed: ' + k); else if (h(B[k]) !== lock[k]) bad.push('changed: ' + k); }
for (const k in B) if (!(k in lock) && !ok.has(k)) bad.push('added without approval entry: ' + k);
console.log(bad.length ? bad.map((x) => '  FAIL ' + x).join('\n') + `\ncheck-copy-frozen: ${bad.length} problem(s)` : `check-copy-frozen: clean (${Object.keys(lock).length} V3 strings unchanged, ${ok.size} elevation labels awaiting approval)`);
process.exit(bad.length ? 1 : 0);
