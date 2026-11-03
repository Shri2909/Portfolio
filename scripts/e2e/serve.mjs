// Tiny static server for the production build, shared by the v3 browser tests.
import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png' };
export function serve() {
  const srv = http.createServer((q, r) => { const u = decodeURIComponent(q.url.split('?')[0]); let f = path.join(root, 'dist', u === '/' ? 'index.html' : u); if (!f.startsWith(path.join(root, 'dist')) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) { f = path.join(root, 'dist/404.html'); r.writeHead(404, { 'content-type': 'text/html' }); return r.end(fs.readFileSync(f)); } r.writeHead(200, { 'content-type': MIME[path.extname(f)] || 'x' }); r.end(fs.readFileSync(f)); }).listen(0);
  return { srv, base: 'http://127.0.0.1:' + srv.address().port + '/' };
}
