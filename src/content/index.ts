/* The whole curriculum, at once. Importing this module loads every authored module (content/full.ts) and fills
   the registry with them before anything else reads it, so a script, a probe or a lazy part of the app that
   imports content/index sees every chapter, award, guide, term and room in full. The app itself imports
   content/registry, which starts from the outline and calls for this module when it needs the rest. */

import { FULL } from './full';
import { hydrate } from './registry';

hydrate(FULL);

export * from './registry';
