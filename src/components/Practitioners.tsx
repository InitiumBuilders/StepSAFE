/* Where practitioners gather: the Outlier.Systems group on Telegram (August's choice, 2026-11-18). One door, used on
   Ground and at the end of every room's debrief. It names the group and claims nothing about its size. */

import React from 'react';

export const PRACTITIONERS_URL = 'https://t.me/Outlier_Systems';

export function PractitionersDoor({ className }: { className?: string }) {
  return (
    <div className={'panel prx' + (className ? ' ' + className : '')}>
      <span className="label">Practitioners</span>
      <p className="sec prx-line">Bring a room or a Step to the Outlier.Systems group on Telegram.</p>
      <a className="btn btn-sm prx-go" href={PRACTITIONERS_URL} target="_blank" rel="noopener noreferrer">
        Open the group <span aria-hidden>↗</span><span className="prx-sr"> (opens Telegram in a new tab)</span>
      </a>
    </div>
  );
}
