// check-copy: every string in copy.json must appear word for word in website_copy.md
// (or, for evidence bodies, in reference/content.json). Strings under ui.extra are new
// interface labels that need Shriniwas's approval: they are listed, not failed.
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const copy = JSON.parse(fs.readFileSync(path.join(root, 'src/data/copy.json'), 'utf8'));
const norm = (s) => s.replace(/\*\*/g, '').replace(/\*/g, '').replace(/\s+/g, ' ').trim();
const md = norm(['website_copy_lamps.md', 'website_copy_v3.md', 'website_copy.md'].map((f) => fs.readFileSync(path.join(root, f), 'utf8')).join('\n'));   // v3 copy, plus v2 as history for the [SAME] strings
const contentRaw = fs.readFileSync(path.join(root, 'reference/content.json'), 'utf8');
const contentStrings = new Set();
(function walk(v) { if (typeof v === 'string') contentStrings.add(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); })(JSON.parse(contentRaw));

const SCHEMA_KEYS_OPEN = new Set(); // keys are free-form in this project; unknown-key check is against the allowed top level
const TOP = ['baithak', 'growth', 'terrace', 'transitions', 'slots', 'version', '_review', 'flags', 'site', 'ui', 'opening', 'lamps', 'guess', 'lateReply', 'voice', 'verdict', 'wish', 'closure', 'evidence', 'sixty', 'footer', 'journey', 'transition'];
const problems = [], unmatched = [], approval = [];
for (const k of Object.keys(copy)) if (!TOP.includes(k)) problems.push('unknown top-level key: ' + k);

const NON_COPY = /^(url|id|n|lamp|folder|flag|href|key|url|min|max|step|start|deadline|version|lang|signoffSwitchAfter|answer|enabled|options|email|linkedin|resume|essay|interaction)$/;
// spokenAfter is the second half of a pair given as one line in the source; aria strings are English labels (approval list).
const APPROVAL_KEYS = /^(aria|spokenAfter)$/;
function matches(s) {
  const t = norm(s.replace(/<\/?hi>/g, '').replace(/\{[^}]+\}/g, '\u0000'));
  return t.split('\u0000').map((x) => x.trim()).filter(Boolean).every((frag) => md.includes(frag) || md.replace(/’/g, "'").includes(frag));
}
function walk(v, p, inExtra, inEvidence) {
  const last = p.split('.').pop();
  if (last.startsWith('_') && !p.startsWith('ui.extra')) return;
  if (typeof v === 'string') {
    if (!v || NON_COPY.test(last)) return;
    if (inExtra || APPROVAL_KEYS.test(last)) { approval.push(p); return; }
    if (inEvidence) { if (!contentStrings.has(v) && !matches(v)) unmatched.push(p + ': ' + v.slice(0, 70)); return; }
    if (/^https?:/.test(v)) return;
    if (!matches(v)) unmatched.push(p + ': ' + v.slice(0, 70));
  } else if (Array.isArray(v)) v.forEach((x, i) => walk(x, p + '.' + i, inExtra, inEvidence));
  else if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, p ? p + '.' + k : k, inExtra || (p + '.' + k) === 'ui.extra', inEvidence || (p + '.' + k) === 'evidence.folders.0.body' || /^evidence\.folders\.\d+\.body$/.test(p + '.' + k));
}
walk(copy, '', false, false);

// shape checks
if (copy.lamps.length !== 3) problems.push('lamps must be 3 (Certgen, Blitz, Vigil)');
if (copy.voice.takes.length !== 2) problems.push('takes must be 2');
if (copy.evidence.folders.length !== 5) problems.push('evidence folders must be 5');
const SPOKEN = (JSON.stringify(copy).match(/Spoken with Wispr Flow/g) || []).length;
if (SPOKEN !== 2) problems.push('"Spoken with Wispr Flow" appears ' + SPOKEN + ' times, expected 2');
for (const f of ['ledgerGate_personFirstSentence', 'flowIntoEmergentRecorded', 'noAnalyticsLine', 'footerHowMade'])
  if (copy.flags[f] !== false) problems.push('gated flag is ON: ' + f + ' (needs Shriniwas)');
for (const f of Object.keys(copy.flags)) if ((f.startsWith('meet.') && f !== 'meet.mergeThin') || f.startsWith('bring.')) if (copy.flags[f] !== false) problems.push('gated flag is ON: ' + f);
if (copy.flags['meet.mergeThin'] !== true) problems.push('meet.mergeThin should default ON');
if (copy.voice.buildLine !== null) problems.push('voice.buildLine must be null');

console.log(`check-copy: ${unmatched.length} strings not found word-for-word in the sources, ${approval.length} new interface labels under ui.extra (need approval).`);
for (const u of unmatched) console.log('  NOT IN SOURCE  ' + u);
for (const p of problems) console.log('  PROBLEM  ' + p);
if (process.argv.includes('--labels')) console.log('  labels needing approval:\n   ' + approval.join('\n   '));
process.exit(problems.length || unmatched.length ? 1 : 0);
