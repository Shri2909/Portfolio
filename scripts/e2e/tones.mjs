import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const out = process.argv[2];
const b = await chromium.launch();
for (const [w, h] of [[360, 640], [1366, 768]]) {
  const p = await (await b.newContext({ viewport: { width: w, height: h } })).newPage();
  const errs = []; p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); p.on('pageerror', (e) => errs.push(String(e)));
  await p.goto('http://127.0.0.1:5199/', { waitUntil: 'networkidle' });
  await p.waitForTimeout(500);
  await p.screenshot({ path: `${out}/p2-${w}-t0.png` });
  await p.evaluate(() => { const { actions } = window.__ek; for (const n of [1, 2]) { actions.startLighting(n); actions.finishLighting(n, 100 * n, 400); } });
  await p.waitForTimeout(2500);
  await p.screenshot({ path: `${out}/p2-${w}-t2.png` });
  await p.evaluate(() => { const { actions } = window.__ek; for (const n of [3, 4, 5]) { actions.startLighting(n); actions.finishLighting(n, 100 * n, 400); } });
  await p.waitForTimeout(4500);
  await p.screenshot({ path: `${out}/p2-${w}-t5.png` });
  await p.evaluate(() => window.__ek.actions.lightVisitor(300, 400));
  await p.waitForTimeout(3000);
  await p.screenshot({ path: `${out}/p2-${w}-t6.png` });
  console.log(w, 'errors:', errs.join(' | ') || 'none', 'tone', await p.evaluate(() => document.documentElement.dataset.tone), 'lit windows', await p.evaluate(() => [...document.querySelectorAll('.win')].filter((e) => getComputedStyle(e).opacity === '1').length));
  await p.close();
}
await b.close();
