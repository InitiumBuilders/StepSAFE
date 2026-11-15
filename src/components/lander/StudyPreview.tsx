/* StudyMode, tried on the welcome page: five real cards from the deck, one of each of five kinds.
   Turn a card, rate how well you held it, and the next one comes up. Nothing is saved; the real deck,
   its review schedule and UNITIA start when you begin. */

import React, { useRef, useState } from 'react';
import { PITCH } from '../../content/pitch';

const GRADES = [
  { g: 0, label: 'Again', hint: 'back in ten minutes' },
  { g: 1, label: 'Hard', hint: 'back soon' },
  { g: 2, label: 'Good', hint: 'back later' },
  { g: 3, label: 'Strong', hint: 'back much later' },
] as const;

export function StudyPreview({ onOpen }: { onOpen: () => void }) {
  const cards = PITCH.study.sample;
  const [i, setI] = useState(0);
  const [turned, setTurned] = useState(false);
  const [rated, setRated] = useState<number[]>([]);
  const box = useRef<HTMLDivElement>(null);
  const done = i >= cards.length;
  const c = cards[Math.min(i, cards.length - 1)];

  function rate(g: number) {
    setRated(r => [...r, g]);
    setTurned(false);
    setI(x => x + 1);
    window.setTimeout(() => box.current?.querySelector<HTMLButtonElement>('.lx-sc-face')?.focus(), 60);
  }
  function onKey(e: React.KeyboardEvent) {
    if (done) return;
    if (!turned && (e.key === ' ' || e.key === 'Enter')) { e.preventDefault(); setTurned(true); }
    else if (turned && /^[1-4]$/.test(e.key)) { e.preventDefault(); rate(Number(e.key) - 1); }
  }

  return (
    <div className="lx-study" ref={box} onKeyDown={onKey} data-reveal aria-label="Try StudyMode: five cards">
      <div className="lx-sc-top">
        <span className="lx-mini">Try five cards</span>
        <span className="lx-sc-pips" aria-label={Math.min(i, cards.length) + ' of ' + cards.length + ' turned'}>
          {cards.map((_, k) => <i key={k} className={k < i ? 'done g' + rated[k] : k === i ? 'now' : ''} />)}
        </span>
      </div>
      {!done ? (
        <>
          <button type="button" className={'lx-sc-face k-' + c.kind + (turned ? ' turned' : '')} onClick={() => setTurned(t => !t)} aria-pressed={turned}
            aria-label={turned ? 'The answer. Press to see the question again.' : 'The question. Press to turn the card.'}>
            <span className="lx-sc-inner">
              <span className="lx-sc-side front">
                <span className="lx-sc-kind">{c.kindLabel} · {c.domain}</span>
                <strong>{c.title}</strong>
                <span className="lx-sc-cue">{c.cue}</span>
                <em>Turn the card</em>
              </span>
              <span className="lx-sc-side back">
                <span className="lx-sc-kind">{c.kindLabel} · {c.title}</span>
                <span className="lx-sc-answer">{c.answer}</span>
              </span>
            </span>
          </button>
          <div className={'lx-sc-grades' + (turned ? ' on' : '')} role="group" aria-label="How well did you hold it?">
            {GRADES.map(g => (
              <button key={g.g} type="button" className={'g' + g.g} disabled={!turned} onClick={() => rate(g.g)}>
                <strong>{g.label}</strong><span>{g.hint}</span>
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="lx-sc-done">
          <strong>Five cards turned.</strong>
          <p>{GRADES.filter(g => rated.includes(g.g)).map(g => rated.filter(r => r === g.g).length + ' ' + g.label).join(' · ')}. In StudyMode each one would come back on its own schedule, with {(PITCH.study.cards - cards.length).toLocaleString('en-US')} more behind them.</p>
          <div className="lx-ctas">
            <button className="lx-btn key" onClick={onOpen}>Open StudyMode</button>
            <button className="lx-btn ghost" onClick={() => { setI(0); setRated([]); setTurned(false); }}>Try them again</button>
          </div>
        </div>
      )}
    </div>
  );
}
