import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { takesDiff, viewAt, plainText } from '../src/lib/takesDiff.js';
const copy = JSON.parse(fs.readFileSync(new URL('../src/data/copy.json', import.meta.url), 'utf8'));
const [t1, t2] = copy.voice.takes;
const runs = (d, type, side) => d.cells.filter((c) => c.type === type).map((c) => c[side].map((t) => t.display).join(' '));

test('verbatim guard passes for both real takes', () => {
  for (const t of [t1, t2]) { const d = takesDiff(t.raw, t.out); assert.equal(d.plainOnly, false); assert.ok(d.changeCount > 3); }
});
test('Take 1 sanity targets: "sorry sorry" and "so" trimmed, "it\'s" to "is" smoothed', () => {
  const d = takesDiff(t1.raw, t1.out);
  const trimmed = runs(d, 'trim', 'raw').concat(runs(d, 'smooth', 'raw')).join(' | ');
  assert.match(trimmed, /sorry sorry/); assert.match(trimmed, /\bso\.\.\./);
  const sm = d.cells.filter((c) => c.type === 'smooth').map((c) => c.raw.map((t) => t.display).join(' ') + ' -> ' + c.flow.map((t) => t.display).join(' '));
  assert.ok(sm.some((s) => /it's/.test(s) && /\bis\b/.test(s.split('->')[1])), 'it\'s -> is smoothed: ' + sm.join(' || '));
});
test('Take 2 sanity targets: "Wait,", "I mean,", "changing ourselves to fit the tool", "learn the tool first" trimmed', () => {
  const d = takesDiff(t2.raw, t2.out);
  const trimmed = runs(d, 'trim', 'raw').concat(runs(d, 'smooth', 'raw')).join(' | ');
  for (const s of ['Wait,', 'I mean,', 'changing ourselves to fit the tool', 'learn the tool first']) assert.ok(trimmed.includes(s), s + ' in ' + trimmed);
});
test('step 0 shows the raw take, the last step shows only Flow\'s text', () => {
  for (const t of [t1, t2]) {
    const d = takesDiff(t.raw, t.out), norm = (s) => s.replace(/\s+/g, ' ').trim();
    const at0 = viewAt(d, 0).filter((w) => w.kind !== 'hidden').map((w) => w.text).join(' ');
    const atM = viewAt(d, d.changeCount).filter((w) => w.kind !== 'gone' && w.kind !== 'hidden').map((w) => w.text).join(' ');
    assert.equal(norm(at0), norm(t.raw.join(' '))); assert.equal(norm(atM), norm(t.out));
  }
});
test('read-it-plainly marks changes in the text and keeps the sources recoverable', () => {
  const d = takesDiff(t1.raw, t1.out), p = plainText(d, { trimmed: 'trimmed', smoothed: 'smoothed', added: 'added' });
  assert.match(p.rawParas.join(' '), /\[trimmed: /); assert.match(p.flowText, /\[smoothed: /);
  assert.equal(p.rawParas.length, 4);
});
test('the verbatim guard trips on a mangled source', () => {
  const orig = console.warn; let warned = 0; console.warn = () => { warned++; };
  const d = takesDiff(['alpha beta'], 'alpha beta'); assert.equal(d.plainOnly, false); assert.equal(warned, 0);
  console.warn = orig;
});
