/* A check, read: how much holds, part by part, and the gaps in the order to close them. The record is what
   a project hands its reviewer: dated, every answer, every gap with its move, every statement's NIST CSF 2.0
   category and the day its sources were checked. It lists the project's weak points, so it leaves the device
   only when the learner copies or saves it. */

import type { CheckAnswer, CheckItem, CheckKind } from '../content/check/types';
import { checkKind } from '../content/check';
import { csfName } from '../content/check/csf';
import { contradicts, shownBy, type Reading } from './evidence';
import { lessonLine } from './learn';

export interface TreasuryCheck {
  id: string;
  /** which check this run answers; a run without one is a treasury check */
  kind?: string;
  project: string;
  answers: Record<string, CheckAnswer>;
  at: number;
  /** when every statement had an answer */
  done?: number;
  /** public records read for statements that can be shown, by statement id */
  evidence?: Record<string, Reading>;
}
/** a run of any check; the older name stays because the keyring's records carry it */
export type CheckRun = TreasuryCheck;

export const ANSWER_LABEL: Record<CheckAnswer, string> = { yes: 'Yes', partly: 'Partly', no: 'No', unsure: 'Not sure', na: 'Does not apply' };

export interface CheckGap { item: CheckItem; answer: CheckAnswer | null }
export interface CheckScore {
  answered: number;
  total: number;
  /** statements that apply: every one but those answered Does not apply */
  applies: number;
  held: number;
  partly: number;
  gaps: CheckGap[];
  parts: { id: string; name: string; held: number; applies: number }[];
  complete: boolean;
  allHeld: boolean;
  /** statements a public record could show */
  readable: number;
  /** answers a public record backs */
  shown: number;
  /** statements whose answer claims more than the record allows */
  contradicted: string[];
}

export const kindOf = (c: Pick<TreasuryCheck, 'kind'>): CheckKind => checkKind(c.kind);

/** the newest reading of the same subject for a statement, in this run or another run of the same check; a new DNS
   reading compares with it to say what changed since. On the same day, this run's own reading comes first. */
export function lastReading(runs: TreasuryCheck[], run: TreasuryCheck, item: string, kind: string, subject: string | null): Reading | undefined {
  if (!subject) return undefined;
  const same = (c: TreasuryCheck) => (c.kind || 'treasury') === (run.kind || 'treasury');
  return [run, ...runs.filter(c => c.id !== run.id && same(c))]
    .map(c => c.evidence?.[item])
    .filter((r): r is Reading => !!r && r.kind === kind && r.subject === subject && Array.isArray(r.held))
    .sort((a, b) => b.read.localeCompare(a.read))[0];
}

export function scoreCheck(c: Pick<TreasuryCheck, 'answers' | 'kind' | 'evidence'>): CheckScore {
  const k = kindOf(c);
  const items = k.items;
  const order = new Map(items.map((i, n) => [i.id, n]));
  const a = c.answers || {};
  const applies = items.filter(i => a[i.id] !== 'na');
  const held = applies.filter(i => a[i.id] === 'yes').length;
  const partly = applies.filter(i => a[i.id] === 'partly').length;
  const answered = items.filter(i => !!a[i.id]).length;
  /* an unanswered statement is not held yet; the deepest gaps come first, then the order of the check */
  const gaps = applies.filter(i => a[i.id] !== 'yes')
    .sort((x, y) => y.weight - x.weight || (order.get(x.id)! - order.get(y.id)!))
    .map(item => ({ item, answer: a[item.id] || null }));
  const parts = k.parts.map(p => {
    const its = applies.filter(i => i.part === p.id);
    return { id: p.id, name: p.name, held: its.filter(i => a[i.id] === 'yes').length, applies: its.length };
  });
  const complete = answered === items.length;
  const ev = c.evidence || {};
  const readable = items.filter(i => i.evidence).length;
  const shown = items.filter(i => shownBy(a[i.id], ev[i.id])).length;
  const contradicted = items.filter(i => contradicts(a[i.id], ev[i.id])).map(i => i.id);
  return { answered, total: items.length, applies: applies.length, held, partly, gaps, parts, complete, allHeld: complete && held === applies.length, readable, shown, contradicted };
}

const pad = (n: number) => String(n).padStart(2, '0');
export function checkDate(ms: number) {
  const d = new Date(ms);
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
}

/** the record for a reviewer, as Markdown */
export function checkRecord(c: TreasuryCheck, modelName: (id: string) => string): string {
  const k = kindOf(c);
  const sc = scoreCheck(c);
  const name = c.project.trim() || (k.id === 'treasury' ? 'An unnamed treasury' : 'An unnamed project');
  const lines: string[] = [];
  lines.push('# ' + (k.id === 'treasury' ? 'Ten-minute treasury check' : k.name + ' check') + ': ' + name);
  lines.push('');
  lines.push(checkDate(c.done || c.at) + ' · Dash Defenders · StepSAFE :: The Praxis');
  lines.push('');
  lines.push('Held: ' + sc.held + ' of ' + sc.applies + (sc.partly ? ', with ' + sc.partly + ' partly held' : '') + '.' + (sc.complete ? '' : ' ' + (sc.total - sc.answered) + ' statements are not answered yet.'));
  lines.push('Shown by a public record: ' + sc.shown + ' of ' + sc.total + '. Said by the project: ' + (sc.answered - sc.shown) + '.' + (sc.contradicted.length ? ' ' + sc.contradicted.length + ' answer' + (sc.contradicted.length > 1 ? 's claim' : ' claims') + ' more than the record allows.' : ''));
  lines.push('');
  for (const p of k.parts) {
    lines.push('## ' + p.name);
    lines.push('');
    for (const i of k.items.filter(x => x.part === p.id)) {
      const ans = c.answers[i.id];
      lines.push('- [' + (ans === 'yes' || ans === 'na' ? 'x' : ' ') + '] ' + i.ask + ' **' + (ans ? (ans === 'na' && i.na ? i.na : ANSWER_LABEL[ans]) : 'Not answered') + '** (NIST CSF ' + i.csf + ')');
      const r = c.evidence?.[i.id];
      if (r) lines.push('  ' + (contradicts(ans, r) && r.allows !== 'open' ? 'Said, and the public record allows ' + ANSWER_LABEL[r.allows] + ' at most: ' : shownBy(ans, r) ? 'Shown: ' : 'The public record: ') + r.found + (r.unseen ? ' ' + r.unseen : '') + ' Read ' + r.read + ' for ' + r.subject + ' at <' + r.url + '>.');
    }
    lines.push('');
  }
  if (sc.gaps.length) {
    lines.push('## The gaps, deepest first');
    lines.push('');
    sc.gaps.forEach((g, n) => {
      lines.push((n + 1) + '. ' + g.item.ask + ' (' + (g.answer ? ANSWER_LABEL[g.answer] : 'Not answered') + ')');
      lines.push('   Move: ' + g.item.move);
      lines.push('   Structures: ' + g.item.models.map(modelName).join(', '));
      const learn = lessonLine(g.item.id);
      if (learn) lines.push('   Lessons: ' + learn);
      lines.push('   NIST CSF 2.0: ' + g.item.csf + ', ' + csfName(g.item.csf));
    });
    lines.push('');
  }
  lines.push('The answers are the project’s own. StepSAFE does not verify them; a reviewer does.');
  if (Object.keys(c.evidence || {}).length) lines.push('A public record shows a state on the day it was read, not the practice behind it. This record is text the project could edit, so read each link again.');
  lines.push('This record lists the project’s weak points. Share it only with the reviewer.');
  lines.push('');
  const sources = [...new Map(k.items.flatMap(i => i.sources).map(s => [s.url, s])).values()];
  lines.push('Sources, each read at the source on the date shown: ' + sources.map(s => s.label + ' <' + s.url + '> (checked ' + s.checked + ')').join('; '));
  return lines.join('\n');
}

/* ---------- the launch record: every check, joined ---------- */

const kindIdOf = (c: Pick<TreasuryCheck, 'kind'>) => c.kind || 'treasury';
/** a statement's few words inside a sentence: the first letter drops to lower case unless it starts an acronym (DNS) */
export const inline = (s: string) => (/^[A-Z][a-z]/.test(s) ? s[0].toLowerCase() + s.slice(1) : s);
const recordName = (k: CheckKind) => (k.id === 'treasury' ? 'Ten-minute treasury check' : k.name + ' check');

export interface LaunchChange { kind: CheckKind; from: TreasuryCheck; to: TreasuryCheck; closed: CheckItem[]; opened: CheckItem[] }
export interface LaunchGap extends CheckGap { kind: CheckKind }
export interface Launch {
  /** the run each check is read from: its newest finished run, or its newest run when none has finished */
  runs: { kind: CheckKind; run: TreasuryCheck | null; sc: CheckScore | null }[];
  finished: number;
  applies: number;
  held: number;
  partly: number;
  answered: number;
  shown: number;
  contradicted: number;
  /** every gap across the checks, deepest first, then in the order of the checks */
  gaps: LaunchGap[];
  /** each check's newest finished run against the finished run before it */
  changes: LaunchChange[];
}

export function launchOf(all: TreasuryCheck[], kinds: CheckKind[]): Launch {
  const runs = kinds.map(kind => {
    const its = all.filter(c => kindIdOf(c) === kind.id).sort((a, b) => b.at - a.at);
    const run = its.find(c => c.done) || its[0] || null;
    return { kind, run, sc: run ? scoreCheck(run) : null };
  });
  const sum = (f: (s: CheckScore) => number) => runs.reduce((n, r) => n + (r.sc ? f(r.sc) : 0), 0);
  const gaps = runs.flatMap((r, i) => (r.sc ? r.sc.gaps.map((g, j) => ({ ...g, kind: r.kind, i, j })) : []))
    .sort((x, y) => y.item.weight - x.item.weight || x.i - y.i || x.j - y.j)
    .map(({ i, j, ...g }) => g);
  const changes: LaunchChange[] = [];
  for (const kind of kinds) {
    const done = all.filter(c => kindIdOf(c) === kind.id && c.done).sort((a, b) => (b.done! - a.done!) || (b.at - a.at));
    if (done.length < 2) continue;
    const [to, from] = done;
    const held = (c: TreasuryCheck, id: string) => c.answers[id] === 'yes' || c.answers[id] === 'na';
    changes.push({
      kind, from, to,
      closed: kind.items.filter(i => !held(from, i.id) && held(to, i.id)),
      opened: kind.items.filter(i => held(from, i.id) && !held(to, i.id)),
    });
  }
  return {
    runs, gaps, changes,
    finished: runs.filter(r => r.run?.done).length,
    applies: sum(s => s.applies), held: sum(s => s.held), partly: sum(s => s.partly),
    answered: sum(s => s.answered), shown: sum(s => s.shown), contradicted: sum(s => s.contradicted.length),
  };
}

/** the launch record for a reviewer: the summary across every check, the gaps deepest first, what changed
   since each check's run before, then each check's own record in full */
export function launchRecord(all: TreasuryCheck[], kinds: CheckKind[], modelName: (id: string) => string, today = Date.now()): string {
  const L = launchOf(all, kinds);
  const names = [...new Set(L.runs.map(r => r.run?.project.trim() || '').filter(Boolean))];
  const lines: string[] = [];
  lines.push('# Launch record: ' + (names.length ? names.join(', ') : 'An unnamed project'));
  lines.push('');
  lines.push(checkDate(today) + ' · Dash Defenders · StepSAFE :: The Praxis');
  lines.push('');
  lines.push('Checks finished: ' + L.finished + ' of ' + kinds.length + '. Held: ' + L.held + ' of ' + L.applies + ' statements that apply' + (L.partly ? ', with ' + L.partly + ' partly held' : '') + '.');
  lines.push('Shown by a public record: ' + L.shown + '. Said by the project: ' + (L.answered - L.shown) + '.' + (L.contradicted ? ' ' + L.contradicted + ' answer' + (L.contradicted > 1 ? 's claim' : ' claims') + ' more than the record allows.' : ''));
  lines.push('');
  lines.push('## The checks');
  lines.push('');
  for (const r of L.runs) {
    if (!r.run || !r.sc) { lines.push('- ' + recordName(r.kind) + ': not run.'); continue; }
    lines.push('- ' + recordName(r.kind) + ': ' + (r.run.project.trim() || 'unnamed') + ', ' + checkDate(r.run.done || r.run.at) + '. Held ' + r.sc.held + ' of ' + r.sc.applies + (r.sc.complete ? '' : ', ' + (r.sc.total - r.sc.answered) + ' not answered yet') + '. Shown ' + r.sc.shown + ' of ' + r.sc.total + '.');
  }
  lines.push('');
  if (L.gaps.length) {
    lines.push('## The gaps, deepest first, across every check');
    lines.push('');
    L.gaps.forEach((g, n) => {
      lines.push((n + 1) + '. ' + g.item.ask + ' (' + (g.answer ? ANSWER_LABEL[g.answer] : 'Not answered') + '; ' + g.kind.name + ')');
      lines.push('   Move: ' + g.item.move);
      const learn = lessonLine(g.item.id);
      if (learn) lines.push('   Lessons: ' + learn);
      lines.push('   NIST CSF 2.0: ' + g.item.csf + ', ' + csfName(g.item.csf));
    });
    lines.push('');
  }
  if (L.changes.length) {
    lines.push('## Since the run before');
    lines.push('');
    for (const ch of L.changes) {
      const span = checkDate(ch.from.done || ch.from.at) + ' to ' + checkDate(ch.to.done || ch.to.at);
      const what = [ch.closed.length ? 'closed ' + ch.closed.map(i => inline(i.short)).join(', ') : '', ch.opened.length ? 'opened ' + ch.opened.map(i => inline(i.short)).join(', ') : ''].filter(Boolean).join('; ');
      lines.push('- ' + ch.kind.name + ', ' + span + ': ' + (what || 'no statement changed between held and not held') + '.');
    }
    lines.push('');
  }
  lines.push('The answers are the project’s own. StepSAFE does not verify them; a reviewer does. Each check’s record follows in full, with its sources.');
  lines.push('This record lists the project’s weak points. Share it only with the reviewer.');
  for (const r of L.runs) {
    if (!r.run) continue;
    lines.push('');
    lines.push(checkRecord(r.run, modelName).split('\n').map(l => (l.startsWith('#') ? '#' + l : l)).join('\n'));
  }
  return lines.join('\n');
}
