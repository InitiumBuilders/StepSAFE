/* One Chapter — its thesis, its Pages, its Steps, the rooms that stand on it, its sources. */

import React, { useEffect } from 'react';
import { chapterById, memberById, ESSENCE_HEX, SIMS } from '../content/registry';
import { useS } from '../lib/state';
import { chargeKeystone } from '../lib/swarm';
import { studyRoute, requestExam } from '../lib/study/session';
import { ReadAloud } from '../components/ReadAloud';
import { passagesOfChapter } from '../lib/reading';
import { KindMark, KIND_MEANING } from '../components/Glyphs';
import { OUTLIER_ID, OUTLIER_NUMBER } from '../content/outlier/ids';
import { outlierVisible } from '../lib/outlier';
import { RiseHead } from '../components/RiseHead';
import { ShareLink } from '../components/bits';

const KIND_LABEL: Record<string, string> = {
  construct: 'Construct',
  lesson: 'Lesson',
  drill: 'Drill',
  lab: 'Lab',
  field: 'Field praxis',
  council: 'Council',
};

export function ChapterView() {
  const { s, d } = useS();
  const c = chapterById(s.route.id || '');
  useEffect(() => { chargeKeystone(); }, [s.route.id]);

  if (!c) {
    return (
      <div className="wrap">
        <div className="empty">Chapter not found.</div>
      </div>
    );
  }

  /* the hidden chapter stays hidden until its three keys are held, even by link */
  if (c.id === OUTLIER_ID && !outlierVisible(s)) {
    return (
      <div className="wrap">
        <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'chapters' })}>← All chapters</button>
        <div className="empty">This chapter has not opened yet.</div>
      </div>
    );
  }

  const unlockMember = c.unitUnlock ? memberById(c.unitUnlock) : undefined;
  const essence = ESSENCE_HEX[c.essence];
  /* the rooms of The Practice that stand on this chapter: a room's debrief points here, and this points back */
  const rooms = SIMS.filter(m => m.chapterId === c.id);

  return (
    <div className="wrap">
      <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: (s.route.id || '').startsWith('mx-') ? 'modux' : 'chapters' })}>
        ← {(s.route.id || '').startsWith('mx-') ? 'Modux Models' : 'All chapters'}
      </button>
      <ShareLink route={{ view: 'chapter', id: c.id }} title={c.title + ' · StepSAFE'} label="Share this chapter" className="share-right" />

      <section className="band" data-keystone data-essence={essence}>
        <div className="label" style={{ marginBottom: 12 }}>
          {c.act} · {c.act === 'MODUX MODELS' ? 'COURSE ' + (c.order - 100) : c.id === OUTLIER_ID ? 'CHAPTER ' + OUTLIER_NUMBER : 'CHAPTER ' + String(c.order).padStart(2, '0')}
        </div>
        <RiseHead text={c.title} style={{ marginBottom: 14 }} />
        <p className="lede" style={{ marginBottom: 'var(--s4)' }}>{c.subtitle}</p>
        <div className={'statement e-' + c.essence} style={{ ['--essence' as string]: essence, marginBottom: 'var(--s5)' }}>
          {c.statement}
        </div>
        <div className="chiprow" style={{ marginBottom: 'var(--s5)' }}>
          <button className="btn btn-sm btn-ghost" onClick={() => studyRoute(d, c.pages.flatMap(p => p.steps.map(st => 'step:' + st.id)), c.title, s.unitiaC, true)}>Study this chapter in StudyMode</button>
          <button className="btn btn-sm btn-ghost" onClick={() => requestExam(d, { label: c.title, pool: c.pages.flatMap(p => p.steps.map(st => 'step:' + st.id)), n: 20, expand: true })}>Test me on this chapter</button>
        </div>
        <div style={{ marginBottom: 'var(--s5)' }}><ReadAloud passages={passagesOfChapter(c)} label="this chapter, start to end" /></div>
        <div className="panel panel-2 panel-flat">
          <span className="label" style={{ display: 'block', marginBottom: 10 }}>Why this chapter exists</span>
          <p className="big-sec" style={{ margin: 0 }}>{c.why}</p>
        </div>
      </section>

      <section className="band" style={{ paddingTop: 0 }}>
        <h2 style={{ marginBottom: 'var(--s3)' }}>What you will be able to do</h2>
        <ul className="blk-check" style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {c.outcomes.map((o, i) => (
            <li key={i} style={{ display: 'flex', gap: 12 }}>
              <span className="big-sec">{o}</span>
            </li>
          ))}
        </ul>
        {unlockMember && (
          <div className="panel panel-2" style={{ marginTop: 'var(--s5)' }}>
            <span className="label" style={{ display: 'block', marginBottom: 8 }}>
              Completing this chapter brings a new seat to your unit
            </span>
            <strong style={{ fontSize: '1.2rem' }}>{unlockMember.callsign}</strong>
            <p className="sec" style={{ margin: '6px 0 0' }}>{unlockMember.role} — {unlockMember.title}</p>
          </div>
        )}
      </section>

      {c.pages.map((p, pi) => {
        const pageDone = !!s.completedPages[p.id];
        return (
          <section className="band" style={{ paddingTop: 0 }} key={p.id}>
            <div className="panel" style={{ borderColor: pageDone ? essence : undefined }}>
              <div className="row-between" style={{ marginBottom: 'var(--s3)' }}>
                <div>
                  <span className="label">PAGE {pi + 1} {pageDone ? '· EARNED' : ''}</span>
                  <h3 style={{ marginTop: 8 }}>{p.title}</h3>
                </div>
                <span className="chip sig">{p.steps.filter(st => s.completedSteps[st.id]).length}/{p.steps.length}</span>
              </div>
              <p className="big-sec" style={{ marginBottom: 'var(--s4)' }}>{p.summary}</p>
              {/* competencies are sentences, not tags — same wrapping treatment */}
              <div className="traitlist" style={{ marginBottom: 'var(--s4)' }}>
                {p.competencies.map((k, i) => (
                  <span className="trait" key={i} style={{ ['--essence' as string]: essence }}>{k}</span>
                ))}
              </div>
              <div className="stack-sm">
                {p.steps.map(st => {
                  const done = !!s.completedSteps[st.id];
                  const gated = st.mode === 'motus' && s.mode === 'novus';
                  return (
                    <button
                      key={st.id}
                      className="opt"
                      style={{ ...(done ? { borderColor: essence } : {}), ['--essence' as string]: essence }}
                      onClick={() => d({ t: 'route', view: 'step', id: st.id })}
                      title={KIND_MEANING[st.kind]}
                    >
                      <span className="row-between">
                        <span className="row" style={{ gap: 10, minWidth: 0 }}>
                          <KindMark kind={st.kind} />
                          <strong>{done ? '✓ ' : ''}{st.title}</strong>
                        </span>
                        <span className="row" style={{ gap: 8 }}>
                          <span className="chip">{KIND_LABEL[st.kind]}</span>
                          <span className="chip">{st.minutes} min</span>
                          {gated && <span className="chip gold">MOTUS</span>}
                        </span>
                      </span>
                      <span className="od">{st.statement}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })}

      {rooms.length > 0 && (
        <section className="band" style={{ paddingTop: 0 }}>
          <div className="panel ch-rooms">
            <span className="label" style={{ display: 'block', marginBottom: 10 }}>The Practice</span>
            <p className="big-sec" style={{ marginBottom: 'var(--s4)' }}>{rooms.length === 1 ? 'One room stands on this chapter.' : rooms.length + ' rooms stand on this chapter.'}</p>
            <div className="stack-sm">
              {rooms.map(m => (
                <button key={m.id} className="opt" style={{ ...(s.completedSims[m.id] ? { borderColor: essence } : {}), ['--essence' as string]: essence }} onClick={() => d({ t: 'route', view: 'sim', id: m.id })}>
                  <span className="row-between">
                    <strong>{s.completedSims[m.id] ? '✓ ' : ''}{m.title}</strong>
                    <span className="row" style={{ gap: 8 }}><span className="chip">{m.minutes} min</span></span>
                  </span>
                  <span className="od">{m.org}</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="band" style={{ paddingTop: 0 }}>
        <details className="reveal">
          <summary>Sources this chapter stands on</summary>
          <div className="reveal-body stack-sm">
            {c.sources.map((src, i) => (
              <div className="blk-callout" key={i}>
                <strong>{src.label}</strong>
                <p className="sec" style={{ margin: '6px 0 0' }}>{src.note}</p>
              </div>
            ))}
          </div>
        </details>
      </section>
    </div>
  );
}
