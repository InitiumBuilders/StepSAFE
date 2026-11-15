/* One move, start to finish: a walk from the room "The Signature Was Valid" (modelled on the theft of 21 February
   2025) to a stronger card. The stage holds one frame per step; the step crossing the middle of the screen is shown,
   and its frame plays. Every frame states one thing, and its last frame tells it whole. */

import React from 'react';
import './walk.css';
import { COPY } from './copy';
import { CARD, FIRST, INCIDENTS, ROOM } from './facts';
import { at, Grow, useSteps, v } from './shared';

const L = COPY.walk.labels;

/* 1. three signers approve what the screen shows; the payload replaces the vault's code; the vault empties */
function FrameSignature() {
  const signers = [44, 106, 168];
  return (
    <svg viewBox="0 0 400 320" className="wk-svg" aria-hidden>
      {signers.map((x, i) => <Grow key={'r' + i} x1={106} y1={142} x2={x} y2={216} cls="wk-ray wk-ray-dim" d={200 + i * 120} />)}
      <g className="wk-screen">
        <rect x="14" y="20" width="184" height="122" rx="16" className="wk-glass" />
        {[0, 1, 2].map(k => <circle key={k} cx={34 + k * 14} cy="38" r="4" className="wk-lamp" />)}
        <rect x="32" y="58" width="148" height="10" rx="5" className="wk-bar" />
        <rect x="32" y="78" width="104" height="10" rx="5" className="wk-bar" />
        <text x="106" y="122" textAnchor="middle" className="wk-t wk-t-ice">{L.routine}</text>
      </g>
      {signers.map((x, i) => (
        <g key={'s' + i} transform={`translate(${x} 236)`}>
          <circle r="18" className="wk-node" />
          <rect x="-12" y="26" width="24" height="15" rx="5" className="wk-device" />
          <path d="M -7 0 l 5 5 l 9 -10" className="wk-check" style={v({ '--d': 600 + i * 340 + 'ms' })} />
        </g>
      ))}
      <g className="wk-vault">
        <rect x="236" y="30" width="150" height="200" rx="20" className="wk-glass" />
        <rect x="250" y="70" width="122" height="146" rx="12" className="wk-fill" />
        <text x="311" y="56" textAnchor="middle" className="wk-t">{L.vault}</text>
      </g>
      <g transform="translate(311 266)">
        <g className="wk-code wk-code-a"><rect x="-66" y="-17" width="132" height="34" rx="11" /><text y="5" textAnchor="middle">{L.audited}</text></g>
        <g className="wk-code wk-code-b"><rect x="-66" y="-17" width="132" height="34" rx="11" /><text y="5" textAnchor="middle">{L.replaced}</text></g>
      </g>
      <circle cx="168" cy="236" r="6" className="wk-payload" style={v({ '--tx': '143px', '--ty': '30px' })} />
      {[0, 1, 2, 3, 4].map(k => <circle key={k} cx="372" cy={92 + k * 26} r="4.5" className="wk-out" style={v({ '--d': 2850 + k * 140 + 'ms' })} />)}
    </svg>
  );
}

/* 2. three signers read one screen, so they count as one */
function FrameOneScreen() {
  const S = { x: 200, y: 74 };
  const sig = [{ x: 92, y: 238 }, { x: 200, y: 238 }, { x: 308, y: 238 }];
  return (
    <svg viewBox="0 0 400 320" className="wk-svg" aria-hidden>
      <circle cx={S.x} cy={S.y} r="70" className="wk-keyring" />
      {sig.map((p, i) => <Grow key={i} x1={p.x} y1={p.y - 20} x2={S.x} y2={S.y + 36} cls="wk-ray wk-ray-three" d={300 + i * 220} />)}
      <Grow x1={200} y1={218} x2={200} y2={110} cls="wk-ray-one" d={1700} />
      <rect x={S.x - 64} y={S.y - 36} width="128" height="72" rx="15" className="wk-glass" />
      <text x={S.x} y={S.y + 6} textAnchor="middle" className="wk-t wk-t-amber">{L.screen}</text>
      {sig.map((p, i) => <circle key={'n' + i} cx={p.x} cy={p.y} r="18" className="wk-node" />)}
      <text x="200" y="296" textAnchor="middle" className="wk-t">{L.signers}</text>
    </svg>
  );
}

/* 3. the card names this failure, and the sign that it is working */
function FrameCard() {
  return (
    <div className="wk-card">
      <div className="wk-card-head"><span className="mt-chip">Ankras</span><span className="mt-ver">{CARD.version}</span></div>
      <p className="wk-card-name">{CARD.name}</p>
      <p className="wk-card-k">{COPY.ankras.fails}</p>
      <p className="wk-card-line wk-hl wk-hl-fail">{CARD.failsWhen[0]}</p>
      <p className="wk-card-k">{COPY.ankras.signs}</p>
      <p className="wk-card-line wk-hl wk-hl-sign">{CARD.signals[1]}</p>
    </div>
  );
}

/* 4. three losses, each one way the practice fails, each now linked and Shown */
function FrameEvidence() {
  const max = INCIDENTS[0].usd;
  return (
    <div className="wk-ev">
      {INCIDENTS.map((x, i) => (
        <div key={x.key} className="wk-ev-row" style={v({ '--d': 200 + i * 420 + 'ms', '--w': Math.max(0.04, x.usd / max).toFixed(3) })}>
          <div className="wk-ev-top"><b>{x.name}, {x.year}</b><span className="wk-ev-mode">{x.mode}</span></div>
          <i className="wk-ev-bar" />
          <div className="wk-ev-bot"><span>{x.loss}</span><b className="wk-stamp">{L.shown}</b></div>
        </div>
      ))}
    </div>
  );
}

/* the ring of twelve projects, shared by the next two frames */
const RING = { x: 248, y: 150, r: 104 };
const ring = Array.from({ length: 12 }, (_, i) => ({ i, ...at(RING.x, RING.y, RING.r, -90 + i * 30) }));
const COMMIT = [0, 3, 7, 10, 5];

/* 5. a SoundMind Team puts the move forward */
function FramePropose() {
  const team = Array.from({ length: 5 }, (_, i) => at(64, 150, 26, -90 + i * 72));
  return (
    <svg viewBox="0 0 400 320" className="wk-svg" aria-hidden>
      <circle cx={RING.x} cy={RING.y} r={RING.r} className="wk-guide" />
      {ring.map(n => <circle key={n.i} cx={n.x} cy={n.y} r="10" className="wk-proj" style={v({ '--d': 100 + n.i * 50 + 'ms' })} />)}
      {team.map((p, i) => <circle key={'t' + i} cx={p.x} cy={p.y} r="7" className="wk-team" />)}
      <circle cx="64" cy="150" r="40" className="wk-team-ring" />
      <circle cx="98" cy="150" r="6" className="wk-proposal" style={v({ '--tx': RING.x - 98 + 'px', '--ty': '0px' })} />
      <g transform={`translate(${RING.x} ${RING.y})`}><g className="wk-gem"><rect x="-14" y="-14" width="28" height="28" rx="5" transform="rotate(45)" /></g></g>
      <text x="64" y="218" textAnchor="middle" className="wk-t">{L.team}</text>
      <text x={RING.x} y="292" textAnchor="middle" className="wk-t wk-t-amber">{L.bind}</text>
    </svg>
  );
}

/* 6. five commit, one at a time, and the move locks */
function FrameLock() {
  return (
    <svg viewBox="0 0 400 320" className="wk-svg" aria-hidden>
      <circle cx={RING.x} cy={RING.y} r={RING.r} className="wk-guide" />
      <circle cx={RING.x} cy={RING.y} r={RING.r} className="wk-lockring" />
      {ring.map(n => {
        const k = COMMIT.indexOf(n.i);
        return (
          <g key={n.i} transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}>
            <circle r="10" className="wk-proj wk-proj-still" />
            {k >= 0 && <circle r="10" className="wk-commit" style={v({ '--d': 300 + k * 330 + 'ms' })} />}
          </g>
        );
      })}
      <g transform={`translate(${RING.x} ${RING.y})`}><g className="wk-gem wk-gem-lock"><rect x="-16" y="-16" width="32" height="32" rx="6" transform="rotate(45)" /></g></g>
      <text x={RING.x} y="292" textAnchor="middle" className="wk-t wk-t-amber">{L.locked}</text>
    </svg>
  );
}

/* 7. proof: what the chain shows, and what witnesses confirm */
function FrameProof() {
  return (
    <svg viewBox="0 0 400 320" className="wk-svg" aria-hidden>
      <Grow x1={84} y1={150} x2={156} y2={84} cls="wk-ray" d={300} />
      <Grow x1={84} y1={160} x2={156} y2={226} cls="wk-ray" d={500} />
      <circle cx="64" cy="156" r="22" className="wk-commit wk-commit-still" />
      <g className="wk-proofbox" style={v({ '--d': '500ms' })}>
        <text x="160" y="38" className="wk-t wk-t-cyan">{L.shown}</text>
        <rect x="156" y="50" width="152" height="68" rx="14" className="wk-glass" />
        {[0, 1, 2].map(k => <rect key={k} x={170 + k * 30} y="68" width="22" height="22" rx="5" className="wk-block" />)}
        <text x="282" y="92" textAnchor="middle" className="wk-t wk-t-big">3/5</text>
      </g>
      <g className="wk-proofbox" style={v({ '--d': '900ms' })}>
        <text x="160" y="182" className="wk-t">{L.said}</text>
        <rect x="156" y="194" width="152" height="68" rx="14" className="wk-glass" />
        <rect x="174" y="210" width="30" height="38" rx="7" className="wk-device" />
        <path d="M 226 230 l 7 7 l 14 -15" className="wk-check" style={v({ '--d': '1100ms' })} />
      </g>
      {[0, 1].map(k => (
        <g key={k}>
          <Grow x1={350} y1={200 + k * 62} x2={310} y2={224 + k * 14} cls="wk-attest" d={1400 + k * 260} />
          <circle cx="352" cy={198 + k * 62} r="14" className="wk-witness" style={v({ '--d': 1300 + k * 260 + 'ms' })} />
        </g>
      ))}
      <text x="352" y="304" textAnchor="middle" className="wk-t">{L.witnesses}</text>
    </svg>
  );
}

/* 8. five reports become one result; the card moves to 1.1.0; the people whose insight changed it earn TRUST */
function FrameResults() {
  const floor = { x: 150, y: 104, r: 36 };
  const slots = Array.from({ length: 5 }, (_, i) => at(floor.x, floor.y, floor.r, -90 + i * 72));
  const people = [{ x: 80, t: L.researcher }, { x: 200, t: L.reviewers }, { x: 320, t: L.teams }];
  return (
    <svg viewBox="0 0 400 320" className="wk-svg" aria-hidden>
      <circle cx={floor.x} cy={floor.y} r={floor.r} className="wk-floor" />
      {slots.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="8" className="wk-slot" />
          <circle cx={24} cy={40 + i * 32} r="7" className="wk-report" style={v({ '--tx': (p.x - 24).toFixed(1) + 'px', '--ty': (p.y - 40 - i * 32).toFixed(1) + 'px', '--d': 200 + i * 220 + 'ms' })} />
        </g>
      ))}
      <text x={floor.x} y={floor.y + 66} textAnchor="middle" className="wk-t">{L.floor}</text>
      <circle cx={floor.x} cy={floor.y} r="8" className="wk-result" style={v({ '--tx': 300 - floor.x + 'px', '--ty': '0px' })} />
      <g className="wk-mini">
        <rect x="262" y="44" width="76" height="120" rx="14" className="wk-glass wk-glass-lit" />
        <rect x="276" y="62" width="48" height="8" rx="4" className="wk-bar" />
        <rect x="276" y="78" width="36" height="8" rx="4" className="wk-bar" />
        <text x="300" y="132" textAnchor="middle" className="wk-ver wk-ver-was">1.0.0</text>
        <text x="300" y="132" textAnchor="middle" className="wk-ver wk-ver-now">1.1.0</text>
      </g>
      {people.map((p, i) => (
        <g key={p.t}>
          <circle cx={p.x} cy="262" r="15" className="wk-person" />
          <g transform="translate(300 168)"><g className="wk-trust" style={v({ '--tx': p.x - 300 + 'px', '--ty': '94px', '--d': 2700 + i * 200 + 'ms' })}><rect x="-6" y="-6" width="12" height="12" rx="2" transform="rotate(45)" /></g></g>
          <text x={p.x} y="304" textAnchor="middle" className="wk-t">{p.t}</text>
        </g>
      ))}
    </svg>
  );
}

const FRAMES = [FrameSignature, FrameOneScreen, FrameCard, FrameEvidence, FramePropose, FrameLock, FrameProof, FrameResults];

export function Walk() {
  const steps = COPY.walk.steps;
  const { active, bind } = useSteps(steps.length);
  return (
    <section className="mt-sec wk" id="walk" aria-labelledby="walk-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{COPY.walk.kicker}</p>
        <h2 className="mt-h2 mt-h2-big wk-title" id="walk-h">{COPY.walk.title}</h2>
        <p className="mt-p mt-p-wide">{COPY.walk.intro}</p>
        <a className="mt-btn wk-room" href={ROOM.href}>{COPY.walk.room}: {ROOM.title}</a>
        <div className="wk-grid">
          <div className="wk-stage" aria-hidden>
            {FRAMES.map((F, i) => (
              <div key={i} className={'wk-frame' + (i === active ? ' on' : '')}><F /></div>
            ))}
          </div>
          <ol className="wk-steps">
            {steps.map((s, i) => (
              <li key={s.t} ref={bind(i)} data-step={i} className={'wk-step' + (i === active ? ' on' : '')}>
                <span className="wk-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-h3">{s.t}</h3>
                <p className="mt-p">{s.d}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="mt-note wk-first">{COPY.first.kicker}: {FIRST.ankras}, {FIRST.threshold} projects, {FIRST.witnesses} witnesses each, measured for {FIRST.measuredDays} days.</p>
      </div>
    </section>
  );
}
