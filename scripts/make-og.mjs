// Build-time share image (1200x630) drawn from an SVG in code and rendered locally. Nothing here ships to the page.
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const out = path.join(root, 'dist/og.png');
const lamp = (x, y, lit) => `
  <g transform="translate(${x} ${y})">
    ${lit ? '<circle cx="0" cy="-34" r="86" fill="url(#glow)"/>' : ''}
    <path d="M-52 0h104c0 30-24 50-52 50S-52 30-52 0z" fill="${lit ? '#C2410C' : '#35200C'}"/>
    <ellipse cx="0" cy="0" rx="52" ry="9" fill="${lit ? '#A33A0A' : '#251609'}"/>
    <rect x="-3" y="-14" width="6" height="14" rx="2" fill="${lit ? '#FFF3DC' : '#6b5a45'}"/>
    ${lit ? '<path d="M0-96c14 20 22 34 22 52a22 22 0 0 1-44 0c0-18 8-32 22-52z" fill="#FF7A1A"/><path d="M0-80c9 14 14 24 14 36a14 14 0 0 1-28 0c0-12 5-22 14-36z" fill="#FFB347"/><path d="M0-64c5 8 8 14 8 22a8 8 0 0 1-16 0c0-8 3-14 8-22z" fill="#FFD27A"/>' : ''}
  </g>`;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs><radialGradient id="glow"><stop offset="0" stop-color="#FFD27A" stop-opacity=".55"/><stop offset="1" stop-color="#FFD27A" stop-opacity="0"/></radialGradient></defs>
  <rect width="1200" height="630" fill="#0A0705"/>
  <text x="70" y="100" font-family="ui-monospace,Menlo,monospace" font-size="24" letter-spacing="4" fill="#F5A623">EK DIYA SE DOOSRA · Shriniwas Kholkute</text>
  <text x="70" y="200" font-family="Georgia,'Noto Serif',serif" font-size="58" fill="#FFF3DC">324 tests passed. 19 problems found.</text>
  ${[0, 1, 2, 3, 4, 5].map((i) => lamp(150 + i * 180, 440, i === 0)).join('')}
</svg>`;
try {
  const { chromium } = require('playwright');
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
  await p.setContent(`<body style="margin:0">${svg}</body>`);
  fs.mkdirSync(path.dirname(out), { recursive: true });
  await p.screenshot({ path: out, type: 'png' });
  await b.close();
  console.log('make-og: wrote dist/og.png (' + (fs.statSync(out).size / 1024).toFixed(0) + ' KB)');
} catch (e) {
  console.log('make-og: could not render the share image (' + e.message.split('\n')[0] + '). Supply a hand-made dist/og.png.');
}
