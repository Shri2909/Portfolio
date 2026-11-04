// E8.6 Calm parity: every registered effect names a still equivalent; in Calm no animation runs and no act is blank.
import fs from 'node:fs'; import path from 'node:path';
import { serve } from './e2e/serve.mjs';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
let bad = 0; const fail = (m) => { console.log('  FAIL ' + m); bad++; };
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
for (const f of walk(path.join(root, 'src')).filter((f) => /\.jsx?$/.test(f))) {
  const s = fs.readFileSync(f, 'utf8'); for (const m of s.matchAll(/registerEffect\(\{([^}]*)\}/g)) if (!/still\s*[:=]/.test(m[1]) && !/export function/.test(s.slice(Math.max(0, m.index - 20), m.index))) fail(`registerEffect without still in ${path.relative(root, f)}`);
}
const { srv, base } = serve(); const b = await chromium.launch({ args: ['--no-sandbox'] });
const IDS = ['night', 'baithak', 'lamp-1', 'lamp-2', 'lamp-3', 'lamp-4', 'lamp-5', 'voice', 'lamp-6', 'verdict', 'wish', 'closure'];
for (const [name, vp, mob] of [['390', { width: 390, height: 844 }, true], ['1366', { width: 1366, height: 768 }, false]]) {
  const ctx = await b.newContext({ viewport: vp, isMobile: mob, hasTouch: mob, reducedMotion: 'reduce' }); const p = await ctx.newPage();
  await p.goto(base); await p.waitForTimeout(2500);
  fs.mkdirSync(path.join(root, 'shots/calm'), { recursive: true });
  for (const id of IDS) {
    if (!(await p.$('#' + id))) continue;
    await p.evaluate((i) => document.getElementById(i).scrollIntoView({ behavior: 'instant' }), id); await p.waitForTimeout(700);
    const r = await p.evaluate(() => ({ running: document.getAnimations().filter((a) => a.playState === 'running' && a.effect && a.effect.target && !(a.effect.target.closest && a.effect.target.closest('[data-essential]'))).map((a) => (a.effect.target.id || a.effect.target.className || a.effect.target.tagName) + ':' + (a.animationName || a.transitionProperty || '')).slice(0, 4), act: document.documentElement.dataset.act || '' }));
    const shot = await p.screenshot({ path: path.join(root, `shots/calm/${name}-${id}.png`) });
    const lum = await p.evaluate(async (b64) => { const i = new Image(); i.src = 'data:image/png;base64,' + b64; await i.decode(); const c = document.createElement('canvas'); c.width = 64; c.height = 64; const x = c.getContext('2d'); x.drawImage(i, 0, 0, 64, 64); const d = x.getImageData(0, 0, 64, 64).data; let s = 0, hues = new Set(); for (let k = 0; k < d.length; k += 4) { s += (0.2126 * d[k] + 0.7152 * d[k + 1] + 0.0722 * d[k + 2]) / 255; hues.add(Math.round(Math.atan2(Math.sqrt(3) * (d[k + 1] - d[k + 2]), 2 * d[k] - d[k + 1] - d[k + 2]) / 1.0472) % 6); } return { mean: s / 4096, hues: hues.size }; }, shot.toString('base64'));
    if (r.running.length) fail(`${name} ${id}: animations running in Calm: ${r.running.join(', ')}`);
    if (!r.act && id !== 'night') console.log(`  note ${name} ${id}: no data-act`);
    if (lum.mean < 0.02) fail(`${name} ${id}: Calm frame is blank (mean luminance ${lum.mean.toFixed(3)})`);
  }
  await ctx.close();
}
await b.close(); srv.close(); console.log(bad ? `check-parity: ${bad} problem(s)` : 'check-parity: clean'); process.exit(bad ? 1 : 0);
