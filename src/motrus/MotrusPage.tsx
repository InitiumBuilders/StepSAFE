/* MOTRUS: the proposal page at /MOTRUS, drawn on its own (main.tsx loads it only when asked for).
   Every scene states something about the protocol, plays once when it comes into view, runs its ambient motion
   only while on screen, and under calm motion shows its last frame, which tells the whole story. Text never
   waits on an animation. Words live in copy.ts; facts live in facts.ts. */

import React, { useEffect, useRef, useState } from 'react';
import './motrus.css';
import { COPY, HIS } from './copy';
import { CARD, FIRST, MEASURED } from './facts';
import { at, Mark, PartsIndex, rad, TopNav, useHashScroll, usePointerLight, useScene, v } from './shared';
import { Walk } from './Walk';
import { CardBrief, Industry, RewardsBrief, Teams, Terms } from './Sections';
import { Holds, Levers, Precedent } from './Defense';

/* ---------- 1. the hero: twelve organizations commit, the move locks at two thirds ---------- */
const H = { cx: 210, cy: 210, r: 150 };
const ORDER = [3, 9, 0, 6, 11, 4, 1, 7, 10, 2, 8, 5];
const SCATTER = [[-38, -62], [54, -30], [70, 18], [22, 66], [-44, 58], [-72, 10], [-30, -70], [48, -58], [66, 40], [-12, 72], [-68, 36], [-58, -34]];
const T0 = 900, STEP = 270, AFTER = 520;
const commitAt = (i: number) => { const k = ORDER.indexOf(i); return T0 + k * STEP + (k >= 8 ? AFTER : 0); };
const LOCK = T0 + 7 * STEP + 380;

function Hero() {
  const [on, setOn] = useState(false);
  const [live, setLive] = useState(true);
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setOn(true));
    const el = ref.current;
    let io: IntersectionObserver | null = null;
    if (el && typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(es => { for (const e of es) setLive(e.isIntersecting); });
      io.observe(el);
    }
    return () => { window.cancelAnimationFrame(id); io?.disconnect(); };
  }, []);
  const nodes = Array.from({ length: 12 }, (_, i) => ({ i, ...at(H.cx, H.cy, H.r, -90 + i * 30), dx: SCATTER[i][0], dy: SCATTER[i][1], c: commitAt(i) }));
  return (
    <header className="mt-hero" id="top">
      <div className="mt-wrap mt-hero-grid">
        <div className="mt-hero-text">
          <p className="mt-kicker mt-rise" style={v({ '--d': '80ms' })}>{COPY.kicker}</p>
          <h1 className="mt-h1 mt-rise" style={v({ '--d': '160ms' })}>MOTRUS</h1>
          <p className="mt-tagline mt-rise" style={v({ '--d': '320ms' })} data-his>{HIS.tagline}</p>
          <p className="mt-meaning mt-rise" style={v({ '--d': '480ms' })} data-his>“{HIS.meaning}”</p>
          <p className="mt-lede mt-rise" style={v({ '--d': '640ms' })}>{COPY.lede}</p>
          <div className="mt-actions mt-rise" style={v({ '--d': '800ms' })}>
            <a className="mt-btn mt-btn-key" href="#walk">{COPY.read}</a>
            <a className="mt-btn" href="/">{COPY.open}</a>
          </div>
        </div>
        <figure className={'mt-hero-scene' + (on ? ' on' : '') + (live ? ' live' : '')} ref={ref}>
          <svg viewBox="0 0 420 420" aria-hidden>
            <circle className="mt-h-guide" cx={H.cx} cy={H.cy} r={H.r} />
            <g className="mt-h-spin">
              {nodes.map(n => {
                const m = nodes[(n.i + 1) % 12];
                return <path key={'a' + n.i} className="mt-h-arc" style={v({ '--a': Math.max(n.c, m.c) + 620 + 'ms' })}
                  d={`M ${n.x.toFixed(1)} ${n.y.toFixed(1)} A ${H.r} ${H.r} 0 0 1 ${m.x.toFixed(1)} ${m.y.toFixed(1)}`} />;
              })}
              {nodes.map(n => (
                <g key={'n' + n.i} transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}>
                  <g className="mt-h-node" style={v({ '--dx': n.dx + 'px', '--dy': n.dy + 'px', '--c': n.c + 'ms', '--i': n.i })}>
                    <circle className="mt-h-halo" r="15" />
                    <circle className="mt-h-ripple" r="9" />
                    <circle className="mt-h-dot" r="6.5" />
                    <circle className="mt-h-dot2" r="6.5" />
                  </g>
                </g>
              ))}
            </g>
            <g className="mt-h-orbit" style={v({ '--l': LOCK + 1700 + 'ms' })}>
              <circle cx={H.cx} cy={H.cy - H.r} r="11" className="mt-h-orbit-glow" />
              <circle cx={H.cx} cy={H.cy - H.r} r="4" className="mt-h-orbit-dot" />
            </g>
            <circle className="mt-h-lock" cx={H.cx} cy={H.cy} r={H.r} style={v({ '--l': LOCK + 'ms' })} />
            <circle className="mt-h-wave" cx={H.cx} cy={H.cy} r={H.r} style={v({ '--l': LOCK + 'ms' })} />
            <g className="mt-h-core" style={v({ '--l': LOCK + 120 + 'ms' })}>
              <circle cx={H.cx} cy={H.cy} r="34" className="mt-h-core-halo" />
              <rect x={H.cx - 15} y={H.cy - 15} width="30" height="30" rx="5" transform={`rotate(45 ${H.cx} ${H.cy})`} className="mt-h-core-gem" />
              <circle cx={H.cx} cy={H.cy} r="4.5" className="mt-h-core-eye" />
            </g>
          </svg>
          <figcaption className="mt-sr">{COPY.heroCaption}</figcaption>
        </figure>
      </div>
    </header>
  );
}

/* ---------- 2. the gap: alone the first mover pays; together they move at once ---------- */
const GX = [40, 100, 160, 220, 280];
function Gap() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="gap" aria-labelledby="gap-h">
      <div className="mt-wrap mt-gap-wrap">
        <div className="mt-gap-text">
          <h2 className="mt-h2" id="gap-h">{COPY.gap.title}</h2>
          {COPY.gap.body.map((p, i) => <p className="mt-p" key={i}>{p}</p>)}
        </div>
        <figure className={'mt-scene mt-gap' + s.cls} ref={s.ref}>
          <div className="mt-gap-row">
            <svg viewBox="0 0 320 220" className="mt-gap-alone" aria-hidden>
              <text x="16" y="28" className="mt-svg-label">{COPY.gap.alone}</text>
              <line x1="16" y1="176" x2="304" y2="176" className="mt-base" />
              {GX.map((x, i) => (
                <g key={i} transform={`translate(${x} 150)`}>
                  <g className={i === 0 ? 'mt-g-first' : 'mt-g-idle'}><circle r="11" className="mt-g-dot" /></g>
                </g>
              ))}
              <g transform="translate(40 102)">
                <rect x="-19" y="-36" width="38" height="24" rx="7" className="mt-g-weight" />
              </g>
            </svg>
            <svg viewBox="0 0 320 220" className="mt-gap-together" aria-hidden>
              <text x="16" y="28" className="mt-svg-label">{COPY.gap.together}</text>
              <line x1="16" y1="176" x2="304" y2="176" className="mt-base" />
              {GX.map((x, i) => (
                <g key={i} transform={`translate(${x} 150)`}>
                  <g className={'mt-g-mover' + (i === 4 ? ' late' : '')} style={v({ '--i': i })}>
                    <circle r="19" className="mt-g-ring" style={v({ '--r': (i < 4 ? 520 + i * 360 : 2760) + 'ms' })} />
                    <circle r="11" className="mt-g-dot mt-g-dot-on" />
                    <rect x="-7" y="-22" width="14" height="8" rx="3" className="mt-g-share" />
                  </g>
                </g>
              ))}
            </svg>
          </div>
          <figcaption className="mt-sr">{COPY.gap.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 4. the two layers: Intuition (atoms, triples, stake) and Dash (identity, documents, votes) ---------- */
/* a triple's edge, drawn in its own frame so its word sits along it and its signal travels it */
type Pt = { x: number; y: number };
type Edge = { a: Pt; b: Pt; word: string; d: number };
function EdgeLine({ e }: { e: Edge }) {
  const ang = (Math.atan2(e.b.y - e.a.y, e.b.x - e.a.x) * 180) / Math.PI;
  const len = Math.hypot(e.b.x - e.a.x, e.b.y - e.a.y) - 32;
  return (
    <g className="mt-i-edge" style={v({ '--d': e.d + 'ms' })} transform={`translate(${e.a.x} ${e.a.y}) rotate(${ang.toFixed(1)})`}>
      <line x1={16} y1={0} x2={16 + len} y2={0} />
      <circle className="mt-i-pulse" cx={16} cy={0} r="3.2" style={v({ '--len': len.toFixed(0) + 'px', '--d': e.d + 'ms' })} />
      <text x={16 + len / 2} y={-10} textAnchor="middle" className="mt-i-word">{e.word}</text>
    </g>
  );
}
function Layers() {
  const s = useScene<HTMLDivElement>();
  const A = { x: 100, y: 140 }, T = { x: 288, y: 66 }, B = { x: 288, y: 212 };
  const atoms = [
    { p: A, lines: [CARD.name], ver: CARD.version, below: true, k: 'card', d: 200 },
    { p: T, lines: ['Single private key', 'theft or loss'], below: false, k: 'threat', d: 420 },
    { p: B, lines: ['Treasury tiers'], below: true, k: 'card', d: 640 },
  ];
  const edges: Edge[] = [
    { a: A, b: T, word: 'holds', d: 900 },
    { a: A, b: B, word: 'combines with', d: 1150 },
  ];
  const votes = Array.from({ length: 24 }, (_, i) => ({ i, yes: ![3, 8, 13, 17, 20, 23].includes(i) }));
  return (
    <section className="mt-sec" id="layers" aria-labelledby="layers-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{COPY.layers.kicker}</p>
        <h2 className="mt-h2" id="layers-h">{COPY.layers.title}</h2>
        <div className={'mt-layers' + s.cls} ref={s.ref}>
          <figure className="mt-panel">
            <h3 className="mt-h3">{COPY.layers.intuitionTitle}</h3>
            <svg viewBox="0 0 360 310" role="img" aria-label={COPY.layers.atomsLabel}>
              {edges.map(e => <EdgeLine key={e.word} e={e} />)}
              {atoms.map(a => (
                <g key={a.lines[0]} className={'mt-i-atom mt-i-' + a.k} style={v({ '--d': a.d + 'ms' })} transform={`translate(${a.p.x} ${a.p.y})`}>
                  <g className="mt-i-atom-in"><circle r="13" /><circle r="5" className="mt-i-core" /></g>
                  {a.lines.map((l, i) => <text key={l} y={a.below ? 33 + i * 18 : -24 - (a.lines.length - 1 - i) * 18} textAnchor="middle">{l}</text>)}
                  {a.ver && <text y={51} textAnchor="middle" className="mt-i-ver">{a.ver}</text>}
                </g>
              ))}
              <g className="mt-i-stake" transform="translate(36 262)">
                <text x="0" y="0" className="mt-svg-label">{COPY.layers.stakeOn}</text>
                <text x="0" y="22" className="mt-i-stake-word">{COPY.layers.stakeFor}</text>
                <rect x="0" y="30" width="124" height="8" rx="4" className="mt-i-bar-bg" />
                <rect x="0" y="30" width="124" height="8" rx="4" className="mt-i-bar mt-i-for" style={v({ '--s': 0.82 })} />
                <text x="160" y="22" className="mt-i-stake-word">{COPY.layers.stakeAgainst}</text>
                <rect x="160" y="30" width="124" height="8" rx="4" className="mt-i-bar-bg" />
                <rect x="160" y="30" width="124" height="8" rx="4" className="mt-i-bar mt-i-against" style={v({ '--s': 0.18 })} />
              </g>
            </svg>
            <p className="mt-p">{COPY.layers.intuition}</p>
            <p className="mt-note">{COPY.layers.words}</p>
          </figure>
          <figure className="mt-panel">
            <h3 className="mt-h3">{COPY.layers.dashTitle}</h3>
            <svg viewBox="0 0 360 260" role="img" aria-label={COPY.layers.identity + ', ' + COPY.layers.document + ', ' + COPY.layers.vote}>
              <text x="20" y="22" className="mt-svg-label">{COPY.layers.identity}</text>
              <g className="mt-d-id">
                <rect x="20" y="34" width="162" height="58" rx="16" />
                <text x="36" y="69" className="mt-d-name">your-org.dash</text>
                <path d="M 152 58 l 6 6 l 12 -12" className="mt-d-check" />
              </g>
              <text x="200" y="22" className="mt-svg-label">{COPY.layers.document}</text>
              <g className="mt-d-doc">
                <rect x="200" y="34" width="132" height="92" rx="14" />
                <line x1="216" y1="58" x2="306" y2="58" /><line x1="216" y1="74" x2="296" y2="74" /><line x1="216" y1="90" x2="280" y2="90" />
              </g>
              <g className="mt-d-seal" transform="translate(316 118)"><g className="mt-d-seal-in"><circle r="17" /><path d="M -7 0 l 5 5 l 9 -10" /></g></g>
              <text x="20" y="164" className="mt-svg-label">{COPY.layers.vote}</text>
              {votes.map(x => (
                <rect key={x.i} x={20 + (x.i % 12) * 27} y={176 + Math.floor(x.i / 12) * 30} width="21" height="21" rx="6"
                  className={'mt-d-vote' + (x.yes ? ' yes' : '')} style={v({ '--d': 900 + x.i * 55 + 'ms' })} />
              ))}
            </svg>
            <p className="mt-p">{COPY.layers.dash}</p>
          </figure>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. the move: proposed, open, locked, adopting, measured, evolved ---------- */
function Move() {
  const s = useScene<HTMLDivElement>();
  const ST = (i: number) => 300 + i * 520;
  return (
    <section className="mt-sec mt-sec-move" id="move" aria-labelledby="move-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{COPY.move.kicker}</p>
        <h2 className="mt-h2 mt-h2-big" id="move-h">{COPY.move.title}</h2>
        <p className="mt-p mt-p-wide">{COPY.move.body}</p>
        <p className="mt-note">{COPY.move.praxis}</p>
        <div className={'mt-move' + s.cls} ref={s.ref}>
          <ol className="mt-path">
            {COPY.move.stations.map((st, i) => (
              <li key={st.k} className={'mt-st mt-st-' + st.k} style={v({ '--d': ST(i) + 'ms' })}>
                {i > 0 && <span className="mt-st-link" aria-hidden style={v({ '--d': ST(i) - 260 + 'ms' })} />}
                <span className="mt-st-dot" aria-hidden>
                  {st.k === 'locked' ? (
                    <svg viewBox="0 0 24 24"><path className="mt-lock-shackle" d="M8 11V8a4 4 0 0 1 8 0v3" /><rect x="5.5" y="11" width="13" height="9" rx="2.5" /></svg>
                  ) : <i />}
                </span>
                <b>{st.t}</b>
                <span className="mt-st-d">{st.d}</span>
                {st.k === 'open' && (
                  <span className="mt-st-commits" aria-hidden>
                    {[0, 1, 2, 3, 4].map(k => <i key={k} style={v({ '--d': ST(i) + 140 + k * 110 + 'ms' })} className={k < 4 ? 'yes' : ''} />)}
                  </span>
                )}
                {st.k === 'measured' && (
                  <span className="mt-st-ticks" aria-hidden>
                    {[0.45, 0.7, 0.6, 0.85, 0.75, 0.95].map((h, k) => <i key={k} style={v({ '--h': h, '--d': ST(i) + 160 + k * 90 + 'ms' })} />)}
                  </span>
                )}
                {st.k === 'evolved' && (
                  <span className="mt-st-ver" aria-hidden><em className="was">1.0.0</em><em className="now">1.1.0</em></span>
                )}
              </li>
            ))}
          </ol>
          <p className="mt-lapsed">{COPY.move.lapsed}</p>
          <div className="mt-lanes">
            <div className="mt-lane"><b>{COPY.move.standard}</b><span>{COPY.move.standardBody}</span><i className="mt-lane-bar mt-lane-long" aria-hidden /></div>
            <div className="mt-lane"><b>{COPY.move.emergency}</b><span>{COPY.move.emergencyBody}</span><i className="mt-lane-bar mt-lane-short" aria-hidden /></div>
          </div>
          <Terms />
        </div>
      </div>
    </section>
  );
}

/* ---------- 6. proof and privacy: Shown from the chain, Said with witnesses, nothing below five ---------- */
function Proof() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="proof" aria-labelledby="proof-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{COPY.proof.kicker}</p>
        <h2 className="mt-h2" id="proof-h">{COPY.proof.title}</h2>
        <div className={'mt-proof' + s.cls} ref={s.ref}>
          <figure className="mt-panel">
            <h3 className="mt-h3">{COPY.proof.shownTitle}</h3>
            <svg viewBox="0 0 320 160" aria-hidden>
              <g className="mt-p-addr"><rect x="8" y="50" width="104" height="60" rx="14" />{COPY.proof.address.map((l, i) => <text key={l} x="60" y={76 + i * 18} textAnchor="middle">{l}</text>)}</g>
              <g className="mt-p-arrow"><line x1="118" y1="80" x2="170" y2="80" /><path d="M 164 74 l 7 6 l -7 6" /><text x="144" y="70" textAnchor="middle">{COPY.proof.spends}</text></g>
              <g className="mt-p-script">
                <rect x="178" y="34" width="134" height="92" rx="16" />
                <text x="245" y="60" textAnchor="middle" className="mt-p-script-word">{COPY.proof.script}</text>
                <text x="245" y="88" textAnchor="middle" className="mt-p-big">3 of 5</text>
                {[0, 1, 2, 3, 4].map(k => <rect key={k} x={197 + k * 20} y={100} width="14" height="14" rx="4" className={'mt-p-key' + (k < 3 ? ' lit' : '')} style={v({ '--d': 1500 + k * 110 + 'ms' })} />)}
              </g>
              <g className="mt-p-stamp" transform="translate(70 30) rotate(-6)"><g className="mt-stamp-in"><rect x="-38" y="-16" width="76" height="30" rx="9" /><text y="5" textAnchor="middle">Shown</text></g></g>
            </svg>
            <p className="mt-p">{COPY.proof.shown}</p>
          </figure>
          <figure className="mt-panel">
            <h3 className="mt-h3">{COPY.proof.saidTitle}</h3>
            <svg viewBox="0 0 320 160" aria-hidden>
              <g className="mt-p-claim"><rect x="20" y="36" width="190" height="80" rx="16" /><line x1="40" y1="64" x2="186" y2="64" /><line x1="40" y1="82" x2="170" y2="82" /><line x1="40" y1="100" x2="150" y2="100" /></g>
              <g className="mt-p-said" transform="translate(186 28) rotate(5)"><g className="mt-stamp-in"><rect x="-30" y="-15" width="60" height="28" rx="9" /><text y="5" textAnchor="middle">Said</text></g></g>
              {[0, 1].map(k => (
                <g key={k} className="mt-p-witness" style={v({ '--d': 1300 + k * 420 + 'ms' })} transform={`translate(${262 + k * 0} ${54 + k * 62})`}>
                  <path d={k === 0 ? 'M -18 8 Q -34 14 -50 22' : 'M -18 -6 Q -34 -14 -50 -22'} className="mt-p-attest" />
                  <circle r="15" /><circle r="5" className="mt-p-witness-core" />
                </g>
              ))}
              <text x="262" y="96" textAnchor="middle" className="mt-p-attest-word">{COPY.proof.attests}</text>
            </svg>
            <p className="mt-p mt-p-quote">{COPY.proof.statement}</p>
            <p className="mt-p">{COPY.proof.said}</p>
          </figure>
          <figure className="mt-panel">
            <h3 className="mt-h3">{COPY.proof.floorTitle}</h3>
            <svg viewBox="0 0 320 160" aria-hidden>
              {[0, 1, 2, 3, 4].map(k => (
                <g key={k} transform={`translate(${48 + k * 56} 36)`}>
                  <circle r="15" className="mt-p-slot" />
                  <circle r="15" className="mt-p-slot-on" style={v({ '--d': 400 + k * 380 + 'ms' })} />
                </g>
              ))}
              <rect x="20" y="70" width="280" height="72" rx="16" className="mt-p-result" />
              <text x="160" y="112" textAnchor="middle" className="mt-p-result-word">{COPY.proof.published}</text>
              <g className="mt-p-veil"><rect x="20" y="70" width="280" height="72" rx="16" /><line x1="40" y1="92" x2="280" y2="92" /><line x1="40" y1="106" x2="260" y2="106" /><line x1="40" y1="120" x2="270" y2="120" /></g>
            </svg>
            <p className="mt-p">{COPY.proof.floor}</p>
          </figure>
        </div>
        <p className="mt-p mt-p-wide mt-circle-line"><Mark size={22} />{COPY.proof.circle}</p>
      </div>
    </section>
  );
}

/* ---------- 7. the loop: practice, move, results, new version, the defender AI; the ratchet keeps what held ---------- */
function gearPath(cx: number, cy: number, r: number, teeth: number) {
  const pts: string[] = [];
  for (let i = 0; i < teeth; i++) {
    const a0 = (i / teeth) * 360, a1 = a0 + (360 / teeth) * 0.55;
    const p0 = at(cx, cy, r, a0), p1 = at(cx, cy, r + 9, a0 + 4), p2 = at(cx, cy, r + 9, a1 - 2), p3 = at(cx, cy, r, a1);
    pts.push(`${i ? 'L' : 'M'} ${p0.x.toFixed(1)} ${p0.y.toFixed(1)} L ${p1.x.toFixed(1)} ${p1.y.toFixed(1)} L ${p2.x.toFixed(1)} ${p2.y.toFixed(1)} L ${p3.x.toFixed(1)} ${p3.y.toFixed(1)}`);
  }
  return pts.join(' ') + ' Z';
}
function Loop() {
  const s = useScene<HTMLDivElement>();
  const C = 200, R = 118, PERIOD = 10;
  /* Practice on the left, then clockwise: Move at the top, Results on the right, New version at the bottom */
  const ANG = [180, 270, 0, 90];
  const st = COPY.loop.stations.map((t, i) => {
    const deg = ANG[i];
    const p = at(C, C, R, deg);
    const lab = deg === 180 ? { x: p.x - 26, y: p.y + 6, a: 'end' as const } : deg === 0 ? { x: p.x + 26, y: p.y + 6, a: 'start' as const }
      : deg === 270 ? { x: p.x, y: p.y - 28, a: 'middle' as const } : { x: p.x, y: p.y + 42, a: 'middle' as const };
    /* the light starts at the top and goes clockwise; each station glows as it arrives */
    return { t, ...p, lab, ph: (((deg - 270 + 360) % 360) / 360) * PERIOD };
  });
  const tip = at(C, C, 49, -60), base = at(C, C, 65, -60), tan = { x: Math.sin(rad(60)) * 7, y: Math.cos(rad(60)) * 7 };
  return (
    <section className="mt-sec" id="loop" aria-labelledby="loop-h">
      <div className="mt-wrap mt-split mt-split-rev">
        <figure className={'mt-scene mt-loop' + s.cls} ref={s.ref}>
          <svg viewBox="-24 0 448 400" aria-hidden>
            <circle cx={C} cy={C} r={R} className="mt-l-ring" />
            <g className="mt-l-orbit" style={v({ '--p': PERIOD + 's' })}><circle cx={C} cy={C - R} r="6" className="mt-l-pulse" /></g>
            {st.map(x => (
              <g key={x.t}>
                <circle cx={x.x} cy={x.y} r="15" className="mt-l-st" />
                <circle cx={x.x} cy={x.y} r="15" className="mt-l-glow" style={v({ '--p': PERIOD + 's', '--ph': x.ph + 's' })} />
                <text x={x.lab.x} y={x.lab.y} textAnchor={x.lab.a} className="mt-l-word">{x.t}</text>
              </g>
            ))}
            <g className="mt-l-gear-wrap"><path d={gearPath(C, C, 40, 12)} className="mt-l-gear" /></g>
            <circle cx={C} cy={C} r="14" className="mt-l-hub" />
            <path d={`M ${tip.x.toFixed(1)} ${tip.y.toFixed(1)} L ${(base.x + tan.x).toFixed(1)} ${(base.y + tan.y).toFixed(1)} L ${(base.x - tan.x).toFixed(1)} ${(base.y - tan.y).toFixed(1)} Z`} className="mt-l-pawl" />
            <text x={C} y={C + 80} textAnchor="middle" className="mt-l-center-word">{COPY.loop.center}</text>
          </svg>
          <figcaption className="mt-sr">{COPY.loop.stations.join(', ')}. {COPY.loop.center}.</figcaption>
        </figure>
        <div>
          <p className="mt-kicker">{COPY.loop.kicker}</p>
          <h2 className="mt-h2" id="loop-h">{COPY.loop.title}</h2>
          <p className="mt-p">{COPY.loop.body}</p>
          <p className="mt-p">{COPY.loop.ratchet}</p>
          <p className="mt-note">{COPY.loop.planned}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. the first MOTRUS, as drafted ---------- */
function First() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="first" aria-labelledby="first-h">
      <div className="mt-wrap">
        <div className={'mt-first' + s.cls} ref={s.ref}>
          <p className="mt-kicker">{COPY.first.kicker}</p>
          <h2 className="mt-h2" id="first-h">{COPY.first.title}</h2>
          <p className="mt-first-what">{COPY.first.what}</p>
          <dl className="mt-first-grid">
            <div><dt>{COPY.first.card}</dt><dd>{FIRST.ankras}</dd></div>
            <div><dt>{COPY.first.threshold}</dt><dd>{FIRST.threshold} projects</dd></div>
            <div><dt>{COPY.first.proof}</dt><dd>{COPY.first.proofShown}<br />{COPY.first.proofSaid}</dd></div>
            <div><dt>{COPY.first.privacy}</dt><dd>{FIRST.floor} organizations</dd></div>
            <div><dt>{COPY.first.measured}</dt><dd>{FIRST.measuredDays} days</dd></div>
          </dl>
          <div className="mt-first-slots" aria-label={'0 of ' + FIRST.threshold + ' ' + COPY.first.committed}>
            {Array.from({ length: FIRST.threshold }, (_, k) => <i key={k} style={v({ '--d': 300 + k * 120 + 'ms' })} />)}
            <span>0 of {FIRST.threshold} {COPY.first.committed}</span>
          </div>
          <p className="mt-note">{COPY.first.status}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. how it pays for itself: streams into the treasury, the treasury into the work ---------- */
function Model() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="model" aria-labelledby="model-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{COPY.model.kicker}</p>
        <h2 className="mt-h2" id="model-h">{COPY.model.title}</h2>
        <p className="mt-p mt-p-wide">{COPY.model.body}</p>
        {/* the streams fill the treasury; the treasury pays for the work */}
        <div className={'mt-model' + s.cls} ref={s.ref}>
          <h3 className="mt-h3">{COPY.model.streamsTitle}</h3>
          <ul className="mt-streams">
            {COPY.model.streams.map((x, i) => (
              <li key={x.t} style={v({ '--d': 200 + i * 120 + 'ms' })}>
                <b>{x.t}</b><span>{x.d}</span>
                <i className="mt-drop" aria-hidden style={v({ '--fd': i * 0.33 + 's' })} />
              </li>
            ))}
          </ul>
          <i className="mt-trunk" aria-hidden />
          <div className="mt-vessel">
            <i className="mt-vessel-fill" aria-hidden />
            <p className="mt-vessel-word">{COPY.model.stock}</p>
          </div>
          <i className="mt-trunk mt-trunk-out" aria-hidden />
          <h3 className="mt-sr">{COPY.model.usesTitle}</h3>
          <ul className="mt-uses">
            {COPY.model.uses.map((x, i) => (
              <li key={x} style={v({ '--d': 1500 + i * 120 + 'ms' })}>
                <i className="mt-drop" aria-hidden style={v({ '--fd': 0.5 + i * 0.4 + 's' })} />{x}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-model-foot">
          <div className="mt-panel mt-free">
            <h3 className="mt-h3">{COPY.model.freeTitle}</h3>
            <ul>{COPY.model.free.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="mt-panel mt-principles">
            <h3 className="mt-h3">{COPY.model.principlesTitle}</h3>
            <ul>{COPY.model.principles.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 10. the moves, in order ---------- */
function Moves() {
  const s = useScene<HTMLDivElement>();
  const groups = [
    { k: 'done', t: COPY.moves.done, items: COPY.moves.doneItems },
    { k: 'next', t: COPY.moves.next, items: COPY.moves.nextItems },
    { k: 'then', t: COPY.moves.then, items: COPY.moves.thenItems },
  ];
  let n = 0;
  return (
    <section className="mt-sec" id="moves" aria-labelledby="moves-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{COPY.moves.kicker}</p>
        <h2 className="mt-h2" id="moves-h">{COPY.moves.title}</h2>
        <div className={'mt-moves' + s.cls} ref={s.ref}>
          {groups.map(g => (
            <div key={g.k} className={'mt-moves-col mt-moves-' + g.k}>
              <h3 className="mt-h3">{g.t}</h3>
              <ol>{g.items.map(x => <li key={x} style={v({ '--d': 120 + n++ * 90 + 'ms' })}><i aria-hidden />{x}</li>)}</ol>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- the next layer: communities, and the agreement between them ---------- */
function NextLayer() {
  return (
    <section className="mt-sec" id="paxt" aria-labelledby="paxt-h">
      <div className="mt-wrap">
        <div className="mt-next-layer">
          <div>
            <p className="mt-kicker">{COPY.paxt.kicker}</p>
            <h2 className="mt-h2" id="paxt-h">{COPY.paxt.title}</h2>
            <p className="mt-p mt-p-wide">{COPY.paxt.body}</p>
          </div>
          <a className="mt-btn mt-btn-key" href="/PAXT">{COPY.paxt.open}</a>
        </div>
      </div>
    </section>
  );
}

export function MotrusPage() {
  useHashScroll();
  usePointerLight();
  return (
    <div className="mt">
      <TopNav page="motrus" />
      <Hero />
      <main id="main">
        <Gap />
        <Walk />
        <First />
        <Move />
        <Proof />
        <Holds />
        <CardBrief />
        <Teams />
        <Layers />
        <Industry />
        <Levers />
        <Loop />
        <RewardsBrief />
        <Precedent />
        <NextLayer />
        <Model />
        <Moves />
      </main>
      <PartsIndex />
      <footer className="mt-close">
        <div className="mt-wrap">
          <Mark size={76} />
          <p className="mt-tagline" data-his>{HIS.tagline}</p>
          <p className="mt-stronger" data-his>{HIS.stronger}</p>
          <div className="mt-doors">
            {COPY.close.doors.map((d, i) => <a key={d.href} className={'mt-btn' + (i === 0 ? ' mt-btn-key' : '')} href={d.href}>{d.t}</a>)}
          </div>
          <p className="mt-note">{COPY.close.note}</p>
        </div>
      </footer>
    </div>
  );
}
