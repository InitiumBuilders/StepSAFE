/* A Modux Gauge. Build a stack within the budget, run it against the
   adversary, then take it up a notch.

   Each notch adds a pressure and sometimes takes a structure away. From
   notch 2 the learner can mint MoTRUS models of their own. From notch 3 the
   system map opens and failures travel. From notch 5 the adversary picks
   each notch against the stack last run. From notch 7 open problems arrive
   that no catalog structure answers. */

import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { lazyLoad } from '../lib/lazyLoad';
import { createPortal } from 'react-dom';
import { MODUX_MODELS, ESSENCE_HEX } from '../content/registry';
import { studyRoute } from '../lib/study/session';
import {
  FAMILY_LABEL, FAMILY_HUE, TIER_LABEL, TIER_COST, BAND_LABEL, bandOf,
  COUPLING_FROM, ADAPTIVE_FROM, OPEN_FROM, MOTRUS_FROM, type ModuxFamily, type Band,
} from '../content/modux-schema';
import { GAUGES } from '../content/modux/gauges';
import { escalate, pickNext } from '../content/modux/escalate';
import {
  scoreGauge, referenceFor, linksAmong, MOTRUS_COST, MOTRUS_MAX_ANSWERS,
  type GaugeResult, type MotrusPlay,
} from '../content/modux/score';
import { isGoldNotch, type Reward } from '../content/modux/gratus';
import { forgeGauge, freshSeed } from '../content/modux/forge';
import { useS, type GoldMoment } from '../lib/state';
import { useEngine } from '../lib/engine';
import { useMotrus, reviewKey, type MotrusModel } from '../lib/motrus';
import { mindReady, reviewRun, reviewMotrus } from '../lib/gaugeMind';
import { Sound, soundOn, setSound } from '../lib/sound';
import { type ThreatState } from '../components/SystemMap';
import { SystemAtlas } from '../components/SystemAtlas';
import { NotchLadder } from '../components/NotchLadder';
import { GratusSigil, GoldRite } from '../components/Gratus';
import { MotrusMint } from '../components/MotrusMint';
import { chargeKeystone } from '../lib/swarm';
import { Field } from '../lib/field';
import { encodeGauge, gaugeUrl, encodeResult, resultUrl, recordFile, saveFile } from '../lib/share';
import { weekChallenge } from '../content/modux/week';
import { serviceRecord } from '../lib/service';
import { planText } from '../lib/plan';
import { peopleOf } from '../lib/people';
import { useBarOffset } from '../lib/barOffset';
import { useBackCloses } from '../lib/history';
import { Haptic } from '../lib/haptic';
import { buildModel, stressDay, leverage, fallOrder, dayRange, dayWords, fmtHours, type Move } from '../content/modux/dynamics';
import { ManyDays } from '../components/ManyDays';
import type { Shield } from '../world/GaugeWorld';
import { knownById } from '../content/modux/own';
import { RiseHead } from '../components/RiseHead';
import { emojiOf } from '../content/modux/emoji';
import { PhoneSelect } from '../components/bits';

/* three.js loads only when a learner enters the world */
const WorldView = lazyLoad(() => import('../world/WorldView'));

const hoursFmt = fmtHours;
/** the day as the verdict */
const dayVerdict = (kept: number) => kept >= 22 ? 'The Day Held' : kept >= 16 ? 'Most Of The Day Kept' : kept >= 8 ? 'Half The Day Lost' : 'The Day Was Lost';

const FAMILIES = Object.keys(FAMILY_LABEL) as ModuxFamily[];
const BAND_INDEX: Record<Band, number> = { ground: 0, hardened: 1, systemic: 2, wicked: 3, outlier: 4 };
const STEP_MS = [650, 600, 520, 440, 380];

/* What crossing into a band changes, said once when it happens. */
const BAND_ENTRY: Partial<Record<Band, string>> = {
  hardened: 'Each notch adds a pressure. The budget grows by less than the threat does.',
  systemic: 'The system map is live. A threat held by one structure is now played as if that structure failed, and the failure travels along every dependency your stack does not cut.',
  wicked: 'From here the adversary picks each notch against the stack you last ran.',
  outlier: 'Open problems arrive, and only a MoTRUS model can answer them.',
};

export function ModuxGaugeView() {
  const { s, d } = useS();
  const eng = useEngine();
  const vault = useMotrus();
  const byId = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  const base = GAUGES.find(g => g.id === s.route.id) || s.forged.find(g => g.id === s.route.id);
  const session = (base && s.gaugeSessions[base.id]) || { used: [] as string[], salt: 'one' };
  /* a gauge mapped from a known system, and the learner's own reading of it */
  const ownSpec = base ? s.ownSpecs[base.id] : undefined;
  const known = ownSpec?.known ? knownById(ownSpec.known) : undefined;

  const [stack, setStack] = useState<string[]>([]);
  const [phase, setPhase] = useState<'build' | 'run' | 'result'>('build');
  const [revealed, setRevealed] = useState(0);
  const [result, setResult] = useState<GaugeResult | null>(null);
  const [reward, setReward] = useState<Reward | null>(null);
  const [rite, setRite] = useState<GoldMoment | null>(null);
  const [family, setFamily] = useState<ModuxFamily | 'all'>('all');
  const [q, setQ] = useState('');
  const [open, setOpen] = useState<string | null>(null);
  /** the threat whose counters are open: picking starts from what is being held against */
  const [aim, setAim] = useState<string | null>(null);
  const [fresh, setFresh] = useState<string | null>(null);
  const [lastRun, setLastRun] = useState<string[]>([]);
  const [sound, setSoundState] = useState(soundOn());
  const [world, setWorld] = useState(false);
  /* everything that leaves the page goes through one row and one output */
  const [takeOut, setTakeOut] = useState<{ kind: 'plan' | 'result' | 'gauge' | 'file'; text: string; copied: boolean } | null>(null);
  const [shareBest, setShareBest] = useState(true);
  const week = useMemo(() => weekChallenge(), []);
  const worldRef = useRef(false);
  worldRef.current = world;
  /* MoTRUS: models minted for this gauge only live here and nowhere else */
  const [scratch, setScratch] = useState<MotrusModel[]>([]);
  const [claims, setClaims] = useState<Record<string, string[]>>({});
  const [minting, setMinting] = useState(false);
  const [reviewing, setReviewing] = useState<string | null>(null);
  const [runReview, setRunReview] = useState<{ text: string | null; error?: string; model?: string } | null>(null);
  const [runReviewBusy, setRunReviewBusy] = useState(false);
  const [stepMs, setStepMs] = useState(650);
  const finished = useRef(false);
  const runRef = useRef<HTMLElement | null>(null);
  const verdictRef = useRef<HTMLDivElement | null>(null);
  const notchRef = useRef<HTMLDivElement | null>(null);
  const timer = useRef<number | null>(null);
  /* on a narrower screen the app's bar sits on top: what the page scrolls to lands under the bar, not behind it */
  const rootRef = useRef<HTMLDivElement | null>(null);
  useBarOffset(rootRef, '--gx-bar', s.route.id);
  /* Back steps out of the world to the gauge under it */
  useBackCloses(world, () => leaveWorld(), 'world');

  /* leaving the gauge forgets every scratch model, by design */
  useEffect(() => {
    setStack([]); setPhase('build'); setRevealed(0); setResult(null); setReward(null);
    setScratch([]); setClaims({}); setMinting(false); setRunReview(null); setFresh(null); setLastRun([]); setWorld(false);
    finished.current = false;
    chargeKeystone(); window.scrollTo({ top: 0 });
    /* a build that asked for the world opens it once the page is up */
    if (s.route.sub === 'world') window.setTimeout(() => setWorld(true), 350);
    /* the week's pressure: the session starts at notch one with it on */
    if (s.route.sub && s.route.sub.startsWith('week:') && base) {
      const pid = s.route.sub.slice(5);
      const cur = s.gaugeSessions[base.id];
      if (!cur || cur.used[0] !== pid) d({ t: 'gauge-session', gaugeId: base.id, session: { used: [pid], salt: 'week' } });
    }
    setTakeOut(null);
  }, [s.route.id]);
  useEffect(() => () => {
    if (timer.current) window.clearInterval(timer.current);
    Sound.stopPulse();
  }, []);

  /* the page under the world does not scroll */
  useEffect(() => {
    if (!world) return;
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = 'hidden';
    /* toasts move to the top right while the world is open, clear of its controls */
    html.classList.add('gw-open');
    Field.pause();
    return () => { html.style.overflow = before; html.classList.remove('gw-open'); Field.resume(); };
  }, [world]);

  const esc = useMemo(() => base ? escalate(base, session.used) : null, [base, session.used]);
  const ref = useMemo(() => esc ? referenceFor(esc, byId) : null, [esc, byId]);
  const weakened = useMemo(() => new Set(esc ? esc.weakened.map(w => w.model) : []), [esc]);

  /* where the catalog stops holding on this path, if it has */
  const ceiling = useMemo(() => {
    if (!base || !esc) return null;
    for (let n = 0; n <= esc.level; n++) {
      const e = escalate(base, session.used.slice(0, n));
      if (referenceFor(e, byId).coverable === false) return n;
    }
    return null;
  }, [base, esc, session.used, byId]);

  /* the day on the page: the stress day this stack keeps, the moves that keep more, the order of the fall.
     Built from the same model the World runs, so the page and the world agree. */
  const claimsKey = JSON.stringify(claims);
  const day = useMemo(() => {
    if (!esc) return null;
    const dayPlays = Object.entries(claims).map(([id, answers]) => ({ id, name: id, answers }));
    const model = buildModel(esc.gauge, stack, byId, dayPlays, weakened);
    return { lost: stressDay(model), range: dayRange(model), fall: fallOrder(model), lev: leverage(esc.gauge, stack, byId, dayPlays, weakened, 3), parts: model.nodes.length };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [esc, stack, byId, claimsKey, weakened]);

  if (!base || !esc || !ref || !day) {
    return <div className="wrap mx"><div className="mx-empty">That gauge does not exist. Forged gauges you removed are gone.</div></div>;
  }

  const gauge = esc.gauge;
  const level = esc.level;
  const band = bandOf(level);
  const bandI = BAND_INDEX[band];
  const hue = ESSENCE_HEX[gauge.essence] || '#a78bff';
  const record = s.gauges[base.id];
  const levelRec = record?.levels[String(level)];
  const motrusOpen = level >= MOTRUS_FROM;
  const allMotrus = [...(vault.status === 'open' ? vault.models : []), ...scratch];
  const plays: MotrusPlay[] = Object.entries(claims)
    .map(([id, answers]) => ({ id, name: allMotrus.find(m => m.id === id)?.name || '', answers }))
    .filter(p => p.name);
  const spent = stack.reduce((n, id) => n + TIER_COST[byId.get(id)!.tier], 0) + plays.length * MOTRUS_COST;
  const left = gauge.budget - spent;
  const links = linksAmong(stack.filter(id => !weakened.has(id)), byId, 'combines');
  const tensions = linksAmong(stack.filter(id => !weakened.has(id)), byId, 'conflicts');
  const rk = reviewKey(base.id, level);
  const motrusSound = plays.every(p => allMotrus.find(m => m.id === p.id)?.reviews[rk]?.verdict === 'sound');
  const mind = mindReady(s.provider);
  const nodeName = (id: string) => gauge.system.nodes.find(n => n.id === id)?.name || id;
  const people = peopleOf(gauge.sector);
  const moveLine = (m: Move) => {
    const th = m.threat ? gauge.threats.find(t => t.id === m.threat) : null;
    if (m.kind === 'breaker') return 'breaker into ' + nodeName(m.where);
    return (m.kind === 'layer' ? 'first layer on ' : 'second layer on ') + (th ? th.name.replace(/^Open problem: /, '') : nodeName(m.where));
  };

  const ql = q.trim().toLowerCase();
  const pool = MODUX_MODELS.filter(m =>
    (family === 'all' || m.family === family) &&
    (!ql || (m.name + ' ' + m.statement + ' ' + m.defeats.join(' ')).toLowerCase().includes(ql)));

  /* the run, as a record anyone can read */
  const runRecord = () => ({
    by: s.codeName || s.handle || 'A practitioner', notch: level, score: result?.score ?? 0,
    hoursKept: Math.round(Math.max(0, 24 - day!.lost) * 10) / 10, held: result?.verdict === 'holds', stack, at: Date.now(),
  });
  async function out(kind: 'plan' | 'result' | 'gauge', text: string) {
    let copied = false;
    try { await navigator.clipboard.writeText(text); copied = true; } catch { copied = false; }
    setTakeOut({ kind, text, copied });
  }
  /* the run as a plan: plain text for a meeting */
  async function copyPlan() {
    await out('plan', planText({
      gauge, notch: level, stack, byId, lost: day!.lost, range: day!.range, fall: day!.fall, moves: day!.lev.moves, people,
      score: result?.score, verdict: result?.verdict, reference: ref!.result.score,
    }));
  }
  /* the run travels in a link: the gauge and this day, to a board */
  async function shareResult() {
    await out('result', resultUrl(await encodeResult(base!, runRecord())));
  }
  /* a forged gauge travels in a link: the gauge only, and the best day when asked */
  async function shareGauge() {
    const line = serviceRecord(s).lines.find(l => l.id === base!.id);
    const best = shareBest && line ? { notch: line.notch, hoursKept: Math.round(line.hoursKept * 10) / 10 } : undefined;
    await out('gauge', gaugeUrl(await encodeGauge(base!, { by: best ? (s.codeName || s.handle || 'A practitioner') : undefined, best })));
  }
  /* the open format: the gauge, or the gauge and this run, as a file */
  function downloadFile() {
    const slug = (base!.org + '-' + base!.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60);
    const withRun = phase === 'result' && !!result;
    saveFile(slug + (withRun ? '.run' : '.gauge') + '.json', recordFile(base!, withRun ? runRecord() : undefined));
    setTakeOut({ kind: 'file', text: '', copied: false });
  }
  const shareable = base ? base.origin === 'forged' || base.origin === 'opus' : false;
  const TAKE_NOTE: Record<'plan' | 'result' | 'gauge' | 'file', string> = {
    plan: 'The day, the fall, the threats, what is in place and where to act next, as plain text for a meeting.',
    result: 'A link with this gauge and this day: your name, the notch, the score, the hours kept and the stack. Whoever opens it is asked before it joins their board.',
    gauge: 'A link with the organisation, the parts and the threats. Your stack and your record stay with you. Whoever opens it is asked before it is added.',
    file: 'A file in the open StepSAFE format, described at /schema. Other tools can read it, and the hub can import it.',
  };
  const takeRow = (inResult: boolean) => (
    <div className="gx-take">
      <div className="gx-take-row">
        {inResult && <button className="btn btn-sm" onClick={copyPlan}>{takeOut?.kind === 'plan' && takeOut.copied ? 'Plan copied' : 'Copy the plan'}</button>}
        {inResult && <button className="btn btn-sm" onClick={shareResult}>{takeOut?.kind === 'result' && takeOut.copied ? 'Result link copied' : 'Share my result'}</button>}
        {shareable && <button className="btn btn-sm btn-ghost" onClick={shareGauge}>{takeOut?.kind === 'gauge' && takeOut.copied ? 'Gauge link copied' : 'Share this gauge'}</button>}
        {(shareable || inResult) && <button className="btn btn-sm btn-ghost" onClick={downloadFile}>{inResult ? 'Download the run' : 'Download the gauge'}</button>}
        {shareable && record?.held && (
          <label className="gx-sharebest">
            <input type="checkbox" checked={shareBest} onChange={e => { setShareBest(e.target.checked); setTakeOut(null); }} />
            <span>With a gauge link, include your name and best held day</span>
          </label>
        )}
      </div>
      {takeOut && (
        <div className="gx-take-out">
          <span className="sec">{takeOut.copied ? 'Copied. ' : ''}{TAKE_NOTE[takeOut.kind]}</span>
          {takeOut.text && !takeOut.copied && (takeOut.kind === 'plan'
            ? <textarea readOnly value={takeOut.text} rows={10} aria-label="The plan" onFocus={e => e.currentTarget.select()} />
            : <input readOnly value={takeOut.text} aria-label="The link" onFocus={e => e.currentTarget.select()} />)}
        </div>
      )}
    </div>
  );
  function toggle(id: string) {
    Haptic.tap();
    setStack(cur => cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id]);
  }
  function toggleMotrus(id: string) {
    setClaims(cur => {
      const next = { ...cur };
      if (next[id]) delete next[id]; else next[id] = [];
      return next;
    });
  }
  function toggleClaim(mid: string, tid: string) {
    setClaims(cur => {
      const have = cur[mid] || [];
      const on = have.includes(tid);
      if (!on && have.length >= MOTRUS_MAX_ANSWERS) return cur;
      return { ...cur, [mid]: on ? have.filter(x => x !== tid) : [...have, tid] };
    });
  }
  function toggleSound() {
    const next = !sound;
    setSound(next); setSoundState(next);
    if (next && worldRef.current) Sound.score(bandI, phase === 'run' ? 'run' : 'bed');
  }

  function enterWorld() {
    setWorld(true);
    Sound.score(bandI, phase === 'run' ? 'run' : 'bed');
  }
  function leaveWorld() {
    setWorld(false);
    if (phase !== 'run') Sound.scoreStop(900);
  }

  /* ---------- notches ---------- */

  function setSession(used: string[], salt = session.salt) {
    d({ t: 'gauge-session', gaugeId: base!.id, session: used.length ? { used, salt } : null });
  }

  function upANotch() {
    const studied = lastRun.length ? lastRun : stack;
    const p = pickNext(base!, session.used, studied, session.salt);
    if (!p) return;
    const used = [...session.used, p.id];
    setSession(used);
    const nextBand = bandOf(used.length);
    Sound.notch(BAND_INDEX[nextBand]);
    if (worldRef.current) Sound.score(BAND_INDEX[nextBand], 'bed');
    const e = escalate(base!, used);
    const t = e.gauge.threats[e.gauge.threats.length - 1];
    setFresh(t?.target || null);
    setPhase('build'); setResult(null); setReward(null); setRunReview(null); finished.current = false;
    if (!worldRef.current) requestAnimationFrame(() => notchRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
  }
  /* back to building, at the threats, which is where picking starts */
  function rebuild() {
    setPhase('build'); setResult(null); setReward(null);
    const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => runRef.current?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }));
  }
  /* from a threat that landed, straight to the structures that hold it */
  function mend(id: string) {
    setPhase('build'); setResult(null); setReward(null); setAim(id);
    const calm = document.documentElement.dataset.motion === 'calm' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    requestAnimationFrame(() => rootRef.current?.querySelector('[data-threat="' + id + '"]')?.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'start' }));
  }
  function swapNotch() {
    if (!session.used.length) return;
    const prior = session.used.slice(0, -1);
    const salt = freshSeed();
    const p = pickNext(base!, prior, lastRun.length ? lastRun : stack, salt);
    if (!p) return;
    setSession([...prior, p.id], salt);
    Sound.notch(bandI);
    setPhase('build'); setResult(null); setReward(null); setRunReview(null);
  }
  function stepDown() {
    setSession(session.used.slice(0, -1));
    setPhase('build'); setResult(null); setReward(null); setRunReview(null); setFresh(null);
  }
  function toGround() {
    setSession([]);
    setPhase('build'); setResult(null); setReward(null); setRunReview(null); setFresh(null);
  }
  function reforge() {
    if (base!.origin !== 'forged') return;
    const g = forgeGauge(freshSeed(), byId);
    if (!g) return;
    d({ t: 'forge-remove', id: base!.id });
    d({ t: 'forge-add', gauge: g });
    d({ t: 'route', view: 'modux-gauge', id: g.id });
  }

  /* ---------- the run ---------- */

  function run() {
    const r = scoreGauge(gauge, stack, byId, { weakened, motrus: plays, coupling: esc!.coupling });
    setResult(r); setRevealed(0); setPhase('run'); setReward(null); setRunReview(null);
    setLastRun(stack); setFresh(null);
    finished.current = false;
    const inWorld = worldRef.current;
    if (!inWorld) requestAnimationFrame(() => runRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }));
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { finish(r, gauge.threats.length); return; }
    Sound.startPulse(bandI);
    /* inside the world each threat lands on the score's beat: two beats apart, one when there are many */
    const step = inWorld ? Sound.beatMs(bandI) * (gauge.threats.length > 8 ? 1 : 2) : STEP_MS[bandI];
    setStepMs(step);
    const begin = () => {
      let n = 0;
      timer.current = window.setInterval(() => {
        const i = n;
        n += 1;
        setRevealed(n);
        const per = r.perThreat[i];
        /* in the world the threat sounds when its comet lands */
        if (per && !worldRef.current) Sound.threat(per.stoppedBy.length + per.motrus.length > 0);
        if (n >= gauge.threats.length) {
          if (timer.current) window.clearInterval(timer.current);
          timer.current = null;
          window.setTimeout(() => finish(r, n), worldRef.current ? step : 450);
        }
      }, step);
    };
    if (inWorld) window.setTimeout(begin, Sound.untilNextBeat()); else begin();
  }

  function finish(r: GaugeResult, n: number) {
    setRevealed(n);
    setPhase('result');
    Sound.stopPulse();
    if (finished.current) return;
    finished.current = true;
    const rw = eng.finishGauge({
      gauge: { ...gauge, id: base!.id, title: base!.title, origin: base!.origin, seed: base!.seed },
      notch: level, result: r, ref: ref!, stack, motrusCount: plays.length, motrusSound, weakened: [...weakened], seed: base!.seed,
      week: base!.id === week.gauge.id && level >= 1 && session.used[0] === week.pressure.id ? week.key : undefined,
    });
    setReward(rw);
    Sound.verdict(r.verdict === 'holds');
    if (worldRef.current) window.setTimeout(() => { if (worldRef.current) Sound.score(bandI, 'bed'); }, 1600);
    if (rw.gold) {
      const moment: GoldMoment = { gauge: base!.id, title: base!.title, notch: level, score: r.score, ref: ref!.result.score, at: Date.now(), why: rw.gold };
      /* in the world the gold column rises first, then the rite */
      window.setTimeout(() => { setRite(moment); Sound.gold(); }, worldRef.current ? 3200 : 900);
    } else if (rw.gratus > 0) {
      window.setTimeout(() => Sound.gratus(), 700);
    }
    if (!worldRef.current) window.setTimeout(() => verdictRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }

  function showAll() {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    if (result) finish(result, gauge.threats.length);
  }

  /* ---------- Claude ---------- */

  async function doReviewRun() {
    if (!result) return;
    setRunReviewBusy(true);
    const r = await reviewRun(s.provider, {
      gauge, notch: level, band: BAND_LABEL[band], result, refScore: ref!.result.score, stack,
      motrus: plays.map(p => allMotrus.find(m => m.id === p.id)!).filter(Boolean), byId,
    });
    setRunReview(r);
    setRunReviewBusy(false);
  }

  async function doReviewMotrus(m: MotrusModel) {
    setReviewing(m.id);
    const claimed = (claims[m.id] || []).map(id => gauge.threats.find(t => t.id === id)!).filter(Boolean);
    const r = await reviewMotrus(s.provider, { model: m, gauge, notch: level, band: BAND_LABEL[band], claims: claimed });
    if (r.review) {
      const next = { ...m, reviews: { ...m.reviews, [rk]: r.review } };
      if (m.kept) await vault.put(next);
      else setScratch(cur => cur.map(x => x.id === m.id ? next : x));
    } else {
      const next = { ...m, reviews: { ...m.reviews, [rk + ':error']: { verdict: 'unsound' as const, text: r.error || 'No reply.', at: Date.now() } } };
      if (!m.kept) setScratch(cur => cur.map(x => x.id === m.id ? next : x));
      window.alert('The review did not come back: ' + (r.error || 'no reply') + '.');
    }
    setReviewing(null);
  }

  const nextGauge = GAUGES[(GAUGES.findIndex(t => t.id === base.id) + 1) % GAUGES.length];
  const threatState: Record<string, ThreatState> = {};
  gauge.threats.forEach((t, i) => {
    if (phase === 'build') threatState[t.id] = 'idle';
    else if (i >= revealed) threatState[t.id] = 'pending';
    else {
      const per = result?.perThreat[i];
      threatState[t.id] = per && per.stoppedBy.length + per.motrus.length > 0 ? 'stopped' : 'landed';
    }
  });
  const newest = esc.added[esc.added.length - 1];
  /* a threat the stack holds already, by the rule the run uses: a counter in the stack that still holds at this
     notch, or a MoTRUS claim. The cards and the dock show it while the stack is built. */
  const heldNow = (t: (typeof gauge.threats)[number]) =>
    t.counters.some(id => byId.has(id) && stack.includes(id) && !weakened.has(id)) || plays.some(p => p.answers.includes(t.id));
  const heldCount = gauge.threats.filter(heldNow).length;

  /* the rings around each part in the world: every structure in the stack
     that stops a threat aimed at it, and every MoTRUS claim on one */
  const shields: Record<string, Shield[]> = {};
  for (const t of gauge.threats) {
    const list = shields[t.target] || (shields[t.target] = []);
    for (const id of t.counters) {
      if (!stack.includes(id) || weakened.has(id) || list.some(x => x.id === id)) continue;
      const m = byId.get(id);
      if (m) list.push({ id, name: m.name, hue: ESSENCE_HEX[FAMILY_HUE[m.family]], family: m.family, tier: m.tier });
    }
    for (const p of plays) if (p.answers.includes(t.id) && !list.some(x => x.id === p.id)) list.push({ id: p.id, name: p.name, hue: '#c4b5fd', motrus: true });
  }
  const prevBand = level > 0 ? bandOf(level - 1) : band;
  const crossed = level > 0 && prevBand !== band ? BAND_ENTRY[band] : null;
  const atCeiling = ceiling !== null && ceiling === level;

  /* what the World says after a notch: the same facts the page shows above the threats */
  const worldNews = level > 0 && newest ? {
    key: level + ':' + newest.id,
    kicker: 'New at notch ' + level + (newest.open ? ' · open problem' : ''),
    title: newest.open ? newest.name.replace(/^Open problem: /, '') : newest.name,
    body: newest.move,
    hits: newest.open ? null : nodeName(gauge.threats[gauge.threats.length - 1].target),
    weak: newest.weakens ? { name: byId.get(newest.weakens.model)?.name || '', why: newest.weakens.why } : null,
    band: crossed || null,
    ceiling: atCeiling,
  } : null;
  const studied = level >= ADAPTIVE_FROM - 1 && result && result.load[0]
    ? 'They studied your stack. ' + (byId.get(result.load[0].model)?.name || '') + ' carried the most weight alone. The next notch is chosen against what you ran.'
    : null;
  /* pressure: total threat weight per point of budget. It rises with every notch,
     which the score alone cannot show, since the score measures fit, not difficulty */
  const pressureOf = (g: typeof gauge) => g.threats.reduce((n, t) => n + t.weight, 0) / g.budget;
  const pressure = pressureOf(gauge);
  const groundPressure = pressureOf(base);

  return (
    <div className="wrap-wide mx gx" data-band={band} ref={rootRef}>
      <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
        <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'modux', sub: 'gauges' })}>← Gauges</button>
        <button className={'btn btn-ghost btn-sm gx-sound' + (sound ? ' on' : '')} onClick={toggleSound} aria-pressed={sound}>
          Sound {sound ? 'on' : 'off'}
        </button>
      </div>

      <section className="mx-hero mx-glass mx-lit gx-hero" style={{ ['--hue' as string]: hue }} data-keystone data-essence={hue}>
        <div className="mx-hero-text">
          <span className="mx-kicker">Gauge · {gauge.org}{base.seed === 'own' ? (known ? ' · a known system' : ' · your system') : base.seed === 'shared' ? ' · shared with you' : base.origin === 'forged' ? ' · forged' : base.origin === 'opus' ? ' · forged by Claude' : ''}</span>
          <RiseHead text={gauge.title} />
          <p className="lede">{gauge.brief}</p>
          <p className="sec" style={{ margin: 0 }}><strong>Adversary:</strong> {gauge.adversary}</p>
        </div>
        <div className="mx-tiles mx-tiles-4">
          <div className="mx-tile"><span className={'mx-tile-val' + (left < 0 ? ' warm' : '')}>{spent}<span className="mx-tile-of">/{gauge.budget}</span></span><span className="mx-tile-label">budget spent</span></div>
          <div className="mx-tile"><span className="mx-tile-val">{gauge.threats.length}</span><span className="mx-tile-label">threats</span></div>
          <div className="mx-tile"><span className="mx-tile-val lilac">{ref.result.score}</span><span className="mx-tile-label">{ref.by === 'authored' ? 'reference' : 'reference by search'}</span></div>
          <div className="mx-tile"><span className={'mx-tile-val' + (levelRec?.beatRef ? ' warm' : '')}>{levelRec ? levelRec.best : 'none'}</span><span className="mx-tile-label">your best here</span></div>
        </div>
      </section>

      {/* ---------- the notch ---------- */}
      <section className="gx-notch mx-glass" ref={notchRef} style={{ scrollMarginTop: 'calc(var(--gx-bar, 0px) + 16px)' }}>
        <div className="gx-notch-head">
          <div className="gx-level" aria-live="polite">
            <span className="gx-level-n">{level}</span>
            <span className="gx-level-t">
              <strong>{level === 0 ? 'Ground' : 'Notch ' + level}</strong>
              <span>{level === 0 ? 'The scenario as written' : BAND_LABEL[band] + ' · taken up ' + level + (level === 1 ? ' notch' : ' notches')}</span>
              <span className="gx-pressure-n" title="Total threat weight per point of budget">
                Pressure <strong>{pressure.toFixed(2)}</strong>{level > 0 ? ' · Ground was ' + groundPressure.toFixed(2) : ''}
              </span>
            </span>
          </div>
          <div className="gx-notch-actions">
            <button className="btn btn-key gx-up" onClick={upANotch} disabled={phase === 'run'}>Take It Up A Notch</button>
            <button className="btn gx-enter" onClick={enterWorld}>Enter the world</button>
            {level > 0 && <button className="btn btn-sm" onClick={swapNotch} disabled={phase === 'run'}>Swap notch</button>}
            {level > 0 && <button className="btn btn-ghost btn-sm" onClick={stepDown} disabled={phase === 'run'}>Step down</button>}
            {level > 1 && <button className="btn btn-ghost btn-sm" onClick={toGround} disabled={phase === 'run'}>To Ground</button>}
            {base.origin === 'forged' && base.seed !== 'own' && base.seed !== 'shared' && <button className="btn btn-ghost btn-sm" onClick={reforge} disabled={phase === 'run'}>Forge a different one</button>}
            {base.seed === 'own' && <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'modux', sub: 'gauges', id: 'edit:' + base.id })} disabled={phase === 'run'}>Edit the map</button>}
          </div>
          {s.sharedNotes[base.id] && (
            <p className="gx-band-note">Shared by <strong>{s.sharedNotes[base.id].by}</strong>, who held it for about {Math.round(s.sharedNotes[base.id].hoursKept)} of 24 hours{s.sharedNotes[base.id].notch ? ' at notch ' + s.sharedNotes[base.id].notch : ' at Ground'}.</p>
          )}
          {phase !== 'result' && shareable && takeRow(false)}
        </div>
        <NotchLadder level={level} levels={record?.levels || {}} ceiling={ceiling} />

        {newest && (
          <div className="gx-pressure" key={newest.id}>
            <span className="tr-detail-label">New at notch {level}{newest.open ? ' · open problem' : ''}</span>
            <strong>{newest.open ? newest.name.replace(/^Open problem: /, '') : newest.name}</strong>
            <p>{newest.move}</p>
            {!newest.open && <span className="gx-pressure-meta">Hits {nodeName(gauge.threats[gauge.threats.length - 1].target)}</span>}
            {newest.weakens && (
              <p className="gx-weak"><strong>{byId.get(newest.weakens.model)?.name} no longer holds.</strong> {newest.weakens.why}</p>
            )}
          </div>
        )}
        {crossed && <p className="gx-band-note">{crossed}</p>}
        {atCeiling && (
          <p className="gx-band-note ceiling">
            This is the catalog ceiling for this path. An exact search over all 96 models shows that every catalog stack within this budget lets at least one threat through. From here, a hold needs a MoTRUS model of your own.
          </p>
        )}
        {esc.weakened.length > 0 && (
          <div className="gx-dead">
            <span className="tr-detail-label">No longer holds at this notch</span>
            <ul>{esc.weakened.map(w => <li key={w.model}><strong>{byId.get(w.model)?.name}</strong> {w.why}</li>)}</ul>
          </div>
        )}
        {level >= ADAPTIVE_FROM - 1 && result && result.load[0] && phase === 'result' && (
          <p className="gx-band-note">
            They studied your stack. {byId.get(result.load[0].model)?.name} carried the most weight alone. The next notch is chosen against what you ran.
          </p>
        )}
        {isGoldNotch(level) && !levelRec?.gold && (
          <p className="gx-gold-note"><GratusSigil gold size={22} still /> Gratus Gold is open at this notch: hold it at or above the reference, every catalog threat stopped by a catalog structure.</p>
        )}
      </section>

      {/* ---------- the board: runs that came back by link ---------- */}
      {(s.boards[base.id] || []).length > 0 && (
        <section className="mx-section">
          <h2>The Board</h2>
          <p className="sec" style={{ marginTop: 0 }}>Runs on this gauge that came to you by link, best day first. Load a stack to study it or to build on it.</p>
          <ul className="gx-board">
            {[...s.boards[base.id]].sort((a, b) => b.hoursKept - a.hoursKept || b.score - a.score).map((r, i) => (
              <li key={r.by + r.at} className={r.held ? 'held' : ''}>
                <span className="gx-board-rank">{i + 1}</span>
                <span className="gx-board-who"><strong>{r.by}</strong><small>{new Date(r.at).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}{r.notch ? ' · notch ' + r.notch : ' · Ground'}</small></span>
                <span className="gx-board-num"><strong>{Math.round(r.hoursKept)}</strong><small>of 24 h</small></span>
                <span className="gx-board-num"><strong>{r.score}</strong><small>{r.held ? 'held' : 'breached'}</small></span>
                <span className="gx-board-fams">{[...new Set(r.stack.map(id => byId.get(id)?.family).filter(Boolean))].map(f => FAMILY_LABEL[f as keyof typeof FAMILY_LABEL]).join(', ') || 'no catalog structures'}</span>
                {phase === 'build' && r.stack.length > 0 && <button className="btn btn-sm" onClick={() => setStack(r.stack.filter(id => byId.has(id)))}>Load this stack</button>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ---------- the system map ---------- */}
      {esc.coupling && (
        <section className="mx-section">
          <h2>The System</h2>
          {phase === 'result' && result && (
            <p className="sec" style={{ marginTop: 0 }}>
              {(result.fallen.length >= gauge.system.nodes.length ? 'Every part fell.' : result.fallen.length
                ? result.fallen.length + (result.fallen.length === 1 ? ' part fell' : ' parts fell') +
                  (result.reached.length ? ' and ' + result.reached.length + ' more went down with ' + (result.fallen.length === 1 ? 'it.' : 'them.') : '. The failures did not spread.')
                : 'Nothing fell.') + (result.cuts.length ? ' Your stack cut ' + result.cuts.length + (result.cuts.length === 1 ? ' dependency.' : ' dependencies.') : '')}
            </p>
          )}
          <SystemAtlas system={gauge.system} threats={gauge.threats} state={threatState} gauge={gauge} byId={byId}
            fallen={phase === 'result' ? result?.fallen : []} reached={phase === 'result' ? result?.reached : []}
            cuts={phase === 'result' ? result?.cuts : []} fresh={fresh}
            cutName={id => byId.get(id)?.name || id} reading={phase === 'build'} rateMoves={false} label={gauge.title} />
        </section>
      )}

      {/* ---------- the threats ---------- */}
      <section className="mx-section" ref={runRef} style={{ scrollMarginTop: 'calc(var(--gx-bar, 0px) + 16px)' }}>
        <h2>{phase === 'build' ? 'What They Will Try' : 'The Run'}</h2>
        {phase === 'build' && (
          <button className="btn btn-sm btn-ghost" style={{ marginBottom: 12 }}
            onClick={() => studyRoute(d, gauge.threats.flatMap(t => t.counters.map(c => 'model:' + c)), gauge.title, s.unitiaC)}>
            Study its structures in StudyMode
          </button>
        )}
        {phase === 'run' && <button className="btn btn-sm" style={{ marginBottom: 12 }} onClick={showAll}>Show all</button>}
        <ol className="tr-threats">
          {gauge.threats.map((th, i) => {
            const shown = phase !== 'build' && i < revealed;
            const per = result?.perThreat[i];
            const layers = per ? per.stoppedBy.length + per.motrus.length : 0;
            const isNew = !!th.pressure;
            return (
              <li key={th.id} data-threat={th.id}
                className={'tr-threat' + (phase !== 'build' && !shown ? ' pending' : '') + (shown && layers ? ' stopped' : '') +
                  (shown && per && !layers ? ' landed' : '') + (th.open ? ' gx-open' : '') + (newest && th.id === newest.id && phase === 'build' ? ' gx-fresh' : '') +
                  (phase === 'build' && heldNow(th) ? ' gx-covered' : '')}>
                <div className="tr-threat-head">
                  <span className="tr-threat-name">
                    {th.open ? th.name.replace(/^Open problem: /, '') : th.name}
                    {th.open && <span className="gx-tag open">Open problem</span>}
                    {isNew && !th.open && <span className="gx-tag">Notch</span>}
                  </span>
                  <span className="tr-weight" aria-label={'Weight ' + th.weight + ' of 3'}>
                    {[1, 2, 3].map(k => <i key={k} className={k <= th.weight ? 'on' : undefined} />)}
                  </span>
                </div>
                <p className="tr-threat-move">{th.move}</p>
                {esc.coupling && <span className="gx-target">{nodeName(th.target)}</span>}
                {/* picking starts here: what in the stack already holds this threat (the same rule the run uses),
                    and the structures that can, each with its cost */}
                {phase === 'build' && (() => {
                  const can = th.counters.filter(id => byId.has(id));
                  const holding = [...can.filter(id => stack.includes(id) && !weakened.has(id)).map(id => byId.get(id)!.name),
                    ...plays.filter(p => p.answers.includes(th.id)).map(p => p.name + ' · MoTRUS')];
                  const isAim = aim === th.id;
                  return (
                    <div className="gx-hold">
                      <p className={'gx-hold-line' + (holding.length ? ' held' : '')}>
                        {holding.length ? 'Held by ' + holding.join(', ') : 'Nothing in its way yet'}
                      </p>
                      {can.length === 0 ? (
                        <p className="gx-hold-note">No catalog structure holds this. A MoTRUS model of your own can claim it.</p>
                      ) : (
                        <button className="gx-hold-open" aria-expanded={isAim} onClick={() => setAim(isAim ? null : th.id)}>
                          What holds it <b>{can.length}</b>
                          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden><path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </button>
                      )}
                      {isAim && (
                        <ul className="gx-hold-list">
                          {can.map(id => {
                            const m = byId.get(id)!;
                            const inStack = stack.includes(id), dead = weakened.has(id), cost = TIER_COST[m.tier];
                            const tooDear = !inStack && cost > left;
                            return (
                              <li key={id} className={'gx-hold-item' + (inStack ? ' in' : '') + (dead ? ' gx-deadm' : '')}
                                style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[m.family]] }}>
                                <span className="gx-hold-name">
                                  <strong><span className="mt-e gx-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</strong>
                                  <small>{dead ? 'No longer holds at this notch' : FAMILY_LABEL[m.family] + ' · costs ' + cost}</small>
                                </span>
                                <button className={'tr-add' + (inStack ? ' in' : '')} disabled={tooDear || (dead && !inStack)}
                                  onClick={() => toggle(id)} aria-label={(inStack ? 'Remove ' : 'Add ') + m.name}>
                                  {inStack ? 'Remove' : tooDear ? 'Over' : 'Add'}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>
                  );
                })()}
                {shown && per && (
                  <div className="tr-outcome">
                    {layers > 0 ? (
                      <>
                        <span className="tr-outcome-label">Stopped by</span>
                        {per.stoppedBy.map(id => (
                          <span key={id} className="tr-stopper" style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[byId.get(id)!.family]] }}>
                            {byId.get(id)!.name}
                          </span>
                        ))}
                        {per.motrus.map(id => (
                          <span key={id} className="tr-stopper gx-mt">{allMotrus.find(m => m.id === id)?.name} · MoTRUS</span>
                        ))}
                      </>
                    ) : (
                      <>
                        <span className="tr-outcome-label tr-lands">Lands</span>
                        {phase === 'result' && th.counters.some(id => byId.has(id)) && (
                          <button className="tr-add gx-mend" onClick={() => mend(th.id)}>See what holds it</button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {/* ---------- result ---------- */}
      {phase === 'result' && result && (
        <section className="mx-section">
          <div ref={verdictRef} className={'tr-verdict mx-glass' + (24 - day.lost >= 16 ? ' holds' : ' breached') + (reward?.gold ? ' gx-gold' : '')}>
            <div className="tr-score">
              <span className="tr-score-val">{result.score}</span>
              <span className="tr-score-of">/100</span>
            </div>
            <div className="tr-verdict-text">
              <h2 style={{ margin: 0 }}>{dayVerdict(24 - day.lost)}</h2>
              <p className="sec gx-dayline">This stack keeps <strong>{dayWords(day.range)}</strong> of service{people ? ' for ' + people : ''}: the stress day first, the spread day second. <button className="term-link" onClick={() => d({ t: 'route', view: 'guides', id: 'sg-the-model-written-down' })}>How these hours are counted</button></p>
              <p className="sec" style={{ margin: '6px 0 0' }}>
                {result.verdict === 'holds' ? 'Held: every threat met a structure.' : result.landed + (result.landed === 1 ? ' threat landed with nothing in its way.' : ' threats landed with nothing in their way.')}
                {' '}Score {result.score} against a reference of {ref.result.score}.
                {reward?.beatRef ? ' You matched or beat it.' : ''}
              </p>
              {reward && reward.gratus > 0 && (
                <p className="gx-earned"><GratusSigil size={28} /> +{reward.gratus} Gratus{reward.gold ? ' and Gratus Gold' : ''}</p>
              )}
              {reward?.goldBlocked && <p className="sec gx-blocked">{reward.goldBlocked}</p>}
            </div>
          </div>

          <div className={'mx-tiles ' + (result.max.containment ? 'mx-tiles-4' : 'mx-tiles-3')} style={{ marginTop: 14 }}>
            <div className="mx-tile"><span className="mx-tile-val">{result.coverage}<span className="mx-tile-of">/{result.max.coverage}</span></span><span className="mx-tile-label">coverage</span></div>
            <div className="mx-tile"><span className="mx-tile-val">{result.depth}<span className="mx-tile-of">/{result.max.depth}</span></span><span className="mx-tile-label">depth</span></div>
            <div className="mx-tile"><span className="mx-tile-val lilac">{result.synergy}<span className="mx-tile-of">/{result.max.synergy}</span></span><span className="mx-tile-label">compounding</span></div>
            {result.max.containment > 0 && (
              <div className="mx-tile"><span className="mx-tile-val">{result.containment}<span className="mx-tile-of">/{result.max.containment}</span></span><span className="mx-tile-label">containment</span></div>
            )}
          </div>

          {/* the one next action, in reach: a hold goes up a notch, a breach goes back to the threats */}
          <div className="row gx-next" style={{ marginTop: 14 }}>
            {result.verdict === 'holds'
              ? <button className="btn btn-key gx-up" onClick={upANotch}>Take It Up A Notch</button>
              : <button className="btn btn-key" onClick={rebuild}>Rebuild</button>}
          </div>

          {takeRow(true)}

          <div className="tr-block">
            <h3>The Order Of The Fall</h3>
            {day.fall.every(f => f.hour === null) ? (
              <p className="sec" style={{ margin: 0 }}>No part dropped under half its function. Every part held the day.</p>
            ) : (
              <ol className="tr-fall">
                {day.fall.filter(f => f.hour !== null).map(f => (
                  <li key={f.id}><strong>{nodeName(f.id)}</strong><span>{f.kind === 'public' ? 'trust under half by hour ' : 'under half by hour '}{Math.round(f.hour as number)}</span></li>
                ))}
                <li className="held"><span>{day.fall.filter(f => f.hour === null).length} of {day.parts} parts held the day</span></li>
              </ol>
            )}
          </div>

          <ManyDays gauge={gauge} stack={stack} byId={byId} plays={Object.entries(claims).map(([id, answers]) => ({ id, name: id, answers }))} weakened={weakened} nameOf={nodeName} />

          <div className="tr-block">
            <h3>The Systems Read</h3>
            <ul className="tr-links">
              {result.load.slice(0, 3).map(l => {
                const alone = result.perThreat.filter(p => p.stoppedBy.length === 1 && !p.motrus.length && p.stoppedBy[0] === l.model);
                return (
                  <li key={l.model}>
                    <strong>{byId.get(l.model)!.name} is load bearing</strong>
                    <span>It alone stops {alone.map(p => p.threat.name).join(', ')}. If it fails, {alone.length === 1 ? 'that threat lands' : 'those ' + alone.length + ' threats land'}.</span>
                  </li>
                );
              })}
              {esc.coupling && result.ifFails.slice(0, 2).filter(f => f.lost > 1).map(f => {
                const t = gauge.threats.find(x => x.id === f.threat)!;
                return (
                  <li key={'f' + f.threat}>
                    <strong>If {t.name.replace(/^Open problem: /, '').toLowerCase()} gets through</strong>
                    <span>{f.lost} of {gauge.system.nodes.length} parts of the system go with it. A second layer on that threat, or a structure that cuts the dependency, keeps it to one.</span>
                  </li>
                );
              })}
              {result.cuts.slice(0, 3).map((c, i) => (
                <li key={'c' + i}>
                  <strong>{byId.get(c.by)?.name} cut a cascade</strong>
                  <span>The failure at {nodeName(c.from)} stopped before it reached {nodeName(c.to)}.</span>
                </li>
              ))}
              {result.dead.length > 0 && (
                <li><strong>Spent on structures that no longer hold</strong><span>{result.dead.map(id => byId.get(id)?.name).join(', ')}. Their budget bought nothing at this notch.</span></li>
              )}
              {gauge.budget - result.spent > 0 && (
                <li><strong>{gauge.budget - result.spent} budget unspent</strong><span>A cheap second layer on the heaviest threat is usually the best use of it.</span></li>
              )}
            </ul>
          </div>

          {result.links.length > 0 && (
            <div className="tr-block">
              <h3>What Compounded</h3>
              <ul className="tr-links">
                {result.links.map((l, i) => (
                  <li key={i}><strong>{byId.get(l.a)!.name} + {byId.get(l.b)!.name}</strong><span>{l.how}</span></li>
                ))}
              </ul>
            </div>
          )}

          {result.tensions.length > 0 && (
            <div className="tr-block">
              <h3>Tensions You Are Holding</h3>
              <ul className="tr-links tense">
                {result.tensions.map((l, i) => (
                  <li key={i}><strong>{byId.get(l.a)!.name} and {byId.get(l.b)!.name}</strong><span>{l.how}</span></li>
                ))}
              </ul>
            </div>
          )}

          <div className="tr-block">
            <h3>{ref.by === 'authored' ? 'The Reference Stack' : 'The Reference Stack, Found By Search'}</h3>
            {ref.by === 'search' && (
              <p className="sec" style={{ marginTop: 0 }}>
                Above Ground the reference is the best stack an exact search over the catalog finds for this notch.
                {ref.coverable === false ? ' At this notch no catalog stack stops every threat, so the reference breaches too.' : ''}
                {' '}It looks for coverage and depth, so a stack built for compounding can beat it.
              </p>
            )}
            <ul className="tr-ref">
              {ref.stack.map(id => {
                const m = byId.get(id)!;
                const had = stack.includes(id);
                const answers = gauge.threats.filter(t => t.counters.includes(id)).map(t => t.name);
                return (
                  <li key={id} className={had ? 'had' : 'missed'}>
                    <button className="tr-ref-row" onClick={() => d({ t: 'route', view: 'modux-model', id })}
                      style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[m.family]] }}>
                      <span className="tr-ref-mark" aria-hidden>{had ? '✓' : '+'}</span>
                      <span className="tr-ref-body">
                        <span className="tr-ref-name"><span className="mt-e gx-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</span>
                        <span className="tr-ref-meta">{had ? 'In your stack' : 'Stops: ' + answers.join(', ')}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {level === 0 && <p className="sec big-sec" style={{ marginTop: 16 }}>{gauge.debrief}</p>}
          </div>

          {known && (
            <div className="tr-block mx-glass ks-real">
              <h3>What {known.name} Leans On</h3>
              <p className="sec" style={{ marginTop: 0 }}>The security moves {known.name} uses most, read from public sources, with the catalog structures that match them. A ticked structure is in the stack you just ran.</p>
              <ol className="ks-lever">
                {known.securityLeverage.map((x, i) => (
                  <li key={i}>
                    <strong>{x.move}</strong>
                    <span>{x.why}</span>
                    {x.models.length > 0 && (
                      <span className="ks-models">
                        {x.models.map(id => (
                          <button key={id} className={'mx-chip' + (stack.includes(id) ? ' on' : '')} onClick={() => d({ t: 'route', view: 'modux-model', id })}>
                            {(stack.includes(id) ? '✓ ' : '') + (byId.get(id)?.name || id)}
                          </button>
                        ))}
                      </span>
                    )}
                  </li>
                ))}
              </ol>
              <p className="sec" style={{ margin: 0 }}><strong>The lesson:</strong> {known.lesson}</p>
            </div>
          )}
          {ownSpec && (ownSpec.keystone || ownSpec.outlier || ownSpec.lever) && (
            <div className="tr-block mx-glass ks-real">
              <h3>Your Reading Of It</h3>
              <dl className="ks-reading">
                {ownSpec.keystone && <div><dt>The question it answers</dt><dd>{ownSpec.keystone}</dd></div>}
                {ownSpec.outlier && <div><dt>What it does better than almost anyone</dt><dd>{ownSpec.outlier}</dd></div>}
                {ownSpec.lever && <div><dt>Where its security has the most leverage</dt><dd>{ownSpec.lever}</dd></div>}
              </dl>
            </div>
          )}

          {/* ---------- Claude ---------- */}
          <div className="tr-block gx-mind mx-glass">
            <h3>Review With Claude</h3>
            {mind ? (
              <>
                <p className="sec" style={{ marginTop: 0 }}>
                  Claude Opus reads this run{plays.length ? ', including your MoTRUS models,' : ''} and says what held, where it is thin and what the adversary tries next.
                  It goes from your browser to Anthropic on your own key. Nothing goes to StepSAFE.
                </p>
                {!runReview && (
                  <button className="btn" onClick={doReviewRun} disabled={runReviewBusy}>
                    {runReviewBusy ? 'Claude is reading the run' : 'Review this run'}
                  </button>
                )}
                {runReview?.text && <MindText text={runReview.text} model={runReview.model} />}
                {runReview && !runReview.text && <p className="sec" style={{ color: 'var(--ink-alarm)' }}>The review did not come back: {runReview.error}</p>}
              </>
            ) : (
              <p className="sec" style={{ margin: 0 }}>
                Add your own Anthropic key in Settings and Claude Opus will review each run and your MoTRUS models.
                The call goes from your browser to Anthropic. Nothing goes to StepSAFE.{' '}
                <button className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'settings' })}>Open Settings</button>
              </p>
            )}
          </div>

          <div className="row" style={{ flexWrap: 'wrap', marginTop: 'var(--s4)' }}>
            <button className="btn btn-key gx-up" onClick={upANotch}>Take It Up A Notch</button>
            <button className="btn" onClick={rebuild}>Rebuild</button>
            <button className="btn" onClick={() => { setStack(ref.stack); setClaims({}); setPhase('build'); setResult(null); setReward(null); }}>Load the reference stack</button>
            {base.origin !== 'forged' && base.origin !== 'opus' && (
              <button className="btn btn-ghost" onClick={() => d({ t: 'route', view: 'modux-gauge', id: nextGauge.id })}>Next gauge: {nextGauge.title}</button>
            )}
          </div>
        </section>
      )}

      {/* ---------- the builder ---------- */}
      {phase === 'build' && (
        <section className="mx-section tr-build">
          <div className="tr-pool">
            {/* MoTRUS first, once it unlocks: your own structures */}
            <div className={'gx-motrus' + (motrusOpen ? '' : ' locked')}>
              <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <h2 style={{ margin: 0 }}>Your MoTRUS Models</h2>
                {motrusOpen && !minting && <button className="btn btn-sm" onClick={() => setMinting(true)}>Mint a MoTRUS model</button>}
              </div>
              {!motrusOpen ? (
                <p className="sec" style={{ margin: '6px 0 0' }}>
                  Take this gauge up {MOTRUS_FROM - level} more {MOTRUS_FROM - level === 1 ? 'notch' : 'notches'} to mint structures of your own.
                </p>
              ) : (
                <>
                  <p className="sec" style={{ margin: '6px 0 12px' }}>
                    Each costs {MOTRUS_COST} and can claim up to {MOTRUS_MAX_ANSWERS} threats. The engine takes your word for a claim.
                    For Gratus Gold, every MoTRUS model in the stack needs a review from Claude marked sound at this notch.
                  </p>
                  {minting && (
                    <MotrusMint onCancel={() => setMinting(false)} onMinted={m => {
                      if (!m.kept) setScratch(cur => [m, ...cur]);
                      setClaims(cur => ({ ...cur, [m.id]: [] }));
                      setMinting(false);
                      eng.mintedMotrus();
                    }} />
                  )}
                  {vault.status === 'locked' && <p className="sec">Your vault is sealed. Open it from the MoTRUS tab in Modux Models to use kept models here.</p>}
                  {allMotrus.length === 0 && !minting && <p className="sec">No models yet.</p>}
                  <ul className="gx-mt-list">
                    {allMotrus.map(m => {
                      const inStack = !!claims[m.id];
                      const rv = m.reviews[rk];
                      const tooDear = !inStack && MOTRUS_COST > left;
                      return (
                        <li key={m.id} className={'gx-mt-item' + (inStack ? ' in' : '')}>
                          <div className="gx-mt-head">
                            <span>
                              <strong><span className="mt-e gx-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</strong>
                              <span className="gx-mt-meta">{m.kept ? 'Kept in your vault' : 'This gauge only'}{rv ? ' · ' : ''}
                                {rv && <span className={'gx-verdict v-' + rv.verdict}>{rv.verdict}</span>}
                              </span>
                            </span>
                            <button className={'tr-add' + (inStack ? ' in' : '')} disabled={tooDear} onClick={() => toggleMotrus(m.id)}>
                              {inStack ? 'Remove' : tooDear ? 'Over' : 'Add'}
                            </button>
                          </div>
                          <p className="gx-mt-st">{m.statement}</p>
                          {inStack && (
                            <div className="gx-claims">
                              <span className="tr-detail-label">Claims ({(claims[m.id] || []).length}/{MOTRUS_MAX_ANSWERS})</span>
                              <div className="mx-chips">
                                {gauge.threats.map(t => (
                                  <button key={t.id} className={'mx-chip' + ((claims[m.id] || []).includes(t.id) ? ' on' : '') + (t.open ? ' gx-open-chip' : '')}
                                    onClick={() => toggleClaim(m.id, t.id)}>
                                    {t.name.replace(/^Open problem: /, '')}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                          {mind && (
                            <button className="btn btn-ghost btn-sm" disabled={reviewing === m.id} onClick={() => doReviewMotrus(m)}>
                              {reviewing === m.id ? 'Claude is reviewing it' : rv ? 'Review again at this notch' : 'Review it with Claude'}
                            </button>
                          )}
                          {rv && <details className="gx-rv"><summary>Claude’s review</summary><MindText text={rv.text} model={rv.model} /></details>}
                        </li>
                      );
                    })}
                  </ul>
                </>
              )}
            </div>

            <h2 style={{ marginTop: 'var(--s5)' }}>The Catalog</h2>
            <p className="sec" style={{ marginTop: 0 }}>Pick structures within the budget. Open a model to see what it defeats.</p>
            <PhoneSelect<ModuxFamily | 'all'> label="Family" value={family} options={[{ value: 'all', label: 'All families' }, ...FAMILIES.map(f => ({ value: f, label: FAMILY_LABEL[f] }))]} onChange={setFamily} />
            <div className="mx-chips row-scroll" style={{ marginBottom: 10 }}>
              <button className={'mx-chip' + (family === 'all' ? ' on' : '')} onClick={() => setFamily('all')}>All</button>
              {FAMILIES.map(f => (
                <button key={f} className={'mx-chip' + (family === f ? ' on' : '')}
                  style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[f]] }}
                  onClick={() => setFamily(family === f ? 'all' : f)}>{FAMILY_LABEL[f]}</button>
              ))}
            </div>
            <input className="mx-search" style={{ maxWidth: 'none', width: '100%', marginBottom: 12 }}
              value={q} onChange={e => setQ(e.target.value)} placeholder="Search models and what they defeat" aria-label="Search models" />
            <ul className="tr-pool-list">
              {pool.map(m => {
                const inStack = stack.includes(m.id);
                const dead = weakened.has(m.id);
                const cost = TIER_COST[m.tier];
                const tooDear = !inStack && cost > left;
                const isOpen = open === m.id;
                return (
                  <li key={m.id} className={'tr-pool-item' + (inStack ? ' in' : '') + (dead ? ' gx-deadm' : '')}
                    style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[m.family]] }}>
                    <div className="tr-pool-row">
                      <button className="tr-pool-open" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.id)}>
                        <span className="tr-pool-name"><span className="mt-e gx-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</span>
                        <span className="tr-pool-meta">{dead ? 'No longer holds at this notch' : FAMILY_LABEL[m.family] + ' · ' + TIER_LABEL[m.tier]}{!dead && <span className="tr-cost-word"> · costs {cost}</span>}</span>
                      </button>
                      <span className="tr-cost" aria-label={'Cost ' + cost}>
                        {[1, 2, 3, 4].map(k => <i key={k} className={k <= cost ? 'on' : undefined} />)}
                      </span>
                      <button className={'tr-add' + (inStack ? ' in' : '')} disabled={tooDear}
                        onClick={() => toggle(m.id)} aria-label={(inStack ? 'Remove ' : 'Add ') + m.name}>
                        {inStack ? 'Remove' : tooDear ? 'Over' : 'Add'}
                      </button>
                    </div>
                    {isOpen && (
                      <div className="tr-pool-detail">
                        <p>{m.statement}</p>
                        <span className="tr-detail-label">Defeats</span>
                        <ul>{m.defeats.map((x, i) => <li key={i}>{x}</li>)}</ul>
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <aside className="tr-tray mx-glass">
            <h2>Your Stack</h2>
            <p className="tr-budget"><strong>{spent}</strong> of {gauge.budget} spent · {left} left · <strong>{heldCount}</strong> of {gauge.threats.length} threats held</p>
            <div className="tr-day">
              <span className="tr-detail-label">On a stress day</span>
              <p><strong>{dayWords(day.range).replace(' of 24 hours', '')}</strong> of 24 h of service kept{people ? ' for ' + people : ''}</p>
            </div>
            {day.lev.moves.length > 0 && (
              <div className="tr-lever">
                <span className="tr-detail-label">Where to act next</span>
                <ul>
                  {day.lev.moves.map(m => (
                    <li key={m.id}>
                      <span><strong><span className="mt-e gx-e" aria-hidden>{emojiOf(m.id)}</span>{m.name}</strong><small>{moveLine(m)} · {m.cost} budget · keeps {hoursFmt(m.kept)} h</small></span>
                      <button className="btn btn-sm" disabled={m.cost > left || stack.includes(m.id)} onClick={() => toggle(m.id)}
                        title={m.cost > left ? 'Over budget by ' + (m.cost - left) : 'Add it to the stack'}>Add</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {stack.length === 0 && plays.length === 0 ? (
              <p className="sec">Add models from the catalog.</p>
            ) : (
              <ul className="tr-tray-list">
                {stack.map(id => {
                  const m = byId.get(id)!;
                  return (
                    <li key={id} className={weakened.has(id) ? 'gx-deadm' : undefined} style={{ ['--hue' as string]: ESSENCE_HEX[FAMILY_HUE[m.family]] }}>
                      <span className="tr-tray-name"><span className="mt-e gx-e" aria-hidden>{emojiOf(id)}</span>{m.name}{weakened.has(id) ? ' · no longer holds' : ''}</span>
                      <button className="tr-x" onClick={() => toggle(id)} aria-label={'Remove ' + m.name}>×</button>
                    </li>
                  );
                })}
                {plays.map(p => (
                  <li key={p.id} className="gx-mt-tray">
                    <span className="tr-tray-name">{p.name} · MoTRUS · {p.answers.length} {p.answers.length === 1 ? 'claim' : 'claims'}</span>
                    <button className="tr-x" onClick={() => toggleMotrus(p.id)} aria-label={'Remove ' + p.name}>×</button>
                  </li>
                ))}
              </ul>
            )}
            {links.length > 0 && (
              <div className="tr-tray-links">
                <span className="tr-detail-label">Compounding · {links.length}</span>
                <ul>{links.map((l, i) => <li key={i}><strong>{byId.get(l.a)!.name} + {byId.get(l.b)!.name}</strong>{l.how}</li>)}</ul>
              </div>
            )}
            {tensions.length > 0 && (
              <div className="tr-tray-links tense">
                <span className="tr-detail-label">Tensions · {tensions.length}</span>
                <ul>{tensions.map((l, i) => <li key={i}><strong>{byId.get(l.a)!.name} and {byId.get(l.b)!.name}</strong>{l.how}</li>)}</ul>
              </div>
            )}
            <button className="btn btn-key" style={{ width: '100%', marginTop: 14 }}
              disabled={(stack.length === 0 && plays.length === 0) || left < 0} onClick={run}>
              Run the gauge
            </button>
            {record && record.stack.length > 0 && (
              <button className="btn btn-ghost btn-sm" style={{ width: '100%', marginTop: 8 }}
                onClick={() => setStack(record.stack.filter(id => byId.has(id)))}>
                Load your best stack ({record.best})
              </button>
            )}
          </aside>
        </section>
      )}

      {phase === 'build' && (
        <div className="tr-dock" role="region" aria-label="Your stack">
          <span className="tr-dock-text"><strong>{spent}</strong>/{gauge.budget} spent · <strong>{heldCount}</strong> of {gauge.threats.length} held</span>
          <button className="btn btn-key btn-sm" disabled={(stack.length === 0 && plays.length === 0) || left < 0} onClick={run}>Run</button>
        </div>
      )}

      {phase === 'result' && result && (
        <div className="tr-dock" role="region" aria-label="After the run">
          <span className="tr-dock-text"><strong>{result.score}</strong>/100 · {result.verdict === 'holds' ? 'held' : result.landed + ' landed'}</span>
          {result.verdict === 'holds'
            ? <button className="btn btn-key btn-sm" onClick={upANotch}>Take It Up A Notch</button>
            : <button className="btn btn-key btn-sm" onClick={rebuild}>Rebuild</button>}
        </div>
      )}

      {world && createPortal(
        <Suspense fallback={<div className="gw gw-loading">Opening the world</div>}>
          <WorldView
            gauge={gauge} level={level} bandIndex={bandI} bandLabel={BAND_LABEL[band]} pressure={pressure}
            shields={shields} phase={phase} revealed={revealed} result={result} reward={reward} refScore={ref.result.score}
            spent={spent} structures={stack.length + plays.length} canRun={(stack.length > 0 || plays.length > 0) && left >= 0}
            fresh={fresh} stepMs={stepMs} sound={sound}
            dyn={{ stack, plays, weakened, byId, left }}
            momentum={(() => { let n = 0; for (let i = s.runLog.length - 1; i >= 0 && s.runLog[i].held; i--) n++; return n; })()}
            onPlace={id => { if (!stack.includes(id)) toggle(id); }}
            cutHue={id => { const m = byId.get(id); return m ? ESSENCE_HEX[FAMILY_HUE[m.family]] : '#d8effc'; }}
            name={id => byId.get(id)?.name || allMotrus.find(m => m.id === id)?.name || id}
            news={worldNews} studied={studied}
            onReview={mind ? () => {
              leaveWorld();
              window.setTimeout(() => document.querySelector('.gx-mind')?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 200);
              if (!runReview && !runReviewBusy) void doReviewRun();
            } : undefined}
            onToggleSound={toggleSound} onRun={run} onUp={upANotch} onShowAll={showAll}
            onRebuild={() => { setPhase('build'); setResult(null); setReward(null); leaveWorld(); }}
            onExit={leaveWorld} />
        </Suspense>,
        document.body,
      )}

      {rite && <GoldRite moment={rite} total={s.gratusGold} onClose={() => setRite(null)} />}
    </div>
  );
}

/** Claude's reply, kept as plain paragraphs. Section labels in capitals become small headings. */
export function MindText({ text, model }: { text: string; model?: string }) {
  const parts = text.replace(/\*\*/g, '').replace(/^#+\s*/gm, '').split(/\n+/).map(x => x.trim()).filter(Boolean);
  return (
    <div className="gx-mindtext">
      {parts.map((p, i) => /^[A-Z][A-Z ,']{3,40}$/.test(p)
        ? <span key={i} className="tr-detail-label" style={{ marginTop: i ? 12 : 0 }}>{p.charAt(0) + p.slice(1).toLowerCase()}</span>
        : <p key={i}>{p}</p>)}
      {model && <span className="gx-mind-model">{model}</span>}
    </div>
  );
}
