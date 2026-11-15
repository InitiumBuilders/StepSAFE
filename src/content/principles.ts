/* THE EIGHT PRINCIPLES. Saltzer and Schroeder set them down in 1975 in "The
   Protection of Information in Computer Systems", and every structure in the
   Praxis answers to one of them. They are hidden in the app: type the word
   safe anywhere outside a text field and one surfaces; each one found is
   kept on the device and counted in Settings. */

export interface Principle {
  id: string;
  name: string;
  /** the principle in one plain line */
  line: string;
  /** where it shows in the Praxis */
  here: string;
}

export const PRINCIPLES: Principle[] = [
  { id: 'economy', name: 'Economy of mechanism', line: 'Keep the design as small and simple as it can be, because a thing you can read all of is a thing you can check all of.', here: 'The model written down as a guide, with every constant on one page.' },
  { id: 'fail-safe', name: 'Fail-safe defaults', line: 'Base every decision on permission rather than exclusion; when a check fails, the answer is no.', here: 'A breaker cuts the edge; nothing is assumed to still hold.' },
  { id: 'mediation', name: 'Complete mediation', line: 'Check every access to every object, every time, and do not trust a check made earlier.', here: 'Context aware access and device bound sessions, where the login is only the start.' },
  { id: 'open-design', name: 'Open design', line: 'The design must not be secret; the only thing kept is the key.', here: 'The dynamics model is public, the schemas are published, and only your vault stays sealed.' },
  { id: 'separation', name: 'Separation of privilege', line: 'Where you can, require two keys rather than one, held by two people.', here: 'Two person integrity, and the result links a teammate brings back to the board.' },
  { id: 'least-privilege', name: 'Least privilege', line: 'Every program and every person runs with the least power the job needs.', here: 'Zero standing privilege: the grant goes to a named person and expires.' },
  { id: 'common', name: 'Least common mechanism', line: 'Share as little as possible between users, because every shared path is a path between them.', here: 'Cells and a blast radius budget: a failure that cannot travel.' },
  { id: 'acceptability', name: 'Psychological acceptability', line: 'Make the safe path the easy path, or people will route around it.', here: 'Secure by default, and a Step you can finish on a phone between meetings.' },
];

const KEY = 'stepsafe-principles-v1';

export function foundPrinciples(): string[] {
  try { const x = JSON.parse(localStorage.getItem(KEY) || '[]'); return Array.isArray(x) ? x.filter((i: unknown) => typeof i === 'string' && PRINCIPLES.some(p => p.id === i)) : []; } catch { return []; }
}

/** the next principle not yet found, or the next in the ring once all are; records it, returns it */
export function surfacePrinciple(): { principle: Principle; found: number; total: number; isNew: boolean } {
  const found = foundPrinciples();
  const next = PRINCIPLES.find(p => !found.includes(p.id)) || PRINCIPLES[(found.length + Date.now() % PRINCIPLES.length) % PRINCIPLES.length];
  const isNew = !found.includes(next.id);
  if (isNew) { try { localStorage.setItem(KEY, JSON.stringify([...found, next.id])); } catch { /* kept in memory only */ } }
  return { principle: next, found: isNew ? found.length + 1 : found.length, total: PRINCIPLES.length, isNew };
}

/** the one line the console carries on load, by the day */
export function principleOfTheDay(d = new Date()): Principle {
  const n = Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000);
  return PRINCIPLES[n % PRINCIPLES.length];
}
