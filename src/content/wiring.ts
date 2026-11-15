/* Milestone wiring — app events to award ids.
   Only wired where the award's criteria honestly matches the app event;
   everything else is granted by content references (step.awards, sim.awards).
   Unknown ids are ignored by the engine. */

export const MILESTONES: Record<string, string[]> = {
  'first-step': ['small-first-light'],
  'first-sim': ['small-first-tabletop'],
  'first-attestation': ['small-first-atom'],
};
