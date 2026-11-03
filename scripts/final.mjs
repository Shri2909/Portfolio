// Final check: build guard, zero console errors, zero network requests, every button tappable under touch emulation, axe-core zero violations.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, openPage, VIEWPORTS, sleep, ROOT } from './lib.mjs';
import { spawnSync } from 'node:child_process';

const result = { guard: null, builds: {} };
const g = spawnSync('python3', [join(ROOT, 'scripts', 'build.py')], { encoding: 'utf8' });
result.guard = g.status === 0 ? 'passed' : 'FAILED: ' + g.stdout + g.stderr;
const axeSrc = readFileSync(join(ROOT, 'node_modules', 'axe-core', 'axe.min.js'), 'utf8');
const b = await launch();
let bad = result.guard !== 'passed';

for (const build of ['index.html', 'review.html']) {
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, touch: true, build });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  await sleep(400);
  await page.evaluate(() => window.CF.opening.skip()); await sleep(1500);
  // walk the page
  const H = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < H; y += 500) { await page.evaluate((v) => window.scrollTo({ top: v, behavior: 'instant' }), y); await sleep(70); }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await sleep(300);
  // tap every button once
  const n = await page.evaluate(() => document.querySelectorAll('button:not([disabled])').length);
  const fails = []; let tapped = 0;
  for (let i = 0; i < n; i++) {
    const h = (await page.$$('button:not([disabled])'))[i];
    if (!h) continue;
    const ok = await h.evaluate((e) => { const r = e.getBoundingClientRect(); return !!e.offsetParent && getComputedStyle(e).visibility !== 'hidden' && !e.closest('[inert]') && !e.closest('.seal-note:not(.unfolded)') && r.width > 0; });
    if (!ok) continue;
    try {
      // the page scrolls smoothly (scroll-behavior: smooth), so a first attempt can land while a scroll is still settling: retry once
      for (let attempt = 0; ; attempt++) {
        try { await h.scrollIntoViewIfNeeded({ timeout: 2500 }); await h.tap({ timeout: 3000 }); break; } catch (err) { if (attempt) throw err; await sleep(900); }
      }
      tapped++;
    } catch (e) {
      const label = await h.evaluate((x) => x.className + ' ' + (x.textContent || '').trim().slice(0, 24));
      fails.push(label + ' :: ' + String(e.message).split('\n')[0].slice(0, 90));
    }
    await page.keyboard.press('Escape'); await sleep(30);
    await page.evaluate(() => { if (window.CF.tour && window.CF.tour.active()) window.CF.tour.stop(); document.querySelectorAll('dialog[open]').forEach((d) => d.close()); });
  }
  await sleep(500);
  await page.evaluate(axeSrc);
  const axe = await page.evaluate(async () => (await window.axe.run(document, { resultTypes: ['violations'] })).violations.map((v) => v.id + ' x' + v.nodes.length));
  const hasLinks = await page.evaluate(() => [...document.querySelectorAll('a[href]')].map((a) => a.getAttribute('href')).filter((h) => /^https?:/.test(h)).length);
  result.builds[build] = { buttons: n, tapped, tapFailures: fails, consoleErrors: log.errors, networkRequests: log.requests, axeViolations: axe, externalLinksToOpenInNewTab: hasLinks };
  if (fails.length || log.errors.length || log.requests.length || axe.length) bad = true;
  await ctx.close();
}
await b.close();
console.log(JSON.stringify(result, null, 2));
process.exit(bad ? 1 : 0);
