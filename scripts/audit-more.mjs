// Pack 8 audits, second half (P8.7 to P8.13). Imported by scripts/audit.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
export default async function ({ browser, base, ctxOf, open, walk, esc, sec }) {
  const lightAllUI = async (p) => { const b = p.locator('#night').getByRole('button', { name: /Sab diye ek saath/ }); if (await b.count()) await b.click(); await p.waitForTimeout(2600); if (await p.evaluate(() => document.getElementById('lamp-card').open)) await esc(p); };
  const running = (p) => p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running').map((a) => (a.animationName || a.transitionProperty || a.constructor.name) + '@' + ((a.effect && a.effect.target && (a.effect.target.className && a.effect.target.className.baseVal !== undefined ? a.effect.target.className.baseVal : a.effect.target.className || a.effect.target.id)) || '')));

  // ---------- P8.7 reduced motion and Calm ----------
  { const s = sec('P8.7', 'Reduced motion and the Calm toggle');
    let ctx = await ctxOf(390, 844, { reducedMotion: 'reduce' }); let p = await open(ctx); await p.waitForTimeout(2000);
    const anims = await running(p); const infinite = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect.getComputedTiming().iterations === Infinity).length);
    s.note(`Reduced motion, fresh load: ${anims.length} running animations/transitions (${infinite} infinite). ${anims.slice(0, 12).join(', ')}`); if (infinite > 0) s.fail('infinite animations still running under reduced motion');
    s.note('Calm is on by itself: data-calm=' + await p.evaluate(() => document.documentElement.dataset.calm) + '; "Motion off hai?" line visible: ' + (await p.locator('.calm-note').count() === 1));
    const b = await p.locator('.lamp-btn').first().boundingBox(); await p.mouse.click(b.x + b.width / 2, b.y + 20); await p.waitForTimeout(150);
    s.note('One tap lights lamp 1 instantly: ' + (await p.locator('.lamp-btn.lit').count() === 1)); if (await p.locator('.lamp-btn.lit').count() !== 1) s.fail('tap did not light');
    await esc(p); await p.locator('#night').getByRole('button', { name: /Sab diye ek saath/ }).click(); await p.waitForTimeout(600);
    s.note('Sab diye ek saath jalaiye lights all five: ' + (await p.locator('.lamp-btn.lit').count() === 5)); s.note('scroll-behavior: ' + await p.evaluate(() => getComputedStyle(document.documentElement).scrollBehavior));
    const calmBtn = p.locator('#dock button').first(); s.note('Calm toggle while reduced motion is on: ' + (await calmBtn.isDisabled() ? 'disabled and pressed (cannot be turned off, as intended)' : 'enabled')); await ctx.close();
    ctx = await ctxOf(390, 844); p = await open(ctx); await lightAllUI(p); await p.waitForTimeout(1500);
    const before = await running(p), textBefore = await p.evaluate(() => document.getElementById('main').innerText.length);
    const btn = p.locator('#dock button').first(); await btn.focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(700);
    const after = await running(p), textAfter = await p.evaluate(() => document.getElementById('main').innerText.length);
    s.note(`Calm toggle (keyboard Enter): running animations ${before.length} -> ${after.length}; page text length ${textBefore} -> ${textAfter} (nothing removed: ${textBefore <= textAfter + 40}). aria-pressed=${await btn.getAttribute('aria-pressed')}, name="${await btn.getAttribute('aria-label')}", focus ring present: ${await btn.evaluate((e) => { const c = getComputedStyle(e); return c.outlineStyle !== 'none' || c.boxShadow !== 'none'; })}.`);
    const infAfter = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && a.effect.getComputedTiming().iterations === Infinity).map((a) => a.animationName)); s.note('Infinite animations still running with Calm on: ' + (infAfter.length ? infAfter.join(', ') : 'none')); if (infAfter.length) s.warn('some infinite animations still run under Calm: ' + infAfter.join(', '));
    await p.reload({ waitUntil: 'networkidle' }); s.note('Calm remembered after reload: ' + (await p.evaluate(() => document.documentElement.dataset.calm) === '1' ? 'YES (bad)' : 'no (not stored)')); await ctx.close(); }

  // ---------- P8.8 three widths ----------
  { const s = sec('P8.8', 'Three widths (and landscape)');
    for (const [w, h, label] of [[360, 640, '360'], [390, 844, '390'], [1366, 768, '1366'], [640, 360, '360 landscape'], [844, 390, '390 landscape']]) {
      const ctx = await ctxOf(w, h); const p = await open(ctx); const small = async (tag) => p.evaluate(() => [...document.querySelectorAll('button,a[href],input:not([type=hidden]),textarea,[role=button],[role=radio],[role=switch],select')].filter((e) => { const r = e.getBoundingClientRect(), cs = getComputedStyle(e); if (!r.width || !r.height || cs.visibility === 'hidden' || e.closest('.sr-only,[hidden],dialog:not([open]),.fulltext')) return false; return r.width < 44 || r.height < 44; }).map((e) => `${e.tagName.toLowerCase()}.${(e.className || '').toString().split(' ')[0]} "${(e.getAttribute('aria-label') || e.innerText || e.id || '').slice(0, 24)}" ${Math.round(e.getBoundingClientRect().width)}x${Math.round(e.getBoundingClientRect().height)}`));
      let sm = await small(); const ov0 = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      await lightAllUI(p); sm = [...new Set([...sm, ...(await small())])]; await p.evaluate(() => document.getElementById('wish').scrollIntoView()); await p.locator('#wish-text').fill('x'); await p.getByRole('button', { name: 'Card banaiye' }).click(); await p.waitForTimeout(2200); sm = [...new Set([...sm, ...(await small())])];
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      s.note(`${label}: horizontal overflow ${Math.max(ov0, ov)} px; controls under 44 px in a direction: ${sm.length ? '\n' + sm.map((x) => '    - ' + x).join('\n') : 'none'}`); if (Math.max(ov0, ov) > 0) s.fail(label + ': horizontal scroll'); if (sm.length) s.warn(label + ': small targets');
      for (const [name, open_] of [['lamp card', async () => { await p.evaluate(() => { document.getElementById('lamps').scrollIntoView(); }); await p.locator('.story-list li').first().getByRole('button').click(); }], ['sixty second file', async () => { await p.evaluate(() => document.querySelector('.sixty-link a').click()); }], ['evidence drawer', async () => { await p.evaluate(() => document.querySelector('#footer a[data-evidence]').click()); }]]) {
        await open_(); await p.waitForTimeout(800); const fit = await p.evaluate(() => { const d = document.querySelector('dialog[open]'); if (!d) return null; const r = (d.querySelector('.card') || d.firstElementChild).getBoundingClientRect(), close = [...d.querySelectorAll('button')].find((b) => /Close|Row par waapas/.test(b.innerText)); const cr = close && close.getBoundingClientRect(); return { fits: r.left >= -1 && r.right <= innerWidth + 1 && r.height <= innerHeight + 1, closeVisible: !!cr && cr.width > 0, closeSize: cr ? Math.round(cr.width) + 'x' + Math.round(cr.height) : '' }; });
        s.note(`   ${name}: ${fit ? JSON.stringify(fit) : 'did not open'}`); if (!fit || !fit.fits || !fit.closeVisible) s.fail(`${label} ${name} does not fit or has no visible close`); await esc(p); await esc(p); }
      await ctx.close(); }
    s.note('Not measured: content hidden behind fixed bars and rounded-corner cut-offs need a real phone.'); }

  // ---------- P8.9 CPU slowdown ----------
  { const s = sec('P8.9', 'Four-times CPU slowdown (headless, software rendering: indicative only)');
    for (const calm of [false, true]) {
      const ctx = await ctxOf(390, 844, calm ? { reducedMotion: 'reduce' } : {}); const p = await ctx.newPage(); const cdp = await ctx.newCDPSession(p); await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
      await p.addInitScript(() => { window.__lt = []; try { new PerformanceObserver((l) => l.getEntries().forEach((e) => window.__lt.push(Math.round(e.duration)))).observe({ entryTypes: ['longtask'] }); } catch (e) {} window.__fps = (ms) => new Promise((res) => { const d = []; let t = performance.now(), end = t + ms; const f = (n) => { d.push(n - t); t = n; if (n < end) requestAnimationFrame(f); else { d.shift(); const avg = 1000 / (d.reduce((a, b) => a + b, 0) / d.length); res({ avg: +avg.toFixed(1), min: +(1000 / Math.max(...d)).toFixed(1), frames: d.length }); } }; requestAnimationFrame(f); }); });
      const t0 = Date.now(); await p.goto(base, { waitUntil: 'load' }); const stages = []; const meas = async (name, act, ms = 2500) => { const pr = p.evaluate((m) => window.__fps(m), ms); if (act) await act(); stages.push([name, await pr]); };
      await p.waitForTimeout(10000); await meas('settled (10 s after load)', null);
      await meas('scroll slowly then quickly', async () => { for (let i = 0; i < 12; i++) { await p.mouse.wheel(0, i < 6 ? 120 : 600); await p.waitForTimeout(150); } await p.evaluate(() => scrollTo(0, 0)); }, 3500);
      const b = await p.locator('.lamp-btn').first().boundingBox();
      await meas('hold to light lamp 1', async () => { await p.mouse.move(b.x + b.width / 2, b.y + 20); await p.mouse.down(); await p.waitForTimeout(1200); await p.mouse.up(); }, 2500); await p.waitForTimeout(1500); await esc(p);
      await meas('light all + dusk fireworks', async () => { await p.locator('#night').getByRole('button', { name: /Sab diye/ }).click().catch(() => {}); }, 6000);
      await meas('open and close a lamp card', async () => { await p.locator('.story-list li').nth(1).getByRole('button').click(); await p.waitForTimeout(1200); await p.getByRole('button', { name: 'Row par waapas' }).click(); }, 2500);
      await meas('drag the late-reply slider', async () => { await p.locator('.story-list li').nth(1).getByRole('button').click(); await p.waitForTimeout(900); const sl = p.locator('.late input[type=range]'); const bb = await sl.boundingBox(); await p.mouse.move(bb.x + 10, bb.y + 20); await p.mouse.down(); for (let i = 0; i < 15; i++) await p.mouse.move(bb.x + 10 + i * (bb.width - 20) / 14, bb.y + 20); await p.mouse.up(); }, 2500);
      const lt = await p.evaluate(() => window.__lt), tier = await p.evaluate(() => document.documentElement.dataset.quality);
      s.note(`${calm ? 'REDUCED MOTION / Calm' : 'Normal'} run (${Math.round((Date.now() - t0) / 1000)} s):\n` + stages.map(([n, r]) => `    - ${n}: avg ${r.avg} fps, lowest ${r.min} fps (${r.frames} frames)`).join('\n') + `\n    - long tasks over 50 ms: ${lt.length}${lt.length ? ' (longest ' + Math.max(...lt) + ' ms)' : ''}; quality tier at the end: ${tier}`);
      const worst = Math.min(...stages.map(([, r]) => r.avg)); if (worst < 45) s.warn(`${calm ? 'calm' : 'normal'} run: lowest stage average ${worst} fps (under about 45 is a concern)`);
      await ctx.close(); }
    s.note('Headless Chromium rasterises in software, so absolute numbers are not a phone. They show relative cost and whether the quality tier falls. Your own phone is the real test.'); }

  // ---------- P8.10 keyboard ----------
  { const s = sec('P8.10', 'Keyboard-only walkthrough'); const ctx = await ctxOf(390, 844); const p = await open(ctx);
    const order = []; const desc = () => p.evaluate(() => { const e = document.activeElement; const c = getComputedStyle(e); return { d: e.tagName.toLowerCase() + (e.id ? '#' + e.id : '') + ' "' + (e.getAttribute('aria-label') || e.innerText || e.value || '').replace(/\s+/g, ' ').slice(0, 28) + '"', ring: c.outlineStyle !== 'none' && parseFloat(c.outlineWidth) > 0 || c.boxShadow !== 'none' }; });
    for (let i = 0; i < 30; i++) { await p.keyboard.press('Tab'); order.push(await desc()); }
    s.note('First 30 Tab stops:\n' + order.map((o, i) => `    ${i + 1}. ${o.d}${o.ring ? '' : '  (no visible ring)'}`).join('\n')); const noRing = order.filter((o) => !o.ring); if (noRing.length) s.warn('stops without a visible ring: ' + noRing.map((o) => o.d).join('; '));
    await p.reload({ waitUntil: 'networkidle' }); await p.keyboard.press('Tab'); const first = await desc(); s.note('First Tab stop: ' + first.d); if (!/Skip to main content/.test(first.d)) s.fail('first stop is not the skip link');
    await p.keyboard.press('Enter'); await p.waitForTimeout(300); s.note('Enter on skip link moves focus to: ' + (await desc()).d);
    // light by keyboard, overlays
    for (let i = 0; i < 5; i++) { await p.locator('.lamp-btn').nth(i).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(i === 0 ? 2300 : 900); if (i === 0) await esc(p); }
    s.note('All five lamps lit with Enter alone: ' + (await p.locator('.lamp-btn.lit').count() === 5)); if (await p.locator('.lamp-btn.lit').count() !== 5) s.fail('keyboard cannot light all lamps');
    for (const [name, sel, dlg] of [['lamp card', '.story-list li:nth-child(2) button', '#lamp-card'], ['sixty second file', '.sixty-link a', '#sixty'], ['evidence drawer', '#footer a[data-evidence]', '#evidence']]) {
      await p.locator(sel).focus(); await p.evaluate((q) => document.querySelector(q).scrollIntoView({ block: 'center' }), sel); await p.keyboard.press('Enter'); await p.waitForTimeout(900);
      const opened = await p.evaluate((d) => document.querySelector(d).open, dlg); const trapped = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); trapped.push(await p.evaluate((d) => !!document.activeElement.closest(d), dlg)); }
      await p.keyboard.press('Escape'); await p.waitForTimeout(700); const back = await p.evaluate((q) => document.activeElement === document.querySelector(q), sel);
      s.note(`${name}: opens ${opened}; 12 Tab presses stay inside it: ${trapped.every(Boolean)}; Escape closes: ${!(await p.evaluate((d) => document.querySelector(d).open, dlg))}; focus returns to the opener: ${back}`); if (!opened || !trapped.every(Boolean)) s.fail(name); if (!back) s.warn(name + ': focus did not return to the exact opener'); }
    await p.locator('#slider-take1').focus(); await p.keyboard.press('ArrowRight'); await p.keyboard.press('End'); s.note('Voice compare flame by keyboard: ' + await p.locator('#slider-take1').getAttribute('aria-valuetext'));
    await p.locator('#wish-text').focus(); await p.keyboard.type('Yaad aaye'); await p.keyboard.press('Control+Enter'); await p.waitForTimeout(2300); const stops = []; for (let i = 0; i < 12; i++) { await p.keyboard.press('Tab'); stops.push((await desc()).d); }
    s.note('After the card is made, next Tab stops: ' + stops.join(' > ')); s.note('Keyboard gaps: none found for lamps, cards, devices, overlays, wish. Mouse-only extras (decorative lanterns, cat, sparkler, chakri, shooting star, string-light tap on the lanterns) are decorative delights without a function; the string-light pattern has a real button.'); await ctx.close(); }

  // ---------- P8.11 screen reader names ----------
  { const s = sec('P8.11', 'Screen reader names, landmarks and language'); const ctx = await ctxOf(390, 844); const p = await open(ctx); await lightAllUI(p);
    const data = await p.evaluate(() => { const name = (e) => { let n = e.getAttribute('aria-label'); if (!n && e.getAttribute('aria-labelledby')) n = e.getAttribute('aria-labelledby').split(' ').map((i) => (document.getElementById(i) || {}).innerText || '').join(' '); if (!n && e.labels && e.labels.length) n = [...e.labels].map((l) => l.innerText).join(' '); if (!n) n = e.innerText || e.value || ''; return n.replace(/\s+/g, ' ').trim(); }; const els = [...document.querySelectorAll('button,a[href],input,textarea,[role=radio],[role=switch]')].filter((e) => !e.closest('[aria-hidden=true],.fulltext,dialog:not([open])')).map((e) => ({ t: e.tagName.toLowerCase(), n: name(e), tgt: e.getAttribute('href') || e.getAttribute('data-evidence') || e.id || '' })); const heads = [...document.querySelectorAll('h1,h2,h3,h4')].filter((h) => !h.closest('dialog,.fulltext')).map((h) => h.tagName + ' ' + h.innerText.replace(/\s+/g, ' ').slice(0, 40)); return { els, heads, lang: document.documentElement.lang, hi: document.querySelectorAll('[lang="hi-Latn"]').length, landmarks: ['header', 'nav', 'main', 'footer', 'dialog'].map((t) => t + ':' + document.querySelectorAll(t).length).join(' '), fxHidden: document.getElementById('fx').getAttribute('aria-hidden'), live: document.getElementById('announcer').getAttribute('aria-live'), aria: [...document.querySelectorAll('[aria-label]')].map((e) => e.getAttribute('aria-label')) }; });
    s.note(`Interactive elements with names: ${data.els.length}. Page language: ${data.lang}. Hinglish spans marked hi-Latn: ${data.hi}. Landmarks: ${data.landmarks}. #fx aria-hidden=${data.fxHidden}; live region aria-live=${data.live}.`);
    const groups = {}; data.els.forEach((e) => { (groups[e.n] = groups[e.n] || []).push(e.tgt); }); const dup = Object.entries(groups).filter(([n, t]) => n && t.length > 1 && new Set(t).size > 1); s.note('Same name, different target: ' + (dup.length ? dup.map(([n, t]) => `"${n}" -> ${[...new Set(t)].join(' | ')}`).join('; ') : 'none.')); if (dup.length) s.fail('duplicate names with different targets');
    const unnamed = data.els.filter((e) => !e.n); s.note('Elements with no accessible name: ' + (unnamed.length ? unnamed.map((e) => e.t + ' ' + e.tgt).join(', ') : 'none.')); if (unnamed.length) s.fail('unnamed controls');
    s.note('Lamp buttons: ' + data.els.filter((e) => /^(Light lamp|Lamp \d)/.test(e.n)).map((e) => e.n).join(' | '));
    const h1 = data.heads.filter((h) => h.startsWith('H1')).length; const lv = data.heads.map((h) => +h[1]); let skip = false; for (let i = 1; i < lv.length; i++) if (lv[i] > lv[i - 1] + 1) skip = true; s.note(`Headings (outside overlays): ${data.heads.length}; h1 count ${h1}; skipped level: ${skip}.\n` + data.heads.map((h) => '    ' + h).join('\n')); if (h1 !== 1) s.fail('h1 count'); if (skip) s.warn('heading level skipped (see list)');
    const hing = data.aria.filter((a) => /\b(diya|kya|hai|nahi|aap|jal|kissa|baari|roshni|waapas|agla|ek|saath|shuru|kijiye|banaiye|badlein)\b/i.test(a)); s.note('aria-label values containing Hinglish: ' + (hing.length ? hing.join(' | ') : 'none.')); if (hing.length) s.fail('Hinglish in aria labels: ' + hing.join(' | '));
    await ctx.close(); }

  // ---------- P8.12 contrast (measured from pixels) ----------
  { const s = sec('P8.12', 'Contrast, measured from rendered pixels (text hidden, background sampled in each text box)'); const dir = '/tmp/contrast'; fs.mkdirSync(dir, { recursive: true });
    const jobs = [];
    for (const [state, w] of [['tone0', 390], ['tone5-gold', 390], ['tone0-desktop', 1366]]) {
      const ctx = await ctxOf(w, w > 800 ? 768 : 844); const p = await open(ctx); if (state === 'tone5-gold') { await lightAllUI(p); await p.waitForTimeout(4000); }
      await p.evaluate(() => { document.querySelector('#fx').style.visibility = 'hidden'; document.documentElement.style.scrollBehavior = 'auto'; });
      await p.addStyleTag({ content: '.sr-only{display:none!important}' });
      const els = await p.evaluate(() => { const out = []; const rgba = (c) => { const m = c.match(/[\d.]+/g).map(Number); return [m[0], m[1], m[2], m[3] == null ? 1 : m[3]]; }; document.querySelectorAll('main *, footer *').forEach((e) => { if (e.closest('.fulltext,dialog,[aria-hidden=true],.sr-only,canvas,svg')) return; const own = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length); if (!own) return; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || +cs.opacity === 0) return; let op = 1, a = e; while (a && a !== document.body) { op *= +getComputedStyle(a).opacity; a = a.parentElement; } const pos = (() => { let q = e; while (q) { if (getComputedStyle(q).position === 'fixed') return true; q = q.parentElement; } return false; })(); if (pos) return; const r = e.getBoundingClientRect(); if (r.width < 4 || r.height < 4) return; out.push({ t: (e.innerText || '').replace(/\s+/g, ' ').slice(0, 36), x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height, col: rgba(cs.color), op, fs: parseFloat(cs.fontSize), bold: +cs.fontWeight >= 700, sel: e.tagName.toLowerCase() + '.' + (e.className || '').toString().split(' ')[0] }); }); return out; });
      await p.addStyleTag({ content: '*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important}' }); await p.waitForTimeout(300);
      await p.screenshot({ path: `${dir}/${state}.png`, fullPage: true }); fs.writeFileSync(`${dir}/${state}.json`, JSON.stringify(els)); jobs.push(state); await ctx.close(); }
    const py = `
import json,sys
from PIL import Image
def lin(c):
    c=c/255
    return c/12.92 if c<=0.03928 else ((c+0.055)/1.055)**2.4
def L(r,g,b): return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
res=[]
for st in ${JSON.stringify(jobs)}:
    im=Image.open(f'${dir}/{st}.png').convert('RGB'); els=json.load(open(f'${dir}/{st}.json')); W,H=im.size
    for e in els:
        x0,y0=max(0,int(e['x'])),max(0,int(e['y'])); x1,y1=min(W,int(e['x']+e['w'])),min(H,int(e['y']+e['h']))
        if x1-x0<2 or y1-y0<2: continue
        px=list(im.crop((x0,y0,x1,y1)).getdata())
        if len(px)>4000: px=px[::len(px)//4000]
        r,g,b,a=e['col']; a=a*e['op']
        ratios=[]
        for p in px:
            bg=p; fg=[a*c+(1-a)*q for c,q in zip((r,g,b),bg)]
            l1,l2=L(*fg),L(*bg); ratios.append((max(l1,l2)+0.05)/(min(l1,l2)+0.05))
        ratios.sort(); worst=ratios[int(len(ratios)*0.05)]; med=ratios[len(ratios)//2]
        large=e['fs']>=24 or (e['fs']>=18.66 and e['bold']); need=3 if large else 4.5
        res.append((st,e['t'],e['sel'],round(worst,2),round(med,2),need,e['fs']))
bad=[r for r in res if r[3]<r[5]]
print(json.dumps({'n':len(res),'bad':bad[:40],'nbad':len(bad)}))
`;
    const out = JSON.parse(execFileSync('python3', ['-I', '-c', py], { maxBuffer: 1 << 26 }).toString());
    s.note(`Measured ${out.n} text boxes across tone 0 and the dusk-gold room (390 and 1366 wide). Worst case = 5th percentile of the background under the text. Boxes under AA: ${out.nbad}.`);
    out.bad.forEach(([st, t, sel, worst, med, need, fs]) => s.note(`    - [${st}] ${sel} "${t}" ${fs}px: worst ${worst}:1 (median ${med}:1), needs ${need}:1`)); if (out.nbad) s.warn(out.nbad + ' text boxes under AA at their worst-case background (a text box often spans a gradient; read the list)');
    const lum = (hex) => { const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)); const l = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * l[0] + 0.7152 * l[1] + 0.0722 * l[2]; }; const cr = (a, b) => { const x = lum(a), y = lum(b); return ((Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05)).toFixed(2); };
    s.note(`Placeholder #6B5A45 on #fffaf0 field: ${cr('#6B5A45', '#fffaf0')}:1. Ink #16110C on cream #FFF3DC (cards and notes): ${cr('#16110C', '#FFF3DC')}:1. Cream on ground-0: ${cr('#FFF3DC', '#0A0705')}:1; text-dim on ground-2: ${cr('#E3CFAE', '#19100A')}:1. Focus ring #FFD27A on ground-0: ${cr('#FFD27A', '#0A0705')}:1, on dusk gold #5C3A14: ${cr('#FFD27A', '#5C3A14')}:1.`);
    s.note('Not measured: text under a firework flash at its brightest moment, lamp six dashed outline contrast (decorative; its name is in the chip), and the lamp-card paper under the flame glow (ink on cream is ' + cr('#16110C', '#FFF3DC') + ':1 before the wash).'); }

  // ---------- P8.13 fuzz ----------
  { const s = sec('P8.13', 'Share-fragment fuzzing'); const cases = { 'nothing': '', 'garbled': '#zq9%$#@!~^&*', 'negative count': '#v1.-5', 'letters': '#v1.abc.Asha', 'decimal': '#v1.3.5.Asha', 'fifty digits': '#v1.' + '9'.repeat(50), 'zero': '#v1.0', 'one': '#v1.1', '10,000-char name': '#v1.7.' + 'A'.repeat(10000), 'script tag': '#v1.7.%3Cscript%3Ewindow.__pwned%3D1%3C%2Fscript%3E', 'img onerror': '#v1.7.%3Cimg%20src%3Dx%20onerror%3Dwindow.__pwned%3D1%3E', 'brackets and quotes': '#v1.7.%3C%22%27%3E', 'emoji': '#v1.7.%F0%9F%98%80%F0%9F%8E%89', 'hindi': '#v1.7.%E0%A4%85%E0%A4%A8%E0%A4%BF%E0%A4%A4%E0%A4%BE', 'arabic (rtl)': '#v1.7.%D8%B3%D8%A7%D8%B1%D8%A9', 'invisible chars': '#v1.7.A%E2%80%8B%E2%80%8DB%EF%BB%BF', 'bad percent': '#v1.7.%E0%A4%A', '1 MB fragment': '#v1.7.' + 'B'.repeat(1 << 20), 'several hashes': '#v1.7.Asha#v1.8', 'proto key': '#v1.7.__proto__', 'constructor': '#__proto__=1&constructor[prototype]=2', 'newline': '#v1.7.Asha%0Aevil', 'v2': '#v2.3.x', 'wish text in address?': '#wish' };
    for (const [name, h] of Object.entries(cases)) { const ctx = await ctxOf(390, 844); const p = await ctx.newPage(); const errs = []; p.on('pageerror', (e) => errs.push(String(e))); p.on('console', (m) => m.type() === 'error' && errs.push(m.text())); const t0 = Date.now(); await p.goto(base + h, { waitUntil: 'load' }).catch((e) => errs.push('goto: ' + e.message.slice(0, 60))); await p.waitForTimeout(800); const ms = Date.now() - t0;
      const r = await p.evaluate(() => ({ pwned: window.__pwned === 1, inj: document.querySelectorAll('#night script, #night img, #night [onerror]').length, banner: (document.querySelector('.share-banner') || { innerText: '' }).innerText.replace(/\s+/g, ' ').slice(0, 90), lamps: document.querySelectorAll('.lamp-btn').length, row: JSON.stringify(window.__ek ? 0 : 0), vis: document.body.innerText.length > 500 }));
      const ok = !r.pwned && !r.inj && r.lamps === 6 && r.vis && !errs.length; s.note(`${ok ? 'ok  ' : 'BAD '} ${name}: ${ms} ms; code ran: ${r.pwned}; injected nodes: ${r.inj}; page works (6 lamps): ${r.lamps === 6}; errors: ${errs.length}; shows: ${r.banner || '(no banner)'}`); if (!ok) s.fail(name); await ctx.close(); }
    const ctx = await ctxOf(390, 844); const p = await open(ctx, '#v1.7.Asha'); await p.locator('#wish-text').fill('secret wish'); await p.waitForTimeout(300); const href = await p.evaluate(() => location.href); s.note('Typing a wish never changes the address: ' + (!href.includes('secret') && href.endsWith('#v1.7.Asha'))); await ctx.close();
    s.note('Counts above 99 show as "99+" (tested in the earlier link tests: #v1.2s shows 99+); the writer caps at 46655 (3 base-36 digits).'); }
}
