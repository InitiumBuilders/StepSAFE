/* Ankras: the card, at /ankras. A pitch and a specification in one: the anatomy of a card read as its own document,
   the three layers it lives in, the words it shares with Intuition, how it learns, the losses behind it, how results
   and research come back, how insight is rewarded in TRUST, and the two genesis cards. Words in ankras-copy.ts; facts
   in facts.ts. Every scene plays once seen, loops only while visible, and rests on its last frame under calm motion. */

import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import './motrus.css';
import './walk.css';
import './ankras.css';
import { AK } from './ankras-copy';
import { HIS } from './copy';
import { GENESIS, INCIDENTS, MEASURED, WORDS } from './facts';
import { at, Grow, Mark, PartsIndex, TopNav, useHashScroll, usePointerLight, useScene, useSteps, v } from './shared';
import { CardTrue } from './Defense';

/* ---------- 1. the hero: a card settles into the shared graph, and what it touches connects ---------- */
const LAT = { cols: 13, rows: 9, sp: 40, x0: 40, y0: 40 };
const C = { x: 280, y: 200 };
const LAND = 760;
const LIT = [
  { x: 120, y: 120, k: 'threat', d: 1500 },
  { x: 80, y: 240, k: 'threat', d: 1680 },
  { x: 440, y: 120, k: 'card', d: 1860 },
  { x: 480, y: 280, k: 'card', d: 2040 },
  { x: 200, y: 40, k: 'proof', d: 2220 },
  { x: 360, y: 360, k: 'proof', d: 2400 },
];

function AkHero() {
  const [on, setOn] = useState(false);
  const [live, setLive] = useState(true);
  const ref = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setOn(true));
    let io: IntersectionObserver | null = null;
    if (ref.current && typeof IntersectionObserver === 'function') {
      io = new IntersectionObserver(es => { for (const e of es) setLive(e.isIntersecting); });
      io.observe(ref.current);
    }
    return () => { window.cancelAnimationFrame(id); io?.disconnect(); };
  }, []);
  const dots: { x: number; y: number; dl: number }[] = [];
  for (let r = 0; r < LAT.rows; r++) for (let c = 0; c < LAT.cols; c++) {
    const x = LAT.x0 + c * LAT.sp, y = LAT.y0 + r * LAT.sp;
    if (Math.abs(x - C.x) < 64 && Math.abs(y - C.y) < 84) continue;
    if (LIT.some(l => l.x === x && l.y === y)) continue;
    dots.push({ x, y, dl: Math.round(LAND + Math.hypot(x - C.x, y - C.y) * 2.4) });
  }
  const ev = LIT[5];
  return (
    <header className="mt-hero ak-hero" id="top">
      <div className="mt-wrap mt-hero-grid">
        <div className="mt-hero-text">
          <p className="mt-kicker mt-rise" style={v({ '--d': '80ms' })} data-his>{AK.kicker}</p>
          <h1 className="mt-h1 mt-rise ak-h1" style={v({ '--d': '160ms' })}>Ankras</h1>
          <p className="mt-lede mt-rise" style={v({ '--d': '420ms' })}>{AK.lede}</p>
          <div className="mt-actions mt-rise" style={v({ '--d': '600ms' })}>
            <a className="mt-btn mt-btn-key" href="#anatomy">{AK.see}</a>
            <a className="mt-btn" href="/MOTRUS">{AK.motrus}</a>
          </div>
        </div>
        <figure className={'mt-hero-scene ak-scene' + (on ? ' on' : '') + (live ? ' live' : '')} ref={ref}>
          <svg viewBox="0 0 560 400" aria-hidden>
            {dots.map((d, i) => <circle key={i} cx={d.x} cy={d.y} r="2.4" className="ak-dot" style={v({ '--dl': d.dl + 'ms' })} />)}
            {LIT.map((l, i) => <Grow key={'g' + i} x1={C.x} y1={C.y} x2={l.x} y2={l.y} cls={'ak-edge ak-edge-' + l.k} d={l.d - 260} />)}
            {LIT.map((l, i) => (
              <g key={'l' + i} transform={`translate(${l.x} ${l.y})`}>
                <g className={'ak-lit ak-lit-' + l.k} style={v({ '--d': l.d + 'ms' })}>
                  <circle r="16" className="ak-lit-halo" />
                  <circle r="7" className="ak-lit-core" />
                </g>
              </g>
            ))}
            <circle cx={C.x} cy={C.y} r="90" className="ak-wave" />
            <circle cx={ev.x} cy={ev.y} r="6" className="ak-pulse" style={v({ '--tx': C.x - ev.x + 'px', '--ty': C.y - ev.y + 'px' })} />
            <g className="ak-card">
              <rect x={C.x - 56} y={C.y - 76} width="112" height="152" rx="20" className="ak-card-body" />
              <rect x={C.x - 56} y={C.y - 76} width="112" height="152" rx="20" className="ak-card-glow" />
              <text x={C.x} y={C.y - 36} textAnchor="middle" className="ak-card-name">Ankras</text>
              <rect x={C.x - 36} y={C.y - 16} width="72" height="7" rx="3.5" className="ak-card-bar" />
              <rect x={C.x - 36} y={C.y - 2} width="56" height="7" rx="3.5" className="ak-card-bar" />
              <rect x={C.x - 36} y={C.y + 12} width="64" height="7" rx="3.5" className="ak-card-bar" />
              <text x={C.x} y={C.y + 52} textAnchor="middle" className="ak-card-ver ak-ver-was">1.0.0</text>
              <text x={C.x} y={C.y + 52} textAnchor="middle" className="ak-card-ver ak-ver-now">1.1.0</text>
            </g>
          </svg>
          <figcaption className="mt-sr">{AK.heroCaption}</figcaption>
        </figure>
      </div>
    </header>
  );
}

/* ---------- 2. the anatomy: the real card, read part by part, with where each part lives ---------- */
const CODE: { s: number; t: string }[] = [
  { s: 0, t: '{' },
  { s: 0, t: '  "id": "mm-chain-multisig-governance",' },
  { s: 0, t: '  "version": "1.0.0",' },
  { s: 1, t: '  "statement": "Multisig governance defeats the single stolen key by requiring M of N independent signers …",' },
  { s: 2, t: '  "holds": [' },
  { s: 2, t: '    "Single private key theft or loss",' },
  { s: 2, t: '    "Insider acting alone",' },
  { s: 2, t: '    "Unilateral contract upgrade by one operator", …' },
  { s: 2, t: '  ],' },
  { s: 3, t: '  "failsWhen": [' },
  { s: 3, t: '    "Signers sign what the interface shows them without decoding the calldata on the device. …",' },
  { s: 3, t: '    "The signer set is not independent. …"' },
  { s: 3, t: '  ],' },
  { s: 4, t: '  "combinesWith": [{ "ankras": "mm-crypto-hardware-root@1.0.0", "how": "…" }, …],' },
  { s: 4, t: '  "conflictsWith": [{ "ankras": "mm-chain-circuit-breakers@1.0.0", "how": "…" }],' },
  { s: 5, t: '  "adoption": "First move: list every address that holds value and every key that can move it …",' },
  { s: 5, t: '  "signals": ["Every signer can state what a transaction does from the device screen before signing", …],' },
  { s: 6, t: '  "evidence": [{ "source": "Bybit, 21 February 2025", "mark": "Said" }, …],' },
  { s: 7, t: '  "lineage": { "replaces": null, "forkOf": null },' },
  { s: 7, t: '  "review": { "status": "draft", "reviewers": [] }' },
  { s: 7, t: '}' },
];

function CodeLine({ t }: { t: string }) {
  const m = /^(\s*)("[^"]+")(:)(.*)$/.exec(t);
  if (!m) return <>{t}</>;
  return <>{m[1]}<span className="ak-k">{m[2]}</span>{m[3]}<span className="ak-s">{m[4]}</span></>;
}

function Anatomy() {
  const steps = AK.anatomy.steps;
  const { active, bind } = useSteps(steps.length);
  const codeRef = useRef<HTMLDivElement | null>(null);
  const [shift, setShift] = useState(0);
  useLayoutEffect(() => {
    const box = codeRef.current;
    const line = box?.querySelector<HTMLElement>('[data-s="' + active + '"]');
    if (!box || !line) return;
    const room = box.parentElement ? box.parentElement.clientHeight : 400;
    setShift(Math.max(0, Math.min(line.offsetTop - 28, box.scrollHeight - room + 24)));
  }, [active]);
  return (
    <section className="mt-sec ak-anatomy" id="anatomy" aria-labelledby="anatomy-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{AK.anatomy.kicker}</p>
        <h2 className="mt-h2 mt-h2-big" id="anatomy-h">{AK.anatomy.title}</h2>
        <p className="mt-p mt-p-wide">{AK.anatomy.intro}</p>
        <div className="wk-grid">
          <div className="wk-stage ak-code-stage" aria-hidden>
            <div className="ak-code" ref={codeRef} style={v({ '--shift': -shift + 'px' })}>
              {CODE.map((l, i) => (
                <div key={i} data-s={i === 0 || CODE[i - 1].s !== l.s ? l.s : undefined} className={'ak-line' + (l.s === active ? ' on' : '')}><CodeLine t={l.t} /></div>
              ))}
            </div>
          </div>
          <ol className="wk-steps">
            {steps.map((s, i) => (
              <li key={s.t} ref={bind(i)} data-step={i} className={'wk-step' + (i === active ? ' on' : '')}>
                <span className="wk-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-h3">{s.t}</h3>
                <p className="mt-p">{s.d}</p>
                <ul className="ak-where">{s.where.map(w => <li key={w}>{w}</li>)}</ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

/* ---------- 3. three layers, one card: results flow back down through all three ---------- */
function Planes() {
  const s = useScene<HTMLDivElement>();
  const P = AK.planes;
  return (
    <section className="mt-sec" id="layers" aria-labelledby="planes-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{P.kicker}</p>
        <h2 className="mt-h2" id="planes-h">{P.title}</h2>
        <p className="mt-p mt-p-wide">{P.body}</p>
        <div className={'pl' + s.cls} ref={s.ref}>
          {P.layers.map((l, i) => (
            <React.Fragment key={l.k}>
              <div className={'pl-layer pl-' + l.k} style={v({ '--d': 150 + i * 220 + 'ms' })}>
                <div className="pl-head"><span className="pl-glyph" aria-hidden /><h3 className="mt-h3">{l.t}</h3></div>
                <p>{l.d}</p>
                <ul className="pl-has">{l.has.map(h => <li key={h}>{h}</li>)}</ul>
              </div>
              {i < P.flows.length && (
                <div className="pl-flow">
                  <span className="pl-ch pl-down" aria-hidden><i /><i /><i /></span>
                  <span className="pl-flow-t"><b>{P.flows[i].down}</b><b>{P.flows[i].up}</b></span>
                  <span className="pl-ch pl-up" aria-hidden><i /><i /><i /></span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------- 4. the sixteen words: nine join the graph that is already there ---------- */
function Words() {
  const s = useScene<HTMLUListElement>();
  const W = AK.words;
  return (
    <section className="mt-sec" id="words" aria-labelledby="words-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{W.kicker}</p>
        <h2 className="mt-h2" id="words-h">{W.title}</h2>
        <p className="mt-p mt-p-wide">{W.body}</p>
        <ul className={'wd' + s.cls} ref={s.ref}>
          {WORDS.map((w, i) => (
            <li key={w.w} className={'wd-w' + (w.id ? ' wd-on' : '')} style={v({ '--d': 100 + i * 60 + 'ms' })}>
              <span className="wd-ring" aria-hidden />
              <b>{w.w}</b>
              <span className="wd-so">{w.s} → {w.o}</span>
              {w.id
                ? <span className="wd-id"><code>{w.id}…</code>{w.positions && w.positions > 2 ? <> · {w.positions.toLocaleString('en-US')} {W.positions}</> : null}</span>
                : <span className="wd-id wd-new">{W.fresh}</span>}
            </li>
          ))}
        </ul>
        <p className="mt-note">{W.read} {MEASURED.wordsOnIntuition} of {MEASURED.words} {W.reused}.</p>
      </div>
    </section>
  );
}

/* ---------- 5. how a card learns: replaces, and fork of ---------- */
function Learn() {
  const s = useScene<HTMLDivElement>();
  const Lr = AK.learn;
  const main = [{ x: 46, v: '1.0.0', d: 200 }, { x: 170, v: '1.1.0', d: 900 }, { x: 294, v: '1.2.0', d: 1600 }];
  return (
    <section className="mt-sec" id="learn" aria-labelledby="learn-h">
      <div className="mt-wrap mt-split">
        <div>
          <p className="mt-kicker">{Lr.kicker}</p>
          <h2 className="mt-h2" id="learn-h">{Lr.title}</h2>
          <p className="mt-p">{Lr.body}</p>
          <ul className="lr-kinds">{Lr.kinds.map(k => <li key={k.v}><code>{k.v}</code><span>{k.d}</span></li>)}</ul>
        </div>
        <figure className={'mt-scene mt-panel lr' + s.cls} ref={s.ref}>
          <svg viewBox="0 0 360 220" aria-hidden>
            <Grow x1={58} y1={84} x2={158} y2={84} cls="lr-edge" d={700} />
            <Grow x1={182} y1={84} x2={282} y2={84} cls="lr-edge" d={1400} />
            <path d="M 192 92 C 222 106 228 150 241 160" className="lr-fork" />
            <text x="108" y="72" textAnchor="middle" className="lr-word">{Lr.replaces}</text>
            <text x="232" y="72" textAnchor="middle" className="lr-word">{Lr.replaces}</text>
            {main.map(n => (
              <g key={n.v} className="lr-node" style={v({ '--d': n.d + 'ms' })}>
                <circle cx={n.x + 12} cy="84" r="12" />
                <text x={n.x + 12} y="122" textAnchor="middle" className="lr-v">{n.v}</text>
              </g>
            ))}
            <g className="lr-node lr-node-fork" style={v({ '--d': '2100ms' })}>
              <circle cx="252" cy="164" r="11" />
              <text x="274" y="169" className="lr-v">1.0.0</text>
              <text x="252" y="200" textAnchor="middle" className="lr-word">{Lr.fork} 1.1.0, {Lr.forkName}</text>
            </g>
          </svg>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 6. every failure mode comes from a loss ---------- */
function Losses() {
  const s = useScene<HTMLOListElement>();
  const Ls = AK.losses;
  const max = INCIDENTS[0].usd;
  return (
    <section className="mt-sec" id="losses" aria-labelledby="losses-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{Ls.kicker}</p>
        <h2 className="mt-h2" id="losses-h">{Ls.title}</h2>
        <p className="mt-p mt-p-wide">{Ls.body}</p>
        <ol className={'ls' + s.cls} ref={s.ref}>
          {INCIDENTS.map((x, i) => (
            <li key={x.key} className="ls-row" style={v({ '--d': 200 + i * 300 + 'ms', '--w': Math.max(0.03, x.usd / max).toFixed(3) })}>
              <div className="ls-mode">{x.mode}</div>
              <div className="ls-body">
                <div className="ls-top"><h3 className="mt-h3">{x.name}</h3><span>{x.when}</span></div>
                <p>{x.what}</p>
                <div className="ls-bar"><i /></div>
                <div className="ls-foot">
                  <b>{x.loss}</b>
                  <span className="ls-src">{x.sources.map((src, k) => <a key={k} href={src.url} rel="noopener">{src.t}</a>)}</span>
                  <b className="mt-stamp mt-stamp-shown ls-stamp" style={v({ '--d': 700 + i * 300 + 'ms' })}>{Ls.shown}</b>
                </div>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-note">{Ls.read}.</p>
      </div>
    </section>
  );
}

/* ---------- 7. results come back together: five or more, then one result, then the card ---------- */
function Results() {
  const s = useScene<HTMLDivElement>();
  const R = AK.results;
  const floor = { x: 180, y: 104, r: 42 };
  const slots = Array.from({ length: 5 }, (_, i) => at(floor.x, floor.y, floor.r, -90 + i * 72));
  return (
    <section className="mt-sec" id="results" aria-labelledby="results-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{R.kicker}</p>
        <h2 className="mt-h2" id="results-h">{R.title}</h2>
        <p className="mt-p mt-p-wide">{R.body}</p>
        <div className="mt-split rs-split">
          <figure className={'mt-scene mt-panel rs' + s.cls} ref={s.ref}>
            <svg viewBox="0 0 360 230" aria-hidden>
              <circle cx={floor.x} cy={floor.y} r={floor.r} className="rs-floor" />
              {slots.map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="9" className="rs-slot" />
                  <circle cx="30" cy={30 + i * 37} r="10" className="rs-org" />
                  <circle cx="30" cy={30 + i * 37} r="6" className="rs-report" style={v({ '--tx': (p.x - 30).toFixed(1) + 'px', '--ty': (p.y - 30 - i * 37).toFixed(1) + 'px', '--d': 300 + i * 260 + 'ms' })} />
                </g>
              ))}
              <circle cx={floor.x} cy={floor.y} r="9" className="rs-result" style={v({ '--tx': 312 - floor.x + 'px' })} />
              <rect x="282" y="58" width="60" height="92" rx="13" className="rs-card" />
              <rect x="294" y="74" width="36" height="6" rx="3" className="rs-card-bar" />
              <rect x="294" y="86" width="26" height="6" rx="3" className="rs-card-bar" />
              <g className="rs-card-lit">
                <rect x="282" y="58" width="60" height="92" rx="13" />
                <path d="M 302 120 l 6 6 l 12 -13" />
              </g>
              <text x="30" y="222" textAnchor="middle" className="rs-word">{R.labels.report}</text>
              <text x={floor.x} y="176" textAnchor="middle" className="rs-word">{R.labels.floor}</text>
              <text x="312" y="176" textAnchor="middle" className="rs-word">{R.labels.card}</text>
            </svg>
          </figure>
          <div>
            <ol className="rs-steps">{R.steps.map((x, i) => <li key={x} style={v({ '--d': 200 + i * 120 + 'ms' })}><span>{i + 1}</span>{x}</li>)}</ol>
            <p className="mt-note">{R.submit}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 8. insight earns TRUST ---------- */
function Rewards() {
  const s = useScene<HTMLDivElement>();
  const R = AK.rewards;
  const maxW = Math.max(...R.earn.map(e => e.w));
  return (
    <section className="mt-sec" id="rewards" aria-labelledby="rw-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{R.kicker}</p>
        <h2 className="mt-h2 mt-h2-big" id="rw-h">{R.title}</h2>
        <p className="mt-p mt-p-wide">{R.body}</p>
        <div className={'rw' + s.cls} ref={s.ref}>
          <div className="rw-flow" aria-hidden>
            <span className="rw-from">{R.earn.map((e, i) => <i key={e.t} style={v({ '--d': 200 + i * 140 + 'ms' })} />)}</span>
            <span className="rw-ch"><i /><i /></span>
            <span className="rw-card"><Mark size={34} className="mt-mark rw-mark" /></span>
            <span className="rw-ch rw-ch-out"><i /><i /></span>
            <span className="rw-to">{[0, 1, 2].map(k => <i key={k} style={v({ '--d': 1400 + k * 200 + 'ms' })} />)}</span>
          </div>
          <div className="rw-cols">
            <div className="mt-panel rw-col">
              <h3 className="mt-h3">{R.poolTitle}</h3>
              <ul className="rw-list">{R.pool.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
            <div className="mt-panel rw-col">
              <h3 className="mt-h3">{R.earnTitle}</h3>
              <ul className="rw-earn">
                {R.earn.map((e, i) => (
                  <li key={e.t} style={v({ '--w': (e.w / maxW).toFixed(3), '--d': 300 + i * 120 + 'ms' })}>
                    <div className="rw-earn-top"><b>{e.t}</b><code>{e.w}</code></div>
                    <i className="rw-w" />
                    <span>{e.d}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-note">{R.weightsNote}</p>
            </div>
            <div className="mt-panel rw-col">
              <h3 className="mt-h3">{R.payTitle}</h3>
              <ul className="rw-list">{R.pay.map(x => <li key={x}>{x}</li>)}</ul>
            </div>
          </div>
          <p className="mt-note">{R.held}</p>
          <p><a className="mt-btn" href="/PAXT#held">{R.heldOpen}</a></p>
        </div>
      </div>
    </section>
  );
}

/* ---------- 9. the first two cards: Ankras describes itself, and MOTRUS ---------- */
function Genesis() {
  const s = useScene<HTMLDivElement>();
  const G = AK.genesis;
  return (
    <section className="mt-sec" id="genesis" aria-labelledby="genesis-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{G.kicker}</p>
        <h2 className="mt-h2" id="genesis-h">{G.title}</h2>
        <p className="mt-p mt-p-wide">{G.body}</p>
        <div className={'gn' + s.cls} ref={s.ref}>
          {GENESIS.map((g, i) => (
            <article key={g.id} className="mt-card gn-card" style={v({ '--d': 200 + i * 260 + 'ms' })}>
              <div className="mt-card-head"><span className="mt-chip">{g.id}</span><span className="mt-chip gn-draft">{G.draft}</span><span className="mt-ver">{g.version}</span></div>
              <h3 className="mt-card-name">{g.name}</h3>
              <p className="mt-card-statement">{g.statement}</p>
              <div className="mt-card-block"><h4>{G.stops}</h4><ul className="mt-tags">{g.holds.map(h => <li key={h}>{h}</li>)}</ul></div>
              <div className="mt-card-block"><h4>{G.fails}</h4><ul className="mt-list">{g.failsWhen.map(f => <li key={f}>{f}</li>)}</ul></div>
              <div className="mt-card-block"><h4>{G.signs}</h4><ul className="mt-list mt-list-signs">{g.signals.map(f => <li key={f}>{f}</li>)}</ul></div>
              <div className="mt-card-block"><h4>{G.next}</h4><p>{g.next}</p></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AnkrasPage() {
  useHashScroll();
  usePointerLight();
  return (
    <div className="mt ak">
      <TopNav page="ankras" />
      <AkHero />
      <main id="main">
        <Anatomy />
        <Planes />
        <Words />
        <Learn />
        <CardTrue />
        <Losses />
        <Results />
        <Rewards />
        <Genesis />
      </main>
      <PartsIndex />
      <footer className="mt-close">
        <div className="mt-wrap">
          <Mark size={76} />
          <p className="mt-tagline" data-his>{HIS.tagline}</p>
          <p className="mt-stronger" data-his>{HIS.stronger}</p>
          <div className="mt-doors">
            {AK.close.doors.map((d, i) => <a key={d.href} className={'mt-btn' + (i === 0 ? ' mt-btn-key' : '')} href={d.href}>{d.t}</a>)}
          </div>
          <p className="mt-note">{AK.close.note}</p>
        </div>
      </footer>
    </div>
  );
}
