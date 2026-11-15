/* THE READING. What a Step, a guide or a chapter says when it is read aloud,
   as passages: a title and the text under it. Lists are read as sentences,
   code and tables are named and skipped, and a chapter is its Steps in
   order with the page named between them. */

import type { StepBlock, Step, Chapter, Guide } from '../content/schema';

export interface Passage {
  /** the heading spoken before the text, if any */
  title?: string;
  text: string;
  /** the Step this passage belongs to, for a chapter reading */
  stepId?: string;
}

const clean = (t: string) => t.replace(/\s+/g, ' ').replace(/[*_`#>]/g, '').trim();
const sentence = (t: string) => { const c = clean(t); return c ? (/[.!?]$/.test(c) ? c : c + '.') : ''; };
const items = (xs: string[] | undefined) => (xs || []).map(sentence).filter(Boolean).join(' ');

export function passagesOfBlocks(blocks: StepBlock[]): Passage[] {
  const out: Passage[] = [];
  for (const b of blocks) {
    switch (b.kind) {
      case 'prose':
      case 'principle':
      case 'callout':
      case 'quote': {
        const text = [sentence(b.body || ''), b.kind === 'quote' && b.source ? 'That is from ' + sentence(b.source) : ''].filter(Boolean).join(' ');
        if (text) out.push({ title: b.title ? clean(b.title) : undefined, text });
        break;
      }
      case 'list':
      case 'numbered':
      case 'checklist': {
        const text = [sentence(b.body || ''), items(b.items)].filter(Boolean).join(' ');
        if (text) out.push({ title: b.title ? clean(b.title) : undefined, text });
        break;
      }
      case 'compare': {
        const text = [sentence(b.body || ''), b.left ? sentence(b.left.title) + ' ' + items(b.left.items) : '', b.right ? sentence(b.right.title) + ' ' + items(b.right.items) : ''].filter(Boolean).join(' ');
        if (text) out.push({ title: b.title ? clean(b.title) : undefined, text });
        break;
      }
      case 'metric':
      case 'timeline': {
        const text = [sentence(b.body || ''), items(b.items)].filter(Boolean).join(' ');
        if (text) out.push({ title: b.title ? clean(b.title) : undefined, text });
        break;
      }
      case 'code':
        out.push({ title: b.title ? clean(b.title) : undefined, text: 'A code block here, in ' + (b.lang || 'plain text') + '. Read it on the page.' });
        break;
      case 'table':
        out.push({ title: b.title ? clean(b.title) : undefined, text: 'A table here' + (b.headers?.length ? ', with columns ' + b.headers.map(clean).join(', ') : '') + '. Read it on the page.' });
        break;
    }
  }
  return out;
}

export function passagesOfStep(step: Step, pageTitle?: string): Passage[] {
  const head: Passage = { title: step.title, text: [pageTitle ? 'From ' + sentence(pageTitle) : '', sentence(step.statement)].filter(Boolean).join(' '), stepId: step.id };
  return [head, ...passagesOfBlocks(step.blocks).map(p => ({ ...p, stepId: step.id }))];
}

export function passagesOfGuide(g: Guide): Passage[] {
  return [{ title: g.title, text: [sentence(g.statement), sentence(g.summary)].filter(Boolean).join(' ') }, ...passagesOfBlocks(g.blocks)];
}

/** a whole chapter as one reading: the chapter, then each page, then each Step in order */
export function passagesOfChapter(c: Chapter): Passage[] {
  const out: Passage[] = [{ title: c.title, text: [sentence(c.subtitle), sentence(c.statement)].filter(Boolean).join(' ') }];
  for (const p of c.pages) {
    out.push({ title: p.title, text: 'The page ' + sentence(p.title) + (p.steps.length ? ' ' + p.steps.length + (p.steps.length === 1 ? ' Step.' : ' Steps.') : '') });
    for (const st of p.steps) out.push(...passagesOfStep(st));
  }
  return out;
}

export function readingMinutes(ps: Passage[]): number {
  const words = ps.reduce((n, p) => n + (p.title ? p.title.split(/\s+/).length : 0) + p.text.split(/\s+/).length, 0);
  return Math.max(1, Math.round(words / 150));
}
