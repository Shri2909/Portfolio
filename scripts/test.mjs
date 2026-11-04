// Case File 001 tests (Playwright, Chromium). Usage: node scripts/test.mjs
// Optional: COPY_FILE=/path/to/Case_File_001_Focused_Website_Copy.md checks that every line of the final copy is on the page.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { launch, openPage, VIEWPORTS, sleep, check, summary, ROOT } from './lib.mjs';

const SECTIONS = ['case', 'person', 'lamps', 'exhibitA', 'exhibitB', 'exhibitC', 'transition', 'voice', 'growth', 'verdict', 'evidence'];
const STATUS = ['PUBLIC', 'LOCAL-BRANCH', 'REPO-REPORTED', 'PERSONALLY CONFIRMED', 'UNRESOLVED', 'PROPOSED', 'EVIDENCE AVAILABLE ON REQUEST'];
const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();

console.log('build');
const g = spawnSync('python3', [join(ROOT, 'scripts', 'build.py')], { encoding: 'utf8' });
check('build guard passes', g.status === 0, g.stdout + g.stderr);
const prod = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8').replace(/data:font\/woff2;base64,[A-Za-z0-9+/=]+/g, 'data:font');
for (const bad of ['lorem', 'TODO', '[__]', 'SAMPLE', 'DRAFT', 'draft', 'REVIEW']) check('production has no "' + bad + '"', !new RegExp(bad.replace(/[[\]]/g, '\\$&'), bad === 'draft' ? 'i' : '').test(prod));
check('production has no external URLs loaded (only links)', !/(src|href)=["']https?:\/\/(?!github\.com\/Shri2909|drive\.google\.com)/.test(prod) && !/@import|url\(https?:/.test(prod));

const content = JSON.parse(readFileSync(join(ROOT, 'content', 'content.json'), 'utf8'));
const b = await launch();

for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop]]) {
  console.log('\n' + vn);
  const { page, ctx, log } = await openPage(b, { viewport: vp, touch: vn === 'phone' });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  await sleep(500);
  const m = await page.evaluate(() => ({
    ids: [...document.querySelectorAll('main > section')].map((s) => s.id), h1: document.querySelectorAll('h1').length,
    ox: document.documentElement.scrollWidth - innerWidth, landmarks: ['header', 'main', 'footer', 'nav'].map((t) => !!document.querySelector(t + ',[role=' + (t === 'header' ? 'banner' : t === 'footer' ? 'contentinfo' : t === 'nav' ? 'navigation' : 'main') + ']')),
    lang: document.documentElement.lang, fonts: ['Fraunces', 'Source Serif 4', 'Courier Prime'].map((f) => document.fonts.check('16px "' + f + '"')),
    skip: document.querySelector('.skip-link') && document.querySelector('.skip-link').getAttribute('href'),
  }));
  check('sections in order', JSON.stringify(m.ids) === JSON.stringify(SECTIONS), m.ids.join(','));
  check('one h1', m.h1 === 1);
  check('no horizontal overflow', m.ox <= 0, String(m.ox));
  check('landmarks present', m.landmarks.every(Boolean), m.landmarks.join());
  check('embedded fonts loaded', m.fonts.every(Boolean));
  check('skip link targets #main', m.skip === '#main');
  check('zero console errors', log.errors.length === 0, log.errors.join('|'));
  check('zero network requests', log.requests.length === 0, log.requests.join('|'));

  // first screen: headline and the first CTA are visible without scrolling
  const first = await page.evaluate(() => { const r = (s) => document.querySelector(s).getBoundingClientRect(); return { headBottom: r('.headline').bottom, cta: r('.hero .cta-row .btn').bottom, vh: innerHeight }; });
  check('headline and first button above the fold', first.cta <= first.vh, JSON.stringify(first));

  // tap targets
  const small = await page.evaluate(() => [...document.querySelectorAll('a[href], button, summary, input')].filter((e) => e.offsetParent !== null && !e.closest('.skip-link') && !e.closest('dialog:not([open])')).map((e) => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.id || e.type).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((x) => x.h < 44 || x.w < 44));
  check('every visible control is at least 44px', small.length === 0, JSON.stringify(small));

  // sticky top bar stays at the top while scrolling (after smooth scroll settles)
  await page.evaluate(() => document.getElementById('verdict').scrollIntoView({ behavior: 'instant', block: 'start' }));
  await sleep(300);
  const tb = await page.evaluate(() => Math.round(document.getElementById('topbar').getBoundingClientRect().top));
  check('top bar sticks to the top', tb === 0, String(tb));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

  // Three levels: Level 1 visible, Level 2 and 3 closed until opened
  const lv = await page.evaluate(() => ['exhibitA', 'exhibitB', 'exhibitC'].map((id) => ({ l1: !!document.querySelector('#' + id + ' .level.l1 .l1-sum') && !!document.querySelector('#' + id + ' .l1-capt'), l2: document.getElementById(id + '-l2') && !document.getElementById(id + '-l2').open, l3: document.getElementById(id + '-l3') && !document.getElementById(id + '-l3').open, repo: !!document.querySelector('#' + id + '-l3 a.repo-link') })));
  check('each lamp has Level 1 visible, Levels 2 and 3 closed, and a repository link', lv.every((x) => x.l1 && x.l2 && x.l3 && x.repo), JSON.stringify(lv));
  await page.evaluate(() => CF.openStory('exhibitC')); check('Longer story opens Level 2', await page.evaluate(() => document.getElementById('exhibitC-l2').open));
  await page.evaluate(() => document.querySelectorAll('details.l2').forEach((d) => (d.open = true)));
  // Exhibit A: guess
  await page.evaluate(() => document.querySelector('.guess').scrollIntoView({ behavior: 'instant', block: 'center' }));
  check('324 tiles, 4 options', (await page.locator('.wall i').count()) === 324 && (await page.locator('.guess .opt').count()) === 4);
  check('findings hidden before a guess', (await page.evaluate(() => getComputedStyle(document.querySelector('.finds')).visibility)) === 'hidden');
  for (const n of [0, 19]) {
    await page.locator('.guess .opt', { hasText: new RegExp('^' + n + '$') }).click();
    const t = await page.textContent('.reveal');
    check('guess ' + n + ' reveals 19 findings, two high', t.startsWith('You said ' + n + '.') && /19 problems, two of them high/.test(t));
  }
  check('19 findings shown, 2 high', (await page.locator('.finds i').count()) === 19 && (await page.locator('.finds i.hi').count()) === 2 && (await page.evaluate(() => getComputedStyle(document.querySelector('.finds')).visibility)) === 'visible');
  check('plain-text fallback always visible', /324 of 324 tests passed/.test(await page.textContent('.guess .plainly')));

  // Exhibit B: late reply
  const v = async () => (await page.textContent('#late-verdict')).replace(/\s+/g, ' ').trim();
  await page.evaluate(() => document.querySelector('.late').scrollIntoView({ behavior: 'instant', block: 'center' }));
  check('starts on time (2.0 s)', /^COUNTED Counted as proof the connection is alive/.test(await v()));
  await page.fill('#late-t', '3'); check('exactly at the deadline is on time', /alive/.test(await v()));
  await page.fill('#late-t', '4.5'); check('original logic counts a late reply', /^COUNTED .*even though it arrived late/.test(await v()));
  await page.locator('.late .seg .btn', { hasText: 'Corrected' }).click();
  check('corrected logic does not count it', /^NOT COUNTED .*current health/.test(await v()));
  check('labelled as a model', /MODEL OF DOCUMENTED BEHAVIOR/.test(await page.textContent('.model-badge')));
  await page.focus('#late-t'); const before = await page.inputValue('#late-t'); await page.keyboard.press('ArrowLeft');
  check('range input works with the keyboard', (await page.inputValue('#late-t')) !== before);

  // Voice: compare
  const cmp = await page.evaluate(() => {
    const out = [];
    for (const t of CF.data.voice.takes) {
      const st = CF.engine.buildStream(t.raw, t.output);
      out.push({ id: t.id, start: CF.engine.textAt(st, 0) === t.raw.split(/\s+/).filter(Boolean).join(' '), end: CF.engine.textAt(st, st.length) === t.output.split(/\s+/).filter(Boolean).join(' ') });
    }
    return out;
  });
  check('engine: k=0 is my words, k=N is exactly Flow’s words (both takes)', cmp.length === 2 && cmp.every((c) => c.start && c.end), JSON.stringify(cmp));
  await page.evaluate(() => document.querySelector('.compare').scrollIntoView({ behavior: 'instant', block: 'start' }));
  const N = +(await page.getAttribute('#cmp-r', 'max'));
  const h0 = await page.evaluate(() => document.querySelector('.cmp-text').offsetHeight);
  await page.fill('#cmp-r', String(Math.round(N / 2))); const hm = await page.evaluate(() => document.querySelector('.cmp-text').offsetHeight);
  await page.fill('#cmp-r', String(N)); const he = await page.evaluate(() => document.querySelector('.cmp-text').offsetHeight);
  check('text block keeps its height while dragging', h0 === hm && hm === he, [h0, hm, he].join('/'));
  const endTxt = await page.evaluate(() => [...document.querySelectorAll('.cmp-text .w')].filter((w) => !w.classList.contains('cut')).map((w) => w.textContent).join(' '));
  check('at the end, uncut words read as Flow’s text', endTxt.replace(/\s+/g, ' ') === content.voice.takes[0].output.replace(/\s+/g, ' '));
  await page.locator('.compare .seg .btn', { hasText: 'Take 2' }).click();
  check('Take 2 resets to my words and updates the custody row', (await page.inputValue('#cmp-r')) === '0' && /Take 2/.test(await page.evaluate(() => { document.querySelector('.chipd').open = true; return document.querySelector('.custody .rec').textContent; })));
  check('read it plainly shows both texts', (await page.evaluate(() => { document.querySelector('.readplain').open = true; return document.querySelector('.plain-box').textContent; })).includes('Shouldn\'t the technology adapt'));
  check('Take 3 is not shown', !(await page.textContent('body')).includes('7:33'));

  // Evidence drawer
  const ev = await page.evaluate(() => [...document.querySelectorAll('details.case')].map((d) => ({ id: d.id, links: [...d.querySelectorAll('a')].map((a) => a.href), st: [...d.querySelectorAll('.st')].map((s) => s.textContent) })));
  check('six evidence cases', ev.length === 6, String(ev.length));
  check('every status uses the plain vocabulary', ev.every((c) => c.st.every((s) => STATUS.includes(s))), JSON.stringify(ev.map((c) => c.st)));
  check('links are the three repositories, the essay and the résumé only', ev.flatMap((c) => c.links).every((u) => /^https:\/\/(github\.com\/Shri2909\/|drive\.google\.com\/file\/d\/)/.test(u)));
  await page.evaluate(() => CF.openEvidence('c3')); await sleep(1200);
  check('receipt opens its case', await page.evaluate(() => document.getElementById('ev-c3').open && document.activeElement.closest('details') === document.getElementById('ev-c3')));
  const em = content.site.contact.email;
  check('interview button appears only with a real contact', em ? (await page.locator('#verdict a[href="mailto:' + em + '"]').count()) === 1 && /INVITE ME TO AN INTERVIEW/.test(await page.textContent('#verdict')) : (await page.locator('a[href^="mailto:"]').count()) === 0);

  // 60-second file
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('.nav-link.sixty').click(); await sleep(200);
  check('60-second file opens as a dialog', await page.evaluate(() => document.getElementById('sixty').open));
  await page.keyboard.press('Tab'); await page.keyboard.press('Escape'); await sleep(100);
  check('Esc closes it and focus returns to the link', await page.evaluate(() => !document.getElementById('sixty').open && document.activeElement.classList.contains('sixty')));
  await page.locator('.hero .cta-row .btn', { hasText: '60-SECOND' }).click(); await page.locator('#sixty .btn.primary').click(); await sleep(1200);
  check('OPEN ONE RECEIPT goes to the certgen case', await page.evaluate(() => !document.getElementById('sixty').open && document.getElementById('ev-c1').open));
  check('console still clean after all interactions', log.errors.length === 0, log.errors.join('|'));
  await ctx.close();
}

// Reduced motion
console.log('\nreduced motion');
{
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, reducedMotion: true });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready')); await sleep(300);
  await page.evaluate(() => CF.openStory('exhibitA'));
  await page.locator('.guess .opt', { hasText: /^19$/ }).click(); await sleep(200);
  check('no animations running', (await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)) === 0);
  check('19 findings visible at once', (await page.evaluate(() => [...document.querySelectorAll('.finds i')].every((i) => +getComputedStyle(i).opacity === 1))));
  check('headline underline is in its final state', (await page.evaluate(() => getComputedStyle(document.querySelector('.n19'), '::after').transform)) !== 'matrix(0, 0, 0, 1, 0, 0)');
  check('no errors', log.errors.length === 0);
  await ctx.close();
}
// localStorage blocked
{
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, storage: false });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  check('works with storage disabled', log.errors.length === 0, log.errors.join('|'));
  await ctx.close();
}

// Axe
console.log('\naccessibility (axe-core)');
const AXE = [process.env.AXE_PATH, join(ROOT, 'node_modules', 'axe-core', 'axe.min.js')].find((p) => p && existsSync(p));
if (AXE) {
  const axe = readFileSync(AXE, 'utf8');
  for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop]]) {
    const { page, ctx } = await openPage(b, { viewport: vp });
    await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
    await page.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); document.querySelector('.guess .opt').click(); });
    await page.addScriptTag({ content: axe });
    const res = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }));
    check(vn + ': no axe violations', res.violations.length === 0, res.violations.map((x) => x.id + ' x' + x.nodes.length + ' ' + x.nodes[0].target.join(' ')).join('; '));
    await ctx.close();
  }
} else console.log('  skipped (npm install axe-core, or set AXE_PATH)');

// Final copy conformance
console.log('\nfinal copy');
if (process.env.COPY_FILE && existsSync(process.env.COPY_FILE)) {
  const { page, ctx } = await openPage(b, { viewport: VIEWPORTS.laptop });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  const body = norm(await page.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); return document.body.innerText; }));
  const lines = readFileSync(process.env.COPY_FILE, 'utf8').split('\n').map((l) => l.trim()).filter((l) => l && l !== '---');
  const missing = [];
  let n = 0;
  for (let l of lines) {
    l = l.replace(/^[*-] +/, '').replace(/^#+\s*/, '').replace(/\[([^\]]*)\]\([^)]*\)/g, '[$1]').replace(/\*\*/g, '').replace(/^\*(.*)\*$/, '$1');
    const parts = /^\[/.test(l) ? l.split(' · ').map((p) => p.replace(/^\[|\]$/g, '')) : [l];
    for (let p of parts) {
      p = norm(p.replace(/^\[|\]$/g, '').replace(/\s*→\s*/g, ' → '));
      if (!p) continue;
      n++;
      if (!body.includes(p) && !body.includes(p.replace(/ · /g, ' · '))) missing.push(p);
    }
  }
  // interview CTA is intentionally absent (no contact supplied); the closing line lives in the verdict
  const real = missing;
  check('all ' + n + ' copy lines are on the page', real.length === 0, real.join(' || '));
  await ctx.close();
} else console.log('  skipped (set COPY_FILE to the Focused Website Copy)');

// Review build loads
{
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, build: 'review.html' });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  check('review build loads with no errors and shows the watermark', log.errors.length === 0 && (await page.locator('.review-mark').count()) === 1);
  await ctx.close();
}
await b.close();
process.exit(summary() ? 1 : 0);
