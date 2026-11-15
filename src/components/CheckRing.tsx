/* The ring of a check (Dash Defenders): twelve arcs, one per statement, in its three parts, each part in its
   own colour. An answer is drawn by shape, never by colour alone: lit for Yes, half lit for Partly, a break
   for No, dashed for Not sure, a hairline for Does not apply. When every statement that applies holds, the
   gaps between the arcs close. Shared by the check, the list of checks and the door on Ground; the styles
   are in styles/check.css, loaded by main.tsx. */

import React, { useState } from 'react';
import type { CheckAnswer, CheckKind } from '../content/check/types';
import { ANSWER_LABEL, type CheckScore } from '../lib/check';
import { contradicts, shownBy, type Reading } from '../lib/evidence';

export const partClass = (kind: CheckKind, part: string) => 'p-' + (kind.parts.findIndex(p => p.id === part) + 1);

const C = 160, R = 118, GAP = 5;
const pt = (r: number, deg: number): [number, number] => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)];
};
const arc = (r: number, a0: number, a1: number) => {
  const [x0, y0] = pt(r, a0), [x1, y1] = pt(r, a1);
  return `M ${x0.toFixed(2)} ${y0.toFixed(2)} A ${r} ${r} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`;
};

/* how one answer draws: lit, half lit, broken, dashed, a hairline, or waiting */
function SegmentMarks({ ans, r, a0, a1 }: { ans?: CheckAnswer; r: number; a0: number; a1: number }) {
  return (
    <>
      <path className="ck-seg-base" d={arc(r, a0, a1)} />
      {ans === 'yes' && <path className="ck-seg-lit" d={arc(r, a0, a1)} />}
      {ans === 'partly' && <path className="ck-seg-lit" d={arc(r, a0, (a0 + a1) / 2)} />}
      {ans === 'unsure' && <path className="ck-seg-dash" d={arc(r, a0, a1)} />}
      {ans === 'no' && [a0, a1].map(a => {
        const [x0, y0] = pt(r - 9, a), [x1, y1] = pt(r + 9, a);
        return <line key={a} className="ck-seg-tick" x1={x0} y1={y0} x2={x1} y2={y1} />;
      })}
    </>
  );
}

/* the same marks, small, so each answer button shows how it will draw in the ring */
export function AnswerGlyph({ kind }: { kind: CheckAnswer }) {
  return (
    <svg className={'ck-glyph s-' + kind} viewBox="0 0 28 20" aria-hidden>
      <g transform="translate(-146 0)">
        <SegmentMarks ans={kind} r={150} a0={-5} a1={5} />
      </g>
    </svg>
  );
}

export function KeyRing({ kind, answers, evidence, at, onPick, sc, closed, mini }: {
  kind: CheckKind;
  answers: Record<string, CheckAnswer>;
  /** public records read for the run: a filled dot marks an answer a record backs, a hollow ring one it does not allow */
  evidence?: Record<string, Reading>;
  at?: number;
  onPick?: (i: number) => void;
  sc: CheckScore | null;
  closed?: boolean;
  /** a small ring for a list or a door: no count in the middle, nothing to press */
  mini?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const items = kind.items;
  const seg = 360 / items.length;
  const h = hover !== null ? items[hover] : null;
  const partName = (id: string) => kind.parts.find(p => p.id === id)?.name || '';
  return (
    <div className={'ck-ring' + (closed ? ' closed' : '') + (mini ? ' mini' : '')}>
      <svg viewBox="0 0 320 320" role={onPick ? 'group' : 'img'}
        aria-label={sc ? kind.name + ': ' + sc.held + ' of ' + sc.applies + ' statements held' : kind.name + ': twelve statements in three parts'}>
        {/* every statement that applies holds: the gaps between the arcs close too */}
        {closed && <circle className="ck-ring-whole" cx={C} cy={C} r={R} />}
        {items.map((it, i) => {
          const a0 = i * seg + GAP / 2, a1 = (i + 1) * seg - GAP / 2;
          const ans = answers[it.id];
          const r = evidence?.[it.id];
          const shown = shownBy(ans, r), against = contradicts(ans, r);
          const pick = onPick ? {
            role: 'button', tabIndex: 0,
            'aria-label': (i + 1) + '. ' + it.short + ': ' + (ans ? ANSWER_LABEL[ans] : 'not answered yet') + (shown ? ', shown by a public record' : against ? ', more than the public record allows' : ''),
            'aria-current': i === at ? ('step' as const) : undefined,
            onClick: () => onPick(i),
            onKeyDown: (e: React.KeyboardEvent) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); onPick(i); } },
            onMouseEnter: () => setHover(i), onMouseLeave: () => setHover(null),
            onFocus: () => setHover(i), onBlur: () => setHover(null),
          } : {};
          const [mx, my] = pt(R + 25, (a0 + a1) / 2);
          const [ex, ey] = pt(R - 24, (a0 + a1) / 2);
          return (
            <g key={it.id} className={'ck-seg ' + partClass(kind, it.part) + ' s-' + (ans || 'none') + (i === at ? ' on' : '')} style={{ ['--i' as string]: i }} {...pick}>
              <SegmentMarks ans={ans} r={R} a0={a0} a1={a1} />
              {i === at && <circle className="ck-seg-mark" cx={mx} cy={my} r={4.5} />}
              {(shown || against) && <circle className={'ck-seg-ev' + (against ? ' against' : '')} cx={ex} cy={ey} r={5} />}
              {onPick && <path className="ck-seg-hit" d={arc(R, a0, a1)} />}
            </g>
          );
        })}
      </svg>
      {!mini && (
        <div className="ck-ring-c" aria-hidden>
          {h ? (
            <div className={'ck-ring-peek ' + partClass(kind, h.part)}>
              <small>{partName(h.part)}</small>
              <strong>{h.short}</strong>
              <span>{answers[h.id] ? ANSWER_LABEL[answers[h.id]] : 'Not answered yet'}</span>
            </div>
          ) : sc ? (
            <div className="ck-ring-num"><strong>{sc.held}</strong><span><em>of {sc.applies} </em>held</span></div>
          ) : (
            <div className="ck-ring-num"><strong>{items.length}</strong><span>statements</span></div>
          )}
        </div>
      )}
    </div>
  );
}

/* the three parts, each in its colour, with what holds in it */
export function PartRows({ kind, sc }: { kind: CheckKind; sc: CheckScore | null }) {
  return (
    <ul className="ck-partrows">
      {kind.parts.map(p => {
        const ps = sc?.parts.find(x => x.id === p.id);
        return (
          <li key={p.id} className={partClass(kind, p.id)}>
            <i aria-hidden />
            <span><strong>{p.name}</strong><em>{p.line}</em></span>
            <b>{ps ? ps.held + ' of ' + ps.applies : kind.items.filter(x => x.part === p.id).length}</b>
          </li>
        );
      })}
    </ul>
  );
}
