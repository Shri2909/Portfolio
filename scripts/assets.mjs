// Share assets drawn in code: dist/og.png (1200x630), dist/favicon-32.png, dist/apple-touch-icon.png. Run after build.py.
import { launch, ROOT, fileUrl } from './lib.mjs';
import { join } from 'node:path';

const b = await launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(fileUrl('index.html'));
await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
const d = await page.evaluate(() => ({ headline: EK.data.opening.headline, ship: EK.data.site.ogTitle, label: EK.data.opening.label }));
const diya = await page.evaluate(() => { const el = EK.diya('home'); el.setAttribute('xmlns', 'http://www.w3.org/2000/svg'); el.querySelectorAll('.flame,.glow').forEach((n) => n.setAttribute('style', 'opacity:1')); el.setAttribute('style', 'width:260px'); return el.outerHTML; });
await page.evaluate(([d, diya]) => {
  document.documentElement.className = '';
  document.body.innerHTML = '';
  document.body.style.cssText = 'margin:0;width:1200px;height:630px;overflow:hidden;position:relative;background:linear-gradient(180deg,#05060D,#2B1A33 60%,#5A2A2C);color:#FFF3DC;font-family:Georgia,serif';
  const headline = d.headline.replace('324', '<span style="color:#FFD27A">324</span>').replace('19', '<span style="color:#FFD27A">19</span>');
  document.body.innerHTML = '<div style="position:absolute;left:80px;top:70px;font:700 20px ui-monospace,monospace;letter-spacing:.12em;color:#F5A623">' + d.label + '</div>' +
    '<div style="position:absolute;left:80px;top:130px;width:780px;font-weight:700;font-size:84px;line-height:1.06">' + headline + '</div>' +
    '<div style="position:absolute;left:80px;top:470px;font-style:italic;font-size:44px">Ship karte?</div>' +
    '<div style="position:absolute;right:70px;top:300px">' + diya + '</div>';
}, [d, diya]);
await page.waitForTimeout(300);
await page.screenshot({ path: join(ROOT, 'dist', 'og.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png']]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><rect width="64" height="64" rx="14" fill="#0A0B14"/><path d="M12 40 C12 54 22 58 32 58 C42 58 52 54 52 40 Z" fill="#C2410C"/><path d="M32 10 C38 20 40 28 32 36 C24 28 26 20 32 10 Z" fill="#FFB347"/><path d="M32 20 C35 25 36 29 32 33 C28 29 29 25 32 20 Z" fill="#FFD27A"/></svg></body>`);
  await page.screenshot({ path: join(ROOT, 'dist', name), omitBackground: true });
}
await b.close();
console.log('share assets written: og.png, favicon-32.png, apple-touch-icon.png');
