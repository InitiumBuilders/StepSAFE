/* A LINK ASKS FIRST. A gauge, a run or a file that arrives from outside is
   shown for what it is before anything is written to the record: the gauge's
   organisation and size, or who sent the run and what it says. Add it, or
   leave it. Nothing in a link is trusted more than this. */

import React from 'react';
import type { ModuxGauge } from '../content/modux-schema';
import type { BoardRun, SharedNote } from '../lib/state';

export interface Offer {
  kind: 'gauge' | 'run';
  gauge: ModuxGauge;
  run?: BoardRun;
  note?: SharedNote;
  /** where it came from: a link or a file */
  from: 'link' | 'file';
}

export function LinkOffer({ offer, known, onAccept, onDecline }: { offer: Offer; known: boolean; onAccept: () => void; onDecline: () => void }) {
  const g = offer.gauge;
  return (
    <div className="link-offer" role="dialog" aria-modal="true" aria-labelledby="link-offer-title">
      <div className="link-offer-card mx-glass">
        <span className="label">{offer.from === 'file' ? 'FROM A FILE' : 'FROM A LINK'} · {offer.kind === 'run' ? 'A RUN' : 'A GAUGE'}</span>
        <h2 id="link-offer-title">{offer.kind === 'run' && offer.run ? offer.run.by + ' ran ' + g.title : g.title}</h2>
        <p className="sec">{g.org}{g.sector ? ' · ' + g.sector : ''}</p>
        <ul className="link-offer-facts">
          <li>{g.system.nodes.length} parts, {g.system.edges.length} dependencies, {g.threats.length} threats, budget {g.budget}.</li>
          {offer.kind === 'run' && offer.run && (
            <li>About {Math.round(offer.run.hoursKept)} of 24 hours kept{offer.run.notch ? ' at notch ' + offer.run.notch : ' at Ground'}. Score {offer.run.score}, {offer.run.held ? 'every threat met a structure' : 'some threats met nothing'}. {offer.run.stack.length} {offer.run.stack.length === 1 ? 'structure' : 'structures'} in the stack.</li>
          )}
          {offer.note && <li>Sent by {offer.note.by}, who held it for about {Math.round(offer.note.hoursKept)} of 24 hours{offer.note.notch ? ' at notch ' + offer.note.notch : ' at Ground'}.</li>}
          <li>{known ? 'You already have this gauge. ' + (offer.kind === 'run' ? 'The run joins its board.' : 'Adding it again changes nothing on your record.') : 'It joins your forged gauges' + (offer.kind === 'run' ? ', and the run joins its board.' : '.')} What the sender reports is theirs; the page checks its shape, not its truth.</li>
        </ul>
        <div className="link-offer-actions">
          <button className="btn btn-key" onClick={onAccept}>{offer.kind === 'run' ? 'Add to the board' : 'Add the gauge'}</button>
          <button className="btn btn-ghost" onClick={onDecline}>Leave it</button>
        </div>
      </div>
    </div>
  );
}

/* a study set or a test that arrived by link: what it holds, by kind, and who sent it */
const KIND_WORDS: Record<string, [string, string]> = {
  term: ['term', 'terms'], model: ['structure', 'structures'], guide: ['guide', 'guides'], step: ['Step', 'Steps'],
  threat: ['threat', 'threats'], stack: ['stack', 'stacks'], room: ['room', 'rooms'], incident: ['public incident', 'public incidents'],
};

export function SetOffer({ set, onAccept, onDecline }: { set: import('../lib/share').SharedSet; onAccept: () => void; onDecline: () => void }) {
  const counts = new Map<string, number>();
  for (const id of set.ids) { const k = id.split(':')[0]; counts.set(k, (counts.get(k) || 0) + 1); }
  const parts = [...counts.entries()].map(([k, n]) => n + ' ' + (KIND_WORDS[k] ? KIND_WORDS[k][n === 1 ? 0 : 1] : k));
  const exam = set.mode === 'exam';
  return (
    <div className="link-offer" role="dialog" aria-modal="true" aria-labelledby="set-offer-title">
      <div className="link-offer-card mx-glass">
        <span className="label">FROM A LINK {'·'} {exam ? 'A TEST' : 'A STUDY SET'}</span>
        <h2 id="set-offer-title">{set.label}</h2>
        {set.by && <p className="sec">Sent by {set.by}</p>}
        <ul className="link-offer-facts">
          <li>{exam ? set.ids.length + ' questions, in the same order for everyone who opens this link.' : set.ids.length + ' cards to study as one session.'}</li>
          <li>{parts.join(', ')}.</li>
          <li>{exam ? 'Your answers stay on this device. The score is yours to send back if you choose.' : 'It opens as a session in StudyMode. Nothing is added to your record until you study.'} Cards this version of the Praxis does not have are left out.</li>
        </ul>
        <div className="link-offer-actions">
          <button className="btn btn-key" onClick={onAccept}>{exam ? 'Take the test' : 'Study the set'}</button>
          <button className="btn btn-ghost" onClick={onDecline}>Leave it</button>
        </div>
      </div>
    </div>
  );
}
