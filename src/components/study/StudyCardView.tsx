/* ONE CARD, IN FULL FOCUS. The card turns on a tap, a space or a swipe;
   Again, Hard, Good or Strong sets when it returns; a question tests it; the
   Semble Sound meter records how sound it feels; and everything a learner
   adds (marks, tags, notes, their own words, a MoTRUS model) stays on this
   device with the card. The clock earns UNITIA only while they are here. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useS, STUDY_DAILY_CARD_SECONDS, UNITIA_C_PER_SECOND, type CardPatch } from '../../lib/state';
import { cardById, pathTo, degree, degreeRank, KIND_HUE, KIND_LABEL, type StudyCard } from '../../lib/study/cards';
import { masteryOf, MASTERY_LABEL, questionFor, calibrationOf, heldCards, fmtTime, fmtUnitia, dayKey, signed, isDue, type Question } from '../../lib/study/engine';
import { useStudyClock } from '../../lib/study/clock';
import { teachBack, scenario, sevaQuestion, studyMindReady } from '../../lib/study/mind';
import { KindGlyph, SoundMeter, TagEditor, CardMap, FieldSignalPanel } from './parts';
import { MotrusMint } from '../MotrusMint';
import { MODUX_MODELS } from '../../content/registry';
import { Sound } from '../../lib/sound';
import { Field } from '../../lib/field';
import type { SessionEvent } from '../../lib/study/session';
import { canSpeak, speak, stopSpeaking, breath } from '../../lib/study/voice';
import { Haptic } from '../../lib/haptic';

const GRADES: { g: 0 | 1 | 2 | 3; label: string; hint: string }[] = [
  { g: 0, label: 'Again', hint: 'back in ten minutes' },
  { g: 1, label: 'Hard', hint: 'back soon' },
  { g: 2, label: 'Good', hint: 'back later' },
  { g: 3, label: 'Strong', hint: 'back much later' },
];

function untilWords(due: number | undefined, now: number): string {
  if (!due) return 'Not scheduled yet';
  const d = due - now;
  if (d <= 0) return 'Due now';
  if (d < 3600000) return 'Due in ' + Math.max(1, Math.round(d / 60000)) + ' min';
  if (d < 86400000) return 'Due in ' + Math.round(d / 3600000) + ' h';
  return 'Due in ' + Math.round(d / 86400000) + ' days';
}

export function StudyCardView({ id, queue, onOpen, onClose, onFinish, onEvent, label, listen, onListen }: { id: string; queue: string[]; onOpen: (id: string) => void; onClose: () => void; onFinish: () => void; onEvent: (e: SessionEvent) => void; label: string; listen: boolean; onListen: (on: boolean) => void }) {
  const { s, d } = useS();
  const card = cardById(id) as StudyCard;
  const st = s.study[id];
  const hue = KIND_HUE[card.kind];
  const [flipped, setFlipped] = useState(false);
  const [quiz, setQuiz] = useState<{ q: Question; picked: number | null } | null>(null);
  const [salt, setSalt] = useState(0);
  const [own, setOwn] = useState(st?.ownWords || '');
  const [note, setNote] = useState(st?.note || '');
  const [mind, setMind] = useState<{ kind: 'teach' | 'scene'; text: string | null; error?: string; busy: boolean } | null>(null);
  const [org, setOrg] = useState('');
  const [minting, setMinting] = useState(false);
  const [drag, setDrag] = useState(0);
  const start = useRef<{ x: number; y: number } | null>(null);
  const { live, active } = useStudyClock(id);
  const [reading, setReading] = useState<'idle' | 'cue' | 'answer' | 'done'>('idle');
  const stopRef = useRef(false);

  /* the card read aloud: title and cue, a breath, the turn, the answer; then, in a listening session, the next card */
  useEffect(() => {
    if (!listen || !canSpeak()) { setReading('idle'); return; }
    stopRef.current = false;
    const stopped = () => stopRef.current;
    let alive = true;
    (async () => {
      setReading('cue');
      await speak(card.title + '. ' + card.cue);
      if (stopped() || !alive) return;
      await breath(1400, stopped);
      if (stopped() || !alive) return;
      setFlipped(true);
      setReading('answer');
      await speak(card.answer);
      if (stopped() || !alive) return;
      setReading('done');
      await breath(2200, stopped);
      if (stopped() || !alive) return;
      if (next) onOpen(next); else onListen(false);
    })();
    return () => { alive = false; stopRef.current = true; stopSpeaking(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, listen]);

  useEffect(() => {
    setFlipped(false); setQuiz(null); setSalt(0); setMind(null); setMinting(false); setDrag(0);
    setOwn(s.study[id]?.ownWords || ''); setNote(s.study[id]?.note || '');
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const pos = queue.indexOf(id);
  const next = pos >= 0 && pos < queue.length - 1 ? queue[pos + 1] : null;
  const prev = pos > 0 ? queue[pos - 1] : null;
  const patch = (p: CardPatch) => d({ t: 'study-patch', id, patch: p, at: Date.now() });

  function grade(g: 0 | 1 | 2 | 3) {
    const before = st?.box || 0;
    const after = g === 0 ? 0 : g === 1 ? Math.max(1, before) : g === 2 ? Math.min(5, before + 1) : Math.min(5, before + 2);
    d({ t: 'study-grade', id, grade: g, day: dayKey(), at: Date.now() });
    onEvent({ kind: 'grade', id, grade: g });
    /* the held moment: a card crossing into box four, the bell; any good grade, the chime */
    if (before < 4 && after >= 4) { Sound.gold(); Field.pulse(undefined, hue, 'seal'); Haptic.held(); }
    else if (g >= 2) { Sound.gratus(); Field.pulse(undefined, hue, 'note'); Haptic.good(); }
    else Haptic.tap();
    if (next) window.setTimeout(() => onOpen(next), 260);
  }
  function answer(i: number) {
    if (!quiz || quiz.picked !== null) return;
    const right = quiz.q.options[i].right;
    setQuiz({ ...quiz, picked: i });
    d({ t: 'study-quiz', id, right, day: dayKey(), at: Date.now() });
    onEvent({ kind: 'quiz', right });
    if (right) { Sound.gratus(); Field.pulse(undefined, hue, 'note'); Haptic.good(); } else Haptic.tap();
  }

  /* keys: space turns, 1 to 4 grade, arrows move through the session */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.key === ' ' || e.key === 'Enter') { if ((e.target as HTMLElement)?.tagName === 'BUTTON') return; e.preventDefault(); setFlipped(f => !f); }
      else if (flipped && s.shortcuts !== 'off' && ['1', '2', '3', '4'].includes(e.key)) grade((parseInt(e.key, 10) - 1) as 0 | 1 | 2 | 3);
      else if (e.key === 'ArrowRight' && next) onOpen(next);
      else if (e.key === 'ArrowLeft' && prev) onOpen(prev);
      else if (e.key === 'Escape') onClose();
      else if ((e.key === 'l' || e.key === 'L') && s.shortcuts !== 'off' && canSpeak()) onListen(!listen);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flipped, next, prev, id]);

  /* a swipe: unturned, it turns the card; turned, right is Good and left is Again */
  const onDown = (e: React.PointerEvent) => { start.current = { x: e.clientX, y: e.clientY }; };
  const onMove = (e: React.PointerEvent) => { if (start.current) setDrag(Math.max(-160, Math.min(160, e.clientX - start.current.x))); };
  const onUp = (e: React.PointerEvent) => {
    const s0 = start.current;
    start.current = null;
    const dx = s0 ? e.clientX - s0.x : 0, dy = s0 ? e.clientY - s0.y : 0;
    setDrag(0);
    if (Math.abs(dx) > 90 && Math.abs(dx) > Math.abs(dy)) { if (!flipped) setFlipped(true); else grade(dx > 0 ? 2 : 0); }
    else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) setFlipped(f => !f);
  };

  const held = useMemo(() => heldCards(s), [s.study]); // eslint-disable-line react-hooks/exhaustive-deps
  const bridge = useMemo(() => (held.size ? pathTo(id, held) : null), [id, held]);
  const tagSuggest = useMemo(() => {
    const count = new Map<string, number>();
    for (const c of Object.values(s.study)) for (const t of c.tags || []) count.set(t, (count.get(t) || 0) + 1);
    const domainWords = card.domain.split(' · ')[0].toLowerCase();
    return [...[...count.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t), domainWords, 'exam', 'board', 'incident', 'to apply'];
  }, [s.study, card.domain]);

  const now = Date.now();
  const today = dayKey();
  const daySecs = (st?.day === today ? st.daySecs || 0 : 0) + live;
  const todayC = Math.min(daySecs, STUDY_DAILY_CARD_SECONDS) * UNITIA_C_PER_SECOND;
  const cal = calibrationOf(st);
  const mastery = masteryOf(st);
  const rank = degreeRank(id);
  const model = card.kind === 'model' ? MODUX_MODELS.find(m => m.id === card.ref) : undefined;

  return (
    <div className="sg-focus" style={{ ['--hue' as string]: hue }}>
      <div className="sg-focus-top">
        <button className="btn btn-ghost btn-sm" onClick={onClose}>{'←'} StudyMode</button>
        <span className="sg-focus-where">{label}{pos >= 0 ? ' · ' + (pos + 1) + ' of ' + queue.length : ''}</span>
        <span className={'sg-clock' + (active ? ' on' : '')} title="UNITIA earns 0.01 a second while you are here and active, up to ten minutes a card a day">
          <i aria-hidden />{fmtTime(daySecs)} today {'·'} +{fmtUnitia(todayC)} UNITIA
        </span>
      </div>

      <div className="sg-stage">
        <div className={'sg-card' + (flipped ? ' flipped' : '')} role="button" tabIndex={0} aria-pressed={flipped}
          aria-label={flipped ? 'The answer to ' + card.title + '. Tap to turn back.' : card.title + '. Tap to turn the card.'}
          onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { start.current = null; setDrag(0); }}
          style={{ transform: drag ? 'translateX(' + drag + 'px) rotate(' + drag / 24 + 'deg)' : undefined }}>
          <div className="sg-face front">
            <span className="sg-face-kind"><KindGlyph kind={card.kind} /> {KIND_LABEL[card.kind]} {'·'} {card.domain}</span>
            <h2>{card.title}</h2>
            <p className="sg-cue">{card.cue}</p>
            <span className="sg-turn">Tap, swipe or press space to turn</span>
          </div>
          <div className="sg-face back">
            <span className="sg-face-kind"><KindGlyph kind={card.kind} /> {card.title}</span>
            <p className="sg-answer">{card.answer}</p>
            <span className="sg-turn">{MASTERY_LABEL[mastery]} {'·'} {untilWords(st?.due, now)}</span>
          </div>
        </div>
        {drag !== 0 && flipped && <span className={'sg-swipe-hint ' + (drag > 0 ? 'good' : 'again')}>{drag > 0 ? 'Good' : 'Again'}</span>}
      </div>

      <div className={'sg-grades' + (flipped ? ' on' : '')} aria-hidden={!flipped}>
        {GRADES.map((g, i) => (
          <button key={g.g} className={'sg-grade g' + g.g} disabled={!flipped} onClick={() => grade(g.g)}>
            <strong>{g.label}</strong><small>{i + 1} {'·'} {g.hint}</small>
          </button>
        ))}
      </div>
      <p className="sg-keys" aria-hidden>Space turns {'·'} 1 to 4 grade {'·'} arrow keys move {'·'} L listens {'·'} Esc closes</p>
      {canSpeak() && (
        <div className={'sg-listen' + (listen ? ' on' : '')}>
          <button className={'sg-mark' + (listen ? ' on' : '')} aria-pressed={listen} onClick={() => onListen(!listen)}>
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M4 10v4h3l4 4V6L7 10zM15.5 8.5a4.5 4.5 0 010 7M18 5.5a8 8 0 010 13" /></svg>{listen ? 'Listening' : 'Listen'}
          </button>
          <span className="sec" aria-live="polite">{listen ? (reading === 'cue' ? 'Reading the cue. The card turns on its own.' : reading === 'answer' ? 'Reading the answer.' : reading === 'done' ? 'On to the next card.' : 'Starting.') : 'The card read aloud by your device, then the next one. Hands free.'}</span>
        </div>
      )}

      <div className="sg-marks">
        <button className={'sg-mark' + (st?.favorite ? ' on' : '')} aria-pressed={!!st?.favorite} onClick={() => patch({ favorite: !st?.favorite })}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.8L12 16.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.8z" /></svg>Favorite
        </button>
        <button className={'sg-mark' + (st?.diving ? ' on' : '')} aria-pressed={!!st?.diving} onClick={() => patch({ diving: !st?.diving })}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M12 3v14M6 11l6 6 6-6M5 21h14" /></svg>Diving Into
        </button>
        <button className={'sg-mark' + (st?.essential ? ' on' : '')} aria-pressed={!!st?.essential} onClick={() => patch({ essential: !st?.essential })}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><path d="M12 3l7.8 4.5v9L12 21l-7.8-4.5v-9z" /><circle cx="12" cy="12" r="3" /></svg>Semble Essential
        </button>
        <button className="sg-mark" onClick={() => { setQuiz({ q: questionFor(card, salt)!, picked: null }); setSalt(x => x + 1); }} disabled={!questionFor(card, salt)}>
          <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden><circle cx="12" cy="12" r="8.5" /><path d="M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17.2v.1" /></svg>Test me
        </button>
      </div>

      {quiz && quiz.q && (
        <div className="sg-quiz" role="group" aria-label="A question on this card">
          <p className="sg-quiz-q">{quiz.q.prompt}</p>
          <div className="sg-quiz-options">
            {quiz.q.options.map((o, i) => (
              <button key={i} className={'sg-opt' + (quiz.picked !== null ? (o.right ? ' right' : quiz.picked === i ? ' wrong' : ' dim') : '')} onClick={() => answer(i)} disabled={quiz.picked !== null}>{o.text}</button>
            ))}
          </div>
          {quiz.picked !== null && (
            <div className="sg-quiz-after">
              <p className="sec">{quiz.q.options[quiz.picked].right ? 'Right. ' : 'Not this time. '}{quiz.q.explain}</p>
              <button className="btn btn-sm" onClick={() => { const q = questionFor(card, salt); if (q) { setQuiz({ q, picked: null }); setSalt(x => x + 1); } }}>Another question</button>
            </div>
          )}
        </div>
      )}

      <SoundMeter value={st?.sound} log={st?.soundLog} onCommit={v => { patch({ sound: v }); onEvent({ kind: 'rate' }); }} />
      {cal && <p className={'sg-cal ' + cal.kind}>{cal.line}</p>}

      <div className="sg-panels">
        <details className="sg-panel" open>
          <summary>Go deeper</summary>
          {card.detail.map((p, i) => <p key={i}>{p}</p>)}
          {card.facts.map(f => (
            <div key={f.label} className="sg-fact"><span className="label">{f.label}</span><ul>{f.items.map((x, i) => <li key={i}>{x}</li>)}</ul></div>
          ))}
          <button className="btn btn-sm" onClick={() => d({ t: 'route', ...card.route })}>{card.kind === 'threat' ? 'See its structures' : 'Open the source'}</button>
        </details>

        <details className="sg-panel" open={!!own}>
          <summary>In My Own Words{st?.ownWords ? ' · written' : ''}</summary>
          <p className="sec">Explain it as you would to a colleague, with your own example. Writing it out is the strongest way to keep it.</p>
          <textarea value={own} onChange={e => setOwn(e.target.value)} onBlur={() => { if (own !== (st?.ownWords || '')) patch({ ownWords: own }); }} rows={5} placeholder={'What ' + card.title + ' means to you, and where you have seen it'} />
          <div className="sg-row">
            {studyMindReady(s.provider) ? (
              <button className="btn btn-sm" disabled={own.trim().length < 20 || mind?.busy} onClick={async () => { patch({ ownWords: own }); setMind({ kind: 'teach', text: null, busy: true }); const r = await teachBack(s.provider, card, own); setMind({ kind: 'teach', text: r.text, error: r.error, busy: false }); }}>
                {mind?.kind === 'teach' && mind.busy ? 'Seva is reading' : 'Seva reads my words'}
              </button>
            ) : <span className="sec sg-note">Seva reads your words on your own key only. Set one in Settings.</span>}
            <button className="btn btn-sm btn-ghost" onClick={() => d({ t: 'route', view: 'seva', sub: 'ask:' + sevaQuestion(card) })}>Ask Seva about it</button>
          </div>
          {mind?.kind === 'teach' && !mind.busy && <div className="sg-mind">{mind.text ? mind.text.split('\n').map((l, i) => <p key={i} className={/^[A-Z ]{6,}$/.test(l.trim()) ? 'label' : ''}>{l}</p>) : <p className="sec">Seva did not answer: {mind.error || 'no reply'}.</p>}</div>}
        </details>

        <details className="sg-panel" open={!!note}>
          <summary>Notes{st?.note ? ' · written' : ''}</summary>
          <textarea value={note} onChange={e => setNote(e.target.value)} onBlur={() => { if (note !== (st?.note || '')) patch({ note }); }} rows={4} placeholder="Anything to keep: a source, a question, a link to your work" />
        </details>

        <details className="sg-panel" open>
          <summary>Tags</summary>
          <TagEditor tags={st?.tags || []} suggestions={tagSuggest} onChange={t => patch({ tags: t })} />
        </details>

        <details className="sg-panel" open>
          <summary>The systems map</summary>
          <CardMap id={id} onOpen={onOpen} />
          <p className="sec">{degree(id) ? 'Joined to more cards than ' + Math.round(rank * 100) + '% of the deck.' + (rank >= 0.9 ? ' A load-bearing card: knowing it opens many others.' : '') : ''}</p>
          <div className="sg-bridge">
            <span className="label">BRIDGE FROM WHAT YOU HOLD</span>
            {bridge && bridge.length > 1 ? (
              <ol>{bridge.map(b => <li key={b}><button className="chip" onClick={() => onOpen(b)}>{cardById(b)?.title}</button></li>)}</ol>
            ) : <p className="sec">{held.size ? (bridge ? 'You hold this card already.' : 'No short path yet from the cards you hold. Study a neighbour first.') : 'Hold a few cards (Held, or rated +56 and above) and the shortest path from them to this card appears here.'}</p>}
          </div>
        </details>

        <details className="sg-panel">
          <summary>The field signal</summary>
          <FieldSignalPanel title={card.title} />
        </details>

        <details className="sg-panel">
          <summary>Put it to work</summary>
          <p className="sec">Seva sets the concept in an organisation like yours: the situation, what to watch for, and the move. {studyMindReady(s.provider) ? 'It answers on your own key.' : 'It answers on the StepSAFE server, sent the card and the kind of organisation you name.'}</p>
          <div className="sg-row">
            <input value={org} onChange={e => setOrg(e.target.value)} placeholder="Your kind of organisation, such as a county water utility" maxLength={200} />
            <button className="btn btn-sm" disabled={mind?.busy} onClick={async () => { setMind({ kind: 'scene', text: null, busy: true }); const r = await scenario(s.provider, card, org, { evolved: s.sevaEvolved, guise: s.guise }); setMind({ kind: 'scene', text: r.text, error: r.error, busy: false }); }}>{mind?.kind === 'scene' && mind.busy ? 'Seva is writing' : 'Set the scene'}</button>
          </div>
          {mind?.kind === 'scene' && !mind.busy && <div className="sg-mind">{mind.text ? mind.text.split('\n').map((l, i) => <p key={i} className={/^[A-Z ]{6,}$/.test(l.trim()) ? 'label' : ''}>{l}</p>) : <p className="sec">Seva did not answer: {mind.error || 'no reply'}.</p>}</div>}
          <p className="sec">Turn this card into a structure of your own: a MoTRUS model, kept in your vault and usable in any gauge from notch two.{st?.motrus ? ' You forged one from this card.' : ''}</p>
          {minting ? (
            <>
              <MotrusMint keepOnly onCancel={() => setMinting(false)} onMinted={m => { patch({ motrus: m.id }); setMinting(false); Sound.gratus(); }}
                initial={{
                  name: card.title.slice(0, 60),
                  statement: (card.kind === 'threat' ? 'Stops this: ' : '') + card.answer.slice(0, 280),
                  structure: (model?.structure || card.detail[0] || card.answer).slice(0, 600),
                  failsWhen: model?.failsWhen?.[0] || '',
                  family: model ? model.family : 'own',
                }} />
            </>
          ) : <button className="btn btn-sm" onClick={() => setMinting(true)}>Forge a MoTRUS model from this card</button>}
        </details>

        <details className="sg-panel">
          <summary>On your record</summary>
          <ul className="sg-record">
            <li><span>Time on this card</span><strong>{fmtTime((st?.secs || 0) + live)}</strong></li>
            <li><span>UNITIA earned here</span><strong>{fmtUnitia((st?.unitiaC || 0) + Math.min(live, Math.max(0, STUDY_DAILY_CARD_SECONDS - (st?.day === today ? st.daySecs || 0 : 0))))}</strong></li>
            <li><span>Opened</span><strong>{st?.views || 0} {(st?.views || 0) === 1 ? 'time' : 'times'}</strong></li>
            <li><span>Reviews</span><strong>{st?.reviews || 0}{st?.lapses ? ', slipped ' + st.lapses : ''}</strong></li>
            <li><span>Questions</span><strong>{st?.quiz ? st.quiz.right + ' right of ' + (st.quiz.right + st.quiz.wrong) : 'none yet'}</strong></li>
            <li><span>Next review</span><strong>{untilWords(st?.due, now)}{isDue(st, now) ? '' : ''}</strong></li>
            <li><span>Semble Sound</span><strong>{typeof st?.sound === 'number' ? signed(st.sound) : 'not rated'}</strong></li>
          </ul>
          <p className="sec">UNITIA is a record of attention kept on this device: 0.01 a second while you are here and active, up to ten minutes a card a day, and 1 for each card you review in a day after a few seconds with it. It is not money and it cannot be sent.</p>
        </details>
      </div>

      <div className="sg-nav">
        <button className="btn" onClick={() => prev && onOpen(prev)} disabled={!prev}>{'←'} Previous</button>
        <button className="btn btn-key" onClick={() => next ? onOpen(next) : onFinish()}>{next ? 'Next card →' : 'Finish the session'}</button>
      </div>
    </div>
  );
}
