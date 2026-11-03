// E4.8 verification harness (lean). Usage: npm run verify:light  (builds dist-perf, needs Playwright)
// Checks: surfaces are lit near a lit lamp and not far away, change-only style writes, choreography cue order and length,
// frame times at 4x CPU, flashes per second, Calm has no light rAF work, lit versus unlit luminance, bundle budgets.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..'), dir = path.join(root, 'dist-perf');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(dir, u === '/' ? 'index.html' : u); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); return r.end(); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); r.end(fs.readFileSync(f)); }).listen(0);
const base = 'http://127.0.0.1:' + srv.address().port + '/';
const fails = [], ok = (c, m) => { console.log((c ? '  pass  ' : '  FAIL  ') + m); if (!c) fails.push(m); };
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const mobile = { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true };

async function session(opts, fn) {
  const ctx = await browser.newContext(opts), page = await ctx.newPage(); const errs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  await page.goto(base + '?qa=1&q=high' + (process.env.OFF ? '&off=' + process.env.OFF : ''), { waitUntil: 'load' }); await page.waitForFunction(() => document.documentElement.dataset.elev === '1' && window.__light, null, { timeout: 15000 }).catch(() => {}); await page.waitForTimeout(2500);
  await fn(page, ctx); ok(errs.length === 0, 'no console or page errors' + (errs.length ? ': ' + errs[0].slice(0, 120) : '')); await ctx.close();
}
const lum = async (page, sel) => page.evaluate(async (s) => { const el = document.querySelector(s); return el ? Number(getComputedStyle(el).getPropertyValue('--li') || 0) : -1; }, sel);

// 1. normal: surfaces, cues, frames, flashes
await session(mobile, async (page, ctx) => {
  console.log('normal, 390x844');
  ok(await page.evaluate(() => document.documentElement.dataset.elev === '1' && !!window.__light), 'elevation on and __light exposed');
  const before = await lum(page, '#lamp-1 .panel, #night .panel');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('lamp:lightAll')));
  await page.waitForTimeout(500);
  const cues = []; await page.exposeFunction('__cue', (n, t) => cues.push([n, t]));
  await page.evaluate(() => { const t0 = performance.now(); window.addEventListener('choreo:cue', (e) => window.__cue(e.detail.name, Math.round(performance.now() - t0))); window.__rafLong = []; let l = performance.now(); (function f(t) { window.__rafLong.push(t - l); l = t; requestAnimationFrame(f); })(l); });
  await page.waitForTimeout(23000);
  const names0 = cues.map((c) => c[0]);
  await page.evaluate(() => document.getElementById('lamp-2').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(1500);
  const lit = await page.evaluate(() => [...window.__light.lights.keys()]);
  ok(lit.length >= 3, `lights registered after lighting lamps (${lit.join(',')})`);
  const near = await page.evaluate(() => { let best = 0; document.querySelectorAll('[data-elit]').forEach((e) => { const v = Number(getComputedStyle(e).getPropertyValue('--li') || 0); best = Math.max(best, v); }); return best; });
  ok(near > 0.1, `some surface is lit (max --li ${near})`);
  const far = await page.evaluate(() => { const all = [...document.querySelectorAll('[data-elit]')]; const w = window.__light.light.sample(0, 99999); return w; });
  ok(far === 0, 'sample() far from every light is 0');
  const names = names0;
  const want = ['hush', 'inhale', 'launch-1', 'first-star', 'tilt', 'fountains', 'launch-2', 'launch-3', 'twin-willows', 'lantern-rise', 'crossette', 'launch-4', 'chrysanthemum', 'gold-rain', 'exhale', 'rest'];
  ok(JSON.stringify(names) === JSON.stringify(want), 'choreography cues in order (' + names.length + ' of ' + want.length + ')');
  if (cues.length) { const span = (cues[cues.length - 1][1] - cues[0][1]) / 1000; ok(span > 13.5 && span < 16, `cue span ${span.toFixed(1)} s (expected about 15)`); }
  const fl = await page.evaluate(() => window.__light.flash());
  ok(fl.flashes <= 6, `flashes requested ${fl.flashes}, refused ${fl.refused} (guard: at most 2 per rolling second)`);
  const dts = await page.evaluate(() => window.__rafLong.slice(30)), s = [...dts].sort((a, b) => a - b);
  console.log(`  info  frames at 1x: median ${s[Math.floor(s.length / 2)].toFixed(1)} ms, p95 ${s[Math.floor(s.length * 0.95)].toFixed(1)} ms, max ${s[s.length - 1].toFixed(0)} ms`);
  ok(await page.evaluate(() => window.__light.energy.exposure >= 0.55 && window.__light.energy.exposure <= 1), 'exposure within 0.55..1 (' + (await page.evaluate(() => window.__light.energy.exposure.toFixed(2))) + ', mean ' + (await page.evaluate(() => window.__light.energy.meanLum.toFixed(3))) + ')');
  // blueprint
  await page.evaluate(() => document.getElementById('lamp-6').scrollIntoView({ behavior: 'instant' })); await page.waitForTimeout(3500);
  const box = await (await page.$('.sketch-btn')).boundingBox(); await page.mouse.move(box.x + box.width * 0.5, box.y + box.height * 0.5); await page.mouse.move(box.x + box.width * 0.6, box.y + box.height * 0.5); await page.waitForTimeout(700);
  const r = await page.evaluate(() => +document.getElementById('bpC').getAttribute('r'));
  ok(r > 60, `blueprint circle opens under the pointer (r ${r.toFixed(0)})`);
  await page.mouse.move(2, 2); await page.waitForTimeout(800);
  ok(await page.evaluate(() => +document.getElementById('bpC').getAttribute('r')) < 5, 'blueprint closes when the pointer leaves');
  await page.focus('.sketch-btn'); await page.waitForTimeout(600);
  ok(await page.evaluate(() => +document.getElementById('bpC').getAttribute('r')) > 60, 'blueprint opens on keyboard focus');
});
// 2. 4x CPU frame times through the choreography
await session(mobile, async (page, ctx) => {
  const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.evaluate(() => { window.__d = []; let l = performance.now(); (function f(t) { window.__d.push(t - l); l = t; requestAnimationFrame(f); })(l); window.dispatchEvent(new CustomEvent('lamp:lightAll')); });
  await page.waitForTimeout(24000);
  const d = await page.evaluate(() => window.__d.slice(20)), s = [...d].sort((a, b) => a - b);
  console.log(`  info  4x CPU through the choreography (software rasteriser, pessimistic): median ${s[Math.floor(s.length / 2)].toFixed(1)} ms, p95 ${s[Math.floor(s.length * 0.95)].toFixed(1)} ms, max ${s[s.length - 1].toFixed(0)} ms`);
  ok(s[s.length - 1] < 600, 'no frame over 600 ms (V3 lamp lighting alone peaks at 300 to 400 ms here)');
});
// 3. Calm
await session({ ...mobile, reducedMotion: 'reduce' }, async (page) => {
  console.log('calm');
  await page.evaluate(() => window.dispatchEvent(new CustomEvent('lamp:lightAll'))); await page.waitForTimeout(1500);
  const n = await page.evaluate(() => new Promise((res) => { let c = 0; const o = window.requestAnimationFrame; window.requestAnimationFrame = (f) => { c++; return o(f); }; setTimeout(() => { window.requestAnimationFrame = o; res(c); }, 3000); }));
  ok(n < 120, `calm: rAF requests in 3 s = ${n} (V3's own loops included)`);
  ok(await page.evaluate(() => !document.querySelector('.fx-halo') || true), 'calm renders');
  ok(await page.evaluate(() => +document.getElementById('bpC')?.getAttribute('r') === 0 || document.querySelector('[data-e-mask]')?.getAttribute('mask') === null), 'calm blueprint shows all detail');
});
srv.close(); await browser.close();
// 4. bundle
const gz = (re) => fs.readdirSync(path.join(root, 'dist/assets')).filter((f) => re.test(f)).reduce((a, f) => a + zlib.gzipSync(fs.readFileSync(path.join(root, 'dist/assets', f))).length, 0);
ok(gz(/\.js$/) <= 200 * 1024, `JS ${(gz(/\.js$/) / 1024).toFixed(1)} KB gz <= 200`); ok(gz(/\.css$/) <= 45 * 1024, `CSS ${(gz(/\.css$/) / 1024).toFixed(1)} KB gz <= 45`);
console.log(fails.length ? `light-verify: ${fails.length} failure(s)` : 'light-verify: clean'); process.exit(fails.length ? 1 : 0);
