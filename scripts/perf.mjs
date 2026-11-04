// Performance harness (dev only). Usage: npm run perf [-- --full --strict --write-baseline --dir=dist-perf]
// Serves dist-perf/ (npm run build:perf), sweeps every act at 4x CPU, records frames, long tasks, INP, CLS.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const arg = (k) => process.argv.find((a) => a === '--' + k || a.startsWith('--' + k + '='));
const full = !!arg('full'), strict = !!arg('strict'), writeBase = !!arg('write-baseline');
const dir = path.join(root, (arg('dir') || '--dir=dist-perf').split('=')[1] || 'dist-perf');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(dir, u === '/' ? 'index.html' : u); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f)); }).listen(0);
const base = 'http://127.0.0.1:' + srv.address().port + '/';

const INIT = () => {
  window.__p = { long: [], cls: 0, inp: 0, dt: new Float32Array(20000), n: 0, errs: [] };
  const po = (type, fn, o = {}) => { try { new PerformanceObserver((l) => l.getEntries().forEach(fn)).observe({ type, buffered: true, ...o }); } catch {} };
  po('longtask', (e) => __p.long.push([Math.round(e.startTime), Math.round(e.duration)]));
  po('layout-shift', (e) => { if (!e.hadRecentInput) __p.cls += e.value; });
  po('event', (e) => { if (['pointerdown', 'pointerup', 'click', 'keydown'].includes(e.name)) __p.inp = Math.max(__p.inp, e.duration); }, { durationThreshold: 16 });
  let last = performance.now();
  const loop = (t) => { if (__p.n < 20000) __p.dt[__p.n++] = t - last; last = t; requestAnimationFrame(loop); };
  requestAnimationFrame(loop);
  window.addEventListener('error', (e) => __p.errs.push(String(e.message)));
};
const stats = (a) => { if (!a.length) return { frames: 0, median: 0, p95: 0, p99: 0, max: 0, dropped: 0, jank: 0 }; const s = [...a].sort((x, y) => x - y), q = (p) => s[Math.min(s.length - 1, Math.floor(s.length * p))]; const dur = a.reduce((x, y) => x + y, 0); return { frames: a.length, median: +q(0.5).toFixed(1), p95: +q(0.95).toFixed(1), p99: +q(0.99).toFixed(1), max: +s[s.length - 1].toFixed(1), dropped: +(100 * a.filter((v) => v > 25).length / a.length).toFixed(1), jank: +(a.reduce((x, v) => x + Math.max(0, v - 16.7), 0) / dur).toFixed(3) }; };
const IDS = ['night', 'baithak', 'lamp-1', 'lamp-2', 'lamp-3', 'pattern', 'voice', 'lamp-6', 'verdict', 'deeper', 'wish', 'closure'];

const quick = !!arg('quick'); // one config: 390x844, 4x, tier high, normal
const cfgs = quick ? [{ v: '390', cpu: 4, q: 'high', calm: false }] : full
  ? [['390', 1], ['390', 4], ['1366', 1], ['1366', 4]].flatMap(([v, c]) => ['high', 'mid', 'low'].flatMap((q) => [false, true].map((calm) => ({ v, cpu: c, q, calm }))))
  : ['high', 'mid'].flatMap((q) => [false, true].map((calm) => ({ v: '390', cpu: 4, q, calm })));

if (arg('calm')) cfgs.splice(0, cfgs.length, { v: '390', cpu: 4, q: 'high', calm: true }); // calm only
if (arg('quick')) cfgs.splice(1); // one config: 390@4x high
const browser = await chromium.launch({ args: ['--no-sandbox', '--enable-gpu-rasterization'] });
const results = [], hardFail = [];
for (const c of cfgs) {
  const ctx = await browser.newContext(c.v === '390' ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true, reducedMotion: c.calm ? 'reduce' : 'no-preference' } : { viewport: { width: 1366, height: 768 }, reducedMotion: c.calm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage(); const cdp = await ctx.newCDPSession(page);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: c.cpu });
  await page.addInitScript(INIT);
  const hosts = new Set(); page.on('request', (r) => { try { const u = new URL(r.url()); if (!/^(data|blob):/.test(u.protocol) && u.host !== new URL(base).host) hosts.add(u.host); } catch {} });
  const cons = []; page.on('console', (m) => m.type() === 'error' && cons.push(m.text())); page.on('pageerror', (e) => cons.push(String(e)));
  await page.goto(base + (arg('auto') ? '?auto=1' : '?q=' + c.q) + (process.env.OFF ? '&off=' + process.env.OFF : ''), { waitUntil: 'load' }); await page.waitForTimeout(4000);
  const label = `${c.v}@${c.cpu}x ${c.q}${c.calm ? ' calm' : ''}`;
  const windows = {}, skipped = [];
  for (const id of IDS) {
    if (!(await page.$('#' + id))) { skipped.push(id); continue; }
    await page.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id); await page.waitForTimeout(500);
    const n0 = await page.evaluate(() => __p.n);
    for (let i = 0; i < 12; i++) { await page.evaluate(() => scrollBy(0, 160)); await page.waitForTimeout(100); }
    await page.waitForTimeout(1800);
    windows[id] = stats(Array.from(await page.evaluate((s) => Array.from(__p.dt.slice(s, __p.n)), n0)));
  }
  // interaction sweep (best effort): hold the diya, tap a lamp, drag a range input
  const inter = {};
  try {
    await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(400);
    const n0 = await page.evaluate(() => __p.n);
    const hold = await page.$('[data-hold], .hold, button[aria-label*="diya" i]');
    if (hold) { const b = await hold.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(1400); await page.mouse.up(); }
    const rng = await page.$('input[type=range]');
    if (rng) { await rng.scrollIntoViewIfNeeded(); const b = await rng.boundingBox(); await page.mouse.move(b.x + 4, b.y + b.height / 2); await page.mouse.down(); for (let i = 1; i <= 24; i++) await page.mouse.move(b.x + (b.width * i) / 24, b.y + b.height / 2); await page.mouse.up(); }
    await page.waitForTimeout(500);
    inter.all = stats(Array.from(await page.evaluate((s) => Array.from(__p.dt.slice(s, __p.n)), n0)));
  } catch (e) { inter.error = String(e).slice(0, 80); }
  const govState = await page.evaluate(() => (window.__perf ? { tier: document.documentElement.dataset.quality, fx: window.__perf.state().fx.filter(([, on]) => !on).map(([id]) => id) } : null)); if (arg('auto')) console.log('governor end state', label, JSON.stringify(govState));
  const costs = await page.evaluate(() => (window.__perf ? window.__perf.cost() : [])); const st = await page.evaluate(() => (window.__perf ? window.__perf.state() : null));
  const p = await page.evaluate(() => ({ long: __p.long, cls: +__p.cls.toFixed(4), inp: Math.round(__p.inp), errs: __p.errs }));
  const lateLong = p.long.filter(([t, d]) => t > 4000 && d > 200);
  if (c.q === 'high' && c.cpu === 4 && c.v === '390') {
    if (lateLong.length) hardFail.push(`${label}: long task over 200 ms after 4 s: ${JSON.stringify(lateLong)}`);
    if (p.inp > 250) hardFail.push(`${label}: INP ${p.inp} ms`);
    if (p.cls > 0.05) hardFail.push(`${label}: CLS ${p.cls}`);
  }
  if (cons.length || p.errs.length) hardFail.push(`${label}: console/page errors: ${[...cons, ...p.errs].slice(0, 3).join(' | ')}`);
  if (hosts.size) hardFail.push(`${label}: third-party hosts: ${[...hosts].join(', ')}`);
  results.push({ label, cfg: c, costs, effectState: st, windows, interaction: inter, longTasks: p.long, cls: p.cls, inp: p.inp, skipped });
  await ctx.close();
}
await browser.close(); srv.close();

// ratchet against baseline
const basePath = path.join(root, 'perf/baseline-v3.json');
const baseline = fs.existsSync(basePath) ? JSON.parse(fs.readFileSync(basePath, 'utf8')) : null;
const warns = [];
for (const r of results) {
  const b = baseline && baseline.find((x) => x.label === r.label);
  for (const [id, w] of Object.entries(r.windows)) {
    if (w.p95 > 34 || w.dropped > 8) warns.push(`${r.label} ${id}: p95 ${w.p95} ms, dropped ${w.dropped}%`);
    const bw = b && b.windows[id];
    if (bw && bw.median > 0 && (w.median > bw.median * 1.2 + 0.5 || w.p95 > bw.p95 * 1.25 + 1)) hardFail.push(`${r.label} ${id}: regressed vs baseline (median ${bw.median}->${w.median}, p95 ${bw.p95}->${w.p95})`);
  }
}
const ts = new Date().toISOString().replace(/[:.]/g, '-');
fs.mkdirSync(path.join(root, 'perf'), { recursive: true });
fs.writeFileSync(path.join(root, `perf/report-${ts}.json`), JSON.stringify(results, null, 1));
if (writeBase) { fs.writeFileSync(basePath, JSON.stringify(results.map(({ label, windows }) => ({ label, windows })), null, 1)); console.log('wrote perf/baseline-v3.json'); }
console.log('| config | act | frames | median | p95 | p99 | max | dropped% | jank |\n|---|---|---|---|---|---|---|---|---|');
for (const r of results) for (const [id, w] of Object.entries(r.windows)) console.log(`| ${r.label} | ${id} | ${w.frames} | ${w.median} | ${w.p95} | ${w.p99} | ${w.max} | ${w.dropped} | ${w.jank} |`);
for (const r of results) console.log(`${r.label}: CLS ${r.cls}, INP ${r.inp} ms, long tasks ${r.longTasks.length}${r.skipped.length ? ', skipped ' + r.skipped.join(',') : ''}`);
const costRows = results.filter((r) => r.cfg.v === '390' && r.cfg.cpu === 4 && !r.cfg.calm).flatMap((r) => (r.costs || []).map((c) => ({ label: r.label, ...c })));
if (costRows.length) {
  const md = ['# Effect cost table (perf build, 390x844, 4x CPU, software rasteriser)', '', 'ms is the EWMA per measured use where an effect calls measure(); otherwise the registered estimate. An effect over 2.0 ms is flagged.', '', '| config | effect | kind | priority | ms | scale | shed | pinned |', '|---|---|---|---|---|---|---|---|', ...costRows.map((c) => `| ${c.label} | ${c.id} | ${c.kind} | ${c.priority} | ${c.ms}${c.ms > 2 ? ' FLAG' : ''} | ${c.scale} | ${c.shedCount} | ${c.pinned ? 'yes' : ''} |`)].join('\n');
  fs.writeFileSync(path.join(root, 'perf/EFFECT_COST.md'), md + '\n'); console.log(md);
}
for (const w of warns) console.log('  warn  ' + w);
for (const f of hardFail) console.log('  FAIL  ' + f);
process.exit(hardFail.length || (strict && warns.length) ? 1 : 0);
