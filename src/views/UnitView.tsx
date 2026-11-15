/* THE UNIT — the team you build over time.
   UNIT ONE -> UNIT ZUN -> THE UNIT -> UNITIUM ONE.
   Statement: no one defends anything important alone. */

import React, { useEffect } from 'react';
import { UNIT, CHAPTERS, memberById, ESSENCE_HEX } from '../content/registry';
import { useS, unitPhase, PHASE_NAMES, PHASE_MEANING } from '../lib/state';
import { SectionHead } from '../components/bits';
import { UnitWeb } from '../components/UnitWeb';
import { chargeKeystone } from '../lib/swarm';

export function UnitView() {
  const { s } = useS();
  const phase = unitPhase(s, CHAPTERS.length);
  useEffect(() => { chargeKeystone(); }, []);

  const unlocked = new Set<string>(['u-seva', ...s.unitMembers]);
  const phases: (1 | 2 | 3 | 4)[] = [1, 2, 3, 4];

  return (
    <div className="wrap-wide">
      <SectionHead sigil="unit"
        kicker={'CURRENT FORMATION · ' + PHASE_NAMES[phase]}
        title={PHASE_NAMES[phase] + '.'}
        lede={PHASE_MEANING[phase] + ' Complete Chapters and new members take their seats. Each one multiplies the others — that is the entire point of a unit.'}
      />

      {/* the evolution rail */}
      <div className="panel" style={{ marginBottom: 'var(--s6)' }} data-keystone data-essence="#9cc3ef">
        <div className="row" style={{ justifyContent: 'space-between', gap: 'var(--s3)' }}>
          {phases.map(p => (
            <div key={p} style={{ flex: 1, minWidth: 130, textAlign: 'center', opacity: p <= phase ? 1 : 0.5 }}>
              <div
                style={{
                  height: 6, borderRadius: 4, marginBottom: 12,
                  background: p <= phase ? 'linear-gradient(90deg, var(--cyan), var(--azure))' : 'var(--panel-3)',
                  boxShadow: p <= phase ? '0 0 14px rgba(34,211,238,0.5)' : 'var(--inset)',
                }}
              />
              <strong style={{ fontFamily: 'var(--font-display)', fontSize: p === phase ? '1.1rem' : '0.98rem' }}>
                {PHASE_NAMES[p]}
              </strong>
              {p === phase && <div className="label" style={{ marginTop: 6 }}>YOU ARE HERE</div>}
            </div>
          ))}
        </div>
      </div>

      {/* The web comes before the roster, because the relationships are the
          point and the roster is only the index. */}
      <div className="actband">
        <div className="actlab">
          <span className="label">THE LEVERAGE WEB</span>
          <span className="rule" />
        </div>
        <p className="lede" style={{ marginBottom: 'var(--s4)' }}>
          A security organisation is not a list of roles. It is a set of relationships in which each
          seat makes the others more capable — and the shape of what you are still missing is
          exactly as informative as the shape of what you hold.
        </p>
        <UnitWeb unlocked={unlocked} />
      </div>

      {phases.map(ph => {
        const members = UNIT.filter(m => m.phase === ph);
        if (!members.length) return null;
        return (
          <div key={ph} className="actband">
            <div className="actlab">
              <span className="label">{PHASE_NAMES[ph]}</span>
              <span className="rule" />
            </div>
            <div className="grid grid-2">
              {members.map(m => {
                const here = unlocked.has(m.id);
                const unlockChapter = CHAPTERS.find(c => c.unitUnlock === m.id);
                return (
                  <div key={m.id} className={'card e-' + m.essence}
                    style={{ ['--essence' as string]: ESSENCE_HEX[m.essence], opacity: here ? 1 : 0.62 }}>
                    <div className="row" style={{ gap: 10, marginBottom: 10 }}>
                      <div className="glyph" aria-hidden style={{
                        width: 52, height: 52, display: 'grid', placeItems: 'center', borderRadius: 14,
                        border: '1px solid var(--frame-strong)', background: 'var(--panel-2)',
                        fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: '1.3rem',
                        color: here ? 'var(--ink-accent)' : 'var(--ink-2)', boxShadow: 'var(--inset)',
                      }}>
                        {m.callsign.slice(0, 1)}
                      </div>
                      <div>
                        <h4 style={{ marginBottom: 2 }}>{here ? m.callsign : '———'}</h4>
                        <span className="label">{m.role}</span>
                      </div>
                    </div>

                    {here ? (
                      <>
                        <p className="sec" style={{ marginBottom: 10 }}>{m.bio}</p>
                        <div className="blk-quote" style={{ marginBottom: 12 }}>
                          <p style={{ margin: 0, fontSize: '1.04rem' }}>{m.doctrine}</p>
                        </div>
                        {/* strengths are full sentences — they wrap, they do not
                            get clipped by a pill that refuses to break */}
                        <div className="traitlist" style={{ marginBottom: 12 }}>
                          {m.strengths.map((st, i) => <span key={i} className="trait">{st}</span>)}
                        </div>
                        {m.leverages.length > 0 && (
                          <details className="reveal">
                            <summary>How they multiply the unit</summary>
                            <div className="reveal-body stack-sm">
                              {m.leverages.map((lv, i) => {
                                const other = memberById(lv.member);
                                return (
                                  <div key={i} className="blk-callout">
                                    <strong>× {other ? other.callsign : lv.member}</strong>
                                    <p className="sec" style={{ margin: '6px 0 0' }}>{lv.how}</p>
                                  </div>
                                );
                              })}
                            </div>
                          </details>
                        )}
                      </>
                    ) : (
                      <p className="sec" style={{ margin: 0 }}>
                        {unlockChapter
                          ? 'Takes their seat when you lock in “' + unlockChapter.title + '”.'
                          : m.unlockedBy}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
