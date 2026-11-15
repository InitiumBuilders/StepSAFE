/* Gratus and Gratus Gold: what a run earns. Pure, so the probe can test it.

   Gratus pays for a first hold at each notch of each gauge (one more than
   the notch), and one more for the first time the run matches the reference
   there. Nothing pays twice.

   Gratus Gold is rare and paid only by these rules:
     notch   a hold at notch 5, 7, 9 or any odd notch above, at or above the
             reference, with every catalog threat stopped by a catalog structure
     beyond  the first hold of a gauge past its catalog ceiling, the notch
             where an exact search proves no catalog stack can hold
   If the stack carries MoTRUS models, each one needs a review from Claude
   marked sound before the hold earns Gold. A review never pays on its own. */

import type { GaugeResult, ReferenceResult } from './score';

export interface PrevLevel { held?: boolean; beatRef?: boolean; gold?: boolean; best?: number }

export interface RewardInput {
  notch: number;
  result: GaugeResult;
  ref: ReferenceResult;
  prevLevel: PrevLevel | undefined;
  /** this gauge already earned its past-the-ceiling Gold */
  hadBeyond: boolean;
  motrusCount: number;
  /** every MoTRUS model in the stack has a sound review for this gauge */
  motrusSound: boolean;
}

export interface Reward {
  held: boolean;
  beatRef: boolean;
  gratus: number;
  gold: 'notch' | 'beyond' | null;
  firstHoldHere: boolean;
  firstRefHere: boolean;
  /** why Gold was not paid, when it nearly was */
  goldBlocked: string | null;
}

export const GOLD_FROM = 5;

export function isGoldNotch(n: number): boolean {
  return n >= GOLD_FROM && n % 2 === 1;
}

export function rewardFor(i: RewardInput): Reward {
  const held = i.result.verdict === 'holds';
  const beatRef = held && i.result.score >= i.ref.result.score;
  const lv = i.prevLevel;
  const firstHoldHere = held && !lv?.held;
  const firstRefHere = beatRef && !lv?.beatRef;
  let gratus = 0;
  if (firstHoldHere) gratus += 1 + i.notch;
  if (firstRefHere) gratus += 1;

  let gold: Reward['gold'] = null;
  let goldBlocked: string | null = null;
  const gate = i.motrusCount === 0 || i.motrusSound;
  if (held && !lv?.gold) {
    const notchGold = isGoldNotch(i.notch) && beatRef && i.result.catalogOnly;
    const beyondGold = i.ref.coverable === false && !i.hadBeyond;
    if (notchGold || beyondGold) {
      if (gate) gold = beyondGold ? 'beyond' : 'notch';
      else goldBlocked = 'Your stack carries a MoTRUS model without a sound review from Claude. Review it, then run again.';
    } else if (isGoldNotch(i.notch) && !beatRef) {
      goldBlocked = 'Gold at this notch needs a score at or above the reference.';
    } else if (isGoldNotch(i.notch) && !i.result.catalogOnly) {
      goldBlocked = 'Gold at this notch needs every catalog threat stopped by a catalog structure.';
    }
  }
  return { held, beatRef, gratus, gold, firstHoldHere, firstRefHere, goldBlocked };
}
