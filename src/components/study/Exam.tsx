/* THE TEST TAB AND THE TEST. Pick what to be tested on and how many
   questions; answer them with no feedback until the end; then the score, the
   time, each kind of card, and every miss with its answer. The misses become
   a study session in one press, and the same test can be sent to a teammate
   or a class by link. */

import React, { useEffect, useMemo, useState } from 'react';
import { useS, type CardState } from '../../lib/state';
import { deck, cardById, KIND_HUE, KIND_LABEL, type CardKind } from '../../lib/study/cards';
import { masteryOf, contextOf, dayKey, fmtTime } from '../../lib/study/engine';
import { dueIds } from '../../lib/study/session';
import { EXAM_LENGTHS, newExam, examQuestion, scoreExam, resultLine, newSeed, type ExamSpec } from '../../lib/study/exam';
import { encodeSet, setUrl } from '../../lib/share';
import { CHAPTERS } from '../../content/registry';
import { Sound } from '../../lib/sound';
import { Haptic } from '../../lib/haptic';
import { KindGlyph } from './parts';

const KINDS: CardKind[] = ['term', 'model', 'threat', 'stack', 'guide', 'step', 'room', 'incident'];

interface Pool { key: string; label: string; ids: string[] }

export function TestTab({ onBegin }: { onBegin: (spec: ExamSpec) => void }) {
  const { s } = useS();
  const [poolKey, setPoolKey] = useState('met');
  const [chapterId, setChapterId] = useState(CHAPTERS[0]?.id || '');
  const [n, setN] = useState<number>(20);
  const pools = useMemo<Pool[]>(() => {
    const all = deck();
    const met = Object.entries(s.study).filter(([id, c]) => masteryOf(c as CardState) !== 'new' && cardById(id)).map(([id]) => id);
    const ctx = contextOf(s);
    const ch = CHAPTERS.find(c => c.id === chapterId);
    const chIds = ch ? (() => { const ids = ch.pages.flatMap(p => p.steps.map(st => 'step:' + st.id)); for (const id of [...ids]) for (const r of cardById(id)?.related || []) if (!ids.includes(r)) ids.push(r); return ids; })() : [];
    return [
      { key: 'met', label: 'What you have met', ids: met },
      { key: 'due', label: 'Due for review', ids: dueIds(s.study).filter(id => cardById(id)) },
      { key: 'chapter', label: 'A chapter', ids: chIds },
      { key: 'gauge', label: ctx.gaugeTitle ? 'Your last gauge' : 'Your last gauge (none run yet)', ids: [...ctx.gauge] },
      { key: 'world', label: 'The public incidents', ids: [...ctx.world] },
      ...KINDS.map(k => ({ key: 'kind:' + k, label: 'Every ' + KIND_LABEL[k].toLowerCase() + ' card', ids: all.filter(c => c.kind === k).map(c => c.id) })),
      { key: 'deck', label: 'The whole deck', ids: all.map(c => c.id) },
    ];
  }, [s.study, s.runLog, chapterId]); // eslint-disable-line react-hooks/exhaustive-deps
  const pool = pools.find(p => p.key === poolKey) || pools[0];
  const ch = CHAPTERS.find(c => c.id === chapterId);
  const label = pool.key === 'chapter' && ch ? ch.title : pool.key === 'gauge' ? contextOf(s).gaugeTitle || pool.label : pool.label;
  const past = [...(s.exams || [])].reverse().slice(0, 8);
  return (
    <section className="sg-section">
      <div className="sg-now">
        <div>
          <span className="label">A TEST</span>
          <h2>Twenty questions, no hints until the end</h2>
          <p className="sec">Each question is drawn from the cards you choose, with three wrong answers from cards of the same kind. Answers stay hidden until you finish. Then the score, the time, and every miss with its answer, and the misses become a session to study. Every answer moves the card's schedule the way a review does.</p>
        </div>
      </div>
      <div className="panel sg-test-setup">
        <span className="label">TEST ME ON</span>
        <div className="chiprow">
          {pools.map(p => (
            <button key={p.key} className={'chip' + (poolKey === p.key ? ' on' : '')} disabled={p.key !== 'chapter' && p.ids.length < 3} onClick={() => setPoolKey(p.key)}>{p.label}{p.key === 'chapter' ? '' : ' · ' + p.ids.length}</button>
          ))}
        </div>
        {poolKey === 'chapter' && (
          <label className="sg-test-chapter"><span className="label">Chapter</span>
            <select value={chapterId} onChange={e => setChapterId(e.target.value)}>{CHAPTERS.map(c => <option key={c.id} value={c.id}>{String(c.order).padStart(2, '0')} {'·'} {c.title}</option>)}</select>
          </label>
        )}
        <span className="label">LENGTH</span>
        <div className="chiprow">{EXAM_LENGTHS.map(k => <button key={k} className={'chip' + (n === k ? ' on' : '')} onClick={() => setN(k)}>{k} questions</button>)}</div>
        <div className="sg-now compact">
          <p className="sec" style={{ margin: 0 }}>{pool.ids.length < 3 ? 'Too few cards here for a test yet.' : 'From ' + pool.ids.length + ' cards: ' + label + '.'}</p>
          <button className="btn btn-key" disabled={pool.ids.length < 3} onClick={() => { const spec = newExam(label, pool.ids, n); if (spec.ids.length >= 3) onBegin(spec); }}>Begin the test</button>
        </div>
      </div>
      {past.length > 0 && (
        <div className="panel">
          <span className="label">TESTS YOU HAVE TAKEN</span>
          <ul className="sg-past">
            {past.map((e, i) => (
              <li key={i}><strong>{e.label}</strong><span className={'sg-past-score' + (e.right / Math.max(1, e.n) >= 0.8 ? ' high' : e.right / Math.max(1, e.n) < 0.5 ? ' low' : '')}>{e.right} of {e.n}</span><em>{new Date(e.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })} {'·'} {fmtTime(e.secs)}</em></li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

export function ExamRunner({ spec, setSpec, onStudy, onExit }: { spec: ExamSpec; setSpec: (x: ExamSpec | null) => void; onStudy: (ids: string[], label: string) => void; onExit: () => void }) {
  const { s, d } = useS();
  const firstOpen = Math.max(0, spec.picks.findIndex(p => p === null));
  const [i, setI] = useState(spec.done ? 0 : firstOpen);
  const [now, setNow] = useState(Date.now());
  const [copied, setCopied] = useState<'' | 'link' | 'line'>('');
  const [linkText, setLinkText] = useState('');
  const q = useMemo(() => examQuestion(spec, i), [spec.seed, spec.ids, i]); // eslint-disable-line react-hooks/exhaustive-deps
  const left = spec.picks.filter(p => p === null).length;

  useEffect(() => { if (spec.done) return; const t = window.setInterval(() => setNow(Date.now()), 1000); return () => window.clearInterval(t); }, [spec.done]);

  const pick = (k: number) => { if (spec.done) return; Haptic.tap(); setSpec({ ...spec, picks: spec.picks.map((p, j) => (j === i ? k : p)) }); };
  const finish = () => {
    const secs = Math.round((Date.now() - spec.at) / 1000);
    const done = { ...spec, secs, done: true };
    const sc = scoreExam(done);
    const day = dayKey();
    const at = Date.now();
    /* every answered question moves its card the way a question on the card does */
    done.ids.forEach((id, j) => { const p = done.picks[j]; if (p === null) return; const qq = examQuestion(done, j); if (qq) d({ t: 'study-quiz', id, right: !!qq.options[p]?.right, day, at }); });
    d({ t: 'exam-done', result: { label: done.label, n: sc.n, right: sc.right, secs, at } });
    if (sc.right / Math.max(1, sc.n) >= 0.9) { Sound.gold(); Haptic.held(); } else { Sound.gratus(); Haptic.good(); }
    setSpec(done);
    window.scrollTo({ top: 0 });
  };

  useEffect(() => {
    if (spec.done) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (['1', '2', '3', '4'].includes(e.key) && q && q.options[parseInt(e.key, 10) - 1]) { e.preventDefault(); pick(parseInt(e.key, 10) - 1); }
      else if ((e.key === 'Enter' || e.key === 'ArrowRight') && spec.picks[i] !== null) { e.preventDefault(); if (i < spec.ids.length - 1) setI(i + 1); }
      else if (e.key === 'ArrowLeft' && i > 0) { e.preventDefault(); setI(i - 1); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }); // eslint-disable-line react-hooks/exhaustive-deps

  const copy = async (text: string, kind: 'link' | 'line') => { try { await navigator.clipboard.writeText(text); setCopied(kind); setLinkText(''); } catch { setLinkText(text); setCopied(''); } };
  const shareTest = async () => { const frag = await encodeSet({ label: spec.label, ids: spec.ids, mode: 'exam', seed: spec.seed, by: s.handle || undefined }); copy(setUrl(frag), 'link'); };

  if (spec.done) {
    const sc = scoreExam(spec);
    const pct = Math.round((sc.right / Math.max(1, sc.n)) * 100);
    return (
      <div className="sg-exam">
        <button className="btn btn-ghost btn-sm" onClick={onExit}>{'←'} StudyMode</button>
        <section className={'sg-exam-result' + (pct >= 90 ? ' high' : pct < 50 ? ' low' : '')}>
          <span className="label">THE TEST {'·'} {spec.label.toUpperCase()}{spec.by ? ' · FROM ' + spec.by.toUpperCase() : ''}</span>
          <div className="sg-exam-score"><strong>{sc.right}</strong><span>of {sc.n}</span></div>
          <div className="sg-exam-bar" role="img" aria-label={pct + ' percent right'}><i style={{ width: pct + '%' }} /></div>
          <p className="sec">{pct}% right in {fmtTime(spec.secs)}{sc.answered < sc.n ? ', ' + (sc.n - sc.answered) + ' left blank' : ''}. {pct >= 90 ? 'Held under test conditions.' : pct >= 70 ? 'Most of it holds. The misses below are where to go next.' : 'The misses below are the most useful thing to study next.'}</p>
          <ul className="sg-exam-kinds">
            {(Object.entries(sc.byKind) as [CardKind, [number, number]][]).map(([k, [r, t]]) => (
              <li key={k} style={{ ['--hue' as string]: KIND_HUE[k] }}><KindGlyph kind={k} size={16} /><span>{KIND_LABEL[k]}</span><strong>{r} of {t}</strong></li>
            ))}
          </ul>
          <div className="chiprow">
            {sc.misses.length > 0 && <button className="btn btn-key btn-sm" onClick={() => onStudy(sc.misses.map(m => m.id), 'Misses: ' + spec.label)}>Study the {sc.misses.length} {sc.misses.length === 1 ? 'miss' : 'misses'}</button>}
            <button className="btn btn-sm" onClick={() => setSpec(newExam(spec.label, spec.pool.length ? spec.pool : spec.ids, spec.ids.length, newSeed()))}>A new draw</button>
            <button className="btn btn-sm btn-ghost" onClick={shareTest}>{copied === 'link' ? 'Test link copied' : 'Send this test'}</button>
            <button className="btn btn-sm btn-ghost" onClick={() => copy(resultLine(spec, sc), 'line')}>{copied === 'line' ? 'Result copied' : 'Copy my result'}</button>
          </div>
          {copied === 'link' && <p className="sec sg-exam-note">Whoever opens the link is asked first, then takes the same questions in the same order. It carries the cards and the test's name, nothing from your record.</p>}
          {linkText && <input className="sg-search" readOnly value={linkText} onFocus={e => e.currentTarget.select()} aria-label="The link" />}
        </section>
        {sc.misses.length > 0 && (
          <section className="sg-section">
            <span className="label">THE MISSES</span>
            <ol className="sg-misses">
              {sc.misses.map(m => {
                const c = cardById(m.id);
                return (
                  <li key={m.id} style={{ ['--hue' as string]: c ? KIND_HUE[c.kind] : 'var(--cyan)' }}>
                    <p className="sg-quiz-q">{m.q.prompt}</p>
                    <p className="sg-miss-line"><span className="label">YOURS</span>{m.picked === null ? 'Left blank' : m.q.options[m.picked]?.text}</p>
                    <p className="sg-miss-line right"><span className="label">THE ANSWER</span>{m.q.options.find(o => o.right)?.text}</p>
                    <p className="sec">{m.q.explain}</p>
                  </li>
                );
              })}
            </ol>
          </section>
        )}
      </div>
    );
  }

  const elapsed = Math.max(0, Math.round((now - spec.at) / 1000));
  return (
    <div className="sg-exam">
      <div className="sg-focus-top">
        <button className="btn btn-ghost btn-sm" onClick={() => { setSpec(null); onExit(); }}>Leave the test</button>
        <span className="sg-focus-where">{spec.label}{spec.by ? ' · from ' + spec.by : ''} {'·'} {i + 1} of {spec.ids.length}</span>
        <span className="sg-clock on"><i aria-hidden />{fmtTime(elapsed)}</span>
      </div>
      <div className="sg-exam-track" aria-hidden>{spec.picks.map((p, j) => <button key={j} className={(p !== null ? 'done' : '') + (j === i ? ' at' : '')} onClick={() => setI(j)} tabIndex={-1} />)}</div>
      {q ? (
        <div className="sg-quiz sg-exam-q" role="group" aria-label={'Question ' + (i + 1)}>
          <p className="sg-quiz-q">{q.prompt}</p>
          <div className="sg-quiz-options">
            {q.options.map((o, k) => (
              <button key={k} className={'sg-opt' + (spec.picks[i] === k ? ' picked' : '')} aria-pressed={spec.picks[i] === k} onClick={() => pick(k)}><span className="sg-opt-key">{k + 1}</span>{o.text}</button>
            ))}
          </div>
        </div>
      ) : <p className="sec">This card cannot be asked; move on.</p>}
      <div className="sg-nav">
        <button className="btn" onClick={() => setI(i - 1)} disabled={i === 0}>{'←'} Back</button>
        {i < spec.ids.length - 1
          ? <button className="btn btn-key" onClick={() => setI(i + 1)}>{spec.picks[i] === null ? 'Skip' : 'Next'} {'→'}</button>
          : <button className="btn btn-key" onClick={finish}>Finish{left ? ' · ' + left + ' blank' : ''}</button>}
      </div>
    </div>
  );
}
