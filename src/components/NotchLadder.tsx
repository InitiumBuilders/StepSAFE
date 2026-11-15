/* The ladder of notches: where the gauge stands, which notches are held,
   which earned Gold, and where the catalog stops being able to hold. */

import React from 'react';
import { BAND_LABEL, bandOf, type Band } from '../content/modux-schema';
import type { LevelRecord } from '../lib/state';
import { isGoldNotch } from '../content/modux/gratus';

const ORDER: Band[] = ['ground', 'hardened', 'systemic', 'wicked', 'outlier'];

export function NotchLadder({ level, levels, ceiling }: {
  level: number;
  levels: Record<string, LevelRecord>;
  /** the first notch proven unholdable with the catalog, if known */
  ceiling: number | null;
}) {
  /* nine notches: up to five behind, three ahead. One row at any width */
  const top = Math.max(level + 3, 8);
  const from = Math.max(0, top - 8);
  const pips = Array.from({ length: top - from + 1 }, (_, i) => from + i);
  const band = bandOf(level);
  return (
    <div className="gx-ladder" aria-label={'Notch ' + level + ' of the ladder, band ' + BAND_LABEL[band]}>
      <div className="gx-ladder-bands">
        {ORDER.map(b => (
          <span key={b} className={'gx-band b-' + b + (b === band ? ' on' : '')}>{BAND_LABEL[b]}</span>
        ))}
      </div>
      <ol className="gx-pips">
        {pips.map(n => {
          const r = levels[String(n)];
          const cls = 'gx-pip b-' + bandOf(n) +
            (n === level ? ' now' : '') + (n > level ? ' ahead' : '') +
            (r?.held ? ' held' : '') + (r?.gold ? ' gold' : '') +
            (ceiling !== null && n >= ceiling ? ' past' : '') +
            (isGoldNotch(n) ? ' goldable' : '');
          return (
            <li key={n} className={cls} title={
              'Notch ' + n + ' · ' + BAND_LABEL[bandOf(n)] +
              (r?.gold ? ' · Gratus Gold' : r?.held ? ' · held, best ' + r.best : r ? ' · best ' + r.best : '') +
              (ceiling !== null && n === ceiling ? ' · the catalog ceiling' : '')}>
              <span>{n}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
