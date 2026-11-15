/* The World, around the engine: the gauge's state as a heads up display, the
   card for a part you tap, the system in motion (its stocks, flows, loops and
   the moves with the most leverage, in hours of service and in people), the
   day as a chart, and the verdict once the cascade has run. Loaded only when
   a learner enters the world, so three.js never weighs on the rest of the app. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GaugeWorld, type Shield, type WorldCut, type DynView, type WorldViewName } from './GaugeWorld';
import { readSystem } from '../lib/systemRead';
import { STATES, buildState } from '../lib/systemStates';
import { hardeningWeek, type Lesson } from '../lib/hardening';
import type { ModuxGauge, ModuxModel, GaugeThreat } from '../content/modux-schema';
import { NODE_KIND_LABEL } from '../content/modux-schema';
import type { GaugeResult, MotrusPlay } from '../content/modux/score';
import type { Reward } from '../content/modux/gratus';
import { buildModel, initState, step, land, dwellOf, loopsOf, leverage, fmtHours, peopleOf as staffOf, type DynState, type DynModel, type Move } from '../content/modux/dynamics';
import { Sound } from '../lib/sound';
import { useS } from '../lib/state';
import { GratusSigil } from '../components/Gratus';

export interface WorldProps {
  gauge: ModuxGauge;
  level: number;
  bandIndex: number;
  bandLabel: string;
  pressure: number;
  shields: Record<string, Shield[]>;
  phase: 'build' | 'run' | 'result';
  revealed: number;
  result: GaugeResult | null;
  reward: Reward | null;
  refScore: number;
  spent: number;
  structures: number;
  canRun: boolean;
  fresh: string | null;
  stepMs: number;
  sound: boolean;
  /** what the dynamics run on */
  dyn: { stack: string[]; plays: MotrusPlay[]; weakened: Set<string>; byId: Map<string, ModuxModel>; left: number };
  /** holds in a row, from the record */
  momentum: number;
  cutHue: (modelId: string) => string;
  name: (id: string) => string;
  onToggleSound: () => void;
  onRun: () => void;
  onUp: () => void;
  onShowAll: () => void;
  onRebuild: () => void;
  onExit: () => void;
  /** add a structure to the stack from the map */
  onPlace: (modelId: string) => void;
  news: {
    key: string; kicker: string; title: string; body: string; hits: string | null;
    weak: { name: string; why: string } | null; band: string | null; ceiling: boolean;
  } | null;
  studied: string | null;
  onReview?: () => void;
}

const DAY = 24;
const TICK_MS = 100;

/* the frames the camera takes, each a different way to see the same system */
const VIEWS: { id: WorldViewName; label: string }[] = [
  { id: 'whole', label: 'The whole' },
  { id: 'above', label: 'From above' },
  { id: 'people', label: 'From the people' },
  { id: 'keystone', label: 'The keystone' },
  { id: 'cascade', label: 'Along the cascade' },
];

/* the states a system can be put in: one definition, shared with the flat map */
const TOUR_KEY = 'stepsafe-world-tour-v1';

import { peopleOf } from '../lib/people';
export { peopleOf };

const TOUR = [
  { title: 'This is the system you defend', body: 'Every vessel is a part of it, shaped as the real thing. The level inside is how much of its function it still delivers. The pipes carry what each part needs from another, with the delay marked across them.' },
  { title: 'The clouds are the threats', body: 'Each one on the horizon sends pressure at a part. A ring from your stack holds it at the ring. Two rings hold it fully. A stream that reaches the part means nothing is in its way.' },
  { title: 'Act from the map', body: 'Open Systems to see the loops at work and where to act next, in hours of service kept. Add a structure from there, run the day, and when the stack holds, Take It Up A Notch.' },
];

export default function WorldView(p: WorldProps) {
  const host = useRef<HTMLDivElement | null>(null);
  const eng = useRef<GaugeWorld | null>(null);
  const exitBtn = useRef<HTMLButtonElement | null>(null);
  const [failed, setFailed] = useState(false);
  const [picked, setPicked] = useState<string | null>(null);
  const [verdict, setVerdict] = useState(false);
  const [said, setSaid] = useState('');
  const [closedNews, setClosedNews] = useState<string | null>(null);
  /* the news arrives open, then steps aside so the world stays in view */
  const [newsOpen, setNewsOpen] = useState(true);
  const [sysOpen, setSysOpen] = useState(() => window.innerWidth > 760);
  const [keyOpen, setKeyOpen] = useState(false);
  const [tour, setTour] = useState(() => { try { return localStorage.getItem(TOUR_KEY) ? -1 : 0; } catch { return 0; } });
  const [speed, setSpeed] = useState<1 | 3>(1);
  const [clock, setClock] = useState({ hour: 0, delivered: 1, trust: 1, lost: 0, running: false, done: false });
  /* the hour each part first dropped under half its function, during a live day */
  const [fell, setFell] = useState<Record<string, number>>({});
  const fellRef = useRef<Record<string, number>>({});
  const { d: dispatch } = useS();
  const [delta, setDelta] = useState<number | null>(null);
  const [history, setHistory] = useState<{ hour: number; delivered: number; trust: number }[]>([]);
  const still = useMemo(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches, []);
  const launched = useRef(0);
  const lastLevel = useRef(p.level);
  const prevBase = useRef<number | null>(null);
  const deltaTimer = useRef(0);
  const g = p.gauge;
  /* the reading every map shares, and the frame and state the world is in */
  const reading = useMemo(() => readSystem(g.system, g.threats, g, p.dyn.byId), [g, p.dyn.byId]);
  const [frameName, setFrameName] = useState<WorldViewName>('whole');
  const [readOn, setReadOn] = useState(true);
  const [scen, setScen] = useState<{ id: string; label: string; done: boolean } | null>(null);
  const scenRef = useRef<{ model: DynModel; queue: { id: string; at: number }[]; s: DynState;
    /* a week of hardening: one day per move, each with the moves before it in place */
    week?: { days: { model: DynModel; queue: { id: string; at: number }[] }[]; lessons: Lesson[]; day: number; kept: number[] } } | null>(null);

  /* ---------- the model ---------- */
  const stackKey = p.dyn.stack.join(',') + '|' + p.dyn.plays.map(x => x.id + ':' + x.answers.join('+')).join(',') + '|' + [...p.dyn.weakened].join(',');
  const model = useMemo(() => buildModel(g, p.dyn.stack, p.dyn.byId, p.dyn.plays, p.dyn.weakened),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [g, stackKey]);
  const loops = useMemo(() => loopsOf(g, model, p.level), [g, model, p.level]);
  const lev = useMemo(() => leverage(g, p.dyn.stack, p.dyn.byId, p.dyn.plays, p.dyn.weakened, 3),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [g, stackKey]);
  const people = useMemo(() => peopleOf(g.sector), [g.sector]);
  const sim = useRef<DynState>(initState(model));

  /* the forecast moved: say by how much, for a moment */
  useEffect(() => {
    if (prevBase.current !== null && prevBase.current !== lev.base) {
      setDelta(lev.base - prevBase.current);
      window.clearTimeout(deltaTimer.current);
      deltaTimer.current = window.setTimeout(() => setDelta(null), 2600);
    }
    prevBase.current = lev.base;
  }, [lev.base]);

  /* mount the engine once */
  useEffect(() => {
    if (!host.current) return;
    try {
      eng.current = new GaugeWorld(host.current, { still, onPick: setPicked });
    } catch {
      setFailed(true);
      return;
    }
    exitBtn.current?.focus();
    return () => { eng.current?.dispose(); eng.current = null; };
  }, [still]);

  /* the engine is reachable from the console in development, for the probes */
  useEffect(() => { if (import.meta.env.DEV) (window as unknown as { __gw?: GaugeWorld | null }).__gw = eng.current; });

  /* the system, whenever a notch changes it */
  useEffect(() => {
    eng.current?.setScene({ system: g.system, threats: g.threats, shields: p.shields, fresh: p.phase === 'build' ? p.fresh : null });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [g.system, g.threats, p.fresh]);

  const shieldKey = JSON.stringify(Object.entries(p.shields).map(([k, v]) => [k, v.map(s => s.id)]));
  useEffect(() => { eng.current?.setShields(p.shields); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [shieldKey]);

  /* the state the engine shows, from the model */
  const viewOf = (m: DynModel, s: DynState, running: boolean): DynView => {
    const supply: Record<string, number> = {}, cuts: Record<string, string> = {}, landed: Record<string, boolean> = {};
    for (const e of m.edges) { supply[e.key] = s.lag[e.key] ?? 1; if (e.cutBy) cuts[e.key] = p.cutHue(e.cutBy); }
    const staff = staffOf(m, s);
    for (const t of m.threats) if (t.id in s.landed && s.hour - s.landed[t.id] <= dwellOf(t, staff)) landed[t.id] = true;
    return { health: { ...s.health }, supply, cuts, landed, running };
  };
  const view = (s: DynState, running: boolean): DynView => viewOf(model, s, running);

  /* the loops and the sources, whenever the system or the stack changes */
  useEffect(() => {
    const e = eng.current;
    if (!e) return;
    e.setLoops(loops.map(l => ({ id: l.id, kind: l.kind, name: l.name, parts: l.parts, active: l.active })));
    e.setStations(model.threats.map(t => ({ id: t.id, target: t.target, weight: g.threats.find(x => x.id === t.id)?.weight || 2, layers: t.layers })));
    if (p.phase === 'build') {
      sim.current = initState(model);
      e.applyDyn(view(sim.current, false));
      setClock({ hour: 0, delivered: 1, trust: 1, lost: 0, running: false, done: false });
      setHistory([]);
      fellRef.current = {}; setFell({});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [model, loops, g.system, p.phase]);

  /* the clock: during a run the day advances, one hour a second, or three */
  useEffect(() => {
    if (p.phase === 'build') return;
    const id = window.setInterval(() => {
      const s = sim.current;
      const e = eng.current;
      if (s.hour >= DAY - 1e-9) return;
      step(model, s, (TICK_MS / 1000) * speed);
      e?.applyDyn(view(s, true));
      const done = s.hour >= DAY - 1e-9;
      setClock({ hour: s.hour, delivered: s.delivered, trust: s.trust, lost: s.lost, running: !done, done });
      setHistory(h => (h.length === 0 || s.hour - h[h.length - 1].hour >= 0.5 - 1e-9 || done) ? [...h, { hour: s.hour, delivered: s.delivered, trust: s.trust }] : h);
      let newly = false;
      for (const id of model.nodes) if ((s.health[id] ?? 1) < 0.5 && !(id in fellRef.current)) { fellRef.current = { ...fellRef.current, [id]: s.hour }; newly = true; }
      if (newly) setFell(fellRef.current);
    }, TICK_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.phase, model, speed]);

  /* a real run ends any state in play */
  useEffect(() => { if (p.phase !== 'build') { scenRef.current = null; setScen(null); eng.current?.setHardening([]); } }, [p.phase]);

  /* a state runs its own day, one hour a second or three, through its own model */
  useEffect(() => {
    if (!scen || scen.done || scen.id === 'calm') return;
    const id = window.setInterval(() => {
      const sc = scenRef.current; const e = eng.current;
      if (!sc) return;
      const s = sc.s;
      if (s.hour >= DAY - 1e-9) return;
      while (sc.queue.length && sc.queue[0].at <= s.hour + 1e-9) land(s, sc.queue.shift()!.id, s.hour);
      step(sc.model, s, (TICK_MS / 1000) * speed * (sc.week ? 3 : 1));
      e?.applyDyn(viewOf(sc.model, s, true));
      const done = s.hour >= DAY - 1e-9;
      setClock({ hour: s.hour, delivered: s.delivered, trust: s.trust, lost: s.lost, running: !done, done });
      setHistory(h => (h.length === 0 || s.hour - h[h.length - 1].hour >= 0.5 - 1e-9 || done) ? [...h, { hour: s.hour, delivered: s.delivered, trust: s.trust }] : h);
      let newly = false;
      for (const n of sc.model.nodes) if ((s.health[n] ?? 1) < 0.5 && !(n in fellRef.current)) { fellRef.current = { ...fellRef.current, [n]: s.hour }; newly = true; }
      if (newly) { setFell(fellRef.current); Sound.fall(); }
      if (done) {
        const wk = sc.week;
        if (wk) wk.kept.push(DAY - s.lost);
        if (wk && wk.day < wk.days.length - 1) {
          /* the next morning: one more move from the plan, and the day runs again */
          wk.day += 1;
          const next = wk.days[wk.day];
          const l = wk.lessons[wk.day - 1];
          sc.model = next.model; sc.queue = [...next.queue]; sc.s = initState(next.model);
          fellRef.current = {}; setFell({}); setHistory([]);
          e?.setHardening(pointsOf(wk.lessons.slice(0, wk.day)));
          e?.cheer(l.where, 'Day ' + (wk.day + 1) + ': ' + l.name);
          e?.strike(l.where, '#9fe8ff');
          e?.applyDyn(viewOf(next.model, sc.s, true));
          Sound.gratus();
          setClock({ hour: 0, delivered: 1, trust: 1, lost: 0, running: true, done: false });
          setSaid('Day ' + (wk.day + 1) + '. ' + l.name + ' at ' + partName(l.where) + '. Yesterday kept ' + Math.round(wk.kept[wk.kept.length - 1]) + ' of 24 hours.');
        } else {
          if (wk) setSaid('The week took the stress day from ' + Math.round(wk.kept[0]) + ' to ' + Math.round(wk.kept[wk.kept.length - 1]) + ' of 24 hours, one move a day.');
          setScen(v => (v ? { ...v, done: true } : v)); Sound.verdict(DAY - s.lost >= DAY / 2);
        }
      }
    }, TICK_MS);
    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scen?.id, scen?.done, speed]);

  /* the band, and a shockwave when the learner takes a notch */
  useEffect(() => {
    eng.current?.setBand(p.bandIndex);
    if (p.level > lastLevel.current) eng.current?.notchShock();
    lastLevel.current = p.level;
  }, [p.level, p.bandIndex]);

  /* the lattice breathes on the score's beat */
  useEffect(() => Sound.onBeat(b => eng.current?.beat(b.barPos === 0 ? 1 : 0.5)), []);

  /* the run: one threat per reveal, each in its own form; every arrival starts pushing in the model */
  useEffect(() => {
    if (p.phase === 'build') {
      launched.current = 0;
      setVerdict(false);
      eng.current?.clearOutcome();
      return;
    }
    if (!p.result) return;
    const total = g.threats.length;
    while (launched.current < Math.min(p.revealed, total)) {
      const i = launched.current++;
      const per = p.result.perThreat[i];
      if (!per) continue;
      const stopped = per.stoppedBy.length + per.motrus.length > 0;
      const stopper = stopped
        ? { id: per.stoppedBy[0] || per.motrus[0], motrus: per.stoppedBy.length === 0, hue: per.stoppedBy[0] ? p.cutHue(per.stoppedBy[0]) : '#c4b5fd' }
        : null;
      eng.current?.launch(per.threat, stopped ? 'stopped' : 'landed', p.stepMs * 0.85, () => {
        Sound.threat(stopped);
        /* the layers around its part decide how much gets through */
        land(sim.current, per.threat.id);
        setSaid('Threat ' + (i + 1) + ' of ' + total + ': ' + per.threat.name.replace(/^Open problem: /, '') + (stopped ? '. Stopped.' : '. It lands.'));
      }, stopper);
    }
  }, [p.revealed, p.phase, p.result, p.stepMs, g.threats.length]);

  /* the outcome: the cascade, then the verdict */
  useEffect(() => {
    if (p.phase !== 'result' || !p.result) return;
    const r = p.result;
    const cuts: WorldCut[] = r.cuts.map(c => ({ from: c.from, to: c.to, hue: p.cutHue(c.by) }));
    const wait = still ? 0 : 350;
    const t1 = window.setTimeout(() => eng.current?.outcome(r.fallen, r.reached, cuts), wait);
    const cascade = r.fallen.length ? 900 + Math.min(4, r.reached.length + r.cuts.length) * 700 : 500;
    const t2 = window.setTimeout(() => {
      setVerdict(true);
      setSaid((r.verdict === 'holds' ? 'The stack holds. ' : 'Breached. ') + 'Score ' + r.score + ', reference ' + p.refScore + '.');
    }, still ? 0 : wait + cascade);
    return () => { window.clearTimeout(t1); window.clearTimeout(t2); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.phase, p.result]);

  useEffect(() => { if (p.reward?.gold) eng.current?.gold(); }, [p.reward]);

  /* on a phone the verdict and the systems sheet share the bottom, so the sheet folds for it */
  useEffect(() => { if (verdict && window.innerWidth <= 760) setSysOpen(false); }, [verdict]);

  /* keys: escape leaves, unless a card is open */
  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key !== 'Escape' || document.querySelector('.gx-rite')) return;
      if (tour >= 0) { endTour(); return; }
      if (picked) setPicked(null); else p.onExit();
    };
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [picked, p, tour]);

  /* a new notch brings its news; it stays until the run starts or the learner closes it */
  useEffect(() => {
    if (!p.news) return;
    setSaid(p.news.kicker + ': ' + p.news.title + '. ' + p.news.body);
    setNewsOpen(true);
    const t = window.setTimeout(() => setNewsOpen(false), 8000);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [p.news?.key]);
  const showNews = !!p.news && p.phase === 'build' && closedNews !== p.news.key && !picked && tour < 0;

  function frame(v: WorldViewName) {
    setFrameName(v);
    eng.current?.view(v);
  }

  /* the day numbers on each part a move enters */
  function pointsOf(lessons: Lesson[]) {
    const by = new Map<string, Lesson[]>();
    for (const l of lessons) by.set(l.where, [...(by.get(l.where) || []), l]);
    return [...by.entries()].map(([id, ls]) => ({ id, text: ls.map(l => l.day).join(' \u00b7 '), verb: ls[0].verb }));
  }

  /* a week of hardening: day one with the stack as it is, then each morning the move the last day says keeps the most */
  function startWeek() {
    if (p.phase !== 'build') return;
    const wk = hardeningWeek(g, p.dyn.byId, reading, p.dyn.stack);
    if (!wk.lessons.length) { setSaid('With your stack in place, the model finds no single move that keeps more of the stress day.'); return; }
    const days = [0, ...wk.lessons.map((_, i) => i + 1)].map(i => {
      const run = buildState('stress', { gauge: g, byId: p.dyn.byId, stack: [...p.dyn.stack, ...wk.lessons.slice(0, i).map(l => l.id)], reading, plays: p.dyn.plays, weakened: p.dyn.weakened });
      return { model: run.model, queue: [...run.arrivals].sort((a, b) => a.at - b.at) };
    });
    fellRef.current = {}; setFell({}); setHistory([]);
    eng.current?.setHardening([]);
    const s0 = initState(days[0].model);
    scenRef.current = { model: days[0].model, queue: [...days[0].queue], s: s0, week: { days, lessons: wk.lessons, day: 0, kept: [] } };
    setScen({ id: 'week', label: 'A week of hardening', done: false });
    setClock({ hour: 0, delivered: 1, trust: 1, lost: 0, running: true, done: false });
    eng.current?.applyDyn(viewOf(days[0].model, s0, true));
    setSaid('A week of hardening. Day 1 runs with your stack as it is. Each morning after, one move from the plan.');
  }

  function startState(id: string) {
    if (p.phase !== 'build') return;
    const def = STATES.find(x => x.id === id);
    if (!def) return;
    const e = eng.current;
    e?.setHardening([]);
    fellRef.current = {}; setFell({}); setHistory([]);
    if (id === 'calm') {
      scenRef.current = null;
      setScen({ id, label: def.label, done: true });
      sim.current = initState(model);
      e?.applyDyn(view(sim.current, false));
      setClock({ hour: 0, delivered: 1, trust: 1, lost: 0, running: false, done: false });
      setSaid(def.label + '. ' + def.line);
      return;
    }
    const run = buildState(id as never, { gauge: g, byId: p.dyn.byId, stack: p.dyn.stack, reading, plays: p.dyn.plays, weakened: p.dyn.weakened });
    const m: DynModel = run.model;
    const queue = run.arrivals;
    const blows = run.blows;
    if (id === 'adversary' || id === 'strongest') Sound.adversary();
    const s = initState(m);
    scenRef.current = { model: m, queue: [...queue].sort((a, b) => a.at - b.at), s };
    setScen({ id, label: def.label, done: false });
    setClock({ hour: 0, delivered: 1, trust: 1, lost: 0, running: true, done: false });
    e?.applyDyn(viewOf(m, s, true));
    /* the blows arrive in their own forms, a beat apart, and strike where they land */
    blows.forEach((b, i) => window.setTimeout(() => {
      eng.current?.launch(b.threat, b.stopped ? 'stopped' : 'landed', 900, () => eng.current?.strike(b.threat.target, b.stopped ? '#9fe8ff' : '#ff5d73'));
    }, still ? 0 : 160 + i * 140));
    setSaid(def.label + '. ' + def.line);
  }

  function endTour() {
    setTour(-1);
    try { localStorage.setItem(TOUR_KEY, String(Date.now())); } catch { /* storage blocked: the tour shows again next time */ }
  }

  /* a move from the map: the stack changes, the part answers, the forecast moves */
  function place(m: Move) {
    p.onPlace(m.id);
    eng.current?.cheer(m.where, '+' + hours(m.kept) + ' h kept');
    Sound.gratus();
    setSaid(m.name + ' added. ' + hours(m.kept) + ' hours of service kept.');
  }

  const node = picked ? g.system.nodes.find(n => n.id === picked) : null;
  const nodeThreats = node ? g.threats.filter(t => t.target === node.id) : [];
  const r = p.result;
  const partName = (id: string) => g.system.nodes.find(n => n.id === id)?.name || id;
  const moveLine = (m: Move) => {
    const th = m.threat ? g.threats.find(t => t.id === m.threat) : null;
    if (m.kind === 'breaker') return 'breaker into ' + partName(m.where);
    return (m.kind === 'layer' ? 'first layer on ' : 'second layer on ') + (th ? th.name.replace(/^Open problem: /, '') : partName(m.where));
  };
  const pct = (x: number) => Math.round(x * 100) + '%';
  const hours = fmtHours;
  const forWhom = people ? ' for ' + people : ' for the people it serves';
  const kept = Math.max(0, DAY - clock.lost);

  /* the day as a chart: service and trust, hour by hour */
  const chart = (() => {
    if (history.length < 2) return null;
    const W = 300, H = 56;
    const x = (h: number) => (h / DAY) * W;
    const y = (v: number) => H - 4 - v * (H - 8);
    const line = (key: 'delivered' | 'trust') => history.map((s, i) => (i ? 'L' : 'M') + x(s.hour).toFixed(1) + ' ' + y(s[key]).toFixed(1)).join(' ');
    return (
      <svg className="gw-chart" viewBox={'0 0 ' + W + ' ' + H} preserveAspectRatio="none" aria-label="Service and trust over the day">
        <line x1="0" y1={y(1)} x2={W} y2={y(1)} />
        <path className="trust" d={line('trust')} />
        <path className="service" d={line('delivered')} />
      </svg>
    );
  })();

  return (
    <div className="gw" role="dialog" aria-modal="true" aria-label={'The world of ' + g.title} data-band={p.bandIndex}>
      <div className="gw-canvas" ref={host} />
      {failed && (
        <div className="gw-fail">
          <p>This browser could not start the 3D world. The gauge works the same on the page.</p>
          <button className="btn" onClick={p.onExit}>Back to the gauge</button>
        </div>
      )}

      <header className="gw-top">
        <div className="gw-id">
          <span className="gw-kicker">Gauge · {g.org}</span>
          <h2>{g.title}</h2>
        </div>
        <div className="gw-notch" aria-live="polite">
          <span className="gw-n">{p.level}</span>
          <span className="gw-nt">
            <span className="gw-nt-title">{g.title}</span>
            <strong>{p.level === 0 ? 'Ground' : 'Notch ' + p.level + ' · ' + p.bandLabel}</strong>
            <span>Pressure {p.pressure.toFixed(2)}</span>
          </span>
        </div>
        <div className="gw-tools">
          <button className={'gw-btn' + (sysOpen ? ' on' : '')} onClick={() => setSysOpen(v => !v)} aria-pressed={sysOpen}>Systems</button>
          <button className={'gw-btn' + (keyOpen ? ' on' : '')} onClick={() => setKeyOpen(v => !v)} aria-pressed={keyOpen}>Key</button>
          <button className={'gw-btn' + (p.sound ? ' on' : '')} onClick={p.onToggleSound} aria-pressed={p.sound}>
            Sound {p.sound ? 'on' : 'off'}
          </button>
          <button ref={exitBtn} className="gw-btn" onClick={p.onExit} aria-label="Leave the world">Leave<span className="gw-long"> the world</span></button>
        </div>
      </header>

      {tour >= 0 && tour < TOUR.length && (
        <div className="gw-tour" role="dialog" aria-label="How the world works">
          <div className="gw-tour-card">
            <small className="gw-news-k">{tour + 1} of {TOUR.length}</small>
            <strong>{TOUR[tour].title}</strong>
            <p>{TOUR[tour].body}</p>
            <div className="row" style={{ gap: 8 }}>
              <button className="gw-btn gw-key" onClick={() => (tour + 1 < TOUR.length ? setTour(tour + 1) : endTour())}>{tour + 1 < TOUR.length ? 'Next' : 'Into the world'}</button>
              <button className="gw-btn" onClick={endTour}>Skip</button>
            </div>
          </div>
        </div>
      )}

      {sysOpen && (
        <aside className="gw-sys" aria-label="The system in motion">
          <div className="gw-card-head">
            <span>
              <small className="gw-news-k">Systems map</small>
              <strong>{clock.done ? 'The day is over' : clock.running ? 'Hour ' + Math.floor(clock.hour) + ' of ' + DAY : 'At rest'}</strong>
            </span>
            <button className="gw-x" onClick={() => setSysOpen(false)} aria-label="Fold the systems map away">×</button>
          </div>

          {p.phase === 'build' && !(scen && scen.id !== 'calm') ? (
            <div className="gw-hero">
              <strong>{hours(lev.base)}<small> h</small></strong>
              <span>of service lost on a stress day{forWhom}</span>
              {delta !== null && <em className={delta < 0 ? 'good' : 'bad'}>{delta < 0 ? '' : '+'}{hours(delta)} h</em>}
            </div>
          ) : (
            <div className="gw-hero">
              <strong>{hours(clock.done ? kept : Math.max(0, clock.hour - clock.lost))}<small> of {clock.done ? DAY : Math.floor(clock.hour)} h</small></strong>
              <span>{clock.done ? 'of service kept' : 'of service kept so far'}{forWhom}{scen && scen.id !== 'calm' ? ' · ' + scen.label.toLowerCase() : ''}</span>
            </div>
          )}
          <div className="gw-stock"><span>Service delivered</span><div className="gw-bar"><i style={{ width: pct(clock.delivered) }} /></div><strong>{pct(clock.delivered)}</strong></div>
          <div className="gw-stock"><span>Trust</span><div className="gw-bar trust"><i style={{ width: pct(clock.trust) }} /></div><strong>{pct(clock.trust)}</strong></div>
          {chart}

          {clock.done && (
            <>
              <span className="gw-card-l">The order of the fall</span>
              {Object.keys(fell).length === 0 ? (
                <p className="gw-sys-line">No part dropped under half its function. Every part held the day.</p>
              ) : (
                <ol className="gw-fall">
                  {Object.entries(fell).sort((a, b) => a[1] - b[1]).map(([id, h]) => (
                    <li key={id}><button onClick={() => eng.current?.focusOn(id)}><strong>{partName(id)}</strong><span>{model.kinds[id] === 'public' ? 'trust under half at hour ' : 'under half at hour '}{Math.floor(h)}</span></button></li>
                  ))}
                  <li className="held"><span>{model.nodes.length - Object.keys(fell).length} of {model.nodes.length} parts held the day</span></li>
                </ol>
              )}
            </>
          )}

          <span className="gw-card-l">Davara's reading</span>
          <ul className="gw-read">
            {reading.keystone && (
              <li><button onClick={() => frame('keystone')}><b className="gw-rd amber" aria-hidden />
                <span>Everything rests most on <strong>{partName(reading.keystone)}</strong>. When it fails, {(reading.reach[reading.keystone] || []).length} of the other {g.system.nodes.length - 1} parts lose what they need.</span></button></li>
            )}
            {reading.chokepoints.filter(c => c !== reading.keystone).length > 0 && (
              <li><button onClick={() => { const c = reading.chokepoints.filter(x => x !== reading.keystone)[0]; eng.current?.focusOn(c); }}><b className="gw-rd ice" aria-hidden />
                <span>Every path to the people runs through <strong>{reading.chokepoints.filter(c => c !== reading.keystone).map(partName).join(' and ')}</strong>. A second path there is worth more than a stronger wall.</span></button></li>
            )}
            {reading.fastest.length >= 2 && reading.fastestHours !== null && (
              <li><button onClick={() => frame('cascade')}><b className="gw-rd coral" aria-hidden />
                <span>The fastest cascade runs <strong>{reading.fastest.map(partName).join(', then ')}</strong>, and reaches the people in about {hours(reading.fastestHours)} {reading.fastestHours === 1 ? 'hour' : 'hours'}.</span></button></li>
            )}
            {reading.loops.length > 0 && (
              <li><button onClick={() => frame('above')}><b className="gw-rd violet" aria-hidden />
                <span><strong>{partName(reading.loops[0].from)}</strong> feeds back into <strong>{partName(reading.loops[0].to)}</strong>, so a loss there grows on each turn.</span></button></li>
            )}
          </ul>

          {p.phase === 'build' && (
            <>
              <span className="gw-card-l">Put it in a state</span>
              <ul className="gw-states">
                <li>
                  <button className={'gw-state gw-week' + (scen?.id === 'week' ? ' on' : '')} aria-pressed={scen?.id === 'week'} onClick={startWeek}>
                    <strong>A week of hardening</strong>
                    <span>Day one with your stack as it is. Each morning after, the move the last day says would keep the most.</span>
                  </button>
                </li>
                {STATES.filter(x => x.id !== 'keystone' || reading.keystone).map(x => (
                  <li key={x.id}>
                    <button className={'gw-state' + (scen?.id === x.id ? ' on' : '') + (x.id === 'adversary' ? ' extreme' : '')} aria-pressed={scen?.id === x.id} onClick={() => startState(x.id)}>
                      <strong>{x.label}</strong>
                      <span>{x.line}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="gw-sys-row">
            <span className="gw-card-l">Loops at work</span>
            <span className="gw-legend"><b className="gw-lk R">R</b> feeds itself · <b className="gw-lk B">B</b> pushes back</span>
          </div>
          <ul className="gw-loops">
            {loops.map(l => (
              <li key={l.id} className={l.active ? 'on' : ''}>
                <button onClick={() => eng.current?.focusLoop(l.id)}>
                  <b className={'gw-lk ' + l.kind}>{l.kind}</b>
                  <span><strong>{l.name}</strong>{!l.active && <em> · not running</em>}<small>{l.why}</small></span>
                </button>
              </li>
            ))}
          </ul>

          <span className="gw-card-l">Where to act next</span>
          {lev.moves.length === 0 ? (
            <p className="gw-sys-line">Nothing left in the catalog keeps more service here. Hold what you have, or answer an open problem with a MoTRUS model.</p>
          ) : (
            <ul className="gw-moves">
              {lev.moves.map(m => (
                <li key={m.id}>
                  <button className="gw-move" onClick={() => eng.current?.focusOn(m.where)}>
                    <strong>{m.name}</strong>
                    <span>{moveLine(m)} · {m.cost} budget · keeps {hours(m.kept)} h</span>
                  </button>
                  {p.phase === 'build' && (
                    <button className="gw-btn gw-add" disabled={m.cost > p.dyn.left} onClick={() => place(m)}
                      title={m.cost > p.dyn.left ? 'Over budget by ' + (m.cost - p.dyn.left) : 'Add it to the stack'}>Add</button>
                  )}
                </li>
              ))}
            </ul>
          )}
          {(p.phase !== 'build' || (scen && scen.id !== 'calm' && !scen.done)) && (
            <div className="gw-speed" role="group" aria-label="Speed">
              <button className={'gw-btn' + (speed === 1 ? ' on' : '')} onClick={() => setSpeed(1)} aria-pressed={speed === 1}>×1</button>
              <button className={'gw-btn' + (speed === 3 ? ' on' : '')} onClick={() => setSpeed(3)} aria-pressed={speed === 3}>×3</button>
            </div>
          )}
        </aside>
      )}

      {keyOpen && (
        <aside className="gw-keypanel" aria-label="How to read the map">
          <div className="gw-card-head">
            <span><small className="gw-news-k">Key</small><strong>How to read the map</strong></span>
            <button className="gw-x" onClick={() => setKeyOpen(false)} aria-label="Close the key">×</button>
          </div>
          <dl>
            <dt>A vessel with a level</dt><dd>A part of the system, shaped as the real thing. The level is the share of its function it still delivers.</dd>
            <dt>A pipe with light moving through it</dt><dd>A dependency. The light is what still reaches the part at the arrow's end. The bars across it are the delay: one for minutes, two for an hour, three for hours.</dd>
            <dt>A wheel on a pipe</dt><dd>A breaker in your stack. A failure upstream stops there.</dd>
            <dt>A cloud on the horizon</dt><dd>A threat, with the pressure it sends. The stream ends at the ring that holds it, or reaches the part when nothing does. Coral means nothing holds it, amber one layer, ice two or more.</dd>
            <dt>A ring around a part</dt><dd>A structure in your stack, in its family's form. Count the rings for depth.</dd>
            <dt>An amber column of light</dt><dd>The keystone: the part whose failure reaches the most, and the people first.</dd>
            <dt>A thin ring of ice at a part's foot</dt><dd>No way around: every path to the people runs through it.</dd>
            <dt>A coral path with a bead running it</dt><dd>The fastest cascade, from the keystone to the people, on the model's own delays.</dd>
            <dt>A dome of soft light</dt><dd>The people the system serves: the stock every flow on the map exists to reach.</dd>
            <dt>A pipe that rises into a high arc</dt><dd>A link that closes a feedback loop, carrying something back upstream.</dd>
            <dt>An arc with arrows, lettered R or B</dt><dd>A feedback loop at work. R feeds itself, B pushes back. Lit when it is running; dim when the stack has broken it or nothing starts it.</dd>
          </dl>
          <button className="gw-btn gw-keyguide" onClick={() => { p.onExit(); dispatch({ t: 'route', view: 'guides', id: 'sg-read-the-systems-map' }); }}>Read the guide to this map</button>
        </aside>
      )}

      {showNews && p.news && !newsOpen && (
        <button className="gw-news-pill" onClick={() => setNewsOpen(true)} aria-expanded="false">
          <span className="gw-news-k">{p.news.kicker}</span> · {p.news.title}
        </button>
      )}
      {showNews && p.news && newsOpen && (
        <aside className="gw-news" key={p.news.key} aria-label={p.news.kicker}>
          <div className="gw-card-head">
            <span>
              <small className="gw-news-k">{p.news.kicker}</small>
              <strong>{p.news.title}</strong>
            </span>
            <button className="gw-x" onClick={() => setNewsOpen(false)} aria-label="Fold the news away">×</button>
          </div>
          <p>{p.news.body}</p>
          {p.news.hits && <span className="gw-news-hits">Hits {p.news.hits}</span>}
          {p.news.weak && <p className="gw-news-weak"><strong>{p.news.weak.name} no longer holds.</strong> {p.news.weak.why}</p>}
          {p.news.band && <p className="gw-news-band">{p.news.band}</p>}
          {p.news.ceiling && <p className="gw-news-ceiling">This is the catalog ceiling for this path: every stack the catalog allows within this budget lets at least one threat through. From here, a hold needs a MoTRUS model of your own.</p>}
        </aside>
      )}

      {node && (
        <aside className="gw-card" aria-label={node.name}>
          <div className="gw-card-head">
            <span>
              <strong>{node.name}</strong>
              <small>{NODE_KIND_LABEL[node.kind]}{clock.running || clock.done ? ' · ' + pct(sim.current.health[node.id] ?? 1) + ' of its function' : ''}</small>
            </span>
            <button className="gw-x" onClick={() => setPicked(null)} aria-label="Close">×</button>
          </div>
          {nodeThreats.length === 0 ? <p>No threat is aimed here at this notch.</p> : (
            <ul className="gw-card-list">
              {nodeThreats.map(t => {
                const per = r?.perThreat.find(x => x.threat.id === t.id);
                const shown = per && p.phase !== 'build';
                const ok = per ? per.stoppedBy.length + per.motrus.length > 0 : false;
                return (
                  <li key={t.id} className={shown ? (ok ? 'ok' : 'lost') : ''}>
                    <strong>{t.name.replace(/^Open problem: /, '')}</strong>
                    <span>{shown ? (ok ? 'Stopped by ' + [...per!.stoppedBy, ...per!.motrus].map(p.name).join(', ') : 'Lands') : 'Weight ' + t.weight + ' of 3'}</span>
                  </li>
                );
              })}
            </ul>
          )}
          {model.edges.some(e => e.to === node.id) && (
            <>
              <span className="gw-card-l">Depends on</span>
              <ul className="gw-rings">
                {model.edges.filter(e => e.to === node.id).map(e => (
                  <li key={e.key}><i style={{ background: e.cutBy ? p.cutHue(e.cutBy) : '#9cc3ef' }} />{partName(e.from)} {e.how} it · {e.delay < 1 ? 'minutes' : e.delay + ' h'} to reach it{e.cutBy ? ' · cut by ' + p.name(e.cutBy) : ''}</li>
                ))}
              </ul>
            </>
          )}
          {(p.shields[node.id] || []).length > 0 && (
            <>
              <span className="gw-card-l">Rings around it</span>
              <ul className="gw-rings">
                {p.shields[node.id].map(s => (
                  <li key={s.id}><i style={{ background: s.motrus ? '#c4b5fd' : s.hue }} />{s.name}{s.motrus ? ' · MoTRUS' : ''}</li>
                ))}
              </ul>
            </>
          )}
        </aside>
      )}

      {verdict && r && (
        <div className={'gw-verdict ' + (r.verdict === 'holds' ? 'holds' : 'breached')}>
          <span className="gw-score">{r.score}<small>/100</small></span>
          <span className="gw-vt">
            <strong>{r.verdict === 'holds' ? 'The Stack Holds' : 'Breached'}{r.verdict === 'holds' && p.momentum >= 2 ? ' · ' + p.momentum + ' in a row' : ''}</strong>
            <span>Reference {p.refScore}{p.reward?.beatRef ? ' · matched or beaten' : ''}{r.fallen.length >= g.system.nodes.length ? ' · every part fell' : r.fallen.length ? ' · ' + r.fallen.length + ' fell' + (r.reached.length ? ', ' + r.reached.length + ' went down with ' + (r.fallen.length === 1 ? 'it' : 'them') : '. It did not spread') : ''}</span>
            <span className="gw-day">
              {clock.done
                ? 'You kept ' + hours(kept) + ' of ' + DAY + ' hours of service' + forWhom + '. Trust ended at ' + pct(clock.trust) + '.'
                : 'The day is still running: hour ' + Math.floor(clock.hour) + ', service at ' + pct(clock.delivered) + '.'}
            </span>
            {p.reward && p.reward.gratus > 0 && <span className="gw-gratus"><GratusSigil size={22} still /> +{p.reward.gratus} Gratus{p.reward.gold ? ' and Gratus Gold' : ''}</span>}
            {p.studied && <span className="gw-studied">{p.studied}</span>}
            {p.onReview && <button className="gw-btn gw-review" onClick={p.onReview}>Review with Claude</button>}
          </span>
        </div>
      )}

      {!verdict && (
        <nav className="gw-views" aria-label="Ways to see the system">
          {VIEWS.filter(v => (v.id !== 'keystone' || reading.keystone) && (v.id !== 'cascade' || reading.fastest.length >= 2)).map(v => (
            <button key={v.id} className={'gw-btn' + (frameName === v.id ? ' on' : '')} aria-pressed={frameName === v.id} onClick={() => frame(v.id)}>{v.label}</button>
          ))}
          <button className={'gw-btn gw-readbtn' + (readOn ? ' on' : '')} aria-pressed={readOn}
            onClick={() => { const next = !readOn; setReadOn(next); eng.current?.setReadingVisible(next); }}>Davara's reading</button>
        </nav>
      )}

      <footer className="gw-bottom">
        <span className="gw-budget"><strong>{p.spent}</strong>/{g.budget} budget · {p.structures} {p.structures === 1 ? 'structure' : 'structures'}{!p.canRun && p.phase === 'build' ? ' · build a stack to run it' : ''}</span>
        <div className="gw-actions">
          {p.phase === 'build' && (
            <>
              {p.canRun && <button className="gw-btn gw-key" onClick={p.onRun}>Run the gauge</button>}
              <button className="gw-btn gw-up" onClick={p.onUp}>Take It Up A Notch</button>
              <button className="gw-btn" onClick={p.onRebuild}>{p.canRun ? 'Edit the stack' : 'Build the stack'}</button>
            </>
          )}
          {p.phase === 'run' && <button className="gw-btn" onClick={p.onShowAll}>Show all</button>}
          {p.phase === 'result' && (
            <>
              <button className="gw-btn gw-up" onClick={p.onUp}>Take It Up A Notch</button>
              <button className="gw-btn" onClick={p.onRebuild}>Rebuild the stack</button>
            </>
          )}
        </div>
      </footer>
      <p className="gw-sr" aria-live="polite">{said}</p>
    </div>
  );
}
