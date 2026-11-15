/* The newer sections of both pages. Each scene states one thing:
   - Holds: attacks arrive from eight sides of the move and each stops at the rule built to meet it; the move holds,
     and under watch it keeps holding, one attack at a time.
   - Levers: a light climbs Meadows' twelve places to intervene and stays on the six where MOTRUS works.
   - Precedent: three rings fill one party at a time and close at their thresholds: the ozone treaty at eleven,
     the climate accord at fifty-five, the first MOTRUS at five.
   - CardTrue: four attacks reach a card from four sides and stop at its rules; the card keeps its seal.
   Text never waits on a scene. Under calm motion every scene shows its last frame. Words live in defense-copy.ts;
   facts and sources in facts.ts. */

import React from 'react';
import './defense.css';
import { DEF } from './defense-copy';
import { FIRST, MEADOWS, TREATIES } from './facts';
import { at, useScene, v } from './shared';

const C = 220;

/** where each gate sits: the first half down the left side, top to bottom, the rest down the right, so every rule in
    the lists beside the ring faces its own gate */
function gateAngle(n: number, k: number) {
  const step = 360 / n, half = n / 2, off = 90 - step / 2;
  return k < half ? 180 + off - k * step : -off + (k - half) * step;
}
const hit = (k: number) => 500 + k * 280;

/** a ring of rules with attacks arriving at every gate; the centre is the move or the card. Each gate's number sits
    just inside it, off the path its attack travels */
function Shield({ n, kind }: { n: number; kind: 'move' | 'card' }) {
  const step = 360 / n;
  const span = step * (n > 4 ? 0.5 : 0.36);
  const gates = Array.from({ length: n }, (_, k) => {
    const a = gateAngle(n, k);
    const p0 = at(C, C, 98, a - span / 2), p1 = at(C, C, 98, a + span / 2), num = at(C, C, n > 4 ? 79 : 84, a);
    return { k, a, d: `M ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} A 98 98 0 0 1 ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`, num };
  });
  const period = 16000 / n;
  return (
    <svg viewBox="40 40 360 360" className="df-svg" aria-hidden>
      <circle cx={C} cy={C} r="98" className="df-ring" />
      <circle cx={C} cy={C} r="172" className="df-field" />
      {gates.map(g => (
        <g key={g.k} style={v({ '--d': hit(g.k) + 'ms', '--d2': 4200 + g.k * period + 'ms', '--p': 16000 + 'ms' })}>
          <g transform={`rotate(${g.a} ${C} ${C})`}>
            <g className="df-atk">
              <line x1={C + 112} y1={C} x2={C + 150} y2={C} className="df-tail" />
              <circle cx={C + 110} cy={C} r="6.5" className="df-dot" />
            </g>
          </g>
          <path d={g.d} className="df-gate" />
          <path d={g.d} className="df-gate-lit" />
          <text x={g.num.x.toFixed(1)} y={(g.num.y + 6).toFixed(1)} textAnchor="middle" className="df-num">{g.k + 1}</text>
        </g>
      ))}
      <g className="df-core" style={v({ '--d': hit(n - 1) + 900 + 'ms' })}>
        {kind === 'move' ? (
          <>
            <circle cx={C} cy={C} r="62" className="df-core-ring" />
            {Array.from({ length: 5 }, (_, i) => { const p = at(C, C, 40, -90 + i * 72); return <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r="6" className="df-member" />; })}
            <circle cx={C} cy={C} r="13" className="df-heart" />
          </>
        ) : (
          <>
            <rect x={C - 40} y={C - 52} width="80" height="104" rx="16" className="df-card" />
            <line x1={C - 22} y1={C - 24} x2={C + 22} y2={C - 24} className="df-card-line" />
            <line x1={C - 22} y1={C - 6} x2={C + 14} y2={C - 6} className="df-card-line" />
            <line x1={C - 22} y1={C + 12} x2={C + 18} y2={C + 12} className="df-card-line" />
            <circle cx={C + 22} cy={C + 34} r="11" className="df-heart" />
          </>
        )}
      </g>
    </svg>
  );
}

function Rows({ rows, start, side }: { rows: readonly { t: string; d: string }[]; start: number; side: 'left' | 'right' }) {
  return (
    <ol className={'df-rows df-' + side} start={start + 1}>
      {rows.map((r, i) => (
        <li key={r.t} style={v({ '--d': hit(start + i) + 650 + 'ms' })}>
          <span className="df-n" aria-hidden>{start + i + 1}</span>
          <div>
            <h3 className="mt-h3 df-t">{r.t}</h3>
            <p className="df-d">{r.d}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

/* ---------- the move holds ---------- */
export function Holds() {
  const s = useScene<HTMLDivElement>();
  const D = DEF.holds;
  return (
    <section className="mt-sec" id="holds" aria-labelledby="holds-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{D.kicker}</p>
        <h2 className="mt-h2" id="holds-h">{D.title}</h2>
        <p className="mt-p mt-p-wide">{D.lede}</p>
        <div className={'df-wing df-shield' + s.cls} ref={s.ref}>
          <Rows rows={D.rows.slice(0, 4)} start={0} side="left" />
          <figure className="df-fig">
            <Shield n={8} kind="move" />
            <figcaption className="mt-sr">{D.caption}</figcaption>
          </figure>
          <Rows rows={D.rows.slice(4)} start={4} side="right" />
        </div>
      </div>
    </section>
  );
}

/* ---------- where it moves the system ---------- */
export function Levers() {
  const s = useScene<HTMLOListElement>();
  const D = DEF.levers;
  return (
    <section className="mt-sec" id="levers" aria-labelledby="levers-h">
      <div className="mt-wrap lv-split">
        <div>
          <p className="mt-kicker">{D.kicker}</p>
          <h2 className="mt-h2" id="levers-h">{D.title}</h2>
          <p className="mt-p">{D.lede}</p>
          <a className="mt-src" href={MEADOWS} rel="noopener">{D.source}</a>
        </div>
        <ol className={'lv' + s.cls} ref={s.ref} aria-label={D.title}>
          {D.rungs.map((r, i) => {
            const line = 'line' in r ? r.line : undefined;
            return (
              <li key={r.n} className={'lv-rung' + (line ? ' lit' : '') + (r.n === 2 ? ' top' : '')} style={v({ '--k': D.rungs.length - 1 - i })}>
                <span className="lv-bar" aria-hidden><i /></span>
                <span className="lv-num">{r.n}</span>
                <span className="lv-text">
                  <span className="lv-name">{r.name}</span>
                  {line && <span className="lv-line">{line}</span>}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ---------- thresholds have moved the world ---------- */
function Ring({ n, delay, label }: { n: number; delay: number; label: string }) {
  const gap = (2 * Math.PI * 88) / n;
  const r = Math.min(10, gap * 0.34);
  const step = 2000 / n;
  return (
    <svg viewBox="0 0 240 240" className="pc-svg" aria-hidden>
      <circle cx="120" cy="120" r="88" className="pc-track" />
      {Array.from({ length: n }, (_, i) => {
        const p = at(120, 120, 88, -90 + (i * 360) / n);
        return <circle key={i} cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={r.toFixed(1)} className="pc-dot" style={v({ '--d': (delay + i * step).toFixed(0) + 'ms' })} />;
      })}
      <circle cx="120" cy="120" r="104" className="pc-close" style={v({ '--d': delay + 2150 + 'ms' })} />
      <text x="120" y="134" textAnchor="middle" className="pc-n">{n}</text>
      <text x="120" y="160" textAnchor="middle" className="pc-label">{label}</text>
    </svg>
  );
}

export function Precedent() {
  const s = useScene<HTMLDivElement>();
  const D = DEF.precedent;
  const items = [
    ...TREATIES.map((t, i) => ({ key: t.name, name: t.name, when: 'In force ' + t.inForce, rule: t.rule, n: t.n, label: t.inForce.slice(-4), delay: 300 + i * 700 })),
    { key: 'motrus', name: 'The first MOTRUS', when: D.proposed, rule: FIRST.threshold + ' organizations commit, then each one adopts', n: FIRST.threshold, label: 'Next', delay: 1700 },
  ];
  return (
    <section className="mt-sec" id="precedent" aria-labelledby="precedent-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{D.kicker}</p>
        <h2 className="mt-h2" id="precedent-h">{D.title}</h2>
        <p className="mt-p mt-p-wide">{D.lede}</p>
        <div className={'pc' + s.cls} ref={s.ref}>
          {items.map(x => (
            <figure key={x.key} className={'pc-item' + (x.key === 'motrus' ? ' pc-ours' : '')}>
              <Ring n={x.n} delay={x.delay} label={x.label} />
              <figcaption>
                <h3 className="mt-h3">{x.name}</h3>
                <p className="pc-when">{x.when}</p>
                <p className="pc-rule">{x.rule}</p>
              </figcaption>
            </figure>
          ))}
          <p className="mt-sr">{D.caption}</p>
        </div>
        <p className="pc-src">{TREATIES.map(t => <a key={t.href} className="mt-src" href={t.href} rel="noopener">{t.source}</a>)}</p>
      </div>
    </section>
  );
}

/* ---------- the card stays true (Ankras page) ---------- */
export function CardTrue() {
  const s = useScene<HTMLDivElement>();
  const D = DEF.cardTrue;
  return (
    <section className="mt-sec" id="true" aria-labelledby="true-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{D.kicker}</p>
        <h2 className="mt-h2" id="true-h">{D.title}</h2>
        <p className="mt-p mt-p-wide">{D.lede}</p>
        <div className={'df-wing df-shield df-four' + s.cls} ref={s.ref}>
          <Rows rows={D.rows.slice(0, 2)} start={0} side="left" />
          <figure className="df-fig">
            <Shield n={4} kind="card" />
            <figcaption className="mt-sr">{D.caption}</figcaption>
          </figure>
          <Rows rows={D.rows.slice(2)} start={2} side="right" />
        </div>
      </div>
    </section>
  );
}
