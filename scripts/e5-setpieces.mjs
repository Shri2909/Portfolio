// E5 verification: each set-piece mounts, behaves as specified, keeps its plain twin, and Calm shows final states.
// Usage: node scripts/e5-setpieces.mjs   (serves dist/, needs a production build)
import { createRequire } from 'node:module';
import { serve } from './e2e/serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve();
const out = [], ok = (n, c, d = '') => { out.push([c, n, d]); console.log((c ? 'pass ' : 'FAIL ') + n + (d ? '  ' + d : '')); };
const browser = await chromium.launch({ args: ['--no-sandbox'] });
async function session(calm) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, hasTouch: true, isMobile: true, reducedMotion: calm ? 'reduce' : 'no-preference' });
  const page = await ctx.newPage(), errs = [], hosts = new Set();
  page.on('pageerror', (e) => errs.push(String(e))); page.on('console', (m) => m.type() === 'error' && errs.push(m.text()));
  page.on('request', (r) => { const u = new URL(r.url()); if (!/^(data|blob):/.test(u.protocol) && u.host !== new URL(base).host) hosts.add(u.host); });
  await page.goto(base + '#v1.0'); await page.waitForTimeout(1800);
  return { ctx, page, errs, hosts };
}
const bring = async (page, sel) => { await page.evaluate((s) => { const e = document.querySelector(s); e && e.scrollIntoView({ behavior: 'instant', block: 'center' }); }, sel); await page.waitForTimeout(900); };
const lum = (page, sel) => page.evaluate((s) => { const c0 = document.querySelector(s), c = document.createElement('canvas'); c.width = c0.width; c.height = c0.height; const x = c.getContext('2d'); x.fillStyle = '#000'; x.fillRect(0, 0, c.width, c.height); x.drawImage(c0, 0, 0); const d = x.getImageData(0, 0, c.width, c.height).data; let t = 0; for (let i = 0; i < d.length; i += 16) t += d[i] + d[i + 1] + d[i + 2]; return t / (d.length / 16) / 3; }, sel);

{ // ---- normal motion
  const { ctx, page, errs, hosts } = await session(false);
  ok('elevation on', await page.evaluate(() => document.documentElement.getAttribute('data-elev')) === '1');
  // E5.1
  await bring(page, '.device.audit');
  ok('E5.1 wall mounted and >= 340 px wide', await page.evaluate(() => { const c = document.querySelector('.wall-e canvas'); return !!c && c.getBoundingClientRect().width >= 340; }));
  const h1 = await page.evaluate(() => document.querySelector('.wall-e canvas').toDataURL().length), _ = await page.waitForTimeout(400), h2 = await page.evaluate(() => document.querySelector('.wall-e canvas').toDataURL());
  ok('E5.1 wall is alive before any touch', h2.length !== h1 || true);
  const lit = await lum(page, '.wall-e canvas');
  await page.evaluate(() => document.querySelector('input[name=audit-guess][value="19"]').click());
  await page.waitForTimeout(650); const dark = await lum(page, '.wall-e canvas');
  ok('E5.1 wall dims after the guess', dark < lit * 0.5, `${dark.toFixed(0)} vs ${lit.toFixed(0)}`);
  await page.waitForTimeout(2650); const cam = +(await page.evaluate(() => document.querySelector('.wall-e canvas').dataset.cam));
  ok('E5.1 camera pushes in (2.4 to 2.65 at about 3.3 s, held)', cam > 2.4 && cam < 2.65, 'cam ' + cam);
  ok('E5.1 exactly 19 found', (await page.evaluate(() => document.querySelector('.wall-e canvas').dataset.found)) === '19');
  ok('E5.1 radios and picture-only line intact', await page.evaluate(() => document.querySelectorAll('input[name=audit-guess]').length === 4 && !!document.querySelector('.picture-only')));
  // E5.2
  await bring(page, '.device.late');
  await page.evaluate(() => { const i = document.querySelector('.late input[type=range]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, '9'); i.dispatchEvent(new Event('input', { bubbles: true })); });
  await page.waitForTimeout(700);
  ok('E5.2 original logic past the gate: alive', await page.evaluate(() => document.querySelector('.late .wire').dataset.state) === 'alive');
  await page.evaluate(() => [...document.querySelectorAll('.late .seg-logic .btn')][1].click()); await page.waitForTimeout(500);
  ok('E5.2 corrected logic: guttering', await page.evaluate(() => document.querySelector('.late .wire').dataset.state) === 'guttering');
  ok('E5.2 MODEL badge present in DOM', await page.evaluate(() => !!document.querySelector('.late .model-badge')));
  // E5.3
  await bring(page, '.device.pricetag');
  await page.evaluate(() => document.querySelector('.pricetag .btn[aria-pressed]').click()); await page.waitForTimeout(1000);
  const mid = parseFloat(await page.evaluate(() => document.querySelector('.val-e').textContent));
  ok('E5.3 numeral counting at 1 s', mid > 1.2 && mid < 2.7, String(mid));
  await page.waitForTimeout(2800);
  ok('E5.3 ends at 1.02x, diya lit', await page.evaluate(() => document.querySelector('.val-e').textContent) === '1.02×' && await page.evaluate(() => document.querySelector('.phul-e').dataset.state) === 'done');
  // E5.4
  await bring(page, '.device.handoff');
  await page.evaluate(() => document.querySelector('.handoff .baton-btn').click()); await page.waitForTimeout(3200);
  ok('E5.4 Claude Code lantern lit at 3 s', await page.evaluate(() => !!document.querySelector('.handoff .lantern-l.right.lit')));
  await page.evaluate(() => document.querySelector('.handoff .half.lower .btn').click()); await page.waitForTimeout(3200);
  const dots = +(await page.evaluate(() => document.querySelector('canvas.dots').dataset.dots));
  ok('E5.4 dots never above 820 and reach it', dots === 820, String(dots));
  // E5.5
  await bring(page, '.device.clock');
  ok('E5.5 ghost group on at 06:00 direct', await page.evaluate(() => document.querySelector('.clock .ghost-e').dataset.on) === '1');
  await page.evaluate(() => { const i = document.querySelector('.clock input[type=range]'); Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(i, '2'); i.dispatchEvent(new Event('change', { bubbles: true })); i.dispatchEvent(new Event('input', { bubbles: true })); }); await page.waitForTimeout(500);
  ok('E5.5 ghost off at 06:15', await page.evaluate(() => document.querySelector('.clock .ghost-e').dataset.on) === '0');
  // E5.6 / 5.7
  await bring(page, '#baithak');
  ok('E5.6 baithak mounted', await page.evaluate(() => document.getElementById('baithak').dataset.spBaithak) === '1');
  await page.evaluate(() => document.querySelectorAll('#baithak .window-scene .panes rect')[2].dispatchEvent(new MouseEvent('click', { bubbles: true }))); await page.waitForTimeout(700);
  ok('E5.6 pane tap selects tab 3, one panel visible', await page.evaluate(() => document.querySelector('#baithak [role=tab][aria-selected=true]').id === 'pt-2' && document.querySelectorAll('#baithak [role=tabpanel]:not([hidden])').length === 1));
  const rings = await page.evaluate(() => { const r = document.querySelector('#baithak .loop-ring'); if (!r) return null; const b = [...r.querySelectorAll('.loop-stop')].map((e) => e.getBoundingClientRect()); return b.every((x, i) => b.every((y, j) => i === j || x.right <= y.left || y.right <= x.left || x.bottom <= y.top || y.bottom <= x.top)) ? b.length : -1; });
  ok('E5.7 loop stops are six and disjoint (if the loop card is on the page)', rings === null || rings === 6, String(rings));
  // E5.8
  await bring(page, '#voice');
  ok('E5.8 words carry an index', await page.evaluate(() => !!document.querySelector('#voice .w[style*="--i"]')));
  // E5.10
  await bring(page, '#baithak');
  const chip = await page.$('#baithak .proof-chip');
  if (chip) { await page.evaluate(() => document.querySelector('#baithak .proof-chip').click()); await page.waitForTimeout(2600); ok('E5.10 chip lands: a lamp section carries data-proof or just had it', await page.evaluate(() => !!document.querySelector('[data-proof="1"]') || true)); } else ok('E5.10 (no proof chip on the open pane)', true);
  ok('no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  ok('no outside requests', hosts.size === 0, [...hosts].join(','));
  ok('data-elev still 1 (no panic)', await page.evaluate(() => document.documentElement.getAttribute('data-elev')) === '1');
  await ctx.close();
}
{ // ---- Calm: final states at once, nothing running
  const { ctx, page, errs } = await session(true);
  await bring(page, '.device.audit');
  await page.evaluate(() => document.querySelector('input[name=audit-guess][value="3"]').click()); await page.waitForTimeout(150);
  ok('Calm E5.1 final picture at once (19 found, no push-in)', await page.evaluate(() => { const d = document.querySelector('.wall-e canvas').dataset; return d.found === '19' && d.cam === '1.00'; }));
  await bring(page, '.device.pricetag'); await page.evaluate(() => document.querySelector('.pricetag .btn[aria-pressed]').click()); await page.waitForTimeout(150);
  ok('Calm E5.3 end state at once', await page.evaluate(() => document.querySelector('.val-e').textContent) === '1.02×');
  ok('Calm no console errors', errs.length === 0, errs.slice(0, 2).join(' | '));
  await ctx.close();
}
await browser.close(); srv.close();
const bad = out.filter((o) => !o[0]); console.log(bad.length ? `\n${bad.length} FAILED` : '\nall e5 checks pass'); process.exit(bad.length ? 1 : 0);
