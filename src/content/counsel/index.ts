/* Hand-authored UNIT counsel — bespoke voices for specific simulation decisions.

   An entry here always wins over the derivation engine in lib/counsel.ts, which
   covers anything not authored. Every one of the 104 decisions across The
   Practice now has authored counsel: specialists arguing from their own
   doctrine, disagreeing with each other on purpose, and occasionally being
   confidently wrong in exactly the way their documented blind spot predicts. */

import type { Counsel } from '../schema';

import { COUNSEL as C_FRONTIER } from './frontier-ai';
import { COUNSEL as C_EXCHANGE } from './exchange-treasury';
import { COUNSEL as C_ENTERPRISE } from './enterprise-crisis';
import { COUNSEL as C_GRAPH } from './graph-decinfra';
import { COUNSEL as C_EVO } from './evo-capstone';

export const COUNSEL_AUTHORED: Counsel[] = [
  ...C_FRONTIER, ...C_EXCHANGE, ...C_ENTERPRISE, ...C_GRAPH, ...C_EVO,
];
