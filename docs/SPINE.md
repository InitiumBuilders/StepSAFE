# The spine: what the corpus teaches, by NIST CSF 2.0 function

Read on 2026-11-05 (the pages) and 2026-11-08 (the StepGuides). Each of the sixty pages of the twelve core chapters
was read, from its summary and its steps, for the function it teaches first and a second where it teaches two; each
of the sixty StepGuides was read for the function it teaches first (`src/content/check/spine.ts`). The sixty check
statements count by their CSF category. `probe-check.mts` prints this table on every run, and fails if a page or a
guide is not read; the hub shows it under the Launch Record.

| Function | Pages that teach it first | In part | StepGuides | Check statements |
|---|---|---|---|---|
| Govern (GV) | 14 | 7 | 17 | 5 |
| Identify (ID) | 12 | 5 | 12 | 7 |
| Protect (PR) | 20 | 3 | 17 | 35 |
| Detect (DE) | 7 | 2 | 6 | 3 |
| Respond (RS) | 6 | 3 | 7 | 7 |
| Recover (RC) | 1 | 1 | 1 | 3 |

## Thin places, for August

Each is a decision about what to write next. The four lessonless statements were filled on 2026-11-08; Recover and
the light Detect testing wait for August's call.

- **Recover is still thin.** One page teaches it first ("After", in The hour the building burns), one in part ("The
  extortion"), and one StepGuide, "Coming Back: Restore, Verify, Then Return", written 2026-11-08. The checks ask
  three Recover questions (rollback, restore checked, telling users).
- **The checks test Detect lightly.** Seven pages teach detection; three statements test it (DNS records watched,
  new certificates watched, a fast report). The checks lean on Protect: 35 of 60 statements.
- **The four statements that had no lesson now have one** (2026-11-08, `src/content/guides-launch.ts`): domain-lock
  and cert-watch open "Holding The Name"; hire-check opens "Who Is Joining"; never-ask opens "The Line You Publish".

## The loop

All 60 statements name the lessons that teach their move: 115 links to Steps, StepGuides, gauges and simulations,
each chosen by reading the lesson against the move. A gap's move opens them on the check page, the
records list them under each gap, and when every lesson for a gap is done the check offers to answer it again.
