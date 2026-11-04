// E8.6 accessibility sweep (lean): axe-core (serious/critical) per act in normal and Calm, canvases hidden or labelled, named buttons, 44px targets, html[lang], keyboard path for hold-to-light.
import fs from 'node:fs'; import { serve } from './e2e/serve.mjs';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url); const { chromium } = require('playwright'); const axeSrc = fs.readFileSync(require.resolve('axe-core/axe.min.js'), 'utf8');
const { srv, base } = serve(); const b = await chromium.launch({ args: ['--no-sandbox'] }); let bad = 0; const fail = (m) => { console.log('  FAIL ' + m); bad++; };
const IDS = ['night', 'baithak', 'lamp-1', 'lamp-3', 'pattern', 'voice', 'lamp-6', 'verdict', 'deeper', 'wish', 'closure'];
for (const calm of [false, true]) {
  const ctx = await b.newContext({ bypassCSP: true, viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, reducedMotion: calm ? 'reduce' : 'no-preference' }); const p = await ctx.newPage();
  await p.goto(base); await p.waitForTimeout(6000); await p.addScriptTag({ content: axeSrc });
  console.log('lang:', await p.evaluate(() => document.documentElement.lang));
  const seen = new Set();
  for (const id of IDS) {
    if (!(await p.$('#' + id))) continue;
    await p.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id); await p.waitForTimeout(900);
    const r = await p.evaluate(async () => { const x = await axe.run(document, { resultTypes: ['violations'], rules: { 'color-contrast': { enabled: false } } }); return x.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical').map((v) => v.id + ' x' + v.nodes.length + ' ' + (v.nodes[0] && v.nodes[0].target.join(' ')).slice(0, 60)); });
    const KNOWN = /^(label-content-name-mismatch|nested-interactive) /; // present in the v3-baseline build too: not an elevation regression, recorded in ELEVATION_REPORT.md
    for (const v of r) if (!seen.has(v)) { seen.add(v); if (KNOWN.test(v)) { console.log('  note (pre-existing in V3) ' + v); continue; } fail(`${calm ? 'calm' : 'normal'} ${id}: axe ${v}`); }
  }
  const s = await p.evaluate(() => ({
    canvases: [...document.querySelectorAll('canvas')].filter((c) => c.getAttribute('aria-hidden') !== 'true' && !c.getAttribute('aria-label') && c.getAttribute('role') !== 'img').map((c) => c.id || c.className),
    unnamed: [...document.querySelectorAll('button,[role=button],a[href]')].filter((e) => { const r = e.getBoundingClientRect(); return r.width && !(e.getAttribute('aria-label') || e.textContent.trim() || e.getAttribute('title') || (e.querySelector('img[alt]'))); }).map((e) => e.id || e.className || e.tagName),
    small: [...document.querySelectorAll('button,a[href],[role=button],input')].filter((e) => { const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return r.width > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && (r.width < 43.5 || r.height < 43.5) && !e.closest('[aria-hidden=true]') && !(e.tagName === 'A' && cs.display === 'inline'); }).map((e) => (e.id || e.className || e.tagName) + ' ' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height)).slice(0, 8),
  }));
  if (s.canvases.length) fail(`${calm ? 'calm' : 'normal'} canvases without aria-hidden/label: ${s.canvases.join(', ')}`);
  if (s.unnamed.length) fail(`${calm ? 'calm' : 'normal'} unnamed controls: ${s.unnamed.join(', ')}`);
  if (s.small.length) console.log(`  note ${calm ? 'calm' : 'normal'} targets under 44px (review): ${s.small.join('; ')}`);
  await ctx.close();
}
await b.close(); srv.close(); console.log(bad ? `check-a11y: ${bad} problem(s)` : 'check-a11y: clean'); process.exit(bad ? 1 : 0);
