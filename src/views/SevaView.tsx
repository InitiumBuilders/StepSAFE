/* THE MINDS. Seva teaches; Claros reads systems; Dasha supports building on Dash. The learner chooses which
   mind they speak with, and each keeps its own conversation.

   Dasha is the Dash Support Team's own mind and runs on her own server (lib/dasha). Nothing of hers is copied
   here: her answers arrive with the model that wrote them and the live sources she reached, and the page says so.

   Seva's emergence into Sevas is the most significant narrative moment in the product; restraint
   carries it, and it is unchanged here.

   Claros answers from the gauges' model. Whatever route the mind runs on, the readings of the
   system in focus come from lib/claros: with a live model they go to it as data, and with no model
   connected Claros answers from them directly, so every number is the model's. */

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GUISE_VOICE, SEVAS_EMERGENCE, SEVA_LINES, CHAPTERS, MODUX_CHAPTERS, MODUX_MODELS, stepById } from '../content/registry';
import type { ModuxModel as ModuxModelT } from '../content/modux-schema';
import { useS, uid, sevasReady, unitPhase, PHASE_NAMES, rankOf, reviewDue, type S, type SevaMsg } from '../lib/state';
import { useEngine, strongCount } from '../lib/engine';
import { requestCounsel, providerLabel, type CounselResult } from '../lib/provider';
import { buildSevaSystem } from '../lib/sevaPrompt';
import { chargeKeystone, Swarm } from '../lib/swarm';
import { focusChoices, resolveFocus, readFocus, clarosDigest, clarosAnswer, clarosDayFor, clarosQuiz, type ClarosRead } from '../lib/claros';
import { ClarosDay } from '../components/ClarosDay';
import { Sound } from '../lib/sound';
import { canSpeak, speak, stopSpeaking } from '../lib/study/voice';
import { useMindClock } from '../lib/mindClock';
import { MindLedger, SessionClock } from '../components/MindLedger';
import { RiseHead } from '../components/RiseHead';
import { askDasha, dashaStatus, modelName, toolUsed, speakDasha, stopDashaVoice, primeDashaVoice, DASHA_HOST, type DashaStatus } from '../lib/dasha';
import { DashaText } from '../components/DashaText';

type Mind = 'seva' | 'claros' | 'dasha';

/* The live mind's view of the learner. The digest is what makes the mentor real: it answers from the
   learner's actual record, not from a persona. */
function progressDigest(s: S) {
  const weakDrills = Object.entries(s.drillScores)
    .filter(([, sc]) => sc < 0)
    .map(([id]) => stepById(id.replace(/-drill$/, ''))?.step.title || id)
    .slice(0, 6);
  const recent = Object.entries(s.completedSteps)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([id]) => stepById(id)?.step.title || id);
  const currentChapter = CHAPTERS.find(c =>
    !s.completedChapters[c.id] && c.pages.some(p => p.steps.some(st => s.completedSteps[st.id])))?.title;
  return {
    handle: s.handle,
    steps: Object.keys(s.completedSteps).length,
    pages: Object.keys(s.completedPages).length,
    chapters: Object.keys(s.completedChapters).length,
    sims: Object.keys(s.completedSims).length,
    respect: s.respect,
    trust: s.trust,
    rank: rankOf(s.respect).name,
    phase: PHASE_NAMES[unitPhase(s, CHAPTERS.length)],
    mode: s.mode,
    streak: s.streak,
    weakDrills,
    reviewsDue: reviewDue(s).length,
    recentSteps: recent,
    currentChapter,
    projects: s.projects.slice(0, 4).map(p => ({ title: p.title, status: p.status })),
    moduxStudied: Object.keys(s.completedSteps).filter(id => id.startsWith('mx-')).length,
    moduxCourse: MODUX_CHAPTERS.find(c =>
      !s.completedChapters[c.id] && c.pages.some(p => p.steps.some(st => s.completedSteps[st.id])))?.title,
  };
}

/* Seva's local counsel: the authored line-book plus progress-aware composition. */
function counsel(input: string, ctx: { steps: number; pages: number; evolved: boolean; handle: string }): string {
  const q = input.toLowerCase();
  const name = ctx.evolved ? 'Sevas' : 'Seva';
  if (/stuck|lost|hard|confus|overwhelm/.test(q)) {
    return 'Stuck is information. Name the exact sentence or decision where it stopped making sense — not the topic, the sentence. Then take one Step smaller than feels dignified. Small and moving beats large and frozen, every time.';
  }
  if (/next|what should|where.*start|recommend|practi[cs]e/.test(q)) {
    return 'Open NextSteps — I keep it argued from your actual record, not from a syllabus. But if you want it in one line: finish the Page you are closest to sealing. Credentials compound; scattered effort does not.';
  }
  if (/drill|wrong|fail|test me/.test(q)) {
    return 'A missed drill is the cheapest tuition you will ever pay. Re-run it tomorrow, not today — the spacing is what writes it into you. The operators I respect most are the ones with the longest list of drills they once failed.';
  }
  if (/ciso|career|job|chair/.test(q)) {
    return 'The chair is a translation job: risk into language the business can act on, and business pressure into constraints engineers can build against. Every Chapter here feeds that. The council steps especially — do not skip them because they are not technical. They are the job.';
  }
  if (/trust|intuition|atom|triple|wallet/.test(q)) {
    return 'Your record can live on the Intuition graph as triples — subject, predicate, object — staked with real weight. Draft them from your Praxis Profile. And read the claim before you ever stake it. A claim you stake is a claim you own; that rule does not bend.';
  }
  if (/unit|team|alone/.test(q)) {
    return 'You build the unit by finishing Chapters — each one seats a specialist, and the leverage web between them is the real curriculum. Nobody defends anything important alone. Not even me.';
  }
  if (/claros|system|map|keystone|harden/.test(q)) {
    return 'That is a question for Claros as much as for me. Claros reads systems: choose Claros above and ask it to read your map. Then come back and tell me what you would do first, and why.';
  }
  if (/who are you|what are you|seva/.test(q)) {
    return 'I am ' + name + '. Your guide here — not your cheerleader. I will tell you when the work is good, and I will tell you when it is not, because a mentor who only praises is useless to you.';
  }
  if (/thank/.test(q)) {
    return 'Keep walking, ' + ctx.handle + '. The record is the thanks.';
  }
  return ctx.steps === 0
    ? 'Words are fine, but the first Step is better. Open the Chapters and seal one — then we will have something real to talk about.'
    : 'Noted. You hold ' + ctx.steps + ' sealed step' + (ctx.steps === 1 ? '' : 's') + ' and ' + ctx.pages +
      ' page' + (ctx.pages === 1 ? '' : 's') + '. My counsel stands: the main line first, the nearly-sealed Page first. Ask me something sharper and I will answer sharper.';
}

/* ---------- the sigils, drawn: each mind's own figure ---------- */

/** Seva: two loops that share two nodes, one teaching and one learning, the same lever between them */
function SevaSigil({ size = 120, thinking = false }: { size?: number; thinking?: boolean }) {
  return (
    <svg className={'mind-sigil seva' + (thinking ? ' thinking' : '')} width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id="sv-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f8f1fb" /><stop offset="0.5" stopColor="#f18ac6" /><stop offset="1" stopColor="#fdc26f" /></linearGradient>
        <radialGradient id="sv-c"><stop offset="0" stopColor="#fdc26f" stopOpacity="0.5" /><stop offset="1" stopColor="#f18ac6" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="44" fill="url(#sv-c)" className="mind-sigil-air" />
      <circle cx="46" cy="60" r="26" className="sv-loop a" stroke="url(#sv-a)" />
      <circle cx="74" cy="60" r="26" className="sv-loop b" stroke="url(#sv-a)" />
      <circle cx="60" cy="38.4" r="3.4" className="sv-node" />
      <circle cx="60" cy="81.6" r="3.4" className="sv-node" />
      {thinking && (
        <circle r="2.6" className="mind-sig">
          <animateMotion dur="2.4s" repeatCount="indefinite" path="M60 38.4 A26 26 0 1 0 60 81.6 A26 26 0 1 0 60 38.4" />
        </circle>
      )}
    </svg>
  );
}

/** Claros: a lens whose light converges on one point, the keystone it is looking for */
function ClarosSigil({ size = 120, thinking = false }: { size?: number; thinking?: boolean }) {
  const rays = Array.from({ length: 8 }, (_, i) => (i / 8) * Math.PI * 2);
  return (
    <svg className={'mind-sigil claros' + (thinking ? ' thinking' : '')} width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id="cl-a" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#d8effc" /><stop offset="0.55" stopColor="#9cc3ef" /><stop offset="1" stopColor="#a78bff" /></linearGradient>
        <radialGradient id="cl-c"><stop offset="0" stopColor="#9cc3ef" stopOpacity="0.45" /><stop offset="1" stopColor="#a78bff" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="46" fill="url(#cl-c)" className="mind-sigil-air" />
      <circle cx="60" cy="60" r="40" className="cl-ring" stroke="url(#cl-a)" />
      <circle cx="60" cy="60" r="27" className="cl-ring inner" stroke="url(#cl-a)" />
      {rays.map((a, i) => (
        <line key={i} x1={60 + Math.cos(a) * 40} y1={60 + Math.sin(a) * 40} x2={60 + Math.cos(a) * 7} y2={60 + Math.sin(a) * 7}
          className="cl-ray" style={{ ['--ri' as string]: String(i) }} />
      ))}
      <circle cx="60" cy="60" r="4" className="cl-focus" />
      {thinking && (
        <circle r="2.6" className="mind-sig">
          <animateMotion dur="2s" repeatCount="indefinite" path="M60 20 A40 40 0 1 1 59.99 20" />
        </circle>
      )}
    </svg>
  );
}

/** Dasha: three blocks, each resting on the one before, the newest one lit. A chain, and steps up */
function DashaSigil({ size = 120, thinking = false }: { size?: number; thinking?: boolean }) {
  return (
    <svg className={'mind-sigil dasha' + (thinking ? ' thinking' : '')} width={size} height={size} viewBox="0 0 120 120" aria-hidden>
      <defs>
        <linearGradient id="ds-a" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#4db4ff" /><stop offset="0.6" stopColor="#7ee6e0" /><stop offset="1" stopColor="#f8f1fb" /></linearGradient>
        <radialGradient id="ds-c"><stop offset="0" stopColor="#4db4ff" stopOpacity="0.45" /><stop offset="1" stopColor="#7ee6e0" stopOpacity="0" /></radialGradient>
      </defs>
      <circle cx="60" cy="60" r="46" fill="url(#ds-c)" className="mind-sigil-air" />
      <rect x="18" y="64" width="34" height="34" rx="10" className="ds-block b0" stroke="url(#ds-a)" />
      <rect x="43" y="43" width="34" height="34" rx="10" className="ds-block b1" stroke="url(#ds-a)" />
      <rect x="68" y="22" width="34" height="34" rx="10" className="ds-block b2" stroke="url(#ds-a)" />
      <circle cx="85" cy="39" r="4" className="ds-core" />
      {thinking && (
        <circle r="2.6" className="mind-sig">
          <animateMotion dur="1.8s" repeatCount="indefinite" path="M35 81 L60 60 L85 39" />
        </circle>
      )}
    </svg>
  );
}

const SIGILS = { seva: SevaSigil, claros: ClarosSigil, dasha: DashaSigil } as const;

/* a reply as paragraphs; a run of numbered lines becomes a list, and a move's verb its coloured dot */
const VERB_RE = /\((Model|Harden|Detect|Isolate|Restore)\)/;
function MsgText({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/);
  return (
    <>
      {blocks.map((b, i) => {
        const lines = b.split('\n');
        const numbered = lines.length > 1 && lines.slice(1).every(l => /^\d+\.\s/.test(l)) ? 1 : lines.every(l => /^\d+\.\s/.test(l)) ? 0 : -1;
        if (numbered >= 0) {
          return (
            <div key={i} className="minds-block">
              {numbered === 1 && <p>{lines[0]}</p>}
              <ol className="minds-ol">
                {lines.slice(numbered).map((l, j) => {
                  const v = l.match(VERB_RE)?.[1];
                  return <li key={j} className={v ? 'v-' + v.toLowerCase() : undefined}>{v && <i aria-hidden />}{l.replace(/^\d+\.\s/, '')}</li>;
                })}
              </ol>
            </div>
          );
        }
        return <p key={i}>{b}</p>;
      })}
    </>
  );
}

/** the day Claros played in a reply, on the system it was reading then */
function MsgDay({ card, byId }: { card: NonNullable<SevaMsg['card']>; byId: Map<string, ModuxModelT> }) {
  const { s } = useS();
  const read = useMemo(() => {
    try { const f = resolveFocus({ ...s, clarosFocus: card.focus }, byId); return f && f.key === card.focus ? readFocus(f, byId) : null; } catch { return null; }
  }, [card.focus, byId, s.ownSpecs, s.ownDraft]); // eslint-disable-line react-hooks/exhaustive-deps
  return read ? <ClarosDay read={read} plan={card.plan} byId={byId} /> : null;
}

const MINDS: Record<Mind, { name: string; role: string; traits: string[]; asks: string[] }> = {
  seva: { name: 'Seva', role: 'Teaches you.', traits: ['Asks before it tells', 'Tests what you hold', 'Grows with you into Sevas'],
    asks: ['What should I practise next?', 'Test me on the system Claros read', 'Test me on what I learned last', 'I am stuck. Help me find where.', 'How does a CISO think about this?'] },
  claros: { name: 'Claros', role: 'Reads systems with you.', traits: ['Finds the keystone', 'Plans the order to harden', 'Tests the hardest day'],
    asks: ['Read this system', 'Where should I harden first?', 'How does it hold on the hardest day?', 'What does it rest on?', 'How fast does a failure travel?'] },
  dasha: { name: 'Dasha', role: 'Supports building on Dash.', traits: ['Reads the Dash docs live', 'Reads the governance ballot', 'Looks up a transaction or a name'],
    asks: ['How do I keep a masternode\u2019s keys apart?', 'What is on the governance ballot now?', 'How do I check a message is not a scam?', 'How do I start building on Dash Platform?', 'What does a data contract hold?'] },
};

/** the conversation as Dasha's server takes it: a question she could not be reached for is left out with its notice */
function dashaTurns(log: SevaMsg[], text: string) {
  const kept: SevaMsg[] = [];
  for (const m of log) {
    if (m.tone === 'unreached') { if (kept.length && kept[kept.length - 1].from === 'me') kept.pop(); continue; }
    if (m.text) kept.push(m);
  }
  return [...kept.slice(-19).map(m => ({ role: m.from === 'me' ? ('user' as const) : ('assistant' as const), content: m.text })), { role: 'user' as const, content: text }];
}

export function SevaView() {
  const { s, d } = useS();
  const eng = useEngine();
  const byId = useMemo(() => new Map(MODUX_MODELS.map(m => [m.id, m])), []);
  const [input, setInput] = useState('');
  /* a phone gets the short prompt, so the empty composer never wraps */
  const [narrow, setNarrow] = useState(() => { try { return window.matchMedia('(max-width: 560px)').matches; } catch { return false; } });
  useEffect(() => {
    let mq: MediaQueryList;
    try { mq = window.matchMedia('(max-width: 560px)'); } catch { return; }
    const on = () => setNarrow(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  const [thinking, setThinking] = useState(false);
  const [lastVia, setLastVia] = useState<CounselResult['via']>(null);
  const [lastErr, setLastErr] = useState('');
  const [ceremony, setCeremony] = useState(s.route.sub === 'emergence');
  const logRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  /* a reply read aloud in the configured voice; pressing again stops it */
  const [voiced, setVoiced] = useState<string | null>(null);
  const voiceOk = useMemo(() => { try { return canSpeak(); } catch { return false; } }, []);
  const hush = () => { try { stopSpeaking(); } catch { /* nothing playing */ } try { stopDashaVoice(); } catch { /* nothing playing */ } };
  useEffect(() => () => { hush(); }, []);
  /* Dasha's replies are read in her own voice when her server gave the reply a ticket; if her voice is off or out
     of reach, the voice this device already has reads it. `after` runs when the reading ends or is stopped. */
  function listen(m: SevaMsg, after?: () => void) {
    hush();
    if (voiced === m.id) { setVoiced(null); return; }
    setVoiced(m.id);
    const plain = (m.from === 'dasha' ? m.text.replace(/```[\s\S]*?```/g, ' ').replace(/[*`#]/g, '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') : m.text).replace(/\n+/g, ' ');
    const done = () => { setVoiced(v => (v === m.id ? null : v)); after?.(); };
    const own = () => speak(plain).catch(() => undefined);
    const say = m.from === 'dasha' ? m.meta?.say : undefined;
    (say ? speakDasha(m.text, say).then(ok => (ok ? undefined : own()), own) : own()).then(done, done);
  }

  /* DASHA BY VOICE. Reading aloud, and a call: the browser turns speech into text, the text is asked like any typed
     question, and her answer is read back before the microphone opens again. No sound is sent to any server of
     ours or hers by this page; the browser's own speech service does the listening. */
  type Hearing = { lang: string; interimResults: boolean; continuous: boolean; start(): void; abort(): void;
    onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
    onerror: ((e: { error?: string }) => void) | null; onend: (() => void) | null };
  const Hear = useMemo(() => {
    const w = window as unknown as { SpeechRecognition?: new () => Hearing; webkitSpeechRecognition?: new () => Hearing };
    return w.SpeechRecognition || w.webkitSpeechRecognition || null;
  }, []);
  const [aloud, setAloud] = useState(() => { try { return localStorage.getItem('stepsafe-dasha-aloud') === '1'; } catch { return false; } });
  const [onCall, setOnCall] = useState(false);
  const [callNote, setCallNote] = useState('');
  const [heard, setHeard] = useState(false);
  const call = useRef<{ on: boolean; rec: Hearing | null; quiet: number }>({ on: false, rec: null, quiet: 0 });
  const aloudRef = useRef(aloud); aloudRef.current = aloud;
  const sendRef = useRef<(raw?: string) => void>(() => undefined);
  function endCall(note = '') {
    call.current.on = false;
    const r = call.current.rec; call.current.rec = null;
    try { r?.abort(); } catch { /* not listening */ }
    setOnCall(false); setHeard(false); setCallNote(note); hush();
  }
  function hear() {
    if (!call.current.on || !Hear) return;
    const rec = new Hear(); call.current.rec = rec;
    let text = '';
    rec.lang = navigator.language || 'en-US'; rec.interimResults = true; rec.continuous = false;
    rec.onresult = e => { let t = ''; for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript; text = t; setInput(t); };
    rec.onerror = e => { if (e.error === 'not-allowed' || e.error === 'service-not-allowed') endCall('The microphone is blocked for this page. Allow it in your browser, then start the call again.'); };
    rec.onend = () => {
      if (!call.current.on || call.current.rec !== rec) return;
      call.current.rec = null; setHeard(false);
      if (text.trim()) { call.current.quiet = 0; sendRef.current(text.trim()); return; }
      if (++call.current.quiet >= 3) { endCall('The call ended after a quiet spell. Start it again any time.'); return; }
      window.setTimeout(hear, 350);
    };
    setHeard(true);
    try { rec.start(); } catch { endCall('The microphone could not start.'); }
  }
  function startCall() {
    if (!Hear || call.current.on) return;
    primeDashaVoice();
    call.current.on = true; call.current.quiet = 0;
    setOnCall(true); setCallNote(''); hear();
  }
  function toggleAloud() {
    const on = !aloud;
    try { if (on) localStorage.setItem('stepsafe-dasha-aloud', '1'); else localStorage.removeItem('stepsafe-dasha-aloud'); } catch { /* not kept */ }
    if (on) primeDashaVoice(); else hush();
    setAloud(on);
  }
  useEffect(() => () => { endCall(); }, []);   // eslint-disable-line react-hooks/exhaustive-deps

  const mind: Mind = s.mind === 'claros' ? 'claros' : s.mind === 'dasha' ? 'dasha' : 'seva';
  const sevaName = s.sevaEvolved ? 'Sevas' : 'Seva';
  const name = mind === 'claros' ? 'Claros' : mind === 'dasha' ? 'Dasha' : sevaName;
  const log: SevaMsg[] = mind === 'claros' ? (s.clarosLog || []) : mind === 'dasha' ? (s.dashaLog || []) : s.sevaLog;
  /* Dasha: who is answering (read from her own server), what she is doing right now, and her words as they arrive */
  const [dstat, setDstat] = useState<DashaStatus | null>(null);
  const [step, setStep] = useState('');
  const [draft, setDraft] = useState('');
  useEffect(() => {
    if (mind !== 'dasha') return;
    let live = true;
    dashaStatus().then(x => { if (live) setDstat(x); });
    return () => { live = false; };
  }, [mind]);
  /* a call is with Dasha: choosing another mind ends it */
  useEffect(() => { if (mind !== 'dasha' && call.current.on) endCall(); }, [mind]);   // eslint-disable-line react-hooks/exhaustive-deps
  const guise = s.guise ? GUISE_VOICE[s.guise] : null;
  const ready = sevasReady(s, strongCount(s));

  /* time with each mind, counted while the learner is here */
  const { clock } = useMindClock(mind, thinking || !!voiced, d);

  /* full screen: the conversation fills the window; the browser's own full screen too, where it allows */
  const [full, setFull] = useState(false);
  const [rail, setRail] = useState(false);
  const viaApi = useRef(false);
  function enterFull() {
    setFull(true); setRail(false);
    const el = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
    try {
      if (el.requestFullscreen) { viaApi.current = true; el.requestFullscreen({ navigationUI: 'hide' }).catch(() => { viaApi.current = false; }); }
      else if (el.webkitRequestFullscreen) { viaApi.current = true; el.webkitRequestFullscreen(); }
    } catch { viaApi.current = false; }
  }
  function leaveFull() {
    setFull(false); setRail(false);
    if (viaApi.current && document.fullscreenElement) { try { document.exitFullscreen().catch(() => undefined); } catch { /* already out */ } }
    viaApi.current = false;
  }
  useEffect(() => {
    if (!full) return;
    document.documentElement.classList.add('minds-locked');
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') leaveFull(); };
    const onFs = () => { if (!document.fullscreenElement && viaApi.current) { viaApi.current = false; setFull(false); setRail(false); } };
    window.addEventListener('keydown', onKey);
    document.addEventListener('fullscreenchange', onFs);
    window.setTimeout(() => inputRef.current?.focus(), 60);
    return () => {
      document.documentElement.classList.remove('minds-locked');
      window.removeEventListener('keydown', onKey);
      document.removeEventListener('fullscreenchange', onFs);
    };
  }, [full]); // eslint-disable-line react-hooks/exhaustive-deps
  /* leaving the page leaves full screen */
  useEffect(() => () => { if (viaApi.current && document.fullscreenElement) { try { document.exitFullscreen().catch(() => undefined); } catch { /* out */ } } }, []);

  /* Claros's system in focus, read once per map after the first paint */
  const focus = useMemo(() => (mind === 'claros' ? resolveFocus(s, byId) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [mind, s.clarosFocus, s.ownSpecs, s.ownDraft, byId]);
  const [read, setRead] = useState<ClarosRead | null>(null);
  useEffect(() => {
    if (!focus) { setRead(null); return; }
    let live = true;
    const t = window.setTimeout(() => { try { const r = readFocus(focus, byId); if (live) setRead(r); } catch { if (live) setRead(null); } }, 40);
    return () => { live = false; window.clearTimeout(t); };
  }, [focus, byId]);
  const choices = useMemo(() => focusChoices(s), [s.ownSpecs, s.ownDraft]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => { chargeKeystone(); }, [ceremony]);
  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
  }, [log.length, thinking, step, draft.length > 0]);
  useEffect(() => {
    if (s.route.sub === 'emergence') setCeremony(true);
    /* a study card opens Seva with its question ready to send */
    if (s.route.sub && s.route.sub.startsWith('ask:')) { setInput(s.route.sub.slice(4)); if (mind !== 'seva') d({ t: 'mind', mind: 'seva' }); }
  }, [s.route.sub]); // eslint-disable-line react-hooks/exhaustive-deps

  function answer(m: SevaMsg, i: number) {
    if (!m.quiz || m.quiz.picked !== undefined) return;
    d({ t: 'seva-quiz-pick', id: m.id, picked: i });
    const right = i === m.quiz.answer;
    d({ t: 'seva-msg', msg: { id: uid(), from: 'seva', at: Date.now(), tone: 'quiz-answer', text: (right ? 'Right. ' : 'Not this one. ') + m.quiz.why } });
    Sound.hour(right);
  }

  function choose(m: Mind) {
    if (m === mind || thinking) return;
    d({ t: 'mind', mind: m });
    setLastVia(null); setLastErr('');
    Sound.hour(true);
  }

  async function send(raw?: string) {
    const text = (raw ?? input).trim();
    if (!text || thinking) return;
    setInput('');
    const push = (msg: SevaMsg) => d(mind === 'claros' ? { t: 'claros-msg', msg } : mind === 'dasha' ? { t: 'dasha-msg', msg } : { t: 'seva-msg', msg });
    push({ id: uid(), from: 'me', text, at: Date.now() });
    if (mind === 'dasha') {
      /* her own server answers, on her own model and tools; if it cannot be reached the page says so and adds nothing */
      hush();
      setThinking(true); setStep(''); setDraft('');
      const out = await askDasha(dashaTurns(log, text), { onStep: setStep, onText: setDraft });
      setThinking(false); setStep(''); setDraft('');
      setLastVia(null); setLastErr(out.text ? '' : 'unreached');
      const msg: SevaMsg = { id: uid(), from: 'dasha', at: Date.now(), tone: out.text ? 'live' : 'unreached',
        text: out.text ?? (out.error || 'Dasha could not be reached.'),
        ...(out.text ? { meta: { model: out.model, tools: out.tools, next: out.next, say: out.say, skills: out.skills } } : {}) };
      push(msg);
      d({ t: 'mind-ask', mind: 'dasha', lookups: out.tools?.length || 0 });
      Sound.hour(false);
      /* read aloud when that is on, or on a call; on a call the microphone opens again when she has finished */
      if (out.text && (aloudRef.current || call.current.on)) listen(msg, () => { if (call.current.on) hear(); });
      else if (call.current.on) endCall('The call ended because that answer did not arrive.');
      return;
    }
    if (mind === 'seva' && /(claros read|test me on the system|quiz me on the system)/i.test(text)) {
      let rr: ClarosRead | null = null;
      try { const f = resolveFocus(s, byId); rr = f ? readFocus(f, byId) : null; } catch { rr = null; }
      const n = s.sevaLog.filter(m => m.quiz).length;
      const qz = rr ? clarosQuiz(rr, n) : null;
      d({ t: 'seva-msg', msg: qz && rr
        ? { id: uid(), from: 'seva', at: Date.now(), tone: 'quiz', text: 'A question from what Claros read on ' + rr.focus.name.replace(/^The /, 'the ') + '.', quiz: qz }
        : { id: uid(), from: 'seva', at: Date.now(), tone: 'quiz', text: 'Claros has not read a system with you yet. Choose Claros above, give it a system, then ask me again.' } });
      d({ t: 'mind-ask', mind: 'seva' });
      Sound.hour(false);
      return;
    }
    setThinking(true);
    const history = [...log, { id: '', from: 'me' as const, text, at: 0 }]
      .filter(m => m.text)
      .slice(-20)
      .map(m => ({ role: m.from === 'me' ? ('user' as const) : ('assistant' as const), content: m.text }));
    const progress = progressDigest(s);
    let r = read;
    if (mind === 'claros' && focus && !r) { try { r = readFocus(focus, byId); setRead(r); } catch { r = null; } }
    const systems = mind === 'claros' && r ? clarosDigest(r) : '';
    const live = await requestCounsel({
      messages: history, progress, evolved: mind === 'seva' && s.sevaEvolved, guise: s.guise, mind, systems,
      /* only the direct routes use this; the shared route builds its own */
      system: buildSevaSystem(progress, mind === 'seva' && s.sevaEvolved, s.guise, mind, systems),
    }, s.provider);
    const reply = live.text ?? (mind === 'claros'
      ? clarosAnswer(text, r)
      : counsel(text, { steps: Object.keys(s.completedSteps).length, pages: Object.keys(s.completedPages).length, evolved: s.sevaEvolved, handle: s.handle }));
    setThinking(false);
    setLastVia(live.via);
    setLastErr(live.text ? '' : live.error || '');
    const day = mind === 'claros' && focus && (r || read) ? clarosDayFor(text) : null;
    push({ id: uid(), from: mind, text: reply, at: Date.now(), tone: live.text ? 'live' : mind === 'claros' ? 'model' : 'authored',
      ...(day && focus ? { card: { plan: day, focus: focus.key } } : {}) });
    if (mind === 'claros') {
      const moves = reply.split('\n').filter(l => /^\d+\.\s/.test(l) && VERB_RE.test(l));
      const best = moves.reduce((n, l) => n + (Number(l.match(/adding ([\d.]+) hours?/)?.[1]) || 0), 0);
      d({ t: 'mind-ask', mind, sys: (r || read)?.focus.name || focus?.name, moves: moves.length, best,
        verbs: moves.map(l => l.match(VERB_RE)![1].toLowerCase()), refused: /^I will not help attack/.test(reply) });
    } else d({ t: 'mind-ask', mind });
    Sound.hour(false);
  }

  if (ceremony && !s.sevaEvolved) {
    return (
      <div className="wrap">
        <section className="band center" data-keystone data-essence="#e8c46b">
          <div className="label" style={{ marginBottom: 16 }}>THE EMERGENCE</div>
          <RiseHead text={SEVAS_EMERGENCE.title} style={{ marginBottom: 'var(--s5)' }} />
          <div className="stack" style={{ textAlign: 'left', maxWidth: 640, margin: '0 auto' }}>
            {SEVAS_EMERGENCE.body.map((p, i) => (
              <p key={i} className="big-sec">{p}</p>
            ))}
          </div>
          <button
            className="btn btn-key btn-charge"
            style={{ marginTop: 'var(--s6)' }}
            onClick={() => {
              d({ t: 'seva-evolve' });
              d({ t: 'mind', mind: 'seva' });
              eng.fireMilestone('sevas-emergence');
              const line = SEVA_LINES.find(l => l.trigger === 'sevas-emergence');
              d({ t: 'seva-msg', msg: { id: uid(), from: 'seva', at: Date.now(), tone: 'sevas-emergence',
                text: line ? line.text : 'Seva walked beside you. Sevas walks with you. The difference is that from here, I assume you can carry it — and I will hand you heavier things.' } });
              setCeremony(false);
              Swarm.startle();
            }}
          >
            Meet Sevas
          </button>
        </section>
      </div>
    );
  }

  const Sigil = SIGILS[mind];
  const k = read?.R.keystone;
  /* Dasha's last answer, when it is the newest thing said: its suggested questions become the asks */
  sendRef.current = send;   /* the call asks through the same door as the keyboard */
  const lastDasha = mind === 'dasha' && log.length && log[log.length - 1].from === 'dasha' ? log[log.length - 1] : null;
  const asks = lastDasha?.meta?.next?.length ? lastDasha.meta.next : MINDS[mind].asks;
  const dashaLine = dstat ? 'Dasha ' + dstat.version + (dstat.model ? ' \u00b7 ' + modelName(dstat.model) : '') + ' \u00b7 DashSupport.Team' : 'Dasha runs at DashSupport.Team';
  const viaLine = lastVia === 'anthropic' ? 'answered by your Anthropic key'
    : lastVia === 'davara' ? 'answered by your Davara instance'
    : lastVia === 'shared' ? 'answered by the StepSAFE server'
    : lastErr ? (mind === 'claros' ? 'answered from the model’s readings' : 'authored counsel') + (lastErr === 'unconfigured' ? ', no live model connected' : ', the live model did not answer')
    : 'runs on ' + providerLabel(s.provider);

  return (
    <div className={'wrap minds m-' + mind}>
      <header className="minds-hero">
        <div className="minds-hero-subject" aria-hidden><Sigil size={168} thinking={thinking} /></div>
        <div className="minds-hero-text">
          <div className="label">YOUR UNITIUM MIND</div>
          <RiseHead text={name + '.'} />
          <p className="lede">
            {mind === 'dasha'
              ? 'The Dash Support Team\u2019s own mind. She answers from the live Dash docs, the governance ballot and the network, and says which she used.'
              : mind === 'claros'
              ? 'Reads a system with you: what it rests on, how a failure travels, and where one move holds the most. Every number comes from the model.'
              : s.sevaEvolved
                ? 'Counsel, not instruction. Sevas assumes competence and raises the standard.'
                : 'Mentor, coach, and educator. Every step you take, ' + sevaName + ' sees — and answers.'}
          </p>
          {mind === 'seva' && ready && (
            <button className="btn btn-key btn-charge" style={{ marginTop: 'var(--s3)' }} onClick={() => setCeremony(true)}>
              Something is different — see what
            </button>
          )}
        </div>
      </header>

      <div className="minds-pick" role="radiogroup" aria-label="Choose your Unitium Mind">
        {(['seva', 'claros', 'dasha'] as Mind[]).map(m => {
          const M = MINDS[m]; const S2 = SIGILS[m]; const on = m === mind;
          return (
            <button key={m} type="button" role="radio" aria-checked={on} className={'mind-card c-' + m + (on ? ' on' : '')} onClick={() => choose(m)} disabled={thinking && !on}>
              <span className="mind-card-sigil" aria-hidden><S2 size={56} /></span>
              <span className="mind-card-text">
                <strong>{m === 'seva' ? sevaName : M.name}</strong>
                <span className="mind-card-role">{M.role}</span>
                <span className="mind-card-traits">{M.traits.map(t => <i key={t}>{t}</i>)}</span>
              </span>
              <span className="mind-card-state">{on ? 'Speaking with you' + (m === 'seva' && guise ? ' · ' + guise.name.replace(/^Seva\s*\S\s*/, '') : '') : 'Choose'}</span>
            </button>
          );
        })}
      </div>

      <section className={'minds-stage s-' + mind + (thinking ? ' thinking' : '') + (full ? ' full' : '') + (rail ? ' rail-open' : '')} aria-label={'Conversation with ' + name}
        role={full ? 'dialog' : undefined} aria-modal={full ? true : undefined}>
        <div className="minds-bar">
          <span className="minds-bar-sigil" aria-hidden><Sigil size={34} thinking={thinking} /></span>
          <strong>{name}</strong>
          {full && (
            <span className="minds-switch" role="radiogroup" aria-label="The mind you speak with">
              {(['seva', 'claros', 'dasha'] as Mind[]).map(m => (
                <button key={m} type="button" role="radio" aria-checked={m === mind} className={'c-' + m + (m === mind ? ' on' : '')} onClick={() => choose(m)} disabled={thinking && m !== mind}>
                  {m === 'seva' ? sevaName : MINDS[m].name}
                </button>
              ))}
            </span>
          )}
          {mind === 'dasha' ? (
            <span className="minds-sees">{dstat ? modelName(dstat.model) + ' \u00b7 ' + dstat.tools.length + ' live tools \u00b7 ' + dstat.skills + ' skills' : 'Runs at DashSupport.Team'}</span>
          ) : mind === 'seva' ? (
            <span className="minds-sees">Sees your record: {Object.keys(s.completedSteps).length} steps · {rankOf(s.respect).name} · {s.streak} day streak</span>
          ) : (
            <label className="minds-focus">
              <span>Reading</span>
              <select value={focus?.key || ''} onChange={e => d({ t: 'claros-focus', focus: e.target.value || null })} aria-label="The system Claros reads">
                {!focus && <option value="">Choose a system</option>}
                {[...new Set(choices.map(c => c.group))].map(g => (
                  <optgroup key={g} label={g}>
                    {choices.filter(c => c.group === g).map(c => <option key={c.key} value={c.key}>{c.name}</option>)}
                  </optgroup>
                ))}
              </select>
            </label>
          )}
          <span className="minds-tools">
            <SessionClock clock={clock} mind={mind} />
            {full && (
              <button type="button" className={'minds-tool rail-tool' + (rail ? ' on' : '')} onClick={() => setRail(v => !v)} aria-pressed={rail} aria-label="Time with the minds">
                <svg viewBox="0 0 20 20" aria-hidden><path d="M4 16V9M8 16V5M12 16v-6M16 16V7" /></svg>
              </button>
            )}
            <button type="button" className="minds-tool" onClick={() => (full ? leaveFull() : enterFull())} aria-label={full ? 'Leave full screen' : 'Full screen'} title={full ? 'Leave full screen (Esc)' : 'Full screen'}>
              <svg viewBox="0 0 20 20" aria-hidden>{full
                ? <path d="M8 3v5H3M12 3v5h5M8 17v-5H3M12 17v-5h5" />
                : <path d="M3 8V3h5M17 8V3h-5M3 12v5h5M17 12v5h-5" />}</svg>
            </button>
          </span>
        </div>

        <div ref={logRef} className="minds-log" aria-live="polite">
          {log.length === 0 && mind === 'seva' && <p className="minds-empty">No words yet. {sevaName} is listening.</p>}
          {log.length === 0 && mind === 'dasha' && (
            <div className="minds-reading">
              <p className="minds-empty">Ask Dasha about wallets, masternodes, governance or building on Dash Platform.</p>
              <p className="minds-note">Your conversation with Dasha goes to {DASHA_HOST.replace(/^www\./, '')} and to the model she runs on. Your StepSAFE record stays on this device. She will not ask for a seed phrase or a private key.</p>
            </div>
          )}
          {log.length === 0 && mind === 'claros' && (
            read ? (
              <div className="minds-reading" aria-label={'Claros reads ' + read.focus.name}>
                <p className="minds-empty">Claros is reading <strong>{read.focus.name}</strong>. Here is what the model sees.</p>
                <div className="minds-tiles">
                  <div className="minds-tile"><span>The keystone</span><strong>{k ? read.nameOf(k) : 'None found'}</strong><em>{k ? (read.R.reach[k] || []).length + ' parts fall with it' : ''}</em></div>
                  <div className="minds-tile"><span>The stress day, bare</span><strong className="n">{Math.round(read.week.start * 10) / 10}<small> of 24 h</small></strong><em>{read.week.lessons.length ? 'a week of hardening takes it to ' + Math.round(read.week.end * 10) / 10 : 'no single move keeps more'}</em></div>
                  <div className="minds-tile"><span>The first move</span><strong>{read.week.lessons[0]?.name || 'None'}</strong><em>{read.week.lessons[0] ? 'at ' + read.nameOf(read.week.lessons[0].where) : ''}</em></div>
                </div>
              </div>
            ) : focus ? <p className="minds-empty">Claros is reading {focus.name}.</p> : (
              <div className="minds-reading">
                <p className="minds-empty">Give Claros a system to read: your own map, or one of the known systems.</p>
                <div className="minds-actions">
                  <button type="button" className="btn btn-sm" onClick={() => d({ t: 'route', view: 'modux', sub: 'gauges' })}>Map your own system</button>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => d({ t: 'route', view: 'modux', sub: 'systems' })}>See the known systems</button>
                </div>
              </div>
            )
          )}
          {log.map(m => (
            <div key={m.id} className={'minds-msg' + (m.from === 'me' ? ' me' : ' mind')}>
              {m.from !== 'me' && <span className="minds-msg-sigil" aria-hidden>{m.from === 'claros' ? <ClarosSigil size={26} /> : m.from === 'dasha' ? <DashaSigil size={26} /> : <SevaSigil size={26} />}</span>}
              <div className={'minds-bubble' + (m.tone === 'unreached' ? ' unreached' : '')}>
                {m.from === 'me' ? <p>{m.text}</p> : m.from === 'dasha' && m.tone !== 'unreached' ? <DashaText text={m.text} /> : <MsgText text={m.text} />}
                {m.from === 'dasha' && m.meta && (m.meta.model || m.meta.tools?.length) ? (
                  <p className="minds-src">{[m.meta.model ? modelName(m.meta.model) : '', m.meta.skills?.length ? 'skill ' + m.meta.skills.join(', ') : '', m.meta.tools?.length ? 'used ' + m.meta.tools.map(toolUsed).join(', ') : ''].filter(Boolean).join(' \u00b7 ')}</p>
                ) : null}
                {m.quiz && (
                  <div className="minds-quiz" role="group" aria-label={m.quiz.q}>
                    <p className="minds-quiz-q">{m.quiz.q}</p>
                    <div className="minds-quiz-opts">
                      {m.quiz.options.map((o, i) => {
                        const done = m.quiz!.picked !== undefined;
                        const cls = done ? (i === m.quiz!.answer ? ' right' : i === m.quiz!.picked ? ' wrong' : ' dim') : '';
                        return <button key={i} type="button" className={'minds-quiz-opt' + cls} disabled={done} onClick={() => answer(m, i)} aria-pressed={m.quiz!.picked === i}>{o}</button>;
                      })}
                    </div>
                  </div>
                )}
                {m.card && m.from === 'claros' && <MsgDay card={m.card} byId={byId} />}
                {(m.from !== 'me' && m.tone !== 'unreached' && (voiceOk || !!m.meta?.say || (m.from === 'claros' && m.tone === 'model'))) && (
                  <span className="minds-meta">
                    {m.from === 'claros' && m.tone === 'model' && <span className="minds-tag">From the model</span>}
                    {(voiceOk || !!m.meta?.say) && (
                      <button type="button" className={'minds-listen' + (voiced === m.id ? ' on' : '')} onClick={() => listen(m)} aria-pressed={voiced === m.id} aria-label={voiced === m.id ? 'Stop reading aloud' : 'Read this aloud'}>
                        <svg viewBox="0 0 20 20" aria-hidden>{voiced === m.id ? <rect x="6" y="6" width="8" height="8" rx="2" /> : <path d="M4 8v4h3l4 3V5L7 8H4zM13.5 7.5a3.5 3.5 0 0 1 0 5M15.5 5.5a6.4 6.4 0 0 1 0 9" />}</svg>
                        {voiced === m.id ? 'Stop' : 'Listen'}
                      </button>
                    )}
                  </span>
                )}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="minds-msg mind">
              <span className="minds-msg-sigil" aria-hidden><Sigil size={26} thinking /></span>
              <div className="minds-bubble">
                {mind === 'dasha' && draft ? <DashaText text={draft} /> : null}
                <p className="minds-wait">{mind === 'claros' ? 'Claros is reading' : mind === 'dasha' ? (step || (draft ? 'Writing the answer' : 'Dasha is working')) : name + ' is considering'}</p>
              </div>
            </div>
          )}
        </div>

        <div className="minds-asks" role="group" aria-label="Ask">
          {/* Dasha by voice: her replies read aloud, or a call. They sit first in the row, before her suggestions. */}
          {mind === 'dasha' && <button type="button" className={'minds-ask minds-voice' + (aloud ? ' on' : '')} onClick={toggleAloud} aria-pressed={aloud}>{aloud ? 'Reading replies aloud' : 'Read replies aloud'}</button>}
          {mind === 'dasha' && Hear && <button type="button" className={'minds-ask minds-voice' + (onCall ? ' on' : '')} onClick={() => (onCall ? endCall() : startCall())} aria-pressed={onCall}>{onCall ? 'End the call' : 'Start a voice call'}</button>}
          {asks.map(a => (
            <button key={a} type="button" className="minds-ask" disabled={thinking || (mind === 'claros' && !focus)} onClick={() => send(a)}>{a}</button>
          ))}
        </div>

        <div className="minds-compose">
          <textarea
            ref={inputRef}
            rows={1}
            value={input}
            onChange={e => { setInput(e.target.value); const t = e.target; t.style.height = 'auto'; t.style.height = Math.min(160, t.scrollHeight) + 'px'; }}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
            placeholder={mind === 'claros'
              ? (narrow ? 'Ask Claros' : 'Ask Claros about ' + (focus ? focus.name.replace(/^The /, 'the ') : 'a system'))
              : mind === 'dasha' ? (onCall ? (thinking ? 'Dasha is working' : voiced ? 'Dasha is speaking' : heard ? 'Listening' : 'On a call with Dasha') : narrow ? 'Ask Dasha' : 'Ask Dasha about Dash')
              : (narrow ? 'Ask ' + sevaName : 'Ask ' + sevaName + ' anything about the path')}
            aria-label={'Message ' + name}
            maxLength={4000}
          />
          <button type="button" className="minds-send" onClick={() => send()} disabled={thinking || !input.trim()} aria-label={'Send to ' + name}>
            <svg viewBox="0 0 24 24" aria-hidden><path d="M4 12h14M12 5l7 7-7 7" /></svg>
          </button>
        </div>
        {full && <aside className="minds-rail"><MindLedger sevaName={sevaName} compact /></aside>}
      </section>

      <div className="minds-foot">
        {mind === 'dasha'
          ? <span>{lastErr === 'unreached' ? 'Dasha could not be reached just now. A person on her team is at t.me/TheDashSupportTEAM.'
            : onCall ? 'On a call your browser turns your speech into text, and may use its maker’s online service for that. Her server sends each reply it reads to ElevenLabs as text.'
            : callNote || 'Your conversation with Dasha goes to her server. A reply read in her voice goes on to ElevenLabs as text. Your record stays here.'}</span>
          : mind === 'seva'
          ? <span>Progress to the emergence: {strongCount(s)}/12 StrongSteps · {Object.keys(s.completedPages).length}/6 Pages.</span>
          : <span>{read ? read.focus.name + ': ' + read.focus.gauge.system.nodes.length + ' parts, ' + read.focus.gauge.threats.length + ' pressures on its stress day.' : 'Claros reads one system at a time.'}</span>}
        {/* be honest about which mind just answered, and how */}
        {mind === 'dasha'
          ? <a className="minds-route" href={'https://' + DASHA_HOST + '/dasha'} target="_blank" rel="noopener noreferrer">{dashaLine}</a>
          : <button className="minds-route" onClick={() => d({ t: 'route', view: 'settings' })} title="Change where the minds run">{viaLine}</button>}
      </div>

      <MindLedger sevaName={sevaName} />
    </div>
  );
}
