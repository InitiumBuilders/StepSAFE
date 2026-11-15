/* PAXT: the proposal page at /PAXT, in the family of /MOTRUS and /ankras.

   A PAXT is an agreement between communities. This page says what one is, shows how it forms, and lets a visitor
   work the one real mechanism in their own browser: the document's hash and the line a wallet signs (paxt-core).
   Every scene states something about the protocol, plays once when it is seen, loops only while on screen, and
   under calm motion shows its last frame. Text never waits on an animation. Words and facts live in paxt-copy.ts. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import './motrus.css';
import './paxt.css';
import { PX, HIS_PAXT, LIST, SOURCES } from './paxt-copy';
import { FIRST_PAXT_DOC, FIRST_PAXT_DIGEST } from './paxt-first';
import { ballotLine, digestOf, parseDoc } from './paxt-core';
import { at, Grow, Mark, PartsIndex, TopNav, useHashScroll, usePointerLight, useScene, v } from './shared';

/* ---------- 1. the hero: three communities, one text between them ---------- */
const C = { x: 210, y: 214 };
const RINGS = [
  { key: 'dash', deg: -90, hue: 'a', n: 9 },
  { key: 'dao', deg: 30, hue: 'b', n: 7 },
  { key: 'team', deg: 150, hue: 'c', n: 5 },
];
const JOIN_AT = [900, 1700, 2500];

function Hero() {
  const [on, setOn] = useState(false);
  const [live, setLive] = useState(true);
  const ref = useRef<HTMLElement | null>(null);
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
  return (
    <header className="mt-hero" id="top">
      <div className="mt-wrap mt-hero-grid">
        <div className="mt-hero-text">
          <p className="mt-kicker mt-rise" style={v({ '--d': '80ms' })}>{PX.kicker}</p>
          <h1 className="mt-h1 px-h1 mt-rise" style={v({ '--d': '160ms' })} data-his>{HIS_PAXT.name}</h1>
          <p className="mt-tagline mt-rise" style={v({ '--d': '320ms' })}>{PX.statement}</p>
          <p className="mt-lede mt-rise" style={v({ '--d': '480ms' })}>{PX.lede}</p>
          <div className="mt-actions mt-rise" style={v({ '--d': '640ms' })}>
            <a className="mt-btn mt-btn-key" href="#forms">{PX.see}</a>
            <a className="mt-btn" href="#line">{PX.tryIt}</a>
          </div>
        </div>
        <figure className={'mt-hero-scene px-hero' + (on ? ' on' : '') + (live ? ' live' : '')} ref={ref}>
          <svg viewBox="0 0 420 420" aria-hidden>
            {RINGS.map((r, k) => {
              const c = at(C.x, C.y, 142, r.deg);
              const edge = at(C.x, C.y, 142 - 54, r.deg), near = at(C.x, C.y, 58, r.deg);
              return (
                <g key={r.key} className={'px-ring px-hue-' + r.hue} style={v({ '--j': JOIN_AT[k] + 'ms' })}>
                  <Grow x1={edge.x} y1={edge.y} x2={near.x} y2={near.y} cls="px-thread" d={JOIN_AT[k]} />
                  <circle className="px-ring-air" cx={c.x} cy={c.y} r={70} />
                  <circle className="px-ring-line" cx={c.x} cy={c.y} r={50} />
                  {Array.from({ length: r.n }, (_, i) => {
                    const p = at(c.x, c.y, 50, -90 + (i * 360) / r.n);
                    return <circle key={i} className="px-node" cx={p.x.toFixed(1)} cy={p.y.toFixed(1)} r={6.4} style={v({ '--d': 200 + k * 120 + i * 60 + 'ms' })} />;
                  })}
                  <circle className="px-spark" r={3.6} cx={edge.x.toFixed(1)} cy={edge.y.toFixed(1)}
                    style={v({ '--tx': (near.x - edge.x).toFixed(1) + 'px', '--ty': (near.y - edge.y).toFixed(1) + 'px', '--s': k * 0.9 + 's' })} />
                </g>
              );
            })}
            <g className="px-doc">
              <circle className="px-doc-halo" cx={C.x} cy={C.y} r={76} />
              <rect className="px-doc-page" x={C.x - 36} y={C.y - 48} width={72} height={96} rx={14} />
              <line className="px-doc-l" x1={C.x - 20} y1={C.y - 28} x2={C.x + 20} y2={C.y - 28} />
              <line className="px-doc-l" x1={C.x - 20} y1={C.y - 15} x2={C.x + 20} y2={C.y - 15} />
              <line className="px-doc-l" x1={C.x - 20} y1={C.y - 2} x2={C.x + 8} y2={C.y - 2} />
              <circle className="px-doc-glow" cx={C.x} cy={C.y + 22} r={17} />
              <polygon className="px-doc-seal" points={`${C.x},${C.y + 11} ${C.x + 11},${C.y + 22} ${C.x},${C.y + 33} ${C.x - 11},${C.y + 22}`} />
            </g>
          </svg>
          <figcaption className="mt-sr">{PX.heroCaption}</figcaption>
        </figure>
      </div>
    </header>
  );
}

/* ---------- 2. where it sits: the card, the move, the PAXT ---------- */
function Layers() {
  const s = useScene<HTMLOListElement>();
  return (
    <section className="mt-sec px-sec-tight" id="layers" aria-labelledby="layers-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.layers.kicker}</p>
        <h2 className="mt-h2" id="layers-h">{PX.layers.title}</h2>
        <ol className={'px-layers' + s.cls} ref={s.ref}>
          {PX.layers.rows.map((r, i) => (
            <li key={r.name} className={'px-layer px-layer-' + i} style={v({ '--d': i * 140 + 'ms' })}>
              <a href={r.href} className="px-layer-in">
                <span className="px-layer-what">{r.what}</span>
                <strong className="px-layer-name" data-his>{r.name}</strong>
                <span className="px-layer-line">{r.line}</span>
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 3. how one forms: five stations on one line ---------- */
function Forms() {
  const s = useScene<HTMLOListElement>();
  return (
    <section className="mt-sec" id="forms" aria-labelledby="forms-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.forms.kicker}</p>
        <h2 className="mt-h2" id="forms-h">{PX.forms.title}</h2>
        <ol className={'px-forms' + s.cls} ref={s.ref}>
          {PX.forms.steps.map((st, i) => (
            <li key={st.t} className="px-form" style={v({ '--d': 160 + i * 200 + 'ms' })}>
              <span className="px-form-dot" aria-hidden><i /></span>
              <h3 className="mt-h3">{st.t}</h3>
              <p>{st.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 4. the line: the document, its hash and what a wallet signs, worked in the browser ---------- */
function Line() {
  const [doc, setDoc] = useState(FIRST_PAXT_DOC);
  const [choice, setChoice] = useState<'join' | 'leave'>('join');
  const [hash, setHash] = useState({ full: FIRST_PAXT_DIGEST, short: FIRST_PAXT_DIGEST.slice(0, 32) });
  const [copied, setCopied] = useState(false);
  const read = useMemo(() => parseDoc(doc), [doc]);
  useEffect(() => {
    let live = true;
    digestOf(doc).then(h => { if (live) setHash(h); }).catch(() => { /* no Web Crypto here: the draft's own hash stays */ });
    return () => { live = false; };
  }, [doc]);
  const same = hash.full === FIRST_PAXT_DIGEST;
  const line = read.ok ? ballotLine({ id: read.terms.id, choices: [read.terms.kind === 'paxt' ? choice : read.terms.options[0]], digest: hash.short }) : '';
  const copy = () => {
    if (!line) return;
    const done = () => { setCopied(true); window.setTimeout(() => setCopied(false), 1600); };
    try { navigator.clipboard.writeText(line).then(done, () => { /* the line stays on screen to copy by hand */ }); } catch { /* no clipboard here */ }
  };
  return (
    <section className="mt-sec" id="line" aria-labelledby="line-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.line.kicker}</p>
        <h2 className="mt-h2" id="line-h">{PX.line.title}</h2>
        <p className="mt-p mt-p-wide">{PX.line.body}</p>
        <div className="px-bench">
          <div className="mt-panel px-doc-panel">
            <label className="px-label" htmlFor="px-doc">{PX.line.textLabel}</label>
            <textarea id="px-doc" className="px-text" value={doc} onChange={e => setDoc(e.target.value)} spellCheck={false} rows={16} />
            <div className="px-doc-foot">
              <span className={'px-state' + (same ? ' same' : ' changed')} role="status">{same ? PX.line.asDrafted : PX.line.changed}</span>
              {!same && <button type="button" className="mt-btn px-btn-sm" onClick={() => setDoc(FIRST_PAXT_DOC)}>{PX.line.reset}</button>}
            </div>
          </div>
          <div className="px-out">
            <div className={'mt-panel px-hash' + (same ? '' : ' changed')}>
              <span className="px-label">{PX.line.hashLabel}</span>
              <code className="px-hash-v" aria-live="polite"><b>{hash.short}</b>{hash.full.slice(32)}</code>
            </div>
            <div className="mt-panel px-line-panel">
              <span className="px-label">{PX.line.lineLabel}</span>
              {read.ok ? (
                <>
                  {read.terms.kind === 'paxt' && (
                    <div className="px-choice" role="radiogroup" aria-label={PX.line.choiceLabel}>
                      {(['join', 'leave'] as const).map(c => (
                        <button key={c} type="button" role="radio" aria-checked={choice === c} className={'px-choice-b' + (choice === c ? ' on' : '')} onClick={() => setChoice(c)}>{c === 'join' ? PX.line.join : PX.line.leave}</button>
                      ))}
                    </div>
                  )}
                  <code className="px-line-v" aria-live="polite">{line}</code>
                  <button type="button" className="mt-btn mt-btn-key px-copy" onClick={copy}>{copied ? PX.line.copied : PX.line.copy}</button>
                </>
              ) : (
                <div className="px-errors" role="alert">
                  <p>{PX.line.notADoc}</p>
                  <ul>{read.errors.slice(0, 4).map(e => <li key={e}>{e}</li>)}</ul>
                </div>
              )}
            </div>
            <div className="px-where">
              <h3 className="mt-h3">{PX.line.where}</h3>
              <ul className="px-wallets">
                {PX.line.wallets.map(w => <li key={w.t}><strong>{w.t}</strong><span>{w.d}</span></li>)}
              </ul>
              <p className="mt-note">{PX.line.keys}</p>
              <p className="mt-note">{PX.line.phone}</p>
              <p className="px-src"><a href={SOURCES.docsSign.url} target="_blank" rel="noopener noreferrer">{SOURCES.docsSign.t}</a></p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- 5. who may speak: the masternode list, read ---------- */
function Voice() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="voice" aria-labelledby="voice-h">
      <div className="mt-wrap">
        <p className="mt-kicker" data-his>{PX.voice.kicker}</p>
        <h2 className="mt-h2" id="voice-h">{PX.voice.title}</h2>
        <p className="mt-p mt-p-wide">{PX.voice.body}</p>
        <div className={'px-tiles' + s.cls} ref={s.ref}>
          {PX.voice.tiles.map((t, i) => (
            <div key={t.k} className="px-tile" style={v({ '--d': i * 110 + 'ms' })}>
              <span>{t.k}</span><strong>{t.v}</strong><em>{t.d}</em>
            </div>
          ))}
        </div>
        <p className="mt-note">{PX.voice.read}</p>
        <p className="px-src"><a href={LIST.source.url} target="_blank" rel="noopener noreferrer">{LIST.source.t}</a></p>
        <h3 className="mt-h3 px-gap-top">{PX.voice.voicesTitle}</h3>
        <ul className="px-voices">
          {PX.voice.voices.map((x, i) => <li key={x.t} className={'px-voice px-voice-' + i}><strong>{x.t}</strong><span>{x.d}</span></li>)}
        </ul>
        <p className="mt-note">{PX.voice.doc}</p>
        <p className="px-src"><a href={SOURCES.dip3.url} target="_blank" rel="noopener noreferrer">{SOURCES.dip3.t}</a></p>
      </div>
    </section>
  );
}

/* ---------- 6. the first Dash PAXT: what the list already shows ---------- */
const STRIP = 62;
function First() {
  const s = useScene<HTMLDivElement>();
  const lit = Math.round((LIST.votingApart / LIST.enabled) * STRIP);
  return (
    <section className="mt-sec" id="first" aria-labelledby="first-h">
      <div className="mt-wrap">
        <div className={'mt-first px-first' + s.cls} ref={s.ref}>
          <p className="mt-kicker">{PX.first.kicker}</p>
          <h2 className="mt-h2" id="first-h">{PX.first.title}</h2>
          <p className="mt-first-what">{PX.first.what}</p>
          <h3 className="mt-h3">{PX.first.shownTitle}</h3>
          <div className="px-strip" role="img" aria-label={PX.first.apart + ' ' + PX.first.apartLine}>
            {Array.from({ length: STRIP }, (_, i) => <i key={i} className={i < lit ? 'on' : ''} style={v({ '--d': 200 + i * 14 + 'ms' })} />)}
          </div>
          <ul className="px-shown">
            <li><strong>{PX.first.apart}</strong><span>{PX.first.apartLine}</span></li>
            <li><strong>{PX.first.same}</strong><span>{PX.first.sameLine}</span></li>
            <li><strong>{PX.first.paid}</strong><span>{PX.first.paidLine}</span></li>
          </ul>
          <p className="px-src"><a href={SOURCES.docsKeys.url} target="_blank" rel="noopener noreferrer">{SOURCES.docsKeys.t}</a><a href={LIST.source.url} target="_blank" rel="noopener noreferrer">{LIST.source.t}</a></p>
          <p className="mt-p mt-p-wide">{PX.first.proof}</p>
          <dl className="mt-first-grid">
            <div><dt>{PX.first.threshold}</dt><dd>{PX.first.thresholdV}</dd></div>
            <div><dt>{PX.first.voiceK}</dt><dd>{PX.first.voiceV}</dd></div>
            <div><dt>{PX.first.statusK}</dt><dd>{PX.first.statusV}</dd></div>
          </dl>
          <a className="mt-btn" href="#line">{PX.first.open}</a>
        </div>
      </div>
    </section>
  );
}

/* ---------- 7. the room: a Telepaxt, and Dasha as its clerk ---------- */
function Room() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="telepaxt" aria-labelledby="room-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.room.kicker}</p>
        <h2 className="mt-h2" id="room-h" data-his-word={HIS_PAXT.room}>{PX.room.title}</h2>
        <p className="mt-p mt-p-wide">{PX.room.body}</p>
        <div className={'px-two' + s.cls} ref={s.ref}>
          <div className="mt-panel px-does">
            <h3 className="mt-h3">{PX.room.doesTitle}</h3>
            <ul className="mt-list">{PX.room.does.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="mt-panel px-keeps">
            <h3 className="mt-h3">{PX.room.keepsTitle}</h3>
            <ul className="mt-list">{PX.room.keeps.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
        <p className="mt-p mt-p-wide px-honest">{PX.room.honest}</p>
        <p className="px-src"><a href={SOURCES.telegram.url} target="_blank" rel="noopener noreferrer">{SOURCES.telegram.t}</a></p>
        <p className="mt-note">{PX.room.status}</p>
        <p><a className="mt-btn" href={PX.room.pageHref} target="_blank" rel="noopener noreferrer">{PX.room.open}</a></p>
      </div>
    </section>
  );
}

/* ---------- 8. four grades of voice ---------- */
function Grades() {
  const s = useScene<HTMLOListElement>();
  return (
    <section className="mt-sec" id="grades" aria-labelledby="grades-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.grades.kicker}</p>
        <h2 className="mt-h2" id="grades-h">{PX.grades.title}</h2>
        <ol className={'px-grades' + s.cls} ref={s.ref}>
          {PX.grades.rows.map((g, i) => (
            <li key={g.t} className={'px-grade px-grade-' + i} style={v({ '--d': i * 130 + 'ms' })}>
              <span className="px-grade-bar" aria-hidden>{Array.from({ length: 4 }, (_, k) => <i key={k} className={k <= i ? 'on' : ''} />)}</span>
              <h3 className="mt-h3">{g.t}</h3>
              <p>{g.d}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ---------- 9. held evidence earns again: four quarters of one card ---------- */
const Q = [0, 1, 2, 3];
const EV = [{ y: 70, fails: -1 }, { y: 120, fails: 2 }, { y: 170, fails: -1 }];
function Held() {
  const s = useScene<HTMLDivElement>();
  return (
    <section className="mt-sec" id="held" aria-labelledby="held-h">
      <div className="mt-wrap mt-split">
        <div>
          <p className="mt-kicker">{PX.held.kicker}</p>
          <h2 className="mt-h2" id="held-h">{PX.held.title}</h2>
          <p className="mt-p">{PX.held.body}</p>
          <ol className="px-rules">
            {PX.held.rules.map(r => <li key={r.t}><strong>{r.t}</strong><span>{r.d}</span></li>)}
          </ol>
          <p className="mt-note">{PX.held.pays}</p>
        </div>
        <figure className={'mt-panel mt-scene px-held' + s.cls} ref={s.ref}>
          <svg viewBox="0 0 440 208" aria-hidden>
            {Q.map(q => <text key={q} className="mt-svg-label" x={70 + q * 100} y={28} textAnchor="middle">Q{q + 1}</text>)}
            {Q.map(q => <line key={q} className="px-q-line" x1={70 + q * 100} y1={42} x2={70 + q * 100} y2={212} />)}
            {EV.map((e, k) => (
              <g key={k}>
                <line className={'px-ev-run' + (e.fails >= 0 ? ' fails' : '')} x1={70} y1={e.y} x2={e.fails >= 0 ? 70 + e.fails * 100 : 370} y2={e.y} style={v({ '--d': 200 + k * 160 + 'ms' })} />
                {Q.map(q => {
                  if (e.fails >= 0 && q > e.fails) return null;
                  const failed = e.fails === q;
                  return (
                    <g key={q} className={'px-ev' + (failed ? ' failed' : '')} style={v({ '--d': 500 + q * 420 + k * 90 + 'ms' })}>
                      <circle cx={70 + q * 100} cy={e.y} r={failed ? 8 : 7} />
                      {!failed && <circle className="px-coin" cx={70 + q * 100} cy={e.y + 22} r={3.4} />}
                    </g>
                  );
                })}
              </g>
            ))}
            <g className="px-finder" style={v({ '--d': 500 + 2 * 420 + 300 + 'ms' })}>
              <circle cx={270} cy={120} r={15} />
              <circle className="px-coin big" cx={258} cy={150} r={4.4} /><circle className="px-coin big" cx={270} cy={154} r={4.4} /><circle className="px-coin big" cx={282} cy={150} r={4.4} />
            </g>
          </svg>
          <figcaption className="mt-sr">{PX.held.caption}</figcaption>
        </figure>
      </div>
    </section>
  );
}

/* ---------- 10. precedent ---------- */
function Precedent() {
  return (
    <section className="mt-sec" id="precedent" aria-labelledby="precedent-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.precedent.kicker}</p>
        <h2 className="mt-h2" id="precedent-h">{PX.precedent.title}</h2>
        <div className="px-two">
          {PX.precedent.rows.map(r => (
            <div key={r.t} className="mt-panel px-prec">
              <h3 className="mt-h3">{r.t}</h3>
              <p>{r.d}</p>
              <p className="px-src">{r.sources.map(x => <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer">{x.t}</a>)}</p>
            </div>
          ))}
        </div>
        <p className="mt-note">{PX.precedent.more}</p>
        <p className="px-src"><a href="/MOTRUS#precedent">{PX.precedent.moreOpen}</a></p>
      </div>
    </section>
  );
}

/* ---------- 11. built, and next ---------- */
function Next() {
  return (
    <section className="mt-sec" id="next" aria-labelledby="next-h">
      <div className="mt-wrap">
        <p className="mt-kicker">{PX.next.kicker}</p>
        <h2 className="mt-h2" id="next-h">{PX.next.title}</h2>
        <div className="px-two">
          <div className="mt-panel px-built">
            <h3 className="mt-h3">{PX.next.builtTitle}</h3>
            <ul className="mt-list mt-list-signs">{PX.next.built.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
          <div className="mt-panel px-next">
            <h3 className="mt-h3">{PX.next.nextTitle}</h3>
            <ul className="mt-list">{PX.next.next.map(x => <li key={x}>{x}</li>)}</ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function PaxtPage() {
  useHashScroll();
  usePointerLight();
  return (
    <div className="mt px">
      <TopNav page="paxt" />
      <Hero />
      <main id="main">
        <Layers />
        <Forms />
        <Line />
        <Voice />
        <First />
        <Room />
        <Grades />
        <Held />
        <Precedent />
        <Next />
      </main>
      <PartsIndex />
      <footer className="mt-close">
        <div className="mt-wrap">
          <Mark size={76} />
          <p className="mt-tagline">{PX.statement}</p>
          <div className="mt-doors">
            {PX.close.doors.map((d, i) => <a key={d.href} className={'mt-btn' + (i === 0 ? ' mt-btn-key' : '')} href={d.href}>{d.t}</a>)}
          </div>
          <p className="mt-note">{PX.close.note}</p>
        </div>
      </footer>
    </div>
  );
}
