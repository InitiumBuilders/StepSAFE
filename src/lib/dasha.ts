/* DASHA, THE THIRD MIND.

   Dasha is the Dash Support Team's own mind. She lives at DashSupport.Team with her own prompt, her own live
   tools (the Dash docs, the governance ballot, the network, Platform) and her own model, and all of that is kept
   current there. StepSAFE holds none of it. This file carries a question to her public endpoint and brings her
   answer back, with what she reports about it: the model that answered, the live sources she reached, and the
   questions she suggests next.

   What leaves this device: the conversation with Dasha, and one fixed note saying the question comes from
   StepSAFE. The learner's record, name and progress are never sent. Her server keeps no question or answer
   (its own stated rule); the model provider she runs on receives the conversation in order to answer it.

   Her router wakes her deeper mind on the command /Deep, which August gave her for that purpose. Every question
   from here carries it, so she answers on her current pro model each time. */

export const DASHA_HOST = 'www.dashsupport.team';
const API = 'https://' + DASHA_HOST + '/api/chat';

/** rides with every question: where it is asked from, and nothing about who asks */
const NOTE = 'Asked from StepSAFE :: The Praxis, a training world for security by systems design. The person is studying security and may be building on Dash.';

/* her own server gives an answer 108 seconds; a little longer here, then the wait is called */
const WAIT_MS = 125_000;

export interface DashaStatus {
  /** her mind's version, as her server reports it */
  version: string;
  /** the model her deeper mind runs on right now */
  model: string;
  tools: string[];
  skills: number;
  knowledge: number;
}

export interface DashaAnswer {
  text: string | null;
  /** the model that wrote this answer */
  model?: string;
  /** the live sources she reached for it */
  tools?: string[];
  /** what she suggests asking next */
  next?: string[];
  version?: string;
  /** the ticket her server gave this reply; her voice reads a reply only with its ticket */
  say?: string;
  /** the skills of hers that shaped this answer, as her server names them */
  skills?: string[];
  /** a sentence a person can read: her server's own words where it gave any */
  error?: string;
}

export interface DashaTurn { role: 'user' | 'assistant'; content: string }

/** her tools, said plainly while she uses them and under the answer that used them */
const TOOL_WORDS: Record<string, { now: string; used: string }> = {
  search_dash_docs: { now: 'Searching the Dash docs', used: 'the Dash docs' },
  web_search: { now: 'Searching the web', used: 'a web search' },
  dash_governance: { now: 'Reading the governance ballot', used: 'the governance ballot' },
  dash_platform: { now: 'Looking it up on Dash Platform', used: 'Dash Platform' },
  dash_network_stats: { now: 'Reading the network', used: 'the network status' },
  lookup_tx: { now: 'Looking up the transaction', used: 'a transaction lookup' },
  lookup_address: { now: 'Looking up the address', used: 'an address lookup' },
  load_skill: { now: 'Opening one of her skills', used: 'one of her skills' },
  team_record: { now: 'Reading the team record', used: 'the team record' },
  help_form_link: { now: 'Preparing a form', used: 'a help form' },
  dash_chain: { now: 'Reading Dash Core', used: 'Dash Core, live' },
  dash_masternodes: { now: 'Reading the masternode list', used: 'the masternode list' },
  dash_releases: { now: 'Checking the releases', used: 'the latest releases' },
  dash_dip: { now: 'Reading the DIP', used: 'a DIP' },
  verify_message: { now: 'Checking the signature', used: 'a signature check' },
  paxt_records: { now: 'Reading the PAXT record', used: 'the PAXT records' },
  merkle_weave: { now: 'Weaving the tree', used: 'a Merkle tree' },
  calculate: { now: 'Working the sums', used: 'exact sums by code' },
  platform_book: { now: 'Reading the Platform Book', used: 'the Platform Book' },
};
export const toolNow = (name: string) => TOOL_WORDS[name]?.now || 'Reaching a live source';
export const toolUsed = (name: string) => TOOL_WORDS[name]?.used || name.replace(/_/g, ' ');

/** "deepseek/deepseek-v4-pro-0813" reads "DeepSeek v4 pro" */
export function modelName(id: string | undefined): string {
  if (!id) return '';
  const m = /deepseek-(v[\d.]+)-(pro|flash)/i.exec(id);
  if (m) return 'DeepSeek ' + m[1] + ' ' + m[2].toLowerCase();
  return id.split('/').pop() || id;
}

let statusOnce: Promise<DashaStatus | null> | null = null;
/** who is answering, read from her own server once per visit; null when it cannot be reached */
export function dashaStatus(): Promise<DashaStatus | null> {
  if (!statusOnce) {
    statusOnce = fetch(API, { method: 'GET' })
      .then(r => (r.ok ? r.json() : null))
      .then(d => {
        if (!d || !d.ok) return null;
        const lib = d.mind?.library || {};
        return {
          version: String(d.mind?.version || '').replace(/\s*\(live\)\s*$/, ''),
          model: String(d.models?.pro || ''),
          tools: Array.isArray(d.tools) ? d.tools.map(String) : [],
          skills: Number(lib.skills) || 0,
          knowledge: Number(lib.knowledge) || 0,
        } as DashaStatus;
      })
      .catch(() => null);
    /* a failed read is tried again on the next visit to the page, not kept for the session */
    statusOnce.then(s => { if (!s) statusOnce = null; });
  }
  return statusOnce;
}

/** the question as it goes on the wire: her own command for her deeper mind first. A request for a person is
    left as written, because her server answers that one itself and only reads it at the start of the message. */
export function onWire(text: string): string {
  return /^\/human[-_ ]?support\b/i.test(text) ? text : '/Deep ' + text;
}

interface Final { reply?: string; model?: string; tools?: string[]; next?: string[]; version?: string; error?: string; say?: string; motion?: { skills?: string[] } | null }

function asAnswer(d: Final | null, ok: boolean): DashaAnswer {
  if (!d) return { text: null, error: 'Dasha could not be reached.' };
  if (!ok || d.error || typeof d.reply !== 'string') return { text: null, error: String(d.error || 'Dasha could not answer this time.').slice(0, 400) };
  /* the reply is kept exactly as she sent it: her voice reads a reply only when its text matches its ticket */
  return {
    text: d.reply.trim() ? d.reply : null,
    model: typeof d.model === 'string' ? d.model : undefined,
    tools: Array.isArray(d.tools) ? [...new Set(d.tools.map(String))].slice(0, 8) : [],
    next: Array.isArray(d.next) ? d.next.map(String).filter(Boolean).slice(0, 3) : [],
    version: typeof d.version === 'string' ? d.version : undefined,
    say: typeof d.say === 'string' && /^[A-Za-z0-9_-]{16,64}$/.test(d.say) ? d.say : undefined,
    skills: Array.isArray(d.motion?.skills) ? d.motion!.skills!.map(String).filter(x => /^\/[a-z0-9-]{2,30}$/.test(x)).slice(0, 2) : [],
  };
}

/* ---------- HER VOICE ----------
   Dasha's own voice is Honor, and it lives on her server: StepSAFE holds no key for it. Her server reads one of her
   replies aloud only when the reply comes back with the ticket it was given, so it cannot be asked to read anything
   else. What leaves this device for it: the text of that one reply and its ticket, and nothing of the learner's.
   Her server passes the text to ElevenLabs to make the sound. When her voice is off or out of reach, the caller
   reads the reply with the voice this device already has. */
const VOICE = 'https://' + DASHA_HOST + '/api/voice';
const QUIET = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQAAAAA=';
const dv: { run: number; audio: HTMLAudioElement | null; url: string | null; end: (() => void) | null } = { run: 0, audio: null, url: null, end: null };

/** a tap opens the way for sound that starts a moment later (a phone plays only what a tap began) */
export function primeDashaVoice(): void {
  try { const a = dv.audio || (dv.audio = new Audio()); a.src = QUIET; void a.play().catch(() => undefined); } catch { /* no audio here */ }
}

export function stopDashaVoice(): void {
  dv.run++;
  if (dv.audio) { try { dv.audio.pause(); } catch { /* already stopped */ } }
  if (dv.url) { URL.revokeObjectURL(dv.url); dv.url = null; }
  const end = dv.end; dv.end = null; end?.();
}

async function voicePart(text: string, say: string, part: number): Promise<{ blob: Blob; parts: number }> {
  const r = await fetch(VOICE, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, ticket: say, part }) });
  if (!r.ok) throw new Error('voice ' + r.status);
  const parts = Math.max(1, Math.min(12, Number(r.headers.get('X-Voice-Parts')) || 1));
  return { blob: await r.blob(), parts };
}

/** Read one of Dasha's replies in her own voice, part by part. Resolves true when it played or was stopped, and
    false when her voice could not be used at all, so the caller can read it another way. */
export function speakDasha(text: string, say: string): Promise<boolean> {
  stopDashaVoice();
  const run = dv.run;
  return new Promise<boolean>(resolve => {
    let settled = false;
    const finish = (ok: boolean) => { if (settled) return; settled = true; if (dv.end === stop) dv.end = null; resolve(ok); };
    const stop = () => finish(true);
    dv.end = stop;
    let next: Promise<{ blob: Blob; parts: number }> | null = null;
    const play = (i: number, got: { blob: Blob; parts: number }) => {
      if (run !== dv.run) return;
      if (dv.url) URL.revokeObjectURL(dv.url);
      dv.url = URL.createObjectURL(got.blob);
      const a = dv.audio || (dv.audio = new Audio());
      a.onended = () => {
        if (run !== dv.run) return;
        if (i + 1 >= got.parts) { finish(true); return; }
        (next || voicePart(text, say, i + 1)).then(g => play(i + 1, g), () => finish(true));
      };
      a.onerror = () => { if (run === dv.run) finish(i > 0); };
      a.src = dv.url;
      a.play().catch(() => { if (run === dv.run) finish(i > 0); });
      /* the next part is fetched while this one plays */
      next = i + 1 < got.parts ? voicePart(text, say, i + 1) : null;
      next?.catch(() => undefined);
    };
    voicePart(text, say, 0).then(g => play(0, g), () => { if (run === dv.run) finish(false); });
  });
}

/** Ask Dasha. `turns` is the conversation so far, ending with the learner's question. `onStep` hears what she is
    doing while she works; `onText` hears her words as she writes them (the finished answer replaces them). */
export async function askDasha(
  turns: DashaTurn[],
  hear: { onStep?: (label: string) => void; onText?: (text: string) => void } = {},
): Promise<DashaAnswer> {
  if (!turns.length || turns[turns.length - 1].role !== 'user') return { text: null, error: 'Nothing to ask.' };
  const messages = turns.slice(-20).map((m, i, all) => (i === all.length - 1 ? { role: m.role, content: onWire(m.content.slice(0, 5800)) } : { role: m.role, content: m.content.slice(0, 5800) }));
  const stop = new AbortController();
  const timer = window.setTimeout(() => stop.abort(), WAIT_MS);
  try {
    const r = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, stream: true, deltas: true, project: NOTE }),
      signal: stop.signal,
    });
    const type = r.headers.get('content-type') || '';
    /* a refusal before she starts (a limit, a malformed ask) is plain JSON with her server's own sentence */
    if (!type.includes('text/event-stream') || !r.body) {
      let d: Final | null = null;
      try { d = await r.json(); } catch { d = null; }
      return asAnswer(d, r.ok);
    }
    const reader = r.body.getReader();
    const dec = new TextDecoder();
    let buf = '', base = '', live = '', fin: (Final & { t?: string }) | null = null;
    const eat = (chunk: string) => {
      for (const line of chunk.split('\n')) {
        if (!line.startsWith('data:')) continue;
        let ev: Record<string, unknown> | null = null;
        try { ev = JSON.parse(line.slice(5)); } catch { continue; }
        if (!ev) continue;
        const t = ev.t;
        if (t === 'done' || t === 'error') { fin = ev as Final & { t?: string }; continue; }
        if (t === 'delta') { live += String(ev.text || ''); hear.onText?.((base ? base + '\n\n' : '') + live); continue; }
        if (t === 'round') { base = Array.isArray(ev.said) ? ev.said.map(String).join('\n\n') : ''; live = ''; hear.onText?.(base); continue; }
        if (t === 'tools' && Array.isArray(ev.tools) && ev.tools.length) {
          const names = [...new Set(ev.tools.map(String))];
          hear.onStep?.(toolNow(names[0]) + (names.length > 1 ? ', and ' + (names.length - 1) + ' more' : ''));
          continue;
        }
        if (t === 'read') hear.onStep?.('Writing the answer');
      }
    };
    for (;;) {
      const { value, done } = await reader.read();
      if (value) {
        buf += dec.decode(value, { stream: true });
        let i: number;
        while ((i = buf.indexOf('\n\n')) >= 0) { eat(buf.slice(0, i)); buf = buf.slice(i + 2); }
      }
      if (done) break;
    }
    if (buf.trim()) eat(buf);
    if (!fin) return { text: null, error: 'The answer was cut off on its way here.' };
    const f = fin as Final & { t?: string };
    return asAnswer(f, f.t === 'done');
  } catch (e) {
    const aborted = e instanceof DOMException && e.name === 'AbortError';
    return { text: null, error: aborted ? 'Dasha took too long to answer. Ask again in a moment.' : 'Dasha could not be reached. Check the connection and ask again.' };
  } finally {
    window.clearTimeout(timer);
  }
}
