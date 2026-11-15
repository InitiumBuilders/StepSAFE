/* WHERE SEVA'S MIND RUNS.

   Three routes, in the learner's control:

     shared    → POST /api/seva. The key lives only in the serverless function's
                 environment and never reaches this bundle. Default.
     anthropic → the learner's own key, sent browser-direct to api.anthropic.com.
                 It is never sent to the StepSAFE server, never logged by us, and
                 never leaves the device except to Anthropic.
     davara    → the learner's own Davara instance. The token goes only to the
                 URL they configured.

   The honest tradeoff, stated in the UI as well as here: a personal key stored
   in localStorage is readable by any script on this origin. That is the same
   trust boundary as the site itself, but it is weaker than a server-held
   secret. The upside is that the learner's conversation and key never transit
   our infrastructure at all. Whoever holds the key gets to choose. */

import type { ProviderConfig } from './state';
import { liveProvider, keyringStatus } from './keyring';

export interface ChatMsg { role: 'user' | 'assistant'; content: string }

export interface CounselRequest {
  messages: ChatMsg[];
  progress: unknown;
  evolved: boolean;
  guise: string | null;
  /** which of the two minds: Seva teaches, Claros reads systems */
  mind?: 'seva' | 'claros';
  /** the model's readings of the system in focus, sent as data */
  systems?: string;
  /** assembled mentor prompt — only used on the direct routes */
  system?: string;
}

export interface CounselResult {
  text: string | null;
  /** which route answered, for the UI to show honestly */
  via: 'shared' | 'anthropic' | 'davara' | null;
  error?: string;
  /** why the model stopped: end_turn, max_tokens, refusal */
  stop?: string;
  /** the request reached the model, whatever came back */
  reached?: boolean;
}

/* thinking is always on for the current models and spends from the same budget as the reply */
const MAX_TOKENS = 2400;

/** Options for a direct call: a different model, a longer reply, how hard to think,
    and a JSON schema the reply must follow (structured output on the Anthropic route). */
export interface DirectOpts { model?: string; maxTokens?: number; effort?: 'low' | 'medium' | 'high'; json?: Record<string, unknown> }

/** Never let a key or token reach a log, a toast, or an error string. */
function scrub(msg: string): string {
  return msg.replace(/sk-[A-Za-z0-9_-]{8,}/g, 'sk-…').slice(0, 200);
}

export function providerLabel(p: ProviderConfig): string {
  p = liveProvider(p);
  if (p.mode === 'anthropic') return p.anthropicKey ? 'your Anthropic key · ' + p.model : keyringStatus() === 'locked' ? 'your Anthropic key (locked; open it in Settings)' : 'your Anthropic key (not set)';
  if (p.mode === 'davara') return p.davaraUrl ? 'your Davara instance' : 'your Davara instance (not set)';
  return 'the StepSAFE server';
}

export function providerReady(p: ProviderConfig): boolean {
  p = liveProvider(p);
  if (p.mode === 'anthropic') return /^sk-/.test(p.anthropicKey.trim());
  if (p.mode === 'davara') return /^https:\/\//.test(p.davaraUrl.trim());
  return true;
}

async function viaShared(req: CounselRequest): Promise<CounselResult> {
  const r = await fetch('/api/seva', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      messages: req.messages, progress: req.progress, evolved: req.evolved, guise: req.guise,
      mind: req.mind || 'seva', systems: req.systems || '',
    }),
  });
  if (!r.ok) return { text: null, via: null, error: r.status === 503 ? 'unconfigured' : 'server ' + r.status };
  const data = await r.json();
  return { text: typeof data?.text === 'string' ? data.text : null, via: 'shared' };
}

async function viaAnthropic(req: CounselRequest, p: ProviderConfig, opts: DirectOpts = {}): Promise<CounselResult & { model?: string }> {
  p = liveProvider(p);
  const model = opts.model || p.model || 'claude-sonnet-5-5';
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': p.anthropicKey.trim(),
      'anthropic-version': '2023-06-01',
      /* required for calls made directly from a browser */
      'anthropic-dangerous-direct-browser-access': 'true',
    },
    body: JSON.stringify({
      model,
      max_tokens: opts.maxTokens || MAX_TOKENS,
      system: req.system,
      messages: req.messages,
      ...(outputConfig(opts) ? { output_config: outputConfig(opts) } : {}),
    }),
  });
  if (!r.ok) {
    let detail = 'HTTP ' + r.status;
    let type = '';
    try {
      const e = await r.json();
      if (e?.error?.message) detail = scrub(String(e.error.message));
      type = String(e?.error?.type || '');
    } catch { /* body was not json; the status is enough */ }
    /* a model that does not take structured output or effort: ask again without them */
    if (r.status === 400 && (opts.json || opts.effort) && /output_config|format|json_schema|effort|structured/i.test(detail)) {
      return viaAnthropic(req, p, { ...opts, json: undefined, effort: undefined });
    }
    /* the key may not have access to the requested model: fall back to the learner's own choice */
    const modelProblem = r.status === 404 || /model/i.test(detail) || type === 'not_found_error';
    if (opts.model && modelProblem && p.model && opts.model !== p.model) {
      return viaAnthropic(req, p, { ...opts, model: p.model });
    }
    return { text: null, via: null, error: detail };
  }
  const data = await r.json();
  const text = (data?.content ?? [])
    .filter((b: { type?: string }) => b?.type === 'text')
    .map((b: { text?: string }) => b.text)
    .join('\n')
    .trim();
  return { text: text || null, via: 'anthropic', model, stop: typeof data?.stop_reason === 'string' ? data.stop_reason : undefined, reached: true };
}

/** output_config for a direct call: effort, and the JSON schema the reply must follow */
function outputConfig(opts: DirectOpts): Record<string, unknown> | null {
  const oc: Record<string, unknown> = {};
  if (opts.effort) oc.effort = opts.effort;
  if (opts.json) oc.format = { type: 'json_schema', schema: opts.json };
  return Object.keys(oc).length ? oc : null;
}

/* The Davara contract, stated so an instance owner can satisfy it:
     POST <davaraUrl>
     Authorization: Bearer <davaraToken>
     body { system, messages: [{role, content}], max_tokens, model?, output_config? }
     200  { text: string }   — or an Anthropic-shaped { content: [{type:'text', text}], stop_reason? }
   Anything else is treated as a failure and falls back to authored counsel. */
async function viaDavara(req: CounselRequest, p: ProviderConfig, opts: DirectOpts = {}): Promise<CounselResult & { model?: string }> {
  p = liveProvider(p);
  const headers: Record<string, string> = { 'content-type': 'application/json' };
  if (p.davaraToken.trim()) headers.authorization = 'Bearer ' + p.davaraToken.trim();
  const r = await fetch(p.davaraUrl.trim(), {
    method: 'POST',
    headers,
    body: JSON.stringify({
      system: req.system,
      messages: req.messages,
      max_tokens: opts.maxTokens || MAX_TOKENS,
      model: opts.model || p.model || undefined,
      ...(outputConfig(opts) ? { output_config: outputConfig(opts) } : {}),
    }),
  });
  if (!r.ok) return { text: null, via: null, error: 'HTTP ' + r.status };
  const data = await r.json();
  const text =
    typeof data?.text === 'string'
      ? data.text
      : (data?.content ?? [])
          .filter((b: { type?: string }) => b?.type === 'text')
          .map((b: { text?: string }) => b.text)
          .join('\n');
  return { text: (text || '').trim() || null, via: 'davara', stop: typeof data?.stop_reason === 'string' ? data.stop_reason : undefined, reached: true };
}

/** Route a counsel request. Returns text:null on any failure so the caller can
    fall back to the authored line-book — Seva degrades, never goes silent. */
export async function requestCounsel(req: CounselRequest, p: ProviderConfig): Promise<CounselResult> {
  try {
    if (p.mode === 'anthropic' && providerReady(p)) return await viaAnthropic(req, p);
    if (p.mode === 'davara' && providerReady(p)) return await viaDavara(req, p);
    return await viaShared(req);
  } catch (e) {
    return { text: null, via: null, error: scrub(e instanceof Error ? e.message : 'request failed') };
  }
}

/** Features the learner pays for run only on their own key or their own
    Davara instance, never on the shared server key: the server refuses
    client prompts, and a learner's own ideas should not pass through it. */
export function directReady(p: ProviderConfig): boolean {
  return (p.mode === 'anthropic' || p.mode === 'davara') && providerReady(p);
}

export async function requestDirect(
  req: { system: string; messages: ChatMsg[] },
  p: ProviderConfig,
  opts: DirectOpts = {},
): Promise<CounselResult & { model?: string }> {
  if (!directReady(p)) return { text: null, via: null, error: 'no-direct-route' };
  const full: CounselRequest = { ...req, progress: null, evolved: false, guise: null };
  try {
    if (p.mode === 'anthropic') return await viaAnthropic(full, p, opts);
    return await viaDavara(full, p, opts);
  } catch (e) {
    return { text: null, via: null, error: scrub(e instanceof Error ? e.message : 'request failed') };
  }
}
