import copy, { flags } from './copy.js';
import { tpl } from './tpl.js';

// Meet Shriniwas: the text of every card, assembled once for the page and the full-text view.
// A line that depends on an unconfirmed slot renders only if its flag is ON and every slot in it is filled. Otherwise nothing renders (no placeholder, ever).
const slots = () => copy.slots || {};
export const filled = (str) => { const m = String(str).match(/\{(\w+)\}/g) || []; return m.every((t) => (slots()[t.slice(1, -1)] || '').trim()); };
export const fillSlots = (str) => tpl(str, slots());
const gated = (flag, str) => (flags[flag] && str && filled(str) ? [fillSlots(str)] : []);
const firstSentence = (t) => { const i = t.search(/(?<=[.!?])\s/); return i < 0 ? [t, ''] : [t.slice(0, i), t.slice(i + 1)]; };

export function meetCards() {
  const B = copy.baithak, thin = flags['meet.mergeThin'] && !flags['meet.debate.filled'] && !flags['meet.research.filled'];
  const [h1, r1] = firstSentence(B.c1.face);
  const roots = [...(flags['meet.roots.father'] ? [B.c2.father] : []), B.c2.face, ...gated('meet.roots.examOrder', '{EXAM_ORDER_LINE}'), ...gated('meet.roots.case', B.c2.caseLine)];
  const cards = {
    who: { id: 'who', pane: 0, title: B.c1.title, hook: h1, body: [r1], chips: B.c1.chips, proof: B.c1.proof },
    roots: { id: 'roots', pane: 0, title: B.c2.title, hook: B.c2.hook, body: roots },
    debate: thin
      ? { id: 'merged', pane: 1, title: B.merged.title, hook: firstSentence(B.merged.face)[0], body: [firstSentence(B.merged.face)[1]] }
      : { id: 'debate', pane: 1, title: B.c3.title, hook: B.c3.hook, body: [B.c3.face, ...gated('meet.debate.filled', B.c3.filled)], flip: B.c3 },
    essay: { id: 'essay', pane: 1, title: B.c4.title, hook: B.c4.hook, body: [B.c4.face, ...gated('meet.essay.idea', B.c4.idea), ...gated('meet.essay.berggruen', '{ESSAY_BERGGRUEN_LINE}')], essay: B.c4 },
    research: thin ? null : { id: 'research', pane: 2, title: B.c5.title, hook: firstSentence(B.c5.face)[0], body: [firstSentence(B.c5.face)[1], ...gated('meet.research.filled', B.c5.filled)].filter(Boolean) },
    loop: { id: 'loop', pane: 2, title: B.c6.title, steps: B.c6.steps, warning: B.c6.warning, extra: [...gated('meet.loop.ownWords', B.c6.own), ...gated('meet.outside', B.c6.outside)] },
    bring: { id: 'bring', pane: 3, title: B.c7.title, hook: B.c7.hook, items: B.c7.items.map((it) => ({ ...it, filledLine: flags['meet.research.filled'] && it.filled && filled(it.filled) ? fillSlots(it.filled) : '', share: flags['bring.indiaShare'] ? it.share : '' })) },
  };
  return { thin, cards, order: [cards.who, cards.roots, cards.debate, cards.essay, cards.research, cards.loop, cards.bring].filter(Boolean) };
}
