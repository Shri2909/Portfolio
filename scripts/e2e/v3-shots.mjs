import { createRequire } from 'node:module'; import { serve } from './serve.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');
const { srv, base } = serve(); const b = await chromium.launch();
const S = [[390,844],[360,640],[412,915],[768,1024],[1366,768],[1366,650],[1920,1080]];
for (const [w,h] of S) { const c = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1 }); const p = await c.newPage(); await p.goto(base,{waitUntil:'networkidle'}); await p.waitForTimeout(800);
  await p.screenshot({ path:`docs/v3-shots/${w}x${h}-first.png` });
  const r = await p.evaluate(() => { const row=document.querySelector('.lamp-row'); const q=row&&row.getBoundingClientRect(); return {rowBottom:q&&Math.round(q.bottom), vh:innerHeight, hScroll: document.documentElement.scrollWidth>innerWidth}; });
  console.log(w+'x'+h, JSON.stringify(r)); await c.close(); }
await b.close(); srv.close();
