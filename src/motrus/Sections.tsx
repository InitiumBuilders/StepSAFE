/* The MOTRUS page's newer sections: the teams (August's United Systems Security Design Team, your SoundMind Team),
   the moves the crypto industry can make together, insight rewards, the card in brief, and the terms of a move. */

import React from 'react';
import './sections.css';
import { COPY, HIS } from './copy';
import { CARD, H1_2025, INCIDENTS, MEASURED } from './facts';
import { at, Grow, useScene, v } from './shared';

/* ---------- your SoundMind Team: one carries the weight, then the team shares it, then it grows ---------- */
export function Teams() {
  const s = useScene<HTMLDivElement>();
  const C = { x: 180, y: 150 }, R = 98, N = 6;
  const nodes = Array.from({ length: N }, (_, i) => ({ i, ...at(C.x, C.y, R, -90 + i * 60) }));
  const top = nodes[0];
  const T = COPY.teams;
  return (
    <section className="mt-sec tm" id="teams" aria-labelledby="teams-h">
      <div className="mt-wrap">
        <p className="mt-kicker" data-his>{HIS.ussdt}</p>
        <div className="tm-head">
          <h2 className="mt-h2 mt-h2-big" id="teams-h" data-his>{HIS.soundmind}</h2>
          <span className="tm-short" data-his>{HIS.ussdtShort}</span>
        </div>
        <div className="mt-split tm-split">
          <figure className={'mt-scene tm-scene' + s.cls} ref={s.ref}>
            <svg viewBox="0 0 360 300" aria-hidden>
              {nodes.map((n, i) => { const m = nodes[(i + 1) % N]; return <Grow key={'l' + i} x1={n.x} y1={n.y} x2={m.x} y2={m.y} cls="tm-link" d={2400 + i * 90} />; })}
              {nodes.map(n => <Grow key={'c' + n.i} x1={n.x} y1={n.y} x2={C.x} y2={C.y} cls="tm-spoke" d={3000 + n.i * 120} />)}
              <circle cx={C.x} cy={C.y} r="50" className="tm-core" />
              <circle cx={C.x} cy={C.y} r="50" className="tm-core-lit" />
              {nodes.map(n => (
                <g key={'n' + n.i} transform={`translate(${n.x.toFixed(1)} ${n.y.toFixed(1)})`}>
                  <g className={'tm-node' + (n.i === 0 ? ' tm-first' : '')}>
                    <circle r="17" className="tm-dot" />
                    <rect x="-10" y="-34" width="20" height="11" rx="3.5" className="tm-piece"
                      style={v({ '--tx': (top.x - n.x).toFixed(1) + 'px', '--ty': (top.y - n.y).toFixed(1) + 'px', '--d': 1700 + n.i * 70 + 'ms' })} />
                  </g>
                </g>
              ))}
              <g transform={`translate(${top.x.toFixed(1)} ${top.y.toFixed(1)})`}><rect x="-30" y="-66" width="60" height="32" rx="9" className="tm-weight" /></g>
              {nodes.map(n => (
                <circle key={'sp' + n.i} cx={n.x} cy={n.y} r="4.5" className="tm-spark"
                  style={v({ '--tx': (C.x - n.x).toFixed(1) + 'px', '--ty': (C.y - n.y).toFixed(1) + 'px', '--d': 3300 + n.i * 160 + 'ms', '--p': 6 + n.i * 1.3 + 's' })} />
              ))}
              <g className="tm-name tm-name-a"><text x={C.x} y={C.y - 3} textAnchor="middle">SystemsMind</text><text x={C.x} y={C.y + 17} textAnchor="middle">Team</text></g>
              <g className="tm-name tm-name-b"><text x={C.x} y={C.y - 3} textAnchor="middle">SoundMind</text><text x={C.x} y={C.y + 17} textAnchor="middle">Team</text></g>
            </svg>
            <figcaption className="mt-sr">One member carries a heavy weight alone. Then the weight is shared in six equal parts, one for each member, and the team joins up. As members add research, results and lessons, the SystemsMind Team becomes a SoundMind Team.</figcaption>
          </figure>
          <div>
            <blockquote className="tm-his" data-his>{HIS.teams}</blockquote>
            <p className="mt-p tm-sound" data-his>Sound System. Sound Mind.</p>
          </div>
        </div>
        <div className="tm-stages">
          <div className="tm-stage">
            <span className="tm-stage-name" data-his>{HIS.systemsMindName}</span>
            <p>{T.stages[0]}</p>
          </div>
          <i className="tm-arrow" aria-hidden />
          <div className="tm-stage tm-stage-b">
            <span className="tm-stage-name" data-his>{HIS.soundMindName}</span>
            <p>{T.stages[1]}</p>
          </div>
        </div>
        <ul className="tm-does">{T.does.map(x => <li key={x}>{x}</li>)}</ul>
        <p className="mt-note tm-care">{T.care} <a href={T.talk} rel="noopener">{T.talkLabel}</a> {T.careEnd}</p>
      </div>
    </section>
  );
}

/* ---------- four moves the crypto industry can make together, each from a loss ---------- */
export function Industry() {
  const s = useScene<HTMLDivElement>();
  const I = COPY.industry;
  return (
    <section className="mt-sec" id="industry" aria-labelledby="industry-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{I.kicker}</p>
        <h2 className="mt-h2" id="industry-h">{I.title}</h2>
        <div className={'in-wrap' + s.cls} ref={s.ref}>
          <p className="mt-p mt-p-wide">{I.stat} <a className="mt-src" href={H1_2025.source.url} rel="noopener">{H1_2025.source.t}</a></p>
          <div className="in-bar" role="img" aria-label={I.stat}>
            <i className="in-bar-b" style={v({ '--w': H1_2025.bybitShare })} />
            <i className="in-bar-r" style={v({ '--w': 1 - H1_2025.bybitShare })} />
          </div>
          <div className="in-bar-keys" aria-hidden><span className="in-key-b">{I.statLabel}</span><span className="in-key-r">{I.restLabel}</span></div>
          <ol className="in-moves">
            {I.moves.map((m, i) => (
              <li key={m.t} style={v({ '--d': 500 + i * 160 + 'ms' })}>
                <span className="in-n">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="mt-h3">{m.t}</h3>
                <p>{m.d}</p>
                <dl>
                  <div><dt>{I.from}</dt><dd>{m.from}</dd></div>
                  <div><dt>{I.card}</dt><dd>{m.card}</dd></div>
                </dl>
              </li>
            ))}
          </ol>
          <p className="mt-note">{I.note}</p>
        </div>
      </div>
    </section>
  );
}

/* ---------- insight earns TRUST, in brief ---------- */
export function RewardsBrief() {
  const s = useScene<HTMLDivElement>();
  const R = COPY.rewards;
  return (
    <section className="mt-sec" id="rewards" aria-labelledby="rewards-h">
      <div className="mt-wrap mt-split">
        <div>
          <p className="mt-kicker">{R.kicker}</p>
          <h2 className="mt-h2" id="rewards-h">{R.title}</h2>
          <p className="mt-p">{R.body}</p>
          <a className="mt-btn mt-btn-key" href={R.href}>{R.link}</a>
        </div>
        <div className={'rb-flow' + s.cls} ref={s.ref} aria-hidden>
          <ul className="rb-kinds">{R.kinds.map((k, i) => <li key={k} style={v({ '--d': 150 + i * 120 + 'ms' })}>{k}<i className="rb-drop" style={v({ '--fd': i * 0.3 + 's' })} /></li>)}</ul>
          <div className="rb-trust"><span className="rb-gem" /><b>TRUST</b></div>
        </div>
      </div>
    </section>
  );
}

/* ---------- the card, in brief: the full anatomy lives on /ankras ---------- */
export function CardBrief() {
  const s = useScene<HTMLDivElement>();
  const A = COPY.ankras;
  return (
    <section className="mt-sec" id="ankras" aria-labelledby="ankras-h">
      <div className="mt-wrap mt-split mt-split-rev">
        <div className={'cb-card mt-card' + s.cls} ref={s.ref}>
          <p className="mt-card-real">{A.real}</p>
          <div className="mt-card-head"><span className="mt-chip">{CARD.family}</span><span className="mt-chip">{CARD.tier}</span><span className="mt-ver">{CARD.version}</span></div>
          <h3 className="mt-card-name">{CARD.name}</h3>
          <p className="mt-card-statement">{CARD.statement}</p>
          <div className="mt-card-block"><h4>{A.fails}</h4><ul className="mt-list">{CARD.failsWhen.map(f => <li key={f}>{f}</li>)}</ul></div>
          <div className="mt-card-block">
            <h4>{A.evidence}</h4>
            <ul className="mt-evidence">{INCIDENTS.map((x, i) => <li key={x.key}><span>{x.name}, {x.year}</span><b className="mt-stamp mt-stamp-shown" style={v({ '--d': 400 + i * 160 + 'ms' })}>Shown</b></li>)}</ul>
          </div>
        </div>
        <div>
          <p className="mt-kicker">{A.kicker}</p>
          <h2 className="mt-h2 mt-h2-big" id="ankras-h">{A.title}</h2>
          <p className="mt-p">{A.body}</p>
          <dl className="mt-stats cb-stats">
            <div><dt>{A.stats}</dt><dd>{MEASURED.cards}</dd></div>
            <div><dt>Families</dt><dd>{MEASURED.families}</dd></div>
          </dl>
          <a className="mt-btn mt-btn-key" href="/ankras">{A.open}</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- the terms every move states, in the order the schema gives them ---------- */
export function Terms() {
  const M = COPY.move;
  return (
    <div className="tr">
      <h3 className="mt-h3">{M.terms}</h3>
      <dl className="tr-rows">
        {M.termRows.map((r, i) => (
          <div key={r.k} className="tr-row" style={v({ '--d': 200 + i * 90 + 'ms' })}>
            <dt><code>{r.k}</code><span>{r.t}</span></dt>
            <dd>{r.d}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
