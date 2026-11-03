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

sets.M2 = async () => {
  const rd = (page) => page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  const goto = (page, sel, extra = 0) => page.evaluate(([s, e]) => { const t = document.querySelector(s); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 60 - e, behavior: 'instant' }); }, [sel, extra]);
  // phone, review build (has the drafted text, so Fair warning and the summary exist)
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await rd(page); await sleep(400); await page.evaluate(() => window.CF.opening.skip()); await sleep(1700);
    await snap(page, 'phone-1-opening-with-clues-button.png', 'The opening with the new top bar: Clues 0/N and the friendly rank "Curious visitor" (review build).', '390x844');
    await goto(page, '#brief', -200); await sleep(300);
    await snap(page, 'phone-2-envelope-closed.png', 'The briefing arrives as a cream envelope with a wax seal. Caption: "Open the briefing".', '390x844');
    await sleep(1400);
    await snap(page, 'phone-3-envelope-open.png', 'It opened by itself at 40% in view: greeting, the (draft) summary outlined amber, and the leads as brass luggage tags. "Not shown yet" is dashed.', '390x844');
    await goto(page, '#brief .leads', 80); await page.tap('#brief .leads li:nth-child(1) .lead'); await sleep(800);
    await snap(page, 'phone-4-lead-tapped.png', 'A lead tapped: its Evidence and "Why it matters" lines. (The red string needs exhibits to land on; they arrive in M3, and the geometry is already tested with stand-ins.)', '390x844');
    await page.tap('#brief .leads li:nth-child(1) .lead'); await sleep(200);
    await goto(page, '#brief ~ .seal-note', 300); await sleep(900);
    await snap(page, 'phone-5-chapter-seal.png', 'A Chapter Seal: a folded note with one question about what comes next. Tap it to go to the next chapter.', '390x844');
    await goto(page, '#against', -20); await sleep(300);
    await page.tap('#against .icard:nth-child(1) .ic-btn'); await sleep(800);
    await snap(page, 'phone-6-fair-warning.png', 'Fair warning: three index cards with brass paper clips, one unfolded in place (draft text, outlined amber).', '390x844');
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' })); await sleep(200);
    await page.tap('.dossier .clue-tag'); await sleep(500);
    await snap(page, 'phone-7-clue-slip.png', 'A clue magnifier tapped: "Clue n of N", the text, "Verified in: <source>".', '390x844');
    await page.keyboard.press('Escape'); await sleep(300);
    await page.tap('.tb-btn.clues'); await sleep(700);
    await snap(page, 'phone-8-notebook.png', 'The clue notebook (full-screen on phone): pencil-dot progress, found clue with its source, rank "Junior sleuth".', '390x844');
    await ctx.close();
  }
  // laptop 1600x900 would hide the sizes; use the standard 1366x650 and a taller desktop for the props
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.laptop, build: 'review.html' });
    await rd(page); await sleep(300); await page.evaluate(() => window.CF.opening.skip()); await sleep(1700);
    await page.mouse.move(700, 120); await sleep(800);
    await snap(page, 'laptop-1-opening-lamp.png', 'Laptop: the lamp follows the pointer and only lights the desk, never the paper. Pencil notes appear under it.', '1366x650');
    await goto(page, '#brief .cork', 160); await sleep(1700);
    await snap(page, 'laptop-2-case-board.png', 'The case board (from 768px): leads as notes, a pin per chapter. Pins fill brass once scrolled to. Strings land on exhibit pins in M3.', '1366x650');
    await goto(page, '#against', -20); await sleep(300);
    await page.click('#against .icard:nth-child(2) .ic-btn'); await sleep(800);
    await snap(page, 'laptop-3-fair-warning.png', 'Fair warning on a laptop.', '1366x650');
    await ctx.close();
  }
  {
    const { page, ctx } = await openPage(browser, { viewport: { width: 1600, height: 900 } });
    await rd(page); await sleep(300); await page.evaluate(() => window.CF.opening.skip()); await sleep(1700);
    await page.locator('button.teacup').click(); await sleep(600);
    await snap(page, 'wide-1-props-and-tea.png', 'Wide desk (1600px): brass banker\'s lamp, teacup (tap it for a slip), magnifying glass, pencils, notebook, with the steam and dust motes. Production build.', '1850x692');
    await ctx.close();
  }
};
sets.M2.vp = true;

const rdy = (page) => page.waitForFunction(() => document.documentElement.classList.contains('ready'));
const scr = (page, sel, off = 70) => page.evaluate(([s, o]) => { const t = document.querySelector(s); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - o, behavior: 'instant' }); }, [sel, off]);
sets.M3 = async () => {
  for (const [vn, vp, touch, label] of [['phone', VIEWPORTS.phone, true, '390x844'], ['laptop', VIEWPORTS.laptop, false, '1366x650']]) {
    const { page, ctx } = await openPage(browser, { viewport: vp, touch });
    await rdy(page); await sleep(400);
    const tap = (s) => (touch ? page.tap(s) : page.click(s));
    await scr(page, '#exhibitA'); await sleep(400);
    await snap(page, `${vn}-1-exhibit-a-call.png`, `Exhibit A (certgen): custody strip, honest authorship, then "Make your call, detective" with large tap targets, ${label}.`, label);
    await tap('#exhibitA .opt:nth-child(4)'); await sleep(1300);
    await snap(page, `${vn}-2-exhibit-a-reveal.png`, `The right answer highlighted and the reveal text; the card opens, ${label}.`, label);
    await scr(page, '#exhibitA .tiles', vn === 'phone' ? 120 : 90); await sleep(700);
    await snap(page, `${vn}-3-tiles-scan.png`, `324 sage tiles pop in as a wave while a brass scan line sweeps across, ${label}.`, label);
    await sleep(3000);
    await snap(page, `${vn}-4-tiles-findings.png`, `Then 19 brass tiles fall in below the grid: "19 findings the 324 tests never asked about" and the 19 FINDINGS seal, ${label}.`, label);
    await tap('#exhibitA .tile.find:nth-child(7)'); await sleep(200);
    await scr(page, '#exhibitA .tl', 100); await sleep(1800);
    await snap(page, `${vn}-5-timeline.png`, `The red-string timeline draws itself (sequence only, no dates), ${label}. Tapping a tile reads "Finding 7 of 19".`, label);
    await scr(page, '#exhibitB', 70); await sleep(500);
    await snap(page, `${vn}-6-exhibit-b-top.png`, `Exhibit B (TipIndex) in production while the 0.585 direction is unconfirmed: no call, no 1,000-symbol claim, ${label}.`, label);
    await scr(page, '#exhibitB .chart', 100); await sleep(2600);
    await tap('#exhibitB .bdot'); await sleep(300);
    await snap(page, `${vn}-7-boundary-chart.png`, `The boundary chart (log-log): one measured point (40.6x) and the break-even line. Tap the dot for its label, ${label}.`, label);
    await scr(page, '#exhibitB .cstrip', vn === 'phone' ? 160 : 120); await sleep(3200);
    await snap(page, `${vn}-8-contamination-chips.png`, `Contamination strip (9 of 10 dots turn brass, one by one) and the chips; MODELED is dashed, ${label}.`, label);
    await scr(page, '#ledger'); await sleep(300);
    await snap(page, `${vn}-9-ledger.png`, `Plot twists, and what I did next: rubber-stamp status, the single OPEN stamp loudest, filter chips with computed counts, ${label}.`, label);
    await tap('#ledger .fchip[data-f="closed"]'); await sleep(500); await scr(page, '#ledger .cases', 120); await sleep(300); await page.evaluate(() => document.querySelector('#ledger .case:not([hidden]) .case-head').click()); await sleep(900);
    await snap(page, `${vn}-10-ledger-filtered.png`, `Filtered to CLOSED, first row expanded, ${label}.`, label);
    await scr(page, '#decisions'); await sleep(400);
    await snap(page, `${vn}-11-forks.png`, `Forks in the road: chosen branch in red string, others grey and "not taken", evidence under the chosen one, ${label}.`, label);
    await ctx.close();
  }
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await rdy(page); await sleep(300);
    await scr(page, '#exhibitB'); await page.tap('#exhibitB .opt:nth-child(3)'); await sleep(1400);
    await scr(page, '#exhibitB .chart', 100); await sleep(3400);
    await snap(page, 'phone-12-review-two-points.png', 'Review build only: both measured points, the dashed gap labelled "crossover not measured here", and the call. This needs the README direction of 0.585 confirmed before it can go live.', '390x844');
    await ctx.close();
  }
};
sets.M3.vp = true;

sets.M4 = async () => {
  for (const [vn, vp, touch, label] of [['phone', VIEWPORTS.phone, true, '390x844'], ['laptop', VIEWPORTS.laptop, false, '1366x650']]) {
    const { page, ctx } = await openPage(browser, { viewport: vp, touch });
    await rdy(page); await sleep(400);
    const tap = (s) => (touch ? page.tap(s) : page.click(s));
    await page.evaluate(() => window.CF.opening.skip()); await sleep(1700);
    await snap(page, `${vn}-1-opening.png`, `Production build, opening (${label}); the top bar now carries Clues and the chapter menu.`, label);
    await scr(page, '#brief', -100); await sleep(1500);
    await snap(page, `${vn}-2-briefing.png`, `The briefing in production: greeting and leads (the summary stays empty until recorded), ${label}.`, label);
    await scr(page, '#wispr'); await tap('#wispr .wtags li:nth-child(1) .wtag'); await sleep(1800);
    await snap(page, `${vn}-3-wispr-india.png`, `Field notes on Wispr: five numbered evidence tags; tag 1 opens the observation with the India bars (14% of installs, 2% of in-app-purchase revenue), ${label}. Empty steps are hidden, so there is no stepper yet.`, label);
    await scr(page, '#closing'); await sleep(900);
    await snap(page, `${vn}-4-closing.png`, `Closing notes in production: only what exists (the dated case log), ${label}.`, label);
    await scr(page, '#exhibitZ'); await sleep(500);
    await snap(page, `${vn}-5-exhibit-z.png`, `Exhibit Z: only the opening takes are tagged "Spoken with Flow"; everything else says "Written from sources", ${label}.`, label);
    await ctx.close();
  }
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await rdy(page); await sleep(400);
    await scr(page, '#effects .tlwrap', 150); await sleep(2200);
    await snap(page, 'phone-6-review-roots.png', 'Review build: Roots (Beyond the code) with the drafted intro and a red-string timeline.', '390x844');
    await scr(page, '#lab'); await sleep(500);
    await snap(page, 'phone-7-review-lab.png', 'Review build: the Voice Lab pre-registration (banner, PRE-REGISTERED stamp, prediction, Results pending). The results chart is tested with test-only data.', '390x844');
    await scr(page, '#wispr'); await page.tap('#wispr .wtags li:nth-child(1) .wtag'); await sleep(900); await page.tap('#wispr .wstepbtn:nth-child(2)'); await sleep(500);
    await snap(page, 'phone-8-review-wispr-stepper.png', 'Review build: the three-step stepper (Observation, What it suggests, First test) from the drafted text.', '390x844');
    await scr(page, '#closing .oqs', 100); await sleep(700);
    await snap(page, 'phone-9-review-closing.png', 'Review build: findings with red-string buttons, the closing line, dated open-question slips.', '390x844');
    await page.tap('#closing .find:nth-child(1) .follow'); await sleep(1200);
    await scr(page, '#closing .finds', 120); await sleep(300);
    await snap(page, 'phone-10-review-closing-string.png', 'Review build: tapping a finding runs red string to its exhibits.', '390x844');
    await ctx.close();
  }
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await page.goto('file://' + join(ROOT, 'dist', '404.html')); await sleep(500);
    await snap(page, 'phone-11-404.png', 'The styled 404 page: "FILE NOT FOUND" with a friendly way back.', '390x844');
    await ctx.close();
  }
  copyFileSync(join(ROOT, 'dist', 'og.png'), join(shots, 'share-image-og.png'));
  gallery.push({ file: 'screenshots/share-image-og.png', caption: 'The 1200x630 share image, drawn in code (green desk, paper sheet, subject, the case seal).', vp: '1366x650' });
};
sets.M4.vp = true;

/* ------------------------------------------------------------ demo video */
const scrollThrough = (page, pxPerSec = 520) => page.evaluate(async (v) => {
  const t0 = performance.now();
  await new Promise((res) => {
    let last = performance.now();
    const tick = () => {
      const now = performance.now(), dt = (now - last) / 1000; last = now;
      window.scrollBy({ top: v * dt, behavior: 'instant' });
      const max = document.documentElement.scrollHeight - innerHeight;
      if (window.scrollY >= max - 2 || now - t0 > 60000) res(); else setTimeout(tick, 16);
    };
    tick();
  });
}, pxPerSec);
const videos = {
  M4: async (page) => {
    await page.waitForFunction(() => window.CF && window.CF.opening);
    await page.evaluate(() => window.CF.opening.skip()); await sleep(1600);
    await scrollThrough(page, 560);
    await sleep(800);
  },
  M3: async (page) => {
    await page.waitForFunction(() => window.CF && window.CF.opening);
    await page.evaluate(() => window.CF.opening.skip()); await sleep(800);
    const go = (sel, off = 70) => page.evaluate(([s, o]) => { const t = document.querySelector(s); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - o, behavior: 'smooth' }); }, [sel, off]);
    await go('#exhibitA'); await sleep(2800);
    await page.tap('#exhibitA .opt:nth-child(2)'); await sleep(1600);
    await go('#exhibitA .tiles', 120); await sleep(6500);
    await page.tap('#exhibitA .tile.test:nth-child(150)'); await sleep(900);
    await go('#exhibitB .chart', 100); await sleep(4200);
    await page.tap('#exhibitB .bdot'); await sleep(1500);
    await go('#ledger'); await sleep(2800);
    await page.tap('#ledger .fchip[data-f="narrowed"]'); await sleep(1200);
    await page.tap('#ledger .fchip[data-f="open"]'); await sleep(1200);
    await page.tap('#ledger .case:not([hidden]) .case-head'); await sleep(1500);
    await go('#decisions'); await sleep(3000);
  },
  M2: async (page) => {
    await page.waitForFunction(() => window.CF && window.CF.opening);
    await page.evaluate(() => window.CF.opening.skip()); await sleep(1500);
    await page.evaluate(() => { const t = document.querySelector('#brief'); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 120, behavior: 'smooth' }); });
    await sleep(2800);
    await page.evaluate(() => { const t = document.querySelector('#brief .leads'); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 200, behavior: 'smooth' }); }); await sleep(1500);
    await page.tap('#brief .leads li:nth-child(1) .lead'); await sleep(1800);
    await page.tap('#brief .leads li:nth-child(5) .lead'); await sleep(1800);
    await page.evaluate(() => { const t = document.querySelector('#against'); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - 70, behavior: 'smooth' }); }); await sleep(2200);
    await page.tap('#against .icard:nth-child(1) .ic-btn'); await sleep(1500);
    await page.tap('#against .icard:nth-child(2) .ic-btn'); await sleep(1500);
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' })); await sleep(2000);
    await page.tap('.dossier .clue-tag'); await sleep(1800); await page.keyboard.press('Escape'); await sleep(600);
    await page.tap('.tb-btn.clues'); await sleep(2200); await page.keyboard.press('Escape'); await sleep(800);
  },
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
  await page.goto('file://' + join(dir, ['M1', 'M3', 'M4', 'M5', 'final'].includes(name) ? 'index.html' : 'review.html'));
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
