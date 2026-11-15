/* Intuition integration — documenting learning as Atoms and Triples.

   The Intuition protocol models knowledge as a token-curated graph:
     Atom   — an identity primitive (a person, a skill, a milestone).
     Triple — a semantic claim: subject —predicate→ object.
     Signal — economic weight staked for (or against) a claim.

   StepSAFE composes attestation drafts from real learner progress. The learner
   reviews each claim, then carries it to the Intuition portal to mint with
   their own wallet. We deliberately do NOT auto-mint: an attestation you did
   not read is exactly the failure mode this curriculum teaches against.
   Statement: a claim you stake is a claim you own. */

import type { AttestDraft } from './state';
import { uid } from './state';

export const INTUITION = {
  portal: 'https://portal.intuition.systems',
  docs: 'https://docs.intuition.systems',
  explorer: 'https://portal.intuition.systems/explore',
};

export function milestoneTriple(handle: string, predicate: string, object: string, context: string): AttestDraft {
  return {
    id: uid(),
    subject: handle || 'learner',
    predicate,
    object,
    context,
    at: Date.now(),
    status: 'draft',
  };
}

export function draftForPage(handle: string, pageTitle: string): AttestDraft {
  return milestoneTriple(
    handle,
    'has earned',
    'Page: ' + pageTitle,
    'StepSAFE :: The Praxis — Page credential, verified by completed Steps and drills.'
  );
}

export function draftForChapter(handle: string, chapterTitle: string): AttestDraft {
  return milestoneTriple(
    handle,
    'has completed',
    'Chapter: ' + chapterTitle,
    'StepSAFE :: The Praxis — full Chapter completion across all Pages.'
  );
}

export function draftForSim(handle: string, simTitle: string, score: number): AttestDraft {
  return milestoneTriple(
    handle,
    'has commanded',
    'Simulation: ' + simTitle,
    'StepSAFE :: The Practice — simulation completed with score ' + score + '.'
  );
}

export function draftForAward(handle: string, tier: string, awardName: string): AttestDraft {
  return milestoneTriple(
    handle,
    'has been recognized for',
    tier + ': ' + awardName,
    'StepSAFE :: Steps — milestone award on the learner record.'
  );
}

export function draftForProject(handle: string, title: string): AttestDraft {
  return milestoneTriple(
    handle,
    'has shipped',
    'Praxis Project: ' + title,
    'StepSAFE :: Praxis — project-based learning with attached evidence.'
  );
}

/** Human-readable claim line, the way a triple reads in the graph. */
export function tripleText(d: AttestDraft): string {
  return d.subject + ' — ' + d.predicate + ' → ' + d.object;
}

/** Exportable JSON for the learner to carry into the portal or SDK. */
export function exportDraft(d: AttestDraft): string {
  return JSON.stringify(
    {
      protocol: 'intuition',
      kind: 'triple-draft',
      subject: { label: d.subject, type: 'atom' },
      predicate: { label: d.predicate, type: 'atom' },
      object: { label: d.object, type: 'atom' },
      context: d.context,
      createdAt: new Date(d.at).toISOString(),
      note: 'Mint via portal.intuition.systems or @0xintuition/sdk with your own wallet.',
    },
    null,
    2
  );
}
