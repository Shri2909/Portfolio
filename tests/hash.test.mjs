import test from 'node:test';
import assert from 'node:assert/strict';
import { parseHash, isShareFragment } from '../src/lib/hash.js';
import { parseRowHash, formatRowHash, sanitiseName } from '../src/lib/rowhash.js';

test('hash grammar (P1.7 cases)', () => {
  assert.equal(isShareFragment('#v1.7.Asha'), true);
  assert.deepEqual(parseHash('#v1.7.Asha'), { route: 'share' });
  assert.deepEqual(parseHash('#v1'), { route: 'share' });
  assert.deepEqual(parseHash('#sixty'), { route: 'sixty' });
  assert.deepEqual(parseHash('#text'), { route: 'text' });
  assert.deepEqual(parseHash('#evidence/c3'), { route: 'evidence', folder: 'c3' });
  assert.deepEqual(parseHash('#evidence/c9'), { route: 'evidence' });
  assert.equal(parseHash('#hello'), null);
  assert.deepEqual(parseHash('#wish'), { route: 'scroll', id: 'wish' });
  assert.equal(parseHash('#' + 'x'.repeat(300)), null);
});

test('share fragment sample links (P6.7)', () => {
  const ok = (h, count, name = '') => assert.deepEqual(parseRowHash(h), { kind: 'ok', count, name }, h);
  const bad = (h) => assert.equal(parseRowHash(h).kind, 'bad', h);
  ok('#v1.7.Asha', 7, 'Asha');
  ok('#v1.0', 0);
  ok('#v1.1', 1);
  ok('#v1.z', 35);
  ok('#v1.2s.Priya', 100, 'Priya');
  ok('#v1.7.A1sha', 7, 'Asha');
  ok('#v1.7.%E0%A4%85%E0%A4%A8%E0%A4%BF%E0%A4%A4%E0%A4%BE', 7, 'अनिता');
  ok('#v1.7.Averylongnamethatgoesonandon', 7, 'Averylongnamethatgoe');
  ok('#v1.7.%3Cb%3EX', 7, 'bX');
  bad('#v1.7.Asha.extra'); bad('#v1.-5'); bad('#v1.9999'); bad('#v2.3.x'); bad('#v1.'); bad('#v1.7.%E0%A4');
  assert.equal(parseRowHash('#wish').kind, 'none');
  assert.equal(parseRowHash('').kind, 'none');
});

test('writer', () => {
  assert.equal(formatRowHash(8, 'Asha'), '#v1.8.Asha');
  assert.equal(formatRowHash(100, ''), '#v1.2s');
  assert.equal(formatRowHash(99999, ''), '#v1.zzz');
  assert.equal(sanitiseName('Mary-Ann'), 'MaryAnn');
});

test('sanitiseName keeps ZWJ/ZWNJ between letters only (E6.8)', () => {
  const ZWJ = '‍', ZWNJ = '‌';
  assert.equal(sanitiseName('ന' + ZWJ + 'ഹ'), 'ന' + ZWJ + 'ഹ');
  assert.equal(sanitiseName('ന' + ZWNJ + 'ഹ'), 'ന' + ZWNJ + 'ഹ');
  assert.equal(sanitiseName(ZWJ + 'ന'), 'ന');
  assert.equal(sanitiseName('ന' + ZWJ), 'ന');
  assert.equal(sanitiseName('A1 sha'), 'Asha');
  assert.equal(sanitiseName('a' + ZWJ + ZWJ + 'b'), 'a' + ZWJ + 'b');
  assert.equal(sanitiseName('x'.repeat(30)).length, 20);
});
