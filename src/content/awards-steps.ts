/* Step-granted awards, one module per chapter.

   These exist because every Step in the curriculum declares the awards it grants.
   Those ids were authored per-Step and had to be minted for real, or the Step
   paid out nothing. Merged with the behavioural awards in ./awards.ts, which are
   granted by engine triggers rather than by any single Step (see ./hooks.ts). */

import type { Award } from './schema';

import { AWARDS as A_FOUNDATIONS } from './awards/ch-foundations';
import { AWARDS as A_IDENTITY } from './awards/ch-identity';
import { AWARDS as A_DETECTION } from './awards/ch-detection';
import { AWARDS as A_APPSEC } from './awards/ch-appsec';
import { AWARDS as A_INCIDENT } from './awards/ch-incident';
import { AWARDS as A_GRC } from './awards/ch-grc';
import { AWARDS as A_CHAIN } from './awards/ch-chain';
import { AWARDS as A_DECINFRA } from './awards/ch-decinfra';
import { AWARDS as A_AI } from './awards/ch-ai';
import { AWARDS as A_CISO } from './awards/ch-ciso';
import { AWARDS as A_INTUITION } from './awards/ch-intuition';
import { AWARDS as A_DASHEVO } from './awards/ch-dashevo';
import { AWARDS as A_SIMS } from './awards/simulations';
import { AWARDS as A_MODUX } from './awards/modux';

export const STEP_AWARDS: Award[] = [
  ...A_FOUNDATIONS, ...A_IDENTITY, ...A_DETECTION, ...A_APPSEC,
  ...A_INCIDENT, ...A_GRC, ...A_CHAIN, ...A_DECINFRA,
  ...A_AI, ...A_CISO, ...A_INTUITION, ...A_DASHEVO,
  ...A_SIMS, ...A_MODUX,
];
