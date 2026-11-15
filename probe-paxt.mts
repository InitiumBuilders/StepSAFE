/* PAXT in the browser, held to the reference implementation's vectors (scripts/paxt-vectors.json, written by the
   protocol folder's own tests), and the page's figures held to their own arithmetic.   npx tsx probe-paxt.mts */
import { readFileSync } from 'node:fs';
import { canon, digestOf, parseDoc, ballotLine, parseLine, LINE } from './src/motrus/paxt-core';
import { FIRST_PAXT_DOC, FIRST_PAXT_DIGEST } from './src/motrus/paxt-first';
import { PX, HIS_PAXT, LIST, SOURCES } from './src/motrus/paxt-copy';

const problems: string[] = [];
const ok = (c: boolean, m: string) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const V = JSON.parse(readFileSync(new URL('./scripts/paxt-vectors.json', import.meta.url), 'utf8'));

/* the document on the page is the draft, byte for byte, and hashes as the reference says */
ok(FIRST_PAXT_DOC === V.doc && canon(FIRST_PAXT_DOC) === FIRST_PAXT_DOC, 'the draft on the page is the reference draft, already in its one true form');
const d = await digestOf(FIRST_PAXT_DOC);
ok(d.full === V.digest && d.full === FIRST_PAXT_DIGEST && d.short === V.short, 'its hash in the browser is the reference hash (' + d.short + ')');
ok((await digestOf(FIRST_PAXT_DOC.replace(/\n/g, '\r\n') + '\n \n')).full === V.digest, 'Windows line ends and stray space do not change it');
ok((await digestOf(FIRST_PAXT_DOC.replace('111 votes', '11 votes'))).full !== V.digest, 'one changed word does');
const r = parseDoc(FIRST_PAXT_DOC);
ok(r.ok && r.terms.id === 'dash-keys-apart' && r.terms.kind === 'paxt' && r.terms.voice === 'voting' && r.terms.threshold === 111 && r.terms.options.join() === 'join,leave', 'it reads as a PAXT: voting keys, 111 votes, join or leave');
ok(ballotLine({ id: 'dash-keys-apart', choices: ['join'], digest: d.short }) === V.join && ballotLine({ id: 'dash-keys-apart', choices: ['leave'], digest: d.short }) === V.leave, 'the join and leave lines are the reference lines');
ok(V.lines.good.every((l: string) => parseLine(l) && LINE.test(l)) && V.lines.bad.every((l: string) => !parseLine(l)), 'every good line in the vectors reads and every bad one is refused (' + V.lines.good.length + ' and ' + V.lines.bad.length + ')');
ok((await digestOf(V.poll)).full === V.pollDigest && (await digestOf(V.election)).full === V.electionDigest, 'the poll and the election in the vectors hash as the reference says');
const poll = parseDoc(V.poll), el = parseDoc(V.election);
ok(poll.ok && poll.terms.parent === 'dash-keys-apart' && poll.terms.rule?.type === 'net' && poll.terms.electorate === 'partners', 'a poll inside the PAXT reads');
ok(el.ok && el.terms.seats === 6 && el.terms.pick === 6 && el.terms.voice === 'collateral', 'an election reads');
const refused = (doc: string) => !parseDoc(doc).ok;
ok(refused(FIRST_PAXT_DOC.replace('paxt1\n', 'paxt2\n')) && refused(FIRST_PAXT_DOC.replace('threshold: 111', 'threshold: 111\nbonus: 5')) && refused(FIRST_PAXT_DOC.replace('\n---\n', '\n')) && refused(FIRST_PAXT_DOC.replace('voice: voting', 'voice: telegram')), 'another version, an unknown header line, a missing rule of dashes and an unknown voice are each refused');
ok(ballotLine({ id: 'x-y-z/poll', choices: ['b', 'a', 'b'], digest: 'f'.repeat(32), rev: 3 }) === 'paxt1 x-y-z/poll a+b ' + 'f'.repeat(32) + ' #3', 'a ballot sorts its choices, drops a repeat and carries its revision');

/* the page's numbers agree with each other */
ok(LIST.regular + LIST.evo === LIST.enabled, LIST.regular + ' regular and ' + LIST.evo + ' Evo make ' + LIST.enabled + ' enabled');
ok(LIST.regular + 4 * LIST.evo === LIST.votes, 'at 1 and 4 votes they carry ' + LIST.votes);
ok(Math.floor(LIST.votes / 10) === LIST.tenth && LIST.tenth === LIST.coreThreshold, 'a tenth is ' + LIST.tenth + ', the threshold Dash Core reported');
ok(LIST.votingApart + LIST.sameOwnerVoting === LIST.enabled, LIST.votingApart + ' apart and ' + LIST.sameOwnerVoting + ' the same make ' + LIST.enabled);
ok(PX.first.apartLine.includes('77.4%') && PX.voice.tiles.map(t => t.v).join(' ') === '2,046 3,111 311 1,883', 'the page shows these same figures');
ok(Object.values(SOURCES).every(s => /^https:\/\//.test(s.url) && s.t.length > 3) && /^https:\/\//.test(LIST.source.url), 'every fact has a source with a link');

/* his names as he wrote them; my sentences plain */
ok(HIS_PAXT.name === 'PAXT' && HIS_PAXT.partners === 'PAXT Partners' && HIS_PAXT.dash === 'Dash PAXT' && HIS_PAXT.room === 'Telepaxt', 'his names are kept as he wrote them');
const words: string[] = [];
const walk = (x: unknown) => { if (typeof x === 'string') words.push(x); else if (Array.isArray(x)) x.forEach(walk); else if (x && typeof x === 'object') Object.values(x).forEach(walk); };
walk(PX);
const dash = String.fromCharCode(0x2014), ndash = String.fromCharCode(0x2013);
ok(words.every(w => !w.includes(dash) && !w.includes(ndash)), 'no dash is used as a connector in the page\'s words');
ok(words.filter(w => /^(https:|\/|#)/.test(w)).length >= 3 && words.every(w => !/\b(delve|testament|tapestry|pivotal|landscape|robust|seamless)\b/i.test(w)), 'none of the stock words');

console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
