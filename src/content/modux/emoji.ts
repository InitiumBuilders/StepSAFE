/* THE MODEL EMOJI. One emoji for each of the 96 Modux models and one for each of the twelve families, so a structure
   can be found, remembered and written down in a single character. Each carries the reason it was chosen, in one line
   drawn from the model's own statement: the emoji is a way into the model, never a stand-in for it.

   The table (components/ModelTable.tsx) lays them out twelve families by eight models; the web, the stacks, the model
   pages and Find use them too, and Find takes an emoji as a search. Every emoji here is one character as people type
   it: no joined sequences, nothing newer than Emoji 13 (2020), so phones and laptops from the last five years draw them
   all. probe-modux.mts holds the set to that: 96 models, 96 distinct emoji, each shown in colour. */

import type { ModuxFamily } from '../modux-schema';

export interface ModelEmoji { e: string; why: string }

export const FAMILY_EMOJI: Record<ModuxFamily, ModelEmoji> = {
  identity: { e: '🆔', why: 'Who and what gets in.' },
  trust: { e: '🛂', why: 'The boundaries, and where trust is decided at each.' },
  crypto: { e: '🔐', why: 'Keys, custody, secrets and transparency.' },
  supply: { e: '📦', why: 'Build integrity and the software supply chain.' },
  detect: { e: '📡', why: 'Telemetry, detection and response.' },
  resilience: { e: '🌱', why: 'Failure, recovery, and growing back stronger.' },
  data: { e: '🗄️', why: 'Data governance and privacy.' },
  chain: { e: '⛓️', why: 'Blockchain, treasury, protocol and DAO security.' },
  ai: { e: '🤖', why: 'AI systems, agents and models.' },
  si: { e: '🎛️', why: 'Control structures for frontier and superintelligent systems.' },
  org: { e: '🏛️', why: 'Organisation, governance and coordination.' },
  systems: { e: '🔁', why: 'Systems thinking applied to security: loops, stocks and flows.' },
};

export const MODEL_EMOJI: Record<string, ModelEmoji> = {
  /* identity */
  'mm-identity-phishing-resistant-auth': { e: '🔑', why: 'A passkey: a key cut for one real site, so a lookalike site has nothing to turn.' },
  'mm-identity-zero-standing-privilege': { e: '⏲️', why: 'Admin rights run on a timer: granted for the task, gone when the time is up.' },
  'mm-identity-workload-identity': { e: '⚙️', why: 'Every service and machine carries its own identity, so secrets stop being copied around.' },
  'mm-identity-continuous-access-evaluation': { e: '🔄', why: 'A session can be cut the moment conditions change, not when its token expires.' },
  'mm-identity-relationship-authorization': { e: '🕸️', why: 'Access follows a web of relationships between people, groups and things.' },
  'mm-identity-break-glass': { e: '🚨', why: 'A sealed emergency way in that always works, and every use of it raises the alarm.' },
  'mm-identity-device-bound-session': { e: '📱', why: 'A session is tied to a key that stays on the device, so a stolen cookie works nowhere else.' },
  'mm-identity-verifiable-credentials': { e: '📜', why: 'Signed claims anyone can check, without calling whoever issued them.' },
  /* trust */
  'mm-trust-policy-enforcement-point': { e: '🚦', why: 'One place decides, and the signal at every crossing enforces it on each request.' },
  'mm-trust-context-aware-access': { e: '🧭', why: 'The answer depends on bearings: who, from what device, in what state, for what.' },
  'mm-trust-microsegmentation': { e: '🧱', why: 'Small walls between workloads, built around identity, so one host reaches almost nothing.' },
  'mm-trust-boundary-ledger': { e: '📒', why: 'A written ledger of every place where trust changes hands, and what is checked there.' },
  'mm-trust-confidential-computing': { e: '🦪', why: 'Data is worked on inside sealed hardware, like a pearl inside its shell.' },
  'mm-trust-object-capabilities': { e: '🎟️', why: 'Authority travels with the ticket you were handed; without it, nothing opens.' },
  'mm-trust-blast-radius-budget': { e: '💥', why: 'A set limit on how far any one credential, host or change can reach when it fails.' },
  'mm-trust-mutual-tls-mesh': { e: '🤝', why: 'Both sides prove who they are before anything passes between them.' },
  /* crypto */
  'mm-crypto-threshold-custody': { e: '🧩', why: 'The key is split into pieces, and no single piece can move the asset alone.' },
  'mm-crypto-hardware-root': { e: '⚓', why: 'Trust is anchored in silicon that software cannot rewrite.' },
  'mm-crypto-envelope-encryption': { e: '✉️', why: 'Each piece of data is sealed under its own key, and those keys are sealed by a master key.' },
  'mm-crypto-crypto-shredding': { e: '🗑️', why: 'Throw away the only key, and every copy of the data it locked is gone at once.' },
  'mm-crypto-post-quantum-migration': { e: '⚛️', why: 'Moving keys and signatures to algorithms a quantum computer cannot break.' },
  'mm-crypto-short-lived-secrets': { e: '⌛', why: 'Secrets run out within minutes or hours, so a leaked one is worthless before it can be used.' },
  'mm-crypto-transparency-log': { e: '🧾', why: 'An append only public record, like a receipt anyone can check later.' },
  'mm-crypto-witnessed-ceremony': { e: '👥', why: 'Root keys are made in a scripted event that several people witness and record.' },
  /* supply */
  'mm-supply-build-integrity-levels': { e: '🏗️', why: 'Builds graded in levels by what the build platform can prove about where an artifact came from.' },
  'mm-supply-sbom-and-exploitability': { e: '📋', why: 'A list of every part, marked with which known flaws can actually be reached.' },
  'mm-supply-keyless-signing': { e: '🔏', why: 'Signed and sealed with a certificate that lasts minutes, so there is no long lived key to steal.' },
  'mm-supply-reproducible-builds': { e: '🪞', why: 'The same source builds the same bytes anywhere, a mirror image anyone can compare.' },
  'mm-supply-dependency-cooldown': { e: '🧊', why: 'New package versions cool off for a set time before any build uses them.' },
  'mm-supply-paved-road': { e: '🛣️', why: 'The secure way to build is also the smooth, easy road.' },
  'mm-supply-secure-by-default': { e: '🛡️', why: 'The shield is up out of the box; the safe setting takes no action.' },
  'mm-supply-ephemeral-builders': { e: '✨', why: 'Every build starts on a fresh machine that is thrown away afterwards.' },
  /* detect */
  'mm-detect-detection-as-code': { e: '💻', why: 'Detections are written, versioned, reviewed and tested like any other code.' },
  'mm-detect-behaviour-over-indicators': { e: '🐾', why: 'Follow the tracks an attacker must leave, not the tools they can swap.' },
  'mm-detect-telemetry-tiers': { e: '📊', why: 'Each log source is kept hot, kept cold, sampled or dropped, by what it is used for.' },
  'mm-detect-deception-layer': { e: '🍯', why: 'Honeypots no real user would touch, so any touch is a signal.' },
  'mm-detect-hypothesis-hunting': { e: '🔍', why: 'Hunt from a stated hypothesis instead of waiting for an alert.' },
  'mm-detect-identity-first-triage': { e: '📇', why: 'Every investigation starts from the identity involved and what it can reach.' },
  'mm-detect-schema-normalisation': { e: '📐', why: 'Every log measured to one schema, so one detection covers every source.' },
  'mm-detect-verified-machine-triage': { e: '✅', why: 'Machines triage alerts, and every conclusion comes with the query and evidence to check it.' },
  /* resilience */
  'mm-resilience-chaos-experiments': { e: '🎲', why: 'Roll the dice on purpose: small, controlled failures that show how the system really breaks.' },
  'mm-resilience-immutable-backups': { e: '🗿', why: 'Backups set in stone, out of reach of every credential in production.' },
  'mm-resilience-cell-architecture': { e: '🚢', why: 'Split into cells like a ship’s compartments, so one fault floods only one.' },
  'mm-resilience-game-days': { e: '🏟️', why: 'Rehearse a failure or an attack on a set day, with the real team.' },
  'mm-resilience-blameless-review': { e: '🕊️', why: 'Ask what made the action reasonable at the time, not who to blame.' },
  'mm-resilience-error-budgets': { e: '🪙', why: 'An agreed allowance of unreliability to spend; when it runs out, reliability comes first.' },
  'mm-resilience-fail-safe-defaults': { e: '🛑', why: 'When a permission, signal or decision is missing, the system stops in the safe state.' },
  'mm-resilience-stress-to-control': { e: '💪', why: 'Stronger after every shock: each stress becomes a reviewed change to the controls.' },
  /* data */
  'mm-data-minimisation-at-source': { e: '🤏', why: 'Collect only a pinch: what the purpose needs, at the point it comes in.' },
  'mm-data-classification-tiers': { e: '🗂️', why: 'Data filed in a few tiers, each with handling rules that apply on their own.' },
  'mm-data-privacy-by-design': { e: '🕶️', why: 'Privacy is a design requirement from the first sketch, not added at the end.' },
  'mm-data-differential-privacy': { e: '🌫️', why: 'Every answer carries a measured fog of noise, so no single person can be picked out.' },
  'mm-data-retention-engine': { e: '🗓️', why: 'Every kind of data has a date it is deleted, and an engine keeps that date.' },
  'mm-data-tokenization-vault': { e: '🏦', why: 'The real values sit in one vault; every other system holds stand-in tokens.' },
  'mm-data-residency-boundaries': { e: '🗺️', why: 'Data stays inside the borders on the map it is allowed in, enforced by the platform.' },
  'mm-data-permanence-boundary': { e: '♾️', why: 'A line between what may be written somewhere permanent and what must stay erasable.' },
  /* chain */
  'mm-chain-multisig-governance': { e: '✍️', why: 'Several independent signers must sign before funds or contracts move.' },
  'mm-chain-timelock-and-guardian': { e: '⏰', why: 'Every privileged action waits out a delay, and a guardian can cancel a bad one.' },
  'mm-chain-circuit-breakers': { e: '⚡', why: 'Outflows trip a breaker past a set rate, so a drain stops short of everything.' },
  'mm-chain-formal-verification': { e: '🧮', why: 'The code is proven against its invariants for every input, by mathematics.' },
  'mm-chain-private-order-flow': { e: '🤐', why: 'A transaction stays quiet until it lands in a block, so no one can trade ahead of it.' },
  'mm-chain-treasury-tiers': { e: '🌡️', why: 'Hot, warm and cold layers, so the fast layer can be lost without the slow one following.' },
  'mm-chain-quorum-finality': { e: '🗳️', why: 'A block is final once a large quorum of staked nodes signs it.' },
  'mm-chain-credible-neutrality': { e: '⚖️', why: 'Rules that are simple, public and blind to who is playing.' },
  /* ai */
  'mm-ai-dual-model-pattern': { e: '🎭', why: 'Two roles: one model plans with tools and reads only trusted text; the other reads the rest and holds no tools.' },
  'mm-ai-capability-sandbox': { e: '🧰', why: 'An agent gets only the files, sites and commands its task needs.' },
  'mm-ai-weight-custody': { e: '💎', why: 'Model weights are the crown jewels, held so no one person or system can copy them out.' },
  'mm-ai-instruction-data-boundary': { e: '🚧', why: 'Text from outside stays behind the barrier as information, apart from the instructions.' },
  'mm-ai-eval-gates': { e: '🚪', why: 'A model goes through the door to its next stage only after it passes its tests.' },
  'mm-ai-agent-delegation': { e: '📛', why: 'Each agent wears its own badge, carries who authorised it, and holds less power than they do.' },
  'mm-ai-human-approval-gates': { e: '✋', why: 'A person sees the full picture and must consent before an action that cannot be undone.' },
  'mm-ai-training-provenance': { e: '🧬', why: 'The lineage of every dataset on record: source, licence, date and every change.' },
  /* si */
  'mm-si-capability-thresholds': { e: '📏', why: 'Lines measured in advance; a model that crosses one meets stronger safeguards.' },
  'mm-si-control-protocols': { e: '🕹️', why: 'Monitoring, editing and audits arranged so safety holds even if the model tries to get around them.' },
  'mm-si-out-of-band-halt': { e: '🔌', why: 'Pull the plug through a channel the system cannot see or touch: power, network, a hand.' },
  'mm-si-layered-autonomy': { e: '📶', why: 'Autonomy granted in levels, earned with evidence, and lowered on failure.' },
  'mm-si-interpretability-audit': { e: '🔬', why: 'Look inside the model for goals it was not asked to have.' },
  'mm-si-constitutional-classifiers': { e: '📘', why: 'Classifiers trained from a written constitution screen what goes in and what comes out.' },
  'mm-si-compute-governance': { e: '🖥️', why: 'Large scale compute is easy to see and hard to hide, so visibility and limits start there.' },
  'mm-si-weight-exfiltration-containment': { e: '⛔', why: 'Any copy of the weights leaving is made slow, visible and stoppable at the network edge.' },
  /* org */
  'mm-org-three-lines': { e: '🔱', why: 'Three prongs: those who own the risk, those who oversee it, and those who assure it independently.' },
  'mm-org-security-champions': { e: '🏅', why: 'A trained engineer inside each team who carries security into the daily decisions.' },
  'mm-org-two-person-integrity': { e: '✌️', why: 'Two authorised people for any action that could cause harm that cannot be undone.' },
  'mm-org-incident-command': { e: '📣', why: 'One named commander, clear roles, and deciding kept apart from doing.' },
  'mm-org-risk-in-ranges': { e: '📈', why: 'Risk as calibrated ranges of loss and their odds, not colours on a heat map.' },
  'mm-org-threat-informed-defense': { e: '🎯', why: 'Defenses aimed at how real adversaries attack organisations like yours.' },
  'mm-org-decision-rights': { e: '🖋️', why: 'It is written down who may accept which risk, block a release or grant an exception.' },
  'mm-org-security-commons': { e: '🌐', why: 'The shared security goods everyone depends on, funded and kept up as a commons.' },
  /* systems */
  'mm-systems-stock-and-flow': { e: '🛁', why: 'Exposure fills like water in a tub: count what has built up, and the rates in and out.' },
  'mm-systems-requisite-variety': { e: '🎨', why: 'A defense needs at least as many distinct responses as the disturbances it faces.' },
  'mm-systems-leverage-points': { e: '🪜', why: 'Where to push, rung by rung: from numbers at the bottom to goals and paradigms at the top.' },
  'mm-systems-layered-defenses': { e: '🧀', why: 'Every layer has holes; harm gets through only when the holes in every layer line up.' },
  'mm-systems-safety-two': { e: '🌻', why: 'Study how everyday work goes right, and strengthen the adjustments people already make.' },
  'mm-systems-decision-loop': { e: '🌀', why: 'Observe, orient, decide, act, in a loop where the picture you orient by decides the outcome.' },
  'mm-systems-loop-design': { e: '➰', why: 'Every goal gets a signal, a target, someone with authority, and a delay short enough to matter.' },
  'mm-systems-coupling-and-complexity': { e: '🧶', why: 'Tightly coupled, tangled systems turn small faults into cascades; add slack and simplicity.' },
};

/** one structure a day, the same for everyone on that day (Ground shows it): a stride of 37 through the catalog in id
   order, which meets every model once in 96 days and moves to another family each day */
export function modelOfTheDay<T extends { id: string }>(models: T[], now = new Date()): T | null {
  if (!models.length) return null;
  const ordered = [...models].sort((a, b) => a.id.localeCompare(b.id));
  const day = Math.floor((Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) - Date.UTC(2026, 0, 1)) / 86400000);
  const n = ordered.length;
  return ordered[(((day * 37) % n) + n) % n];
}

/** the emoji for a model, or '' when it has none */
export const emojiOf = (id: string): string => MODEL_EMOJI[id]?.e || '';

/** the model whose emoji this is, from text a person typed or pasted (with or without the colour selector) */
export function modelByEmoji(text: string): string | null {
  const bare = (s: string) => s.replace(/️/g, '').trim();
  const t = bare(text);
  if (!t) return null;
  for (const [id, x] of Object.entries(MODEL_EMOJI)) if (bare(x.e) === t) return id;
  return null;
}
