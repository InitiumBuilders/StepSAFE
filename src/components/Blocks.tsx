/* Renders authored StepBlocks — the teaching surface.

   THE WORDS THAT LINK. A glossary term met in prose is a quiet link. The first
   time a term appears in a block it opens a small card with the short
   definition and a door to the glossary; nothing navigates away on its own.
   Multi-word terms, long single words and acronyms link; short common words do
   not, and acronyms match only in their own case, so a lowercase fair stays a word. */

import React, { useMemo, useState } from 'react';
import type { StepBlock, Term } from '../content/schema';
import { termHits } from '../lib/terms';
import { useS } from '../lib/state';
import { termSubject, subjectById } from '../content/subjects';
import { SubjectGlyph } from './SubjectGlyph';

type Seg = string | { text: string; term: Term };

/** split one text into plain runs and the first mention of each term not yet seen in this block */
function segments(text: string, seen: Set<string>): Seg[] {
  const out: Seg[] = [];
  let pos = 0;
  for (const f of termHits(text)) {
    if (f.i < pos || seen.has(f.term.id)) continue;
    seen.add(f.term.id);
    if (f.i > pos) out.push(text.slice(pos, f.i));
    out.push({ text: text.slice(f.i, f.e), term: f.term });
    pos = f.e;
  }
  if (pos < text.length) out.push(text.slice(pos));
  return out;
}

/** the block's texts, linked in reading order, computed once per block */
function linkBlock(b: StepBlock): { paras: Seg[][]; items: Seg[][] } {
  const seen = new Set<string>();
  const paras = b.kind === 'code' || !b.body ? [] : b.body.split(/\n\n+/).map(t => segments(t, seen));
  const items = b.kind === 'code' ? [] : (b.items || []).map(t => segments(t, seen));
  return { paras, items };
}

export function TermPop({ term, onClose }: { term: Term; onClose: () => void }) {
  const { d } = useS();
  const sh = termSubject(term);
  return (
    <aside className="term-pop" role="note" aria-label={term.term} style={sh ? { ['--hue' as string]: subjectById(sh).hue } : undefined}>
      <span className="term-pop-where">{sh && <SubjectGlyph id={sh} size={15} />}{(sh ? subjectById(sh).name + ' · ' : '') + term.domain}</span>
      <strong>{term.term}</strong>
      <span>{term.short}</span>
      <span className="term-pop-row">
        <button type="button" className="btn btn-sm" onClick={() => d({ t: 'route', view: 'guides', sub: term.id })}>Open in the glossary</button>
        <button type="button" className="btn btn-sm" onClick={() => d({ t: 'route', view: 'study', id: 'term:' + term.id })}>Study its card</button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>Close</button>
      </span>
    </aside>
  );
}

function Linked({ segs, as, className }: { segs: Seg[]; as: 'p' | 'li'; className?: string }) {
  const [open, setOpen] = useState<Term | null>(null);
  const body = segs.map((seg, i) => typeof seg === 'string' ? seg : (
    <button type="button" key={i} className={'term-link' + (open && open.id === seg.term.id ? ' on' : '')}
      aria-expanded={!!open && open.id === seg.term.id}
      onClick={() => setOpen(o => (o && o.id === seg.term.id ? null : seg.term))}>{seg.text}</button>
  ));
  /* one span holds the item's text and its popover, so a checklist's flex row has two children: the box and the
     text. Without it every glossary link became its own column and the line broke apart. */
  if (as === 'li') return <li className={className}><span className="li-text">{body}{open && <TermPop term={open} onClose={() => setOpen(null)} />}</span></li>;
  return <><p className={className}>{body}</p>{open && <TermPop term={open} onClose={() => setOpen(null)} />}</>;
}

/* a list whose every item reads "label: https://..." is a list of sources: each one renders as a link with its host */
const SOURCE_ITEM = /^(.+?): (https?:\/\/\S+)$/;
const hostOf = (url: string) => { try { return new URL(url).host.replace(/^www\./, ''); } catch { return ''; } };

function Paras({ paras }: { paras: Seg[][] }) {
  return <>{paras.map((segs, i) => <Linked key={i} segs={segs} as="p" />)}</>;
}

export function Block({ b }: { b: StepBlock }) {
  const L = useMemo(() => linkBlock(b), [b]);
  switch (b.kind) {
    case 'prose':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          <Paras paras={L.paras} />
        </div>
      );
    case 'principle':
      return (
        <div className="blk blk-principle">
          <div className="blk-title">{b.title || 'Principle'}</div>
          <Paras paras={L.paras} />
        </div>
      );
    case 'callout':
      return (
        <div className="blk blk-callout">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          <Paras paras={L.paras} />
          {b.items && (
            <ul>
              {b.items.map((it, i) => (
                <li key={i}>{it}</li>
              ))}
            </ul>
          )}
        </div>
      );
    case 'quote':
      return (
        <blockquote className="blk blk-quote" style={{ margin: 0 }}>
          <Paras paras={L.paras} />
          {b.source && <span className="src">— {b.source}</span>}
        </blockquote>
      );
    case 'list': {
      const sources = !!b.items && b.items.length > 0 && b.items.every(x => SOURCE_ITEM.test(x));
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          {b.body && <Paras paras={L.paras} />}
          <ul className={sources ? 'blk-sources' : undefined}>
            {sources
              ? b.items!.map((x, i) => {
                const m = x.match(SOURCE_ITEM)!;
                return <li key={i}><a href={m[2]} target="_blank" rel="noopener noreferrer">{m[1]}</a> <span className="blk-host">{hostOf(m[2])}</span></li>;
              })
              : L.items.map((segs, i) => <Linked key={i} segs={segs} as="li" />)}
          </ul>
        </div>
      );
    }
    case 'numbered':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          {b.body && <Paras paras={L.paras} />}
          <ol>
            {L.items.map((segs, i) => <Linked key={i} segs={segs} as="li" />)}
          </ol>
        </div>
      );
    case 'checklist':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          {b.body && <Paras paras={L.paras} />}
          <ul className="blk-check">
            {L.items.map((segs, i) => <Linked key={i} segs={segs} as="li" />)}
          </ul>
        </div>
      );
    case 'code':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          <pre className="code">
            {b.lang && <span className="lang">{b.lang}</span>}
            {b.body}
          </pre>
        </div>
      );
    case 'table':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          {b.body && <Paras paras={L.paras} />}
          {/* A table of three columns or more does not fit a phone. There each row is read as a card, every
              value under its column's name (data-label), so nothing scrolls sideways. The roles keep it a table
              to a screen reader when the phone's styles change how it is laid out. */}
          <div className={'tablewrap' + (wideTable(b) ? ' tw-stack' : '')}>
            <table className={'dt' + (wideTable(b) ? ' dt-stack' : '')} role="table">
              {b.headers && (
                <thead role="rowgroup">
                  <tr role="row">
                    {b.headers.map((h, i) => (
                      <th key={i} role="columnheader" scope="col">{h}</th>
                    ))}
                  </tr>
                </thead>
              )}
              <tbody role="rowgroup">
                {(b.rows || []).map((r, i) => (
                  <tr key={i} role="row">
                    {r.map((c, j) => (
                      <td key={j} role="cell" data-label={b.headers?.[j] || undefined}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    case 'compare':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          <div className="compare">
            <div>
              <h5>{b.left?.title}</h5>
              <ul>
                {(b.left?.items || []).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
            <div>
              <h5>{b.right?.title}</h5>
              <ul>
                {(b.right?.items || []).map((it, i) => (
                  <li key={i}>{it}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      );
    case 'metric':
      return (
        <div className="blk metric">
          <div className="mv">{b.title}</div>
          <div>
            <Paras paras={L.paras} />
            {b.source && <span className="label">{b.source}</span>}
          </div>
        </div>
      );
    case 'timeline':
      return (
        <div className="blk">
          {b.title && <h4 className="blk-title">{b.title}</h4>}
          <ol className="timeline">
            {(b.items || []).map((it, i) => (
              <li key={i}>{it}</li>
            ))}
          </ol>
        </div>
      );
    default:
      return null;
  }
}

/** three columns or more: on a phone the table is read as one card for each row */
const wideTable = (b: { headers?: string[]; rows?: string[][] }) => Math.max(b.headers?.length || 0, b.rows?.[0]?.length || 0) >= 3;

export function Blocks({ blocks }: { blocks: StepBlock[] }) {
  return (
    <div className="blocks">
      {blocks.map((b, i) => (
        <Block key={i} b={b} />
      ))}
    </div>
  );
}
