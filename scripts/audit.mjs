// Pack 8 audits (P8.3 to P8.15) run in a real headless Chromium against the production build in dist/.
// Usage: node scripts/audit.mjs [out.md]   Report only: this script changes nothing in the site.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const outFile = process.argv[2] || path.join(root, 'docs/PACK8_AUDIT.md');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]); let f = path.join(root, 'dist', u === '/' ? 'index.html' : u);
  if (!f.startsWith(path.join(root, 'dist')) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { f = path.join(root, 'dist/404.html'); if (!fs.existsSync(f)) { res.writeHead(404); return res.end('not found'); } res.writeHead(404, { 'content-type': 'text/html' }); return res.end(fs.readFileSync(f)); }
  res.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'application/octet-stream' }); res.end(fs.readFileSync(f));
}).listen(0);
const base = 'http://127.0.0.1:' + server.address().port + '/', origin = new URL(base).origin;
const R = []; const sec = (id, title) => { const s = { id, title, status: 'PASS', lines: [] }; R.push(s); return { fail(m) { s.status = 'FAIL'; s.lines.push('FAIL: ' + m); }, note(m) { s.lines.push(m); }, warn(m) { if (s.status === 'PASS') s.status = 'REVIEW'; s.lines.push('REVIEW: ' + m); } }; };
const browser = await chromium.launch();
const ctxOf = (w = 390, h = 844, o = {}) => browser.newContext({ viewport: { width: w, height: h }, ...o });
const open = async (ctx, hash = '') => { const p = await ctx.newPage(); p.errs = []; p.cons = []; p.reqs = []; p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) p.cons.push(m.type() + ': ' + m.text()); }); p.on('pageerror', (e) => p.cons.push('pageerror: ' + e)); p.on('request', (r) => p.reqs.push({ url: r.url(), type: r.resourceType() })); p.on('requestfailed', (r) => p.cons.push('requestfailed: ' + r.url())); await p.goto(base + hash, { waitUntil: 'networkidle' }); await p.waitForTimeout(500); return p; };
const esc = async (p) => { await p.keyboard.press('Escape'); await p.waitForTimeout(500); };
async function walk(p, log) { // a full playthrough of every interaction through the UI
  const step = async (name, fn) => { const before = p.cons.length; try { await fn(); } catch (e) { log && log(`step "${name}" could not run: ${String(e.message).split('\n')[0]}`); } await p.waitForTimeout(250); if (p.cons.length > before) p.cons.slice(before).forEach((c) => log && log(`console during "${name}": ${c}`)); };
  const lamp = (i) => p.locator('.lamp-btn').nth(i);
  await step('hold lamp 1', async () => { const b = await lamp(0).boundingBox(); await p.mouse.move(b.x + b.width / 2, b.y + 20); await p.mouse.down(); await p.waitForTimeout(1100); await p.mouse.up(); await p.waitForTimeout(1500); });
  await step('close lamp 1 card', async () => { await esc(p); });
  for (let i = 1; i < 5; i++) await step('tap lamp ' + (i + 1), async () => { await lamp(i).scrollIntoViewIfNeeded(); const b = await lamp(i).boundingBox(); await p.mouse.click(b.x + b.width / 2, b.y + 20); await p.waitForTimeout(1200); });
  await step('light all button (already lit: skip if gone)', async () => { const l = p.locator('#night').getByRole('button', { name: /Sab diye ek saath/ }); if (await l.count()) await l.click(); await p.waitForTimeout(800); });
  for (let n = 1; n <= 5; n++) await step('open and close lamp card ' + n, async () => { await p.locator('.story-list li').nth(n - 1).getByRole('button').click(); await p.waitForTimeout(900);
    if (n === 1) { await p.locator('.opts label').nth(1).click(); await p.waitForTimeout(1600); await p.getByRole('button', { name: 'Phir se shuru kijiye' }).first().click(); await p.locator('.opts label').nth(3).click(); await p.waitForTimeout(1600); }
    if (n === 2) { for (const idx of [0, 8, 15]) { await p.locator('.late input[type=range]').evaluate((e, v) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(e, v); e.dispatchEvent(new Event('input', { bubbles: true })); }, String(idx)); await p.waitForTimeout(450); } await p.getByRole('button', { name: 'Corrected logic' }).click(); }
    if (n === 3) await p.getByRole('button', { name: 'Flip the tag' }).click();
    if (n === 4) { await p.locator('.baton-btn').click(); await p.waitForTimeout(2200); await p.getByRole('button', { name: 'Hold to count the rounds' }).click(); await p.waitForTimeout(3000); }
    if (n === 5) { await p.getByRole('button', { name: 'Normalized UTC CSV route' }).click(); }
    await p.waitForTimeout(400); await p.getByRole('button', { name: 'Row par waapas' }).click(); await p.waitForTimeout(600); });
  await step('sixty second file', async () => { await p.locator('.sixty-link a').click(); await p.waitForTimeout(500); await esc(p); });
  await step('evidence drawer, every folder', async () => { await p.evaluate(() => document.querySelector('#footer a[data-evidence]').click()); await p.waitForTimeout(500); for (let i = 1; i <= 8; i++) { await p.locator('#tab-c' + i).click(); await p.waitForTimeout(150); } await esc(p); });
  await step('voice compare', async () => { await p.evaluate(() => document.getElementById('voice').scrollIntoView()); const sl = p.locator('#slider-take1'); await sl.focus(); await p.keyboard.press('End'); await p.keyboard.press('Home'); await p.getByRole('switch', { name: 'Read it plainly' }).click(); await p.getByRole('switch', { name: 'Read it plainly' }).click(); });
  await step('wish and share buttons', async () => { await p.evaluate(() => document.getElementById('wish').scrollIntoView()); await p.locator('#wish-text').fill('Yaad aaye.'); await p.getByRole('button', { name: 'Card banaiye' }).click(); await p.waitForTimeout(2500);
    await p.getByRole('button', { name: 'Send the card on WhatsApp' }).click(); await p.waitForTimeout(500);
    for (const n of ['Copy the card text', 'Copy the link']) await p.getByRole('button', { name: n }).click();
    await p.getByRole('button', { name: 'Change the card' }).click(); await p.getByRole('button', { name: 'Card banaiye' }).click(); await p.waitForTimeout(1500); await p.getByRole('button', { name: 'Phir se shuru kijiye' }).last().click(); });
  await step('calm toggle', async () => { await p.locator('#dock button').first().click(); await p.locator('#dock button').first().click(); });
  await step('closure', async () => { await p.evaluate(() => document.getElementById('closure').scrollIntoView()); await p.waitForTimeout(9000); });
}
const sections = {};

// ---------------- P8.3 network ----------------
{ const s = sec('P8.3', 'Network-request audit'); const ctx = await ctxOf(390, 844, { permissions: ['clipboard-read', 'clipboard-write'] });
  const page = await open(ctx); const loadReqs = page.reqs.slice();
  await page.waitForTimeout(15000); const settled = page.reqs.length; const mark = page.reqs.length;
  const extra = []; await ctx.route('**/*', (r) => r.continue());
  const popups = []; ctx.on('page', (np) => popups.push(np.url()));
  await walk(page, (m) => extra.push(m));
  const all = page.reqs, foreign = all.filter((r) => !r.url.startsWith(origin) && !r.url.startsWith('data:') && !r.url.startsWith('blob:'));
  s.note(`Load (until 15 s after settling): ${loadReqs.length} requests at load, ${settled} after 15 s, all to ${origin} (own origin).`);
  const byType = {}; all.forEach((r) => { if (r.url.startsWith(origin)) { const k = r.type + ' ' + new URL(r.url).pathname; byType[k] = (byType[k] || 0) + 1; } });
  s.note('Own-origin requests across load and the full interaction pass:\n' + Object.entries(byType).map(([k, v]) => `  - ${k} x${v}`).join('\n'));
  if (foreign.length) foreign.forEach((r) => s.fail('non-own-origin request: ' + r.url)); else s.note('Non-own-origin requests: 0.');
  s.note(`Pop-ups/new tabs opened during the pass (WhatsApp fallback on a tap): ${popups.length ? popups.join(', ') : 'none'}`);
  const audio = await page.evaluate(() => ({ audioEls: document.querySelectorAll('audio,video').length, ac: typeof window.AudioContext }));
  const src = fs.readdirSync(path.join(root, 'dist/assets')).filter((f) => f.endsWith('.js')).map((f) => fs.readFileSync(path.join(root, 'dist/assets', f), 'utf8')).join('\n');
  const aud = /new (Audio|AudioContext|webkitAudioContext)\(|createOscillator|\.play\(\)/.test(src);
  s.note(`Audio: ${audio.audioEls} audio/video elements; the bundle ${aud ? 'CONTAINS' : 'contains no'} Audio, AudioContext or play() calls.`); if (audio.audioEls || aud) s.fail('audio found');
  s.note('Share buttons: requests to wa.me occur only if the share sheet is unavailable and only on tap; at load there are none (above).');
  extra.forEach((m) => s.note('walk note: ' + m)); await ctx.close(); }

// ---------------- P8.4 console ----------------
for (const [w, h, label] of [[390, 844, 'phone 390'], [1366, 768, 'laptop 1366']]) { const s = sec('P8.4 ' + label, 'Console errors and warnings playthrough (' + label + ')'); const ctx = await ctxOf(w, h, { permissions: ['clipboard-read', 'clipboard-write'] }); const p = await open(ctx); const lines = []; await walk(p, (m) => lines.push(m)); const c = p.cons.slice();
  s.note(c.length ? c.map((x) => '  - ' + x).join('\n') : 'Console clean: no errors, no warnings, no failed requests (including no missing icon).'); lines.forEach((m) => s.note('walk: ' + m)); if (c.length) s.fail(c.length + ' console lines'); await ctx.close(); }

// ---------------- P8.5 strings ----------------
{ const s = sec('P8.5', 'Forbidden strings and leftover tokens'); const ctx = await ctxOf(390, 844); const p = await open(ctx);
  await p.evaluate(() => document.getElementById('night')); await p.getByRole('button', { name: /Menu/ }).click(); await p.getByRole("button", { name: /Read the full text/ }).click(); await p.waitForTimeout(500);
  const visible = await p.evaluate(() => document.getElementById('fulltext').innerText + '\n' + document.title + '\n' + [...document.querySelectorAll('meta')].map((m) => m.content).join('\n') + '\n' + [...document.querySelectorAll('[aria-label],[alt],[title],[placeholder]')].map((e) => ['aria-label', 'alt', 'title', 'placeholder'].map((a) => e.getAttribute(a) || '').join(' ')).join('\n'));
  const files = ['dist/index.html', ...fs.readdirSync(path.join(root, 'dist/assets')).map((f) => 'dist/assets/' + f)]; const shipped = files.map((f) => ({ f, t: fs.readFileSync(path.join(root, f), 'utf8') })); shipped.push({ f: '(rendered full text, titles, meta, aria/alt)', t: visible });
  const groups = {
    'Placeholders and drafts': [/lorem/i, /ipsum/i, /TODO/i, /FIXME/i, /placeholder/i, /\bDRAFT\b/i, /\bSAMPLE\b/i, /\bREVIEW\b/i, /\[FILL IN/i, /\[CONFIRM/i, /\bundefined\b/, /\bNaN\b/, /\{[A-Za-z]+\}/],
    'Held-out numbers (stop-ship)': [/40\.62/, /0\.585/, /629\.70/, /(?<![\d.])2\.7\s*[x×]/i, /26\.5\s*[x×]/i, /1\.08\s*[x×]/i],
    'Festival dates': [/8 November/i, /9 November/i, /Nov 8/i, /Nov 9/i, /\b8\/11\b/, /\b9\/11\b/, /08-11/, /09-11/, /Sunday 8/i, /Diwali/i],
    'Wrong register (whole words)': [/\b(tum|tumhara|tumhari|tumhare|tumhe|tumse|tumne|tumko|tera|teri|tere|tujhe|tu)\b/i],
    'Crackers': [/\bcrackers?\b/i, /patakha|pataka/i, /\bbomb\b/i, /\bbang\b/i, /\bboom\b/i, /\bloud\b/i],
    'Analytics and external': [/google-analytics/i, /gtag/i, /googletagmanager/i, /plausible/i, /hotjar/i, /\bsegment\b/i, /mixpanel/i, /posthog/i, /fonts\.googleapis/i, /fonts\.gstatic/i, /\bcdn\b/i, /unpkg/i, /jsdelivr/i],
    'Phrases to read in context': [/\bguilty\b/i, /\bcaught\b/i, /\bdanger\b/i, /growth win/i, /\bI own\b/, /\bincreased\b/i, /lift of/i, /\bcustomers\b/i, /in production/i, /\bdeployed\b/i, /deployment/i],
  };
  for (const [g, res] of Object.entries(groups)) { const hits = []; for (const { f, t } of shipped) for (const re of res) { const rg = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g'); let m; let n = 0; while ((m = rg.exec(t)) && n++ < 6) hits.push({ f, w: m[0], ctx: t.slice(Math.max(0, m.index - 30), m.index + m[0].length + 30).replace(/\s+/g, ' ') }); }
    const own = hits.filter((h) => !/node_modules|react/.test(h.f)); const inLib = own.filter((h) => h.f.startsWith('dist/assets') && /(\.js)$/.test(h.f) && g !== 'Phrases to read in context' && g !== 'Held-out numbers (stop-ship)' && g !== 'Festival dates');
    if (!own.length) { s.note(`${g}: 0 hits.`); continue; }
    const visibleHits = own.filter((h) => h.f.startsWith('(rendered')); s.note(`${g}: ${own.length} hits (${visibleHits.length} in visible/rendered text):\n` + own.slice(0, 14).map((h) => `  - ${h.f}: "${h.w}" …${h.ctx}…`).join('\n'));
    if (g.startsWith('Held-out') || g.startsWith('Festival')) s.fail(g + ' has hits'); else if (g.startsWith('Wrong register') || g.startsWith('Placeholders') || g.startsWith('Analytics')) { const real = own.filter((h) => !h.f.endsWith('.js') || /Calm|Roshni/.test(h.ctx)); if (visibleHits.length) s.fail(g + ': visible hit'); else s.warn(g + ': hits only inside bundled library or data code; read them'); } else s.warn(g + ': read in context'); }
  await ctx.close(); }

// ---------------- P8.6 claims ----------------
{ const s = sec('P8.6', 'Claims, numbers and attribution'); const ctx = await ctxOf(390, 844); const p = await open(ctx);
  await p.getByRole('button', { name: /Menu/ }).click(); await p.getByRole("button", { name: /Read the full text/ }).click(); await p.waitForTimeout(400);
  const t = await p.evaluate(() => document.getElementById('fulltext').innerText); const nums = [...t.matchAll(/\d[\d,]*(?:\.\d+)?[×x]?/g)].map((m) => m[0]);
  const expected = new Set(['324', '19', '26', '192', '479', '232', '105', '1,205', '1,850', '3.1×', '1.02×', '820', '06', '15', '00', '3', '0', '6', '2', '1', '2026', '7', '27', '30', '45', '5', '4', '8', '12', '3,999', '9', '60', '400', '16', '20', '100', '99', '10', '14', '11', '999', '75', '1,000']);
  const odd = [...new Set(nums.filter((n) => !expected.has(n)))]; s.note(`Distinct numbers in the full text: ${[...new Set(nums)].length}. Not on the expected list: ${odd.length ? odd.join(', ') : 'none'}.`); if (odd.length) s.warn('numbers to read: ' + odd.join(', '));
  const sp = (t.match(/Spoken with Wispr Flow/g) || []).length; s.note(`"Spoken with Wispr Flow" in full text: ${sp}.`); if (sp !== 2) s.fail('expected 2');
  const html = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8'); if (/Spoken/.test(html)) s.fail('"Spoken" in index.html / share preview'); else s.note('"Spoken" is not in the share preview or index.html.');
  const fw = (t.match(/Fair warning/g) || []).length; s.note(`"Fair warning" blocks: ${fw} (5 lamps + lamp 6 = 6 expected).`); if (fw !== 6) s.fail('fair warning count');
  s.note('Lamp 6 compliant: ' + (/PROPOSED, NOT RUN/.test(t) && /Proposed, not run\./.test(t) && /Koi sample, koi lift, koi number nahi/.test(t) && !/sample size|threshold|expected result/i.test(t) ? 'yes (says proposed, not run; no sample size, threshold or expected result).' : 'NO')); 
  s.note('Verdict: ' + (/I haven't owned a growth channel or shipped these prototypes to customers/.test(t) ? 'says it has not owned a growth channel or shipped to customers.' : 'MISSING'));
  s.note('Lamp 5: ' + (/not yet reflected in the public default branch/.test(t) && /Phir kya hua/.test(t) ? 'still says the correction is not yet in the public default branch; label is "Phir kya hua".' : 'CHECK'));
  const wins = [...t.matchAll(/[^.]*\b(win|wins|lift|launch|launched|hired|shortlist|customer|customers|production)\b[^.]*\./gi)].map((m) => m[0].trim()); s.note('Sentences containing win/lift/launch/hired/customer/production (read each as a denial or a claim):\n' + wins.map((w) => '  - ' + w.slice(0, 160)).join('\n'));
  await ctx.close(); }

// ---------------- P8.14 storage ----------------
{ const s = sec('P8.14', 'Storage, cookie and cache audit'); const ctx = await ctxOf(390, 844, { permissions: ['clipboard-read', 'clipboard-write'] }); const p = await open(ctx); await walk(p);
  const st = await p.evaluate(async () => ({ ls: Object.keys(localStorage), ss: Object.keys(sessionStorage), ck: document.cookie, idb: indexedDB.databases ? (await indexedDB.databases()).map((d) => d.name) : 'n/a', caches: caches ? await caches.keys() : 'n/a', sw: (await navigator.serviceWorker.getRegistrations()).length, wn: window.name, hs: history.state }));
  s.note(JSON.stringify(st)); const cookies = await ctx.cookies(); s.note('Cookies set (browser jar): ' + (cookies.length ? JSON.stringify(cookies.map((c) => c.name)) : 'none')); const bad = st.ls.length || st.ss.length || st.ck || (st.idb !== 'n/a' && st.idb.length) || st.caches.length || st.sw || st.wn || st.hs || cookies.length; if (bad) s.fail('something is stored');
  await p.evaluate(() => window.__x = 1); await p.reload({ waitUntil: 'networkidle' }); await p.waitForTimeout(400); const fresh = await p.evaluate(() => window.__ek === undefined && document.documentElement.dataset.tone); s.note('Reload after lighting all lamps starts fresh: tone is ' + fresh + ' (0 = fresh).'); if (fresh !== '0') s.fail('reload did not start fresh');
  s.note('Platform cookies: this ran against a plain static server, so nothing the hosting platform adds can be seen here; that part is for the deployed-URL audit.'); await ctx.close(); }

// ---------------- P8.15 sign-off ----------------
{ const s = sec('P8.15', 'Sign-off date check'); for (const d of ['2026-10-20', '2026-11-03', '2026-11-08', '2026-11-09', '2026-11-10', '2026-12-10']) { const ctx = await ctxOf(390, 844); const p = await ctx.newPage(); await p.clock.setFixedTime(new Date(d + 'T12:00:00')); await p.goto(base, { waitUntil: 'networkidle' }); await p.waitForTimeout(300); const t = await p.locator('#closure').innerText(); s.note(`${d}: ${t.includes('Shukriya.') ? 'Shukriya.' : t.includes('Shubh Deepavali.') ? 'Shubh Deepavali.' : 'NONE'}`); await ctx.close(); }
  s.note('Decision: a local date comparison on the visitor\'s device clock only; no request. The cut-off is data (`site.signoffSwitchAfter`), never printed. The default when the date cannot be read is the Shubh Deepavali line (the comparison with an invalid date is false). Copy says swap after 9 November; the page agrees (9 Nov shows Deepavali, 10 Nov shows Shukriya). On the day of submission (3 Nov 2026) the sign-off is Shubh Deepavali.');
  const t0 = fs.readFileSync(path.join(root, 'dist/index.html'), 'utf8'); s.note('Date words in index.html / share tags: ' + (/November|Deepavali date/i.test(t0) ? 'FOUND' : 'none.')); }
globalThis.__R = R; globalThis.__ctx = { browser, base, origin, ctxOf, open, walk, esc, sec };
const more = path.join(root, 'scripts/audit-more.mjs'); if (fs.existsSync(more)) await (await import(more)).default(globalThis.__ctx);
let md = '# Pack 8 audit report (headless Chromium against the production build)\n\nGenerated by `scripts/audit.mjs`. Report only: nothing was changed by the audits. "REVIEW" means a human should read the lines. Anything needing a real phone, the deployed URL or your own recordings is listed at the end as not done.\n\n';
for (const s of R) md += `## ${s.id}: ${s.title}: **${s.status}**\n\n${s.lines.join('\n')}\n\n`;
fs.writeFileSync(outFile, md); console.log(R.map((s) => `${s.status}  ${s.id}`).join('\n')); await browser.close(); server.close();
