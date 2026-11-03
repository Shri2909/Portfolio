// Share assets drawn in code: dist/og.png (1200x630), dist/favicon-32.png, dist/apple-touch-icon.png. Run after build.py.
import { launch, ROOT, fileUrl } from './lib.mjs';
import { join } from 'node:path';

const b = await launch();
const ctx = await b.newContext({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
await page.goto(fileUrl('index.html'));
await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
const d = await page.evaluate(() => ({ title: CF.data.hero.title, headline: CF.data.hero.headline, q: CF.data.hero.question, by: CF.data.hero.byline }));
await page.evaluate((d) => {
  document.documentElement.className = '';
  document.body.innerHTML = '';
  document.body.style.cssText = 'margin:0;width:1200px;height:630px;overflow:hidden;position:relative;background:radial-gradient(120% 95% at 50% 40%,#15211B 52%,#0F1713 100%)';
  const glow = document.createElement('div');
  glow.style.cssText = 'position:absolute;left:150px;top:-250px;width:900px;height:900px;background:radial-gradient(closest-side,rgba(255,214,150,.30),transparent)';
  const sheet = document.createElement('div');
  sheet.style.cssText = 'position:absolute;left:100px;top:70px;width:1000px;height:490px;background:#F6F0E3;transform:rotate(-.8deg);box-shadow:0 30px 60px -12px rgba(0,0,0,.6),inset 0 0 50px rgba(120,90,40,.1);color:#231F1A;font-family:Fraunces,Georgia,serif';
  const headline = d.headline.replace('324', '<span style="color:#2E6B3A">324</span>').replace('19', '<span style="color:#B23A26;border-bottom:7px solid #D2452E">19</span>');
  sheet.innerHTML = '<i style="position:absolute;left:0;top:0;width:60px;height:60px;background:linear-gradient(135deg,#E2BE6A,#B8872B 45%,#7a5714);clip-path:polygon(0 0,100% 0,0 100%)"></i>' +
    '<div style="position:absolute;left:84px;top:54px;font-family:Courier Prime,monospace;font-weight:700;font-size:20px;letter-spacing:.1em;color:#8A5E12">' + d.title + '</div>' +
    '<div style="position:absolute;left:84px;top:112px;width:840px;font-weight:800;font-size:84px;line-height:1.04">' + headline + '</div>' +
    '<div style="position:absolute;left:84px;top:400px;font-style:italic;font-weight:650;font-size:44px">' + d.q + '</div>';
  document.body.append(glow, sheet);
}, d);
await page.waitForTimeout(400);
await page.screenshot({ path: join(ROOT, 'dist', 'og.png'), clip: { x: 0, y: 0, width: 1200, height: 630 } });
for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png']]) {
  await page.setViewportSize({ width: size, height: size });
  await page.setContent(`<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" width="${size}" height="${size}"><rect width="64" height="64" rx="14" fill="#15211B"/><circle cx="28" cy="28" r="14" fill="none" stroke="#B8872B" stroke-width="6"/><path d="M39 39 L52 52" stroke="#B8872B" stroke-width="7" stroke-linecap="round"/><circle cx="28" cy="28" r="6" fill="#D2452E"/></svg></body>`);
  await page.screenshot({ path: join(ROOT, 'dist', name), omitBackground: true });
}
await b.close();
console.log('share assets written: og.png, favicon-32.png, apple-touch-icon.png');
