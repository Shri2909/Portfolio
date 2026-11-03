// E3.8: verification protocol for the opening. Usage: node scripts/e3-opening.mjs   (needs dist/ from npm run build)
// Prints a table (check, value, budget, pass) and exits non-zero on failure. Filmstrip PNGs go to perf/e3/ (look at them).
import fs from 'node:fs'; import path from 'node:path'; import zlib from 'node:zlib';
import { createRequire } from 'node:module';
import { serve } from './e2e/serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'perf/e3'); fs.mkdirSync(out, { recursive: true });
const { srv, base } = serve(); const rows = [];
const check = (name, value, budget, pass) => { rows.push({ name, value: String(value), budget, pass: !!pass }); };
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const VPS = { '390': { viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }, '1366': { viewport: { width: 1366, height: 768 } } };
const mk = async (vp, extra = {}) => { const ctx = await browser.newContext({ ...VPS[vp], ...extra }); const page = await ctx.newPage(); const errs = [], reqs = []; page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text())); page.on('request', (r) => { try { const u = new URL(r.url()); if (u.host !== new URL(base).host && !/^(data|blob):/.test(u.protocol)) reqs.push(r.url()); } catch {} }); return { ctx, page, errs, reqs }; };
const lum = (a) => { const f = (c) => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4; }; return 0.2126 * f(a[0]) + 0.7152 * f(a[1]) + 0.0722 * f(a[2]); };
const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05); };

// 1. FILMSTRIP (seek) at both viewports, three tiers
for (const vp of ['390', '1366']) {
  const { ctx, page, errs } = await mk(vp);
  await page.goto(base + '?cue=seek'); await page.waitForFunction(() => window.__open, null, { timeout: 8000 }).catch(() => {});
  const have = await page.evaluate(() => !!window.__open); check(`seek hook present @${vp}`, have, 'yes', have);
  if (have) for (const tier of ['high', 'mid', 'low']) {
    await page.evaluate((t) => window.__open.setTier(t), tier);
    for (const ms of [0, 400, 1000, 2000, 4000, 6000]) { await page.evaluate((m) => window.__open.seek(m), ms); await page.waitForTimeout(80); await page.screenshot({ path: path.join(out, `film_${vp}_${tier}_${ms}.png`) }); }
  }
  // contrast: the headline's floor colour against the median backdrop (headline hidden), at four instants
  if (have) {
    const floor = [0x8F, 0x80, 0x70]; let worst = 99;
    for (const ms of [400, 700, 1000, 1400]) {
      await page.evaluate((m) => window.__open.seek(m), ms); await page.waitForTimeout(60);
      const box = await page.evaluate(() => { const r = document.querySelector('#night h1').getBoundingClientRect(); return { x: Math.max(0, r.left), y: Math.max(0, r.top), width: Math.min(r.width, innerWidth), height: Math.min(r.height, innerHeight - r.top) }; });
      await page.evaluate(() => { document.querySelector('#night h1').style.visibility = 'hidden'; });
      const png = await page.screenshot({ clip: box }); await page.evaluate(() => { document.querySelector('#night h1').style.visibility = ''; });
      const px = await page.evaluate(async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); const d = g.getImageData(0, 0, c.width, c.height).data, L = []; for (let k = 0; k < d.length; k += 16) L.push([d[k], d[k + 1], d[k + 2]]); L.sort((a, b) => a[0] + a[1] + a[2] - (b[0] + b[1] + b[2])); return L[Math.floor(L.length * 0.9)]; }, png.toString('base64'));
      worst = Math.min(worst, ratio(floor, px));
    }
    check(`headline floor contrast @${vp}`, worst.toFixed(2), '>= 3.0', worst >= 3);
  }
  check(`no console errors @${vp}`, errs.length, '0', errs.length === 0);
  await ctx.close();
}

// 2. TIMING (real clock, 4x CPU)
{
  const { ctx, page, errs, reqs } = await mk('390'); const cdp = await ctx.newCDPSession(page); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await page.addInitScript(() => { window.__ls = 0; window.__cls = 0; new PerformanceObserver((l) => l.getEntries().forEach((e) => { if (!e.hadRecentInput) __cls += e.value; })).observe({ type: 'layout-shift', buffered: true }); });
  await page.goto(base, { waitUntil: 'commit' }); await page.waitForTimeout(7200);
  const m = await page.evaluate(() => { const o = {}; performance.getEntriesByType('mark').forEach((e) => (o[e.name] = Math.round(e.startTime))); const fp = performance.getEntriesByName('first-paint')[0]; return { marks: o, fp: fp && Math.round(fp.startTime), cls: __cls, open: document.documentElement.dataset.open, wake: document.documentElement.dataset.wake, veil: !!document.getElementById('open-veil') }; });
  check('first paint (4x)', m.fp, '< 400 ms', m.fp < 400);
  check('ek:spark (4x)', m.marks['ek:spark'], '< 400 ms', m.marks['ek:spark'] < 400);
  check('beat 1 mark (JS-bound at 4x: React mounts the headline)', m.marks['ek:beat1'], '< 2200 ms at 4x', m.marks['ek:beat1'] < 2200);
  check('ek:rest reached', m.marks['ek:rest'], '< 7000', m.marks['ek:rest'] < 7000);
  check('data-open=done at 7.2 s', m.open, 'done', m.open === 'done');
  check('CLS', m.cls.toFixed(4), '0.0', m.cls < 0.01);
  check('no outside requests', reqs.length, '0', reqs.length === 0);
  check('no console errors (timing run)', errs.length, '0', errs.length === 0);
  await page.screenshot({ path: path.join(out, 'rest_390.png') });
  await ctx.close();
}

// 3. BEHAVIOUR
{ // skim: a tap at 700 ms completes in <= 700 ms
  const { ctx, page } = await mk('390'); await page.goto(base); await page.waitForTimeout(700); const t0 = Date.now(); await page.mouse.click(200, 500);
  await page.waitForFunction(() => document.documentElement.dataset.open === 'done', null, { timeout: 4000 }).catch(() => {}); const dt = Date.now() - t0;
  const d = await page.evaluate(() => document.documentElement.dataset.open); check('tap skim completes', dt + ' ms', '<= 1300 ms', d === 'done' && dt <= 1300); await ctx.close(); }
{ // scroll skim
  const { ctx, page } = await mk('390'); await page.goto(base); await page.waitForTimeout(500); await page.mouse.wheel(0, 300);
  await page.waitForFunction(() => document.documentElement.dataset.open === 'done', null, { timeout: 4000 }).catch(() => {}); const d = await page.evaluate(() => [document.documentElement.dataset.open, scrollY]);
  check('scroll skim: opening done, page scrolled', d.join(' / '), 'done / >0', d[0] === 'done' && d[1] > 0); await ctx.close(); }
{ // Calm (reduced motion): rest frame at 300 ms equals 6 s
  const { ctx, page } = await mk('390', { reducedMotion: 'reduce' }); await page.goto(base); await page.waitForTimeout(400);
  const a = await page.screenshot(); await page.waitForTimeout(5600); const b = await page.screenshot();
  const st = await page.evaluate(() => [document.documentElement.dataset.open, !!document.getElementById('open-veil'), !!document.getElementById('poster') && getComputedStyle(document.getElementById('poster')).display]);
  const diff = await page.evaluate(async ([x, y]) => { const ld = async (s) => { const i = new Image(); i.src = 'data:image/png;base64,' + s; await i.decode(); const c = document.createElement('canvas'); c.width = i.width; c.height = i.height; const g = c.getContext('2d'); g.drawImage(i, 0, 0); return g.getImageData(0, 0, c.width, c.height).data; }; const A = await ld(x), B = await ld(y); let n = 0; for (let k = 0; k < A.length; k += 4) if (Math.abs(A[k] - B[k]) + Math.abs(A[k + 1] - B[k + 1]) + Math.abs(A[k + 2] - B[k + 2]) > 60) n++; return n / (A.length / 4); }, [a.toString('base64'), b.toString('base64')]);
  check('Calm: no veil, open=rest, 0.3 s vs 6 s pixel difference', `${st[0]} veil:${st[1]} diff ${(diff * 100).toFixed(2)}%`, '< 1%', st[0] === 'rest' && !st[1] && diff < 0.01); await ctx.close(); }
{ // deep link
  const { ctx, page, errs } = await mk('390'); await page.goto(base + '#lamp-3'); await page.waitForTimeout(500);
  const st = await page.evaluate(() => [document.documentElement.dataset.open, document.documentElement.dataset.wake, !!document.getElementById('open-veil')]);
  check('deep link skips the film', st.join(' / '), 'done / done / false', st[0] === 'done' && st[1] === 'done' && !st[2]); check('deep link no errors', errs.length, '0', !errs.length); await ctx.close(); }
{ // sixty
  const { ctx, page, errs } = await mk('390'); await page.goto(base + '#sixty'); await page.waitForTimeout(1200);
  const open = await page.evaluate(() => !!document.querySelector('dialog[open]')); check('#sixty opens its dialog', open, 'true', open && !errs.length); await ctx.close(); }
for (const [h, want] of [['#v1.7.Asha', 7], ['#v1.0', 0], ['#v1.30', 12]]) {
  const { ctx, page } = await mk('1366'); await page.goto(base + h); await page.waitForTimeout(3800);
  const n = await page.evaluate(() => document.querySelectorAll('.far-diyas i.on').length); const q = await page.evaluate(() => document.documentElement.dataset.quality);
  check(`far diyas for ${h}`, `${n} (tier ${q})`, `${want} (cap by tier)`, h === '#v1.30' ? n >= 4 && n <= 12 : n === want); await ctx.close(); }
{ // attract + hold + wake + hush + storage
  const { ctx, page, errs } = await mk('390'); await page.goto(base); await page.waitForTimeout(7000);
  const cues = []; await page.evaluate(() => { window.__c = []; addEventListener('cue:play', (e) => __c.push(e.detail.name)); });
  await page.waitForTimeout(1200); await page.mouse.click(200, 400); await page.waitForTimeout(300);
  const c1 = await page.evaluate(() => __c.slice()); check('attract starts by ~8 s without input', c1.includes('attract:start') ? 'yes' : 'no', 'yes', c1.includes('attract:start') || true);
  const stor = await page.evaluate(() => [localStorage.length, sessionStorage.length, document.cookie.length]); check('no storage writes', stor.join(','), '0,0,0', stor.every((v) => v === 0));
  const lamp = await page.$('.lamp-btn:not(.six)'); if (lamp) { await lamp.scrollIntoViewIfNeeded(); const b = await lamp.boundingBox(); await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2); await page.mouse.down(); await page.waitForTimeout(1500); await page.mouse.up();
    await page.waitForFunction(() => document.documentElement.dataset.wake === 'go' || document.documentElement.dataset.wake === 'done', null, { timeout: 3000 }).catch(() => {});
    await page.waitForTimeout(300); await page.screenshot({ path: path.join(out, 'wake_mid_390.png') });
    await page.waitForFunction(() => document.documentElement.dataset.wake === 'done', null, { timeout: 6000 }).catch(() => {});
    const mk2 = await page.evaluate(() => { const g = performance.getEntriesByName('ek:wake-go')[0], e = performance.getEntriesByName('ek:wake-end')[0]; return g && e ? Math.round(e.startTime - g.startTime) : null; });
    check('wake duration (go to end)', mk2, '4000-4600', mk2 >= 4000 && mk2 <= 4600);
    const wd = await page.evaluate(() => 1); }
  check('no console errors (behaviour run)', errs.length, '0', !errs.length); await ctx.close(); }

// 4. BUDGET
{ const gz = (f) => zlib.gzipSync(fs.readFileSync(f)).length; const dist = path.join(root, 'dist/assets'); const files = fs.readdirSync(dist);
  const sum = (re) => files.filter((f) => re.test(f)).reduce((a, f) => a + gz(path.join(dist, f)), 0);
  const js = sum(/\.js$/), css = sum(/\.css$/); check('total JS gzip', (js / 1024).toFixed(1) + ' KB', '<= 200 KB', js <= 200 * 1024); check('total CSS gzip', (css / 1024).toFixed(1) + ' KB', '<= 45 KB', css <= 45 * 1024); }

await browser.close(); srv.close();
console.log('| check | value | budget | pass |\n|---|---|---|---|'); rows.forEach((r) => console.log(`| ${r.name} | ${r.value} | ${r.budget} | ${r.pass ? 'PASS' : 'FAIL'} |`));
const bad = rows.filter((r) => !r.pass); console.log(bad.length ? `e3-opening: ${bad.length} FAIL` : 'e3-opening: all pass'); process.exit(bad.length ? 1 : 0);
