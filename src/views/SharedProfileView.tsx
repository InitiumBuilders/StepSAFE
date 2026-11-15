/* THE SHARED PRAXIS PROFILE: what someone else sees when you send the link.

   Read-only, no app state, no localStorage read. Rendered entirely from the URL
   fragment, so opening a link never touches the reader's own record.

   The provenance notice is not fine print and is not apologetic. It is the
   product's own doctrine applied to itself. A claim without an issuer and a way
   to check it is a rumour with better typography, and this page says so about
   its own contents. */

import React from 'react';
import type { SharedProfile } from '../lib/share';
import { Seal } from '../components/Glyphs';
import { Mark } from '../components/bits';
import { GratusCounts } from '../components/Gratus';
import { RiseHead } from '../components/RiseHead';

export function SharedProfileView({ p }: { p: SharedProfile }) {
  const when = (() => {
    try { return new Date(p.at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return p.at; }
  })();

  return (
    <div className="shared-wrap">
      <header className="shared-head">
        <span className="brand-mark"><Mark /> StepSAFE</span>
        <span className="brand-sub">The Praxis</span>
      </header>

      <section className="band" style={{ paddingTop: 'var(--s5)' }}>
        <div className="row" style={{ gap: 'var(--s5)', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 340px', minWidth: 0 }}>
            <div className="label" style={{ marginBottom: 12 }}>PRAXIS PROFILE · SHARED RECORD</div>
            <RiseHead text={p.handle} style={{ marginBottom: 12 }} />
            {p.codeName && <p className="pf-shared-cn">Unitium Code Name · <strong>{p.codeName}</strong></p>}
            {p.mantra && <blockquote className="pf-shared-mantra">{p.mantra}</blockquote>}
            <p className="lede" style={{ marginBottom: 'var(--s4)' }}>
              {p.rank} · {p.phase} · {p.respect.toLocaleString()} respect · {p.trust.toLocaleString()} trust
            </p>
            <div className="row" style={{ gap: 8, flexWrap: 'wrap' }}>
              <span className="chip sig">{p.pages.length} Pages earned</span>
              <span className="chip">{p.chapters.length} Chapters locked in</span>
              <span className="chip">{p.steps} Steps sealed</span>
              <span className="chip">{p.sims} rooms commanded</span>
              {p.streak > 1 && <span className="chip gold">{p.streak}-day streak</span>}
              {typeof p.topNotch === 'number' && p.topNotch >= 0 && <span className="chip">Gauge held to notch {p.topNotch}</span>}
              {p.gaugesHeld ? <span className="chip sig">Held for {(p.people || 0).toLocaleString()} people across {p.gaugesHeld} {p.gaugesHeld === 1 ? 'gauge' : 'gauges'}</span> : null}
              {p.hoursKept ? <span className="chip">{p.hoursKept} h of service kept</span> : null}
              {p.cardsHeld ? <span className="chip">{p.cardsHeld} {p.cardsHeld === 1 ? 'card' : 'cards'} held in StudyMode</span> : null}
              {p.unitia ? <span className="chip">{p.unitia.toLocaleString()} UNITIA</span> : null}
            </div>
            {(p.gratus || p.gratusGold) ? <div style={{ marginTop: 'var(--s4)' }}><GratusCounts gratus={p.gratus || 0} gold={p.gratusGold || 0} size={40} /></div> : null}
          </div>
          <div className="seal-wrap" style={{ flex: '0 0 auto' }}>
            <Seal seed={p.handle} size={158} gold={p.chapters.length > 0} />
          </div>
        </div>
      </section>

      {p.pages.length > 0 && (
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="actlab">
            <span className="label">PAGES: THE CREDENTIALS</span>
            <span className="rule" />
          </div>
          <div className="grid grid-2">
            {p.pages.map((pg, i) => (
              <div className="card" key={i}>
                <span className="label" style={{ display: 'block', marginBottom: 6 }}>{pg.chapter}</span>
                <h4 style={{ marginBottom: 8 }}>{pg.title}</h4>
                <p className="sec" style={{ margin: 0 }}>{pg.credential}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {p.chapters.length > 0 && (
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="actlab">
            <span className="label">CHAPTERS LOCKED IN</span>
            <span className="rule" />
          </div>
          <div className="chiprow">
            {p.chapters.map((c, i) => <span className="chip on" key={i}>{c}</span>)}
          </div>
        </section>
      )}

      {p.awards.length > 0 && (
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="actlab">
            <span className="label">SELECTED STEPS</span>
            <span className="rule" />
          </div>
          <div className="traitlist">
            {p.awards.map((a, i) => (
              <span className="trait" key={i}>
                <strong style={{ marginRight: 8 }}>{a.glyph}</strong>
                {a.name}
                <span className="sec"> · {a.tier === 'safe' ? 'SAFEStep' : a.tier === 'strong' ? 'StrongStep' : 'SmallStep'}</span>
              </span>
            ))}
          </div>
        </section>
      )}

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel" style={{ borderColor: 'rgba(232,196,107,0.4)' }}>
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>PROVENANCE: READ THIS BEFORE YOU TRUST IT</span>
          <p className="sec" style={{ marginTop: 0 }}>
            This page is <strong>self-attested</strong>. It was generated by the holder and travels
            entirely inside the link, which means a determined person could hand-craft one. Treat it
            as a portfolio rather than a verified credential.
          </p>
          <p className="sec" style={{ margin: 0 }}>
            The verifiable version is an Intuition attestation, where the claim is signed and staked
            on a public graph and can be checked without trusting this page or its author.
            {p.wallet ? ' Holder address on record: ' + p.wallet + '.' : ' This holder has not linked an address.'}
          </p>
          <p className="sec" style={{ marginTop: 12, marginBottom: 0 }}>Snapshot taken {when}.</p>
        </div>
      </section>

      <section className="band center" style={{ paddingTop: 0 }}>
        <p className="lede" style={{ marginBottom: 'var(--s4)' }}>
          StepSAFE :: The Praxis trains security leaders through project based work.
          Steps become Pages, Pages lock into Chapters, and Chapters build your unit.
        </p>
        <a className="btn btn-key" href={location.origin + location.pathname}>
          Begin your own record
        </a>
      </section>
    </div>
  );
}
