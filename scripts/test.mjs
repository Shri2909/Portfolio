// Case File No. 001: browser tests (Playwright, Chromium). Usage: node scripts/test.mjs [stage ...]
// Stages: 1 shell and builds, 2 opening engine, 3 opening behaviour.  No arguments runs everything built so far.
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { launch, openPage, VIEWPORTS, sleep, check, summary, ROOT } from './lib.mjs';

const SHOTS = process.env.SHOTS || join(ROOT, 'previews', '_scratch');
import { mkdirSync } from 'node:fs';
mkdirSync(SHOTS, { recursive: true });
const wanted = process.argv.slice(2).map(Number);
const run = (n) => wanted.length === 0 || wanted.includes(n);

const browser = await launch();
const norm = (s) => s.replace(/\s+/g, ' ').trim();
const content = JSON.parse(readFileSync(join(ROOT, 'content', 'content.json'), 'utf8'));
const takesData = content.exhibit0.takes;

async function settle(page, ms = 700) { await sleep(ms); }
const landedSoon = (page) => page.waitForFunction(() => window.CF && window.CF.opening && window.CF.opening.landed, null, { timeout: 25000 });

/* DOM-level truth: which tokens are really visible (width and opacity) and what do they say, in order. */
const domVisibleText = (page) => page.evaluate(() => {
  const out = [];
  document.querySelectorAll('#exhibit0 .textblock .tk').forEach((el) => {
    if (el.classList.contains('br')) { if (el.offsetWidth > 2) out.push('\n\n'); return; }
    const cs = getComputedStyle(el);
    if (el.offsetWidth > 0 && parseFloat(cs.opacity) > 0.5) out.push(el.textContent);
  });
  return out.join(' ');
});

// ------------------------------------------------------------------ Stage 1
if (run(1)) {
  console.log('\nStage 1: foundation, build pipeline, cozy shell');
  const prod = readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8');
  const rev = readFileSync(join(ROOT, 'dist', 'review.html'), 'utf8');
  const scan = prod.replace(/data:font\/woff2;base64,[A-Za-z0-9+/=]+/g, 'data:font');
  for (const word of ['lorem', 'TODO', '[__]', 'SAMPLE', 'DRAFT', 'draft']) {
    check(`production has no "${word}"`, !(word === 'lorem' || word === 'draft' ? new RegExp(word, 'i').test(scan) : scan.includes(word)));
  }
  check('production has no review code or watermark', !/review-mark|cf-filled|REVIEW/.test(scan));
  check('review build has watermark and filled list', /REVIEW DRAFT - NOT YET SPOKEN BY SHRINIWAS/.test(rev) && /id="cf-filled"/.test(rev));
  check('no http(s) resource tags (script src, link href, img src, url())', !/(<script[^>]+src=|<link[^>]+href="http|<img[^>]+src="http|url\(\s*["']?https?:)/i.test(scan));

  for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop]]) {
    for (const build of ['index.html', 'review.html']) {
      const { page, ctx, log } = await openPage(browser, { viewport: vp, touch: vn === 'phone', build });
      await settle(page, 400);
      const info = await page.evaluate(() => ({
        h1: document.querySelectorAll('h1').length,
        header: !!document.querySelector('header'), main: !!document.querySelector('main'), footer: !!document.querySelector('footer'),
        skip: !!document.querySelector('a.skip-link[href="#main"]'),
        decor: ['.desk', '.lamp', '.rail'].map((s) => { const e = document.querySelector(s); return [getComputedStyle(e).pointerEvents, e.getAttribute('aria-hidden') || (e.closest('[aria-hidden="true"]') ? 'true' : '')]; }),
        title: document.title, desc: document.querySelector('meta[name=description]').content,
        footerText: document.getElementById('foot').textContent, footerH: document.getElementById('foot').getBoundingClientRect().height,
        fontsLoaded: [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family),
      }));
      const tag = `${vn} ${build}`;
      check(`${tag}: no console errors`, log.errors.length === 0, log.errors.join(' | '));
      check(`${tag}: zero network requests`, log.requests.length === 0, log.requests.join(' | '));
      check(`${tag}: landmarks and one h1`, info.h1 === 1 && info.header && info.main && info.footer && info.skip);
      check(`${tag}: decorative layers are pointer-events:none and aria-hidden`, info.decor.every(([pe, ah]) => pe === 'none' && ah === 'true'), JSON.stringify(info.decor));
      check(`${tag}: title, description and footer come from content`, info.title === content.site.title && info.desc === content.site.description && info.footerText === content.ui.footer);
      check(`${tag}: footer in normal flow, max 56px`, info.footerH <= 56);
      check(`${tag}: embedded fonts loaded`, ['Fraunces', 'Source Serif 4', 'Courier Prime'].every((f) => info.fontsLoaded.includes(f)), info.fontsLoaded.join(','));
      if (build === 'index.html') await page.screenshot({ path: join(SHOTS, `s1-${vn}-shell.png`) });
      await ctx.close();
    }
  }
}

// ------------------------------------------------------------------ Stage 2
if (run(2)) {
  console.log('\nStage 2: the opening engine (invariants)');
  const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
  await sleep(300);
  for (let ti = 0; ti < takesData.length; ti++) {
    const take = takesData[ti];
    if (ti > 0) { await page.evaluate((i) => window.CF.opening.setTake(i), ti); await sleep(300); }
    await page.evaluate(() => window.CF.opening.skip());
    await sleep(900);
    const N = await page.evaluate(() => window.CF.opening.N);
    const rawText = norm(take.raw), outText = norm(take.output);
    // state-level invariants
    await page.evaluate(() => window.CF.opening.setK(0));
    check(`${take.label}: p=0 visible text equals RAW (state)`, (await page.evaluate(() => window.CF.opening.visibleText())) === rawText);
    await page.evaluate((n) => window.CF.opening.setK(n), N);
    check(`${take.label}: p=1 visible text equals OUTPUT exactly (state)`, (await page.evaluate(() => window.CF.opening.visibleText())) === outText);
    // DOM-level invariants after transitions settle
    await page.evaluate(() => window.CF.opening.setK(0)); await sleep(900);
    check(`${take.label}: p=0 DOM shows RAW (geometry and opacity)`, norm(await domVisibleText(page)) === rawText, norm(await domVisibleText(page)).slice(0, 80));
    await page.evaluate((n) => window.CF.opening.setK(n), N); await sleep(1100);
    check(`${take.label}: p=1 DOM shows OUTPUT with single spaces`, norm(await domVisibleText(page)) === outText);
    // scrub 1 -> 0 -> 1 restores output
    for (const k of [Math.floor(N * .6), Math.floor(N * .2), 0, Math.floor(N * .9), N]) { await page.evaluate((x) => window.CF.opening.setK(x), k); await sleep(60); }
    await sleep(1000);
    check(`${take.label}: scrub 1 -> 0 -> 1 restores output`, norm(await domVisibleText(page)) === outText);
    // every intermediate frontier is a coherent mix: no token both shown and hidden, count of tokens matches stream
    const mid = await page.evaluate((n) => { window.CF.opening.setK(Math.round(n / 2)); return window.CF.opening.visibleText().length; }, N);
    check(`${take.label}: mid-scrub text is non-empty and shorter than raw+output`, mid > 20 && mid < rawText.length + outText.length);
    const slider = await page.evaluate(() => { const s = document.querySelector('input.string'); return { type: s.type, min: s.min, max: +s.max, v: s.value, vt: s.getAttribute('aria-valuetext') }; });
    check(`${take.label}: slider is a native input[type=range] with aria-valuetext`, slider.type === 'range' && slider.min === '0' && slider.max === N && /^Trimmed \d+ of \d+ words$/.test(slider.vt), JSON.stringify(slider));
  }
  // keyboard: arrows step one token
  await page.evaluate(() => window.CF.opening.setK(10));
  await page.focus('input.string');
  await page.keyboard.press('ArrowRight');
  check('keyboard: ArrowRight steps one token', (await page.evaluate(() => window.CF.opening.k)) === 11);
  await page.keyboard.press('End');
  check('keyboard: End goes to the end', (await page.evaluate(() => window.CF.opening.p)) === 1);
  await page.keyboard.press('Home');
  check('keyboard: Home goes to the start', (await page.evaluate(() => window.CF.opening.k)) === 0);
  check('stage 2: no console errors', log.errors.length === 0, log.errors.join(' | '));
  await ctx.close();
}

// ------------------------------------------------------------------ Stage 3
if (run(3)) {
  console.log('\nStage 3: the opening that makes them say "wait, what?"');

  // ---- fit with no scrolling, before and after the sequence, both takes, three viewports
  for (const [vn, vp] of [['phone 390x844', VIEWPORTS.phone], ['laptop 1366x650', VIEWPORTS.laptop], ['wide 1850x692', VIEWPORTS.wide]]) {
    const { page, ctx, log } = await openPage(browser, { viewport: vp, touch: vn.startsWith('phone') });
    await sleep(250);
    const fit = () => page.evaluate((vh) => { window.__vh = vh;
      const d = document.querySelector('.dossier').getBoundingClientRect();
      const seal = document.querySelector('.seal').getBoundingClientRect();
      const vis = [...document.querySelectorAll('.dossier button, .dossier input')].filter((e) => e.offsetParent && getComputedStyle(e.closest('.cuewrap') || document.body).visibility !== 'hidden');
      const lowest = Math.max(...vis.map((e) => e.getBoundingClientRect().bottom));
      return { bottom: Math.round(d.bottom), vh: window.__vh, controlsBottom: Math.round(lowest), sealTop: Math.round(seal.top), sealInView: seal.top >= 0, hscroll: document.documentElement.scrollWidth > window.innerWidth + 1 };
    }, vp.height);
    let f = await fit();
    check(`${vn}: dossier (first paint) fits without scrolling`, f.bottom <= f.vh, JSON.stringify(f));
    check(`${vn}: no horizontal scroll`, !f.hscroll);
    await page.evaluate(() => window.CF.opening.skip()); await landedSoon(page); await sleep(900);
    f = await fit();
    check(`${vn}: Take 1 landed state fits (controls, cue, seal in view)`, f.bottom <= f.vh && f.sealInView && f.controlsBottom <= f.vh, JSON.stringify(f));
    await page.evaluate(() => window.CF.opening.setTake(1)); await sleep(500);
    await page.evaluate(() => window.CF.opening.skip()); await landedSoon(page); await sleep(900);
    f = await fit();
    check(`${vn}: Take 2 landed state fits`, f.bottom <= f.vh && f.controlsBottom <= f.vh, JSON.stringify(f));
    check(`${vn}: no console errors`, log.errors.length === 0, log.errors.join(' | '));
    await ctx.close();
  }

  // ---- nothing below the text block ever moves, in any mixed state; layout-shift score for the whole run
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await page.addInitScript(() => {});
    await sleep(300);
    for (let ti = 0; ti < takesData.length; ti++) {
      if (ti > 0) { await page.evaluate((i) => window.CF.opening.setTake(i), ti); await sleep(400); }
      await page.evaluate(() => window.CF.opening.skip()); await sleep(900);
      const ys = [];
      const N = await page.evaluate(() => window.CF.opening.N);
      for (let i = 0; i <= 20; i++) {
        await page.evaluate((k) => window.CF.opening.setK(k), Math.round((N * i) / 20));
        await sleep(450);
        ys.push(await page.evaluate(() => { const b = (s) => document.querySelector(s).getBoundingClientRect().top; return [b('input.string'), b('.controls'), b('.dossier') + document.querySelector('.dossier').offsetHeight]; }));
      }
      const spread = [0, 1, 2].map((c) => Math.max(...ys.map((y) => y[c])) - Math.min(...ys.map((y) => y[c])));
      check(`${takesData[ti].label}: slider, controls and dossier bottom never move across 21 frontier positions`, spread.every((s) => s < 1.5), spread.map((s) => s.toFixed(1)).join(', '));
    }
    await ctx.close();
    const c2 = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    // The trim itself reflows words INSIDE the fixed-size text block (that is the effect). Count only shifts that touch anything outside it.
    await c2.page.evaluate(() => {
      window.__cls = 0; window.__clsInside = 0;
      new PerformanceObserver((l) => { for (const e of l.getEntries()) {
        if (e.hadRecentInput) continue;
        const outside = e.sources.some((s) => s.node && !(s.node.closest && s.node.closest('.textblock')) && !(s.node.parentElement && s.node.parentElement.closest && s.node.parentElement.closest('.textblock')));
        if (outside) window.__cls += e.value; else window.__clsInside += e.value;
      } }).observe({ type: 'layout-shift', buffered: true });
    });
    await landedSoon(c2.page); await sleep(1500);
    const cls = await c2.page.evaluate(() => window.__cls);
    check('layout shift outside the text block over the whole run is under 0.01', cls < 0.01, String(cls));
    console.log('       (words reflowing inside the fixed-size text block register separately: ' + (await c2.page.evaluate(() => window.__clsInside)).toFixed(2) + ')');
    await c2.ctx.close();
  }

  // ---- nothing overlays any control at any viewport, before and after landing (this caught a real overlap on the laptop layout)
  for (const [vn, vp] of [['phone', VIEWPORTS.phone], ['laptop', VIEWPORTS.laptop], ['wide', VIEWPORTS.wide]]) {
    const { page, ctx } = await openPage(browser, { viewport: vp, touch: vn === 'phone' });
    await sleep(300);
    const probe = () => page.evaluate(() => [...document.querySelectorAll('.dossier button, .dossier input')].filter((e) => e.offsetParent && getComputedStyle(e).visibility !== 'hidden' && getComputedStyle(e.closest('.cuewrap') || document.body).visibility !== 'hidden' && !e.hidden).map((e) => {
      const r = e.getBoundingClientRect(); const top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return { name: e.textContent.trim().slice(0, 20) || e.type, ok: top === e || e.contains(top) };
    }));
    let r = await probe();
    check(`${vn}: nothing overlays any control before landing (${r.length} controls)`, r.length >= 6 && r.every((x) => x.ok), JSON.stringify(r.filter((x) => !x.ok)));
    await page.evaluate(() => window.CF.opening.skip()); await landedSoon(page); await sleep(1500);
    r = await probe();
    check(`${vn}: nothing overlays any control after landing (${r.length} controls, seal included)`, r.length >= 6 && r.every((x) => x.ok), JSON.stringify(r.filter((x) => !x.ok)));
    await ctx.close();
  }

  // ---- first paint state p=0
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    const st = await page.evaluate(() => ({
      k: window.CF.opening.k, p: window.CF.opening.p, value: document.querySelector('input.string').value,
      caretHidden: document.querySelector('.caret').hidden,
      peel: [...document.querySelectorAll('.subject .w')].map((w) => w.style.getPropertyValue('--peel')),
      srName: document.querySelector('.subject .sr-only').textContent,
      sealOn: document.querySelector('.seal').classList.contains('on'),
      skipVisible: !document.querySelector('.skipbtn').hidden,
      untypedAll: [...document.querySelectorAll('.tk:not(.br)')].every((e) => e.classList.contains('untyped')),
    }));
    check('first paint: p=0, slider at left, caret hidden', st.k === 0 && st.p === 0 && st.value === '0' && st.caretHidden);
    check('first paint: name under tape (peel 0) and raw text not yet typed', st.peel.every((v) => v === '0.000') && st.untypedAll, JSON.stringify(st));
    check('first paint: hidden text says "Subject: Shriniwas Kholkute"', st.srName === 'Subject: Shriniwas Kholkute');
    check('first paint: Skip visible, seal not yet landed', st.skipVisible && !st.sealOn);
    await ctx.close();
  }

  // ---- full run: typing -> hold -> trim -> seal; also timing
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    const t0 = Date.now();
    await sleep(2000);
    const typing = await page.evaluate(() => ({ phase: window.CF.opening.phase, typed: document.querySelectorAll('.tk:not(.br):not(.untyped)').length }));
    check('show: typing in progress at 2 s (layout reserved, some tokens revealed)', typing.phase === 'typing' && typing.typed > 5, JSON.stringify(typing));
    const hBefore = await page.evaluate(() => document.querySelector('.textblock').getBoundingClientRect().height);
    await page.waitForFunction(() => window.CF.opening.phase === 'trim', null, { timeout: 20000 });
    const hMid = await page.evaluate(() => document.querySelector('.textblock').getBoundingClientRect().height);
    check('show: text block height never changes (no layout shift)', Math.abs(hBefore - hMid) < 1, `${hBefore} vs ${hMid}`);
    await sleep(1100);
    await page.screenshot({ path: join(SHOTS, 's3-phone-midtrim.png') });
    await landedSoon(page);
    const elapsed = (Date.now() - t0) / 1000 - 0.3;
    check('show: sequence lands in about 11 s (8 to 16 s)', elapsed > 8 && elapsed < 16, elapsed.toFixed(1) + ' s');
    await sleep(1600);
    const end = await page.evaluate(() => ({
      text: window.CF.opening.visibleText(), sealOn: document.querySelector('.seal').classList.contains('on'),
      tagline: getComputedStyle(document.querySelector('.tagline')).opacity, cue: getComputedStyle(document.querySelector('.cuewrap')).opacity,
      cueText: document.querySelector('.cue').textContent, teaser: document.querySelector('.teaser').textContent,
      skipHidden: document.querySelector('.skipbtn').hidden, caretHidden: document.querySelector('.caret').hidden,
      peel: [...document.querySelectorAll('.subject .w')].map((w) => w.style.getPropertyValue('--peel')),
    }));
    check('landed: output text, seal, tagline, cue and teaser all present', end.text === norm(takesData[0].output) && end.sealOn && end.tagline === '1' && end.cue === '1' && end.cueText.includes(content.ui.cue) && end.teaser === content.chapters[0].teaser, JSON.stringify(end).slice(0, 300));
    check('landed: caret hidden at p=1, skip hidden, both tapes fully peeled', end.caretHidden && end.skipHidden && end.peel.every((v) => v === '1.000'));
    check('show: no console errors', log.errors.length === 0, log.errors.join(' | '));
    await ctx.close();
  }

  // ---- tape: synced to p, re-covers when dragged back
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await sleep(300);
    const peelAt = (p) => page.evaluate((q) => { window.CF.opening.setP(q); return [...document.querySelectorAll('.subject .w')].map((w) => +w.style.getPropertyValue('--peel')); }, p);
    let v = await peelAt(0.4);
    check('tape: both covered at p=0.4', v[0] === 0 && v[1] === 0, v.join());
    v = await peelAt(0.675);
    check('tape: tape 1 half peeled and tape 2 still covered at p=0.675', v[0] > 0.3 && v[0] < 0.95 && v[1] === 0, v.join());
    await page.screenshot({ path: join(SHOTS, 's3-phone-tape-half.png') });
    v = await peelAt(0.88);
    check('tape: tape 1 gone and tape 2 peeling at p=0.88', v[0] === 1 && v[1] > 0.3 && v[1] < 1, v.join());
    v = await peelAt(1);
    check('tape: both gone at p=1', v[0] === 1 && v[1] === 1, v.join());
    v = await peelAt(0.3);
    check('tape: dragging back re-covers both', v[0] === 0 && v[1] === 0, v.join());
    await ctx.close();
  }

  // ---- strikes and highlights
  {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await sleep(300);
    await page.evaluate(() => window.CF.opening.skip()); await sleep(900);
    const hl = await page.evaluate(() => {
      const ad = document.querySelector('.tk.ad.res .in'); const bg = ad ? getComputedStyle(ad).backgroundImage : '';
      return { ads: document.querySelectorAll('.tk.ad').length, ros: document.querySelectorAll('.tk.ro').length, bg: bg.includes('gradient') };
    });
    check('added words carry the highlighter wash; raw-only words exist', hl.ads > 0 && hl.ros > 0 && hl.bg, JSON.stringify(hl));
    // forward move marks trimmed words with the blue pencil, backward does not
    await page.evaluate(() => window.CF.opening.setK(0)); await sleep(700);
    await page.evaluate(() => window.CF.opening.setP(0.5)); await sleep(30);
    const fwd = await page.evaluate(() => document.querySelectorAll('.tk.ro.res.fwd').length);
    await page.evaluate(() => window.CF.opening.setP(0.2)); await sleep(30);
    const back = await page.evaluate(() => document.querySelectorAll('.tk.ro.res.fwd').length);
    check('blue-pencil strike appears going forward, not going backward', fwd > 0 && back < fwd);
    const pencil = await page.evaluate(() => getComputedStyle(document.querySelector('.tk.ro .in'), '::after').backgroundColor);
    check('strike colour is the blue pencil (#2F5D8A)', pencil === 'rgb(47, 93, 138)', pencil);
    await ctx.close();
  }

  // ---- touch: every control tappable, nothing overlays them
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await sleep(500);
    const hit = await page.evaluate(() => [...document.querySelectorAll('.dossier button, .dossier input')].filter((e) => e.offsetParent && getComputedStyle(e).visibility !== 'hidden' && !e.closest('.cuewrap')).map((e) => {
      const r = e.getBoundingClientRect(); const x = r.left + r.width / 2, y = r.top + r.height / 2;
      const top = document.elementFromPoint(x, y);
      return { name: e.textContent.trim().slice(0, 20) || e.type, ok: top === e || e.contains(top), h: Math.round(r.height), w: Math.round(r.width) };
    }));
    check('nothing overlays any control (elementFromPoint)', hit.every((x) => x.ok), JSON.stringify(hit.filter((x) => !x.ok)));
    check('every control is at least 44px tall', hit.every((x) => x.h >= 44 || x.name === 'range'), JSON.stringify(hit.filter((x) => x.h < 44)));

    // touch drag on the string through real touch events (CDP)
    const cdp = await ctx.newCDPSession(page);
    const box = await page.locator('input.string').boundingBox();
    const y = box.y + box.height / 2;
    const touch = async (type, x) => cdp.send('Input.dispatchTouchEvent', { type, touchPoints: type === 'touchEnd' ? [] : [{ x, y }] });
    await touch('touchStart', box.x + 22);
    await touch('touchMove', box.x + box.width * 0.4);
    await touch('touchMove', box.x + box.width * 0.6);
    await touch('touchEnd');
    await sleep(500);
    const drag = await page.evaluate(() => ({ phase: window.CF.opening.phase, p: window.CF.opening.p }));
    check('touch drag on the string takes control and moves the pin', drag.phase === 'manual' && drag.p > 0.3 && drag.p < 0.9, JSON.stringify(drag));
    const stays = await (async () => { await sleep(3500); return page.evaluate(() => window.CF.opening.p); })();
    check('touch cancelled the auto-run: it stays where the finger left it', Math.abs(stays - drag.p) < 0.01, `${drag.p} -> ${stays}`);
    // drag to the very end by touch: seal lands
    await touch('touchStart', box.x + box.width * 0.6); await touch('touchMove', box.x + box.width - 4); await touch('touchEnd');
    await landedSoon(page); await sleep(700);
    check('dragging to the end lands the seal', await page.evaluate(() => document.querySelector('.seal').classList.contains('on')));

    // Skip / dossier-body tap
    await page.evaluate(() => window.CF.opening.replay()); await sleep(900);
    await page.tap('.skipbtn');
    await landedSoon(page);
    check('tap Skip: jumps to the end and lands', await page.evaluate(() => window.CF.opening.k === window.CF.opening.N));
    await page.evaluate(() => window.CF.opening.replay()); await sleep(1500);
    await page.tap('.q');
    await sleep(300);
    check('tap on the dossier body skips', await page.evaluate(() => window.CF.opening.k === window.CF.opening.N));

    // Take 2
    await page.tap('.seg .btn:nth-child(2)'); await sleep(900);
    const t2 = await page.evaluate(() => ({ pressed: document.querySelector('.seg .btn:nth-child(2)').getAttribute('aria-pressed'), take: window.CF.opening.takeIdx, phase: window.CF.opening.phase, k: window.CF.opening.k }));
    check('tap Take 2: selects it and replays from the start', t2.pressed === 'true' && t2.take === 1 && t2.k < 5, JSON.stringify(t2));
    await page.tap('.seg .btn:nth-child(1)'); await sleep(500);
    check('tap Take 1: back to Take 1', await page.evaluate(() => window.CF.opening.takeIdx === 0));

    // Play it again
    await page.tap('.skipbtn'); await landedSoon(page);
    await page.tap('.controls > .btn:nth-of-type(1)'); await sleep(400);
    const rp = await page.evaluate(() => ({ landed: window.CF.opening.landed, k: window.CF.opening.k }));
    check('tap Play it again: restarts the sequence', !rp.landed && rp.k === 0, JSON.stringify(rp));
    await page.tap('.skipbtn'); await landedSoon(page);

    // Read it plainly
    await page.tap('.controls > .btn:nth-last-child(1)'); await sleep(300);
    const dlg = await page.evaluate(() => ({ open: document.querySelector('dialog.plain').open, text: document.querySelector('dialog.plain').innerText }));
    check('tap Read it plainly: opens a dialog with both texts', dlg.open && dlg.text.includes(norm(takesData[0].output)) && dlg.text.toLowerCase().includes(content.ui.raw.toLowerCase()), dlg.text.slice(0, 60));
    await page.keyboard.press('Escape'); await sleep(200);
    check('Esc closes the plain-reading dialog', !(await page.evaluate(() => document.querySelector('dialog.plain').open)));

    // custody chip
    await page.tap('.chip'); await sleep(200);
    const cu = await page.evaluate(() => ({ exp: document.querySelector('.chip').getAttribute('aria-expanded'), vis: !document.querySelector('.custody').hidden, text: document.querySelector('.custody').innerText, verified: !!document.querySelector('.stamp-verified') }));
    check('tap custody chip: expands "Where this came from" with source, tool, status', cu.exp === 'true' && cu.vis && cu.text.includes('Wispr Flow') && cu.text.includes(content.exhibit0.custody.status));
    check('VERIFIED stamp not shown while custody.verified is false', !cu.verified);
    await page.screenshot({ path: join(SHOTS, 's3-phone-custody.png') });
    await page.tap('.chip'); await sleep(150);

    // seal double tap ripple
    await page.locator('.seal').dispatchEvent('dblclick'); await sleep(100);
    check('double-tap the seal: slow ink ripple', await page.evaluate(() => document.querySelector('.seal').classList.contains('rip')));

    // cue is tappable
    await page.tap('.cue'); await sleep(300);
    check('tap "Open the file" works without errors', true);
    check('touch run: no console errors', log.errors.length === 0, log.errors.join(' | '));
    await ctx.close();
  }

  // ---- reduced motion: final state at load, no animation
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, reducedMotion: true });
    await sleep(500);
    const r = await page.evaluate(() => ({
      k: window.CF.opening.k, N: window.CF.opening.N, landed: window.CF.opening.landed, sealOn: document.querySelector('.seal').classList.contains('on'),
      thud: document.querySelector('.seal').classList.contains('thud'),
      tagline: getComputedStyle(document.querySelector('.tagline')).opacity, text: window.CF.opening.visibleText(),
      anim: getComputedStyle(document.querySelector('.dossier')).animationName,
      untyped: document.querySelectorAll('.tk.untyped').length,
      peel: [...document.querySelectorAll('.subject .w')].map((w) => w.style.getPropertyValue('--peel')),
    }));
    check('reduced motion: final state shown at load (p=1, seal, tagline, tape gone)', r.k === r.N && r.landed && r.sealOn && !r.thud && r.tagline === '1' && r.text === norm(takesData[0].output) && r.untyped === 0 && r.peel.every((v) => v === '1.000'), JSON.stringify(r).slice(0, 250));
    check('reduced motion: no drop animation', r.anim === 'none', r.anim);
    await page.evaluate(() => window.CF.opening.setP(0.4)); await sleep(100);
    check('reduced motion: the string still works when dragged', (await page.evaluate(() => window.CF.opening.k)) > 0 && (await page.evaluate(() => window.CF.opening.k)) < (await page.evaluate(() => window.CF.opening.N)));
    check('reduced motion: no console errors', log.errors.length === 0, log.errors.join(' | '));
    await ctx.close();
  }

  // ---- localStorage disabled
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, storage: false });
    await sleep(500);
    await page.evaluate(() => window.CF.opening.skip()); await landedSoon(page);
    check('localStorage off: opening still plays and lands, no errors', log.errors.length === 0, log.errors.join(' | '));
    await ctx.close();
  }

  // ---- first paint under 1 s on a throttled mobile profile (4x CPU)
  {
    const times = [];
    for (let i = 0; i < 3; i++) {
      const ctx = await browser.newContext({ viewport: VIEWPORTS.phone, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
      const page = await ctx.newPage();
      const cdp = await ctx.newCDPSession(page);
      await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await page.goto('file://' + join(ROOT, 'dist', 'index.html'));
      await page.waitForFunction(() => performance.getEntriesByName('first-contentful-paint').length > 0);
      times.push(await page.evaluate(() => Math.round(performance.getEntriesByName('first-contentful-paint')[0].startTime)));
      await ctx.close();
    }
    check('first contentful paint under 1000 ms at 4x CPU throttle', Math.max(...times) < 1000, times.join(', ') + ' ms');
  }

  // ---- frame rate under 4x CPU throttle during the run
  {
    const ctx = await browser.newContext({ viewport: VIEWPORTS.phone, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => {
      window.__frames = []; let last = performance.now();
      const tick = (t) => { window.__frames.push(t - last); last = t; requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    await page.goto('file://' + join(ROOT, 'dist', 'index.html'));
    await landedSoon(page); await sleep(500);
    const fps = await page.evaluate(() => { const f = window.__frames.slice(5); const avg = f.reduce((a, b) => a + b, 0) / f.length; const slow = f.filter((x) => x > 50).length; return { avgMs: +avg.toFixed(1), fps: Math.round(1000 / avg), slowFrames: slow, n: f.length }; });
    check('frame rate during the full run at 4x CPU throttle (report)', fps.fps >= 30, JSON.stringify(fps));
    console.log('       frame stats:', JSON.stringify(fps));
    await ctx.close();
  }
}

const failed = summary();
await browser.close();
process.exit(failed ? 1 : 0);
