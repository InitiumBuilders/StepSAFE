/* PRAXIS PROFILE — the living credential. Pages, Chapters, StrongSteps,
   projects, attestations. Statement: show the work, not the claim. */

import React, { useEffect, useState } from 'react';
import {
  AWARDS, CHAPTERS, PROJECTS, awardById, ESSENCE_HEX,
} from '../content/registry';
import { useS, uid, rankOf, unitPhase, PHASE_NAMES, type UserProject } from '../lib/state';
import { useEngine } from '../lib/engine';
import { SectionHead, Vessel } from '../components/bits';
import { Seal, RankInsignia } from '../components/Glyphs';
import { GratusSigil, GratusCounts } from '../components/Gratus';
import { CodeName, OwnWords } from '../components/Identity';
import { BAND_LABEL, bandOf } from '../content/modux-schema';
import { encodeProfile, shareUrl, type SharedProfile } from '../lib/share';
import { draftForProject, tripleText } from '../lib/intuition';
import { shortAddr, chainName } from '../lib/wallet';
import { chargeKeystone } from '../lib/swarm';
import { ServiceRecord } from '../components/ServiceRecord';
import { Goals } from '../components/Goals';
import { serviceRecord } from '../lib/service';

export function ProfileView() {
  const { s, d } = useS();
  const eng = useEngine();
  const [showNew, setShowNew] = useState(false);
  const [tpl, setTpl] = useState<string>('');
  const [title, setTitle] = useState('');
  const [brief, setBrief] = useState('');
  const [shareLink, setShareLink] = useState('');
  const [shareState, setShareState] = useState<'idle' | 'working' | 'ready' | 'copied'>('idle');
  useEffect(() => { chargeKeystone(); }, []);

  const rank = rankOf(s.respect);
  const phase = unitPhase(s, CHAPTERS.length);
  const strong = Object.keys(s.awards).map(awardById).filter(a => a && a.tier === 'strong');
  const safe = Object.keys(s.awards).map(awardById).filter(a => a && a.tier === 'safe');
  const pages = CHAPTERS.flatMap(c =>
    c.pages.filter(p => s.completedPages[p.id]).map(p => ({ chapter: c, page: p })));
  const lockedChapters = CHAPTERS.filter(c => s.completedChapters[c.id]);

  /* Build a shareable snapshot. Deliberately a SUMMARY, not the record: no
     drill scores, no conversation, no wallet unless one is linked, nothing that
     would embarrass a learner who shares a link with a hiring manager. */
  async function share() {
    setShareState('working');
    const payload: SharedProfile = {
      v: 1,
      handle: s.handle || 'Operator',
      rank: rank.name,
      phase: PHASE_NAMES[phase],
      respect: s.respect,
      trust: s.trust,
      steps: Object.keys(s.completedSteps).length,
      pages: pages.map(({ chapter, page }) => ({
        title: page.title, credential: page.credential, chapter: chapter.title,
      })),
      chapters: lockedChapters.map(c => c.title),
      awards: [...safe, ...strong]
        .filter(Boolean)
        .slice(0, 24)
        .map(a => ({ name: a!.name, tier: a!.tier, glyph: a!.glyph })),
      sims: Object.keys(s.completedSims).length,
      streak: s.streak,
      gratus: s.gratus,
      gratusGold: s.gratusGold,
      topNotch: Math.max(-1, ...Object.values(s.gauges).map(r => r.top ?? -1)),
      codeName: s.codeName || undefined,
      mantra: s.profile.mantra.trim() || undefined,
      ...(() => { const sr = serviceRecord(s); return sr.held ? { people: sr.people, hoursKept: Math.round(sr.hours * 10) / 10, gaugesHeld: sr.held } : {}; })(),
      ...(() => { const held = Object.values(s.study).filter(c => (c.box || 0) >= 4).length; const u = Math.floor(s.unitiaC / 100); return held || u ? { cardsHeld: held, unitia: u } : {}; })(),
      wallet: s.wallet ? s.wallet.address : undefined,
      at: new Date().toISOString(),
    };
    const url = shareUrl(await encodeProfile(payload));
    setShareLink(url);
    try {
      await navigator.clipboard.writeText(url);
      setShareState('copied');
    } catch {
      setShareState('ready');   // clipboard blocked — the field below still holds it
    }
  }

  function addProject() {
    const t = PROJECTS.find(p => p.id === tpl);
    const proj: UserProject = {
      id: uid(),
      title: title.trim() || (t ? t.title : 'Untitled project'),
      domain: t ? t.domain : 'self-directed',
      brief: brief.trim() || (t ? t.brief : ''),
      status: 'forging',
      evidence: [],
      createdAt: Date.now(),
    };
    d({ t: 'project-add', project: proj });
    eng.speak('project-submitted',
      'A project on the anvil. Scope it small enough to finish and real enough to matter.');
    setShowNew(false); setTitle(''); setBrief(''); setTpl('');
  }

  return (
    <div className="wrap-wide">
      <div className="row" style={{ alignItems: 'flex-start', gap: 'var(--s5)', flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 380px', minWidth: 0 }}>
          <SectionHead sigil="keystone"
            kicker="PRAXIS PROFILE"
            title={s.handle || 'Your profile'}
            lede={rank.name + ' · ' + PHASE_NAMES[phase] + ' · ' + s.respect.toLocaleString() +
              ' respect · ' + s.trust.toLocaleString() + ' trust' +
              (s.wallet ? ' · ' + shortAddr(s.wallet.address) + ' on ' + chainName(s.wallet.chainId) : '')}
          />
        </div>
        {/* the generative seal: derived from the handle, unique to this record,
            turning gold once the first Chapter locks in */}
        <div className="seal-wrap" style={{ flex: '0 0 auto' }} data-share-seal>
          <Seal seed={s.handle || 'operator'} size={150}
            gold={Object.keys(s.completedChapters).length > 0} />
          <div className="row" style={{ gap: 8, marginTop: 6, justifyContent: 'center' }}>
            <RankInsignia index={Math.max(0, ['Novus','Apprentice','Operator','Analyst','Engineer','Architect','Commander','Director','CISO','EVO Operator'].indexOf(rank.name)) } />
            <span className="label" style={{ alignSelf: 'center' }}>{rank.name.toUpperCase()}</span>
          </div>
        </div>
      </div>

      <CodeName />
      <OwnWords />
      <ServiceRecord />
      <Goals />

      {/* ---- share the record ---- */}
      <section className="band" style={{ paddingTop: 0 }}>
        <div className="panel plate reticle">
          <div className="row-between" style={{ gap: 'var(--s4)', flexWrap: 'wrap' }}>
            <div style={{ minWidth: 0, flex: '1 1 320px' }}>
              <span className="label" style={{ display: 'block', marginBottom: 8 }}>SHOW YOUR WORK</span>
              <p className="sec" style={{ margin: 0 }}>
                Generate a read-only link to this profile — Pages, Chapters, standing and seal. The
                whole record travels inside the link's fragment, so it is never sent to a server and
                there is nothing to sign up for. Anyone can open it; nobody can edit it.
              </p>
            </div>
            <button className="btn btn-key" onClick={share}
              disabled={shareState === 'working' || pages.length + lockedChapters.length === 0}>
              {shareState === 'working' ? 'Building…'
                : shareState === 'copied' ? 'Link copied ✓'
                : 'Create share link'}
            </button>
          </div>

          {pages.length + lockedChapters.length === 0 && (
            <p className="sec" style={{ marginTop: 12, marginBottom: 0 }}>
              Seal a Page first — a profile with nothing on it is not worth the link.
            </p>
          )}

          {shareLink && (
            <div className="stack-sm" style={{ marginTop: 'var(--s4)' }}>
              <input readOnly value={shareLink} onFocus={e => e.currentTarget.select()}
                aria-label="Shareable profile link"
                style={{
                  width: '100%', padding: '11px 14px', borderRadius: 12,
                  border: '1px solid var(--frame-strong)', background: 'var(--panel-2)',
                  color: 'var(--ink)', fontFamily: 'var(--font-mono)', fontSize: '0.86rem',
                  boxShadow: 'var(--inset)',
                }} />
              <div className="row" style={{ flexWrap: 'wrap' }}>
                <a className="btn btn-sm" href={shareLink} target="_blank" rel="noopener noreferrer">
                  Preview what they will see
                </a>
                <span className="chip">{Math.round(shareLink.length / 1024 * 10) / 10} KB link</span>
              </div>
              <p className="sec" style={{ margin: 0 }}>
                This link is <strong>self-attested</strong> — you generated it, so it proves effort,
                not identity. The shared page says so plainly. For a claim a stranger can verify
                without trusting you, mint the milestone as an Intuition attestation below.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }} data-keystone data-essence="#e8c46b">
        <div className="grid grid-3">
          <div className="panel center">
            <div className="mv" style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--ink-gold)' }}>
              {pages.length}
            </div>
            <span className="label">Pages earned</span>
          </div>
          <div className="panel center">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--ink-signal)' }}>
              {strong.length}
            </div>
            <span className="label">StrongSteps</span>
          </div>
          <div className="panel center">
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2.6rem', fontWeight: 800, color: 'var(--ink-accent)' }}>
              {lockedChapters.length}/{CHAPTERS.length}
            </div>
            <span className="label">Chapters locked in</span>
          </div>
        </div>
      </section>

      {(Object.keys(s.gauges).length > 0 || s.gratus > 0) && (() => {
        const records = Object.values(s.gauges);
        const top = Math.max(-1, ...records.map(r => r.top ?? -1));
        const runs = Math.max(s.runLog.length, records.reduce((n, r) => n + (r.runs || 0), 0));
        const held = records.reduce((n, r) => n + Object.values(r.levels || {}).filter(l => l.held).length, 0);
        return (
          <section className="band" style={{ paddingTop: 0 }}>
            <div className="gx-profile mx-glass">
              <div className="gx-profile-marks">
                <GratusSigil size={112} />
                <GratusSigil size={112} gold />
              </div>
              <div style={{ minWidth: 0 }}>
                <span className="mx-kicker">Modux Gauges</span>
                <h2 style={{ margin: '4px 0 10px' }}>Gratus</h2>
                <GratusCounts gratus={s.gratus} gold={s.gratusGold} size={40} />
                <p className="sec" style={{ margin: '12px 0 0' }}>
                  {runs} gauge {runs === 1 ? 'run' : 'runs'} · {held} {held === 1 ? 'notch' : 'notches'} held · highest notch held {top >= 0 ? top + ' (' + BAND_LABEL[bandOf(top)] + ')' : 'none yet'}
                </p>
                {s.golds.length > 0 && (
                  <ul className="gx-profile-golds">
                    {s.golds.slice(-6).reverse().map((g, i) => (
                      <li key={i}><GratusSigil size={18} gold still /> <strong>{g.title}</strong> · {g.why === 'beyond' ? 'past the catalog ceiling, notch ' + g.notch : 'notch ' + g.notch} · {new Date(g.at).toLocaleDateString()}</li>
                    ))}
                  </ul>
                )}
                <button className="btn btn-sm" style={{ marginTop: 12 }} onClick={() => d({ t: 'route', view: 'modux', sub: 'gauges' })}>Open the gauges</button>
              </div>
            </div>
          </section>
        );
      })()}

      <section className="band" style={{ paddingTop: 0 }}>
        <h2 style={{ marginBottom: 'var(--s4)' }}>Pages: your certifications</h2>
        {pages.length === 0 ? (
          <div className="empty">
            No Pages yet. Complete every Step of a Page inside a Chapter and it seals here — a
            SamePage-style credential that speaks for itself.
          </div>
        ) : (
          <div className="grid grid-2">
            {pages.map(({ chapter, page }) => (
              <div key={page.id} className="card" style={{ ['--essence' as string]: ESSENCE_HEX[chapter.essence] }}>
                <span className="label">{chapter.title} · SEAL {page.seal}</span>
                <h4 style={{ margin: '10px 0 8px' }}>{page.title}</h4>
                <p className="sec" style={{ marginBottom: 10 }}>{page.credential}</p>
                <span className="chip on">
                  earned {new Date(s.completedPages[page.id]).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {safe.length > 0 && (
        <section className="band" style={{ paddingTop: 0 }}>
          <h2 style={{ marginBottom: 'var(--s4)' }}>SAFESteps: the judgment record</h2>
          <div className="chiprow">
            {safe.map(a => a && <span key={a.id} className="chip gold">{a.glyph} {a.name}</span>)}
          </div>
        </section>
      )}

      <section className="band" style={{ paddingTop: 0 }}>
        <div className="row-between" style={{ marginBottom: 'var(--s4)' }}>
          <h2>Praxis Projects</h2>
          <button className="btn btn-key" onClick={() => setShowNew(v => !v)}>
            {showNew ? 'Close' : '+ Forge a project'}
          </button>
        </div>

        {showNew && (
          <div className="panel" style={{ marginBottom: 'var(--s4)' }}>
            <div className="stack">
              <div>
                <label className="label" htmlFor="ptpl" style={{ display: 'block', marginBottom: 8 }}>
                  Start from a template (or leave blank to forge your own)
                </label>
                <select id="ptpl" value={tpl} onChange={e => setTpl(e.target.value)}
                  style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--frame-strong)',
                    background: 'var(--panel-2)', color: 'var(--ink)', fontSize: '1rem' }}>
                  <option value="">Self-directed project</option>
                  {PROJECTS.map(p => (
                    <option key={p.id} value={p.id}>{p.title} ({p.domain}, ~{p.weeks}w)</option>
                  ))}
                </select>
                {tpl && (
                  <p className="sec" style={{ margin: '10px 0 0' }}>
                    {PROJECTS.find(p => p.id === tpl)?.brief}
                  </p>
                )}
              </div>
              <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Project title"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--frame-strong)',
                  background: 'var(--panel-2)', color: 'var(--ink)', fontSize: '1rem' }} />
              <textarea value={brief} onChange={e => setBrief(e.target.value)} rows={3}
                placeholder="What will you build, break, defend or document, and what evidence will prove it?"
                style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid var(--frame-strong)',
                  background: 'var(--panel-2)', color: 'var(--ink)', fontSize: '1rem', fontFamily: 'var(--font-body)', resize: 'vertical' }} />
              <button className="btn btn-key" onClick={addProject}>Add to the forge</button>
            </div>
          </div>
        )}

        {s.projects.length === 0 && !showNew ? (
          <div className="empty">
            This whole school is project-based. Forge a project — from a researched template or your
            own idea — and it becomes part of your profile, with evidence attached as you go.
          </div>
        ) : (
          <div className="stack-sm">
            {s.projects.map(p => (
              <div key={p.id} className="panel panel-2">
                <div className="row-between">
                  <div>
                    <span className="label">{p.domain} · {p.status.toUpperCase()}</span>
                    <h4 style={{ margin: '8px 0' }}>{p.title}</h4>
                    {p.brief && <p className="sec" style={{ margin: 0 }}>{p.brief}</p>}
                  </div>
                  <div className="row" style={{ flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
                    {p.status !== 'complete' && (
                      <button className="btn btn-sm" onClick={() => {
                        const order: UserProject['status'][] = ['forging', 'active', 'submitted', 'complete'];
                        const nxt = order[Math.min(order.indexOf(p.status) + 1, 3)];
                        d({ t: 'project-update', id: p.id, patch: { status: nxt } });
                        if (nxt === 'complete') {
                          eng.fireMilestone('project-complete');
                          d({ t: 'attest-add', draft: draftForProject(s.handle, p.title) });
                          eng.speak('project-submitted', 'Project complete. I drafted the attestation. Review it before you stake it.');
                        }
                      }}>
                        advance ▸
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <h2 style={{ marginBottom: 'var(--s3)' }}>Attestations: your learning on the graph</h2>
        <p className="lede" style={{ marginBottom: 'var(--s4)' }}>
          Milestones become Intuition triples — subject, predicate, object — that you can mint and
          stake with your own wallet. Drafted here; you own the signing.
        </p>
        {s.attestations.length === 0 ? (
          <div className="empty">Earn Pages, Chapters, and projects and their attestation drafts collect here.</div>
        ) : (
          <div className="stack-sm">
            {s.attestations.map(a => (
              <div key={a.id} className="panel panel-2">
                <span className="label">{a.status === 'shared' ? 'CARRIED TO PORTAL' : 'DRAFT'}</span>
                <p className="mono" style={{ margin: '8px 0', fontSize: '1.02rem' }}>{tripleText(a)}</p>
                <p className="sec" style={{ marginBottom: 12 }}>{a.context}</p>
                <div className="row">
                  <a className="btn btn-sm" href="https://portal.intuition.systems" target="_blank" rel="noreferrer"
                    onClick={() => { d({ t: 'attest-update', id: a.id, status: 'shared' }); eng.mintDraft(); }}>
                    Mint on Intuition ↗
                  </a>
                  <button className="btn btn-sm btn-ghost" onClick={() => {
                    navigator.clipboard?.writeText(tripleText(a));
                  }}>
                    Copy claim
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
