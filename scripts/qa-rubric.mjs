// Visual QA rubric (dev only). Usage: node scripts/qa-rubric.mjs [--dir=dist]
// Automated: 3 (depth order), 4 (ghost-text contrast sampler per act), 6 (no text under 11px, brass contrast), 10 (hit targets, focus ring).
// Screenshot sets for human or agent review: 1, 2, 5, 7, 8, 9 -> qa/shots/rubric/. Prints PASS/FAIL per item.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const dir = path.join(root, (process.argv.find((a) => a.startsWith('--dir=')) || '--dir=dist').split('=')[1]);
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2' };
const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(dir, u === '/' ? 'index.html' : u); if (!f.startsWith(dir) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) f = path.join(dir, 'index.html'); r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'x' }); r.end(fs.readFileSync(f)); }).listen(0);
const base = 'http://127.0.0.1:' + srv.address().port + '/';
const shots = path.join(root, 'qa/shots/rubric'); fs.mkdirSync(shots, { recursive: true });
const browser = await chromium.launch({ args: ['--no-sandbox'] });
const res = {}; const note = (k, ok, msg) => { (res[k] ||= { ok: true, msgs: [] }); if (!ok) res[k].ok = false; if (msg) res[k].msgs.push(msg); };
const ACTS = ['night', 'baithak', 'lamp-1', 'lamp-3', 'voice', 'lamp-6', 'verdict', 'wish', 'closure'];

for (const [vn, vp, mobile] of [['390', { width: 390, height: 844 }, true], ['1366', { width: 1366, height: 768 }, false]]) {
  for (const calm of [false, true]) {
    const ctx = await browser.newContext({ viewport: vp, isMobile: mobile, hasTouch: mobile, reducedMotion: calm ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage(); await p.goto(base); await p.waitForTimeout(4200);
    const tag = `${vn}${calm ? '-calm' : ''}`;
    if (!calm) {
      // 3: depth order, read from the painted fills of the three layers
      const d = await p.evaluate(() => { const lum = (c) => { const m = c.match(/[\d.]+/g).map(Number); return 0.2126 * m[0] + 0.7152 * m[1] + 0.0722 * m[2]; }; const f = (s) => { const e = document.querySelector(s); return e ? lum(getComputedStyle(e).fill) : null; }; return { far: f('#skyline .lay.far rect:not(.pane):not(.halo)'), mid: f('#skyline .lay.mid > rect:not(.pane):not(.halo)'), near: f('#skyline .lay.near > g > rect:first-child') }; });
      note('3', d.near < d.mid && d.mid < d.far, `${vn}: near ${d.near?.toFixed(1)} < mid ${d.mid?.toFixed(1)} < far ${d.far?.toFixed(1)}`);
      // 6: type sizes and brass contrast
      const small = await p.evaluate(() => { const out = []; const w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT); for (let n = w.nextNode(); n; n = w.nextNode()) { if (!n.nodeValue.trim()) continue; const e = n.parentElement; if (!e || e.closest('.sr-only,script,style,noscript,dialog:not([open])')) continue; const r = e.getBoundingClientRect(); if (!r.width || !r.height) continue; const cs = getComputedStyle(e); if (cs.visibility === 'hidden' || cs.display === 'none') continue; if (parseFloat(cs.fontSize) < 11) out.push(e.className + ':' + n.nodeValue.trim().slice(0, 18) + '@' + cs.fontSize); } return out.slice(0, 6); });
      note('6', !small.length, small.length ? `${vn}: under 11px: ${small.join(' | ')}` : '');
      // 10: hit targets and a focus ring on a Tab-through
      const tabs = []; await p.evaluate(() => scrollTo(0, 0));
      for (let i = 0; i < 6; i++) { await p.keyboard.press('Tab'); tabs.push(await p.evaluate(() => { const e = document.activeElement; if (!e || e === document.body) return null; const r = e.getBoundingClientRect(), cs = getComputedStyle(e); return { n: (e.className || e.tagName).toString().slice(0, 20), w: r.width, h: r.height, ring: cs.outlineStyle !== 'none' && parseFloat(cs.outlineWidth) >= 2 }; })); }
      const bad = tabs.filter((t) => t && (!t.ring || t.h < 43.5 || t.w < 43.5 && !/lamp/.test(t.n))); note('10', !bad.length, bad.length ? `${vn}: ${JSON.stringify(bad.slice(0, 3))}` : '');
      await p.screenshot({ path: path.join(shots, `${tag}-tab.png`) });
    }
    // 4: ghost-text contrast sampler per act
    for (const id of ACTS) {
      if (!(await p.$('#' + id))) continue;
      await p.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id); await p.waitForTimeout(calm ? 500 : 2200);
      await p.screenshot({ path: path.join(shots, `${tag}-${id}.png`) });
      const items = await p.evaluate(() => { const out = []; document.querySelectorAll('h1,h2,h3,p,li,.kicker,a,button,span.chip').forEach((e) => { if (e.closest('.sr-only,dialog')) return; const r = e.getBoundingClientRect(); if (r.width < 8 || r.height < 8 || r.bottom < 60 || r.top > innerHeight - 4 || r.left < 0) return; const cs = getComputedStyle(e); if (/rgba?\([^)]*,\s*0\)$/.test(cs.color) || cs.color === 'transparent') return; /* icon-only button: its name is the aria-label */ let eo = 1; for (let a = e; a && a !== document.body; a = a.parentElement) eo *= +getComputedStyle(a).opacity; if (cs.visibility === 'hidden' || eo < 0.9 || cs.backgroundClip === 'text' || cs.webkitBackgroundClip === 'text') return; if (![...e.childNodes].some((n) => n.nodeType === 3 && n.nodeValue.trim())) return; const hit = document.elementFromPoint(Math.min(innerWidth - 1, r.left + r.width / 2), Math.min(innerHeight - 1, r.top + r.height / 2)); if (!hit || !e.contains(hit)) return; const m = cs.color.match(/[\d.]+/g).map(Number); out.push({ x: Math.max(0, r.left), y: Math.max(0, r.top), w: Math.min(r.width, innerWidth - r.left), h: Math.min(r.height, innerHeight - r.top), c: m.slice(0, 3), a: m[3] ?? 1, round: parseFloat(cs.borderTopLeftRadius) >= 12 && (e.tagName === 'BUTTON' || e.tagName === 'A' || e.classList.contains('chip')), big: parseFloat(cs.fontSize) >= 24 || (parseFloat(cs.fontSize) >= 18.66 && +cs.fontWeight >= 700), t: e.textContent.trim().slice(0, 24) }); }); return out.slice(0, 14); });
      await p.addStyleTag({ content: '*{color:transparent!important;text-shadow:none!important;-webkit-text-fill-color:transparent!important;caret-color:transparent!important}h1,h2,p,li,a,button,span{background-image:none!important}.num{background:none!important}' });
      for (const it of items) {
        const ix = it.round ? 0.18 : 0, buf = await p.screenshot({ clip: { x: it.x + it.w * ix, y: it.y + it.h * ix, width: Math.max(1, it.w * (1 - 2 * ix)), height: Math.max(1, it.h * (1 - 2 * ix)) } });
        const L = await p.evaluate(async (b64) => { const bm = new Image(); bm.src = 'data:image/png;base64,' + b64; await bm.decode(); const c = new OffscreenCanvas(bm.width, bm.height), g = c.getContext('2d'); g.drawImage(bm, 0, 0); const d = g.getImageData(0, 0, bm.width, bm.height).data, ls = []; const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; for (let i = 0; i < d.length; i += 4) ls.push(0.2126 * lin(d[i]) + 0.7152 * lin(d[i + 1]) + 0.0722 * lin(d[i + 2])); ls.sort((a, b) => a - b); return ls[Math.floor(ls.length * 0.95)]; }, buf.toString('base64'));
        const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
        const tl = 0.2126 * lin(it.c[0]) + 0.7152 * lin(it.c[1]) + 0.0722 * lin(it.c[2]);
        const cr = (Math.max(tl, L) + 0.05) / (Math.min(tl, L) + 0.05), need = it.big ? 3 : 4.5;
        note('4', cr >= need, cr >= need ? '' : `${tag} #${id} "${it.t}" ${cr.toFixed(2)}:1 (<${need})`);
      }
      await p.evaluate(() => { const s = [...document.querySelectorAll('style')].pop(); s && s.remove(); });
    }
    if (calm) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(500); const anim = await p.evaluate(() => document.getAnimations().filter((a) => a.playState === 'running' && !(a.effect.target && a.effect.target.closest && a.effect.target.closest('[data-essential]'))).length); note('8', anim < 6, `${tag}: ${anim} animations running in Calm`); }
    await ctx.close();
  }
}
// 9: ink theme screenshot (monochrome check: sample hue spread of a screenshot is for review)
{ const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); await p.goto(base); await p.waitForTimeout(3500); try { await p.click('text=Menu'); await p.click('text=/ink|look/i', { timeout: 1500 }); } catch {} await p.waitForTimeout(800); await p.screenshot({ path: path.join(shots, 'ink.png') }); await ctx.close(); }
await browser.close(); srv.close();
const NAMES = { 1: 'one loudest object', 2: 'six elements max', 3: 'depth order', 4: 'ghost-text contrast', 5: 'sky banding', 6: 'type sizes', 7: 'Hinglish voice', 8: 'Calm still frame', 9: 'Ink monochrome', 10: 'focus and hit targets' };
let fail = 0;
for (let i = 1; i <= 10; i++) { const r = res[i]; const auto = !!r; if (auto && !r.ok) fail++; console.log(`${auto ? (r.ok ? 'PASS' : 'FAIL') : 'REVIEW'}  ${i}. ${NAMES[i]}${r && r.msgs.filter(Boolean).length ? '\n        ' + [...new Set(r.msgs.filter(Boolean))].slice(0, 8).join('\n        ') : ''}`); }
console.log('screenshots: qa/shots/rubric/'); process.exit(fail ? 1 : 0);
