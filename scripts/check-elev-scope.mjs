// Fails if a top-level selector in src/styles/elev/*.css is not scoped under html[data-elev="1"].
import fs from 'node:fs';
import path from 'node:path';
const dir = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../src/styles/elev');
const OK = /^(html|:root)\[data-elev="1"\]/;
const bad = [];
const splitTop = (sel) => { const out = []; let d = 0, cur = ''; for (const ch of sel) { if (ch === '(' || ch === '[') d++; if (ch === ')' || ch === ']') d--; if (ch === ',' && d === 0) { out.push(cur); cur = ''; } else cur += ch; } out.push(cur); return out; };
for (const f of fs.existsSync(dir) ? fs.readdirSync(dir).filter((n) => n.endsWith('.css')) : []) {
  const s = fs.readFileSync(path.join(dir, f), 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  let depth = 0, buf = '', skipDepth = -1;
  for (const ch of s) {
    if (ch === '{') {
      if (depth === 0) {
        const sel = buf.trim();
        if (/^@(keyframes|property|font-face)/.test(sel)) skipDepth = 0;
        else if (/^@(media|supports)/.test(sel)) skipDepth = -1; // contents are checked as depth-1 rules below
        else if (!splitTop(sel).every((p) => OK.test(p.trim()))) bad.push(`${f}: ${sel.slice(0, 70)}`);
      } else if (depth === 1 && skipDepth !== 0) {
        const sel = buf.trim();
        if (!splitTop(sel).every((p) => OK.test(p.trim()))) bad.push(`${f}: ${sel.slice(0, 70)}`);
      }
      depth++; buf = '';
    } else if (ch === '}') { depth--; if (depth === 0) skipDepth = -1; buf = ''; }
    else if (ch === ';' ) buf = '';
    else buf += ch;
  }
}
console.log(bad.length ? bad.map((b) => '  FAIL unscoped: ' + b).join('\n') : 'check-elev-scope: clean');
process.exit(bad.length ? 1 : 0);
