// E8.4 render lint: regex checks for the cheap-frame rules. Exits 1 on any violation.
// Allowed layout reads in src/elev: lines inside a function named onResize/measure/read*, or marked `// lint:ok`.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];
const bad = [];
const rel = (f) => path.relative(root, f);
const V3_FILES = new Set(['src/lib/director.js']); // V3 timers outside the fx engine, untouched on purpose (the kill switch keeps V3 files as they were)
for (const f of walk(path.join(root, 'src')).filter((f) => /\.(js|jsx)$/.test(f))) {
  const lines = fs.readFileSync(f, 'utf8').split('\n'), r = rel(f), inElev = r.startsWith('src/elev/');
  lines.forEach((ln, i) => {
    const code = ln.replace(/\/\/.*$/, ''), at = `${r}:${i + 1}`;
    if (/lint:ok/.test(ln)) return;
    if (inElev && /getBoundingClientRect|offsetWidth|offsetHeight|getComputedStyle/.test(code)) {
      // look back for the enclosing function name
      let fn = ''; for (let k = i; k >= Math.max(0, i - 40); k--) { const m = lines[k].match(/function\s+(\w+)|const\s+(\w+)\s*=\s*(?:\([^)]*\)|\w+)\s*=>/); if (m) { fn = m[1] || m[2]; break; } }
      if (!/^(onResize|measure|read\w*|collect|size|rs|refresh\w*)$/.test(fn)) bad.push(`${at}: layout read outside onResize/measure/read* (in "${fn || 'top level'}")`);
    }
    if (/addEventListener\(\s*['"](touchstart|touchmove|wheel|scroll)['"]/.test(code) && !/passive\s*:\s*true/.test(code)) if (!V3_FILES.has(r)) bad.push(`${at}: non-passive ${code.match(/touchstart|touchmove|wheel|scroll/)[0]} listener`);
    if ((r.startsWith('src/lib/') || inElev) && /\bsetInterval\(/.test(code) && !V3_FILES.has(r)) bad.push(`${at}: setInterval (use the ticker)`);
    if (/new Audio|AudioContext/.test(code)) bad.push(`${at}: audio`);
  });
}
for (const f of walk(path.join(root, 'src/styles')).filter((f) => f.endsWith('.css'))) {
  const s = fs.readFileSync(f, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
  for (const m of s.matchAll(/([^{}]+)\{([^{}]*will-change[^{}]*)\}/g)) {
    const sel = m[1].trim();
    if (/will-change\s*:\s*auto/.test(m[2]) || (rel(f) === 'src/styles/lamps.css' && sel === '.traveller')) continue; // V3 rule, overridden to auto under elevation
    if (!/\.promoted|\.moving/.test(sel)) bad.push(`${rel(f)}: will-change outside .promoted/.moving: ${sel.slice(0, 60)}`);
  }
}
console.log(bad.length ? bad.map((b) => '  FAIL ' + b).join('\n') + `\nlint-render: ${bad.length} problem(s)` : 'lint-render: clean');
process.exit(bad.length ? 1 : 0);
