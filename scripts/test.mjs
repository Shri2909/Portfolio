// Ek Diya Se Doosra tests (Playwright, Chromium). Usage: node scripts/test.mjs
// Optional: AXE_PATH=node_modules/axe-core/axe.min.js runs axe. The three lamp stories are checked line by line against website_copy.md.
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { launch, openPage, VIEWPORTS, sleep, check, summary, ROOT } from './lib.mjs';

const SECTIONS = ['top', 'intro', 'person', 'lamps', 'lamp1', 'lamp2', 'lamp3', 'transition', 'voice', 'growth', 'verdict', 'deeper', 'evidence', 'wish'];
const STATUS = ['PUBLIC', 'LOCAL-BRANCH', 'REPO-REPORTED', 'PERSONALLY CONFIRMED', 'UNRESOLVED', 'PROPOSED', 'EVIDENCE AVAILABLE ON REQUEST'];
const norm = (t) => t.replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/\s+/g, ' ').trim().toLowerCase();

console.log('build');
const g = spawnSync('python3', [join(ROOT, 'scripts', 'build.py')], { encoding: 'utf8' });
check('build guard passes', g.status === 0, g.stdout + g.stderr);
const prod = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8');
for (const bad of ['lorem', 'TODO', '[__]', 'SAMPLE', 'DRAFT', 'draft', 'REVIEW']) check('production has no "' + bad + '"', !new RegExp(bad.replace(/[[\]]/g, '\\$&'), bad === 'draft' ? 'i' : '').test(prod));
check('production has no external URLs loaded (only links)', !/(src|href)=["']https?:\/\/(?!github\.com\/Shri2909|drive\.google\.com|wa\.me)/.test(prod) && !/@import|url\(https?:/.test(prod));
const content = JSON.parse(readFileSync(join(ROOT, 'content', 'content.json'), 'utf8'));
const b = await launch();

for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop]]) {
  console.log('\n' + vn);
  const { page, ctx, log } = await openPage(b, { viewport: vp, touch: vn === 'phone' });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  await sleep(400);
  const m = await page.evaluate(() => ({
    ids: [...document.querySelectorAll('main > section')].map((s) => s.id), h1: document.querySelectorAll('h1').length,
    ox: document.documentElement.scrollWidth - innerWidth, landmarks: ['header', 'main', 'footer', 'nav'].map((t) => !!document.querySelector(t + ',[role=' + (t === 'header' ? 'banner' : t === 'footer' ? 'contentinfo' : t === 'nav' ? 'navigation' : 'main') + ']')),
    lang: document.documentElement.lang, skip: document.querySelector('.skip-link') && document.querySelector('.skip-link').getAttribute('href'),
  }));
  check('sections in the journey order', JSON.stringify(m.ids) === JSON.stringify(SECTIONS), m.ids.join(','));
  check('one h1', m.h1 === 1);
  check('no horizontal overflow', m.ox <= 0, String(m.ox));
  check('landmarks present', m.landmarks.every(Boolean), m.landmarks.join());
  check('page language is en-IN', m.lang === 'en-IN');
  check('skip link targets #main', m.skip === '#main');
  check('zero console errors', log.errors.length === 0, log.errors.join('|'));
  check('zero network requests', log.requests.length === 0, log.requests.join('|'));
  const first = await page.evaluate(() => ({ cta: document.getElementById('hold-first').getBoundingClientRect().bottom, vh: innerHeight }));
  check('headline and the hold-to-light button are above the fold', first.cta <= first.vh, JSON.stringify(first));
  const small = await page.evaluate(() => [...document.querySelectorAll('a[href], button, summary, input, textarea')].filter((e) => e.offsetParent !== null && !e.closest('.skip-link') && !e.closest('dialog:not([open])')).map((e) => { const r = e.getBoundingClientRect(); return { t: (e.textContent || e.id || e.type).trim().slice(0, 30), w: Math.round(r.width), h: Math.round(r.height) }; }).filter((x) => x.h < 44 || x.w < 44));
  check('every visible control is at least 44px', small.length === 0, JSON.stringify(small));
  await page.evaluate(() => document.getElementById('verdict').scrollIntoView({ behavior: 'instant', block: 'start' })); await sleep(300);
  check('top bar sticks to the top', (await page.evaluate(() => Math.round(document.getElementById('topbar').getBoundingClientRect().top))) === 0);
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));

  // Lamps: order, hold, tap, keyboard, light all
  check('home flame lit, three lamps unlit, lamp 4 dashed', (await page.locator('.row-item').count()) === 5 && (await page.locator('.lamp-btn.lit').count()) === 0 && (await page.locator('.lamp-btn.dashed').count()) === 1);
  await page.evaluate(() => document.getElementById('lampbtn-2').dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerId: 3, bubbles: true }))); await sleep(150);
  check('lamp 2 cannot be lit before lamp 1, and says which lamp first', (await page.locator('#lampbtn-2.lit').count()) === 0 && /Light lamp 1 first/.test(await page.textContent('#row-live')));
  await page.evaluate(() => document.getElementById('hold-first').dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerId: 4, bubbles: true }))); await sleep(300);
  check('holding shows the pressure ring, the travelling flame and the line above the lamp', (await page.locator('.fx-over:not([hidden]) .pring').count()) === 1 && /Baati abhi garam ho rahi hai/.test(await page.textContent('.hold-text')));
  await sleep(1100);
  check('the first lamp lights after the hold', (await page.locator('#lampbtn-1.lit').count()) === 1 && /Lamp 1 jal utha/.test(await page.textContent('#row-status')));
  check('lit lamp has an accessible name and the screen-reader line', /Lamp 1, Certgen, lit/.test(await page.getAttribute('#lampbtn-1', 'aria-label')) && /Lamp 1 is lit\. 1 of 3 lamps lit/.test(await page.textContent('#row-live')));
  check('the rangoli drew its first layers', await page.evaluate(() => +document.querySelector('.rl1 .line').getAttribute('stroke-dashoffset') < .05));
  await page.evaluate(() => { const b = document.getElementById('lampbtn-2'); b.dispatchEvent(new PointerEvent('pointerdown', { button: 0, pointerId: 5, bubbles: true })); b.dispatchEvent(new PointerEvent('pointerup', { button: 0, pointerId: 5, bubbles: true })); }); await sleep(900);
  check('a quick tap lights the next lamp', (await page.locator('#lampbtn-2.lit').count()) === 1);
  await page.locator('#lampbtn-3').focus(); await page.keyboard.press('Enter'); await sleep(1000);
  check('Enter lights a lamp from the keyboard (no hold needed)', (await page.locator('#lampbtn-3.lit').count()) === 1);
  await sleep(2200);
  check('all three lit: the room turns dusk-gold and the row message shows', (await page.evaluate(() => document.documentElement.classList.contains('dusk'))) && /Teen diye jal uthe/.test(await page.textContent('.row-msg')) && (await page.locator('.row-msg:not([hidden])').count()) === 1);
  check('lamp 4 stays unlit', (await page.locator('.lamp-btn.dashed.lit').count()) === 0);
  await page.locator('#lampbtn-3').click(); await sleep(1200);
  check('a lit lamp opens its story', await page.evaluate(() => document.getElementById('lamp3-l2').open));
  check('Light all and the dock are real controls', (await page.locator('#dock-calm').count()) === 1 && (await page.locator('#dock-ink').count()) === 1);
  await page.evaluate(() => { document.querySelectorAll('details.l2').forEach((d) => (d.open = false)); window.scrollTo({ top: 0, behavior: 'instant' }); });

  // Three levels per lamp
  const lv = await page.evaluate(() => ['lamp1', 'lamp2', 'lamp3'].map((id) => ({ l1: !!document.querySelector('#' + id + ' .l1-sum') && !!document.querySelector('#' + id + ' .l1-capt'), l2: !document.getElementById(id + '-l2').open, l3: !document.getElementById(id + '-l3').open, repo: !!document.querySelector('#' + id + '-l3 a.repo-link') })));
  check('each lamp: Level 1 visible, Levels 2 and 3 closed, repository link in Level 3', lv.every((x) => x.l1 && x.l2 && x.l3 && x.repo), JSON.stringify(lv));
  await page.evaluate(() => document.querySelectorAll('details.l2').forEach((d) => (d.open = true)));

  // Lamp 1: guess
  await page.evaluate(() => document.querySelector('.guess').scrollIntoView({ behavior: 'instant', block: 'center' }));
  check('324 lights, 4 options', (await page.locator('.wall i').count()) === 324 && (await page.locator('.guess .opt').count()) === 4);
  check('findings hidden before a guess', (await page.evaluate(() => getComputedStyle(document.querySelector('.finds')).visibility)) === 'hidden');
  for (const n of [0, 19]) {
    await page.locator('.guess .opt', { hasText: new RegExp('^' + n + '$') }).click();
    const t = await page.textContent('.reveal');
    check('guess ' + n + ' reveals 19 findings, two high', t.startsWith('You said ' + n + '.') && /19 problems, two of them high/.test(t) && (n === 19 ? /Bilkul sahi/.test(t) : /Kam socha/.test(t)));
  }
  check('19 findings shown, 2 high', (await page.locator('.finds i').count()) === 19 && (await page.locator('.finds i.hi').count()) === 2);
  check('plain-text version always visible', /324 of 324 tests passed/.test(await page.textContent('.guess .plainly')));

  // Lamp 3: late reply
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

  // Voice compare
  const cmp = await page.evaluate(() => EK.data.voice.takes.map((t) => { const st = EK.engine.buildStream(t.raw, t.output); return { start: EK.engine.textAt(st, 0) === t.raw.split(/\s+/).filter(Boolean).join(' '), end: EK.engine.textAt(st, st.length) === t.output.split(/\s+/).filter(Boolean).join(' ') }; }));
  check('engine: k=0 is my words, k=N is exactly Flow’s words (both takes)', cmp.length === 2 && cmp.every((c) => c.start && c.end));
  await page.evaluate(() => document.querySelector('.compare').scrollIntoView({ behavior: 'instant', block: 'start' }));
  const N = +(await page.getAttribute('#cmp-r', 'max'));
  const h0 = await page.evaluate(() => document.querySelector('.cmp-text').offsetHeight);
  await page.fill('#cmp-r', String(Math.round(N / 2))); const hm = await page.evaluate(() => document.querySelector('.cmp-text').offsetHeight);
  await page.fill('#cmp-r', String(N)); const he = await page.evaluate(() => document.querySelector('.cmp-text').offsetHeight);
  check('text block keeps its height while dragging', h0 === hm && hm === he, [h0, hm, he].join('/'));
  await page.locator('.compare .seg .btn', { hasText: 'Take 2' }).click();
  check('Take 2 resets to my words and updates the custody row', (await page.inputValue('#cmp-r')) === '0' && /Take 2/.test(await page.evaluate(() => { document.querySelector('.chipd').open = true; return document.querySelector('.custody .rec').textContent; })));
  check('read it plainly shows both texts', (await page.evaluate(() => { document.querySelector('.readplain').open = true; return document.querySelector('.plain-box').textContent; })).includes("Shouldn't the technology adapt"));
  check('Take 3 is not shown', !(await page.textContent('body')).includes('7:33'));

  // Lamp 4
  await page.evaluate(() => document.getElementById('growth').scrollIntoView({ behavior: 'instant' }));
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('#lampbtn-4').click(); await sleep(1500);
  check('lamp 4 tries, never lights, and says so', /Yeh diya abhi nahi jalega/.test(await page.textContent('#row-status')) && (await page.locator('.lamp-btn.dashed.lit').count()) === 0);

  // Evidence
  const ev = await page.evaluate(() => [...document.querySelectorAll('details.folder')].map((d) => ({ links: [...d.querySelectorAll('a')].map((a) => a.href), st: [...d.querySelectorAll('.st')].map((s) => s.textContent) })));
  check('six evidence folders', ev.length === 6, String(ev.length));
  check('every status uses the plain vocabulary', ev.every((c) => c.st.every((s) => STATUS.includes(s))));
  check('links are the three repositories, the essay and the résumé only', ev.flatMap((c) => c.links).every((u) => /^https:\/\/(github\.com\/Shri2909\/|drive\.google\.com\/file\/d\/)/.test(u)));
  await page.evaluate(() => EK.openEvidence('c3')); await sleep(1200);
  check('receipt opens its folder', await page.evaluate(() => document.getElementById('ev-c3').open));
  await page.evaluate(() => EK.openStory('lamp2')); await sleep(300);
  check('Longer story opens Level 2', await page.evaluate(() => document.getElementById('lamp2-l2').open));

  // Verdict: interview only with a real contact
  const em = content.site.contact.email;
  check('interview button appears only with a real contact', em ? (await page.locator('#verdict a[href="mailto:' + em + '"]').count()) === 1 : (await page.locator('a[href^="mailto:"]').count()) === 0);
  check('GitHub and LinkedIn buttons appear only when filled in', content.site.contact.github || content.site.contact.linkedin ? true : (await page.locator('#verdict a', { hasText: /GITHUB|LINKEDIN/ }).count()) === 0);

  // Wish and visitor lamp
  await page.evaluate(() => document.getElementById('wish').scrollIntoView({ behavior: 'instant' }));
  await page.getByRole('button', { name: 'Card banaiye' }).click();
  check('an empty wish asks for one line', /Ek line toh likhiye/.test(await page.textContent('.wish-msg')));
  await page.fill('#wish-for', 'Maa'); await page.fill('#wish-text', 'Diwali mubarak. Aapki yaad aayi.'); await page.fill('#wish-from', 'Asha');
  await page.getByRole('button', { name: 'Card banaiye' }).click(); await sleep(200);
  const card = await page.textContent('.wish-card');
  check('card is made in the tab with the wish, names and link line', /Maa ke liye:/.test(card) && /Diwali mubarak/.test(card) && /— Asha/.test(card) && /One lamp lights another\./.test(card));
  check('the visitor lamp lights', (await page.evaluate(() => document.documentElement.classList.contains('visitor-lit'))) && /Aapka diya jal utha/.test(await page.textContent('.lit-head')));
  check('share links are plain: WhatsApp link encodes the card', /^https:\/\/wa\.me\/\?text=/.test(await page.getAttribute('.wish-out a.btn', 'href')));
  check('nothing is stored in the browser', await page.evaluate(() => { try { return localStorage.length === 0 && sessionStorage.length === 0 && document.cookie === ''; } catch (e) { return true; } }));

  // Ink and Calm (memory only)
  await page.locator('#dock-ink').click();
  check('Ink hides the festival decor and keeps the page readable', (await page.evaluate(() => getComputedStyle(document.querySelector('.toran')).display)) === 'none' && (await page.locator('#dock-ink[aria-pressed="true"]').count()) === 1);
  await page.locator('#dock-dv').click(); await page.locator('#dock-calm').click();
  check('Calm toggles on and shows the motion note', await page.evaluate(() => document.documentElement.classList.contains('calm') && !document.getElementById('dock-note').hidden));
  await page.locator('#dock-calm').click();

  // 60-second file
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.locator('.nav-link.sixty').click(); await sleep(200);
  check('60-second file opens as a dialog', await page.evaluate(() => document.getElementById('sixty').open));
  await page.keyboard.press('Tab'); await page.keyboard.press('Escape'); await sleep(100);
  check('Esc closes it and focus returns to the link', await page.evaluate(() => !document.getElementById('sixty').open && document.activeElement.classList.contains('sixty')));
  check('console still clean after all interactions', log.errors.length === 0, log.errors.join('|'));
  await ctx.close();
}

console.log('\nreduced motion');
{
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, reducedMotion: true });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready')); await sleep(300);
  check('Calm starts on with reduced motion', await page.evaluate(() => document.documentElement.classList.contains('calm')));
  await page.locator('#hold-first').click(); await sleep(200);
  check('lamp lights at once, no animations running', (await page.locator('#lampbtn-1.lit').count()) === 1 && (await page.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').length)) === 0);
  await page.evaluate(() => EK.openStory('lamp1')); await page.locator('.guess .opt', { hasText: /^19$/ }).click(); await sleep(200);
  check('19 findings visible at once', await page.evaluate(() => [...document.querySelectorAll('.finds i')].every((i) => +getComputedStyle(i).opacity === 1)));
  check('no errors', log.errors.length === 0);
  await ctx.close();
}
{
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, storage: false });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  check('works with storage disabled', log.errors.length === 0, log.errors.join('|'));
  await ctx.close();
}

console.log('\naccessibility (axe-core)');
const AXE = [process.env.AXE_PATH, join(ROOT, 'node_modules', 'axe-core', 'axe.min.js')].find((p) => p && existsSync(p));
if (AXE) {
  const axe = readFileSync(AXE, 'utf8');
  for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop]]) {
    const { page, ctx } = await openPage(b, { viewport: vp });
    await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
    await page.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); document.querySelector('.guess .opt').click(); document.querySelector('#wish-text').value = 'x'; document.querySelector('.wish-form').requestSubmit(); EK.lamps.lightAll(); });
    await page.addScriptTag({ content: axe });
    const res = await page.evaluate(() => axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'best-practice'] }));
    check(vn + ': no axe violations', res.violations.length === 0, res.violations.map((x) => x.id + ' x' + x.nodes.length + ' ' + x.nodes[0].target.join(' ')).join('; '));
    await ctx.close();
  }
} else console.log('  skipped (npm install axe-core, or set AXE_PATH)');

console.log('\nthe three lamp stories, word for word');
{
  const copy = join(ROOT, 'website_copy.md');
  const { page, ctx } = await openPage(b, { viewport: VIEWPORTS.laptop });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  const body = norm(await page.evaluate(() => { document.querySelectorAll('details').forEach((d) => (d.open = true)); return document.body.innerText; }));
  const md = readFileSync(copy, 'utf8');
  const a = md.indexOf('## 2. LAMP 01'), z = md.indexOf('## 6. ');
  const lines = md.slice(a, z).split('\n').map((l) => l.trim()).filter((l) => l && l !== '---' && !/^## \d/.test(l));
  const missing = []; let n = 0;
  for (let l of lines) {
    l = l.replace(/^\[KICKER\]\s*/, '').replace(/^[*-] +/, '').replace(/^#+\s*/, '').replace(/\*\*/g, '').replace(/^\*(.*)\*$/, '$1');
    const p = norm(l); if (!p) continue; n++;
    if (!body.includes(p)) missing.push(p.slice(0, 80));
  }
  check('all ' + n + ' lines of Certgen, Blitz, Vigil and the transition are on the page', missing.length === 0, missing.join(' || '));
  await ctx.close();
}

{
  const { page, ctx, log } = await openPage(b, { viewport: VIEWPORTS.phone, build: 'review.html' });
  await page.waitForFunction(() => document.documentElement.classList.contains('ready'));
  check('review build loads with no errors and shows the watermark', log.errors.length === 0 && (await page.locator('.review-mark').count()) === 1);
  await ctx.close();
}
await b.close();
process.exit(summary() ? 1 : 0);
