// Quick look: node scripts/shot.mjs <outdir> [build] -> screenshots of the opening at several moments
import { launch, openPage, VIEWPORTS, sleep } from './lib.mjs';
const out = process.argv[2]; const build = process.argv[3] || 'index.html';
const b = await launch();
for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop], ['wide', VIEWPORTS.wide]]) {
  const { page, log } = await openPage(b, { viewport: vp, touch: vn === 'phone', build });
  await sleep(150);
  await page.screenshot({ path: `${out}/${vn}-0-first.png` });
  await sleep(3500);
  await page.screenshot({ path: `${out}/${vn}-1-typing.png` });
  await page.waitForFunction(() => window.CF.opening.landed, null, { timeout: 20000 }).catch(() => {});
  await sleep(800);
  await page.screenshot({ path: `${out}/${vn}-2-landed.png` });
  const m = await page.evaluate(() => { const d = document.querySelector('.dossier').getBoundingClientRect(); return { dossierBottom: Math.round(d.bottom), docH: document.documentElement.scrollHeight, vh: innerHeight, cueBottom: Math.round(document.querySelector('.cuewrap').getBoundingClientRect().bottom) }; });
  console.log(vn, JSON.stringify(m), log.errors.join('|'), log.requests.join('|'));
  await page.context().close();
}
await b.close();
