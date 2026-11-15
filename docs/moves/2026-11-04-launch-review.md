# The next move: the Launch Review

Written 2026-11-04 as the prompt for the next StepSAFE session. Read it whole before touching a file.

## Progress

- 2026-11-04, Part 1 done for the checks that exist: all 24 statements carry a NIST CSF 2.0 category, a shelf
  life and sources read that day. Reading them found three treasury statements citing pages that did not support
  them (restore, rule, succession); each now cites Dash's recovery and governance docs or NIST SP 800-34.
- 2026-11-04, Part 2 begun: one engine by kind (`content/check/types.ts`, `index.ts`, `csf.ts`,
  `components/CheckRing.tsx`), a list of checks at the `check` route, and Accounts and access built, sourced and
  walked. It waits for August's review before the other three are built.
- 2026-11-04: the ring, the list and the accounts check shipped (5856a33), then Shown or Said (65a42bc).
- 2026-11-05, Parts 2 and 3 done: Code and releases, People and devices, and The worst day are built, sourced and
  walked (60 statements in all, 33 sources, 20 of the 22 CSF categories). The Launch Record is on the hub: the five
  rings in one row, the gaps deepest first across every check, "since the run before", and a Markdown record that
  carries each check in full. It is made from the sealed checks and leaves the device only by copy or save.
  Check milestones now show in the result instead of a toast over it.
- 2026-11-05, Parts 4 and 5 done: the loop (106 lesson links over 56 statements, re-check when done, lessons in
  the records) and the spine (60 pages by CSF function, on the hub and in probe-check; docs/SPINE.md lists the thin
  places for August). Shipped 2026-11-05 (8fa6c5c, qdqo0yn71) and walked on live. What remains of "Done
  means" is August's: the first Dash project to run it.

## The move

Turn StepSAFE from a course into the review every Dash project passes before it launches. The treasury check is
the first of five. Build the other four on the same engine (accounts and access, code and releases, people and
devices, the worst day), join all five into one sealed Launch Record a reviewer can read, and wire every gap back
into the lessons that teach its fix, so a second review shows what moved.

August's own lines name this. They come from the Outlier.Systems corpus, read on 2026-10-27; find their source file
and quote them character for character before they appear on any page:

> Write the ten-minute treasury checklist, signers, multisig and recovery, and make it the Verified review for every Dash Alive listing.

> Make one StepSAFE chapter a check every ecosystem project passes before launch.

## Why this is the strongest move

StepSAFE teaches at scale: 12 chapters, 60 pages, 352 steps (about 183 hours), 720 awards, the Modux catalog,
the gauges, 28 known systems, two minds and a 3D world. Until the treasury check, nothing in it changed a real
system. A review that projects run before launch, with gaps that lead to the lessons and a record that shows
progress, is a loop that hardens real treasuries. Every other part of the corpus becomes the way to close a gap.

## What is true today (check each before relying on it)

- Live: deployment cxmin01yc, commit 4b263d1 (the sealed check, list layout).
- Local and not shipped: the ring version of the check (CheckView, check.css, `short` labels, probe-check-walk.mjs,
  this file). It ships when August says "ship it". The auto-mode classifier blocks `scripts/ship.sh` without it.
- Checks live in the keyring (`lib/checkstore.ts`, `lib/keyring.ts`): held for the visit or sealed with the model
  keys. Never put a check in the main record.
- The corpus has 1,652 research notes and `probe-sources.mts` flags none, but only 45 carry a date they were
  checked. CSF and ATT&CK appear in the prose of about 28 files each; nothing maps the corpus to a framework.

Read first: `~/.claude/projects/C--Users-Initi/memory/stepsafe-praxis.md` (the Dash Defenders section and what
follows it), `src/content/check/treasury.ts`, `src/lib/check.ts`, `src/lib/checkstore.ts`, `src/views/CheckView.tsx`,
`probe-check.mts`, `probe-check-walk.mjs`, and the motivus-level LOG's newest entries.

## The build, in order (each part ships on its own)

**Part 0. Ship the ring.** Only after August's "ship it". Run `probe-check-walk.mjs` against the live site.

**Part 1. A truth ledger for the checks.** Every statement carries the date its facts were verified, its primary
sources, and a shelf life (90 days for vendor support facts such as wallet support, a year for protocol facts).
`probe-check.mts` fails a statement past its shelf life. Re-verify the twelve treasury statements first, at the
source, and record the date. Nothing goes in from memory.

**Part 2. Four more checks on one engine.** Generalise the check by kind: `content/check/<kind>.ts`, one scoring,
one record writer, one ring, one keyring store. Each new check has twelve statements in three parts, each mapped to
catalog structures and to one NIST CSF 2.0 category, each with a move and a weight, each sourced at primary
(Dash docs, DashSupport.Team, NIST, CISA, the vendor's own docs). Working names, his to rename:
- Accounts and access: domains, DNS and registrar, the code host's organisation, cloud and social accounts, phishing-resistant sign-in, recovery addresses.
- Code and releases: branch protection, signed releases, dependency review, CI secrets, deploy keys.
- People and devices: offboarding, device encryption and updates, the pressure call, shared passwords.
- The worst day: who decides, who to call, the written plan, the last restore test, what the community is told.

Build one check fully, through the walk and his review, before the other three.

**Part 3. The Launch Record.** One dated record from the five checks: each ring drawn small, the gaps deepest first
across all five, and a "since your last record" section showing what closed and what opened. Sealed like the
checks. It leaves the device only by the learner's own copy or save, and says so on its face.

**Part 4. The loop into the corpus.** Every statement names the steps, StepGuides and gauges that teach its fix,
by id, checked by a probe. A gap's move opens them. When those steps are done, the check offers a re-check of that
statement.

**Part 5. The spine.** Map the 60 pages and the five checks to the six CSF 2.0 functions (Govern, Identify, Protect,
Detect, Respond, Recover) by reading them, not by keyword. Show the coverage where a learner can see it, and write
a probe that prints it. Where the corpus is thin, list the gap for August; do not fill it in the same pass.

## The bar

- Davara Distinct V4 inside StepSAFE's own design layer: one figure per view (the ring family), solid tinted inks
  computed at 4.5:1 or better on all three themes, hairlines, small motion that means something.
- motivus-level before every ship; read its LOG first and append after.
- UNITIUM SAFE MODE for every record: name the asset and the adversary, label each control real or policy, attack
  it before it ships, and run each new security test against a mutant once.
- `probe-check-walk.mjs` grows with every check. Run all probes, probe-csp and the walk before every ship, then the
  walk again on live.

## Rules that do not bend

- His words verbatim, always. Plain wording in mine: no aphorisms, no em dashes, the humanizer on my copy only.
- Never open the wallet scripts, `.env` or `~/.config`; never print or deploy a key; no visitor tracking.
- No subagents unless he asks for them by name.
- Send an update after each part; never go dark on a long run.

## His decisions, not mine

- Whether the Launch Record becomes the Verified review for Dash Alive, and who sits on "the review panel for
  security claims".
- "The recovery policy every user must accept."
- The names of the four new checks, and whether any record is ever shared beyond the learner and their reviewer.

## Done means

Five checks live, each verified and dated at source; one Launch Record that shows change between two reviews;
every gap opening the lesson that closes it; the spine's coverage printed; every probe and the walk clean on live;
and a real Dash project, chosen by August, invited to run it.
