/* PROBE: the sources. Every research note on an award, every source line on
   a chapter and a guide, and every piece of evidence on a Modux model, in
   one document (docs/SOURCES.md) for a reading pass, with the risky ones
   flagged first:

     unnamed     says "studies show" or the like without naming who
     unsourced   a specific figure (a percentage, a multiple, a large count)
                 with no named source and no year anywhere in the note
     future      a year after the current one
     thin        a note too short to carry a claim

   The probe fails on a future year or a thin note. Unnamed and unsourced
   notes are listed for a person to read; a figure can be right without a
   name beside it, and only reading decides.

   THE RATCHET (2026-11-04). A note is linked when it carries the source it
   names as an https link with the day someone read it there (YYYY-MM-DD,
   not in the future). docs/TRUTH-RATCHET.json holds the counts: the number
   of linked notes may rise and never fall, the number without a link may
   fall and never rise, and the file tightens itself whenever the corpus
   improves. A malformed link or date fails the probe. The first 31 links
   came from the truth sample in docs/TRUTH-SAMPLE.md.
   Run: npx tsx probe-sources.mts */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

(globalThis as any).self = globalThis;
(globalThis as any).proto = {};
(globalThis as any).window = globalThis;
(globalThis as any).document = { getElementById: () => null, createElement: () => ({ getContext: () => null }), addEventListener() {}, removeEventListener() {}, hidden: false };

const { AWARDS, ALL_CHAPTERS, GUIDES, MODUX_MODELS } = await import('./src/content/index');

interface Link { url?: string; checked?: string }
interface Note { where: string; id: string; label: string; text: string; flags: string[]; links: Link[] }
const notes: Note[] = [];
const YEAR_NOW = 2026;
/* notes whose future years a person has read and kept: scheduled dates, and numbers that only look like years */
const REVIEWED_FUTURE = new Set([
  'award strong-regulatory-map', 'award aw-pq-ready', 'award oracle-closer', 'chapter ch-identity',
  'chapter ch-grc', 'guide sg-pqc-migration-field-note', 'guide sg-ai-governance-record-template',
  'model mm-crypto-post-quantum-migration', 'model mm-crypto-short-lived-secrets',
]);

const NAMED = /\b(19[5-9]\d|20[0-3]\d)\b|\b(Verizon|DBIR|Mandiant|M-Trends|CISA|NIST|NSA|FBI|ENISA|NCSC|SANS|OWASP|MITRE|ATT&CK|Google|Microsoft|Amazon|AWS|IBM|Ponemon|Gartner|Forrester|Sophos|CrowdStrike|Palo Alto|Unit 42|Cloudflare|Okta|GitHub|Chainalysis|Immunefi|Trail of Bits|OpenZeppelin|Ethereum|Bitcoin|Dash|Intuition|Anthropic|OpenAI|DeepMind|RAND|Meadows|Sterman|Perrow|Senge|Dekker|Vaughan|Hollnagel|Rittel|Kahneman|Tetlock|Hubbard|Bandura|Locke|Latham|Lally|Shostack|Schneier|Saltzer|Schroeder|Lampson|Anderson|Ross|Allspaw|Cook|Reason|Weick|Edmondson|Deming|Goodhart|Ashby|Beer|Conway|Nygard|SEC|Federal Reserve|Basel|GDPR|HIPAA|PCI|FIDO|W3C|IETF|RFC|ISO|IEC|UK|EU|Senate|Congress|Department|Agency|University|Institute|Journal|Review|Proceedings|Report|Survey|Index|Advisory|FIRST|EPSS|KEV|DIP|HHS|arXiv|NCC|ICML|USENIX|SolarWinds|Sigstore|Maersk|Wormhole|Ronin|Nomad|Beanstalk|Bybit|Halmos|Certora|OpenSSF|SEAL)\b/;
const UNNAMED = /\b(studies (show|have shown|found|suggest)|research (shows|has shown|suggests|found)|a study (found|showed)|surveys (show|found)|data shows|experts (say|agree)|it is well known)\b/i;
const FIGURE = /\b\d{1,3}(\.\d+)?\s?(%|percent)|\b\d+(\.\d+)?\s?(x|times)\b|\b\d{1,3}(,\d{3})+\b|\b\d+(\.\d+)?\s?(million|billion)\b/i;

function add(where: string, id: string, label: string, text: string, links: Link[] = []) {
  const t = (text || '').trim();
  const flags: string[] = [];
  if (t.length < 40) flags.push('thin');
  if (UNNAMED.test(t) && !NAMED.test(t)) flags.push('unnamed');
  if (FIGURE.test(t) && !NAMED.test(t + ' ' + label)) flags.push('unsourced');
  for (const m of t.matchAll(/\b(20[2-9]\d)\b/g)) if (parseInt(m[1], 10) > YEAR_NOW && !REVIEWED_FUTURE.has(where + ' ' + id)) { flags.push('future ' + m[1]); break; }
  notes.push({ where, id, label, text: t, flags, links: links.filter(l => l && (l.url || l.checked)) });
}

for (const a of AWARDS) if (a.research) add('award', a.id, a.name, a.research, a.researchLinks || []);
for (const c of ALL_CHAPTERS) for (const src of c.sources || []) add('chapter', c.id, src.label, src.note, [src]);
for (const g of GUIDES) for (const src of g.sources || []) add('guide', g.id, src.label, src.note, [src]);
for (const m of MODUX_MODELS) for (const ev of m.evidence || []) add('model', m.id, ev.label, ev.note, [ev]);

/* a link is good when it is https and dated on a real day that has already come */
const TODAY = new Date().toISOString().slice(0, 10);
const goodLink = (l: Link) => !!l.url && /^https:\/\/[^\s"]+$/.test(l.url) && !!l.checked && /^\d{4}-\d{2}-\d{2}$/.test(l.checked) && !isNaN(Date.parse(l.checked)) && l.checked <= TODAY;
const isLinked = (n: Note) => n.links.length > 0 && n.links.every(goodLink);

const flagged = notes.filter(n => n.flags.length);
const count = (f: string) => notes.filter(n => n.flags.some(x => x.startsWith(f))).length;

const lines: string[] = [];
lines.push('# Sources');
lines.push('');
lines.push('Every research note, source line and piece of evidence in StepSAFE :: The Praxis, generated by `npx tsx probe-sources.mts`. Flagged notes come first. A flag is a reason to read a note, not a finding that it is wrong.');
lines.push('');
lines.push('| Kind | Notes | Linked and dated | Unnamed | Unsourced figure | Future year | Thin |');
lines.push('|---|---|---|---|---|---|---|');
for (const w of ['award', 'chapter', 'guide', 'model']) {
  const ns = notes.filter(n => n.where === w);
  lines.push('| ' + w + ' | ' + ns.length + ' | ' + ns.filter(isLinked).length + ' | ' + ns.filter(n => n.flags.includes('unnamed')).length + ' | ' + ns.filter(n => n.flags.includes('unsourced')).length + ' | ' + ns.filter(n => n.flags.some(f => f.startsWith('future'))).length + ' | ' + ns.filter(n => n.flags.includes('thin')).length + ' |');
}
lines.push('');
lines.push('## Flagged, to read first');
lines.push('');
for (const n of flagged) lines.push('- **' + n.where + ' ' + n.id + '** · ' + n.label + ' · _' + n.flags.join(', ') + '_  \n  ' + n.text.replace(/\n+/g, ' '));
lines.push('');
lines.push('## Every source line, by kind');
for (const w of ['chapter', 'guide', 'model']) {
  lines.push('');
  lines.push('### ' + w);
  lines.push('');
  for (const n of notes.filter(x => x.where === w)) lines.push('- ' + n.id + ' · **' + n.label + '**: ' + n.text.replace(/\n+/g, ' ') + (isLinked(n) ? ' ([source](' + n.links[0].url + '), read ' + n.links[0].checked + ')' : ''));
}
mkdirSync('docs', { recursive: true });
writeFileSync('docs/SOURCES.md', lines.join('\n') + '\n', 'utf8');

const problems: string[] = [];
/* every link a note carries must be well formed: an https address and a day already passed */
for (const n of notes) for (const l of n.links) if (!goodLink(l)) problems.push(n.where + ' ' + n.id + ': a source link or date that is not well formed: ' + JSON.stringify(l));

/* the ratchet */
const RATCHET = 'docs/TRUTH-RATCHET.json';
const linkedNow = notes.filter(isLinked).length, unlinkedNow = notes.length - linkedNow;
const base = existsSync(RATCHET) ? JSON.parse(readFileSync(RATCHET, 'utf8')) : null;
if (base) {
  if (linkedNow < base.linked) problems.push('the ratchet: ' + linkedNow + ' notes are linked and dated, fewer than the ' + base.linked + ' held on ' + base.at + '. A link was lost; restore it.');
  if (unlinkedNow > base.unlinked) problems.push('the ratchet: ' + unlinkedNow + ' notes have no link, more than the ' + base.unlinked + ' held on ' + base.at + '. A new note needs the source it names, linked and dated.');
}
if (!problems.some(p => p.startsWith('the ratchet')) && (!base || linkedNow > base.linked || unlinkedNow < base.unlinked)) {
  writeFileSync(RATCHET, JSON.stringify({ at: TODAY, linked: linkedNow, unlinked: unlinkedNow, total: notes.length }, null, 2) + '\n', 'utf8');
}
for (const n of notes) {
  if (n.flags.includes('thin')) problems.push(n.where + ' ' + n.id + ': thin note: ' + JSON.stringify(n.text));
  const fut = n.flags.find(f => f.startsWith('future'));
  if (fut) problems.push(n.where + ' ' + n.id + ': ' + fut);
}
console.log('linked and dated ' + linkedNow + ' of ' + notes.length + (base ? ' (ratchet ' + base.linked + ' on ' + base.at + ')' : ' (ratchet set)'));
console.log('notes ' + notes.length + ' · flagged ' + flagged.length + ' · unnamed ' + count('unnamed') + ' · unsourced figure ' + count('unsourced') + ' · future ' + count('future') + ' · thin ' + count('thin'));
console.log('wrote docs/SOURCES.md');
console.log('\nPROBLEMS (' + problems.length + ')');
for (const p of problems.slice(0, 40)) console.log(' - ' + p);
process.exit(problems.length ? 1 : 0);
