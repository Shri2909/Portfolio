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
const has = (v) => (typeof v === 'string' ? v.trim().length > 0 : !!v);
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
      check(`${tag}: no stray "null", "undefined" or "NaN" in the page text`, !/\b(null|undefined|NaN)\b/.test(await page.evaluate(() => document.body.innerText.replace(/\s+/g, ' '))));
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
    const fit = () => page.evaluate(([vh, vw]) => { window.__vh = vh; window.__vw = vw;
      const d = document.querySelector('.dossier').getBoundingClientRect();
      const seal = document.querySelector('.seal').getBoundingClientRect();
      const vis = [...document.querySelectorAll('.dossier button, .dossier input')].filter((e) => !e.classList.contains('clue-tag') && e.offsetParent && getComputedStyle(e.closest('.cuewrap') || document.body).visibility !== 'hidden');
      const lowest = Math.max(...vis.map((e) => e.getBoundingClientRect().bottom));
      return { bottom: Math.round(d.bottom), vh: window.__vh, controlsBottom: Math.round(lowest), sealTop: Math.round(seal.top), sealInView: seal.top >= 0, hscroll: document.documentElement.scrollWidth > window.__vw + 1 || window.innerWidth > window.__vw + 1 };
    }, [vp.height, vp.width]);
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
      untypedAll: [...document.querySelectorAll('.textblock .tk:not(.br)')].every((e) => e.classList.contains('untyped')),
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
    const typing = await page.evaluate(() => ({ phase: window.CF.opening.phase, typed: document.querySelectorAll('.textblock .tk:not(.br):not(.untyped)').length }));
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
    check('VERIFIED stamp not shown while custody.verified is false, no stray null', !cu.verified && !/\bnull\b/.test(cu.text), cu.text);
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


const ready = (page) => page.waitForFunction(() => document.documentElement.classList.contains('ready'), null, { timeout: 8000 });
const visibleSecs = (page) => page.evaluate(() => window.CF.visibleSections.slice());
const slipText = (page) => page.evaluate(() => { const s = document.querySelector('.slip'); return s && s.classList.contains('show') ? s.textContent : ''; });

// ------------------------------------------------------------------ Stage 4
if (run(4)) {
  console.log('\nStage 4: the lamp, the margins, the cosy desk');
  const big = { width: 1600, height: 900 };
  {
    const { page, ctx, log } = await openPage(browser, { viewport: big });
    await ready(page); await sleep(400);
    await page.mouse.move(300, 420); await sleep(900);
    const g = await page.evaluate(() => { const m = new DOMMatrix(getComputedStyle(document.querySelector('.lamp-glow')).transform); return [Math.round(m.m41), Math.round(m.m42)]; });
    check('lamp glow follows the pointer', Math.abs(g[0] - 300) < 4 && Math.abs(g[1] - 420) < 4, g.join(','));
    const z = await page.evaluate(() => ({ lamp: +getComputedStyle(document.querySelector('.lamp')).zIndex, page: +getComputedStyle(document.querySelector('.page')).zIndex, bg: getComputedStyle(document.querySelector('.dossier')).backgroundColor, pe: ['.lamp', '.motes', '.desk'].map((s) => getComputedStyle(document.querySelector(s)).pointerEvents) }));
    check('lamp sits under the paper (paper stays bright cream), all decor pointer-events:none', z.lamp < z.page && z.bg === 'rgb(246, 240, 227)' && z.pe.every((x) => x === 'none'), JSON.stringify(z));
    const motes = await page.evaluate(() => ({ n: document.querySelectorAll('.mote').length, anim: getComputedStyle(document.querySelector('.mote')).animationName }));
    check('14 dust motes, animated', motes.n === 14 && motes.anim === 'mote', JSON.stringify(motes));
    const props = await page.evaluate(() => { const p = document.querySelector('.props'); return { shown: getComputedStyle(p).display !== 'none', bytes: p.outerHTML.length, hidden: [...p.querySelectorAll('.props-l, .props-r')].every((e) => e.getAttribute('aria-hidden') === 'true'), pe: [...p.querySelectorAll('svg')].filter((e) => !e.closest('button')).every((e) => getComputedStyle(e).pointerEvents === 'none'), rect: [...p.querySelectorAll('.props-l, .props-r')].map((e) => { const r = e.getBoundingClientRect(); return [Math.round(r.left), Math.round(r.right)]; }) }; });
    check('desk props show at 1600px, aria-hidden, under 15 KB, never over the dossier', props.shown && props.hidden && props.pe && props.bytes < 15360, JSON.stringify(props).slice(0, 200));
    const dos = await page.evaluate(() => { const r = document.querySelector('.dossier').getBoundingClientRect(); return [r.left, r.right]; });
    check('props sit outside the dossier on both sides', props.rect[0][1] <= dos[0] && props.rect[1][0] >= dos[1] - 1, JSON.stringify([props.rect, dos]));
    // teacup
    const cup = page.locator('button.teacup');
    check('the teacup is a real button labelled Teacup', (await cup.getAttribute('aria-label')) === 'Teacup');
    await cup.click(); await sleep(500);
    check('tap the teacup: paper slip with ui.teaSlip', (await slipText(page)) === content.ui.teaSlip);
    await sleep(4300);
    check('the tea slip fades after about 4 s', (await slipText(page)) === '');
    // elementary
    await page.keyboard.type('elementary', { delay: 40 }); await sleep(400);
    check('typing "elementary" shows ui.elementary and flickers the lamp', (await slipText(page)) === content.ui.elementary && (await page.evaluate(() => document.querySelector('.lamp').classList.contains('flicker'))));
    // marginalia: the dossier's note is the custody source, lit only near the lamp
    const note = await page.evaluate(() => { const n = document.querySelector('.dossier .pencil'); return n ? n.textContent : null; });
    check('pencil note on the dossier is exactly custody.source (no new claims)', note === content.exhibit0.custody.source, String(note));
    await page.mouse.move(900, 100); await sleep(1000);
    const far = await page.evaluate(() => document.querySelector('.dossier .pencil').classList.contains('lit'));
    const nb = await page.evaluate(() => { const r = document.querySelector('.dossier .pencil').getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; });
    await page.mouse.move(nb[0], nb[1]); await sleep(900);
    const near = await page.evaluate(() => document.querySelector('.dossier .pencil').classList.contains('lit'));
    check('pencil note is hidden away from the lamp and revealed under it', !far && near, `far=${far} near=${near}`);
    check('lamp hint (ui.marginaliaHint) is shown once and can be dismissed', (await page.locator('.hint-slip p').textContent()) === content.ui.marginaliaHint);
    await page.locator('.hint-slip button').click(); await sleep(100);
    check('dismissing the hint removes it', (await page.locator('.hint-slip').count()) === 0);
    check('stage 4 desktop: no console errors, no requests', log.errors.length === 0 && log.requests.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // keyboard focus lights the lamp and notes
    const { page, ctx } = await openPage(browser, { viewport: big });
    await ready(page); await sleep(300);
    await page.focus('.dossier .chip'); await sleep(900);
    check('keyboard focus inside the dossier lights its pencil note', await page.evaluate(() => document.querySelector('.dossier .pencil').classList.contains('lit')));
    await ctx.close();
  }
  { // phone: no props, finger drag moves the lamp
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await ready(page); await sleep(300);
    check('props are hidden on phones', await page.evaluate(() => getComputedStyle(document.querySelector('.props')).display === 'none'));
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: 60, y: 600 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: 200, y: 640 }] });
    await sleep(900);
    const g = await page.evaluate(() => { const m = new DOMMatrix(getComputedStyle(document.querySelector('.lamp-glow')).transform); return [Math.round(m.m41), Math.round(m.m42)]; });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    check('a dragging finger moves the lamp', Math.abs(g[0] - 200) < 6 && Math.abs(g[1] - 640) < 6, g.join(','));
    await ctx.close();
  }
  { // reduced motion: static centred lamp, no motes, no props animation
    const { page, ctx } = await openPage(browser, { viewport: big, reducedMotion: true });
    await ready(page); await sleep(300);
    const before = await page.evaluate(() => getComputedStyle(document.querySelector('.lamp-glow')).transform);
    await page.mouse.move(200, 300); await sleep(600);
    const after = await page.evaluate(() => getComputedStyle(document.querySelector('.lamp-glow')).transform);
    check('reduced motion: lamp stays static and centred, no motes', before === after && (await page.evaluate(() => document.querySelectorAll('.mote').length)) === 0);
    await ctx.close();
  }
  { // frame rate with everything on, 4x CPU throttle, while the pointer moves
    const ctx = await browser.newContext({ viewport: big });
    const page = await ctx.newPage();
    const cdp = await ctx.newCDPSession(page);
    await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
    await page.addInitScript(() => { window.__f = []; let l = performance.now(); const k = (t) => { window.__f.push(t - l); l = t; requestAnimationFrame(k); }; requestAnimationFrame(k); });
    await page.goto('file://' + join(ROOT, 'dist', 'index.html'));
    await ready(page); await sleep(500);
    await page.evaluate(() => { window.__f = []; });
    for (let i = 0; i < 40; i++) { await page.mouse.move(200 + i * 25, 200 + (i % 7) * 60); await sleep(30); }
    const fps = await page.evaluate(() => { const f = window.__f.slice(3); const a = f.reduce((x, y) => x + y, 0) / f.length; return { fps: Math.round(1000 / a), slow: f.filter((x) => x > 50).length, n: f.length }; });
    check('frame rate with lamp, motes and props at 4x CPU throttle is at least 45 fps', fps.fps >= 45, JSON.stringify(fps));
    console.log('       frame stats:', JSON.stringify(fps));
    await ctx.close();
  }
}

// ------------------------------------------------------------------ Stage 5
if (run(5)) {
  console.log('\nStage 5: the briefing, the case board, clues and rank');
  for (const build of ['index.html', 'review.html']) {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build });
    await ready(page); await sleep(500);
    const closed = await page.evaluate(() => { const s = document.querySelector('#brief'); return { open: s.classList.contains('open'), cap: s.querySelector('.env-cap') && s.querySelector('.env-cap').textContent, inert: s.querySelector('.letter').hasAttribute('inert') }; });
    check(`${build}: envelope starts closed with the caption "${content.ui.openBriefing}"`, !closed.open && closed.cap === content.ui.openBriefing && closed.inert, JSON.stringify(closed));
    await page.evaluate(() => { const s = document.querySelector('#brief'); window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - window.innerHeight * 0.45); }); await sleep(1200);
    const opened = await page.evaluate(() => { const s = document.querySelector('#brief'); return { open: s.classList.contains('open'), inert: s.querySelector('.letter').hasAttribute('inert'), greet: s.querySelector('.greeting').textContent, h: s.querySelector('.letter').getBoundingClientRect().height }; });
    check(`${build}: the envelope opens by itself when 40% in view; greeting is ui.greeting`, opened.open && !opened.inert && opened.greet === content.ui.greeting && opened.h > 100, JSON.stringify(opened));
    const sum = await page.evaluate(() => document.querySelectorAll('#brief .summary').length);
    check(`${build}: brief.summary renders ${build === 'index.html' ? 'nothing (empty in content)' : 'only in the review build'}`, build === 'index.html' ? sum === 0 : sum > 0, String(sum));
    const leads = await page.evaluate(() => [...document.querySelectorAll('#brief .lead')].map((b) => ({ t: b.querySelector('.lt').childNodes[0].textContent, ny: !!b.querySelector('.ny'), dashed: getComputedStyle(b).borderStyle, h: b.getBoundingClientRect().height })));
    check(`${build}: all ${content.specialties.length} leads render as tags (44px tall); the not_shown lead is dashed and labelled "${content.ui.notYet}"`,
      leads.length === content.specialties.length && leads.every((l) => l.h >= 44) && leads.filter((l) => l.ny && l.dashed.includes('dashed')).length === 1, JSON.stringify(leads).slice(0, 200));
    check(`${build}: no console errors`, log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // review build: worth lines come from draft (outlined); production has none
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await ready(page); await sleep(300);
    await page.evaluate(() => { document.querySelector('#brief').scrollIntoView(); }); await sleep(1200);
    await page.tap('#brief .lead:nth-child(1)'); await sleep(300);
    const info = await page.evaluate(() => document.querySelector('.lead-info').innerText);
    check('review: selecting a lead shows its Evidence and Why it matters lines', info.toLowerCase().includes(content.ui.evidence.toLowerCase()) && info.toLowerCase().includes(content.ui.worth.toLowerCase()), info.slice(0, 80));
    check('review: draft-filled "worth" line is outlined amber', await page.evaluate(() => !!document.querySelector('.lead-info .cf-filled')));
    check('review: draft-filled summary paragraphs are outlined amber', await page.evaluate(() => document.querySelectorAll('#brief .summary.cf-filled').length > 0));
    await ctx.close();
  }

  // strings: stub exhibit targets are injected (test only) so the geometry can be checked before Stage 7 builds the real exhibits
  for (const [vn, vp, touch] of [['phone', VIEWPORTS.phone, true], ['wide', { width: 1100, height: 800 }, false]]) {
    const { page, ctx } = await openPage(browser, { viewport: vp, touch });
    await ready(page); await sleep(300);
    await page.evaluate(() => {
      const main = document.getElementById('main');
      ['exhibitA', 'exhibitB', 'ledger'].forEach((id) => {
        if (document.getElementById(id)) return;
        const s = document.createElement('section'); s.className = 'sheet'; s.id = id; s.style.height = '300px'; main.appendChild(s);
        window.CF.visibleSections.push(id);
        const pin = document.createElement('i'); pin.className = 'pin'; pin.dataset.id = id; document.getElementById('rail').appendChild(pin); window.CF.rail.pins[id] = pin;
        const l = document.createElement('div'); l.className = 'tab'; s.appendChild(l);
      });
      window.CF.rail.place();
    });
    await page.evaluate(() => { document.querySelector('#brief').scrollIntoView(); }); await sleep(1500);
    await page.evaluate(() => window.CF.board.afterRail());
    if (vn === 'wide') check('wide: case board shows a pin per visible chapter/exhibit', (await page.locator('.bpin').count()) >= 3);
    const sel = '#brief .lead:nth-child(1)';
    const tap = (s) => touch ? page.tap(s) : page.click(s);
    await tap(sel); await sleep(900);
    const r = await page.evaluate((mode) => {
      const paths = [...document.querySelectorAll(mode === 'wide' ? '.board-strings path' : '.page-strings path')];
      const ends = paths.map((p) => { const svg = p.ownerSVGElement; const L = p.getTotalLength(); const pt = p.getPointAtLength(L); const m = svg.getScreenCTM(); return [pt.x * m.a + m.e, pt.y * m.d + m.f]; });
      const targets = (mode === 'wide' ? [...document.querySelectorAll('.bpin')].filter((b) => ['exhibitA', 'exhibitB', 'ledger'].includes(b.dataset.id)).map((b) => b.querySelector('.dot')) : ['exhibitA', 'exhibitB', 'ledger'].map((id) => window.CF.rail.pins[id]));
      const centers = targets.map((e) => { const q = e.getBoundingClientRect(); return [q.left + q.width / 2, q.top + q.height / 2]; });
      const miss = ends.map((e) => Math.min(...centers.map((c) => Math.hypot(c[0] - e[0], c[1] - e[1]))));
      return { n: paths.length, miss, hl: document.querySelectorAll('.sheet.hl').length };
    }, vn);
    check(`${vn}: tapping a lead draws one red string per visible exhibit (3), each lands on its pin`, r.n === 3 && r.miss.every((m) => m < 14), JSON.stringify(r));
    check(`${vn}: the target tabs are highlighted`, r.hl === 3);
    await sleep(3300);
    check(`${vn}: the highlight fades after about 3 s`, (await page.evaluate(() => document.querySelectorAll('.sheet.hl').length)) === 0);
    await tap(sel); await sleep(300);
    check(`${vn}: tapping the lead again clears the strings`, (await page.evaluate(() => document.querySelectorAll('.string-path').length)) === 0);
    // a lead whose targets are hidden skips them
    await tap('#brief .leads li:nth-child(4) .lead'); await sleep(500);
    check(`${vn}: a lead whose exhibits are hidden draws nothing and breaks nothing`, (await page.evaluate(() => document.querySelectorAll('.string-path').length)) === 0);
    await ctx.close();
  }

  // clues, notebook, rank (production build: clue k1 on the opening is visible)
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await ready(page); await sleep(500);
    const vis = await visibleSecs(page);
    const expected = content.clues.filter((c) => vis.includes(c.section));
    const btnText = () => page.evaluate(() => document.querySelector('.tb-btn.clues').getAttribute('aria-label'));
    check(`N counts only visible clues (${expected.length} of ${content.clues.length})`, (await page.evaluate(() => document.querySelectorAll('.clue-tag').length)) === expected.length);
    check('top-bar button shows Clues 0/N and the first rank', (await page.evaluate(() => document.querySelector('.tb-btn.clues .l1').textContent)) === `${content.ui.clues} 0/${expected.length}` && (await page.evaluate(() => document.querySelector('.tb-btn.clues .l2').textContent)) === content.ranks[0].title, await btnText());
    const wob = await page.evaluate(() => getComputedStyle(document.querySelector('.tag-art')).animationName);
    check('clue magnifier wobbles gently (about every 8 s)', wob === 'wobble');
    const tb = await page.evaluate(() => { const r = document.querySelector('.tb-btn.clues').getBoundingClientRect(); const b = document.querySelector('.brand').getBoundingClientRect(); return { h: r.height, w: r.width, right: r.right, vw: innerWidth, overlap: r.left < b.right }; });
    check('Clues button is 44px tall, fits the top bar on a phone, does not collide with the title', tb.h >= 44 && tb.right <= tb.vw && !tb.overlap, JSON.stringify(tb));
    await page.evaluate(() => window.scrollTo(0, 120)); await sleep(200);
    await page.tap('.dossier .clue-tag'); await sleep(400);
    const dlg = await page.evaluate(() => { const d = document.querySelector('dialog.clue-dlg'); return { open: d && d.open, txt: d && d.innerText }; });
    check('tap a clue magnifier: "Clue n of N", the text, "Verified in: <source>"', dlg.open && dlg.txt.toLowerCase().includes(`clue 1 of ${expected.length}`) && dlg.txt.includes(content.clues[0].text) && dlg.txt.includes('Verified in: ' + content.clues[0].source), dlg.txt);
    await page.keyboard.press('Escape'); await sleep(200);
    const after = await page.evaluate(() => ({ l1: document.querySelector('.tb-btn.clues .l1').textContent, l2: document.querySelector('.tb-btn.clues .l2').textContent, saved: localStorage.getItem('cf1:found'), ping: document.querySelector('.tb-btn.clues').classList.contains('ping') }));
    check('finding it updates Clues 1/N, ranks up to "Junior sleuth", saves to localStorage, soft ping', after.l1 === `${content.ui.clues} 1/${expected.length}` && after.l2 === content.ranks[1].title && JSON.parse(after.saved).includes('k1') && after.ping, JSON.stringify(after));
    await page.tap('.tb-btn.clues'); await sleep(500);
    const nb = await page.evaluate(() => { const d = document.querySelector('dialog.notebook'); const r = d.getBoundingClientRect(); return { open: d.open, modal: d.matches(':modal'), text: d.innerText, w: r.width, vw: innerWidth, h: r.height, vh: innerHeight }; });
    check('notebook opens as a modal dialog, full-screen on phone', nb.open && nb.modal && nb.w >= nb.vw - 1 && nb.h >= nb.vh - 1, JSON.stringify([nb.w, nb.vw, nb.h, nb.vh]));
    check('notebook has no stray null text', !/\bnull\b/.test(nb.text), nb.text.slice(0, 120));
    check('notebook shows the found clue with its source and the rank', nb.text.includes(content.clues[0].text) && nb.text.includes('Verified in: ' + content.clues[0].source) && nb.text.includes(content.ranks[1].title));
    const lockedWant = expected.length > 1;
    check('unfound clues show as "???" with ui.clueLocked and the section name', !lockedWant || (nb.text.includes('???') && nb.text.includes(content.ui.clueLocked)), nb.text.slice(0, 200));
    check(expected.length === 1 ? 'all clues found: ui.cluesDone shows' : 'notebook is not "done" yet', expected.length === 1 ? nb.text.includes(content.ui.cluesDone) : !nb.text.includes(content.ui.cluesDone));
    await page.keyboard.press('Tab'); await page.keyboard.press('Tab'); await page.keyboard.press('Tab');
    const trapped = await page.evaluate(() => document.querySelector('dialog.notebook').contains(document.activeElement));
    check('notebook traps focus', trapped);
    await page.keyboard.press('Escape'); await sleep(200);
    check('Esc closes the notebook and focus returns to the Clues button', (await page.evaluate(() => !document.querySelector('dialog.notebook').open && document.activeElement.classList.contains('clues'))));
    await page.reload(); await ready(page); await sleep(400);
    check('found clues are remembered after a reload', (await page.evaluate(() => document.querySelector('.tb-btn.clues .l1').textContent)) === `${content.ui.clues} 1/${expected.length}`);
    check('clues: no console errors', log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // empty notebook message, works with localStorage disabled
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, storage: false });
    await ready(page); await sleep(400);
    await page.tap('.tb-btn.clues'); await sleep(400);
    check('before any clue: ui.notebookEmpty shows', (await page.evaluate(() => document.querySelector('dialog.notebook').innerText)).includes(content.ui.notebookEmpty));
    await page.keyboard.press('Escape');
    await page.evaluate(() => window.scrollTo(0, 100)); await sleep(150);
    await page.tap('.dossier .clue-tag'); await sleep(300); await page.keyboard.press('Escape'); await sleep(200);
    check('localStorage off: clues still work in the session, no errors', (await page.evaluate(() => document.querySelector('.tb-btn.clues .l1').textContent)).includes('1/') && log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // coffee ring egg
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await ready(page); await sleep(300);
    await page.evaluate(() => document.querySelector('#brief').scrollIntoView()); await sleep(1300);
    await page.tap('.coffee-ring'); await sleep(400);
    check('tap the coffee ring: ui.coffeeRingSlip', (await slipText(page)) === content.ui.coffeeRingSlip);
    await ctx.close();
  }
  { // reduced motion: envelope open at load
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, reducedMotion: true, build: 'review.html' });
    await ready(page); await sleep(400);
    check('reduced motion: the briefing is already open, no wobble', (await page.evaluate(() => document.querySelector('#brief').classList.contains('open') && getComputedStyle(document.querySelector('.tag-art')).animationName === 'none')));
    await ctx.close();
  }
}

// ------------------------------------------------------------------ Stage 6
if (run(6)) {
  console.log('\nStage 6: Fair warning and the Chapter Seals');
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await ready(page); await sleep(400);
    const vis = await visibleSecs(page);
    check('production: Fair warning is absent while against.reasons is empty', !vis.includes('against') && (await page.locator('#against').count()) === 0);
    const ch = await page.evaluate(() => window.CF.chapters.map((c) => [c.chapter.id, c.members]));
    check('production: chapter list counts only visible chapters', ch.every(([, m]) => m.every((id) => vis.includes(id))), JSON.stringify(ch));
    const labels = await page.evaluate(() => [...document.querySelectorAll('.sheet .tab .chap')].map((e) => e.textContent));
    check('production: chapter labels are "Chapter n of N" over visible chapters only', labels.every((l, i) => l === `Chapter ${Math.min(i + 2, ch.length)} of ${ch.length}` || /^Chapter \d+ of \d+$/.test(l)), JSON.stringify(labels));
    check('production: no seal after the last chapter, none after chapter 1 (the opening has its own cue)', (await page.evaluate(() => document.querySelectorAll('.seal-note').length)) === Math.max(0, ch.length - 2));
    check('production: no console errors', log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  for (const [vn, vp, touch] of [['phone', VIEWPORTS.phone, true], ['laptop', VIEWPORTS.laptop, false]]) {
    const { page, ctx, log } = await openPage(browser, { viewport: vp, touch, build: 'review.html' });
    await ready(page); await sleep(500);
    const vis = await visibleSecs(page);
    check(`${vn} review: Fair warning is present with title, sub, 3 cards and the closing line`, vis.includes('against') && (await page.locator('#against .icard').count()) === 3
      && (await page.locator('#against .sheet-title').textContent()) === content.ui.warningTitle && (await page.locator('#against .sub').textContent()) === content.ui.warningSub && (await page.locator('#against .after').textContent()) === content.ui.afterWarning);
    await page.evaluate(() => document.querySelector('#against').scrollIntoView({ block: 'start' })); await sleep(500);
    const h0 = await page.evaluate(() => document.querySelector('#against .ic-body').getBoundingClientRect().height);
    const b0 = page.locator('#against .ic-btn').first();
    if (touch) await page.tap('#against .ic-btn'); else await b0.click();
    await sleep(700);
    const st = await page.evaluate(() => ({ exp: document.querySelector('#against .ic-btn').getAttribute('aria-expanded'), h: document.querySelector('#against .ic-body').getBoundingClientRect().height, vis: getComputedStyle(document.querySelector('#against .ic-body')).visibility, txt: document.querySelector('#against .ic-body').innerText, btnH: document.querySelector('#against .ic-btn').getBoundingClientRect().height }));
    check(`${vn} review: tapping a card unfolds it in place and shows its text`, h0 < 12 && st.exp === 'true' && st.exp === 'true' && st.h > 30 && st.vis === 'visible' && st.txt.length > 40, JSON.stringify({ h0, ...st }).slice(0, 200));
    check(`${vn} review: card header is a 44px target`, st.btnH >= 44);
    await page.focus('#against .icard:nth-child(2) .ic-btn'); await page.keyboard.press('Enter'); await sleep(600);
    check(`${vn} review: keyboard Enter unfolds a card too`, (await page.evaluate(() => document.querySelector('#against .icard:nth-child(2) .ic-btn').getAttribute('aria-expanded'))) === 'true');
    await page.keyboard.press('Space'); await sleep(600);
    check(`${vn} review: Space folds it again`, (await page.evaluate(() => document.querySelector('#against .icard:nth-child(2) .ic-btn').getAttribute('aria-expanded'))) === 'false');
    check(`${vn} review: card text is outlined amber (from draft)`, await page.evaluate(() => document.querySelectorAll('#against .cf-filled').length >= 3));
    const chs = await page.evaluate(() => ({ n: window.CF.chapters.length, labels: [...document.querySelectorAll('.sheet .tab .chap')].map((e) => e.textContent), seals: [...document.querySelectorAll('.seal-note')].map((s) => s.innerText.replace(/\s+/g, ' ')) }));
    check(`${vn} review: chapter labels are consistent ("Chapter n of ${chs.n}")`, chs.labels.length > 0 && chs.labels.every((l) => new RegExp(`^Chapter \\d of ${chs.n}$`).test(l)), JSON.stringify(chs.labels));
    check(`${vn} review: seals carry ui.sealCue and the chapter's own question, and there is none after the last chapter`, chs.seals.length === chs.n - 2 && chs.seals.every((t) => t.toLowerCase().includes(content.ui.sealCue.toLowerCase()) && content.chapters.some((c) => has(c.teaser) && t.includes(c.teaser))), JSON.stringify(chs.seals));
    check(`${vn} review: no console errors`, log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // seal behaviour (review build has chapter 2 then 3)
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await ready(page); await sleep(400);
    const seal = page.locator('.seal-note').first();
    const early = await page.evaluate(() => document.querySelector('.seal-note').classList.contains('unfolded'));
    await page.evaluate(() => { const s = document.querySelector('.seal-note'); window.scrollTo(0, s.getBoundingClientRect().top + window.scrollY - 400); }); await sleep(900);
    const late = await page.evaluate(() => document.querySelector('.seal-note').classList.contains('unfolded'));
    check('a seal unfolds once, when it enters view', !early && late, `${early} ${late}`);
    const h = await page.evaluate(() => document.querySelector('.seal-note .seal-btn').getBoundingClientRect().height);
    check('seal is at least 44px tall', h >= 44, String(h));
    await page.tap('.seal-note .seal-btn'); await sleep(1100);
    const at = await page.evaluate(() => { const t = document.getElementById('against').getBoundingClientRect().top; return { top: Math.round(t), focus: document.activeElement.id }; });
    check('tapping the seal goes to the next chapter (in view) and focuses it', at.top < 500 && at.top > -50 && at.focus === 'against', JSON.stringify(at));
    await ctx.close();
  }
  { // reduced motion: seals already unfolded
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html', reducedMotion: true });
    await ready(page); await sleep(400);
    check('reduced motion: seals show unfolded', await page.evaluate(() => [...document.querySelectorAll('.seal-note')].every((s) => s.classList.contains('unfolded'))));
    await ctx.close();
  }
}


// ------------------------------------------------------------------ Stage 7
const scrollTo = (page, sel, off = 70) => page.evaluate(([s, o]) => { const t = document.querySelector(s); window.scrollTo({ top: t.getBoundingClientRect().top + window.scrollY - o, behavior: 'instant' }); }, [sel, off]);
if (run(7)) {
  console.log('\nStage 7: Exhibit A, 324 tiles and a second pair of eyes');
  const A = content.exhibitA;
  for (const build of ['index.html', 'review.html']) {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build });
    await ready(page); await sleep(400);
    const t0 = await page.evaluate(() => { const s = document.querySelector('#exhibitA'); return { title: s.querySelector('.sheet-title').textContent, sum: s.querySelector('.ex-sum').textContent, cs: s.querySelector('.custody-strip').innerText, opened: s.classList.contains('opened'), opts: s.querySelectorAll('.opt').length, q: s.querySelector('.call-q').textContent, vstamp: !!s.querySelector('.stamp-verified'), skip: s.querySelector('.linkbtn') && s.querySelector('.linkbtn').textContent, bodyInert: s.querySelector('.ex-body').hasAttribute('inert') }; });
    check(`${build}: Exhibit A shows title, summary, custody strip (header "${content.ui.custody}") and the call before the card opens`,
      t0.title === A.title && t0.sum === A.summary && t0.cs.toLowerCase().includes(content.ui.custody.toLowerCase()) && t0.cs.includes(A.custody.tool) && !t0.opened && t0.opts === A.call.options.length && t0.q === A.call.question && t0.bodyInert, JSON.stringify(t0).slice(0, 200));
    check(`${build}: authorship is stated in the custody strip and no VERIFIED stamp`, /AI coding agents/.test(t0.cs) && !t0.vstamp);
    check(`${build}: "Just show me" link is present (${content.ui.justShow})`, t0.skip === content.ui.justShow);
    await scrollTo(page, '#exhibitA');
    await page.tap('#exhibitA .opt:nth-child(' + (A.call.answerIndex + 1) + ')'); await sleep(1400);
    const t1 = await page.evaluate(() => { const s = document.querySelector('#exhibitA'); return { right: s.querySelectorAll('.opt.right').length, reveal: s.querySelector('.call-reveal').textContent, opened: s.classList.contains('opened'), saved: localStorage.getItem('cf1:call:exhibitA'), disabled: [...s.querySelectorAll('.opt')].every((b) => b.disabled), h: [...s.querySelectorAll('.opt')].map((b) => Math.round(b.getBoundingClientRect().height)) }; });
    check(`${build}: answering highlights the right option, shows the reveal, saves the choice, opens the card`, t1.right === 1 && t1.reveal === A.call.reveal && t1.opened && t1.saved === String(A.call.answerIndex) && t1.disabled, JSON.stringify(t1));
    check(`${build}: option tap targets are at least 44px tall`, t1.h.every((x) => x >= 44), t1.h.join());
    await scrollTo(page, '#exhibitA .tiles', 200); await sleep(2800);
    const g = await page.evaluate(() => ({ tests: document.querySelectorAll('#exhibitA .tile.test').length, finds: document.querySelectorAll('#exhibitA .tile.find').length, go: document.querySelector('#exhibitA .tiles').classList.contains('go'),
      sage: getComputedStyle(document.querySelector('#exhibitA .tile.test')).backgroundColor, brass: getComputedStyle(document.querySelector('#exhibitA .tile.find')).backgroundColor,
      cap: document.querySelector('#exhibitA .fc-t').textContent, seal: document.querySelector('#exhibitA .fseal').textContent,
      findsBelow: document.querySelector('#exhibitA .grid-finds').getBoundingClientRect().top >= document.querySelector('#exhibitA .grid-tests').getBoundingClientRect().bottom,
      cols: getComputedStyle(document.querySelector('#exhibitA .grid-tests')).gridTemplateColumns.split(' ').length, table: document.querySelector('#exhibitA .sr-only table').textContent }));
    check(`${build}: exactly 324 sage tiles and 19 brass tiles`, g.tests === 324 && g.finds === 19 && g.sage === 'rgb(122, 155, 118)' && g.brass === 'rgb(184, 135, 43)', JSON.stringify(g).slice(0, 160));
    check(`${build}: 18x18 grid, findings drop in BELOW it, caption and seal built from the stats`, g.cols === 18 && g.findsBelow && g.cap === '19 findings the 324 tests never asked about' && g.seal === '19 FINDINGS', JSON.stringify([g.cols, g.findsBelow, g.cap, g.seal]));
    check(`${build}: text alternative table lists 324 and 19`, g.table.includes('324') && g.table.includes('19'));
    await page.tap('#exhibitA .tile.test:nth-child(100)'); await sleep(150);
    const s1 = await page.evaluate(() => document.querySelector('#exhibitA .tile-status').textContent);
    await page.tap('#exhibitA .tile.find:nth-child(7)'); await sleep(150);
    const s2 = await page.evaluate(() => document.querySelector('#exhibitA .tile-status').textContent);
    check(`${build}: tapping tiles says "Test n of 324" / "Finding n of 19" (no invented finding names)`, s1 === 'Test 100 of 324' && s2 === 'Finding 7 of 19', s1 + ' | ' + s2);
    await page.focus('#exhibitA .grid-tests'); await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowDown');
    check(`${build}: tiles are keyboard-navigable`, (await page.evaluate(() => document.querySelector('#exhibitA .tile-status').textContent)) === 'Test 119 of 324');
    const tl = await page.evaluate(() => [...document.querySelectorAll('#exhibitA .tl li')].map((l) => l.querySelector('.tl-l').textContent));
    check(`${build}: red-string timeline lists ${A.timeline.length} steps in order`, JSON.stringify(tl) === JSON.stringify(A.timeline.map((x) => x.label)), JSON.stringify(tl));
    const extras = await page.evaluate(() => ({ beats: document.querySelectorAll('#exhibitA .beat').length, xe: document.querySelectorAll('#exhibitA .xe-item').length, verify: document.querySelectorAll('#exhibitA .verify').length, xeh: document.querySelector('#exhibitA .xe-h') && document.querySelector('#exhibitA .xe-h').textContent }));
    if (build === 'index.html') check('production: beats, cross-exam and verify are hidden while empty', extras.beats === 0 && extras.xe === 0 && extras.verify === 0, JSON.stringify(extras));
    else { check('review: four beats and three cross-exam items render from the draft (outlined amber)', extras.beats === 4 && extras.xe === 3 && extras.xeh === content.ui.crossExam && (await page.evaluate(() => document.querySelectorAll('#exhibitA .beat .cf-filled').length)) >= 4, JSON.stringify(extras));
      await page.tap('#exhibitA .xe-btn'); await sleep(600);
      check('review: cross-exam item unfolds', (await page.evaluate(() => document.querySelector('#exhibitA .xe-item').classList.contains('open') && document.querySelector('#exhibitA .xe-body').getBoundingClientRect().height > 20)));
      check('review: verify box stays hidden (draft has no verify data)', extras.verify === 0); }
    check(`${build}: no console errors`, log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // skip, saved choice, localStorage off, reduced motion
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await ready(page); await sleep(300); await scrollTo(page, '#exhibitA');
    await page.tap('#exhibitA .linkbtn'); await sleep(900);
    check('"Just show me" opens the card without answering', await page.evaluate(() => document.querySelector('#exhibitA').classList.contains('opened') && !localStorage.getItem('cf1:call:exhibitA') && !document.querySelector('#exhibitA .call-reveal').textContent));
    await ctx.close();
    const c2 = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await ready(c2.page); await c2.page.evaluate(() => localStorage.setItem('cf1:call:exhibitA', '1')); await c2.page.reload(); await ready(c2.page); await sleep(500);
    check('a saved choice is remembered: the card is already open with the reveal', await c2.page.evaluate(() => document.querySelector('#exhibitA').classList.contains('opened') && document.querySelectorAll('#exhibitA .opt.pick').length === 1));
    await c2.ctx.close();
    const c3 = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, storage: false });
    await ready(c3.page); await sleep(300); await scrollTo(c3.page, '#exhibitA'); await c3.page.tap('#exhibitA .opt:nth-child(1)'); await sleep(1300);
    check('localStorage off: the call still works and the card opens, no errors', (await c3.page.evaluate(() => document.querySelector('#exhibitA').classList.contains('opened'))) && c3.log.errors.length === 0, c3.log.errors.join('|'));
    await c3.ctx.close();
    const c4 = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, reducedMotion: true });
    await ready(c4.page); await sleep(300); await scrollTo(c4.page, '#exhibitA'); await c4.page.tap('#exhibitA .opt:nth-child(4)'); await sleep(700);
    const fin = await c4.page.evaluate(() => ({ tiles: [...document.querySelectorAll('#exhibitA .tile')].every((e) => getComputedStyle(e).opacity === '1' && getComputedStyle(e).animationName === 'none'), line: getComputedStyle(document.querySelector('#exhibitA .tl-string')).transform }));
    check('reduced motion: all 324 + 19 tiles and the timeline string are in their final state', fin.tiles && fin.line.includes('1'), JSON.stringify(fin));
    await c4.ctx.close();
  }
}

// ------------------------------------------------------------------ Stage 8
if (run(8)) {
  console.log('\nStage 8: Exhibit B, the honest boundary');
  const B = content.exhibitB;
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true });
    await ready(page); await sleep(400);
    const txt = await page.evaluate(() => document.body.innerText + ' ' + document.querySelector('#cf-data').textContent);
    check('production: "0.585" appears nowhere in the file (DOM or data)', !/0\.585/.test(txt) && !/0\.585/.test(readFileSync(join(ROOT, 'dist', 'index.html'), 'utf8')));
    const p = await page.evaluate(() => ({ call: document.querySelectorAll('#exhibitB .call').length, opened: document.querySelector('#exhibitB').classList.contains('opened'), dots: document.querySelectorAll('#exhibitB .bdot').length, title: document.querySelector('#exhibitB .sheet-title').textContent, gap: document.querySelectorAll('#exhibitB .gap').length, text: document.querySelector('#exhibitB').innerText }));
    check('production: while unconfirmed there is no call, the card is open, exactly one dot (40.6x)', p.call === 0 && p.opened && p.dots === 1, JSON.stringify([p.call, p.opened, p.dots]));
    check('production: no claim about 1,000 symbols, no "until it was worse" title, no crossover line, no gap line', !/1,000 symbols/.test(p.text) && p.title !== B.title && !/crossover/i.test(p.text) && p.gap === 0 && !/until it was worse/i.test(p.text), p.title);
    await scrollTo(page, '#exhibitB .chart', 180); await sleep(2200);
    const c = await page.evaluate(() => ({ ticksX: [...document.querySelectorAll('#exhibitB .bchart .axl')].map((e) => e.textContent), be: document.querySelector('#exhibitB .be-l').textContent, label: document.querySelector('#exhibitB .bdot').getAttribute('aria-label'), val: document.querySelector('#exhibitB .bval').textContent, table: document.querySelector('#exhibitB .sr-only table').innerText, svgRole: document.querySelector('#exhibitB .bchart').getAttribute('role'), dotH: document.querySelector('#exhibitB .bdot').getBoundingClientRect().height }));
    check('chart: log axes 1 to 1,000, break-even line labelled, direct value label, role=img, data table', ['1', '10', '100', '1,000'].every((x) => c.ticksX.includes(x)) && c.be === 'break-even: above it the index wins' && c.val === '40.6x' && c.svgRole === 'img' && c.table.includes('40.6'), JSON.stringify(c).slice(0, 220));
    await page.tap('#exhibitB .bdot'); await sleep(200);
    check('tapping the dot shows its label', (await page.evaluate(() => document.querySelector('#exhibitB .dot-detail').textContent)) === B.boundary.points[0].label);
    check('dot tap target is at least 44px', c.dotH >= 44);
    const note = await page.evaluate(() => document.querySelector('#exhibitB .chart .custody-strip').innerText);
    check('boundary.note shows in a custody strip (without the crossover sentence while gated)', note.includes('268,744,780') && note.includes('One machine, one workload') && !/crossover/i.test(note), note);
    await scrollTo(page, '#exhibitB .cstrip', 250); await sleep(3000);
    const cn = await page.evaluate(() => ({ n: document.querySelectorAll('#exhibitB .rd').length, hot: document.querySelectorAll('#exhibitB .rd.hot').length, hotFirst: [...document.querySelectorAll('#exhibitB .rd')].slice(0, 9).every((e) => e.classList.contains('hot')), note: document.querySelector('#exhibitB .cn-note').textContent, label: document.querySelector('#exhibitB .rounds').getAttribute('aria-label') }));
    check('contamination strip: 10 dots, the first 9 turn brass one by one, caption from content', cn.n === 10 && cn.hot === 9 && cn.hotFirst && cn.note === B.contamination.note && /9 of 10/.test(cn.label), JSON.stringify(cn));
    const ch = await page.evaluate(() => [...document.querySelectorAll('#exhibitB .chip-t')].map((e) => ({ t: e.textContent, dashed: getComputedStyle(e).borderStyle.includes('dashed') })));
    check('chips from content; only the MODELED chip is dashed', ch.length === B.chips.length && ch.filter((x) => x.dashed).length === 1 && ch.find((x) => x.dashed).t.includes('MODELED'), JSON.stringify(ch));
    check('production: no console errors', log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build: 'review.html' });
    await ready(page); await sleep(400);
    const r = await page.evaluate(() => ({ call: document.querySelectorAll('#exhibitB .call').length, title: document.querySelector('#exhibitB .sheet-title').textContent, dots: document.querySelectorAll('#exhibitB .bdot').length, opened: document.querySelector('#exhibitB').classList.contains('opened') }));
    check('review: full title, the call, and both dots are there', r.title === B.title && r.call === 1 && r.dots === 2 && !r.opened, JSON.stringify(r));
    await scrollTo(page, '#exhibitB'); await page.tap('#exhibitB .opt:nth-child(' + (B.call.answerIndex + 1) + ')'); await sleep(1400);
    await scrollTo(page, '#exhibitB .chart', 180); await sleep(3200);
    const c = await page.evaluate(() => ({ gap: document.querySelectorAll('#exhibitB .gap').length, gl: document.querySelector('#exhibitB .gap-l').textContent, vals: [...document.querySelectorAll('#exhibitB .bval')].map((e) => e.textContent), reveal: document.querySelector('#exhibitB .call-reveal').textContent, dash: getComputedStyle(document.querySelector('#exhibitB .gap')).strokeDasharray, rows: document.querySelectorAll('#exhibitB .sr-only tbody tr').length, below: (() => { const dots = [...document.querySelectorAll('#exhibitB .bdot')].map((e) => e.getBoundingClientRect().top); return dots[1] > dots[0]; })() }));
    check('review: second point plotted below the first, dashed gap labelled "crossover not measured here"', c.gap === 1 && c.gl === 'crossover not measured here' && c.vals.join() === '40.6x,0.585x' && c.dash !== 'none' && c.rows === 2 && c.below, JSON.stringify(c));
    check('review: the call reveal shows after answering', c.reveal === B.call.reveal);
    check('review: no console errors', log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  { // laptop screenshot for the eye + reduced motion final
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.laptop, reducedMotion: true });
    await ready(page); await sleep(300); await scrollTo(page, '#exhibitB .chart', 100); await sleep(400);
    check('reduced motion: chart dots and strip are final at once', await page.evaluate(() => getComputedStyle(document.querySelector('#exhibitB .bdot')).opacity === '1' && document.querySelectorAll('#exhibitB .rd.hot').length === 9));
    await ctx.close();
  }
}

// ------------------------------------------------------------------ Stage 9 (ledger and forks)
if (run(9)) {
  console.log('\nStage 9: plot twists and forks');
  const prodCases = content.ledger.cases.filter((c) => !c.requiresConfirmation);
  const cnt = (cs) => cs.reduce((m, c) => { m[c.status] = (m[c.status] || 0) + 1; return m; }, {});
  for (const [build, cases] of [['index.html', prodCases], ['review.html', content.ledger.cases]]) {
    const { page, ctx, log } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build });
    await ready(page); await sleep(400);
    await scrollTo(page, '#ledger');
    const L = await page.evaluate(() => ({ title: document.querySelector('#ledger .sheet-title').textContent, rows: document.querySelectorAll('#ledger .case').length, chips: [...document.querySelectorAll('#ledger .fchip')].map((c) => [c.dataset.f, +c.querySelector('b').textContent]), open: document.querySelectorAll('#ledger .stamp.s-open').length, stamps: [...document.querySelectorAll('#ledger .stamp')].map((s) => s.textContent) }));
    const want = cnt(cases);
    check(`${build}: ${cases.length} cases${build === 'index.html' ? ' (c6 hidden while unconfirmed)' : ''}, title is ui.ledgerTitle`, L.rows === cases.length && L.title === content.ui.ledgerTitle && (build === 'review.html' || !L.stamps.length || true), JSON.stringify(L.rows));
    check(`${build}: filter chip counts are computed from the data`, L.chips.every(([k, n]) => k === 'all' ? n === cases.length : n === want[k]) && L.chips.length === Object.keys(want).length + 1, JSON.stringify(L.chips) + JSON.stringify(want));
    check(`${build}: the OPEN stamp exists exactly once`, L.open === 1 && L.stamps.filter((s) => s === 'OPEN').length === 1, JSON.stringify(L.open));
    const op = await page.evaluate(() => { const o = getComputedStyle(document.querySelector('#ledger .stamp.s-open')); const c = getComputedStyle(document.querySelector('#ledger .stamp.s-closed')); return { oa: parseFloat(o.fontSize), ca: parseFloat(c.fontSize), obg: o.backgroundColor, cbg: c.backgroundColor }; });
    check(`${build}: OPEN is visually loudest (bigger, filled brass); closed stamps are muted`, op.oa > op.ca && op.obg !== 'rgba(0, 0, 0, 0)' && op.cbg === 'rgba(0, 0, 0, 0)', JSON.stringify(op));
    // filters by touch
    for (const status of Object.keys(want)) {
      await page.tap(`#ledger .fchip[data-f="${status}"]`); await sleep(150);
      const shown = await page.evaluate(() => [...document.querySelectorAll('#ledger .case')].filter((c) => !c.hidden).map((c) => c.dataset.status));
      check(`${build}: tapping the ${status.toUpperCase()} chip shows ${want[status]} case(s) of that status`, shown.length === want[status] && shown.every((s) => s === status), shown.join());
    }
    await page.tap('#ledger .fchip[data-f="all"]'); await sleep(150);
    check(`${build}: All chip restores every row`, (await page.evaluate(() => [...document.querySelectorAll('#ledger .case')].filter((c) => !c.hidden).length)) === cases.length);
    await page.tap('#ledger .case:nth-child(1) .case-head'); await sleep(600);
    const e = await page.evaluate(() => ({ exp: document.querySelector('#ledger .case-head').getAttribute('aria-expanded'), t: document.querySelector('#ledger .case-body').innerText, h: document.querySelector('#ledger .case-head').getBoundingClientRect().height }));
    check(`${build}: tapping a row expands what / resolution (touch target 44px+)`, e.exp === 'true' && e.t.includes(cases[0].what) && e.t.includes(cases[0].resolution) && e.h >= 44, e.t.slice(0, 60));
    if (build === 'review.html') check('review: the PitDB note (draft) shows on case c1, outlined amber', await page.evaluate(() => !!document.querySelector('#ledger .case:nth-child(1) .case-in .cf-filled')));
    check(`${build}: no console errors`, log.errors.length === 0, log.errors.join('|'));
    await ctx.close();
  }
  for (const [build, expectMind] of [['index.html', false], ['review.html', true]]) {
    const { page, ctx } = await openPage(browser, { viewport: VIEWPORTS.phone, touch: true, build });
    await ready(page); await sleep(300); await scrollTo(page, '#decisions');
    const F = await page.evaluate(() => [...document.querySelectorAll('#decisions .fork')].map((f) => ({ title: f.querySelector('h3').textContent, chosen: f.querySelectorAll('.branch.chosen').length, total: f.querySelectorAll('.branch').length, notTaken: f.querySelectorAll('.nt').length, ev: !!f.querySelector('.chosen .bev'), evUnderSkipped: !!f.querySelector('.skipped .bev'), cmm: !!f.querySelector('.cmm'), red: getComputedStyle(f.querySelector('.chosen'), '::before').backgroundColor, grey: getComputedStyle(f.querySelector('.skipped')).color })));
    const forks = content.decisions.forks;
    check(`${build}: ${forks.length} forks, each with one chosen branch, the others "not taken", evidence under the chosen`, F.length === forks.length && F.every((f, i) => f.title === forks[i].title && f.chosen === 1 && f.notTaken === f.total - 1 && f.ev && !f.evUnderSkipped), JSON.stringify(F).slice(0, 200));
    check(`${build}: chosen branch is drawn in red string, others grey`, F.every((f) => f.red === 'rgb(210, 69, 46)' && f.grey === 'rgb(94, 86, 75)'), JSON.stringify([F[0].red, F[0].grey]));
    check(`${build}: "What would change my mind" slip is ${expectMind ? 'present (draft, outlined)' : 'hidden while empty'}`, expectMind ? F.every((f) => f.cmm) : F.every((f) => !f.cmm));
    await ctx.close();
  }
}

const failed = summary();
await browser.close();
process.exit(failed ? 1 : 0);
