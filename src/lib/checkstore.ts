/* The treasury checks (Dash Defenders) are held by the keyring, beside the learner's keys (lib/keyring.ts): in this
   page's memory for the visit, or sealed on this device under the keyring's passphrase. A check lists a treasury's
   weak points, so it never enters the main record, its export or its import. */

import { useKeyring, heldChecks, setHeldChecks, legacyChecksMoved, type KeyringStatus } from './keyring';
import type { TreasuryCheck } from './check';
import type { CheckAnswer } from '../content/check/types';
import type { Reading } from './evidence';

export function useChecks(): { checks: TreasuryCheck[]; status: KeyringStatus; legacy: boolean } {
  const { status } = useKeyring();
  return { checks: heldChecks(), status, legacy: legacyChecksMoved() };
}

const edit = (id: string, f: (c: TreasuryCheck) => TreasuryCheck) => setHeldChecks(heldChecks().map((c) => (c.id === id ? f(c) : c)));

export function newCheck(id: string, project = '', kind = 'treasury'): void {
  setHeldChecks([{ id, kind, project: project.slice(0, 80), answers: {}, at: Date.now() }, ...heldChecks()]);
}

export function nameCheck(id: string, project: string): void {
  edit(id, (c) => ({ ...c, project: project.slice(0, 80) }));
}

export function answerCheck(id: string, item: string, answer: CheckAnswer, total: number): void {
  edit(id, (c) => {
    const answers = { ...c.answers, [item]: answer };
    const done = c.done || (Object.keys(answers).length >= total ? Date.now() : undefined);
    return { ...c, answers, ...(done ? { done } : {}) };
  });
}

/** a public record read for one statement; it is kept with the run and sealed with it */
export function setReading(id: string, item: string, reading: Reading): void {
  edit(id, (c) => ({ ...c, evidence: { ...(c.evidence || {}), [item]: reading } }));
}

/** several statements read from one record at once, such as a repository's Scorecard results */
export function setReadings(id: string, readings: Record<string, Reading>): void {
  edit(id, (c) => ({ ...c, evidence: { ...(c.evidence || {}), ...readings } }));
}

export function removeCheck(id: string): void {
  setHeldChecks(heldChecks().filter((c) => c.id !== id));
}
