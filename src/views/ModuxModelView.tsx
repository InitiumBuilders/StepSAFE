/* One Modux model: the full entry, its drill, its connections, and where to
   study it inside a course. */

import React, { useEffect, useMemo, useState } from 'react';
import { MODUX_MODELS, MODUX_CHAPTERS, moduxById, moduxLinks, moduxMembership, ESSENCE_HEX } from '../content/registry';
import { FAMILY_LABEL, FAMILY_HUE, TIER_LABEL } from '../content/modux-schema';
import { modelToBlocks } from '../content/modux/compile';
import { useS } from '../lib/state';
import { Blocks } from '../components/Blocks';
import { DrillPlayer } from '../components/DrillPlayer';
import { chargeKeystone } from '../lib/swarm';
import { GAUGES } from '../content/modux/gauges';
import { KNOWN_SYSTEMS } from '../content/outlier/systems';
import { RiseHead } from '../components/RiseHead';
import { ShareLink } from '../components/bits';

export function ModuxModelView() {
  const { s, d } = useS();
  const m = moduxById(s.route.id || '');
  const [drillDone, setDrillDone] = useState(false);
  useEffect(() => { setDrillDone(false); chargeKeystone(); window.scrollTo({ top: 0 }); }, [s.route.id]);

  const byId = useMemo(() => new Map(MODUX_MODELS.map(x => [x.id, x])), []);
  if (!m) return <div className="wrap mx"><div className="mx-empty">That model is not in the catalog yet.</div></div>;

  const hue = ESSENCE_HEX[FAMILY_HUE[m.family]];
  const links = moduxLinks(m.id);
  const { stacks, courses } = moduxMembership(m.id);
  /* the step for this model in the first course that teaches it */
  const studyStep = (() => {
    for (const c of MODUX_CHAPTERS)
      for (const p of c.pages)
        for (const st of p.steps)
          if (st.id.endsWith('--' + m.id)) return { chapter: c, step: st };
    return null;
  })();
  const studied = !!(studyStep && s.completedSteps[studyStep.step.id]);
  const drillScore = m.drill ? s.drillScores[m.drill.id] : undefined;

  return (
    <div className="wrap-wide mx">
      <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'modux' })}>← Modux Models</button>
      <ShareLink route={{ view: 'modux-model', id: m.id }} title={m.name + ' · StepSAFE'} label="Share this model" className="share-right" />

      <section className="mx-hero mx-glass mx-lit" style={{ ['--hue' as string]: hue }} data-keystone data-essence={hue}>
        <div className="mx-hero-text">
          <span className="mx-kicker">{FAMILY_LABEL[m.family]} · {TIER_LABEL[m.tier]}</span>
          <RiseHead text={m.name} />
          <p className="lede">{m.statement}</p>
          {m.tier === 'frontier' && (
            <p className="mx-frontier">Frontier structure. Few or no public deployments yet; the evidence below shows what exists.</p>
          )}
          <div className="mx-chips">
            {m.tags.map(t => <span key={t} className="mx-chip dim">{t}</span>)}
          </div>
        </div>
        <div className="mx-tiles mx-tiles-3">
          <div className="mx-tile"><span className="mx-tile-val">{links.length}</span><span className="mx-tile-label">connections</span></div>
          <div className="mx-tile"><span className="mx-tile-val">{m.minutes}</span><span className="mx-tile-label">minutes</span></div>
          <div className="mx-tile"><span className={'mx-tile-val' + (studied ? ' warm' : '')}>{studied ? 'done' : drillScore !== undefined ? (drillScore > 0 ? '+' : '') + drillScore : 'ready'}</span><span className="mx-tile-label">{studied ? 'studied' : 'drill'}</span></div>
        </div>
      </section>

      <div className="mx-two">
        <div className="mx-main">
          <Blocks blocks={modelToBlocks(m, byId)} />

          {m.drill && (
            <section className="mx-section">
              <h2>The Drill</h2>
              <DrillPlayer drill={m.drill} onResolved={(score) => {
                setDrillDone(true);
                d({ t: 'drill-score', drillId: m.drill!.id, score });
                d({ t: 'review-schedule', drillId: m.drill!.id, stepId: studyStep ? studyStep.step.id : m.id, score });
              }} />
              {drillDone && studyStep && !studied && (
                <p className="sec" style={{ marginTop: 12 }}>
                  To seal this model on your record, study it in {studyStep.chapter.title}.
                </p>
              )}
            </section>
          )}
        </div>

        <aside className="mx-side">
          {studyStep && (
            <div className="mx-glass mx-side-card" style={{ ['--hue' as string]: hue }}>
              <span className="mx-kicker">Study it</span>
              <p className="sec">{studyStep.chapter.title}</p>
              <button className="btn btn-key" onClick={() => d({ t: 'route', view: 'step', id: studyStep.step.id })}>
                {studied ? 'Open the Step' : 'Open the Step and seal it'}
              </button>
            </div>
          )}

          {(() => {
            const sc = s.study['model:' + m.id];
            const state = !sc || (!sc.views && !sc.reviews) ? 'Not met yet' : (sc.box || 0) >= 4 ? 'Held' : 'Met';
            const sound = sc && typeof sc.sound === 'number' ? ' \u00b7 Semble Sound ' + (sc.sound > 0 ? '+' : '') + sc.sound : '';
            return (
              <div className="mx-glass mx-side-card" style={{ ['--hue' as string]: hue }}>
                <span className="mx-kicker">StudyMode</span>
                <p className="sec">{state}{sound}</p>
                <button className="btn btn-ghost" onClick={() => d({ t: 'route', view: 'study', id: 'model:' + m.id })}>Open its card</button>
              </div>
            );
          })()}

          {links.length > 0 && (
            <div className="mx-glass mx-side-card">
              <span className="mx-kicker">Compounds with</span>
              <ul className="mx-links">
                {links.map(l => (
                  <li key={l.model.id}>
                    <button className="mx-link" style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[l.model.family]] }}
                      onClick={() => d({ t: 'route', view: 'modux-model', id: l.model.id })}>
                      <span className="mx-link-name">{l.model.name}</span>
                      <span className="mx-link-how">{l.how}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {stacks.length > 0 && (
            <div className="mx-glass mx-side-card">
              <span className="mx-kicker">In these stacks</span>
              <div className="mx-chips">
                {stacks.map(st => (
                  <button key={st.id} className="mx-chip" style={{ ['--hue' as string]: ESSENCE_HEX[st.essence] }}
                    onClick={() => d({ t: 'route', view: 'modux-stack', id: st.id })}>{st.name}</button>
                ))}
              </div>
            </div>
          )}

          {(() => {
            /* the real systems that lean on this structure, with the move each one makes */
            const uses = KNOWN_SYSTEMS.flatMap(k => k.securityLeverage.filter(x => x.models.includes(m.id)).slice(0, 1).map(x => ({ k, move: x.move })));
            if (!uses.length) return null;
            return (
              <div className="mx-glass mx-side-card">
                <span className="mx-kicker">In real systems · {uses.length}</span>
                <ul className="mx-links">
                  {uses.slice(0, 8).map(u => (
                    <li key={u.k.id}>
                      <button className="mx-link" style={{ ['--hue' as string]: '#a78bff' }}
                        onClick={() => d({ t: 'route', view: 'modux', sub: 'systems', id: 'sys:' + u.k.id })}>
                        <span className="mx-link-name">{u.k.name}</span>
                        <span className="mx-link-how">{u.move}</span>
                      </button>
                    </li>
                  ))}
                </ul>
                {uses.length > 8 && <p className="sec" style={{ margin: '8px 0 0', fontSize: '0.88rem' }}>And {uses.slice(8).map(u => u.k.name).join(', ')}.</p>}
              </div>
            );
          })()}

          {(() => {
            const holds = GAUGES.filter(g => g.threats.some(t => t.counters.includes(m.id)));
            if (!holds.length) return null;
            return (
              <div className="mx-glass mx-side-card">
                <span className="mx-kicker">Holds in these gauges</span>
                <div className="mx-chips">
                  {holds.map(g => (
                    <button key={g.id} className="mx-chip" style={{ ['--hue' as string]: ESSENCE_HEX[g.essence] }}
                      title={g.threats.filter(t => t.counters.includes(m.id)).map(t => t.name).join(' · ')}
                      onClick={() => d({ t: 'route', view: 'modux-gauge', id: g.id })}>{g.title}</button>
                  ))}
                </div>
              </div>
            );
          })()}

          {courses.length > 0 && (
            <div className="mx-glass mx-side-card">
              <span className="mx-kicker">Taught in</span>
              <div className="mx-chips">
                {courses.map(c => (
                  <button key={c.id} className="mx-chip" onClick={() => d({ t: 'route', view: 'chapter', id: c.id })}>{c.title}</button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
