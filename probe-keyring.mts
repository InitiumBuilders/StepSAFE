/* The keyring, attacked before it ships (lib/keyring.ts). Runs the real Web Crypto in Node with a stand-in
   localStorage and window, so every seal and open below is the same code the browser runs.
     npx tsx probe-keyring.mts */
const store = new Map<string, string>();
(globalThis as any).localStorage = { getItem: (k: string) => store.get(k) ?? null, setItem: (k: string, v: string) => { store.set(k, String(v)); }, removeItem: (k: string) => { store.delete(k); } };
(globalThis as any).window = { isSecureContext: true };

const K = await import('./src/lib/keyring.ts');
const { reducer, FRESH_PROVIDER, FRESH_VOICE } = await import('./src/lib/state.tsx') as any;
const FRESH = { provider: FRESH_PROVIDER, voice: FRESH_VOICE } as any;

const problems: string[] = [];
const ok = (c: boolean, m: string) => { console.log((c ? 'ok   ' : 'FAIL ') + m); if (!c) problems.push(m); };
const STORE = 'stepsafe-keys-v1';
const FAKE = 'sk-ant-probe-' + 'x'.repeat(40);
const anyStorageHas = (needle: string) => [...store.values()].some((v) => v.includes(needle));

ok(K.keyringStatus() === 'session' && !K.secrets().anthropicKey, 'a fresh device holds nothing and nothing is sealed');

K.setSecret('anthropicKey', FAKE);
K.setSecret('elevenKey', 'el-probe-' + 'y'.repeat(30));
ok(K.secrets().anthropicKey === FAKE, 'a pasted key is usable this visit');
ok(!anyStorageHas('sk-ant-probe') && !store.has(STORE), 'held for the visit, nothing reaches storage');

const rec = K.withoutSecrets({ ...FRESH, provider: { ...FRESH.provider, anthropicKey: FAKE, davaraToken: 'tok' }, voice: { ...FRESH.voice, elevenKey: 'el' } });
ok(rec.provider.anthropicKey === '' && rec.provider.davaraToken === '' && rec.voice.elevenKey === '', 'the record is saved with every secret blanked');

const s1 = reducer(FRESH, { t: 'provider', patch: { mode: 'anthropic', anthropicKey: FAKE, davaraToken: 'tok' } });
ok(s1.provider.mode === 'anthropic' && s1.provider.anthropicKey === '' && s1.provider.davaraToken === '', 'a key in a provider patch is ignored by the reducer');
const s2 = reducer(FRESH, { t: 'voice', patch: { mode: 'eleven', elevenKey: 'el-x' } });
ok(s2.voice.mode === 'eleven' && s2.voice.elevenKey === '', 'a key in a voice patch is ignored by the reducer');

ok(!(await K.sealWith('short')), 'a passphrase under ' + K.MIN_PASSPHRASE + ' characters is refused');
const PASS = 'correct horse battery staple';
ok(await K.sealWith(PASS), 'sealing with a good passphrase works');
const sealed = JSON.parse(store.get(STORE) || '{}');
ok(sealed.v === 1 && sealed.kdf === 'PBKDF2-SHA256' && sealed.rounds === 600000 && sealed.salt && sealed.iv && sealed.ct, 'the blob names its construction and round count: ' + sealed.kdf + ', ' + sealed.rounds);
ok(!anyStorageHas('sk-ant-probe') && !anyStorageHas('el-probe') && !anyStorageHas(PASS), 'storage holds no key and no passphrase in the clear');
ok(K.keyringStatus() === 'open', 'sealed and open');

const iv1 = sealed.iv;
K.setSecret('davaraToken', 'dv-probe-token');
await new Promise((r) => setTimeout(r, 50));
const iv2 = JSON.parse(store.get(STORE) || '{}').iv;
ok(iv1 !== iv2, 'a change while open reseals with a fresh nonce');

K.lock();
ok(K.keyringStatus() === 'locked' && !K.secrets().anthropicKey && !K.secrets().elevenKey, 'locked: nothing is usable until the passphrase');
ok(!(await K.unlock('wrong horse battery staple')), 'a wrong passphrase does not open them');
ok(K.keyringStatus() === 'locked', 'still locked after a wrong passphrase');
ok(await K.unlock(PASS), 'the right passphrase opens them');
ok(K.secrets().anthropicKey === FAKE && K.secrets().davaraToken === 'dv-probe-token', 'every key comes back, including one sealed while open');

K.lock();
const good = store.get(STORE)!;
const t = JSON.parse(good); const ct = t.ct; t.ct = (ct[0] === 'A' ? 'B' : 'A') + ct.slice(1);
store.set(STORE, JSON.stringify(t));
ok(!(await K.unlock(PASS)), 'a tampered blob is refused by the cipher (GCM tag), even with the right passphrase');
store.set(STORE, good);

const live = K.liveProvider({ mode: 'anthropic', anthropicKey: 'from-the-record', davaraToken: '', davaraUrl: '', model: 'm' } as any);
ok(live.anthropicKey === '', 'locked: a stale key in a record is never used in its place');
await K.unlock(PASS);
ok(K.liveProvider({ anthropicKey: '', davaraToken: '' }).anthropicKey === FAKE, 'open: the live config carries the keyring key');

K.forget();
ok(!store.has(STORE) && K.keyringStatus() === 'session' && !K.secrets().anthropicKey, 'forget removes the seal and the keys');

K.adoptLegacy({ anthropicKey: 'sk-ant-legacy-' + 'z'.repeat(30) });
ok(K.legacyMoved() && K.secrets().anthropicKey.startsWith('sk-ant-legacy'), 'a plain-text key from an older record is held for the visit and flagged');
K.forget();

/* ---------- the treasury checks: a treasury's weak points, held the way a key is ---------- */
console.log('-- treasury checks');
const C = await import('./src/lib/checkstore.ts');
const { load } = await import('./src/lib/state.tsx') as any;
const NAME = 'Probe Treasury Weakpoints';
const tick = () => new Promise((r) => setTimeout(r, 60));
store.clear();

C.newCheck('ck-one', NAME);
C.answerCheck('ck-one', 'two-agree', 'no', 12);
C.answerCheck('ck-one', 'seeds', 'unsure', 12);
ok(K.heldChecks().length === 1 && K.heldChecks()[0].answers['two-agree'] === 'no', 'a check made this visit is held');
ok(!anyStorageHas(NAME) && !anyStorageHas('two-agree') && !store.has(STORE), 'held for the visit, no answer and no name reaches storage');

ok(await K.sealWith(PASS), 'the check page can seal it with a passphrase');
await tick();
ok(store.has(STORE) && !anyStorageHas(NAME) && !anyStorageHas('two-agree') && !anyStorageHas('unsure'), 'sealed: storage holds the blob and no name or answer in the clear');
C.nameCheck('ck-one', NAME + ' renamed');
C.answerCheck('ck-one', 'restore', 'partly', 12);
await tick();
ok(!anyStorageHas('renamed') && !anyStorageHas('partly'), 'a change while open is resealed, never written plain');

K.lock();
ok(K.heldChecks().length === 0, 'locked: no check is readable on the page');
C.newCheck('ck-two', 'Made while locked');
ok(!anyStorageHas('Made while locked'), 'a check made while locked waits in memory, not in storage');
ok(!(await K.unlock('wrong horse battery staple')) && K.heldChecks().length === 1, 'a wrong passphrase opens nothing and keeps the visit check');
ok(await K.unlock(PASS), 'the right passphrase opens them');
const ids = K.heldChecks().map((c) => c.id).join(',');
ok(ids === 'ck-two,ck-one', 'the sealed check returns and the visit check joins it, newest first: ' + ids);
ok(K.heldChecks().find((c) => c.id === 'ck-one')!.answers.restore === 'partly' && K.heldChecks().find((c) => c.id === 'ck-one')!.project.endsWith('renamed'), 'a change made while open survived the lock');
await tick();
ok(!anyStorageHas('Made while locked'), 'the joined check is sealed with the rest');

K.lock();
const goodC = store.get(STORE)!;
const tc = JSON.parse(goodC); tc.ct = (tc.ct[5] === 'A' ? tc.ct.slice(0, 5) + 'B' : tc.ct.slice(0, 5) + 'A') + tc.ct.slice(6);
store.set(STORE, JSON.stringify(tc));
ok(!(await K.unlock(PASS)) && K.heldChecks().length === 0, 'a tampered seal is refused and shows no check');
store.set(STORE, goodC);
ok(await K.unlock(PASS) && K.heldChecks().length === 2, 'the untouched seal still opens');

/* a write still in flight when the page locks must not land, and must not throw */
const beforeFlight = store.get(STORE);
C.nameCheck('ck-one', 'In flight at the lock');
await Promise.resolve(); await Promise.resolve();
K.lock();
await tick();
ok(store.get(STORE) === beforeFlight && K.keyringStatus() === 'locked', 'a write in flight at the lock is dropped, not thrown: the seal is byte for byte the one before');
ok(await K.unlock(PASS) && K.heldChecks().find((c) => c.id === 'ck-one')!.project.endsWith('renamed'), 'the seal before the lock is intact and opens');

/* another tab */
C.removeCheck('ck-two');
await tick();
const twoTabs = store.get(STORE)!;
C.newCheck('ck-three', 'Only in this tab');
await K.adoptStorageChange(twoTabs);
ok(K.heldChecks().map((c) => c.id).join(',') === 'ck-one' && K.keyringStatus() === 'open', 'a newer seal written by another tab is read with the key this tab holds');
const moved = JSON.parse(twoTabs); moved.salt = (moved.salt[0] === 'A' ? 'B' : 'A') + moved.salt.slice(1);
await K.adoptStorageChange(JSON.stringify(moved));
ok(K.keyringStatus() === 'locked' && K.heldChecks().length === 0 && !K.secrets().davaraToken, 'a seal under a new passphrase from another tab locks this tab instead of being written over');
store.set(STORE, twoTabs);
await K.unlock(PASS);
await K.adoptStorageChange(null);
ok(K.heldChecks().length === 0 && !K.secrets().anthropicKey, 'forgotten in another tab: this tab lets go of its keys and checks too');
store.set(STORE, twoTabs);
await K.unlock(PASS);
K.forget();
ok(!store.has(STORE) && K.heldChecks().length === 0, 'forget removes the sealed checks with the keys');

/* what comes in from outside is cleaned */
const junk = K.cleanChecks([
  { id: 'ok-1', project: 'x'.repeat(500), answers: { 'two-agree': 'yes', seeds: 'maybe', '__proto__': 'yes', 'BAD KEY': 'no' }, at: 5, done: 'soon' },
  { id: '<script>', project: 'p', answers: {}, at: 1 },
  'not a check', null, 7,
]);
ok(junk.length === 1 && junk[0].project.length === 80 && Object.keys(junk[0].answers).join(',') === 'two-agree' && junk[0].done === undefined, 'a malformed check is cleaned: bad ids, answers and fields are dropped, the name clipped');
ok(K.cleanChecks({ not: 'a list' }).length === 0 && K.cleanChecks(Array.from({ length: 50 }, (_, i) => ({ id: 'c' + i, answers: {}, at: i }))).length === 40, 'not a list reads as none; a long list stops at forty');
const kinds = K.cleanChecks([{ id: 'k1', kind: 'accounts', answers: {}, at: 1 }, { id: 'k2', kind: '<img src=x>', answers: {}, at: 2 }]);
ok(kinds[0].kind === 'accounts' && kinds[1].kind === undefined, 'a run keeps its kind through the seal; a malformed kind is dropped');
const goodReading = { kind: 'domain-locks', subject: 'dash.org', url: 'https://rdap.publicinterestregistry.org/rdap/domain/dash.org', read: '2026-11-04', found: 'The transfer lock is set.', allows: 'partly' };
/* built through JSON.parse, as storage would hand it back, so "__proto__" arrives as an own key */
const ev = K.cleanChecks(JSON.parse(JSON.stringify([{ id: 'e1', kind: 'accounts', answers: {}, at: 1, evidence: { 'domain-lock': goodReading, 'two-agree': { ...goodReading, url: 'http://plain.example' }, 'lose-one': { ...goodReading, allows: 'certainly' } } }]).replace('"lose-one"', '"__proto__":' + JSON.stringify(goodReading) + ',"lose-one"')));
ok(ev[0].evidence?.['domain-lock']?.found === goodReading.found && Object.keys(ev[0].evidence || {}).join() === 'domain-lock', 'a reading survives the seal; a reading with a plain-http link, an unknown verdict or a bad key is dropped');
const scReading = { kind: 'scorecard-review', subject: 'github.com/dashevo/dashcore-lib', url: 'https://scorecard.dev/viewer/?uri=github.com/dashevo/dashcore-lib', read: '2026-11-05', found: 'Code-Review scored 5 of 10.', allows: 'partly', unseen: 'Scorecard reads the recent changes.' };
const sc = K.cleanChecks([{ id: 's1', kind: 'code', answers: {}, at: 1, evidence: { review: scReading, 'token-perms': { ...scReading, kind: 'scorecard-token', allows: 'open' }, signed: { ...scReading, kind: 'scorecard-anything' } } }]);
ok(sc[0].kind === 'code' && sc[0].evidence?.review?.allows === 'partly' && sc[0].evidence?.['token-perms']?.allows === 'open' && !sc[0].evidence?.signed, 'a Scorecard reading and an open one survive the seal; a kind the page does not read is dropped');

/* the plain-text record an earlier version wrote: moved out at the first read */
store.clear();
store.set('stepsafe-praxis-v1', JSON.stringify({ handle: 'R', checks: [{ id: 'legacy-1', project: NAME, answers: { 'two-agree': 'no' }, at: 9 }] }));
const loaded = load();
ok(!('checks' in loaded), 'the record read at start carries no checks');
ok(K.heldChecks()[0]?.id === 'legacy-1' && K.legacyChecksMoved(), 'the plain-text checks are held for this visit and flagged');
const saved = JSON.stringify(K.withoutSecrets(loaded));
ok(!saved.includes(NAME) && !saved.includes('two-agree'), 'the next save of the record has no check in it');

/* a restored file */
const restored = reducer({ ...FRESH, handle: 'R' }, { t: 'import', state: { handle: 'R', checks: [{ id: 'file-1', project: NAME, answers: {}, at: 1 }] } });
ok(!('checks' in restored), 'a record restored from a file never brings checks into the record');
K.forget();

console.log(problems.length ? 'PROBLEMS (' + problems.length + ')' : 'PROBLEMS (0)');
process.exit(problems.length ? 1 : 0);
