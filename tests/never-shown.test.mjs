import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs'; import path from 'node:path';
// The respect rule (E6.8): geometry, marigold, mango leaf, diya, kandil, string lights, sparklers and fireworks are the whole vocabulary.
const BAN = [/\bowl\b/i, /swastika/i, /\bkalash\b/i, /\bpaduka\b/i, /\btilak\b/i, /\baarti\b/i, /\bpuja\b/i, /\bdeity\b/i, /\bhamper\b/i, /\bgift\b/i, /\bOm\b(?=[ .;,'"])/];
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
test('no banned vocabulary in the culture-pack files', () => {
  const files = walk('src/elev').concat(['src/elev/kolam.js']).filter((f) => /\.(js|css)$/.test(f)).concat(walk('src/styles/elev')).filter((f, i, a) => a.indexOf(f) === i);
  const hits = [];
  for (const f of files) { const s = fs.readFileSync(f, 'utf8'); for (const re of BAN) { const m = re.exec(s); if (m) hits.push(`${f}: ${m[0]}`); } }
  assert.deepEqual(hits, []);
});
