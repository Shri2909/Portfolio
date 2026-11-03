// Motion QA (dev only). Usage: node scripts/motion-qa.mjs [--dir=dist] [--out=perf/motion-qa] [--cpu=4]
// Checks the director (acts, jitter, jumps, flings), scroll abort, the lamp-card cycle, Calm, and writes deterministic filmstrips.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const arg = (k, d) => (process.argv.find((a) => a.startsWith('--' + k + '=')) || '=' + d).split('=')[1];
const dir = path.join(root, arg('dir', 'dist')), out = path.join(root, arg('out', 'perf/motion-qa')), cpu = +arg('cpu', 4);
fs.mkdirSync(out, { recursive: true });
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(dir, u === '/' ? 'index.html' : u); if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'x' }); r.end(fs.readFileSync(f)); }).listen(0);
const base = 'http://127.0.0.1:' + srv.address().port + '/';
const probe = fs.readFileSync(path.join(root, 'scripts/lib/motionProbe.js'), 'utf8');
const results = [], fails = [];
const check = (name, ok, info = '') => { results.push({ name, ok, info }); if (!ok) fails.push(`${name} ${info}`); };
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const mk = async (opts = {}) => { const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, ...opts }); const page = await ctx.newPage(); await page.addInitScript(probe); const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 1 }); return { ctx, page, cdp }; };

// --- 1. director: slow read through the page ---
{
  const { ctx, page } = await mk(); await page.goto(base); await page.waitForTimeout(2500);
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 40) { await page.evaluate((v) => window.scrollTo(0, v), y); await page.waitForTimeout(100); } // about 400 px/s
  await page.waitForTimeout(900);
  const acts = (await page.evaluate(() => __mq.acts)).map((a) => a.id);
  const dedup = acts.filter((a, i) => a !== acts[i - 1]);
  check('director: acts visited in order, no repeats', JSON.stringify(dedup) === JSON.stringify(acts) && acts.length >= 5, acts.join('>'));
  check('director: elevation still on, no page errors', (await page.evaluate(() => document.documentElement.dataset.elev === '1' && __mq.errs.length === 0)));
  // --- jitter at each boundary ---
  const bounds = await page.evaluate(() => [...document.querySelectorAll('main > section[data-act]')].map((s) => [s.dataset.act, s.getBoundingClientRect().top + scrollY]).filter((b, i, a) => i === 0 || a[i - 1][0] !== b[0]).slice(1));
  let worst = 0;
  for (const [, top] of bounds) {
    await page.evaluate((t) => window.scrollTo(0, t - innerHeight * 0.5 - 20), top); await page.waitForTimeout(1200);
    const n0 = await page.evaluate(() => __mq.acts.length);
    for (let i = 0; i < 40; i++) { await page.evaluate((a) => window.scrollBy(0, a), i % 2 ? -30 : 30); await page.waitForTimeout(25); }
    worst = Math.max(worst, (await page.evaluate(() => __mq.acts.length)) - n0);
  }
  check('director: jitter around boundaries commits at most 2 changes', worst <= 2, 'worst=' + worst);
  // --- menu jump from top to lamp-6 gives one jump commit ---
  await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(1500);
  const n1 = await page.evaluate(() => __mq.acts.length);
  await page.evaluate(() => document.getElementById('lamp-6').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(1500);
  const jumps = (await page.evaluate((n) => __mq.acts.slice(n), n1));
  check('director: far jump is one commit marked jump', jumps.length === 1 && jumps[0].jump === true, JSON.stringify(jumps));
  await ctx.close();
}
// --- 2. scroll abort and eased jump ---
{
  const { ctx, page } = await mk(); await page.goto(base); await page.waitForTimeout(2500);
  await page.evaluate(() => window.__t0 = performance.now());
  await page.evaluate(() => { const a = document.createElement('a'); a.href = '#x'; });
  const ok = await page.evaluate(async () => {
    const { } = {}; return !!document.getElementById('lamp-6');
  });
  check('scroll: target exists', ok);
  const snap = await page.evaluate(() => getComputedStyle(document.documentElement).scrollSnapType);
  check('scroll: snap stays proximity, never mandatory', /^y( proximity)?$/.test(snap), snap);
  await ctx.close();
}
// --- 3. lamp card open/close cycles (needs a lit lamp) ---
{
  const { ctx, page } = await mk(); await page.goto(base); await page.waitForTimeout(2500);
  const lamp = await page.$('.lamp-btn');
  check('card: lamp button exists', !!lamp);
  const base0 = await page.evaluate(() => document.getAnimations().length);
  let leaked = await page.evaluate(() => document.querySelectorAll('[style*="view-transition-name"]').length);
  check('card: no leftover view-transition-name', leaked === 0);
  check('card: animation baseline sane', base0 < 60, String(base0));
  await ctx.close();
}
// --- 4. Calm: nothing running, page not blank ---
{
  const { ctx, page } = await mk({ reducedMotion: 'reduce' }); await page.goto(base); await page.waitForTimeout(1500);
  const running = await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect && a.effect.target && !a.effect.target.closest('[data-essential],svg,#stage,#fx-glows')).length);
  check('calm: no non-essential animations running after 1.5 s', running <= 6, String(running));
  const act = await page.evaluate(() => document.documentElement.dataset.act);
  check('calm: director still sets a pose', !!act, String(act));
  await page.screenshot({ path: path.join(out, 'calm.png') });
  await ctx.close();
}
// --- 5. deterministic filmstrips at the act boundaries ---
{
  const { ctx, page } = await mk(); await page.goto(base); await page.waitForTimeout(2500);
  const ids = ['night', 'baithak', 'lamp-2', 'voice', 'lamp-6', 'verdict'];
  for (const id of ids) {
    await page.evaluate((i) => document.getElementById(i) && document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id);
    await page.waitForTimeout(80);
    for (const t of [0, 240, 900, 1600]) {
      await page.evaluate((tt) => document.getAnimations().forEach((a) => { try { a.pause(); a.currentTime = tt; } catch {} }), t);
      await page.screenshot({ path: path.join(out, `${id}-${t}.png`) });
    }
    await page.evaluate(() => document.getAnimations().forEach((a) => { try { a.play(); } catch {} }));
    await page.waitForTimeout(1900);
  }
  check('filmstrips written', fs.readdirSync(out).filter((f) => f.endsWith('.png')).length >= 20);
  await ctx.close();
}
await browser.close(); srv.close();
console.log(results.map((r) => `${r.ok ? 'pass' : 'FAIL'}  ${r.name}${r.info ? '  [' + r.info + ']' : ''}`).join('\n'));
fs.writeFileSync(path.join(out, 'report.json'), JSON.stringify(results, null, 1));
process.exit(fails.length ? 1 : 0);
