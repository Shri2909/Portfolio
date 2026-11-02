// Milestone preview folder: node scripts/preview.mjs <name>   (M1, M2, ... final)
// Makes previews/<name>/ with index.html, review.html, screenshots/, demo.webm and gallery.html.
import { copyFileSync, mkdirSync, writeFileSync, rmSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { launch, openPage, VIEWPORTS, sleep, ROOT, startRecording } from './lib.mjs';
import { spawnSync } from 'node:child_process';

const name = process.argv[2];
if (!name) { console.error('usage: node scripts/preview.mjs <M1|M2|...|final>'); process.exit(2); }
const dir = join(ROOT, 'previews', name);
const shots = join(dir, 'screenshots');
rmSync(dir, { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
copyFileSync(join(ROOT, 'dist', 'index.html'), join(dir, 'index.html'));
copyFileSync(join(ROOT, 'dist', 'review.html'), join(dir, 'review.html'));

const gallery = []; // {file, caption, vp}
const browser = await launch();
const landed = (page) => page.waitForFunction(() => window.CF && window.CF.opening && window.CF.opening.landed, null, { timeout: 25000 });

async function snap(page, file, caption, vp) {
  await page.screenshot({ path: join(shots, file) });
  gallery.push({ file: 'screenshots/' + file, caption, vp });
}

/* ------------------------------------------------------------ screenshots */
const sets = {
  M1: async () => {
    for (const [vn, vp, touch] of [['phone', VIEWPORTS.phone, true], ['laptop', VIEWPORTS.laptop, false], ['wide', VIEWPORTS.wide, false]]) {
      const label = vn === 'phone' ? '390x844' : vn === 'laptop' ? '1366x650' : '1850x692';
      const { page, ctx } = await openPage(browser, { viewport: vp, touch });
      await sleep(250);
      await snap(page, `${vn}-1-first-paint.png`, `First paint at ${label}: the name is under tape, the string is at the left, nothing typed yet.`, label);
      await sleep(3000);
      await snap(page, `${vn}-2-typing.png`, `The dictation being typed (about 90 characters a second), ${label}.`, label);
      await page.evaluate(() => window.CF.opening.skip()); await sleep(900);
      await page.evaluate(() => window.CF.opening.setP(0)); await sleep(500);
      await page.evaluate(() => window.CF.opening.setP(0.35)); await sleep(1100);
      await snap(page, `${vn}-3-mid-trim.png`, `Mid-trim (string at 35%), ${label}: raw words get a blue-pencil strike, Flow's words arrive highlighted. The brass caret is the frontier.`, label);
      await page.evaluate(() => window.CF.opening.setP(0.675)); await sleep(1100);
      await snap(page, `${vn}-4-tape-half-peeled.png`, `Tape half peeled (string at 67%), ${label}: the first strip has gone, the second is still on.`, label);
      await page.evaluate(() => window.CF.opening.setP(1)); await landed(page); await sleep(1700);
      await snap(page, `${vn}-5-seal-landed.png`, `Seal landed, ${label}: name revealed, case seal stamped, tagline, "Open the file" and the first chapter's question.`, label);
      if (vn !== 'wide') {
        await page.evaluate(() => window.CF.opening.setTake(1)); await sleep(500);
        await page.evaluate(() => window.CF.opening.skip()); await landed(page); await sleep(1700);
        await snap(page, `${vn}-6-take2-landed.png`, `Take 2 (recorded 7:30 pm), ${label}: also fits without scrolling.`, label);
        await page.click('.chip'); await sleep(250);
        await snap(page, `${vn}-7-custody-open.png`, `The compact custody chip opened ("Where this came from"), ${label}. No VERIFIED stamp, because content says verified is false.`, label);
        await page.click('.chip'); await sleep(150);
        await page.click('.controls > .btn:last-child'); await sleep(350);
        await snap(page, `${vn}-8-read-plainly.png`, `"Read it plainly": both texts as ordinary type in a dialog, ${label}.`, label);
        await page.keyboard.press('Escape');
      }
      await ctx.close();
    }
    // reduced motion + review build
    {
      const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, reducedMotion: true });
      await sleep(500);
      await snap(page, 'phone-9-reduced-motion.png', 'prefers-reduced-motion: the final state shows at once (no typing, no tape peel, no thud). The string still works.', '390x844');
      await ctx.close();
      const r = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
      await sleep(300); await r.page.evaluate(() => window.CF.opening.skip()); await landed(r.page); await sleep(1700);
      await snap(r.page, 'phone-10-review-build.png', 'The review build at 390x844: same opening plus the diagonal "REVIEW DRAFT" watermark (nothing is outlined yet, because no section that uses draft text is built in this milestone).', '390x844');
      await r.ctx.close();
    }
  },
};

/* ------------------------------------------------------------ demo video */
const videos = {
  M1: async (page) => {
    await page.waitForFunction(() => window.CF && window.CF.opening, null, { timeout: 5000 });
    await landed(page); await sleep(2200); // the full opening, seal lands
    const box = await page.locator('input.string').boundingBox();
    const y = box.y + box.height / 2;
    await page.mouse.move(box.x + box.width - 22, y); await page.mouse.down();
    await page.mouse.move(box.x + box.width * 0.5, y, { steps: 30 });
    await sleep(900);
    await page.mouse.move(box.x + box.width * 0.2, y, { steps: 30 });
    await sleep(900);
    await page.mouse.move(box.x + box.width - 4, y, { steps: 40 }); await page.mouse.up();
    await sleep(1500);
    await page.tap('.seg .btn:nth-child(2)'); // Take 2
    await landed(page); await sleep(2000);
    await page.tap('.chip'); await sleep(1500); await page.tap('.chip'); await sleep(500);
    await page.tap('.controls > .btn:last-child'); await sleep(2000); await page.keyboard.press('Escape'); await sleep(800);
  },
};

await sets[name]?.();
await browser.close();
if (videos[name]) {
  // slowMo 80 (each action waits 80 ms) needs its own browser launch
  const vb = await launch({ slowMo: 80 });
  const ctx = await vb.newContext({ viewport: VIEWPORTS.phone, hasTouch: true, isMobile: true, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto('file://' + join(dir, 'index.html'));
  const rec = await startRecording(page);
  await videos[name](page);
  const info = await rec.stop(join(dir, 'demo.webm'));
  console.log('recorded', JSON.stringify(info));
  await ctx.close(); await vb.close();
}

// mp4 only if a system ffmpeg exists (none on this machine; Playwright's bundled ffmpeg can only write VP8/webm)
let mp4 = false;
const ff = spawnSync('ffmpeg', ['-version']);
if (ff.status === 0 && existsSync(join(dir, 'demo.webm'))) {
  const r = spawnSync('ffmpeg', ['-y', '-i', join(dir, 'demo.webm'), '-movflags', '+faststart', '-pix_fmt', 'yuv420p', join(dir, 'demo.mp4')]);
  if (r.status === 0) { mp4 = true; rmSync(join(dir, 'demo.webm')); }
}

/* ------------------------------------------------------------ gallery.html */
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const video = existsSync(join(dir, mp4 ? 'demo.mp4' : 'demo.webm'))
  ? `<video controls playsinline preload="metadata" width="390" src="${mp4 ? 'demo.mp4' : 'demo.webm'}"></video>` : '<p>No video for this milestone.</p>';
writeFileSync(join(dir, 'gallery.html'), `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Case File No. 001 · ${name} preview</title>
<style>
body{margin:0;background:#15211B;color:#F6F0E3;font:16px/1.5 Georgia,serif;padding:20px}
h1{font-size:22px;margin:0 0 4px} h2{font-size:18px;margin:28px 0 8px;border-bottom:1px solid #B8872B;padding-bottom:4px}
.btns{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}
.btns a{display:inline-block;padding:12px 18px;background:#F6F0E3;color:#231F1A;border:2px solid #B8872B;border-radius:10px;text-decoration:none;font-weight:700}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:18px;align-items:start}
.grid.wide{grid-template-columns:repeat(auto-fill,minmax(520px,1fr))}
figure{margin:0;background:#0F1713;border:1px solid #3a4a40;border-radius:8px;padding:10px}
figure img{width:100%;height:auto;display:block;border-radius:4px;border:1px solid #2a3a30}
figcaption{font-size:14px;color:#d9d2c0;margin-top:8px}
video{max-width:100%;border:1px solid #B8872B;border-radius:8px;background:#000}
small{color:#b9b19d}
</style></head><body>
<h1>Case File No. 001 · ${name}</h1>
<p><small>Built ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC. Open index.html (production) and review.html (review) straight from this folder.</small></p>
<div class="btns"><a href="index.html" target="_blank" rel="noopener">Open index.html (production)</a><a href="review.html" target="_blank" rel="noopener">Open review.html (review draft)</a></div>
<h2>Demo recording (390x844, slowMo 80)</h2>
${video}
<h2>Phone, 390x844</h2>
<div class="grid">${gallery.filter((g) => g.vp === '390x844').map((g) => `<figure><img loading="lazy" src="${g.file}" alt="${esc(g.caption)}"><figcaption>${esc(g.caption)}</figcaption></figure>`).join('')}</div>
<h2>Laptop, 1366x650</h2>
<div class="grid wide">${gallery.filter((g) => g.vp === '1366x650').map((g) => `<figure><img loading="lazy" src="${g.file}" alt="${esc(g.caption)}"><figcaption>${esc(g.caption)}</figcaption></figure>`).join('')}</div>
<h2>Wide, 1850x692</h2>
<div class="grid wide">${gallery.filter((g) => g.vp === '1850x692').map((g) => `<figure><img loading="lazy" src="${g.file}" alt="${esc(g.caption)}"><figcaption>${esc(g.caption)}</figcaption></figure>`).join('')}</div>
</body></html>`);

console.log(JSON.stringify({ dir, screenshots: gallery.length, video: existsSync(join(dir, 'demo.webm')) ? 'demo.webm' : existsSync(join(dir, 'demo.mp4')) ? 'demo.mp4' : null, mp4 }));
