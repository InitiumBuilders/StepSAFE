/* A drawn mark for each of the eleven subjects (content/subjects.ts), at the house stroke of 1.8, tinted by the
   subject's own hue. Each is what the subject is about, drawn small: a loop for systems, columns for governance, a person
   for identity, a key, brackets for software, an eye for detection, a shield for resilience, two links for the
   chain, a mesh for decentralized infrastructure, three joined nodes for trust graphs, a spark for AI. */

import React from 'react';
import { subjectById, type SubjectId } from '../content/subjects';

const PATHS: Record<SubjectId, React.ReactNode> = {
  systems: <><path d="M5 12a7 7 0 0 1 12-4.9" /><path d="M19 12a7 7 0 0 1-12 4.9" /><path d="M17.4 3.6v3.7h-3.7" /><path d="M6.6 20.4v-3.7h3.7" /></>,
  governance: <><path d="M3.5 8.2 12 3.8l8.5 4.4z" /><path d="M6 11v6M10 11v6M14 11v6M18 11v6" /><path d="M4 20h16" /></>,
  identity: <><circle cx="12" cy="8.6" r="3.3" /><path d="M5.4 19.6c1.2-3.3 3.8-5 6.6-5s5.4 1.7 6.6 5" /></>,
  keys: <><circle cx="8" cy="12" r="3.7" /><path d="M11.7 12h8.8M17.6 12v3M20.5 12v2.2" /></>,
  software: <><path d="M8.4 7 3.8 12l4.6 5M15.6 7l4.6 5-4.6 5M13.6 5l-3.2 14" /></>,
  detect: <><path d="M2.6 12S6 5.6 12 5.6 21.4 12 21.4 12 18 18.4 12 18.4 2.6 12 2.6 12z" /><circle cx="12" cy="12" r="2.7" /></>,
  resilience: <><path d="M12 3.4 19 6.2v5.3c0 4.3-3 7.6-7 9.1-4-1.5-7-4.8-7-9.1V6.2z" /><path d="m8.9 12 2.2 2.2 4-4.2" /></>,
  chain: <><path d="m10 14 4-4" /><path d="m8.6 16.9-1.3 1.3a3.2 3.2 0 0 1-4.5-4.5l3.3-3.3a3.2 3.2 0 0 1 4.5 0" /><path d="m15.4 7.1 1.3-1.3a3.2 3.2 0 0 1 4.5 4.5l-3.3 3.3a3.2 3.2 0 0 1-4.5 0" /></>,
  decentral: <><circle cx="12" cy="12" r="2" /><circle cx="5" cy="5.5" r="1.8" /><circle cx="19" cy="5.5" r="1.8" /><circle cx="5" cy="18.5" r="1.8" /><circle cx="19" cy="18.5" r="1.8" /><path d="M6.4 6.8l4.1 3.8M17.6 6.8l-4.1 3.8M6.4 17.2l4.1-3.8M17.6 17.2l-4.1-3.8M6.8 5.5h10.4M6.8 18.5h10.4" /></>,
  graph: <><circle cx="12" cy="5.2" r="2.1" /><circle cx="5.2" cy="18" r="2.1" /><circle cx="18.8" cy="18" r="2.1" /><path d="M11 7.1 6.2 16.1M13 7.1l4.8 9M7.3 18h9.4" /></>,
  ai: <><path d="M11 3.6c.6 4.3 2.4 6.1 6.7 6.7-4.3.6-6.1 2.4-6.7 6.7-.6-4.3-2.4-6.1-6.7-6.7 4.3-.6 6.1-2.4 6.7-6.7z" /><path d="M18.4 15.8v4.6M16.1 18.1h4.6" /></>,
};

export function SubjectGlyph({ id, size = 18 }: { id: SubjectId; size?: number }) {
  return (
    <svg className="subject-glyph" width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ ['--hue' as string]: subjectById(id).hue }}>
      {PATHS[id]}
    </svg>
  );
}
