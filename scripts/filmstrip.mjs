// E8.8 visual filmstrip + sanity checks (no extra dependencies). Usage:
//   node scripts/filmstrip.mjs [--dir=dist] [--out=shots/run] [--viewports=390x844,360x640,1366x768] [--modes=normal,calm,ink] [--compare=shots/v3]
// Captures each act's end state and, at 390x844 normal, the transition frames at 0/300/700/1200/2500 ms after stage:act.
// Writes PNGs, one contact sheet per viewport and mode, and report.html with the five-minute rubric on top. Seeded Math.random for repeatable stills.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const A = (k, d) => { const a = process.argv.find((x) => x.startsWith('--' + k + '=')); return a ? a.split('=')[1] : d; };
const dir = path.join(root, A('dir', 'dist')), out = path.join(root, A('out', 'shots/run')), cmp = A('compare', '');
const VPS = A('viewports', '390x844,360x640,412x915,768x1024,1366x768,1920x1080').split(',').map((v) => v.split('x').map(Number));
const MODES = A('modes', 'normal,calm,ink').split(',');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(dir, u === '/' ? 'index.html' : u); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f)); }).listen(0);
const base = 'http://127.0.0.1:' + srv.address().port + '/';
const ACTS = ['night', 'baithak', 'lamp-1', 'lamp-2', 'lamp-3', 'pattern', 'voice', 'lamp-6', 'verdict', 'deeper', 'wish', 'closure'];
const SEED = () => { let s = 0xE1D1A; Math.random = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296); };
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const problems = [], sheets = [], diffs = [];
const sheet = async (frames, file, cols) => { // tile PNGs in a page and screenshot it; labels are plain HTML
  const p = await browser.newPage({ viewport: { width: 1600, height: 900 } });
  await p.setContent(`<body style="margin:0;background:#111;color:#ddd;font:12px system-ui"><div style="display:grid;grid-template-columns:repeat(${cols},1fr);gap:6px;padding:6px">${frames.map((f) => `<figure style="margin:0"><img style="width:100%;display:block" src="data:image/png;base64,${f.buf.toString('base64')}"><figcaption>${f.label}</figcaption></figure>`).join('')}</div></body>`);
  await p.waitForTimeout(300); await p.screenshot({ path: file, fullPage: true }); await p.close();
};
const lumOf = (pg, buf) => pg.evaluate(async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = 48; c.height = 48; const x = c.getContext('2d'); x.drawImage(i, 0, 0, 48, 48); const d = x.getImageData(0, 0, 48, 48).data; let s = 0; for (let k = 0; k < d.length; k += 4) s += (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255; return s / 2304; }, buf.toString('base64'));
for (const [w, h] of VPS) for (const mode of MODES) {
  const phone = w < 800; const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: w < 500 ? 2 : 1, isMobile: phone, hasTouch: w < 800, reducedMotion: mode === 'calm' ? 'reduce' : 'no-preference' });
  await ctx.addInitScript(SEED); const p = await ctx.newPage(); const name = `${w}x${h}-${mode}`;
  await p.goto(base); await p.waitForTimeout(4200);
  if (mode === 'ink') { const m = await p.$('button[aria-label*="enu" i], #menu-btn, .menu-btn'); if (m) { await m.click(); await p.waitForTimeout(400); const ink = await p.$('[data-ink-toggle], button:has-text("Ink")'); if (ink) { await ink.click(); await p.waitForTimeout(400); } await p.keyboard.press('Escape'); } await p.evaluate(() => document.documentElement.dataset.ink || 0); }
  const frames = []; fs.mkdirSync(path.join(out, name), { recursive: true });
  for (const id of ACTS) {
    if (!(await p.$('#' + id))) continue;
    await p.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id);
    if (mode === 'normal' && w === 390) { for (const t of [0, 300, 700, 1200]) { await p.waitForTimeout(t === 0 ? 40 : t - [0, 0, 300, 700][[0, 300, 700, 1200].indexOf(t)]); const buf = await p.screenshot(); fs.writeFileSync(path.join(out, name, `${id}_t${t}.png`), buf); if (t === 700) frames.push({ buf, label: `${id} +700ms` }); } await p.waitForTimeout(1300); } else await p.waitForTimeout(1200);
    const buf = await p.screenshot({ path: path.join(out, name, `${id}.png`) }); frames.push({ buf, label: id });
    const L = await lumOf(p, buf); if (L < (id === "lamp-6" ? 0.015 : 0.03)) problems.push(`${name} ${id}: frame is blank (mean luminance ${L.toFixed(3)})`);
    const s = await p.evaluate(() => ({ hs: document.documentElement.scrollWidth > innerWidth + 1, wide: [...document.querySelectorAll('body *')].filter((e) => { const r = e.getBoundingClientRect(); return r.width > innerWidth + 2 && r.height > 0 && getComputedStyle(e).position !== 'fixed' && !e.closest('svg,canvas,[aria-hidden=true],#stage'); }).slice(0, 2).map((e) => e.id || e.className), clipped: [...document.querySelectorAll('h1,h2,h3,p,button,a')].filter((e) => { const r = e.getBoundingClientRect(); return r.top < innerHeight && r.bottom > 0 && e.scrollWidth > e.clientWidth + 2 && getComputedStyle(e).overflow !== 'visible' && !/sr-only/.test(e.className); }).slice(0, 2).map((e) => (e.id || e.className || e.tagName) + '') }));
    if (s.hs) problems.push(`${name} ${id}: horizontal scroll`); if (s.wide.length) problems.push(`${name} ${id}: element wider than viewport: ${s.wide.join(', ')}`); if (s.clipped.length) problems.push(`${name} ${id}: clipped text: ${s.clipped.join(', ')}`);
    if (cmp && fs.existsSync(path.join(root, cmp, name, id + '.png'))) { const ref = fs.readFileSync(path.join(root, cmp, name, id + '.png')); const pct = await p.evaluate(async ([a, b]) => { const ld = async (x) => { const i = new Image(); i.src = 'data:image/png;base64,' + x; await i.decode(); const c = document.createElement('canvas'); c.width = 96; c.height = 96; const g = c.getContext('2d'); g.drawImage(i, 0, 0, 96, 96); return g.getImageData(0, 0, 96, 96).data; }; const A = await ld(a), B = await ld(b); let n = 0; for (let k = 0; k < A.length; k += 4) if (Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]) > 90) n++; return 100 * n / 9216; }, [buf.toString('base64'), ref.toString('base64')]); diffs.push(`${name} ${id}: ${pct.toFixed(1)}% differ from ${cmp}`); }
  }
  const file = path.join(out, `sheet-${name}.png`); await sheet(frames, file, w < 500 ? 6 : 4); sheets.push(path.basename(file));
  await ctx.close();
}
const rubric = ['first frame is dark, one lit diya, six objects or fewer', '324 then 19 reads in under 3 s', 'every act has exactly one hero subject', 'transition frames show light moving, not elements popping', 'body text is readable on every lit surface', 'no two controls of equal weight', 'lamps, flame and halos agree on warm colour (no pure white, no cold blue lights)', 'Ink looks deliberate, not broken', 'Calm is finished and glowing, never blank', '360x640 has no cut-off control', '1920x1080 does not look stretched or empty', 'the final frame leaves the reader with the lit row and one question'];
fs.writeFileSync(path.join(out, 'report.html'), `<!doctype html><meta charset=utf-8><title>Filmstrip report</title><style>body{font:15px system-ui;background:#111;color:#eee;max-width:1100px;margin:auto;padding:16px}img{max-width:100%}li{margin:3px 0}</style><h1>Five-minute rubric (25 s each; any "no" fails)</h1><ol>${rubric.map((r) => `<li>${r}</li>`).join('')}</ol><h2>Automatic sanity</h2><pre>${problems.length ? problems.join('\n') : 'no problems'}</pre>${diffs.length ? `<h2>Diff vs ${cmp}</h2><pre>${diffs.join('\n')}</pre>` : ''}<h2>Contact sheets</h2>${sheets.map((s) => `<h3>${s}</h3><img src="${s}">`).join('')}`);
await browser.close(); srv.close();
console.log(problems.length ? problems.map((x) => '  FAIL ' + x).join('\n') : 'filmstrip: no sanity problems'); console.log(`report: ${path.relative(root, path.join(out, 'report.html'))} (${sheets.length} contact sheets)`);
process.exit(problems.length ? 1 : 0);
