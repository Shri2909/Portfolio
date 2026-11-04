import test from 'node:test';
import assert from 'node:assert/strict';
import { dominantScript, metricsFor } from '../src/elev/script.js';
import { sanitiseName } from '../src/lib/rowhash.js';

// fixtures live in tests only, never on the page
const FIX = { Devanagari: 'दीपावली की शुभकामनाएँ', Tamil: 'தீபாவளி நல்வாழ்த்துகள்', Telugu: 'దీపావళి శుభాకాంక్షలు', Kannada: 'ದೀಪಾವಳಿ ಶುಭಾಶಯಗಳು', Bengali: 'শুভ দীপাবলি', Malayalam: 'ദീപാവലി ആശംസകൾ', Gujarati: 'દિવાળીની શુભેચ્છાઓ', Gurmukhi: 'ਦੀਵਾਲੀ ਦੀਆਂ ਵਧਾਈਆਂ' };
test('dominant script and line rhythm per script', () => {
  for (const [s, t] of Object.entries(FIX)) { assert.equal(dominantScript(t), s); assert.ok(metricsFor(t).lh >= 1.5, s); }
  assert.equal(dominantScript('Happy new year'), 'Latin'); assert.equal(metricsFor('Happy new year'), null);
  assert.ok(metricsFor('Shubh दीपावली').lh >= 1.55); // mixed lines take the largest rhythm
});
test('sanitiseName keeps ZWJ between letters only', () => {
  assert.equal(sanitiseName('ന‍ഹ'), 'ന‍ഹ'); assert.equal(sanitiseName('‍ന'), 'ന'); assert.equal(sanitiseName('ന‍'), 'ന');
});
