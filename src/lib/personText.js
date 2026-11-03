import copy, { flags } from './copy.js';
// Person block paragraphs. The first sentence is gated by flags.ledgerGate_personFirstSentence.
export const personParas = () => {
  const [a, b] = copy.person.paras;
  return [(flags.ledgerGate_personFirstSentence ? copy.person.firstSentence + ' ' : '') + a, b];
};
