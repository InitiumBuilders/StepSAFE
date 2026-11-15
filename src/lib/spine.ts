/* The spine, counted: for each NIST CSF 2.0 function, the core pages that teach it first, the pages that teach it
   in part, the StepGuides that teach it first, and the check statements that test it (content/check/spine.ts,
   content/check/index.ts). A function is thin when two lessons or fewer, pages and guides together, teach it first. */

import { SPINE, GUIDE_SPINE, FN_ORDER, fnName, type CsfFn } from '../content/check/spine';
import { CHECKS } from '../content/check';
import { CHAPTERS, GUIDES } from '../content/registry';

export interface SpinePage { id: string; title: string; chapterId: string; chapter: string }
export interface SpineGuide { id: string; title: string; domain: string }
export interface SpineFn { fn: CsfFn; name: string; first: SpinePage[]; also: SpinePage[]; guides: SpineGuide[]; statements: number; thin: boolean }

export const THIN_AT = 2;

export function spineCoverage(): SpineFn[] {
  const pages = CHAPTERS.flatMap(c => c.pages.map(p => ({ page: { id: p.id, title: p.title, chapterId: c.id, chapter: c.title }, read: SPINE[p.id] })));
  const items = CHECKS.flatMap(k => k.items);
  return FN_ORDER.map(fn => {
    const first = pages.filter(p => p.read?.fn === fn).map(p => p.page);
    const guides = GUIDES.filter(g => GUIDE_SPINE[g.id] === fn).map(g => ({ id: g.id, title: g.title, domain: g.domain }));
    return {
      fn, name: fnName(fn), first, guides,
      also: pages.filter(p => p.read?.also === fn).map(p => p.page),
      statements: items.filter(i => i.csf.slice(0, 2) === fn).length,
      thin: first.length + guides.length <= THIN_AT,
    };
  });
}
