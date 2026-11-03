// check-build: fails on outside hosts, storage use, forbidden strings, wrong flags, over-budget bundles.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dist = path.join(root, 'dist');
const fail = [], warn = [];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
if (!fs.existsSync(dist)) { console.log('check-build: dist/ missing, run the build first'); process.exit(1); }
const files = walk(dist);
const text = files.filter((f) => /\.(html|js|css|svg|json|txt|xml)$/.test(f));
const src = walk(path.join(root, 'src')).filter((f) => /\.(js|jsx|css|json)$/.test(f));

// 1. outside hosts in dist (library strings and the visitor-clicked outbound links are allowed)
const ALLOWED_LIB = ['www.w3.org', 'reactjs.org', 'react.dev'];
const ALLOWED_OUT = ['drive.google.com', 'github.com', 'wa.me', 'mail.google.com', 'outlook.live.com', 'docs.wisprflow.ai', 'wisprflow.ai', 'challenge.wisprflow.ai', 'techcrunch.com']; // outbound only on a visitor's own tap
const hosts = new Map();
for (const f of text) {
  const s = fs.readFileSync(f, 'utf8');
  for (const m of s.matchAll(/https?:\/\/([a-z0-9.-]+)/gi)) { const h = m[1].toLowerCase(); (hosts.get(h) || hosts.set(h, new Set()).get(h)).add(path.basename(f)); }
}
for (const [h, fl] of hosts) if (!ALLOWED_LIB.includes(h) && !ALLOWED_OUT.includes(h)) fail.push(`outside host in dist: ${h} (${[...fl].join(', ')})`);

// 2. storage / network APIs in src (dist: warn only)
const BAN = [/\blocalStorage\b/, /\bsessionStorage\b/, /\bindexedDB\b/, /document\.cookie/, /sendBeacon/, /XMLHttpRequest/, /\bfetch\(/, /\bWebSocket\b/, /\bEventSource\b/];
for (const f of src) {
  const s = fs.readFileSync(f, 'utf8').replace(/\/\/.*$/gm, '');
  for (const re of BAN) if (re.test(s)) fail.push(`${re} in ${path.relative(root, f)}`);
}
for (const f of text.filter((f) => f.endsWith('.js'))) {
  const s = fs.readFileSync(f, 'utf8');
  for (const re of BAN) if (re.test(s)) warn.push(`${re} in dist/${path.relative(dist, f)} (library code, warn only)`);
}

// 3. forbidden strings in copy.json and dist
const copy = fs.readFileSync(path.join(root, 'src/data/copy.json'), 'utf8');
const FORBID = [/lorem/i, /TODO/, /\[CONFIRM/, /\[FILL IN/, /\[__\]/, /SAMPLE/, /Diwali/, /(?<![\w.])40\.62(?![\d])/, /(?<![\w.])0\.585(?![\d])/, /(?<![\w.])629\.70(?![\d])/, /(?<![\w.])26\.5(?![\d])/, /(?<![\w.])1\.08(?![\d])/,
  /\b(tum|tumhara|tumhe|tumne|tumse|tumhari|tumko)\b/i, /\b(8|9) November\b/i, /\bNovember (8|9)\b/i];
const bundles = text.filter((f) => /\.(html|js|css)$/.test(f));
const NUMERIC = (re) => /\\d/.test(re.source) && /\\\./.test(re.source);   // held-out numbers: a CSS value (line-height) is not a claim
for (const re of FORBID) {
  if (re.test(copy)) fail.push(`forbidden ${re} in src/data/copy.json`);
  for (const f of bundles) { if (f.endsWith('.css') && NUMERIC(re)) continue; if (re.test(fs.readFileSync(f, 'utf8'))) fail.push(`forbidden ${re} in dist/${path.relative(dist, f)}`); }
}
const GIFT = /\b(gift|hamper|bonus|puja|Lakshmi|Ganesh)\b/i;
for (const f of bundles) { const s = fs.readFileSync(f, 'utf8').replace(/"[^"]*[A-Za-z]{3,}Gift[^"]*"/g, ''); if (GIFT.test(s) && !f.endsWith('.js')) warn.push(`word to review in dist/${path.relative(dist, f)}: ${GIFT.exec(s)[0]}`); }
const copyData = JSON.parse(copy);
if (/^[^"]*gift/i.test(JSON.stringify(copyData))) warn.push('the word "gift" appears in copy.json');

// 4. "Spoken with Wispr Flow" exactly twice in the shipped bundle
const jsAll = bundles.filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(f, 'utf8')).join('\n');
const sp = (jsAll.match(/Spoken with Wispr Flow/g) || []).length;
if (sp !== 2) fail.push(`"Spoken with Wispr Flow" appears ${sp} times in dist JS, expected 2`);
// gated lines must be OFF
for (const f of ['ledgerGate_personFirstSentence', 'flowIntoEmergentRecorded', 'noAnalyticsLine', 'footerHowMade']) if (copyData.flags[f] !== false) fail.push(`flag ${f} is not false`);
// 5. dev panel and private notes stripped
for (const f of bundles) {
  const s = fs.readFileSync(f, 'utf8');
  if (/devpanel/.test(s)) fail.push(`"devpanel" found in dist/${path.relative(dist, f)}`);
  if (/Shriniwas should read each aloud|_needsApproval/.test(s)) fail.push(`private note found in dist/${path.relative(dist, f)}`);
}
// CSP present
if (!/Content-Security-Policy/.test(fs.readFileSync(path.join(dist, 'index.html'), 'utf8'))) fail.push('CSP meta tag missing in dist/index.html');

// 6. budgets (gzip)
const gz = (f) => zlib.gzipSync(fs.readFileSync(f)).length;
const sum = (re) => files.filter((f) => re.test(f)).reduce((a, f) => a + gz(f), 0);
const js = sum(/\.js$/), css = sum(/\.css$/), fonts = sum(/\.(woff2?|ttf)$/);
if (js > 200 * 1024) fail.push(`JS ${(js / 1024).toFixed(1)} KB gzip over 200 KB`);
if (css > 45 * 1024) fail.push(`CSS ${(css / 1024).toFixed(1)} KB gzip over 45 KB`);
if (js > 170 * 1024) warn.push(`JS at ${(js / 1024).toFixed(0)} KB gzip, over 85% of its 200 KB budget`);
const idx = fs.readFileSync(path.join(dist, 'index.html'), 'utf8');
const entry = (/<script[^>]+src="\.?\/?(assets\/[^"]+\.js)"/.exec(idx) || [])[1];
if (entry && fs.existsSync(path.join(dist, entry))) {
  const e = gz(path.join(dist, entry));
  if (e > 140 * 1024) fail.push(`entry JS ${(e / 1024).toFixed(1)} KB gzip over 140 KB`);
  console.log('elevation: ' + (files.filter((f) => /assets\/.*\.js$/.test(f) && !/assets\/elev-/.test(f)).some((f) => /elev-[\w-]+\.js/.test(fs.readFileSync(f, 'utf8'))) ? 'ON' : 'OFF'));
}
for (const f of text.filter((f) => /\.(js|html)$/.test(f))) if (/__perf|VITE_PERF/.test(fs.readFileSync(f, 'utf8'))) fail.push(`perf code in dist/${path.relative(dist, f)}`);
for (const f of files.filter((f) => /\.(js|css)$/.test(f))) console.log('  chunk ' + path.relative(dist, f) + '  ' + (gz(f) / 1024).toFixed(1) + ' KB gz');
if (fonts > 90 * 1024) fail.push(`fonts ${(fonts / 1024).toFixed(1)} KB over 90 KB`);
const og = path.join(dist, 'og.png');
if (fs.existsSync(og) && fs.statSync(og).size > 300 * 1024) fail.push('og.png over 300 KB');
if (!fs.existsSync(og)) warn.push('dist/og.png missing');

console.log('check-build  sizes (gzip): JS ' + (js / 1024).toFixed(1) + ' KB | CSS ' + (css / 1024).toFixed(1) + ' KB | fonts ' + (fonts / 1024).toFixed(1) + ' KB | og.png ' + (fs.existsSync(og) ? (fs.statSync(og).size / 1024).toFixed(0) + ' KB' : 'none'));
for (const w of warn) console.log('  warn  ' + w);
for (const f of fail) console.log('  FAIL  ' + f);
console.log(fail.length ? `check-build: ${fail.length} problem(s)` : 'check-build: clean');
process.exit(fail.length ? 1 : 0);
