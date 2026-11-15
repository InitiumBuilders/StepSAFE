/* SEVA ON A CARD. A teach-back that reads the learner's own words against
   the card runs only on their own key, browser direct, so their words do not
   pass through the shared server. A scenario that puts the concept in an
   organisation like theirs runs on their key when they have one and
   otherwise through Seva's shared route, sending the card's text and the
   kind of organisation they named and nothing else. */

import { requestDirect, requestCounsel, directReady } from '../provider';
import type { ProviderConfig } from '../state';
import { cardText, type StudyCard } from './cards';

export { directReady as studyMindReady };

const TEACH_SYSTEM = `You are Seva, a mentor to people becoming security leaders. A learner has written, in their own words, what a concept means. Read it against the reference text.

Reply in plain text, under 220 words, in three short parts with these exact labels on their own lines:
WHAT HOLDS
WHAT IS MISSING OR OFF
ONE QUESTION TO GO DEEPER

Be specific to their words. Quote a phrase of theirs when you correct it. If their account is sound, say so plainly and use the second part for the one nuance a practitioner would add. Do not restate the reference text back to them.`;

const SCENE_SYSTEM = `You are Seva, a mentor to people becoming security leaders. Put one concept to work in a realistic organisation.

Reply in plain text, under 240 words, in three short parts with these exact labels on their own lines:
THE SITUATION
WHAT TO WATCH FOR
THE MOVE

The situation is a short, concrete scene in an organisation of the kind the learner names, or a mid sized one if they name none. What to watch for is two or three signals a practitioner would notice. The move is the one action that applies the concept, and what it costs. Do not invent statistics, named companies or incidents.`;

export interface MindResult { text: string | null; error?: string; model?: string }

export async function teachBack(p: ProviderConfig, card: StudyCard, ownWords: string): Promise<MindResult> {
  const body = '<concept>\n' + cardText(card) + '\n</concept>\n<their_words>\n' + ownWords.slice(0, 4000) + '\n</their_words>';
  const r = await requestDirect({ system: TEACH_SYSTEM, messages: [{ role: 'user', content: body }] }, p, { maxTokens: 3000, effort: 'medium' });
  return { text: r.text, error: r.error, model: r.model };
}

export async function scenario(p: ProviderConfig, card: StudyCard, org: string, shared?: { evolved: boolean; guise: string | null }): Promise<MindResult> {
  const body = '<concept>\n' + cardText(card) + '\n</concept>\n<organisation>' + (org.trim().slice(0, 200) || 'a mid sized organisation') + '</organisation>';
  if (directReady(p)) {
    const r = await requestDirect({ system: SCENE_SYSTEM, messages: [{ role: 'user', content: body }] }, p, { maxTokens: 3000, effort: 'medium' });
    return { text: r.text, error: r.error, model: r.model };
  }
  /* the shared route keeps its own Seva prompt, so the ask travels as the learner's message */
  const ask = 'Put one concept to work in a realistic organisation. Reply in plain text, under 240 words, in three short parts with these exact labels on their own lines: THE SITUATION, WHAT TO WATCH FOR, THE MOVE. The situation is a short concrete scene in the kind of organisation named below. What to watch for is two or three signals a practitioner would notice. The move is the one action that applies the concept, and what it costs. Do not invent statistics, named companies or incidents.\n\n' + body;
  const r = await requestCounsel({ messages: [{ role: 'user', content: ask }], progress: null, evolved: shared?.evolved ?? false, guise: shared?.guise ?? null }, p);
  return { text: r.text, error: r.error };
}

/** the question a card opens Seva with, on any route */
export function sevaQuestion(card: StudyCard): string {
  return 'Help me understand "' + card.title + '". In plain words: what it is, why it matters to a security leader, and one way I could see it in my own organisation.';
}
