/* THE WORDS OF A STEP. Under every Step: the glossary entries it names and the ones its text uses, each opening its
   definition in place, and then the words it names that have no entry. A word with no entry is plain text, unless
   the corpus says something about it beyond this Step; then it opens that word's page in the glossary. The row
   and the glossary read the same relation (lib/terms.ts), so a term listed here lists this Step in return. */

import React, { useEffect, useMemo, useState } from 'react';
import type { Step, Term } from '../content/schema';
import { termSubject, subjectById } from '../content/subjects';
import { SubjectGlyph } from './SubjectGlyph';
import { TermPop } from './Blocks';
import { vocabOfStep } from '../lib/terms';
import { useS } from '../lib/state';

export function StepWords({ step }: { step: Step }) {
  const { d } = useS();
  const v = useMemo(() => vocabOfStep(step), [step]);
  const [open, setOpen] = useState<Term | null>(null);
  useEffect(() => setOpen(null), [step.id]);
  if (!v.terms.length && !v.bare.length) return null;
  return (
    <div className="sw" aria-label="The words of this Step">
      {v.terms.length > 0 && (
        <div className="sw-row">
          <span className="label">In the glossary</span>
          <div className="sw-terms">
            {v.terms.map(t => {
              const sj = termSubject(t);
              return (
                <button key={t.id} type="button" className={'sw-term' + (open?.id === t.id ? ' on' : '')} aria-expanded={open?.id === t.id}
                  onClick={() => setOpen(o => (o?.id === t.id ? null : t))} style={sj ? { ['--hue' as string]: subjectById(sj).hue } : undefined}>
                  {sj && <SubjectGlyph id={sj} size={15} />}{t.term}
                </button>
              );
            })}
          </div>
          {open && <TermPop term={open} onClose={() => setOpen(null)} />}
        </div>
      )}
      {v.bare.length > 0 && (
        <div className="sw-row">
          <span className="label">Also named in this Step</span>
          <p className="sw-bare">
            {v.bare.map((b, i) => (
              <React.Fragment key={b.slug}>
                {i > 0 && <span aria-hidden> · </span>}
                {b.open
                  ? <button type="button" className="term-link" onClick={() => d({ t: 'route', view: 'guides', sub: b.slug })}>{b.phrase}</button>
                  : <span>{b.phrase}</span>}
              </React.Fragment>
            ))}
          </p>
        </div>
      )}
    </div>
  );
}
