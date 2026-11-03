// The checks themselves. Extended pack by pack.
export default async function ({ browser, base, out, ok }) {
  for (const [w, h] of [[360, 640], [390, 844], [1366, 768]]) {
    const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    const errors = [], reqs = new Set();
    page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(m.text()); });
    page.on('pageerror', (e) => errors.push(String(e)));
    page.on('request', (r) => reqs.add(new URL(r.url()).origin));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    ok(`[${w}] no console errors`, errors.length === 0, errors.join(' | ').slice(0, 200));
    ok(`[${w}] only same-origin requests`, [...reqs].every((o) => o === new URL(base).origin), [...reqs].join(','));
    const sw = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    ok(`[${w}] no sideways scroll`, sw <= 0, 'overflow ' + sw);
    await page.screenshot({ path: `${out}/p1-${w}.png` });
    await ctx.close();
  }
  const ctx = await browser.newContext({ viewport: { width: 360, height: 640 } });
  const page = await ctx.newPage();
  await page.goto(base, { waitUntil: 'networkidle' });
  await page.keyboard.press('Tab');
  ok('first Tab stop is the skip link', await page.evaluate(() => document.activeElement.className.includes('skip-link')));
  ok('exactly one h1', (await page.locator('h1').count()) === 1);
  const ids = await page.evaluate(() => ['night', 'lamp-1', 'baithak', 'lamp-2', 'lamp-3', 'lamp-4', 'lamp-5', 'voice', 'lamp-6', 'verdict', 'wish', 'closure'].filter((i) => document.getElementById(i)));
  ok('all twelve section ids exist', ids.length === 12);
  await page.goto(base + '#sixty'); await page.waitForTimeout(200);
  ok('#sixty opens the dialog', await page.evaluate(() => document.getElementById('sixty').open));
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  ok('Escape closes it', !(await page.evaluate(() => document.getElementById('sixty').open)));
  await page.goto(base + '#v1.7.Asha'); await page.reload(); await page.waitForTimeout(200);
  ok('share fragment is left untouched on load', (await page.evaluate(() => location.hash)) === '#v1.7.Asha');
  await page.goto(base + '#hello'); await page.waitForTimeout(100);
  ok('#hello is ignored silently', !(await page.evaluate(() => document.querySelector('dialog[open]'))));
  await page.goto(base + '#text'); await page.waitForTimeout(300);
  ok('#text shows the full-text view', await page.evaluate(() => !!document.getElementById('fulltext') && getComputedStyle(document.getElementById('fulltext')).display !== 'none'));
  const t = await page.evaluate(() => document.getElementById('fulltext').innerText);
  ok('full text has the headline and the 324 of 324 line', t.includes('324 tests passed. Then an audit found 19 problems.') && t.includes('324 of 324 tests passed.'));
  ok('"Spoken with Wispr Flow" appears twice in the full text', (t.match(/Spoken with Wispr Flow/g) || []).length === 2);
  await page.screenshot({ path: `${out}/p1-text.png` });
  await ctx.close();
}
