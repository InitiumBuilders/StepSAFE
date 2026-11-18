/* One Step — the atomic unit of the whole praxis. Read, drill, do, seal. A sealed Step leads on to the next. */

import React, { useEffect, useRef, useState } from 'react';
import { stepById, stepAfter, ESSENCE_HEX } from '../content/registry';
import { useS } from '../lib/state';
import { ReadAloud } from '../components/ReadAloud';
import { passagesOfStep } from '../lib/reading';
import { useEngine } from '../lib/engine';
import { Blocks } from '../components/Blocks';
import { DrillPlayer } from '../components/DrillPlayer';
import { KindMark, KIND_MEANING } from '../components/Glyphs';
import { chargeKeystone, Swarm } from '../lib/swarm';
import { OUTLIER_ID } from '../content/outlier/ids';
import { outlierVisible } from '../lib/outlier';
import { KnownSystemAtlas } from '../components/KnownSystems';
import { CommonsMap } from '../components/CommonsMap';
import { RiseHead } from '../components/RiseHead';
import { StepWords } from '../components/StepWords';
import { ShareLink } from '../components/bits';
import { StepRail } from '../components/StepRail';

export function StepView() {
  const { s, d } = useS();
  const eng = useEngine();
  const loc = stepById(s.route.id || '');
  const [drillDone, setDrillDone] = useState(false);
  const [drillBest, setDrillBest] = useState(false);
  const nextRef = useRef<HTMLDivElement | null>(null);
  /* the Step's own column, which the rail beside it reads its outline from */
  const mainRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setDrillDone(false);
    setDrillBest(false);
    chargeKeystone();
    window.scrollTo({ top: 0 });
  }, [s.route.id]);

  if (!loc) {
    return (
      <div className="wrap"><div className="empty">Step not found.</div></div>
    );
  }
  const { chapter, page, step } = loc;
  if (chapter.id === OUTLIER_ID && !outlierVisible(s)) {
    return (
      <div className="wrap"><div className="empty">This chapter has not opened yet.</div></div>
    );
  }
  const essence = ESSENCE_HEX[chapter.essence];
  const done = !!s.completedSteps[step.id];
  const motusGated = step.mode === 'motus' && s.mode === 'novus';
  const needsDrill = !!step.drill && !drillDone && !done;
  const next = stepAfter(step.id);

  return (
    <div className="wrap st-page">
      <div className="st-main" ref={mainRef}>
      <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'chapter', id: chapter.id })}>
        ← {chapter.title}
      </button>

      <section className="band" data-keystone data-essence={essence} style={{ paddingBottom: 'var(--s5)' }}>
        <div className="row" style={{ gap: 10, marginBottom: 12 }}>
          <span style={{ ['--essence' as string]: essence }} title={KIND_MEANING[step.kind]}>
            <KindMark kind={step.kind} size={26} />
          </span>
          <span className="label" style={{ alignSelf: 'center' }}>
            {page.title} · {step.kind.toUpperCase()} · {step.minutes} MIN · +{step.respect} RESPECT · +{step.trust} TRUST
          </span>
        </div>
        <RiseHead text={step.title} style={{ marginBottom: 16 }} />
        <div className={'statement'} style={{ ['--essence' as string]: essence }}>
          {step.statement}
        </div>
        {!motusGated && <div className="ra-row" style={{ marginTop: 'var(--s4)' }}><ReadAloud passages={passagesOfStep(step, page.title)} label="this Step" /><button className="btn btn-ghost btn-sm print-btn" onClick={() => window.print()}>Print</button><ShareLink route={{ view: 'step', id: step.id }} title={step.title + ' · StepSAFE'} label="Share this Step" /></div>}
      </section>

      {motusGated ? (
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="panel center">
            <h3 style={{ marginBottom: 12 }}>This Step runs in MOTUS MODE</h3>
            <p className="big-sec" style={{ maxWidth: '54ch', margin: '0 auto var(--s4)' }}>
              MOTUS is the all-in tier — the full project-based Praxis Framework, custom
              pathways, and direct planning with August. NOVUS carries you far; MOTUS is
              for the committed. You can preview the opening of this Step below, or step
              up whenever you are ready.
            </p>
            <div className="row" style={{ justifyContent: 'center' }}>
              <a className="btn btn-key" href="mailto:August@MotusMoves.US?subject=MOTUS%20MODE%20Application">
                Apply for MOTUS MODE
              </a>
              <button className="btn" onClick={() => d({ t: 'route', view: 'settings' })}>
                About the tiers
              </button>
            </div>
          </div>
          <div style={{ marginTop: 'var(--s5)', maxHeight: 320, overflow: 'hidden', position: 'relative' }}>
            <Blocks blocks={step.blocks.slice(0, 2)} />
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(180deg, transparent 30%, var(--ground) 96%)',
            }} />
          </div>
        </section>
      ) : (
        <>
          {chapter.id === OUTLIER_ID && step.id.startsWith('ol-') && (
            <section className="band" style={{ paddingTop: 0 }}>
              {step.id === 'ol-commons' ? <CommonsMap /> : <KnownSystemAtlas id={step.id.slice(3)} />}
            </section>
          )}
          <section className="band" style={{ paddingTop: 0 }}>
            <Blocks blocks={step.blocks} />
          </section>

          {step.drill && (
            <section className="band" style={{ paddingTop: 0 }} data-st-part="Decision drill">
              <DrillPlayer
                drill={step.drill}
                onResolved={(score, best) => {
                  setDrillDone(true);
                  setDrillBest(best);
                  d({ t: 'drill-score', drillId: step.drill!.id, score });
                  /* a miss enters the spaced-repetition queue; a clean answer on a
                     drill already in the queue expands its interval */
                  d({ t: 'review-schedule', drillId: step.drill!.id, stepId: step.id, score });
                  if (best) eng.speak('drill-perfect');
                  else if (score < 0) eng.speak('drill-failed');
                }}
              />
            </section>
          )}

          {(step.praxis || step.evidence) && (
            <section className="band" style={{ paddingTop: 0 }} data-st-part="Field praxis">
              <div className="panel" style={{ borderColor: 'rgba(232,196,107,0.4)' }}>
                <span className="label" style={{ display: 'block', marginBottom: 10 }}>FIELD PRAXIS — do it in the world</span>
                {step.praxis && <p className="big-sec">{step.praxis}</p>}
                {step.evidence && (
                  <>
                    <span className="label" style={{ display: 'block', margin: '14px 0 8px' }}>Evidence for your Praxis Profile</span>
                    <p className="sec" style={{ margin: 0 }}>{step.evidence}</p>
                  </>
                )}
              </div>
            </section>
          )}

          <section className="band" style={{ paddingTop: 0 }} data-st-part="The seal">
            {/* the Step's words: glossary entries open in place; a Modux Step's tags open the models that carry them */}
            {!step.id.includes('--mm-') && <StepWords step={step} />}
            <div className="row-between">
              <div className="chiprow">
                {step.id.includes('--mm-') && (step.glossary || []).map(g => (
                  <button key={g} className="chip" style={{ cursor: 'pointer' }}
                    onClick={() => d({ t: 'route', view: 'modux', sub: 'models', id: 'q:' + g })}>
                    {g.replace(/-/g, ' ')}
                  </button>
                ))}
              </div>
              {done ? (
                <span className="chip on">Step sealed ✓</span>
              ) : (
                <button
                  className={'btn btn-key' + (needsDrill ? '' : ' btn-charge')}
                  disabled={needsDrill}
                  title={needsDrill ? 'Run the drill first' : undefined}
                  onClick={e => {
                    /* the Step itself is a quiet mark; any Page or Chapter it
                       completes will summon its own, larger presence from the
                       engine — so this never double-fires a ceremony */
                    const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                    Swarm.summon('note', { x: r.left + r.width / 2, y: r.top + r.height / 2 });
                    eng.finishStep(step);
                    /* the way on appears under this button: once it is there, the page moves to show it whole */
                    window.setTimeout(() => {
                      const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
                      nextRef.current?.scrollIntoView({ block: 'nearest', behavior: calm ? 'auto' : 'smooth' });
                    }, 500);
                  }}
                >
                  {needsDrill ? 'Run the drill to seal this Step' : 'Seal this Step'}
                </button>
              )}
            </div>
            {done && step.drill && drillBest && (
              <p className="sec" style={{ marginTop: 12 }}>Clean drill. That decision pattern is yours now.</p>
            )}
            {/* a sealed Step leads on: the Step after it in the chapter, or the chapter itself after the last */}
            {done && (next ? (
              <div className="panel pr-one st-next" ref={nextRef} style={{ ['--essence' as string]: essence }}>
                <div className="pr-one-text">
                  <span className="label">{next.page.title} · {next.step.kind.toUpperCase()} · {next.step.minutes} MIN</span>
                  <strong className="pr-one-title">{next.step.title}</strong>
                </div>
                <button className="btn btn-key pr-one-go" onClick={() => d({ t: 'route', view: 'step', id: next.step.id })}>Next Step</button>
              </div>
            ) : (
              <div className="st-next st-back" ref={nextRef}>
                <button className="btn" onClick={() => d({ t: 'route', view: 'chapter', id: chapter.id })}>← {chapter.title}</button>
              </div>
            ))}
          </section>
        </>
      )}
      </div>
      {!motusGated && <StepRail main={mainRef} stepId={step.id} />}
    </div>
  );
}
