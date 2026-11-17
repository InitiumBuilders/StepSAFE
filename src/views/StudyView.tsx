/* STUDYMODE: every term, structure, threat, stack, guide, Step, room and
   public incident in the Praxis as one deck. The queue is adaptive and says
   why each card is in it; the deck can be searched and filtered to any
   slice; the Atlas shows the whole field at once; the shelf holds what the
   learner marked and wrote; and the progress page reads their record back,
   including where confidence and recall disagree. */

import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useS, type CardState } from '../lib/state';
import { keepInView, centerInRow } from '../lib/barOffset';
import { useEngine } from '../lib/engine';
import { Sound } from '../lib/sound';
import { readSession, writeSession, newSession, applyEvent, SESSION_CAP, takeExamRequest, type StudySession, type SessionEvent } from '../lib/study/session';
import { readExam, writeExam, newExam, type ExamSpec } from '../lib/study/exam';
import { TestTab, ExamRunner } from '../components/study/Exam';
import { encodeSet, setUrl } from '../lib/share';
import { canSpeak } from '../lib/study/voice';
import { deck, cardById, degree, domainsBySubject, subjectsOf, KIND_HUE, KIND_LABEL, type CardKind, type StudyCard } from '../lib/study/cards';
import { SUBJECTS, type SubjectId } from '../content/subjects';
import { SubjectGlyph } from '../components/SubjectGlyph';
import { forYou, contextOf, progressOf, masteryOf, MASTERY_LABEL, isDue, isFud, calibrationOf, signed, fmtTime, fmtUnitia, dayKey, type Mastery } from '../lib/study/engine';
import { StudyCardView } from '../components/study/StudyCardView';
import { Atlas } from '../components/study/Atlas';
import { KindGlyph } from '../components/study/parts';
import { StockRow, StockVessel } from '../components/Stocks';
import { chargeKeystone } from '../lib/swarm';
import { localDay } from '../lib/day';
import { PageSigil } from '../components/PageSigil';
import { RiseHead } from '../components/RiseHead';
import { PhoneSelect } from '../components/bits';

type Tab = 'foryou' | 'deck' | 'test' | 'atlas' | 'shelf' | 'progress';
const KINDS: CardKind[] = ['term', 'model', 'threat', 'stack', 'guide', 'step', 'room', 'incident'];
type StateFilter = 'all' | 'new' | 'met' | 'held' | 'due' | 'fud' | 'sound' | 'favorite' | 'diving' | 'essential' | 'own' | 'notes' | 'tagged';
const STATE_LABEL: Record<StateFilter, string> = {
  all: 'Every card', new: 'Not met yet', met: 'Met', held: 'Held', due: 'Due now', fud: 'In the FUD range', sound: 'Semble Sound',
  favorite: 'Favorites', diving: 'Diving Into', essential: 'Semble Essential', own: 'In My Own Words', notes: 'With notes', tagged: 'Tagged',
};
function matches(f: StateFilter, c: CardState | undefined, now: number): boolean {
  switch (f) {
    case 'all': return true;
    case 'new': return masteryOf(c) === 'new';
    case 'met': return masteryOf(c) !== 'new';
    case 'held': return masteryOf(c) === 'mastered';
    case 'due': return isDue(c, now);
    case 'fud': return isFud(c);
    case 'sound': return typeof c?.sound === 'number' && c.sound >= 1;
    case 'favorite': return !!c?.favorite;
    case 'diving': return !!c?.diving;
    case 'essential': return !!c?.essential;
    case 'own': return !!c?.ownWords?.trim();
    case 'notes': return !!c?.note?.trim();
    case 'tagged': return !!c?.tags?.length;
  }
}

/** a tab was tapped, and the view mounting for its route should keep the tab row in view */
let tabTapped = false;

export function StudyView() {
  const { s, d } = useS();
  const eng = useEngine();
  /* App remounts the view on every route change, so the tab, the session's close and the deck's kind or subject all travel in route.sub:
     'deck', 'deck:threat', 'deck:subject:keys', 'close' */
  const sub = s.route.sub || '';
  const subBase = sub.split(':')[0];
  const [tab, setTab] = useState<Tab>(() => (['foryou', 'deck', 'test', 'atlas', 'shelf', 'progress'].includes(subBase) ? subBase as Tab : 'foryou'));
  const closed = sub === 'close';
  const deckKind: CardKind | 'all' = subBase === 'deck' && sub.includes(':') && KINDS.includes(sub.slice(5) as CardKind) ? sub.slice(5) as CardKind : 'all';
  const deckSubject = sub.startsWith('deck:subject:') ? SUBJECTS.find(x => x.id === sub.slice(13))?.id : undefined;
  /* the session as another page left it: ids that are not cards (a forged gauge's own threat) drop out here */
  const [session, setSession] = useState<StudySession>(() => { const x = readSession(); return { ...x, ids: x.ids.filter(id => cardById(id)) }; });
  useEffect(() => { chargeKeystone(); }, [tab]);
  /* The hero steps aside on every tab but For you. When a tap shrinks it, the tab row would rise past the top of the
     screen; it is brought back into view. A tab is a route, so the tap remounts this view: the tap leaves its note
     in tabTapped, and the view that mounts reads it. An arrival or Back keeps its own place. */
  const tabsRef = useRef<HTMLElement>(null);
  useLayoutEffect(() => {
    if (!tabTapped) return;
    tabTapped = false;
    if (tabsRef.current) keepInView(tabsRef.current);
  }, [tab]);
  /* the tabs are one row that scrolls on a phone: the chosen one is brought to the middle of it */
  useEffect(() => { centerInRow(tabsRef.current?.querySelector<HTMLElement>('.sg-tab.on') || null); }, [tab]);
  /* the study awards land on the record as it stands */
  useEffect(() => { eng.evaluateHooks(s); }, [s.study, s.unitiaC, s.exams]); // eslint-disable-line react-hooks/exhaustive-deps
  /* the test in progress, or one asked for from a chapter or a link */
  const [exam, setExamState] = useState<ExamSpec | null>(() => {
    const req = takeExamRequest();
    if (req) {
      const pool = [...req.pool];
      if (req.expand) for (const id of req.pool) for (const r of cardById(id)?.related || []) if (!pool.includes(r)) pool.push(r);
      const x = newExam(req.label, pool, req.n, req.seed, req.ids, req.by);
      if (x.ids.length >= 3) { writeExam(x); return x; }
    }
    return readExam();
  });
  const setExam = (x: ExamSpec | null) => { setExamState(x); writeExam(x); };
  const openId = s.route.id && cardById(s.route.id) ? s.route.id : null;

  const keep = (next: StudySession) => { setSession(next); writeSession(next); };
  /* a chapter sends its Steps and asks for their terms once the deck is here */
  useEffect(() => {
    if (!session.expand) return;
    const ids = [...session.ids];
    for (const id of session.ids) for (const r of cardById(id)?.related || []) if (!ids.includes(r)) ids.push(r);
    keep({ ...session, ids: ids.slice(0, SESSION_CAP), expand: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.expand]);
  /* a route to a card that is not one opens the session's first card instead */
  useEffect(() => {
    if (s.route.id && !cardById(s.route.id) && session.ids.length) d({ t: 'route', view: 'study', id: session.ids[0] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [s.route.id]);

  function startSession(ids: string[], label: string, listen = false) {
    const ses = { ...newSession(ids.filter(id => cardById(id)), label, s.unitiaC), listen };
    if (!ses.ids.length) return;
    keep(ses);
    d({ t: 'route', view: 'study', id: ses.ids[0] });
  }
  const open = (id: string) => {
    if (!session.ids.includes(id)) keep(newSession([id], KIND_LABEL[cardById(id)!.kind], s.unitiaC));
    d({ t: 'route', view: 'study', id });
  };
  /* inside a card, its neighbours open within the same session */
  const openWithin = (id: string) => {
    if (!session.ids.includes(id)) {
      const pos = session.ids.indexOf(openId || '');
      const ids = [...session.ids];
      ids.splice(pos + 1, 0, id);
      keep({ ...session, ids: ids.slice(0, SESSION_CAP) });
    }
    d({ t: 'route', view: 'study', id });
  };
  const onEvent = (e: SessionEvent) => keep({ ...session, tally: applyEvent(session.tally, e) });
  const onListen = (on: boolean) => keep({ ...session, listen: on });
  const finish = () => d({ t: 'route', view: 'study', sub: 'close' });

  if (openId) {
    const inSession = session.ids.includes(openId);
    return (
      <div className="wrap sg">
        <StudyCardView id={openId} queue={inSession ? session.ids : [openId]} label={inSession ? session.label : KIND_LABEL[cardById(openId)!.kind]}
          onOpen={openWithin} onEvent={onEvent} onFinish={finish} onClose={() => d({ t: 'route', view: 'study', sub: tab })}
          listen={!!session.listen && inSession} onListen={onListen} />
      </div>
    );
  }

  if (tab === 'test' && exam && exam.ids.length) {
    return (
      <div className="wrap sg">
        <ExamRunner spec={exam} setSpec={setExam} onStudy={(ids, label) => { setExam(null); startSession(ids, label); }} onExit={() => { setExam(null); d({ t: 'route', view: 'study', sub: 'test' }); }} />
      </div>
    );
  }

  const p = progressOf(s);
  return (
    <div className="wrap-wide sg">
      <header className={'sg-hero' + (tab === 'foryou' ? '' : ' sg-hero-slim')} data-keystone data-essence="#d8effc">
        <span className="hero-sigil" aria-hidden><PageSigil kind="deck" /></span>
        <span className="label">STUDYMODE</span>
        <RiseHead text="Every concept, one deck." />
        <p className="lede">{p.total.toLocaleString()} cards from the glossary, the structures, the threats, the stacks, the guides, the Steps, the rooms and the public incidents. Turn them, test them, rate how sound they feel, and write them in your own words.</p>
        <div className="sg-balance">
          <div className="sg-unitia"><span className="label">UNITIA</span><strong>{fmtUnitia(s.unitiaC)}</strong><em>+{fmtUnitia(p.unitiaToday)} today{p.streak ? ' · ' + p.streak + (p.streak === 1 ? ' day' : ' days') + ' in a row' : ''}</em></div>
          <div className="sg-balance-stats">
            <span><strong>{p.met}</strong> met of {p.total}</span>
            <span><strong>{p.mastered}</strong> held</span>
            <span><strong>{p.due}</strong> due</span>
            <span><strong>{p.reviewedToday}</strong> reviewed today</span>
            <span className="sound"><strong>{p.sound}</strong> Semble Sound</span>
            <span className="fud"><strong>{p.fud}</strong> in the FUD range</span>
          </div>
        </div>
      </header>

      {closed && session.at > 0 && <SessionClose session={session} onAgain={ids => startSession(ids, 'Another round')} onBack={() => d({ t: 'route', view: 'study', sub: 'foryou' })} />}

      <nav className="sg-tabs" aria-label="StudyMode" ref={tabsRef}>
        {([['foryou', 'For you'], ['deck', 'Deck'], ['test', 'Test'], ['atlas', 'Atlas'], ['shelf', 'Shelf'], ['progress', 'Progress']] as [Tab, string][]).map(([k, l]) => (
          <button key={k} className={'sg-tab' + (tab === k ? ' on' : '')} aria-pressed={tab === k} onClick={() => { if (k !== tab) tabTapped = true; setTab(k); d({ t: 'route', view: 'study', sub: k }); }}>{l}</button>
        ))}
      </nav>

      {tab === 'foryou' && <ForYou startSession={startSession} open={open} />}
      {tab === 'test' && <TestTab onBegin={x => { setExam(x); window.scrollTo({ top: 0 }); }} />}
      {tab === 'deck' && <Deck startSession={startSession} initialKind={deckKind} initialSubject={deckSubject} onTest={(ids, label) => { const x = newExam(label, ids, 20); if (x.ids.length >= 3) { setExam(x); setTab('test'); d({ t: 'route', view: 'study', sub: 'test' }); } }} />}
      {tab === 'atlas' && <section className="sg-section"><p className="sec">Every card in the deck, clustered by kind. The brighter a light, the further you have taken it. A cluster's name opens the deck on that kind.</p><Atlas onOpen={open} onKind={k => d({ t: 'route', view: 'study', sub: 'deck:' + k })} /></section>}
      {tab === 'shelf' && <Shelf startSession={startSession} open={open} />}
      {tab === 'progress' && <Progress open={open} onSubject={sj => d({ t: 'route', view: 'study', sub: 'deck:subject:' + sj })} />}
    </div>
  );
}

/* ---------- the session's close ---------- */

function SessionClose({ session, onAgain, onBack }: { session: StudySession; onAgain: (ids: string[]) => void; onBack: () => void }) {
  const { s } = useS();
  const seen = session.ids.filter(id => (s.study[id]?.lastAt || 0) >= session.at);
  const earned = Math.max(0, s.unitiaC - session.startC);
  const t = session.tally;
  const asked = t.right + t.wrong;
  useEffect(() => { if (seen.length >= 10) Sound.gold(); else Sound.gratus(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <section className="sg-close" aria-label="The session's close">
      <span className="label">SESSION CLOSED {'·'} {session.label.toUpperCase()}</span>
      <h2>{seen.length} {seen.length === 1 ? 'card' : 'cards'}{t.graded ? ', ' + t.graded + ' reviewed' : ''}</h2>
      <div className="sg-close-grid">
        <div><strong>+{fmtUnitia(earned)}</strong><em>UNITIA this session</em></div>
        <div><strong>{t.graded}</strong><em>{t.graded === 1 ? 'review' : 'reviews'}</em></div>
        <div><strong>{asked ? t.right + ' of ' + asked : '0'}</strong><em>questions right</em></div>
        <div><strong>{t.rated}</strong><em>Semble Sound {t.rated === 1 ? 'rating' : 'ratings'}</em></div>
      </div>
      <div className="chiprow">
        {t.again.length > 0 && <button className="btn btn-key btn-sm" onClick={() => onAgain(t.again)}>Another round {'·'} the {t.again.length} marked Again</button>}
        {seen.length > 0 && <button className="btn btn-sm" onClick={() => onAgain(seen)}>Run these {seen.length} again</button>}
        <ShareSet ids={session.ids} label={session.label} />
        <button className="btn btn-sm btn-ghost" onClick={onBack}>Close</button>
      </div>
    </section>
  );
}

/* ---------- send a set by link ---------- */

function ShareSet({ ids, label }: { ids: string[]; label: string }) {
  const { s } = useS();
  const [state, setState] = useState<'' | 'copied' | string>('');
  if (!ids.length) return null;
  const send = async () => {
    const url = setUrl(await encodeSet({ label, ids: ids.slice(0, 200), mode: 'study', by: s.handle || undefined }));
    try { await navigator.clipboard.writeText(url); setState('copied'); } catch { setState(url); }
  };
  return (
    <>
      <button className="btn btn-sm btn-ghost" onClick={send} title="A link that opens these cards as a session for whoever you send it to">{state === 'copied' ? 'Set link copied' : 'Send as a set'}</button>
      {state && state !== 'copied' && <input className="sg-search" readOnly value={state} onFocus={e => e.currentTarget.select()} aria-label="The set link" />}
    </>
  );
}

/* ---------- a half year of study, one square a day ---------- */

function Heat({ days }: { days: Record<string, number> }) {
  const today = new Date(); today.setHours(12, 0, 0, 0);
  const dow = (today.getDay() + 6) % 7;
  const start = today.getTime() - (25 * 7 + dow) * 86400000;
  const cells: { k: string; v: number; lvl: number }[] = [];
  for (let t = start; t <= today.getTime(); t += 86400000) { const k = dayKey(new Date(t)); const v = days[k] || 0; cells.push({ k, v, lvl: v === 0 ? 0 : v < 100 ? 1 : v < 300 ? 2 : v < 600 ? 3 : 4 }); }
  let best = 0, run = 0, studied = 0;
  for (const c of cells) { if (c.v > 0) { run++; studied++; best = Math.max(best, run); } else run = 0; }
  return (
    <div className="panel sg-chart">
      <span className="label">TWENTY SIX WEEKS</span>
      <div className="sg-heat" role="img" aria-label={studied + ' days studied in twenty six weeks, the longest run ' + best + ' days'}>
        {cells.map(c => <i key={c.k} className={'l' + c.lvl} title={c.k + ': ' + fmtUnitia(c.v) + ' UNITIA'} />)}
      </div>
      <p className="sec">{studied ? studied + (studied === 1 ? ' day' : ' days') + ' studied, the longest run ' + best + (best === 1 ? ' day' : ' days') + '. Each square is a day; the brighter, the more UNITIA.' : 'Each square is a day. The first day you study lights one.'}</p>
    </div>
  );
}

/* ---------- a row in any list ---------- */

/** the other name a search matched when the card's own name did not, so the row can say why it is in the list */
const otherNameFor = (c: StudyCard, ql: string) => (ql && c.aka && !c.title.toLowerCase().includes(ql) ? c.aka.find(n => n.toLowerCase().includes(ql)) : undefined);

function CardRow({ c, st, reason, onOpen }: { c: StudyCard; st?: CardState; reason?: string; onOpen: () => void }) {
  const m: Mastery = masteryOf(st);
  return (
    <li className={'sg-row-card m-' + m} style={{ ['--hue' as string]: KIND_HUE[c.kind] }}>
      <button onClick={onOpen}>
        <span className="sg-row-glyph"><KindGlyph kind={c.kind} size={20} /></span>
        <span className="sg-row-text">
          <strong>{c.title}</strong>
          <small>{reason ? reason : KIND_LABEL[c.kind] + ' · ' + c.domain}</small>
        </span>
        <span className="sg-row-state">
          {typeof st?.sound === 'number' && <em className={st.sound < 1 ? 'fud' : 'sound'}>{signed(st.sound)}</em>}
          {st?.diving && <i className="mk dive" title="Diving Into" />}
          {st?.essential && <i className="mk ess" title="Semble Essential" />}
          {st?.favorite && <i className="mk fav" title="Favorite" />}
          <span className={'sg-m m-' + m}>{MASTERY_LABEL[m]}</span>
        </span>
      </button>
    </li>
  );
}

/* ---------- for you ---------- */

function ForYou({ startSession, open }: { startSession: (ids: string[], label: string, listen?: boolean) => void; open: (id: string) => void }) {
  const { s } = useS();
  const now = Date.now();
  const list = useMemo(() => forYou(s, now, 30), [s.study, s.runLog, s.completedSteps]); // eslint-disable-line react-hooks/exhaustive-deps
  const ctx = useMemo(() => contextOf(s), [s.runLog, s.completedSteps]); // eslint-disable-line react-hooks/exhaustive-deps
  const ids = (f: StateFilter) => deck().filter(c => matches(f, s.study[c.id], now)).map(c => c.id);
  const presets: { f: StateFilter; label: string }[] = [
    { f: 'due', label: 'Due now' }, { f: 'diving', label: 'Diving Into' }, { f: 'fud', label: 'Clear the FUD range' },
    { f: 'essential', label: 'Semble Essential' }, { f: 'favorite', label: 'Favorites' },
  ];
  const weekThreat = [...ctx.week].find(x => x.startsWith('threat:'));
  return (
    <section className="sg-section">
      <div className="sg-now">
        <div>
          <span className="label">STUDY NOW</span>
          <h2>{list.length ? list.length + ' cards, each for a reason' : 'Start anywhere'}</h2>
          <p className="sec">The queue reads your record and the world around it: what is due, what you are diving into, what sits in your FUD range, this week's pressure, the gauge you ran last, the chapter nearest to locking in, the public incidents, and the load-bearing cards you have not met.</p>
        </div>
        <div className="sg-start">
          <button className="btn btn-key" onClick={() => startSession(list.map(x => x.id), 'For you')} disabled={!list.length}>Start the session</button>
          {canSpeak() && <button className="btn" onClick={() => startSession(list.map(x => x.id), 'For you', true)} disabled={!list.length} title="Each card read aloud by your device, then the next">Listen to it</button>}
        </div>
      </div>
      <div className="sg-context">
        {weekThreat && <button className="sg-ctx" onClick={() => open(weekThreat)}><span className="label">THIS WEEK</span><strong>{cardById(weekThreat)?.title}</strong><small>the pressure everyone faces this week</small></button>}
        {ctx.gaugeTitle && <button className="sg-ctx" onClick={() => startSession([...ctx.gauge], ctx.gaugeTitle)}><span className="label">YOUR LAST GAUGE</span><strong>{ctx.gaugeTitle}</strong><small>{ctx.gauge.size} structures on it</small></button>}
        {ctx.chapterTitle && <button className="sg-ctx" onClick={() => startSession([...ctx.chapter], ctx.chapterTitle)}><span className="label">NEAREST CHAPTER</span><strong>{ctx.chapterTitle}</strong><small>{ctx.chapter.size} Steps and terms</small></button>}
        <button className="sg-ctx" onClick={() => startSession([...ctx.world], 'In the world')}><span className="label">IN THE WORLD</span><strong>Three public incidents</strong><small>and the structures that decided them</small></button>
      </div>
      <div className="chiprow sg-presets">
        {presets.map(pr => { const n = ids(pr.f).length; return <button key={pr.f} className="chip" disabled={!n} onClick={() => startSession(ids(pr.f), pr.label)}>{pr.label} {'·'} {n}</button>; })}
      </div>
      <ul className="sg-list">
        {list.map(x => <CardRow key={x.id} c={cardById(x.id)!} st={s.study[x.id]} reason={x.reason} onOpen={() => startSession([x.id, ...list.map(y => y.id).filter(y => y !== x.id)], 'For you')} />)}
      </ul>
    </section>
  );
}

/* ---------- the deck ---------- */

function Deck({ startSession, initialKind, initialSubject, onTest }: { startSession: (ids: string[], label: string) => void; initialKind?: CardKind | 'all'; initialSubject?: SubjectId; onTest: (ids: string[], label: string) => void }) {
  const { s } = useS();
  const [q, setQ] = useState('');
  const [kind, setKind] = useState<CardKind | 'all'>(initialKind || 'all');
  useEffect(() => { if (initialKind) { setKind(initialKind); setSubject(initialSubject || 'all'); setDomain('all'); } }, [initialKind, initialSubject]); // eslint-disable-line react-hooks/exhaustive-deps
  const [stateF, setStateF] = useState<StateFilter>('all');
  /* the subject narrows the domains: the deck's 139 domains fall under the same eleven subjects as the glossary */
  const [subject, setSubject] = useState<SubjectId | 'all'>(initialSubject || 'all');
  const [domain, setDomain] = useState('all');
  const [tag, setTag] = useState('');
  const [sort, setSort] = useState<'joined' | 'title' | 'recent' | 'sound'>('joined');
  const [limit, setLimit] = useState(60);
  useEffect(() => setLimit(60), [q, kind, stateF, subject, domain, tag, sort]);
  const now = Date.now();
  const all = deck();
  const tags = useMemo(() => {
    const m = new Map<string, number>();
    for (const c of Object.values(s.study)) for (const t of c.tags || []) m.set(t, (m.get(t) || 0) + 1);
    return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([t]) => t);
  }, [s.study]);
  const ql = q.trim().toLowerCase();
  const shown = useMemo(() => {
    const list = all.filter(c => {
      const st = s.study[c.id];
      if (kind !== 'all' && c.kind !== kind) return false;
      if (subject !== 'all' && c.subject !== subject) return false;
      if (domain !== 'all' && c.domain.split(' · ')[0] !== domain) return false;
      if (!matches(stateF, st, now)) return false;
      if (tag && !(st?.tags || []).includes(tag)) return false;
      if (ql && !(c.title + ' ' + (c.aka || []).join(' ') + ' ' + c.answer + ' ' + c.domain + ' ' + (st?.tags || []).join(' ') + ' ' + (st?.ownWords || '') + ' ' + (st?.note || '')).toLowerCase().includes(ql)) return false;
      return true;
    });
    if (sort === 'title') list.sort((a, b) => a.title.localeCompare(b.title));
    else if (sort === 'recent') list.sort((a, b) => (s.study[b.id]?.lastAt || 0) - (s.study[a.id]?.lastAt || 0));
    else if (sort === 'sound') list.sort((a, b) => (s.study[a.id]?.sound ?? 999) - (s.study[b.id]?.sound ?? 999));
    else list.sort((a, b) => degree(b.id) - degree(a.id));
    return list;
  }, [all, s.study, kind, subject, domain, stateF, tag, ql, sort]); // eslint-disable-line react-hooks/exhaustive-deps
  const counts = useMemo(() => Object.fromEntries(KINDS.map(k => [k, all.filter(c => c.kind === k).length])), [all]);
  const subjects = useMemo(() => subjectsOf(kind === 'all' ? undefined : kind), [kind]);
  const domainGroups = useMemo(() => domainsBySubject(kind === 'all' ? undefined : kind, subject === 'all' ? undefined : subject), [kind, subject]);
  /* a domain picked under a subject also picks that subject, so the two never disagree */
  const pickDomain = (v: string) => { if (v === 'all') { setDomain('all'); return; } const [sj, ...rest] = v.split('|'); setSubject(sj as SubjectId); setDomain(rest.join('|')); };
  return (
    <section className="sg-section">
      <div className="sg-filters">
        <input className="sg-search" value={q} onChange={e => setQ(e.target.value)} placeholder="Search every card, your notes and your own words" aria-label="Search the deck" />
        <PhoneSelect<CardKind | 'all'> label="Kind" value={kind}
          options={[{ value: 'all', label: 'All · ' + all.length }, ...KINDS.map(k => ({ value: k, label: KIND_LABEL[k] + ' · ' + counts[k] }))]}
          onChange={v => { setKind(v); setSubject('all'); setDomain('all'); }} />
        <div className="chiprow row-scroll">
          <button className={'chip' + (kind === 'all' ? ' on' : '')} onClick={() => { setKind('all'); setSubject('all'); setDomain('all'); }}>All {'·'} {all.length}</button>
          {KINDS.map(k => <button key={k} className={'chip sg-kchip' + (kind === k ? ' on' : '')} style={{ ['--hue' as string]: KIND_HUE[k] }} onClick={() => { setKind(k); setSubject('all'); setDomain('all'); }}>{KIND_LABEL[k]} {'·'} {counts[k]}</button>)}
        </div>
        <div className="sg-selects">
          <label><span className="label">State</span><select value={stateF} onChange={e => setStateF(e.target.value as StateFilter)}>{(Object.keys(STATE_LABEL) as StateFilter[]).map(f => <option key={f} value={f}>{STATE_LABEL[f]}</option>)}</select></label>
          <label><span className="label">Subject</span><select value={subject} onChange={e => { setSubject(e.target.value as SubjectId | 'all'); setDomain('all'); }}><option value="all">Every subject</option>{subjects.map(x => <option key={x.id} value={x.id}>{x.name + ' · ' + x.n}</option>)}</select></label>
          <label><span className="label">Domain</span><select value={domain === 'all' ? 'all' : subject + '|' + domain} onChange={e => pickDomain(e.target.value)}><option value="all">{subject === 'all' ? 'Every domain' : 'Every domain in this subject'}</option>{domainGroups.map(gr => subject !== 'all' ? gr.domains.map(dm => <option key={dm} value={gr.id + '|' + dm}>{dm}</option>) : <optgroup key={gr.id} label={gr.name}>{gr.domains.map(dm => <option key={gr.id + dm} value={gr.id + '|' + dm}>{dm}</option>)}</optgroup>)}</select></label>
          <label><span className="label">Order</span><select value={sort} onChange={e => setSort(e.target.value as typeof sort)}><option value="joined">Most joined first</option><option value="title">A to Z</option><option value="recent">Studied most recently</option><option value="sound">FUD range first</option></select></label>
        </div>
        {tags.length > 0 && <PhoneSelect label="Tag" value={tag} options={[{ value: '', label: 'Any tag' }, ...tags.slice(0, 20).map(t => ({ value: t, label: '#' + t }))]} onChange={setTag} />}
        {tags.length > 0 && (
          <div className="chiprow row-scroll">
            {tags.slice(0, 20).map(t => <button key={t} className={'chip' + (tag === t ? ' on' : '')} onClick={() => setTag(tag === t ? '' : t)}>#{t}</button>)}
          </div>
        )}
      </div>
      <div className="sg-now compact">
        <p className="sec">{shown.length.toLocaleString()} {shown.length === 1 ? 'card' : 'cards'}</p>
        <div className="sg-start">
          <button className="btn btn-key btn-sm" disabled={!shown.length} onClick={() => startSession(shown.map(c => c.id), shown.length === all.length ? 'The whole deck' : 'A slice of the deck')}>Study {shown.length > 200 ? 'the first 200' : 'these ' + shown.length}</button>
          <button className="btn btn-sm" disabled={shown.length < 3} onClick={() => onTest(shown.map(c => c.id), shown.length === all.length ? 'The whole deck' : 'A slice of the deck')}>Test me on these</button>
          <ShareSet ids={shown.slice(0, 200).map(c => c.id)} label={q.trim() ? 'Cards on ' + q.trim() : kind !== 'all' ? 'Every ' + KIND_LABEL[kind].toLowerCase() + ' card' : 'A study set'} />
        </div>
      </div>
      <ul className="sg-list">
        {shown.slice(0, limit).map(c => { const via = otherNameFor(c, ql); return <CardRow key={c.id} c={c} st={s.study[c.id]} reason={via ? 'Also called ' + via : undefined} onOpen={() => startSession([c.id, ...shown.filter(x => x.id !== c.id).map(x => x.id)], 'A slice of the deck')} />; })}
      </ul>
      {shown.length > limit && <div className="center" style={{ marginTop: 'var(--s4)' }}><button className="btn" onClick={() => setLimit(n => n + 60)}>Show more {'·'} {shown.length - limit} left</button></div>}
      {!shown.length && <div className="empty">No card matches. Clear a filter or search for something else.</div>}
    </section>
  );
}

/* ---------- the shelf ---------- */

function Shelf({ startSession, open }: { startSession: (ids: string[], label: string) => void; open: (id: string) => void }) {
  const { s } = useS();
  const entries = Object.entries(s.study).filter(([id]) => cardById(id));
  const pick = (f: (c: CardState) => boolean) => entries.filter(([, c]) => f(c)).map(([id]) => id);
  const shelves: { label: string; ids: string[]; note: string }[] = [
    { label: 'Diving Into', ids: pick(c => !!c.diving), note: 'What you are taking deep right now.' },
    { label: 'Semble Essential', ids: pick(c => !!c.essential), note: 'The cards you hold as the most important and highest leverage.' },
    { label: 'Favorites', ids: pick(c => !!c.favorite), note: 'The ones you come back to.' },
  ];
  const own = entries.filter(([, c]) => c.ownWords?.trim());
  function download() {
    const lines: string[] = ['# My study notes', '', 'From StepSAFE :: The Praxis, ' + localDay() + '. Kept on my own device.', ''];
    for (const [id, c] of entries.sort((a, b) => b[1].lastAt - a[1].lastAt)) {
      if (!c.ownWords?.trim() && !c.note?.trim() && !c.tags?.length && typeof c.sound !== 'number') continue;
      const card = cardById(id)!;
      lines.push('## ' + card.title, '', '_' + KIND_LABEL[card.kind] + ' · ' + card.domain + '_', '');
      if (typeof c.sound === 'number') lines.push('Semble Sound: ' + signed(c.sound) + (c.sound < 1 ? ' (FUD range)' : ''), '');
      if (c.tags?.length) lines.push('Tags: ' + c.tags.map(t => '#' + t).join(' '), '');
      if (c.ownWords?.trim()) lines.push('In my own words:', '', c.ownWords.trim(), '');
      if (c.note?.trim()) lines.push('Notes:', '', c.note.trim(), '');
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'my-study-notes-' + localDay() + '.md'; a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
  }
  return (
    <section className="sg-section">
      {shelves.map(sh => (
        <div key={sh.label} className="sg-shelf">
          <div className="sg-now compact">
            <div><h3>{sh.label} {'·'} {sh.ids.length}</h3><p className="sec">{sh.note}</p></div>
            <button className="btn btn-sm" disabled={!sh.ids.length} onClick={() => startSession(sh.ids, sh.label)}>Study these</button>
          </div>
          {sh.ids.length ? <ul className="sg-list">{sh.ids.slice(0, 12).map(id => <CardRow key={id} c={cardById(id)!} st={s.study[id]} onOpen={() => open(id)} />)}</ul> : <p className="sec">Mark a card {sh.label} from inside it.</p>}
        </div>
      ))}
      <div className="sg-shelf">
        <div className="sg-now compact">
          <div><h3>In My Own Words {'·'} {own.length}</h3><p className="sec">Every card you have explained yourself.</p></div>
          <button className="btn btn-sm" onClick={download} disabled={!entries.length}>Download my study notes</button>
        </div>
        <ul className="sg-own">
          {own.slice(0, 20).map(([id, c]) => (
            <li key={id}><button onClick={() => open(id)}><strong>{cardById(id)!.title}</strong><span>{c.ownWords!.trim().slice(0, 220)}{c.ownWords!.trim().length > 220 ? '…' : ''}</span></button></li>
          ))}
        </ul>
        {!own.length && <p className="sec">Open a card and write it In My Own Words. It is the strongest way to keep a concept.</p>}
      </div>
    </section>
  );
}

/* ---------- progress ---------- */

function Progress({ open, onSubject }: { open: (id: string) => void; onSubject: (id: SubjectId) => void }) {
  const { s } = useS();
  const p = progressOf(s);
  const maxDay = Math.max(100, ...p.days.map(x => x.unitiaC));
  const bins = new Array(8).fill(0);
  for (const c of Object.values(s.study)) if (typeof c.sound === 'number') bins[Math.min(7, Math.floor((c.sound + 112) / 28))]++;
  const maxBin = Math.max(1, ...bins);
  const cal = Object.entries(s.study).map(([id, c]) => ({ id, cal: calibrationOf(c) })).filter(x => x.cal && cardById(x.id));
  return (
    <section className="sg-section">
      <div className="panel">
        <StockRow>
          <StockVessel value={p.met} max={p.total} label="cards met" hue="#b9d8f6" note={'of ' + p.total} />
          <StockVessel value={p.mastered} max={p.total} label="cards held" hue="#a78bff" note="box four or five" />
          <StockVessel value={s.unitiaC / 100} max={Math.max(100, Math.ceil(s.unitiaC / 10000) * 100)} label="UNITIA" hue="#fdc26f" format={v => v.toFixed(2)} note={'+' + fmtUnitia(p.unitiaToday) + ' today'} />
          <StockVessel value={p.ownWords} max={Math.max(10, p.met)} label="In My Own Words" hue="#f18ac6" note={'of ' + p.met + ' met'} />
        </StockRow>
      </div>
      <Heat days={s.unitiaDays} />
      <div className="sg-charts">
        <div className="panel sg-chart">
          <span className="label">UNITIA BY DAY · LAST 14</span>
          <div className="sg-bars">
            {p.days.map(x => <span key={x.day} className="sg-bar" title={x.day + ': ' + fmtUnitia(x.unitiaC)} style={{ height: Math.max(2, (x.unitiaC / maxDay) * 100) + '%' }} />)}
          </div>
          <p className="sec">{fmtTime(p.secsToday)} today {'·'} {p.streak ? p.streak + (p.streak === 1 ? ' day' : ' days') + ' in a row' : 'no streak yet'}</p>
        </div>
        <div className="panel sg-chart">
          <span className="label">SEMBLE SOUND ACROSS YOUR CARDS</span>
          <div className="sg-bars sound">
            {bins.map((n, i) => <span key={i} className={'sg-bar ' + (i < 4 ? 'fud' : 'sound')} title={(i * 28 - 112) + ' to ' + (i * 28 - 85) + ': ' + n} style={{ height: Math.max(2, (n / maxBin) * 100) + '%' }} />)}
          </div>
          <p className="sec">{p.avgSound === null ? 'Rate a card and its reading lands here.' : 'Average ' + signed(p.avgSound) + '. ' + p.fud + ' in the FUD range, ' + p.sound + ' Semble Sound.'}</p>
        </div>
      </div>
      <div className="panel">
        <span className="label">BY KIND</span>
        <ul className="sg-kinds">
          {KINDS.map(k => { const b = p.byKind[k]; if (!b) return null; return (
            <li key={k} style={{ ['--hue' as string]: KIND_HUE[k] }}>
              <span><KindGlyph kind={k} size={16} /> {KIND_LABEL[k]}</span>
              <span className="sg-kind-bar"><i className="met" style={{ width: (b.met / b.total) * 100 + '%' }} /><i className="held" style={{ width: (b.mastered / b.total) * 100 + '%' }} /></span>
              <em>{b.met} met, {b.mastered} held of {b.total}</em>
            </li>
          ); })}
        </ul>
      </div>
      <div className="panel">
        <span className="label">BY SUBJECT</span>
        <ul className="sg-kinds sg-bysubject">
          {SUBJECTS.map(sj => { const b = p.bySubject[sj.id]; if (!b) return null; return (
            <li key={sj.id} style={{ ['--hue' as string]: sj.hue }}>
              <button type="button" onClick={() => onSubject(sj.id)} title={'Open the deck on ' + sj.name}><SubjectGlyph id={sj.id} size={16} /> {sj.name}</button>
              <span className="sg-kind-bar"><i className="met" style={{ width: (b.met / b.total) * 100 + '%' }} /><i className="held" style={{ width: (b.mastered / b.total) * 100 + '%' }} /></span>
              <em>{b.met} met, {b.mastered} held of {b.total}</em>
            </li>
          ); })}
        </ul>
      </div>
      <div className="panel">
        <span className="label">WHERE CONFIDENCE AND RECALL DISAGREE</span>
        {cal.length ? (
          <ul className="sg-list">{cal.map(x => <CardRow key={x.id} c={cardById(x.id)!} st={s.study[x.id]} reason={x.cal!.line} onOpen={() => open(x.id)} />)}</ul>
        ) : <p className="sec">Rate a card's Semble Sound and answer its questions. When the two disagree, the card shows up here, and that gap is the most useful thing to study.</p>}
      </div>
    </section>
  );
}
