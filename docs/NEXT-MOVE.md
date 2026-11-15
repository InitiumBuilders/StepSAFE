# The next move: make StepSAFE provable

Written 2026-11-04 as the prompt for the next StepSAFE session. Read it whole before touching a file. The plan
it builds on, with its progress, is `docs/moves/2026-11-04-launch-review.md`.

## Progress

- 2026-11-04, Part 0: shipped (deployment c3p714trk, commit 5856a33); the walk passes on the live site.
- 2026-11-04, Part 1: the sample is read (docs/TRUTH-SAMPLE.md). 1 of 38 checkable notes failed, under the rule
  of four; 8 of 38 had something to correct. Six were corrected.
- 2026-11-04, Part 2: the ratchet is in probe-sources.mts. 33 of 1,654 notes are linked and dated; mutants that
  drop a link or date one in the future fail the probe.
- 2026-11-04, Part 3: three statements read public records (domain locks by RDAP; a treasury's m of n from
  insight.dash.org). The record marks Shown or Said; a contradiction is said plainly and the project chooses.
  Feasibility in docs/EVIDENCE.md.
- 2026-11-04: Parts 1 to 3 shipped (commit 65a42bc, deployment mvufivn53).
- 2026-11-05, Part 4: the three remaining checks are built with evidence from the start. Code and releases, People
  and devices, and The worst day hold 36 statements, each read at its source that day (NIST SP 800-218 and
  800-61r3, SLSA, GitHub's docs, OpenSSF Scorecard, Dash's docs, the FBI, SEAL 911, Apple). Seven code statements
  read a repository's published Scorecard results in one read. The Launch Record joins all five on the hub, with
  the gaps deepest first and what changed since each check's run before. A reading may now be open, neither backing
  nor limiting an answer, where the record cannot see far enough.
- 2026-11-05, the first plan's Parts 4 and 5: the loop and the spine. 56 of 60 statements name the lessons that
  teach their move (106 links, `content/check/learn.ts`); a gap's move opens them, the records list them, and done
  lessons offer a re-check. The sixty core pages are read for their CSF function (`content/check/spine.ts`), shown on
  the hub and printed by probe-check. Thin places for August in docs/SPINE.md: Recover (one page), Detect lightly
  tested, four statements with no lesson.
- 2026-11-05: all of it shipped (commit 8fa6c5c, deployment qdqo0yn71). The walk passes on live (102 checks),
  probe-csp is clean, and a real Scorecard read from the live site works (dashevo/dashcore-lib).
- 2026-11-08: the Launch shelf. Four StepGuides written for the thin places, each source read that day: domain
  locks, DNS and certificates; checking a new person; the never-ask line; and coming back after an incident (the
  first Recover guide). All 60 statements now open a lesson (115 links). The spine reads all 60 StepGuides as well.
  A corpus-wide fix: glossary links inside checklist items no longer break the line apart.
- 2026-11-08, later: the glossary, the guides and the deck in eleven subjects (`content/subjects.ts`). The terms
  were written across 77 domains; each domain now belongs to one subject, and every guide, model family, chapter,
  threat, room and incident has one too (probe-subjects.mts holds it). The glossary is a list beside the open term
  (`components/Glossary.tsx`, `styles/glossary.css`): search that ranks names first, the subjects, the letters,
  related terms, the Steps that teach a term, its card, and a phone screen with Back to the same place. The guides
  are grouped by subject; the deck filters by subject with its 139 domains grouped under each; the systems map is
  laid out in its own pixels so no label clips. probe-glossary-walk.mjs walks all of it (phone, three themes, CSP).
  They were first called shelves. StudyMode already has a Shelf tab (the learner's own saved cards) and the guides
  already come in shelves (the Systems shelf, the Launch shelf), so the word was renamed before it shipped.
- 2026-11-09: every term link made true. Until now a link to a word with no entry opened the nearest-sounding
  entry as if it were the answer: 263 of the Steps' 1,644 links did this, and most were wrong ("tier zero" opened
  Zero Trust, "legitimate interests balancing" opened Balancing Loop, "software composition analysis" opened
  Business Impact Analysis). 47 of the entries' own related links did the same. The resolver now reaches an entry
  only by its id, a spelling of its name, or another name recorded for it (`content/glossary-aliases.ts`, 74 names,
  each read against its entry). What changed with it:
  - 39 new entries for the words the Steps name most (`content/glossary-named.ts`), each written from the Steps
    that use the word; 17 carry the source an outside fact was read at that day.
  - Seven entries that repeated another were merged (HSM and Hardware Security Module, MTTD and Mean Time to
    Detect, KEV Catalog and CISA KEV, Normal Accident and Normal Accident Theory, Pseudonymisation and
    Pseudonymization, Threshold Signature and Threshold Signature Scheme, the two Blameless Postmortems). The
    retired ids still resolve, and a learner's study record moves to the kept card with its words, notes and tags.
  - One relation between terms and the corpus, read both ways (`lib/terms.ts`). A Step lists the entries it names
    and uses, each opening in place (`components/StepWords.tsx`); an entry lists the Steps that teach it and the
    Steps and guides that use it.
  - A word with no entry has its own page in the glossary. It says there is no entry and shows the entries that
    explain the phrase and the Steps and guides that use it, each with the sentence. On a Step such a word is a
    link only when the corpus says something about it beyond that Step.
  - StudyMode's Progress counts the record by subject, and each subject opens the deck on it.
  - probe-terms.mts holds it: resolved links may rise and never fall, links to no entry may fall and never rise
    (`docs/TERMS-RATCHET.json`), no link may resolve by a guess, and the cases that were wrong are tested by name.
  The numbers on 2026-11-09: 436 entries; 533 of 1,644 Step links reach an entry (364 before, with 263 guesses on
  top); 1,111 links name 1,070 words with no entry. Of those words the corpus explains 207 inside another entry,
  uses 217 in another Step or guide, uses 201 only where they are named, and 417 appear nowhere in its text.
  71 entries are not named or used by any Step or guide.
- 2026-11-09, the finishing touches. Find and the Deck search reach an entry by another name and say which name
  matched ("KEV Catalog, Also called CISA KEV"). In an entry's lists a Novus learner sees which places are Motus
  Steps. Span of Control gives FEMA's 2018 wording, one supervisor to five as a guideline to adjust, with its source
  (the 17th). On a phone Find fills the screen and there is no Esc key, so Find has a Close button; its key hints
  step aside there and Card is a full finger tall. Find's count had included the 38 known systems (1,074); it now
  counts the deck's 1,036 cards, as StudyMode does. In Meridian, Find's kind labels were close to invisible (STEP at
  1.05:1, every kind under 2.4:1); they are mixed into Meridian's ink now (lowest 5.9:1), and Mov's are lifted a
  little (lowest 5.6:1). probe-glossary-walk.mjs measures them in all three themes, and probe-glossary-webkit.mjs
  walks the glossary, a Step's words, Find and the deck in WebKit at iPhone 15 size. With the CPU slowed six times
  on a phone-sized screen, opening a Step is no slower than on live, and the glossary opens in about 1.0 s against
  about 2.0 s. The Span of Control award's research note still gives the older ICS range, three to seven with five
  as the optimum. It agrees with the entry on five and is left as written for August to keep or change.
- 2026-11-10: all of it shipped (commit 2527eba, deployment unitium-safe-bpjqp37uh). unitium-safe.vercel.app serves
  the build that passed the gate (the same entry script, index-6wy_ueQL.js). On live the glossary walk passes 98
  checks, the WebKit walk at iPhone 15 size 22, the check walk 104, and probe-csp is clean. "tier zero" on the live
  site opens its own page and no longer opens Zero Trust.
- 2026-11-10, later: the DNS read. The Accounts check's "DNS records are checked" statement reads the domain's name
  servers, addresses, mail servers and CAA from Google Public DNS (dns.google, the one host the policy gained). The
  reading is a dated copy that does not settle the answer; read again, in the same run or a later run of the check, it
  names each record added and removed since the reading before. The domain typed for the locks carries to it. The
  certificate read was dropped: Cert Spotter's reference allows unauthenticated queries for personal or evaluation
  purposes and asks a production site to authenticate, which needs a key and a server. Held by probe-check.mts (the
  real answers, mutants for a swapped name server, a TTL countdown, a hostile record, the keyring keeping what a
  reading held, the reading compared across runs) and probe-check-walk.mjs (108 checks).
- 2026-11-11: the phone floor, the gauges and the rooms (his "clean up all uiux ... better mobile ... drive hard the
  gauges and simulations ... actual usefulness"). Measured first, at 390 wide, on every page:
  - The floor. Labels rendered at 11.5px across the app (113 on The Practice alone) and small buttons at 39px; 30
    rules now give 12px or more, and `styles/touch.css`, loaded last, grows every small control to 44px on a touch
    or narrow screen. Long filter walls (Steps, the deck, the catalog, the hub) are one row that scrolls. The
    app's own bar is 44px. probe-touch.mjs walks 18 places and holds it: no sideways scroll, no text under 12px,
    no cut text, and no more small controls than docs/TOUCH-RATCHET.json records (16 left: 15 chart columns in
    Seva, one map node in Chapters).
  - A gauge. Picking starts from the threat: each card opens to the structures that hold it with what each costs,
    says what in the stack already holds it (by the rule the run uses, so the run agrees), and the dock counts
    "3 of 5 held" before a run. The dock is solid. Where the phone hid the cost pips, the cost is said in words.
    After a run the next action is in reach (Rebuild after a breach, Take It Up A Notch after a hold) and Rebuild
    returns to the threats, clear of the bar. A 1px sideways scroll on every gauge page is gone: on a phone the
    stack tray was `position: static`, so its glass rim wrapped the whole page. The hub's six tiles sit three
    across, so its tabs are on the first screen.
  - A room. The Practice shows a room on the first screen, marks where to start, and says readiness once for a
    chapter instead of on all 14 cards. The way in stays in a dock through a brief six screens long. The live room
    has a strip that holds under the bar (the room's clock, how far through, the score) and each new inject
    arrives beneath it. With no seat filled the room says so outright instead of offering "0 voices". The debrief
    names the chapter the room stands on, how much of it is done, and opens it.
  - UNIT ONE's web is drawn in the pixels of its own box, so a seat is 44px and its letters 12px on a phone (they
    were 15px and about 5px). The World no longer shows a two-letter title beside its tools on a narrow phone.
  - probe-play-walk.mjs plays a gauge and a room on a phone and a wide screen and holds all of it (55 checks).
  Shipped with the DNS read from 2026-11-10 (commit 7ee914b, deployment unitium-safe-88oggcf8d). On the live
  site the six walks pass (touch 73, play 55, check 108, glossary 98, WebKit 22, probe-csp clean) and a real DNS
  read works: five answers from dns.google for dash.org, nothing outside the policy.
- 2026-11-11, later: Back, rooms that keep their place, one decision, and the way from a landed threat.
  - Back and Forward. The app keeps its place in its own state and the address stays the same, so the browser's
    Back left the site: on a phone that is the back gesture, and in the installed app it closed the app.
    `lib/history.ts` gives each page a learner opens an entry in the tab's history with the route and how far the
    page was scrolled. Back returns to the page before, where it was left; Forward goes on. Find, the keys sheet
    and a gauge's world hold an entry while open, so Back closes them first, and a page chosen from Find is one
    step. A sub that names a place (a tab, a term, a deck, one decision) is kept in the entry; one that asks for
    something once (a ceremony, a question carried to Seva, a world opened on arrival) is not asked again.
  - Rooms keep their place. A room runs 55 to 90 minutes. `lib/roomProgress.ts` saves the live room after every
    move in its own key (`stepsafe-room-v1`), apart from the record. The brief of a room left part way says where
    and offers Continue or Start over, its card says In progress, and Ground puts it first. A decision already
    taken opens as answered and is not scored twice. A saved place is used only if every answer in it matches the
    room as written today. Start over keeps the old place until the new run makes its first move. The place is
    dropped when the room is finished, erased with the record, or thirty days old.
  - One decision. The Practice offers the opening of a room and its first call, a different room each day (an
    open one first), with its reading time. Nothing from it is recorded. It ends with Another one and Take the
    whole room. On a wide screen the card sits beside the heading; on a phone it is one slim row.
  - A gauge. After a run, a threat that landed has See what holds it, which returns to building with that
    threat's structures open, clear of the bar.
  - Haptics on a decision and on adding a structure, where the phone offers them (`lib/haptic.ts`).
  - probe-back.mjs walks Back, Forward, Find, a room left and resumed and one decision in a real browser;
    probe-room.mts holds the saved place to its word across all 14 rooms (211 places saved and read back, and the
    places it must refuse).
  Shipped (commit 22efd31, deployment unitium-safe-9rmnhg2jm). On the live site the seven walks pass: Back 40,
  touch 73, play 55, check 108, glossary 98, WebKit 22, and probe-csp clean.
- 2026-11-11, last: a tab bar on a phone.
  - On a phone the menu was a row pinned to the top that scrolled sideways through twelve places, out of the
    thumb's reach, and it took 65px of every screen. `styles/tabbar.css` (loaded just before touch.css) puts the
    four places a learner goes most in a bar at the bottom, under the menu's own names: Ground, Chapters, The
    Practice, Modux Models. More opens the other eight in a sheet that rises from the bar, with Find and the
    learner's Respect, Trust and Rank, which a phone had no place for. Nothing is pinned to the top of a page.
  - The sheet is the same `<nav class="nav">` the row and the rail are, restyled at 720px and under, so every walk
    that opens a page through `.nav button` still works. It closes on a tap above it, on Back, on Escape, or when
    a place is chosen; it takes the focus when it opens and hands it back to More. The tab of the page already
    open returns to its top.
  - Whatever a page pins to the bottom (a gauge's dock, a room's way in, the reader, a deck card's controls, the
    glossary's actions, a toast) sits above the bar, the end of every page clears it, and the bar and what is
    pinned to the top clear a phone's safe areas when the app is installed. Tablets keep the row on top and wide
    screens keep the rail.
  - Two traps. Each theme restyles the menu from `html[data-theme]:root`, which outranks a plain `.nav` rule, so
    the sheet's rules are written from `html:root body .shell > .nav`. And the row faded its right edge with a
    mask to say it scrolled; the sheet inherited the mask and lost its right 28px until it was cleared.
  - probe-tabbar.mjs walks it in a real browser at 390, 320, 900 and 1440 wide and in all three themes (49
    checks). The four walks that open Find now go through the sheet when the menu is put away.
  Shipped (commit d99b19b, deployment unitium-safe-cuo3wu8el). On the live site the eight walks pass: tab bar 49,
  Back 40, touch 73, play 55, check 108, glossary 98, WebKit 22, and probe-csp clean. The tab bar walk's first run
  on live, seconds after the deploy, logged one failed fetch of a page's script; the file serves, and the run
  after it passed whole.
- 2026-11-11, after that: the way in first, a second run beside the first, and toasts at the top edge.
  - On a phone The Practice puts the way in before its explanation. Under the title sits the room in progress with
    Continue, or the one decision; the lede follows (it is written once in the view and shown in one of two
    places). On a short phone the row had fallen below the first screen. Continue, there and on Ground, opens the
    room on the inject it was left on with no brief on the way (`route.sub: 'resume'`, set before the first paint).
  - A second run is set beside the first. A finished run leaves its choices in `stepsafe-room-last-v1`. The next
    debrief names the run before, with its score and how many decisions were taken cleanly (both worked out again
    from the room, so a number written by hand is ignored), and shows the choice made before under each decision
    that changed. The choices are dropped when the record is erased.
  - Toasts on a phone sit at the top edge. They were set 66px down to sit under the row; with the row gone they
    floated over a page's first lines. That shipped with the tab bar and was caught on the next screenshot, because
    the walk had read the style without firing a toast. It now fires a real one and measures where it lands.
  - probe-back.mjs: 52 checks. probe-play-walk.mjs: 59. probe-room.mts holds the run before to its word.
  Shipped (commit 4fe484e, deployment unitium-safe-hql46nptj). On the live site the eight walks pass: tab bar 49, Back 52, touch 73, play 59, check 108, glossary 98, WebKit 22, and probe-csp clean.
- The gate, as it stands after this day: `npx tsc --noEmit`; `npx tsx scripts/content-outline.mts --check`; every
  `probe-*.mts` (probe-wide.mts among them needs the local server up); then, one after another with the base
  address as the argument, `probe-tabbar.mjs`,
  `probe-back.mjs`, `probe-touch.mjs`, `probe-play-walk.mjs`, `probe-check-walk.mjs`, `probe-glossary-walk.mjs`,
  `probe-glossary-webkit.mjs` and `probe-csp.mjs`. It takes about 25 minutes. After a ship the same eight walks run
  against the live address.
- 2026-11-11, the last batch: nothing scrolls sideways on a phone, and every place has an address.
  - August, the same day: "some charts or some tables are kinda weird ... u shouldnt have to scroll too much to
    the right or left". `probe-wide.mts` opens every Step, guide, model, stack, gauge and page at 390 wide with
    every fold open (741 places). The first run found a table that scrolled sideways on 468 of them (every table
    was held to at least 480px), a code block on 161, three rows on each of 38 system maps, rows of chips up to
    twelve screens wide, and two pages that scrolled as a whole.
  - Tables. On a phone a table of three columns or more (344 of the 484) is read as one card for each row, every
    value under its column's name (`data-label`, `styles/reflow.css`). A table of two fits, with whole words in
    its first column. The markup carries table roles, so a screen reader still hears a table.
  - Code wraps. A metric puts its number above its meaning. A word too long for its line breaks
    (`.stage { overflow-wrap: break-word }`) instead of pushing the page.
  - A long row of chips for one choice is one native picker on a phone (`PhoneSelect` in components/bits.tsx,
    placed directly before the row it stands in for): 39 domains on Steps, 13 families in three places, the deck's
    kinds and tags, the 11 subjects of the guides and the glossary. The system map's rows, the commons' rocks and
    names, and Seva's suggestions wrap. The deck's pickers sit two to a row.
  - The Modux web is drawn in the pixels of its own box. Shrunk to a phone its families' names were about 6px and
    a node under 3px. On a narrow box the ring takes the width, the families are named in a legend, a touch lights
    the node nearest the finger, and a button opens it.
  - A trap the gate caught: letting a table cell keep whole words (`overflow-wrap: break-word`) stops a grid row
    from shrinking below its longest word, and a 42-character address pushed one page 25px wide. A stacked row
    sits in a `minmax(0, 1fr)` track and its cells may break anywhere.
  - Addresses. A place is named by the part after the #: `#/room/<id>`, `#/step/<id>`, `#/chapter/<id>`,
    `#/model/<id>`, `#/gauge/<id>`, `#/guide/<id>`, `#/glossary/<term>`, `#/models/<tab>`, `#/study/<tab>` and
    the plain pages (`addressOf` and `routeOf` in lib/history.ts). It is kept after the # on purpose: a browser
    does not send that part, so where a learner is in the app is in no server's logs. A reload opens the same
    place, an address opens cold in a new tab, a typed one is read, and one that names no place opens Ground and
    is put right. A first-time visitor follows a room's address to the welcome, takes a handle, and lands in
    that room. The tab carries the place's name. A room's brief has Share this room: the share sheet on
    a touch screen, a copied link with a mouse.
  - Only ids of the curriculum's own shape are let into an address (`SAFE`), what is asked for once (Continue, a
    world, a question to Seva) is left out of it, and a shared link's payload (`#g=`, `#r=`, `#p=`, `#s=`) is
    kept until it is read. probe-room.mts reads 747 places back from their own addresses and refuses 13 that
    must be refused. probe-back.mjs walks all of it (68 checks).
  Shipped (commit 5d1ebbd, deployment unitium-safe-8xrdwn51d). On the live site the eight walks pass (Back 68,
  tab bar 49, touch 73, play 59, check 108, glossary 100, WebKit 22, probe-csp clean) and so does the crawl: 741
  places, none scrolling sideways. The gate's first run failed one check, the WebKit walk's, which still expected
  the twelve subject chips on a phone; the check was brought up to date and passes.
  After the ship the crawl was run in the other two themes (`--theme=meridian`, `--theme=mov`). Meridian is
  clean. Mov had one page 2px wide: the heading of ol-dashsupport-team holds one word, "DashSupport.Team", wider
  than a phone in that theme's heading face, and a heading's words each sit in their own window and cannot break.
  Fixed the same day: a heading is set just small enough for its widest word to fit (`shrink` in
  components/RiseHead.tsx). The crawl is clean in all three themes, 741 places each.
  Shipped (commit f56d2f1, deployment unitium-safe-4sfs7zg76). On the live site: Back 68, tab bar 49, touch 73,
  play 59, glossary 100, check 108, probe-csp clean, and the crawl clean in Mov and Nocturne. The WebKit walk
  stopped at launch inside that job, while local walks were running beside it, and passed 22 of 22 run alone.
- 2026-11-11, night: every decision by itself, a link from every place, shortcuts.
  - One decision reaches every decision of every room: 104, where it had the first call of each of 14.
    `lib/oneDecision.ts` takes them in an order that changes room every time (the first call of each room, then
    the second of each), The Practice offers the call of the day, and Another one goes to the next. A decision out
    of the middle of a room shows the injects since the call before it, with The room so far folded above them.
    Its route is `{view:'sim', id, sub:'one-3'}` and its address `#/room/<id>/one-3`. Nothing from it is recorded.
  - A place's own link: `ShareLink` (components/bits.tsx) on a room's brief, a decision, a Step, a model and a
    chapter. The share sheet on a touch screen, a copied link with a mouse.
  - The installed app has four shortcuts (The Practice, Chapters, Modux Models, StudyMode), each an address.
  - The live room says its place is kept, beside Continue, once a save has held (`saveRoom` returns whether it
    did; a browser with storage blocked keeps the room in memory, and then the line is not shown).
  - probe-room.mts holds the order (every decision once, a new room nearly every time, every call's address read
    back: 837 addresses) and the shortcuts. probe-back.mjs opens a second decision by its address and shares a
    Step (71 checks).
  Shipped (commit 6018e21, deployment unitium-safe-422gp8fom) after the gate (38 of 38) and the crawl in Meridian
  and Mov (766 places each, a decision from the middle of every room among them).
  On the live site: Back 72, tab bar 49, touch 73, play 59, glossary 100, check 108, probe-csp clean, and the
  crawl clean on 766 places. The WebKit walk stopped at launch inside the job again and passed 22 of 22 run by
  itself against the live site.
- 2026-11-11, after that: from a debrief to a test, a run that can be sent, and a courtesy to a learner saving data.
  Live as cf5d332 (deployment unitium-safe-5nfvjcfwf). The gate passed with one walk corrected: the play walk
  named "the button in the From here panel", and there are now two. On the live site: Back 74, tab bar 49, play
  59, touch 73, probe-csp clean; the live page is the gated build, byte for byte.
  - A room's debrief has Test me on this chapter beside the button that opens the chapter: the same test a
    chapter's own page asks StudyMode for, on the chapter the room stands on.
  - Share this run sends the room's link with one line: the room, the score, and how many decisions were taken
    cleanly. `ShareLink` takes a `text` for that.
  - The rest of the curriculum (several megabytes) was fetched in the background 1.2 seconds after the app
    opened. For a learner whose browser asks to save data (`navigator.connection.saveData`) or who is on a 2g
    line, it is no longer fetched ahead: each page fetches what it needs when it is opened.
- 2026-11-11, after that: one decision on Ground, a card that moves on, the outcome in view after an answer,
  and one light on the tab bar.
  Live as 2c77c2c (deployment unitium-safe-eq09dgt6e); the live page is the gated build. On the live site:
  Back 78, tab bar 52, play 59, touch 73, WebKit 22, probe-csp clean.
  - After an answer the page moves to the outcome. On a phone the outcome is written under the options and was
    below the screen, with nothing on the screen changing but the options. The options show which was chosen and
    which was strongest for a moment, then the page rests with the outcome under the room's strip. A learner who
    has already scrolled or tapped is left where they are, and an answer restored from a saved place moves
    nothing (`components/DrillPlayer.tsx`). It holds wherever a decision is played: rooms, single decisions,
    Steps, Modux models and the review queue.
  - Ground offers one decision under its heading: the room, the minutes, and Take one. It is the card The
    Practice shows (`components/OneCallCard.tsx`), so the shortest way into practice is one tap from opening
    the app.
  - The card used to offer the same decision all day, taken or not. It now keeps a place in the order on the
    device (`stepsafe-one-v1`; `onePlace` and `tookOne` in `lib/roomProgress.ts`) and moves to the next decision,
    in another room, once the one on offer has been taken. A decision opened from a link leaves it where it was.
    Erasing the record forgets it.
  - Each room carries the minutes of each of its decisions (`calls`, worked out in `content/full.ts` by
    `callMinutes`). The outline keeps them, so the card is on Ground at the first paint, before the rooms' text
    has loaded, and nothing moves when the text arrives. The 104 decisions take from 2 to 5 minutes each.
  - The tab bar has one light (`.tab-light`, placed by `--tab-x` on the bar). It slides to the open tab, and to
    More while the sheet is open. The first placing is not a move. A tab gives a short tap in the hand on a
    phone that offers one.
  - The WebKit walk measured Find's Close at 64 by 43 once in the gate: the palette was still opening on a busy
    machine. Alone it measures 65 by 44. The walk now waits for the palette's animation to finish.
- 2026-11-11, after that: a sealed Step leads on, a chapter leads to its rooms, Ground opens the Step it names,
  and the options say which was chosen.
  - A sealed Step ends with the Step after it in its chapter: its Page, its kind, its minutes, its title, and
    Next Step (`stepAfter` in content/registry.ts). Once the Step is sealed the page moves to show that card
    whole. The last Step of a chapter ends with the way back to the chapter. Before this a sealed Step ended with
    a chip, and the way on was at the top of the page.
  - A chapter names the rooms of The Practice that stand on it, under its Pages (`.ch-rooms`). One tap opens a
    room at its brief. A room's debrief already pointed to its chapter, and nothing pointed back. Nine of the
    twelve chapters have a room.
  - After an answer the chosen option says You chose and the strongest says The stronger move, the words the
    debrief uses (`.opt-tag`). Before this the two differed by the colour of a border. The page waits 650ms before
    it moves to the outcome, so the words can be read.
  - On Ground the watch's Step row names the next Step and used to open its chapter. Once a chapter is under
    way it opens the Step itself. A chapter not yet begun still opens at its own page first.
- 2026-11-11, after that: Ground leads with the room left part way.
  Live with the entry above as 4d421f0 (deployment unitium-safe-izir38qan); the live page is the gated build. On
  the live site: Back 90, tab bar 52, play 59, touch 73, WebKit 27, probe-csp clean. In the gate the crawl flagged
  one place once (a system's map on the Microsoft Step, measured in the frame before it learned its width); the
  light and black crawls and a second crawl of all 491 Steps were clean, and the map is fixed in the entry below.
  - Rooms run an hour or more, so most learners come back to one. Ground now leads with it, as The Practice
    does: In progress, the inject it was left on, and Continue, which opens the room live on that inject. With no
    room in progress the card is one decision, as before. Both pages use one component (`WayIn` in
    components/OneCallCard.tsx).
  - Ground opens before the rooms' text has loaded, so each room now also carries its count of injects
    (`injectCount`, set in content/full.ts and kept by the outline), and the card names the place from the first
    paint. Once the text has loaded, the place is checked against the room as before.
- 2026-11-11, after that: the glossary waits for the rest of the curriculum, and a system's map takes its width
  before it paints.
  Live as 97c15a1 (deployment unitium-safe-m7ocn9r2y); the live page is the gated build. Measured on the live
  site, the first screen fetches 10 files and no glossary. On the live site: Back 90, tab bar 53, touch 73, WebKit
  27, probe-csp clean; the play walk passed 58 of 59 (see the next entry).
  - Measured on a phone-sized screen with no background fetch, Ground's first screen fetched 11 files, 2.87 MB of
    uncompressed script and style. One of them was the whole glossary (542 KB), because the learner's record
    reads the glossary's seven retired names as it loads, and the build kept those names in the glossary's chunk.
    The names now travel with what reads them (vite.config.ts), and the glossary arrives with the rest.
  - The tab bar walk checks what the first screen fetches: the glossary, the known systems, the rooms, the guides,
    the awards and the chapters wait for the rest.
  - The largest file left on the first screen is the Modux catalog (1 MB uncompressed, about 325 KB as sent). It
    loads at start by design: Modux courses compile into chapters that the lookups search. An outline for it,
    like the curriculum's (content/outline.gen.ts), would take about a third off the first screen. Done the next
    night: see below.
  - A system's map (components/SystemAtlas.tsx) drew once at 880 wide and then took its real width, so a phone
    showed a frame of it cut off at the edge. On a busy machine the phone crawl measured that frame once (the
    Microsoft Step, 554px past its edge). The map now reads its width before its first paint.
- 2026-11-12: a page opens with no request at the tap, and a page that stalls offers Try again.
  Live as e5b4ba1 (deployment unitium-safe-9caa3ck2f); the live page is the gated build, and /assets/ files now
  arrive as `public, max-age=31536000, immutable`. On the live site: Back 95, tab bar 53, play 59, touch 73, WebKit
  27, probe-csp clean. The 45-second idle before the debrief's chapter tap, which hung 2 of 3 runs before, opened
  the chapter 3 of 3.
  - After the last release the play walk's step "the debrief's button opens the chapter" hung on the live site in
    most runs: the chapter's two code files were requested and got no answer, with the service worker and
    without it, with QUIC and without it, while curl fetched both in 0.1 s from Vercel's edge cache in every
    encoding. A short session did not hang (0 of 7); 45 idle seconds before the tap hung it in 2 of 3. On this
    machine's network that night, a connection left idle for half a minute was dropped on the way without either
    end being told, and the next request sent on it waited. A phone on a carrier network can do the same.
  - Each page's own code is now fetched ahead, one page at a time when the browser is idle, after the rest of the
    curriculum (`PAGE_CODE` in App.tsx). A tap then needs no request. A learner saving data is not sent them.
  - A page still waiting for its code after eight seconds says so and offers Try again, which loads the same
    address again (`ViewWait` in App.tsx).
  - The hashed code files under /assets/ are now sent as kept for a year (vercel.json). Vercel sent them as
    `max-age=0, must-revalidate`, so every visit asked again about each one.
  - The Back walk checks all three: the pages under the tabs fetched ahead, a chapter opening with its file
    blocked, and Try again after eight seconds with the file left unanswered.
- 2026-11-12, after that: the Modux model texts wait for the rest of the curriculum.
  Live as 096d512 (deployment unitium-safe-eckk0hiiq); the live page is the gated build. On the live site: Back 95,
  tab bar 53, play 59, touch 73, WebKit 27, probe-csp clean; the first screen is 10 files, 1.55 MB uncompressed and
  about 405 KB as sent (about 863 KB as sent before the glossary moved). The model texts are 281 KB as sent and
  arrive in the background.
  - Ground's first screen fetched the whole Modux catalog, 1 MB of script, most of it the texts of 96 models
    (content/modux/models). What the first screen reads from a model is its name, family, tier and links: the
    gauges' arithmetic on Ground, the service record, the insights, and the welcome page's live gauge. The
    outline now carries those (`moduxModels`; a link keeps the model it joins and loses its sentence) and each
    Modux course's chapter by its titles (`moduxChapters`). The registry starts from them, and hydrate() fills
    them in place when the rest arrives. The texts, and the module that compiles them into chapters and projects
    (content/modux/index.ts), travel in their own chunk, `modux-models`.
  - Measured on a phone-sized screen with no background fetch, the first screen is 10 files and 1.55 MB of
    script and style. It was 2.33 MB the release before, and 2.87 MB before the glossary moved.
  - The registry holds the Modux lookups (moduxById and the rest) over its own objects. App, the engine,
    OwnSystem and ModuxView read them there. Scripts and probes that import content/modux/index still get the
    full catalog.
  - probe-outline checks the outline carries no model text and that filling gives the catalog back exactly, with
    the same objects. The tab bar walk holds the first screen without `modux-models`.
- 2026-11-12: the MOTRUS proposal page at /MOTRUS.
  Live as 1ff6a95 (deployment unitium-safe-loe809h51, shipped by that session on August's word); the live page is
  the gated build. On the live site: Back 95, tab bar 53, play 59, touch 73, WebKit 27, probe-csp clean, probe-motrus
  33. The first screen is 11 files: the 637-byte mark the menu's door shares with the page joined it.
  - Built by another session at August's request in a separate worktree (C:/Users/Initi/stepsafe-motrus, branch
    motrus) and merged into main as 5bff60b and 1ff6a95. It stands on its own: main.tsx loads src/motrus/mount by a
    dynamic import for /MOTRUS, /motrus and /ankras, so it is not part of anyone's first screen. The Praxis menu has
    a door to it (`a.nav-motrus`: under the name on a wide screen, after the places at 1080px and below, and in the
    phone's sheet). The lines marked HIS in src/motrus/copy.ts are August's, verbatim.
  - The gate on 1ff6a95: 29 of 29 without a server; tab bar 53, Back 95, touch 73, play 59, check 108, glossary 100,
    WebKit 27, probe-csp clean, and probe-motrus 33 (now in the walk list); the crawl clean on 766 places in all
    three themes.
- 2026-11-12, evening: the welcome page reads on a phone, and both pitch pages are hardened.
  Live as 07746f3 (deployment unitium-safe-fvajtjzke, shipped on August's word from the motrus worktree; main pushed
  4a861ed..07746f3). Gate on 07746f3: 38 of 38. On the live site the eight walks, probe-motrus and the welcome check
  are clean, each PROBLEMS (0).
  - Welcome (src/views/Lander.tsx, src/styles/lander.css): on a phone the system holds the top of the screen and each
    line rises in the band below it, then lifts away before it reaches the system (reading line at 92%, one chapter
    per 34svh, the last line released by .lxs-lift). The opening fades as the reading starts. Lines still to come wait
    below their windows, so scrolling back rewinds exactly. The faint discs in the field are drawn on wide screens
    only. welcome-check (scratchpad) walks the Sense at 390, 375, 430 and 1440: no visible word over the system.
  - /MOTRUS gains three sections (src/motrus/Defense.tsx, defense-copy.ts, defense.css): Built To Hold Under Pressure
    (eight attacks on the move, each stopped by a rule), Six Places MOTRUS Moves The System (Meadows' twelve leverage
    points, six lit), Thresholds Have Moved The World Before (the Montreal Protocol at 11 parties, the Paris Agreement
    at 55, the first MOTRUS at 5; sources in facts.ts). /ankras gains How A Card Stays True (four attacks on a card).
    The Gap's drawings are full width, the fork line in How A Card Learns no longer crosses its label, a panel's rim
    catches the pointer on a desktop, and a #link lands again once fonts settle.
  - The defenses are proposals written out in C:\Users\Initi\ankras\SPEC-FLOWS.md section 11, with a `guards` object
    in schema/motrus.schema.json, set in the first move; check.mjs: 111 cards, PROBLEMS 0.
  - Initium-Signium: /ankra now points at unitium-safe.vercel.app/ankras (255cd94, pushed to main and
    live on www.initium.builders as initium-signium-417byjg7p).
- 2026-11-12, later: the Ankras page at /ankras, and the MOTRUS page grown.
  Live as 947faf4 (deployment unitium-safe-9ec16yf4l, shipped on August's word from the motrus worktree after the
  StepSAFE session went quiet); the live page is the gated build. On the live site the eight walks and probe-motrus
  are clean, each PROBLEMS (0).
  - /ankras and /ankra open the card's own page (src/motrus/AnkrasPage.tsx): the anatomy of the real Multisig
    governance card, three layers, the sixteen relationship words with their Intuition ids, versions, three losses as
    Shown evidence, results combined in fives, TRUST rewards (a proposal) and the two genesis cards. /MOTRUS gains the
    walk from the room The Signature Was Valid to version 1.1.0, the terms of a move, August's United Systems Security
    Design Team (Your SoundMind Team; his statement verbatim in copy.ts as HIS.teams), four moves for the crypto
    industry and rewards in brief. Circles are SoundMind Teams throughout. Every number and its source is in
    src/motrus/facts.ts.
  - The gate on 947faf4: 38 of 38 (the outline check, the 28 probe-*.mts, then tab bar, Back, touch, play, check,
    glossary, WebKit, probe-csp and probe-motrus, which now walks both pages and both walk-throughs).
- Still missing, in order of what it would change for a learner: a pass on a real iPhone and a real Android
  (everything here was measured in Chrome's phone mode and in WebKit at iPhone size; docs/PHONE-PASS.md is the
  ten minutes to spend, step by step); a room taken in sittings,
  with places to stop; sync between devices, which needs a server and is August's call.
  Checked 2026-11-11 with `vercel env ls production`: the project has no environment variables, so
  `ANTHROPIC_API_KEY` is not set, api/seva.ts answers 503, and on the live site Seva and Claros answer from the
  authored line-book. Turning them on is August's: a monthly limit on the key's workspace first, then the key in
  Vercel's production environment, then a deploy.
- 2026-11-12, late: Dasha's eighteenth tool, `calculate`, has its words in the minds view ("Working the sums",
  "exact sums by code"). The MOTRUS walk now waits for each step's own frame, up to 2.5 s, where it used to
  pause 380 ms. On a laptop saving power, a browser that had just started drew 1 to 4 frames in its first two
  seconds, and the walk read the old frame. Measured that day: the page lights every step, most within 90 ms.
- 2026-11-14: a page that reads a token (his "keep moving on unitium-safe.vercel.app go beyond ... next major
  highest level steps"). Built and gated, not shipped: it waits for his word. "Read a token" is a working name, and
  the name is his to give.
  - What it does. `#/read` takes a token or contract id from Dash Platform and reads the public record: who holds
    each of nine powers (minting at will, burning, freezing and unfreezing a balance, destroying a frozen balance,
    pausing, the maximum supply, the resale market, the names) and who can change who holds it. It orders what a
    holder is trusting, deepest first, and each line names the field of the record it rests on and the Modux
    structures that answer it. It is shown evidence, like the reads in the checks, and it says what it could not
    read.
  - The engine (src/lib/onchain.ts) is pure. `parseContract` takes the explorer's contract record and its decoding of
    the transition that created the contract. A group is read as the fewest members whose power reaches what an
    action needs. `readContract` makes the three requests, and a token's own id finds its contract first.
  - A rule nobody can re-assign reads "Who holds this is fixed." When the power is given to "the main group" and
    that group can be replaced, it reads "Who holds this follows whichever group is the main group."
  - Said as the record allows and no further. Tokens are created four ways (minted at will, released by a
    schedule, claimed once by each identity, bought at a price the issuer sets) and the explorer's decoding carries
    the first rule and the schedule. So a closed minting rule reads "No One Can Mint At Will", and every token's reading names what
    the decoding leaves out: the purchase price rule, the once-per-identity claim, who may change the schedule or
    where new tokens go, whether the token can be sent at all, and its shielded pool. A rule that names "the main
    group" follows whoever may replace that group, and the reading says who that is. Sources, read that day: the
    Platform book for the four ways and the maximum, and the platform source for the main group
    (`can_apply_token_configuration_item`).
  - The drawing (src/components/TokenVessel.tsx). The supply is the level in a glass. A maximum is its rim, and
    with none the glass has no top. The pipe is minting at will: light moves in it when someone may mint today, a
    mark over the valve counts each key it takes, and a plug closes it when no one ever can. A second pipe under a
    clock is a schedule. A line across is the supply at creation.
  - Before a first reading the page shows two made-up tokens (src/content/onchain-example.ts), read by the same
    parser and named as made up: one held by a single key, one by a group of three with a fixed maximum.
  - Nothing is read until the visitor presses the button, an address that names a contract included
    (`#/read/<contract>`, with `/testnet` after it for testnet). A reading is kept for the visit only. Two hosts
    joined connect-src; docs/EVIDENCE.md has the test of the explorer.
  - Ways in: the address, Find, and a door under the five checks.
  - Held by probe-onchain.mts (410 checks: twelve real records in research/evidence/onchain/, mutants, hostile
    records, the two examples, the addresses, the hosts against vercel.json) and probe-read-walk.mjs (79 checks,
    with the explorer stood in for by the saved records: a phone, three themes, contrast, keys, Back, copy, save, an
    issuer who typed markup, the explorer down, the policy) and probe-read-webkit.mjs (17 checks in WebKit at
    iPhone 15 size). probe-touch.mjs walks the page as its nineteenth place and probe-wide.mts opens it among
    767. The three new probes are in the gate's list from here on.
  - One live read through the built page under the site's policy, of a testnet token, on the day. The same day the
    engine read every token on mainnet (there are five) and sixteen contracts from testnet off the live explorer:
    none threw and no holder was left unplaced. Six of the testnet contracts were ones the explorer could not
    decode, and their readings said so.
  - The gate on this build, all clean (06:28 to 06:55 CST, its fourth run of the day; each earlier run was
    followed by a wording or accuracy change, so it ran again): tsc and the outline; all 30 content probes; the crawl
    on 767 places in all three themes; walks tab bar 53, Back 95, touch 77, play 59, check 108, glossary 100,
    WebKit 27, probe-csp 7, probe-motrus 78, Dasha 26, Dasha voice 16, PAXT 32, read 79, read in WebKit 17.
    probe-room.mts pins the text of `place()` in history.ts and now names the new place.
  - Staged as a preview (unitium-safe-69rujsnw3-sourcecrowd.vercel.app): its files equal the gated build byte for
    byte, the read walk and probe-csp are clean there, and one real mainnet token was read through it from the
    live explorer in 2.1 s with no policy violation. A preview page carries Vercel's own toolbar script, which the
    site's policy refuses; the WebKit walk reports that one line there and nothing else. Production is unchanged.
  - Shipped at 07:01 CST on his "ship it and deploy it all crew!": commit 2b9accd, deployment
    unitium-safe-407hkohqm. The live page is the gated build byte for byte. On the live site: read 79, read in
    WebKit 17, probe-csp 7, touch 77, tab bar 53, Back 95, check 108, Dasha 26, each PROBLEMS (0), and one real
    mainnet token read from the live explorer in 2.2 s.
  - The push to the private repo waited one change. The repo's secret scan reads a field named `token` holding a
    long string as an assigned secret, and the two made-up tokens were written that way. The scan had passed
    before the ship only because it reads tracked files and these were new. The field is `tokenId` now. Run
    `node scripts/secret-scan.mjs` after `git add -A -n .` shows the new files, or stage them first.
  - With it, the same day: Dasha's nineteenth tool has its words in the minds view (`platform_book` in
    `src/lib/dasha.ts`: "Reading the Platform Book"). Her v2.15.0 went live at 07:03 CST.
  - That follow-up shipped at 08:12 CST: commit dbbbcbd, deployment unitium-safe-ne8n6ex6a, and its push carried
    2b9accd with it. The gate ran on the build first, 07:14 to 07:46. Two walks in it stopped on a timeout with no
    result line (glossary at 96 of 100, glossary in WebKit at 17 of 27): six sessions were working on this machine,
    others had headless browsers running, and about 1 GB of memory was free. Run again one at a time, with their
    whole output kept, both passed, 100 and 27. The live site is that build, 84 of 84 files. On it: read 79, read
    in WebKit 17, probe-csp 7, touch 77, tab bar 53, Back 95, check 108, Dasha 26, each PROBLEMS (0), and one real
    mainnet token read in 2.2 s. A walk that stops without a PROBLEMS line has thrown: keep its output and run it
    again alone before reading anything into it.
  - The tools that ran the gate and the checks after each ship are in `scripts/gate/` from today: `gate.sh` (the
    whole gate), `quiet-walk.sh` (one walk, its output kept, with a note of what else was running),
    `live-walks.sh` (the walks and one real read against production) and `same-as-dist.sh` (production against
    `dist`, file by file). `gate.sh` is the runner that ran five times that day, moved here; this copy has not yet
    run whole.
  - Next, if he wants it: a token's reading joined to the launch record as a sixth part, so an issuer hands a
    reviewer the rules read from the contract beside the five checks.
- 2026-11-14, afternoon: the trust layer, then StepSAFE's own record. Staged, not live: production waits for
  August's answers below and his word.
  - His ask: "get this to the usa government standard ... move like its an emergency". The finding given to him:
    the engineering held (strict headers, six shipped packages with no known flaw, no secrets in the bundle, keys
    sealed), but StepSAFE had none of the public promises a reviewer checks first. /.well-known/security.txt
    returned the app; there was no privacy or accessibility statement and no bill of materials. The offline worker
    also kept any page it fetched as the app, error pages included.
  - The trust layer: public/security.html (a disclosure policy on CISA's template), public/.well-known/security.txt
    (RFC 9116), privacy.html (every site the security policy allows, by name), accessibility.html, robots.txt,
    sbom.cdx.json (scripts/sbom.mjs: CycloneDX 1.5 with NTIA's minimum elements), the worker fix, a Settings
    section, probe-trust.mts. ship.sh refuses while public/ or src/ says [[SECURITY CONTACT]], while the bill of
    materials differs from the lockfile, and when OSV.dev lists a known flaw in a shipped package or cannot be asked
    (scripts/vulns.mjs). First gate on it: 49 of 49, 14:32 to 14:59.
  - StepSAFE's own record, at /trust for anyone (views/trustMount.tsx, routed in main.tsx before the welcome page)
    and at #/trust in the app (views/TrustView.tsx, lib/selfread.ts, content/own.ts, styles/ownrecord.css). One
    press reads, from the site: security.txt and its expiry, the app page's headers, every site the visit reached,
    what the browser keeps (names and sizes, whether keys are sealed, cookies), and the bill of materials; a second
    press asks OSV.dev. Then the release tests by name, StepSAFE's answers to its own Code and releases check (3 of
    12 hold, gaps first), and the federal list with sources read that day. probe-selfread.mts and
    probe-ownrecord-walk.mjs (the gate's fifteenth walk) hold it.
  - Two faults found by walking it as a reviewer would, both fixed before any report: the record sat behind the
    welcome page and a handle (hence /trust), and on its own it drew every unpanelled section under the body's
    fixed lattice layers while hit tests still found them. The walk now compares a picture of each spot with the
    element hidden, under reduced motion; it failed before the fix and passes after.
  - Facts read for the answers (gh api, 2026-11-14): the repository is private on GitHub's free plan, so branch
    protection and rulesets answer 403; Dependabot alerts are off; no workflows; commits unsigned.
  - Written for the attestation: docs/SSDF.md (all nineteen SSDF 1.1 practices, read from NIST's PDF that day: 2
    met, 14 in part, 2 not yet, 1 for August to confirm, and the shortest path to signing), docs/SECURITY-
    REQUIREMENTS.md (each requirement with the test that holds it), docs/RELEASE.md (the release and rollback steps
    the record says exist).
  - Waiting on August: the security contact address; five working days or CISA's three business days; the
    safe-harbor line; permission to download seven Latin font files (185,676 bytes, fonts.gstatic.com) to host them
    here; two-factor sign-in on GitHub and Vercel and disk encryption on the build machine (PO.5.2); whether to
    publish a public code mirror; and his word to ship.
  - A third fault, found by reading the record in the pane on the preview (7 of 9 there, 8 in the walk): Chrome
    lists a load the security policy refused, with no time, bytes or status, so the record said the visit
    "reached" vercel.live, Vercel's preview toolbar. splitLoaded() in lib/selfread.ts tells such loads apart, and
    the record now says the policy stopped them before they left the browser.
  - Gates: the trust layer alone, 49 of 49 (14:32 to 14:59); the record's first build, 51 of 51 (16:10 to 16:48);
    after the refused-load fix, 51 of 51 (16:57 to 17:30), on the build staged as unitium-safe-hnsrv6buj
    (/trust there reads 8 of 9; the gap is the placeholder contact). The walk passes against that preview too.
    The gated file list is in ~/outputs/stepsafe-trust-baseline/gated-final-dist.md5. Production is unchanged
    (ne8n6ex6a).
  - His answer, the same evening: "do all of those please ... let's get this sound and strong and shipped". So: the
    contact is August@Outlier.Systems (already public on motus.love; a security@ alias is a one-line swap in the
    four policy files when it exists); replies within three business days, CISA's figure; the safe-harbor line
    stands. The seven font files were downloaded from fonts.gstatic.com into a fresh folder, each checked as WOFF2
    at the size he was told (185,676 bytes in all), and now live in src/styles/fonts with src/styles/fonts.css;
    index.html and the security policy no longer name Google, the privacy page says the typefaces come from this
    site, and the bill of materials lists the files (13 components: 6 npm packages, 7 fonts; OSV.dev is asked
    about the packages only). A visit now reaches no outside site unless the learner presses for one.
  - Shipped 2026-11-14 at 20:29 CST: commit 00b7a26, deployment unitium-safe-94jvcvms5. The gate on that build:
    51 of 51 (20:01 to 20:28). Production is that build, 101 of 101 files.
  - Not settled by that answer, so still his: two-factor sign-in on GitHub and Vercel and disk encryption on the
    build machine (PO.5.2; the GitHub API does not show this sign-in its own two-factor state); which public code
    mirror, if any (the repository holds the curriculum, docs that name him, and home paths in 25 files); and the
    Seva key's monthly limit in the Anthropic Console.
  - Live walks after the ship, against production: read 79, read in WebKit 17, probe-csp 7, touch 81, tab bar 53, Back
    95, check 108, Dasha 26, the own record 60, each PROBLEMS (0), and a real mainnet token read in 1.7 s. /trust on
    production reads 10 of 10 with OSV.dev asked, and the visit reached no other site.
  - The same night, his "do all of those" taken through the rest:
    - Accessibility: probe-a11y.mjs (not in the gate; it reports) audits 24 places against the WCAG 2.2 criteria a
      machine can test. Four failures, fixed: titles for #/check and #/read, Seva's Key toggle 23 pixels wide, the
      reading-speed slider 16 pixels tall. Two more from the code: the manifest locked the installed app to portrait
      (now any), and the one-key shortcuts (/ ?, and L and 1 to 4 on a study card) had no way off (Settings has one
      now; probe-keys walks it, in the gate, so sixteen walks). Left as advice: heading levels jump on 10 places.
      docs/ACR.md is the draft conformance report; it cannot be issued until the screen-reader review settles its
      "Not yet evaluated" rows.
    - The first Launch Record readings, for DashSupport.Team, read through StepSAFE's own engine:
      ~/outputs/launch-records/dashsupport-team-2026-11-14.md (private; it lists weak points). Update lock off at
      Squarespace, no CAA record, registration to 2027-06-24, DNSSEC on, no Scorecard results for Dasha-AI. The
      statements no record shows are his to answer on #/check.
  - The accessibility release shipped at 21:27 CST on his "okay deploy it fammmm": commit 648f3e1, deployment
    unitium-safe-oftlf5xzh, gate 52 of 52 (21:00 to 21:26), production 101 of 101 files the same as the build.
  - The public copy, on his "Everything public" (asked plainly that it cannot be undone): github.com/InitiumBuilders/
    StepSAFE, from this repository's HEAD by scripts/mirror.sh. research/outlier stays out: its brief says the full
    entries are private security assessments of real systems, his own live sites among them, and never ship. The
    script also runs the secret scan and a privacy scan on the copy. On the public repository: Dependabot alerts,
    secret scanning with push protection, main protected against force pushes and deletion (admins included), and
    the Scorecard workflow pinned by commit. No license file yet: visible, all rights reserved, until he picks one.
  - Its first Scorecard result, 4.2: 10 for token permissions, pinned dependencies, dangerous workflows and binary
    artifacts; 9 for the security policy; branch protection unreadable by the workflow's default token; and 11 known
    vulnerabilities, all in the build tools (vite and esbuild, fixed only by vite 8; nanoid and source-map-js, fixed
    by `npm audit fix`). None ships to a browser. Each fix downloads packages, so each waits on his yes.
- 2026-11-15, on his "keep moving fam. get this shipped sand leveled up fam. go beyondd!!":
  - The build tools: vite 6.4.6 and @vitejs/plugin-react 4.7.0, then `npm audit fix` (nanoid, source-map-js). npm
    audit and OSV.dev now find no known flaw in any of the 129 packages in the lockfile. None of them ships to a
    browser; the six shipped packages were already clean.
  - #/trust asks OpenSSF Scorecard about the public copy, on its own button that first says what it sends (the
    repository's name). The seven Code and releases answers Scorecard can bear on carry its reading underneath: what
    it found, what it cannot see, and whether it backs StepSAFE's answer, in the words the check itself uses. One
    line counts the whole read, and the copied and saved reading carry it. Its scan of 2026-11-15 backs 3 (no second
    reviewer, read-only workflow tokens, the security policy) and settles none of the other 4: its default token
    cannot read classic branch protection, there are no releases to sign, and Dependabot alerts are not an update
    tool. research/evidence/scorecard-stepsafe.json holds that answer, trimmed; probe-check reads it against
    StepSAFE's own answers, and the walk stands Scorecard in with it (a disagreement, no result and Scorecard down
    included). readScorecard now also returns the scan's date.
  - SECURITY.md names vulnerabilities and disclosure, which Scorecard's policy check looks for (9 of 10 before).
  - CodeQL on the public copy (scripts/mirror/codeql.yml, pinned by commit, read-only but for its own results). It
    closes the static analysis gap SSDF.md listed under PW.7; RV.1 is now Met there.
  - Still his: a GitHub ruleset in place of the classic branch rule, so Scorecard can read it without a token (its
    docs say rulesets are readable without admin access); a license; 2FA and disk encryption (PO.5.2).
- Next: August's choices (the first Dash project, the names, whether Recover grows further, and whether a
  certificate read is worth an SSLMate account and a small server); then the glossary's remaining debt, in this order: entries for the
  words named twice (`npx tsx probe-terms.mts --list` prints them), a decision on the 417 words the corpus names
  and does not use (write the entry or drop the word from the Step), and a use in a lesson for the 71 entries
  nothing reaches. Two other names are looser than the rest and are his to confirm: "Safe multisig" for Multisig
  and "Summiting the Pyramid" for Analytic Robustness.

## The move

Nothing StepSAFE teaches, and nothing a project tells it, should rest on its word alone. Two halves, one rule:

1. **What StepSAFE teaches.** Every research note links the source it names and records the day it was read.
   Measure how true the corpus is first, then lock in a ratchet so it can only get more provable.
2. **What a project says.** Where a public record can show an answer, the check reads it, and the record marks
   every answer **Shown** (read from a public record, with the link and the date) or **Said** (the project's own
   word).

## Why this is the strongest move

StepSAFE looks sourced. It is not yet provable. Measured on 2026-11-04:

- **No note can be followed back.** The 1,654 research notes on awards (722), models (377), guides (328) and
  chapters (227) name their sources by author, body and year. None of them links its source or says when it was
  read. The exceptions are the Outlier systems, with 1,212 links, and the 24 check statements, which carry dated
  links and shelf lives.
- **A first reading found real faults.** When the twelve treasury statements were read against their sources,
  three cited pages that did not say what they were cited for, and one new line overstated CISA's scope.
- **The checks rest on self-report.** Every answer is the project's own word. The milestone already says "By Our
  Own Account", and a Verified review cannot rest on that.

By UNITIUM SAFE's first law, a control that only looks real is theater. A security curriculum whose citations
cannot be followed is the same problem in a different place.

This also sets the order. Building three more self-report checks would copy the weakness three times, so the
pattern gets fixed before it is copied.

## What is true today (check each before relying on it)

- **Live:** deployment cxmin01yc (the sealed check, the old list layout).
- **Local and not shipped:** the ring, the list of checks, Accounts and access, the dated statements, the
  probes. They ship when August says "ship it".
- **The checks' facts:** 24 statements, 17 sources, all read 2026-11-04. `probe-check.mts` fails any past its
  shelf. The 90-day ones (wallet support, code host, community accounts) fall due 2027-02-02.
- **Where notes are reported:** `docs/SOURCES.md` lists the notes, and `probe-sources.mts` flags unnamed and
  unsourced figures. It does not yet know links or dates.

Read first:
- `~/.claude/projects/C--Users-Initi/memory/stepsafe-praxis.md` (from "Dash Defenders" on);
- `probe-sources.mts`, `src/content/schema.ts` (Award), `src/content/modux-schema.ts` (evidence);
- `src/content/check/`, `src/lib/check.ts`, `src/components/CheckRing.tsx`, `probe-check-walk.mjs`;
- the newest entries of the motivus-level LOG and the Davara journal.

## The build, in order

**Part 0. Ship and listen.**
- Ship the waiting work only after "ship it", then run `probe-check-walk.mjs` on the live site.
- Ask August the two open questions: the names of the two checks, and the first Dash project to run them.
- Keep the working names until he answers.

**Part 1. Measure the corpus's truth.**
- Draw 40 notes with a fixed seed, in proportion: 17 awards, 9 models, 8 guides, 6 chapters.
- For each one, find the source it names, read it at the source, and mark it: supported, partly supported, not
  supported, or source not found.
- Write `docs/TRUTH-SAMPLE.md` with the seed, each note, its source link, the verdict and the date.
- Report the rate to August before going on. The rule: if 4 or more of the 40 fail, correcting the corpus comes
  before any new feature.

**Part 2. The ratchet.**
- Notes gain an optional link and checked date, in the shape the checks use.
- `probe-sources.mts` reports how many notes are linked and dated. It fails if that count ever falls, or if the
  count of notes without a link and date ever rises. The baseline lives in `docs/TRUTH-RATCHET.json`.
- Then link and date notes in risk order: those with a figure first, then a vendor's claim, then a date. Fix or
  cut what the source does not support.
- If a failing note holds August's own words, flag it to him and leave it unedited.

**Part 3. Shown, not said.**
- **Feasibility before design.** In the browser, confirm which public reads work with no key and no server. For
  each one, note whether it is reachable, whether its responses allow the page to read them (CORS), its rate
  limits, and the exact fields it returns. Record it all in `docs/EVIDENCE.md`, and drop any read that needs a key
  or a server. The candidates:
  - RDAP for a domain's lock statuses;
  - DNS over HTTPS for its records and CAA;
  - a Certificate Transparency search for issued certificates;
  - a Dash explorer for an address's type and, once it has spent, its m-of-n;
  - the masternode list for owner, voting and payout addresses.
- **The engine.** A statement may name the reads that can show it. A read returns the answer the evidence
  supports, what it read, the link and the date. Parsing is pure, and is tested against real responses saved as
  fixtures. The network call is separate.
- **The page.** Statements that can be shown get "Read it from the public record".
  - A shown answer carries what was read and when.
  - When the record contradicts the project's answer, the page says so plainly and the project chooses. An
    answer is never overwritten silently.
  - The ring marks a shown arc by its shape, never by colour alone.
- **The record.** Every answer is marked Shown, with the link so a reviewer can read it again, or Said. A summary
  line gives the split, for example "Shown 4 of 12, said 8".
- **The security policy.** It grows by exactly the hosts that step one verified.

**Part 4. After August's review.**
- The three remaining checks, built with evidence from the start: code and releases, people and devices, the
  worst day.
- Then the Launch Record, built on Shown and Said. The order of the rest stays as in the first plan.

## The bar

- **UNITIUM SAFE MODE** for the evidence:
  - A public read shows a state at one moment, not the practice behind it.
  - A record is text a project could edit, so the reviewer reads the links again.
  - A lookup tells its provider which domain or address is being checked; the page says so before the first read.
  - Say all three on the page, and attack each read before it ships, with a mutant for every new test.
- **Davara Distinct V4** inside StepSAFE's own design layer: the ring family, solid tinted inks at 4.5:1 or better
  on all three themes, and small motion that means something.
- **motivus-level** before every ship: read its LOG first and append after.
- **Every ship** runs all probes, probe-csp and the walk. The walk gains a contradiction case, where the project
  says Yes and the record says otherwise.

## Rules that do not bend

- His words verbatim, always. Plain wording in mine: no aphorisms, no em dashes, the humanizer on my copy only.
- Never open the wallet scripts, `.env` or `~/.config`; never print or deploy a key; no visitor tracking. A public
  read happens only when the learner presses for it.
- No subagents unless he asks for them by name. Send an update after each part.

## His decisions, not mine

- Whether Shown answers count toward the Dash Alive Verified review, and whether the all-held milestone should
  need them.
- What happens to a note its source does not support, when the note carries his words.
- The names of the checks, and the first project.

## Done means

- The sample measured and reported.
- 2026-11-12, night: Dasha is the third mind, PAXT has its protocol and its page, and the three proposal pages find
  each other. Live as a760b8a (deployment unitium-safe-3pdmmu0lb, shipped on August's "deploy it all crew!",
  2026-11-12; main pushed 07746f3..a760b8a). On the live site all eleven walks are clean, each PROBLEMS (0): PAXT 32,
  Dasha 26, probe-csp 7, probe-motrus 78, tab bar 53, Back 95, touch 73, play 59, check 108, glossary 100, WebKit 27.
  The first screen is unchanged: 11 files, 1.56 MB raw.
  A follow-up the same day, on his "deploy away fam get it all live": 3db7700 (deployment unitium-safe-p3evqyz8v).
  The /PAXT room section now says Dasha's Telepaxt commands and the ballot page are live at DashSupport.Team and
  links www.dashsupport.team/paxt. On the live site after it: PAXT 32, Dasha 26, probe-csp 7, tab bar 53, each
  PROBLEMS (0); probe-motrus 77 with its one known walk-through failure at 1440 (it passed in the run before).
  DashSupport.Team went live the same day with /paxt, its record endpoint, the Telegram commands and Dasha's mind
  v2.12.15; its own notes are in its CLAUDE.md.
  Later the same day, Dasha by voice, on his "deploy it all crew!": 59a03d9 (deployment unitium-safe-9v2kkxy4q).
  Her replies can be heard in her own Honor voice, served by her server at DashSupport.Team (v2.13.0, live the same
  hour), which reads a reply only with the ticket it gave it; StepSAFE holds no key. "Read replies aloud" and "Start
  a voice call" sit first in her asks row; the call uses the browser's own speech recognition, and the microphone is
  allowed for this page only (vercel.json). Until her team sets the voice key on their server, this device's voice
  reads. Gate before the ship, all clean: the eleven walks plus the new probe-dasha-voice.mjs (16), 28 probes, three
  wide crawls of 766 places. On the live site after it: voice 16, Dasha 26, probe-csp 7, each PROBLEMS (0), and one
  real question to her answered in 5 s under the live policy. Not tested: her real Honor audio (no key set yet), real
  speech recognition, a real phone.
  - Dasha (src/lib/dasha.ts, src/components/DashaText.tsx, src/views/SevaView.tsx): the minds page offers Seva, Claros
    and Dasha. Her answers come from her own server (www.dashsupport.team/api/chat, added to connect-src in
    vercel.json) with her command /Deep, so her pro model answers, one fixed note, and nothing of the learner's
    record. The page shows the model and the live sources she reports; her suggested questions become the asks; a
    refusal shows her server's own sentence. probe-dasha.mjs stands in for her server (26 checks), so the gate
    spends none of her credits. The ledger of the minds counts her time, her asks and the live sources she reached.
  - PAXT (August's name, 2026-11-12): the protocol lives in C:\Users\Initi\ankras\paxt (paxt.mjs; test.mjs, 56
    checks held to Dash Core's verifymessage and the live masternode list; the first Dash PAXT as a draft;
    vectors.json). The page at /PAXT (src/motrus/PaxtPage.tsx, paxt-copy.ts, paxt-core.ts, paxt-first.ts, paxt.css;
    /telepaxt opens its room) works the hash and the signed line in the browser. probe-paxt.mts holds the page's code
    to the vectors (21 checks) and probe-paxt-walk.mjs walks it (32). Both walks are in the gate's list.
  - /MOTRUS: the first move follows the walk, and a door leads to /PAXT. /ankras links held evidence. All three pages
    carry Parts (PartsIndex in shared.tsx): a corner button that lists every part by its heading.
  - Welcome: a door to Dasha beside Claros and Seva, a row of doors to the three proposal pages, and a section far
    off the screen rests its loops until it is near.
  - Known: probe-motrus's check "each step of the walk-through shows its own frame" fails at 1440 on its second step
    on this machine tonight. It fails the same way against the live site, which this change did not touch.
  - The gate on this build: tsc and the outline clean; walks Dasha 26, PAXT 32, tab bar 53, Back 95, touch 73, play
    59, check 108, glossary 100, WebKit 27, probe-csp 7, probe-motrus 77 with the one known failure; all 28 content
    probes clean; the crawl clean on 766 places in all three themes. Staged as a preview
    (unitium-safe-o46133172-sourcecrowd.vercel.app), where the PAXT and Dasha walks are clean and the live Dasha
    answered one real question under the site's own headers.
- The ratchet in the probes, and the riskiest notes linked and dated, in a number set by the sample's result.
- Both checks reading public evidence where public records allow, and the record marking every answer Shown or
  Said.
- The contradiction case walked.
- Every probe and the walk clean on the live site.
