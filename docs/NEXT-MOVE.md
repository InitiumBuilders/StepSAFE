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
  - Shipped at 14:05 CST: commit 49926fa, deployment unitium-safe-g40a13nax, gate 52 of 52 (the glossary walk timed
    out under load and passed alone, 100 checks), production 101 of 101 the same, live walks clean (own record 78,
    keys 10, a real token read in 3.4 s). On production a real read held 9 of 9, OSV.dev found no flaw in the 6
    packages, and Scorecard backed 3 answers and settled none of the other 4. The public copy (3a52753) scored 5.8:
    Vulnerabilities, SAST and Security-Policy at 10; all 11 Dependabot alerts fixed.
  - CodeQL's first run found a real flaw in scripts/serve-dist.mjs, the local server the gate walks: since it was
    written on 2026-10-19 it listened on every network interface and joined the decoded request path onto dist/
    unchecked, so `/..%2F<path>` read any file the account could (proved with ../package.json only). Windows Firewall
    allows inbound to C:\Program Files\nodejs\node.exe on Public and Private networks, and the Wi-Fi is Public, so
    while stepsafe-serve ran, a device on the same Wi-Fi or tailnet could have read files in the home folder, the
    wallet scripts and ~/.config keys among them. Nothing logs requests, so whether anyone did is unknown. Fixed:
    it answers 127.0.0.1 only and serves only files inside dist/; the preview was restarted and the traversal forms
    tried return index.html. The other servers running that day (ocean97-site, lincolnparkgems, SoundMindTeam) refuse
    traversal and serve only their public site files. Told August; rotating keys and moving funds are his.
  - CodeQL's other findings: sbom.mjs's author-name regex (output is JSON, no injection; now a split), and three
    false positives on names or test assertions (withoutSecrets() in state.tsx, MIN_PASSPHRASE in probe-keyring, a
    URL in a probe-selfread assertion, rewritten).
  - On his yes (2026-11-15, after "okay deploy it when you're ready fam", asked which he meant): the public copy's
    classic branch protection became a GitHub ruleset, "Protect main" (id 27330668): no deletion, no force pushes, no
    bypass actors, on the default branch. It was created and checked before the classic rule was removed, so main was
    never unprotected. Scorecard now reads Branch-Protection: 3 of 10, its first tier. The aggregate went from 5.8 to
    5.5, because a check that could not run is left out of the average and this one now counts. On production
    /trust's real ask backs 4 answers and settles none of the other 3. The next tier needs a second reviewer.
- 2026-11-16, on "and then move" and then "Then move, bigger more significant updates than that. Like visual
  overhauls and improvements." with "Maybe even using or creating an emoji database of systems models with certain
  emojis. or like a directory of models within emojis. if you want.":
  - The front door: its footer links Security, Privacy, Accessibility and StepSAFE's own record (probe-trust holds
    it). The hero's way in starts rising with the second line (1.25 s in, over 0.9 s): seen at about 1.4 s on the
    build, where production showed it at 2.6 to 3.9 s.
  - Same commit, same bytes: offline-manifest.json is sorted and carries no build time. Two builds in a row, and a
    build from the public copy's files (no research/outlier), match the gated build file for file.
  - Signed releases, ready and not run yet: scripts/mirror/release.yml and `mirror.sh --release`. A tag rebuilds the
    site on GitHub, checks every file against the live site, and only then signs SLSA provenance through Sigstore for
    the archive and every file, and publishes SHA256SUMS, the archive and the .intoto.jsonl. The first run follows
    the next ship; if GitHub's Linux build differs from this machine's, it stops before signing. The /trust answers
    on signing and provenance change only after a release exists.
  - The emoji: content/modux/emoji.ts gives each of the 96 models and 12 families one emoji and a one-line reason
    drawn from its statement (Emoji 13 or older, no joined sequences, all distinct; probe-modux holds them). The
    model table (components/ModelTable.tsx) is the Models tab's default: twelve families by eight, bedrock at the
    base of each column, a choice lighting its partners (either one naming the other) and marking conflicts, a bar
    that stays in view, Find by name or emoji, arrows, Enter and Escape. Enter in Find had chosen the model and then
    clicked it off again, through the key's own press on the focused cell; fixed. The emoji also sit on the list
    cards, the stacks (a row of emoji), the web (emoji discs at full size, with the side families named outside the
    ring), the model pages (by the title, the reason under the statement), Find, the gauge's stack builder, the
    stack page, StudyMode's structure cards (emoji on the front, reason on the back), known systems, the checks and
    the token reader. probe-table-walk.mjs walks the table, in the gate (seventeen walks) and the live walks.
  - Systems maps: the atlas shows each hardening point's model emoji beside its day, and part names carry a halo in
    the map's ground where lines pass. The chapter map names each act above its two chapters and each chapter under
    its star, with the same halo.
  - On his "keep moving": Ground carries the structure of the day (modelOfTheDay in emoji.ts: a stride of 37 through
    the catalog, every model once in 96 days, a new family each day; probe-modux holds it). The web's connections
    stay at a quarter strength at rest, so the ring of emoji leads. A phone cell gives a name a fourth line. The gate
    caught two of mine: StudyMode's emoji rules belong in study.css (probe-study), and probe-play-walk read a name
    from a strong that now holds the emoji (it reads the name without it now).
  - Shipped at 16:11 CST on his "deploy it" and "okay ship.sh let's move when you're ready": commit 171d533,
    deployment unitium-safe-kn9n7sw3y, gate 53 of 53 (15:41 to 16:10), production 101 of 101 files the same.
  - The first signed release, v2026.11.16 (`mirror.sh --release`, public copy d0190d3): GitHub's Linux build matched
    the live site, "101 files checked against https://unitium-safe.vercel.app; 0 differ", and the release carries
    SHA256SUMS, the archive and stepsafe-v2026.11.16.intoto.jsonl. The live index.html, fetched fresh, verifies with
    `gh attestation verify` against SLSA provenance v1 (103 subjects) signed by release.yml at the tag. Scorecard
    5.9: Signed-Releases 10, Token-Permissions still 10 (the release job's contents write is a warning only). CodeQL
    found nothing new.
  - Then the record caught up: own.ts answers 'signed' Yes and 'provenance' Yes, SSDF PS.2 Met. Shipped at 16:57 CST
    on his "okay deploy it crew": commit 84a06df, deployment unitium-safe-o2e39f8gq, gate 53 of 53 (the table walk's
    quiet check read a 240ms fade mid-way under load; it waits for the fade now and passed alone), production 101 of
    101 the same. Its signed release v2026.11.16.2 matched the live site again (101 files, 0 differ). On production
    the Scorecard ask on /trust now backs 6 of the 7 answers it bears on; only the update tool stays open.
- 2026-11-17, on his "keep it moving": Dependabot on the public copy, and each release carries the gate its build
  passed.
  - Dependabot version updates (scripts/mirror/dependabot.yml, copied to .github/ by mirror.sh): npm and the pinned
    actions, weekly on Monday, after a seven-day cooldown, npm minor and patch updates in one group. An update is made
    in the private repository and reaches the public copy with the next sync; Dependabot then closes its own request.
    own.ts says so under 'dep-alerts', still Partly, since no time to fix is set.
  - mirror.sh --release refuses without --gate <log>. It checks that the log's first line names dist/index.html by
    MD5, that it reached "gate finished", that the last line of every check says exit 0 (a walk run again alone with
    quiet-walk.sh adds a later line), and that the live index.html is that build. Then it keeps the log as
    releases/gate-<md5>.txt and commits it before the copy is made. release.yml finds the gate of the build it made,
    checks it the same way and signs it with the files, and the notes count its checks. The check was tried on old
    logs first: the clean gate of 2026-11-16 passes with 53 checks, the one with the table walk's failure is refused
    with the walk named, and an empty log is refused, under mawk and gawk both.
  - /trust: the tests list is still StepSAFE's word, and it now points at the releases, which carry the log from
    v2026.11.17. SSDF PO.3, PO.4 and PS.3 Met. RELEASE.md has the re-run rule and the new step 5.
  - The first gate run found no server on port 5189 (every walk refused to connect; every probe passed). A second
    run was stopped to reword two lines. Gate 53 of 53 on 0126916762f3, 12:53 to 13:21.
  - Shipped at 13:24 CST on his "deploy it when the gate's green" and "okay ship it": commit 52e6550, deployment
    unitium-safe-kdixyirnx, production 101 of 101 files the same, nine live walks clean and the live read.
  - Release v2026.11.17 (gate kept as 9b59b18, public copy 2f8a02d): "101 files checked against
    https://unitium-safe.vercel.app; 0 differ", and the release carries stepsafe-v2026.11.17-gate.txt ("53 checks and
    browser walks"), byte for byte the local log, which `gh attestation verify` accepts (SLSA provenance v1, 104
    subjects, release.yml at the tag). Scorecard 6.6 (was 5.9): Dependency-Update-Tool 10, Signed-Releases 10. On
    production the Scorecard ask on /trust backs 7 of 7.
  - Vulnerabilities fell from 10 to 9 the same day: GHSA-fc5q-39xc-vjpf (CVE-2026-112366), a ReDoS in picomatch,
    reviewed by GitHub at 15:56 UTC on 2026-11-17. picomatch 4.0.7 comes only through Vite (fdir, tinyglobby), so it
    is not in the shipped site and vulns.mjs is right to pass. Every version up to 4.0.7 is affected and npm's latest
    is 4.0.7, so there is nothing to update to yet. Dependabot security updates are off on the public copy (his
    setting).
  - Dependabot's first run opened five requests: #1 three and @types/three 0.169.0 to 0.187.0 (the minor-and-patch
    group), #2 react-dom 18.3.1 to 19.3.1, #3 vite 6.4.6 to 8.3.7, #4 typescript 5.9.3 to 7.0.2, #5 react 18.3.1 to
    19.3.1. #2 and #5 belong together.
- 2026-11-17, on his "keep it moving": three.js 0.187 (Dependabot's #1), and gate logs that name every file.
  - three and @types/three 0.169.0 to 0.187.0, as the request proposed. The migration guide for r170 to r187 touches
    none of the add-ons the world imports (EffectComposer, RenderPass, UnrealBloomPass, ShaderPass, OutputPass,
    BokehPass, Reflector, OrbitControls, RoundedBoxGeometry). r182 retired PCFSoftShadowMap for the WebGL renderer
    (r187 warns and falls back), so both tiers use PCFShadowMap, which now softens by the key light's shadow radius
    (3). r187's environment maps end the "sigmaRadians, 0.05, is too large" warning the world logged on every visit.
  - The world was compared before and after with a headless script (scratchpad world-shot.mjs: the Signing Screen
    gauge, its whole view and The keystone), on this machine's Intel Arc (tier 1) and in SwiftShader (tier 0). The
    look holds; the console is clean on 0.187. The three.js chunk is 614 KB (152 KB compressed), up from 555 KB,
    loaded only with the world. sbom.cdx.json names 0.187.0.
  - Gate 53 of 53 on a5f63f017b12 (13:58 to 14:27). Shipped at 14:28 CST on his "deploy it when the gate's green":
    commit aec3bf8, deployment unitium-safe-l439lnhrq, production 101 of 101 the same, nine live walks clean.
    Release v2026.11.17.2 (gate kept as a558d3f, public copy bc8d017) matched the live site, 101 files, 0 differ.
  - Regenerating sbom.cdx.json changed a shipped file and left index.html's MD5 as it was, so a gate log named by
    that MD5 could match a build whose public files changed after the gate. scripts/gate/build-digest.sh names every
    file: the SHA-256 of the sorted list "<sha256>  <path>", the list release.yml publishes as SHA256SUMS (sorted
    in the C locale on both sides; Git Bash's sha256sum writes "*" where Linux writes a second space, so the script
    writes its own lines). gate.sh's first line carries "build <digest>"; mirror.sh --release and release.yml refuse
    a log without the digest of the build. Tested: one build gives 33b861bca66cf917 in Git Bash and on Linux; one
    byte added to sbom.cdx.json moves the digest and not the MD5; an old-format log and a log naming a build whose
    public file changed after the gate are both refused, and the new format passes. Commit cf82874, public 38155e4.
    The next release needs a gate run after cf82874.
- 2026-11-17, on his "keep moving on visuals": a survey of every screen, then two rounds.
  - The survey (scratchpad survey/survey.mjs): 30 routes at their first view, Nocturne at 1280 and 390, Meridian
    and Mov at 1280, the front door from a fresh visit, read as contact sheets. The weakest first views: every
    Modux tab and every StudyMode tab opened on the same full hero, and on a phone a tab's own work started a whole
    screen down.
  - Round 1: the hero steps aside on every tab but the front one (Gauges, For you): the title on one line and one
    line of numbers; the lede, the tiles and the orb stay on the front tab. A tap that shrinks the hero while the
    page is scrolled brings the tab row back under the bar (keepInView in lib/barOffset.ts, read from offsetTop so
    the arriving view's slide does not throw it off). StudyMode's tabs are routes, and App keys each view by view,
    id and sub, so a tap remounts the view: the tap leaves a module-level note that the new view reads.
  - Found on the way: the model table's columns were one-column grids that sized themselves, so each track grew to
    its longest word (94.8px in a 74px column) and every cell and family name ran under the next column; Frontier
    control ran into Organisation. The track is minmax(0, 1fr) now. Desktop Chrome on this machine does not
    hyphenate, so twelve across starts at 1437px, where every column holds Interpretability (83px at 12px) whole;
    below, two bands of six. Phones at 360 and 390 still lean on the browser's own hyphenation for six long words.
  - Round 1 shipped at 15:46 CST on his "deploy it when the gate's green fam": commit b802686, deployment
    unitium-safe-jnrq6jxkc, gate 53 of 53, live 101 of 101, nine live walks clean. Release v2026.11.17.3 was the
    first with the build digest: GitHub's run printed "this build: index.html 9f5e961b0389, build c5cdd03a711443b7",
    the digest the gate wrote on Windows.
  - Round 2: Modux's seven tabs on a phone were a 3-column grid written for six (The Web alone on a third row);
    they are one scrolling row like StudyMode's, and both centre the chosen tab (centerInRow). Slim titles balance
    their lines; the phone's slim Modux line shows three numbers; Ground's watch cards are level (the button fills
    its stretched li); the week's label had the Monday date in lower case. The Modux hero said 476 connections
    while The Web said 339: the hero summed every model's list, counting a pair that names each other twice. Both
    count each pair once now, and pitch-gen.mts too (pitch.ts regenerated).
  - The first gate on round 2 caught the new phone tab row: probe-wide flags any box that runs past its edge, and
    the row was not on its list of boxes that scroll sideways on purpose. It is now (ALLOWED in probe-wide.mts),
    and the whole gate ran again: 53 of 53 on 9075bdc4de1f, build 25492643b031371a (16:39 to 17:08). Shipped at
    17:10 CST on his "deploy it when the gate's green fam": commit e9eef9c, deployment unitium-safe-hf0ppwy6o, live
    101 of 101, nine live walks clean. Release v2026.11.17.4 (gate kept as bc222b4, public copy 94063f5).
  - Dependabot closed its three.js request (#1) on its own at 14:46 CST, "no longer updatable", once the update
    reached the public copy: the loop own.ts describes, seen working. Open: #2 and #5 (React and React DOM 19.3.1),
    #3 (Vite 8.3.7), #4 (TypeScript 7.0.2).
  - For August (the award system is his): hooks.ts grants small-first-testnet, "Broke It on Testnet" (criteria:
    deploy a contract to a test network and exploit your own bug), on the trigger motus-mode, which fires when the
    learner's mode is Motus (engine.tsx:70). It has been there since the first commit (9f1fa84). Recommended:
    remove the hook, or map Motus mode to an award that fits; learners who hold it keep it.
- Next, strongest first (written 2026-11-17, at the end of that day's session):
  1. React 19 (Dependabot #2 and #5, together). A read of the code found none of the removed APIs: createRoot is
     already used, and there are no defaultProps, string refs, findDOMNode or useRef calls without an argument; every
     callback ref has a block body. One type to rename: React.MutableRefObject in components/MindLedger.tsx. Install
     react, react-dom, @types/react and @types/react-dom at the requested versions, then tsc, the build, the gate, and
     a ship on his word. Dependabot then closes both requests.
  2. A walk for what today added, so it cannot slip back: the slim hero on every tab but the front one, the tab row in
     view after a tap from a scrolled page (Modux keeps its tab in state, StudyMode remounts), the chosen tab centred
     on a phone, and every word of the model table whole at desktop widths (scripts/look/wordfit.mjs has the measure).
     Add it to gate.sh and live-walks.sh. Today scratch scripts checked these, and nothing holds them yet.
  3. His call: hooks.ts grants "Broke It on Testnet" on the trigger motus-mode, which only means the learner's mode is
     Motus. Recommended: remove the hook, or map Motus mode to an award that fits.
  4. Phones at 360 and 390: six long words in the table (Interpretability, authentication, Constitutional,
     normalisation, segmentation, Transparency) lean on the phone's own hyphenation. Ask him to open Models on his
     phone. If a word breaks with no hyphen, add soft hyphens for those words in ModelTable and make the walks read
     names without them.
  5. Vite 8 (#3), then TypeScript 7 (#4), each alone. Vite 8 bundles with Rolldown: check that a build is still the
     same byte for byte on Linux (the release depends on it), the security policy (no inline script), chunk names, the
     offline manifest and the bundle sizes. TypeScript 7 is the native compiler: check tsconfig for removed options
     and that the probes still run under tsx. Vite 8 was tried on 2026-11-21 and held, because the first screen grew
     (that day's entry below); TypeScript 7 does not depend on it and can go first.
  6. picomatch (GHSA-fc5q-39xc-vjpf): when a fixed version is published, update the lockfile only, and Scorecard's
     Vulnerabilities returns to 10.
  7. A third visual round: run scripts/look/survey.mjs, read the sheets, and pick the weakest first views. Seen today:
     in the six-across table the cells are wide and their emoji small, and on a phone the Modux hero still takes a
     third of the screen on its front tab. Done on 2026-11-21 and live as release v2026.11.21 (that evening's entry
     below).
  8. His choices, carried from before: the first Dash project, the names, whether Recover grows further, whether a
     certificate read is worth an SSLMate account and a small server, and the names "Safe multisig" and "Summiting the
     Pyramid". Then the glossary's debt: entries for the words named twice (`npx tsx probe-terms.mts --list`), a
     decision on the 417 words the corpus names and does not use, and a use in a lesson for the 71 entries nothing
     reaches.
- Reflections from 2026-11-17:
  - Each fix showed a layer under it. Publishing the gate showed that index.html's MD5 does not name a build, so the
    digest came next. The slim hero showed that the table's columns had run under each other since the table shipped,
    and the narrower columns showed that this Chrome does not hyphenate. Measuring each box against its column found
    what the pictures hid, because the next column painted over the overlap.
  - The strongest moves turned a said answer into a shown one: the gate's log signed with the build, and the digest
    checked again on GitHub's Linux machine.
  - The gate caught the phone tab row I had not put on the scroll list. Every new behaviour should arrive with the
    check that holds it.
  - Time went where the order was wrong: a gate started with no server (every walk failed to connect within four
    minutes, so the gate ran again), and a gate stopped to reword two lines that should have been read before it
    began. Read every new visible line, start the server, then gate.
  - What kept the pace: the next round written as a patch while the gate ran, src left alone during a gate (ship.sh
    builds from source), headless scripts when the Browser pane was hidden, and one script per claim that asserts it.
  - The trust layer is a closed loop now: the tests, the gate log, the build digest, the signed release, the live site
    matched file by file, and Scorecard read on /trust. StepSAFE still says four answers without showing them: review
    (one maintainer), commit signing, a practised rollback and a time to fix. The next leverage is in what a learner
    sees first.
- 2026-11-18: the room round (commit 4bef169, deployment unitium-safe-5j8km57wm, release v2026.11.18). A live room on a
  screen 1180px or wider keeps a rail beside the feed: the injects so far by channel, each a way back to its place,
  how many are still to come, and each call with its score. The debrief lists what the run earned: the respect and
  trust a first run adds, and each new award with its tier. Notices stay off while it is open, since they would
  announce the same awards over it. Ground reads in two columns from 1500px. styles/wide.css is a layer for 1500, 1800
  and 2300px: wider Modux and study pages, larger headings, a wider rail. Headings balance their lines.
  scripts/look/room.mjs plays one room through and photographs each phase. The gate passed 53 of 53, the live walks
  9 of 9, and the live mainnet read held.
  - A slip, and the guard it left: live-walks.sh takes its own log as its first argument and empties it, and it was
    given the gate's log. The gate had run with its console thrown away, so that log was gone. Its per-check outputs
    survived, but a log rebuilt from them would have been a reconstruction, so the gate ran again on the same build
    (digest 51df69eb070e06ee) and that log went into the release. live-walks.sh now refuses a file that begins as a
    gate log, and a gate's console goes to a file beside its log.
- 2026-11-18, later: the wide round and the practitioners door (commit 204613f, release v2026.11.18.2). From 1500px
  The Practice's chapters flow into two columns, three from 1800px. A Step shows its own outline beside it from
  1500px ("On this step", components/StepRail.tsx): the titled blocks, the drill, the field praxis and the seal, the
  part being read lit. The first build lit nothing after a jump (an IntersectionObserver fires only when a heading
  crosses its band, and the End key skips the band) and never lit the last part (the page ends before it reaches the
  line); a settle after each scroll, the last part on screen at the very end, and a held click fixed both, measured
  at 1600, 1920 and 2560. From 1180px a room's after-action review sets what you chose beside the stronger move.
  Practitioners: August chose the Outlier.Systems group on Telegram (t.me/Outlier_Systems); a door on Ground and at
  the end of every room's debrief (components/Practitioners.tsx) names it and claims nothing about its size.
  Payments: he chose Stripe Payment Links and a Dash address together, for NOVUS at $23 a month (and Outlier's $40
  first hour); the values are his to paste, and NOVUS's door waits for them.
  - The gate's catch: the outline first named the seal "Seal this Step", the seal button's own words, so two walks
    found two buttons by that text (probe-back, probe-glossary-webkit: a strict-mode violation, 51 of 53). A screen
    reader would have heard two "Seal this Step" buttons doing different things. The outline says "The seal" now.
    Rule: navigation never repeats an action's label.
- 2026-11-18, end of day: probe-wide-walk.mjs holds the wide layer in the gate and the live walks (71926e9; alone on
  the live build, PROBLEMS (0)). For his call, carried: "Broke It on Testnet" is granted by choosing Motus mode
  (hooks.ts, trigger motus-mode), which is not what it claims. Taking the hook out alone fails the gate: probe-ids
  holds that every award can be earned (UNREACHABLE awards: 1), so the award needs a real home first. No Step teaches
  deploying to a test network and attacking your own contract; the nearest are the Asset Lock step's testnet
  rehearsal (ch-dashevo-p2-asset-lock) and appsec's fuzz harness. His choice: a Step to carry it, a new trigger, or
  retire it. Payments still wait on his two Stripe links and Dash address.
- 2026-11-20: React 19 (commit bf47287, release v2026.11.20). React and React DOM 19.3.1 with their types, Dependabot's
  #2 and #5 together; one type followed (useRef(null) carries null, so the Lander's motion hook takes
  RefObject<HTMLDivElement | null>); no removed API was in use. Installed with --ignore-scripts.
  - Two lessons from its first gate. The SBOM is regenerated after every lockfile change (`node scripts/sbom.mjs`),
    before the gate: probe-trust caught the stale one. And the gate's third failure was mine: the SBOM was rewritten in
    public/ while the gate served the old build, so probe-ownrecord-walk expected one count and the page showed
    another. Nothing under public/ or src/ changes while a gate runs, generated files included.
  - probe-motrus missed one walk-through frame once (10111111) on a machine running nine sessions, and passed alone
    and in the full gate after. A timing miss, not React.
  - The second gate's last miss was a test, not the app: probe-selfread named "react 18.3.1" by hand. It reads the
    installed version now. The third gate passed 54 of 54; the release rebuilt it on Linux byte for byte.
- 2026-11-20, later: three known systems read the wrong number of people. Web PKI read 762 million from "762 million
  websites", Allstate 211 million from "211 million polici" (its line is cut at 120 characters), and the package
  registries 918,959 from "918,959 projects". src/lib/people.ts now counts websites, policies and projects as things:
  Web PKI and the registries read no count, Allstate reads 16 million households, and probe-people pins the three
  lines. outlier-gen copied the 38 entries into the app first and changed no file. Committed as 2460ff2; not shipped.
  - Gated that evening on build 32423510cdb1 (digest 6090d0b590ace2ce): 54 of 54 end on exit 0, five walks re-run
    alone while other sessions' browsers left about 500 MB free. probe-read-webkit had been reading the live testnet
    explorer, because once the app's service worker controls the page, WebKit sends the request where ctx.route cannot
    see it. It passed while the explorer answered and failed when the explorer gave 500 for the group-mints contract,
    on this build and on production alike. Its context now blocks service workers (17 of 17).
  - Shipped at 23:39 CST on his "deploy it": production unitium-safe-ppdxmc3n5, 101 of 101 files the same as dist,
    release v2026.11.20.2 (gate kept as 3bf082d, public copy d436708, release.yml green). Live walks 10 of 10, and
    the mainnet read came back clean. The first run stopped at the 15-minute cap I gave it, six walks in; the other
    four ran after. He had said "deploy it" in two chats at once: one shipped and the other stood down. Before a ship,
    check `vercel ls unitium-safe --prod` and git for another session's deploy.
- 2026-11-21: probe-tabrow-walk.mjs holds the visual rounds of 17 November (move 2 of the list above), in 45 checks.
  In Modux and StudyMode, at 1440 and 390, the front tab keeps the whole hero. Every other tab has the slim one, at
  most 60% of the whole one's height, and its own work starts in the top half of the screen; an address naming a
  later tab opens slim too. A tap with the page scrolled until the tab row sits just under the bar keeps the row in
  view at 390, at 900 (the bar on top) and at 1440. On a phone the chosen tab comes to the middle of its row, on
  arrival and after each tap, or the row stops at its end with the tab in view. Every word of the model table is
  whole at ten widths from 761 to 1920 (wordfit's measure). It runs in gate.sh (nineteen walks now) and
  live-walks.sh (eleven); the app did not change.
  - Two things could hide a broken keepInView. Chrome's scroll anchoring held the Modux row by itself at 1440 (it
    stayed at 10px; keepInView puts it at 12), and StudyMode's Test page is short (908px at 1440), so the page's end
    held the row at 900 and 1440. Each scrolled tap now runs twice, as Chrome is and with anchoring off, taps Deck
    (over 5,000px at every width), and fails if the new page is too short to keep the scroll where it was.
  - Each part was then broken on purpose inside the page: the slim hero showing its lede, keepInView's scroll and the
    row's centring each made a no-op, the table's names at 20px. Every break made its own lines fail. With keepInView
    off, the one case still passing was Modux at 1440 with anchoring on, and its anchoring-off twin failed.
  - 45 of 45 on this build (32423510cdb1) and on production, each run alone, about four minutes under load.
- 2026-11-21, later: Vite 8 tried in a worktree and held (move 5; local branch vite8, commit c5bf240, not pushed or
  merged). vite 8.3.8 and @vitejs/plugin-react 6.3.0 install and build, in 758 ms. Vite no longer brings esbuild,
  which scripts/sync-seva.mjs imports, so esbuild becomes a dev dependency of its own; Vite 8 accepts only ^0.27 or
  ^0.28, and 0.28.2 writes api/_seva-data.js byte for byte the same. index.html has no inline script, so the
  security policy holds.
  - What holds it back is the first screen. Rolldown makes 134 files where Rollup made 101. On Fast 3G
    (scripts/look/first-screen.mjs, the shipped build against the trial), the Lander takes 12 requests instead of 5
    and Ground 48 instead of 15, for about the same bytes, and both paint about 240 ms later. Ground also loads
    glossary-aliases and a piece named outlier, which probe-tabbar's first-screen check forbids.
  - The cause: Rolldown gives a module that two chunks import a common chunk of its own, even when one of the two is
    already loaded; Rollup left such modules in the chunk that loads first. Rolldown's own merge
    (experimental.chunkOptimization, on by default and off only under top-level await, which nothing here uses) did
    not fold them back. With no manual chunks at all the shape is the same, so the rules in vite.config.ts are not
    the cause. One group for all shared app code made it worse: 865 KB on the Lander instead of 205, and first paint
    at 3.6 s.
  - Next time: find why the merge does not apply to this import graph, or wait for a Rolldown release that merges
    more, and measure with first-screen.mjs before any gate. Also check the build is byte for byte the same on Linux,
    which this trial did not reach.
- 2026-11-21, later: TypeScript 7 (commit d9228bb; Dependabot's #4). typescript 7.0.2, the native compiler:
  `tsc --noEmit` passes with no change to the code, in 4.5 s. No script imports TypeScript's JavaScript API, which
  version 7 no longer offers in the old form, and the outline check and all 31 probe-*.mts pass under it. Nothing in
  the build uses TypeScript, so the built site is byte for byte the one in production (index 32423510cdb1, digest
  6090d0b590ace2ce), on Windows and on Linux (WSL with Node 22 and `npm ci --ignore-scripts`, as release.yml installs;
  the release itself builds with Node 24). The SBOM lists only what reaches a browser, so it did not change. It ships
  nothing, so it needs no deploy; the next release builds with it.
  - REVERTED the same day (2a1a04e). The next ship stopped in `vercel build`: "Using TypeScript 7.0.2 (local
    user-provided)", then "Cannot read properties of undefined (reading 'readFile')". Vercel's builder for the api/
    functions loads the project's TypeScript through its JavaScript API, which 7.0 no longer offers. The trial checked
    our own scripts for that API, not the deploy's build. Nothing reached production. Next time, run `vercel build`
    before a toolchain change lands, and hold TypeScript 7 until Vercel's builder supports it.
- 2026-11-21, evening: visual round 3 (move 7) LIVE on his "Deploy it": production unitium-safe-ba88c5b9u, 101 of 101
  files the same as dist, live walks 12 of 12 and the mainnet read, release v2026.11.21 (gate kept as 1bdff11, public
  copy eaa79b6). Commits 990ed46, ca5be7f and 7669d97. The survey (122 first views, 13 sheets) and a measure of every
  gradient word found three things:
  - The front door's headline cut its own letters. background-clip: text paints only inside a word's box, and at a
    line height of 0.94 the tails of g, y and p hung below it: "Design" lost 10.7px of its g at 1280 and "Right."
    12.2px; the rising headings on Chapters, NextSteps, StudyMode, Trust and Steps lost 2 to 5px. Each gradient
    word's box now reaches 0.26em lower with the same margin given back (lander.css, rise.css), and RiseHead's
    gradient runs 0.3em past the heading. All 65 word windows on the front door rest where they did and every page
    keeps its height. probe-glyph-walk.mjs holds it: it failed on the old build in Nocturne and Meridian at 1280 and
    390, and passes on this one and on production.
  - On a phone the Modux and StudyMode heroes gave their sigil a row of its own (in Modux a grid row and its gap,
    102px), so the front tab's own work began under the tab bar. The sigil now stays in the corner, as in the slim
    hero (sigil.css): Modux's work starts at 600px instead of 702, StudyMode's at 641 instead of 711. The first gate
    found the room made for it had also come off the titles of the model, gauge and stack heroes, which hold no
    sigil: eleven model pages scrolled sideways on a phone in Meridian and Mov. The padding applies only to a hero
    that holds one now (:has(> .hero-sigil)), and all 124 model pages are clear in all three themes.
  - In the two bands of six the table's emoji stayed about 25px in 150px cells. It grows with its cell now
    (modeltable.css: max(clamp(22px, 2vw, 30px), min(25cqi, 40px))), 37px at 1280; twelve across and the phone keep
    their size.
  - probe-motrus's walk-through check failed about one time in four on the shipped build and on this one alike
    (10111111, 10011111), with the eight step boxes identical on both. A cold browser draws one frame in its first
    second and 61 a second later, and the steps light on an IntersectionObserver, which runs with the frames. The walk
    now waits for twenty steady frames first (7669d97) and passed 4 of 4, twice on each build.
  - The machine slept through the night with the second gate half done; it resumed and finished at 16:59.
  - Next: his choice for the thirteen page heads, B (a small sigil beside the label), as round 4 on its own branch.
- 2026-11-21, evening: visual round 4 LIVE on his "Deploy it when green" (his choice B for the page heads):
  production unitium-safe-6ya1fyusc, 101 of 101 files the same as dist, live walks 12 of 12 and the mainnet read,
  release v2026.11.21.2 (gate kept as 9af3124, public copy 8f6c74b, release.yml passed). Commits d0712f6 and
  7dfe274. On a phone the thirteen page heads that carry a sigil gave it a row of its own above the label, about 50px
  of each first screen. The sigil now sits small (34px) in the label's row, and the title and lede keep the full
  width (calm.css). Measured against round 3 at 360, 390 and 640, on the twelve routes and on a checklist's own page
  (all five kinds; that page has no address, so the measure opens it from /check): the next section starts about
  50px higher, every title keeps its line count, no sigil touches a title, and nothing scrolls sideways. Above 640
  nothing changes.
  - The gate's one failure was probe-read-webkit's vessel check: the fill reaches its level about 2.1 s after the
    heading on both builds (2.0 to 2.3 s), and the walk read it at a fixed 3.2 s, twice mid-rise under load. It
    waits for the level now, up to eight seconds (7dfe274), and passed 4 of 4 across both builds.
  - The first measure counted twelve heads, because it walked addresses and the checklist page has none. When a
    count comes from a walk, write down the pages it walked.
- Start here (next session, written 2026-11-21 at the end of the day). Everything above is live, and main holds it.
  Next, strongest first:
  1. His calls: ~~the "Broke It on Testnet" hook~~ (done 2026-11-23 as visual round 7, his choice: the reentrancy
     lab grants it), then the choices in move 8 of the 2026-11-17 list.
  2. ~~Faint field rings drift over the model table's cells (seen in rounds 3 and 4).~~ Done 2026-11-22 as visual
     round 5 (the entry below these reflections).
  3. ~~TypeScript 7 without breaking the ship.~~ Done 2026-11-23 (45d1e35, the entry below).
  4. picomatch: still 4.0.7 on 2026-11-21, with no fix published. When one is, update the lockfile only.
  5. Vite 8 stays held until Rolldown folds the common chunks back (the first screen grew). The trial is the local
     branch vite8 (c5bf240).
  6. Phones and the six long words in the model table: ask him to open Models on his phone (move 4 of the
     2026-11-17 list).
  7. The next visual round from a fresh survey (scripts/look/survey.mjs): the weakest first views first.
  8. The glossary's debt (move 8 of the 2026-11-17 list).
- Reflections from 2026-11-21:
  - Two walks failed today because of their own timing (probe-motrus and probe-read-webkit): each read an animated
    state at a fixed time and caught it mid-way when the machine was busy. They wait for the state now, with a
    ceiling. Running the same check on the shipped build settled "regression or flake" in one run each time.
  - A toolchain change has to pass the deploy's own build (`vercel build`), not only the app's. TypeScript 7 passed
    every local check and failed at the ship.
  - Every visual fix was measured against the shipped build before the gate (word windows, page heights, title
    lines, sideways scroll), so each round shipped once.
- 2026-11-22, night: visual round 5 LIVE on his "Deploy it when green", then "deploy it" (move 2 of the list
  above): production unitium-safe-pdhnvjreg, 101 of 101 files the same as dist, live walks 12 of 12 and the mainnet
  read, release v2026.11.22 (gate kept as 77ea0c9, public copy cb3be4c, release.yml passed). Commit dab3308. On a
  desktop the field's five out-of-focus discs drifted under the model table, and their bright rims showed through
  its glass cells as stray rings ("Verifiable credentials", "Build integrity levels", "Mutual TLS mesh",
  "Reproducible builds" at 1280). The field already kept the discs off screens under 900px for the same reason, so
  phones never saw them. A view can now hold them (Field.holdAir and releaseAir, src/lib/field.ts): the table holds
  them while it is open and lets go when it closes. Checked on the build and again on production: the table's
  cells are clean at 1280 in two frames 1.5 s apart, and the field canvas on Ground, reached from the table in the
  same visit, draws all five discs again. The lattice, the signals and the ripples are unchanged.
  - The first gate stopped at 41 of 56, with no failures, when the session ended. A release needs one complete
    log, so the gate ran again from the start and passed 56 of 56.
- 2026-11-23: TypeScript 7 is on main beside TypeScript 5 (45d1e35), with no deploy: the build is byte for byte
  production's. "typescript" stays on 5.9 because Vercel's function builder compiles api/seva.ts through
  TypeScript's JavaScript API (its log: "Using TypeScript 5.9.3 (local user-provided)"). TypeScript 7.0.2 is
  installed as "typescript-native" and runs the app's type check by its own path: the build script, the typecheck
  script and the gate (`npm run typecheck`). It takes about 2 s; 5 took about 10. Checked: the type check, the
  outline and all 31 probes pass; `vercel build --prod` completes; the build is 0ce5737e6b7b, digest
  d4291a4a6d4b3fc1, on Windows and on Linux after `npm ci --ignore-scripts`, the way release.yml builds. Dependabot
  (scripts/mirror/dependabot.yml) no longer offers a major update for "typescript".
  - Both packages name a binary `tsc`, and npm linked the newer one, which can change with install order. So no
    script relies on the shared `tsc`; each names the one it wants.
  - Vercel's team was blocked for an unpaid invoice that day (every site 402 DEPLOYMENT_DISABLED); nothing here
    needed a deploy.
- 2026-11-23: visual round 6 LIVE on his "deploy round 6 when green": production unitium-safe-gndfo6cpr, 101 of 101
  files the same as dist, live walks 12 of 12 and the mainnet read, release v2026.11.23 (gate kept as e64a0e3, public
  copy 96888f5, release.yml passed). Commit ff9c439. From that day's survey (122 screens): on every chapter, Step and
  guide, the read-aloud card showed its two passage arrows before anything was playing. Back could only be disabled
  then, forward skipped the first passage (it stepped from the start before reading began), and on a phone the pair
  sat alone on a line under the button. The arrows now come once reading has begun (ReadAloud.tsx); before it the
  card is the button and what it will read, 85px tall on a phone. Checked at 390 on a Step and a chapter: no arrows
  before reading; after "Read aloud" both arrows, back disabled on the first passage, and the button reads "Stop".
  - The first gate died at 54 of 56, with no failures, when Windows refused new processes as the machine logged off
    ("fork: Resource temporarily unavailable", 0xC000026B). It ran again from the start and passed 56 of 56.
- 2026-11-23: visual round 7 LIVE on his "deploy round 7 when green" (his choice of where the award comes from):
  production unitium-safe-i4fzmhggo, 101 of 101 files the same as dist, live walks 12 of 12 and the mainnet read,
  release v2026.11.23.2 (gate kept as a222b21, public copy 9a55e1c, release.yml passed). Commit 6d9e497. "Broke It
  on Testnet" asks the learner to deploy a contract and exploit one of their own bugs, but it was granted for choosing
  Motus mode, and its toast then covered the StudyMode head for every Motus-mode learner (move 1 of the list). The
  blockchain chapter's reentrancy lab (ch-chain-reentrancy-lab), where the learner writes the exploit against their
  own vulnerable contract, grants it now; choosing Motus mode grants no award (hooks.ts). The outline is regenerated
  for the Step's new award. Checked: probe-ids (every award reachable) passes, and on production a Motus-mode learner
  opens StudyMode with no award toast and none stored.
  - Round 7 was built and gated in its own worktree (C:\Users\Initi\stepsafe-visual7, served on 5200), so round 6's
    release could run from a clean main folder whose dist was still the shipped build. It was rebased onto main's
    round 6 evidence before the merge, and the main folder's build matched the gated one byte for byte.
- 2026-11-24, night: the glossary's debt (move 8 of the list) LIVE on his "Deploy it": production
  unitium-safe-kxvkpleal, 101 of 101 files the same as dist, live walks 12 of 12 and the mainnet read, release
  v2026.11.24 (gate kept as 332f7a2, public copy fe7262a, release.yml passed). 65 new entries in
  src/content/glossary-named.ts: all 41 words that two Steps name, and 24 of the 330 that one Step names and other
  Steps or guides also use, most used first. Each was written from the Steps that name it. Outside facts carry the
  source read on 2026-11-23: the SEC's 2023 press release and the Division of Corporation Finance statement of May
  2024, the AWS CloudTrail guide, GitHub's advisory on tj-actions/changed-files, the ATT&CK Navigator repository,
  Russ Cox's xz timeline, Lasse Collin's xz page, Microsoft Learn, and Dash's DIP-0003 and DIP-0028. probe-terms:
  Step links to an entry 533 to 639, to no entry 1111 to 1005, related links to no entry 183 to 178. The pitch
  figures follow (501 terms, 1101 cards). The browser pane could not open threatmodelingmanifesto.org or cisa.gov,
  so Hero Threat Modeler carries no source and Mutable Tag cites GitHub's advisory.
  - The first gate failed one walk of 56: probe-touch found the word "standing" linked as a small control on the
    Stocks and Flows Step. The cause was meaning, not size. lib/terms.ts links an entry's name wherever it appears
    in prose when it is one word of seven letters or more (ten for another name), so the new "Standing"
    (credibility) took "standing privileged access". "Disposition" and "Advisory" took other senses the same way.
    They are now Standing (Credibility), Disposition (Threat Model) and Security Advisory. A sense check, every
    place each new name links in Step text, then found the other name "Reachability" linking "network
    reachability" to code reachability. It was dropped, and the ratchet went back to its count before it (639).
    The third gate passed 56 of 56.
  - Before committing a glossary batch, read every place its one-word names link in Step text.
  - picomatch (move 4): still 4.0.7 with no newer release, and npm audit reports 0 vulnerabilities on 2026-11-23.
    Nothing to update.
- 2026-11-24, evening (finished 2026-11-25, 03:00): the glossary's fourth batch is built and checked on branch glossary-named-3 (worktree
  C:\Users\Initi\stepsafe-glossary3, rebased onto the floor release be9b06b), waiting for its gate and his word.
  246 new entries in src/content/glossary-named.ts, carrying READ3: every word that one Step names and two or more
  other places use, the rest of their Steps' sets where entries were missing (the CIA triad and the properties
  beyond it, the four storage promises, the CSF profiles, differential privacy), fifty-seven named concepts
  and well-known terms that had no entry (Platform Identity, the zero trust decision and information points, KEK
  and DEK, Golden SAML, BLS signatures, SPIFFE IDs and attestation, Tier Zero, TTP, the ADS framework, SLH-DSA,
  among them), and forty-seven more words that one Step names (Access Proxy, Agent Identity and Agent Inventory,
  Asset Lock Proof and One-Time Key, Causal Analysis and Post-Incident Report, Shift Handoff, Volatile Memory,
  Token Signing Certificate, Verifier Name Binding, Management Body, Multihash and Sentry (gVisor) among them).
  Fifteen existing entries take the Steps' other names for them (IMDS takes Instance Metadata; Review Trigger
  takes Trigger Condition, Invalidation Trigger and Escalation Trigger; Escalation Threshold takes Pre-Agreed
  Trigger; Egress Control takes Egress Policy; Risk Acceptance takes Residual Risk Acceptance; EthMultiVault takes MultiVault; PoRep takes Proof of
  Replication; Responsible Scaling, Session Token Theft, Closure Rate, Doctrine, Risk Tolerance, Corpus and
  Revocation take one each), and two Step slugs now name the entry they meant (reachability to
  reachability-analysis, reg-sk-item-106 to item-106). probe-terms' fixed cases now expect tier-zero and
  verifiable-delay-function to open their own entries. probe-terms: Step links to an entry 639 to 906, to no entry
  1005 to 738, related links to no entry 178 to 156. The pitch figures follow (747 terms, 1347 cards). The type
  check, the outline and all 31 node probes pass, and no new name links on its own in a list item or paragraph,
  the case probe-touch holds to 44px. The browser walks wait for the shared queue.
  - The sense check ran before writing this time (scratchpad glossary/sense-survey.mts: every sentence that uses a
    candidate word). Words with more than one sense carry a qualifier and link nowhere in prose: Exposure
    (Vulnerability Priority), Position (Intuition Vault), Share Price (Vault), Durability (Storage), Integrity
    (Security Property), Composition (Privacy Budget), Sector (Filecoin), Autonomous System
    (Routing), Security Level (Dash Key), Master Key (Dash Identity), Admission Control
    (Kubernetes), Safe Harbour (Security Research), Prohibition (Doctrine). Others take a fuller name that still reads naturally: Defensive Capability, Board Oversight, Data
    Controller, and Review Trigger, which also answers the slug "trigger".
  - "Availability" links in 72 places, and three of them meant something else: "exploit availability" twice and
    "availability bias" once. Entries for Exploit Availability, Availability Bias and Availability Attack take those
    phrases, because the longer name wins, so every link lands on its meaning.
  - Sources read on 2026-11-24: the GDPR text (Articles 4, 5, 9, 15 to 21, 33, 34, 36 and 56), NIST SP 800-226, NIST SP 800-207, NIST CSWP 29,
    Meadows' Leverage Points, Team Topologies, RFC 6749, RFC 1930, the SPIFFE concepts page, MITRE ATT&CK TA0001 and
    Filecoin's storage-proving page.
  - The last forty-seven were checked claim by claim against their Steps before they went in. One draft had the
    wrong sense: the curriculum's Escalation of Last Resort is the written plan for when nobody with authority can
    be reached, and the draft had made it a route over the chief executive's head. Six others carried a detail no
    Step states, and lost it. The same check then ran over the 199 earlier entries: every sentence that credits
    the curriculum or states a number, beside the nearest sentence anywhere in the course (scratchpad glossary/
    support2.mts and nearest.mts). Eight said more than their Steps and now follow them (f7e29d4).
- 2026-11-25, before dawn: the glossary's fifth batch, on branch glossary-named-5 (worktree
  C:\Users\Initi\stepsafe-glossary5, on top of the fourth batch's 34abbf6), and the two travel together through one
  gate. Sixty-one entries give every word the Steps use in more than one place an entry (probe-terms' "used in
  another Step or guide" is now 0): Tuning Debt, Paging Budget, Auto-Demotion, Enrichment Tier, Coverage Confidence,
  Coverage Decay, Counter-Metric, Exception Route, Risk Narrative, Exposure Statement, Proof of Decryption, Release
  Tarball and Voting Cutoff among them. Security Failure (AI) and Stated Position (Takedown) carry qualifiers because
  each word has a second sense elsewhere. Named Accepter, Initial Access Broker and Delegated Authority take the
  other names Accepting Authority, Access Broker and Authority Basis. Every credited or numbered sentence was set
  beside the nearest course sentence before it went in, which also found a slip in the AI security Step (an agent
  leaking one user's data "to that same user" while the breach was called one of tenancy; now "to another user").
  probe-terms: resolved 906 to 970, to no entry 738 to 674; pitch 808 terms, 1408 cards. Before the gate, the walks
  were read against the content: probe-glossary-walk expected "tier zero" to have no entry (now it opens its own),
  and its "key" search check would have failed because Revocation's other name Key Revocation ranked it among names
  starting with "key". Glossary.tsx now ranks an entry's own name before its other names (34abbf6), checked by
  running the search function itself over every term for each query the walks type (scratchpad glossary/
  search-real.mts).
- 2026-11-25, morning: the glossary's fourth and fifth batches LIVE, on his word to deploy when green and his standing
  word on deploys: production unitium-safe-g0tkhghn7, 101 of 101 files the same as dist, release v2026.11.25.2 (gate
  kept as 837a6c3, public copy 3c8f6f6, release.yml passed in 43 s). The gate passed 56 of 56 on d0e12f3b85ae
  (06:38 to 07:15). 307 new entries take the glossary from 501 to 808 terms and the deck to 1408 cards: the fourth
  batch's 246 and the fifth batch's 61, both described in the two entries above. One more fix rode with them, found
  while writing the sixth batch: NIS2 Article 20, read on EUR-Lex on 2026-11-25, has Member States encourage entities
  to offer staff training (20(2)), and the temporary ban from managerial functions is Article 32(5)(b), at essential
  entities when other enforcement fails. The GRC Step "NIS2, DORA and the AI Act" and the Management Body entry had
  said entities must offer the training and had put the ban under Article 20; both now say what the Directive says,
  and the entry cites it (e1e3b1c).
  - The browser line became a lock this morning (SoundMind.Team's ~/.claude/tools/browser-lock.mjs, on August's ask
    that the sessions get in sync): the gate ran as one ticket, the build, the deploy and the notes ran outside it,
    and the live walks hold a later ticket (scratchpad live-walks-ticket.sh first checks that production serves
    d0e12f3b85ae). Until they run, production was checked at once: the security headers by HTTP, and in the browser
    pane the Glossary tab at 808, Tuning Debt, the corrected Management Body entry with its EUR-Lex source, the
    corrected sentence in the shipped GRC chunk (the old one nowhere in dist), and no console errors.
  - Before an entry repeats a Step's legal or numbered claim, read the claim at its source; a Step can be wrong too.
  - The finding started a reading of every article the Steps cite, on EUR-Lex in the browser pane. These hold: GDPR
    6(1), 34, 35 (simplified: the monitoring case is a public area at large scale) and 36; NIS2 21 and 23; AI Act
    51(2) and 55(1). Three are imprecise and are corrected in the next round: GDPR 28 gives authorisation and notice
    with a right to object, not "a right to a subprocessor list"; GDPR 33's seventy-two hours apply "where feasible"
    and not to a breach unlikely to result in a risk; DORA's management body bears "the ultimate responsibility"
    (Article 5(2)(a)) and the entity stays "fully responsible" when ICT services are contracted out (Article
    28(1)(a)), where the Step and the Management Body entry said it "cannot be delegated away".
  - Still to read: the AI RMF Step lists "data provenance" among NIST AI 600-1's twelve risk categories. The PDF is a
    download, so it waits for a way to read it or his OK.
- 2026-11-25, late morning: the glossary's sixth batch, a visual round and three legal corrections, on branch
  glossary-named-6 (worktree C:\Users\Initi\stepsafe-glossary6), rebased onto the live main. Built as 17a698600dea
  (digest b192357bdb59a81c); gate not yet run.
  - 145 entries in twelve parts: the words a Step names that an entry only mentions (all but two), and the
    vocabulary the new entries needed beside them (PassRole, Monotonicity Rule, Permission Boundary, Telemetry
    Tiering, Cost Per Question, Device Trust Tier, Two-Copy Rule and others). Each was written from the Steps that
    name it, and every credited or numbered sentence was set beside its course sentence first; that check caught an
    inference that would have contradicted a Step (Coverage Attribution: a source that feeds no alert is not a
    candidate for a cheaper tier) and a "because" that joined two separate sentences of a Step. NIS2 Article 20 is
    written from the Directive. Left: the Generative AI Profile (waits on the NIST PDF) and the privilege boundary
    (Legal Privilege covers it). probe-terms: resolved 970 to 1117, to no entry 674 to 527, related to no entry 153
    to 143; 953 terms.
  - The visual round: colour now names the subject wherever a word appears. Each glossary row leads with its
    subject's mark. The open term, its Why it matters, its row and a Step's word pop-up are lit at the rim in the
    subject's colour, brightest at the top and left, in place of the corner tint and the 3px stripes. Related terms
    hang from the open term as a small web (TermWeb in components/Glossary.tsx): a node for the term and one
    measured curve to each related entry, fading from the term's subject colour to the entry's, so a link into
    another subject shows as a change of colour. The curves grow out of the node when a term opens (still under calm
    and reduced motion), the curve to an entry brightens while it has the pointer or the focus, and the first seven
    entries show at once, the rest behind "Show the other N" with the focus moving to the first that waited. A
    search found by another name says so on its row ("Also called Four-Eyes Principle"), as Find and the deck do.
    It was prototyped live in the browser pane before any code, the first build was read at 1440, 390 and 375 in
    Nocturne and Meridian (953 marks on 953 rows, curves meeting their entries exactly), and the second was measured
    in the pane (Blast Radius: 7 curves, then 13 meeting 13 entries after "Show the other 6", focus on Trust
    Boundary; the Step pop-up's rim lit in the Systems colour).
  - The walks moved their word with no entry from "inflow rate", which now has an entry, to "supply chain
    substitution" on "Field: Build A CID Provenance Register": chosen because the corpus has both an entry that
    explains it and a use, and the Step is open to every learner. Two first choices failed that test before any
    browser ran: "dark launch" has no recorded use, and the custody drill Step is Motus-only.
  - GDPR 28, GDPR 33 and DORA's management body now say what the law says (52f95a6; docs/LEGAL-READINGS.md holds
    every article read so far, its source text and the verdict).
  - The voice check read the 452 new entries of the two rounds: no dashes; of 17 contrasts and stock words, one added
    weight without a fact and was rewritten (Disposition Depth).
- 2026-11-25, 08:34 CST: the sixth batch is LIVE, shipped on his word. Production unitium-safe-kgy8ruxdo (inspect
  9eu3FiCpFECBcCcvbzrKAi5zQCyj), build bef9c4d8a492 (digest 34cb61a67a413f36), main 45d1ef7, 101 of 101 files the
  same as dist. That is 808 to 953 terms, the visual round and the three legal corrections in the entry above, and
  one phone fix found while rehearsing the gate in the pane.
  - The fix: a view slides up 12px as it arrives (view-in), and the phone reveal used scrollIntoView, which aims at
    the box while it moves. A word's page opened from a Step settled 12px high, 2px past the top, once "supply chain
    substitution" had a page long enough to scroll; the live build's word page was too short to show it. The reveal
    now scrolls to the offset chain, which ignores the slide (45d1ef7). In the pane at 390 by 844, locally and on
    production, the word's page and the term page settle 10px under the top, and Back returns to the row with focus.
  - Production, checked in the pane right after the deploy: 953 rows and 953 subject marks; "four-eyes" finds Dual
    Control with "Also called Four-Eyes Principle"; Dual Control's web shows seven entries and "Show the other 2",
    its rim lit in the identity colour; Management Body cites Article 32 and no longer says entities "must offer"
    training; no console errors.
  - NOT RUN YET: the 56-walk gate on this build. It holds a browser-lock ticket against localhost:5207 and refuses to
    run unless the build it finds is bef9c4d8a492. The release (mirror.sh --release --gate) waits for a green gate
    log. This ship went ahead of its gate because the lock line held ten tickets, and the gate's place in it was
    hours away.
  - The live walks ran on production from 09:22 to 09:41: 11 of 12 passed. probe-touch failed on one control, "inflow
    rate" in the Stocks and Flows Step, 80 by 28 on a phone. The word gained an entry in this batch, so it now links
    inside its sentence. probe-touch and probe-a11y already excuse a link inside a sentence from the size rule, but
    they only knew `<a>` tags, and a glossary word is a button because it opens its card in place. Both now treat
    `.term-link` the same way (b243772); other inline buttons stay held to the size rule. Rehearsed in the pane on
    production: the old rule flags the word, the new rule flags nothing on that Step. The gate's ticket runs
    probe-touch on production again after the gate.
  - A pane lesson: after the rebuild, the pane still held the page it loaded before, so the first test of the fix ran
    the old code and looked like a failure. Before measuring a fix in the pane, reload and check which index-*.js the
    page loaded.
- 2026-11-25, 10:00 to 10:30 CST, on his word to keep moving: the law as written, finished for the four EU laws, on
  branch law-readings-3 (worktree C:\Users\Initi\stepsafe-law3, build fa186081229d). Not live yet; its gate holds a
  browser-lock ticket against localhost:5208.
  - Read on EUR-Lex: GDPR 5, 9, 12, 17, 25 and 32; DORA 19 and 20 with Delegated Regulation (EU) 2025/301 and
    Implementing Regulation (EU) 2025/302; AI Act 14. Four corrections (9ed4d28): the deletion-latency check said
    thirty days where GDPR 12(3) says one month, extendable by two for complex or numerous requests; the DORA clock
    row credited the templates to 2025/301, which sets the deadlines (the templates are in 2025/302), and said
    classification is itself time-bound, which Article 5 does not; a practice scenario let GDPR 17(3) yield to a US
    rule, where 17(3)(b) covers only Union or Member State law; an award said Article 14's warning on automation bias
    "applies at full strength" to a security pipeline, where Article 14 binds high-risk systems. The rest hold.
  - The first list of cited articles was drawn by eye. A count of every citation found five it missed (GDPR 5, 9, 17,
    25, 32), and one of the five carried an error. It also named AI Act Article 9, which nothing cites.
  - probe-law.mts (5fd39f0) keeps the count: every citation of the four laws by article number must name an article
    on the "Read:" line of docs/LEGAL-READINGS.md, which grows only after a reading. 125 citations of 27 articles,
    all read. A planted line citing seven unread articles failed on all seven and passed over "Article 33, 72 hours".
  - probe-dashes.mts (8e76522): the course still carries 4,315 dashes from its first authoring (chapters 1,507,
    practice 876, guides 617, glossary 491, other 458, awards 363, Modux 3). docs/VOICE-RATCHET.json holds each
    part's count; it may fall and never rise, so new text cannot add one while the old are rewritten.
  - NIST AI 600-1 stays open: the twelve risks are only in the PDF, 1.2 MB at tsapps.nist.gov (publication 958388).
- 2026-11-25, 10:34 CST: the sixth batch passed its gate, 56 of 56 (10:00 to 10:34, under the browser lock, on
  bef9c4d8a492 and digest 34cb61a67a413f36), and probe-touch passed on production again with the corrected rule (81
  checks). Release v2026.11.25.3: evidence fa322e9, public f25046d, release.yml success at 16:37 UTC with the tarball,
  SHA256SUMS, the gate log and the in-toto provenance. The glossary6 worktree and its branch are removed.
- 2026-11-25, 11:05 CST: the law as written is LIVE, shipped on his word, ahead of its gate. Production
  unitium-safe-3bk1gspc9, build 5815cb8a419b (digest 70bd5c673571d6b2), main b7c44a6, 101 of 101 files the same as
  dist. Four EU corrections and the two ratchets from the entry above, and NIST AI 600-1, read in the PDF on his word
  to download it (July 2024, NIST publication 958388):
  - The AI RMF Step listed "data provenance" among the profile's twelve risks, with "dangerous or violent content
    recommendations" and "the risks arising from dual-use capability". None is one of the twelve. The Step names five
    as the profile does, and says content provenance is one of the four considerations its suggested actions mainly
    address. An award that said the frameworks weigh risk "rather than intended use" now says the risk is held
    against the intended use, as the profile's actions do. The other claims about the profile hold, and so does an
    award's date for the AI Act's duties on general-purpose models (Article 113(b), 2 August 2025).
  - Production checked in the pane at once: the AI RMF Step, the retention Step and the DORA clock row carry the new
    text, the old text is gone, no console errors.
  - NOT RUN YET: the 56-walk gate on 5815cb8a419b. Its browser-lock ticket was retargeted to this build and runs
    against localhost:5208; the release waits for it.
- 2026-11-25, 11:40 CST, on his word to move on: the seventh batch's first slice, on branch glossary-named-7
  (worktree C:\Users\Initi\stepsafe-glossary7, build a24472ee09ac, digest 58ece3477c54e3ca, commit f907097). Not live:
  it waits for its gate, and this time the gate goes first.
  - Twelve of the twenty words that an entry only mentioned now have entries of their own, written from the Steps
    that name them: Investigative Half-Life, Duplicated Feed, Attestation Artefact, Host-Side Evidence, Risk Map,
    Generative AI Profile (from the NIST PDF), Cohort Floor, Bulk Re-encryption, Start Event, Backup Catalogue,
    Leading Measure and Dark Launch. Eviction Cutover is another name for Coordinated Eviction. Most of the twenty
    were ideas of their own that an entry happened to mention (the authentication key H is not the forbidden
    attack), so another name would have been wrong for them.
  - Every credited sentence beside its course sentence (all matched); the senses check shows each new name links
    only in its own sense ("risk map" only in the listening tour); the house lint and the stand-alone check are
    clean; the voice lint raised three flags, one was reworded and two are the Steps' own facts. probe-terms:
    resolved 1130, to no entry 514; 965 terms, 1565 cards. Checked in the pane on the local build: the drill's
    word opens its card in the Detection colour, the glossary lists 965, and "eviction cutover" finds Coordinated
    Eviction with its other name.
  - Left from that tier: authentication key H, telemetry confidence and constitutional classifier wait for a
    source read for them; response posture and reputation laundering need more text than their Steps give;
    privilege boundary stays with Legal Privilege; "supply chain substitution" stays the walks' word with no
    entry.
  - Modux's three dashes were number ranges in a code comment; probe-dashes holds 4,310.
  - The gate ticket queued for the legal fixes now gates this combined build (localhost:5209), so one run of the
    browser line covers both.
- 2026-11-25, 11:50 CST: StepSAFE is MIT-licensed, on his yes in chat. LICENSE is the file from
  InitiumBuilders/Votus.One byte for byte (git blob 65e007b5cac544d22c911982b25f7330fbfee9f3), and the README carries
  one line under "License" (commit e2bc483, public d0925f8). GitHub reads the public repo as MIT. This closes the
  2026-11-14 note that the public copy had no license file. The session that relayed the ask was not running, so
  its hash is recorded here.
- 2026-11-25, 11:55 CST, on his word to move brave: batch seven's first slice is LIVE ahead of its gate (production
  unitium-safe-60xyyvfrp, build a24472ee09ac, main 8ab0031, 101 of 101 files the same as dist, the drill's word and
  the glossary's 965 checked on production).
- 2026-11-25, 12:15 CST: batch seven part two is LIVE ahead of its gate. Production unitium-safe-exfmblknc, build
  982c555099ae (digest e52d465c762f973b), main 5982ac9, 101 of 101 the same as dist. Thirty-nine words that only
  their own Step used now have entries written from that Step: the MCP connector classes, the AI evaluation
  harness, the SOC harms, the pipeline bugs (Script Injection, Build Cache Poisoning, Build Injection), eight
  incident words, seven CISO words and six from foundations. All matched their course sentences, each name links
  only in its own meaning, and the voice lint's flags were read (seven rewritten, including two that used "real
  people"). probe-terms: resolved 1169, to no entry 475, related to no entry 140; 1,004 terms, 1,604 cards.
  Production checked: the payment Step's word opens Restore Commander, the glossary lists 1,004, no console errors.
  - The gate for this build was superseded by part three before it ran (below).
- 2026-11-25, 12:30 CST: batch seven part three is LIVE ahead of its gate. Production unitium-safe-icc40zab6, build
  b8d3ef0137c9 (digest 24d516e8a33aed63), main 7900adf, 101 of 101 the same as dist. Thirty-two more own-Step words
  (detection, the ransom room, application security, AI, identity and keys, foundations), with the same checks: all
  credited sentences matched, each name links only in its own meaning, six voice rewrites. 1,036 terms, 1,636 cards;
  resolved 1201, to no entry 443. Production checked: the egress Step links its word, no console errors.
  - Superseded by part four before its gate ran.
- 2026-11-25, 12:40 CST: batch seven part four is LIVE ahead of its gate. Production unitium-safe-7eg741v20, build
  08dd0c22df8c (digest 00802316903d06cd), main 82f6265, 101 of 101 the same as dist. Twenty-six own-Step words:
  decentralized infrastructure, GRC, CISO, model and system cards, two blockchain words, and OWASP's LLM05 Improper
  Output Handling and LLM07 System Prompt Leakage, whose numbers and definitions were read on OWASP's own pages and
  are cited there. 1,062 terms, 1,662 cards; resolved 1227, to no entry 417. Production checked: the heat-map Step's
  word opens Range Compression, no console errors.
  - Superseded by part five before its gate ran.
- 2026-11-25, 12:50 CST: batch seven part five is LIVE ahead of its gate. Production unitium-safe-cvc4egc8i, build
  f0e9f76c00d5 (digest 5664eea6d6eeabed), main 495e8f7, 101 of 101 the same as dist. Twenty-seven own-Step words from
  the Intuition and Dash chapters, with the same checks. Asymmetric Threshold is written from the Step's control
  (demotion needs a higher bar than promotion) and kept apart from the trap the same Step warns about. 1,089 terms,
  1,689 cards; resolved 1254, to no entry 390. Production checked: the bribery Step's word opens Resolution Point,
  the glossary lists 1,089, no console errors.
  - Its own gate never ran: at 13:12 the queued ticket was retargeted to part six, which contains this build's
    changes, and that gate passed (below).
  - Batch seven so far: 136 entries in five parts, 953 to 1,089 terms, links to no entry 527 to 390.
- 2026-11-25, 13:51 CST: batch seven part six is LIVE, gated and released. Gate 58 of 58 (tsc, outline, every probe,
  probe-wide in each theme, 20 walks; 13:13 to 13:49) on build 46466f348b3a (digest e6512244c86426a5) before it
  shipped; production unitium-safe-ctwkxa49f, main a84f204, 101 of 101 the same as dist; release v2026.11.25.4
  (evidence 06ba6b6, public 8b61f40). The release covers parts one to six and the legal fixes.
  - Eight words whose ids a Step's glossary list already named: AI Literacy Obligation, Critical ICT Provider,
    Restricted Authenticator, Temporary Access Pass, Alignment Faking, Informative Reference, Three Lines Model and
    Statement of Applicability. 1,097 terms, 1,697 cards; resolved 1262, to no entry 382.
  - Every source read the same day: AI Act Articles 4 and 113 and DORA Articles 31 and 35 on EUR-Lex (rows in
    LEGAL-READINGS; the Read line now lists AI Act 4 and DORA 31, 35); NIST SP 800-63B-4's restricted
    authenticators; Microsoft's Temporary Access Pass page; NIST's CSF 2.0 Informative References; Anthropic's
    alignment faking paper (12%, 97% and 78%, as the page gives them).
  - The IIA marks its 2020 Three Lines paper superseded: a Statement of Position replaced it on 8 July 2026. The
    entry cites both. The Modux card "Three lines" tells the 2020 history, which stays true.
  - Production checked in the pane: the identity Step "Factors, and the Exact Way Each One Dies" links Restricted
    authenticator and opens the new entry in place; the Three Lines Model page shows its long text and both
    sources; the glossary reports 1097; no console errors. The GRC Step that links AI literacy obligation is
    Motus-only, so a Novus profile sees its preview.
  - probe-ensemble failed once in a private probe loop ("200 days take 416 ms") while a build ran beside it; the
    gate's run on a quiet machine took 67 ms.
- 2026-11-25, 14:02 CST: batch seven part seven is LIVE ahead of its gate. Production unitium-safe-c6vesaehz, build
  9939da39a7f5 (digest bb18a8314cfef2f5), main 9fd1b3f, 101 of 101 the same as dist, all 33 probes clean before it
  shipped. Five entries (Duty of Oversight, Attribution Caution, Targeted Risk Analysis, Customized Approach, Script
  Integrity) and seventeen related links that led to no entry (140 to 123). 1,102 terms, 1,702 cards; resolved
  1267, to no entry 377; no word is left that only its own Step names.
  - Production checked in the pane after a forced reload (the page still held part six's script until then): Duty
    of Oversight shows its long text and the three Delaware sources; Partnership Squad's related row opens Paved
    Road, a link that led nowhere this morning; no console errors. Both of part seven's Steps are Motus-only, so a
    Novus profile sees their previews.
  - Duty of Oversight rests on the Delaware opinions read at the source: Caremark (Court of Chancery, 1996), Stone
    v. Ritter (Supreme Court, 2006) and Marchand v. Barnhill (Supreme Court, 2019); its EU sentence matches NIS2
    Article 20(1) and DORA Article 5(2), recorded in LEGAL-READINGS. The three PCI DSS entries come from the PCI
    Security Standards Council's own pages (its targeted risk analysis guidance post and its podcast on
    Requirements 6.4.3 and 11.6.1), so the standard's PDF was not needed.
  - Where a related link's nearest entry means the same thing it now opens it (Paved Road, Epsilon Budget, Risk
    Acceptance Memo, Insider Threat and others); where the entry already linked the idea the dead link is gone.
  - Its own gate will not run: at 14:16 the ticket was pointed at part eight's build, which contains part seven.
- 2026-11-25, 14:17 CST: batch seven part eight is LIVE ahead of its gate. Production unitium-safe-p52949xk8, build
  923c43cc12fb (digest b91d850eb17ae1fb), main 524ec1f, 101 of 101 the same as dist, all 33 probes clean first.
  Twenty-eight entries that nothing reached are now named in the glossary list of a core Step that teaches them
  (unreached 69 to 41; Steps that name an entry 962 to 990; resolved Step links 1,267 to 1,296). Each was read in
  its Step before the id went in; an entry whose nearest Step does not teach it stays unreached.
  - Production checked in the pane after a forced reload: Isolation Tiers shows a gVisor chip beside Sentry
    (gVisor), and the chip opens the gVisor card in place; no console errors. The longest new name (Device Bound
    Session Credentials, 32 letters) is shorter than one already shown and gated (33).
  - NOT RUN YET: the gate for parts seven and eight. The ticket queued at 13:30 (10th of 11 at 14:15) reads
    scratchpad g13-target.txt, which names /c/Users/Initi/stepsafe-glossary14, 923c43cc12fb and port 5216; the
    worktree serves its dist there.
- Start here (next session, rewritten 2026-11-25 after part eight shipped). Part six is released (v2026.11.25.4);
  parts seven and eight are live and main holds them. Next, strongest first:
  1. The gate for parts seven and eight, queued in the browser lock. On green, while production still serves
     923c43cc12fb: `bash scripts/mirror.sh --release --gate <log>` from main. If the session that queued it ended, serve main's dist
     (`node scripts/serve-dist.mjs <port>`) and run `bash scripts/gate/gate.sh <log> http://localhost:<port>`
     through the lock. Never rebuild the worktree a ticket serves until it has run; a newer build ships only after
     the ticket is pointed at it.
  2. The 41 entries still unreached. Part eight placed the 28 whose Steps teach them; for the rest the nearest core
     Step does not (3-2-1-1-0, Address Poisoning, Assume Breach, Base Rate Fallacy, Forward Secrecy, PKCE, SSVC,
     TOCTOU, VEX and others). Each needs a Step or guide that teaches it, or stays reachable only from the glossary
     and related links. "Reached" counts a Step's glossary list, prose and tables in the core chapters, and the
     guides (src/lib/terms.ts corpus()); a single word under seven letters that is not an acronym never links. The
     kit's tools/reach-evidence.mts prints each entry beside the best sentence of its two nearest Steps, and
     stepgrep.mts checks a Step for a phrase. An alias only where the meaning is the same; any new prose link changes
     walked Steps, so run senses and measure walked Steps at phone size before the walks.
  3. Then: 36 near other names, 326 found nowhere, the 123 related links to no entry (the rest need entries, not
     retargets). Write each part in a fresh worktree; repoint the kit's nearest and relcheck copies per tree.
  3. The voice debt: rewrite the dashes part by part, smallest part first (awards 363, other content 458, glossary
     491), each sentence read and never a blind replace; probe-dashes tightens as they go.
  4. Still open from earlier lists: picomatch (no fix published), Vite 8 held, Models on his phone, a fresh visual
     survey (scripts/look/survey.mjs), and his choices (the first Dash project, the names, Recover, an SSLMate
     account, "Safe multisig" and "Summiting the Pyramid").
- Reflections from 2026-11-25:
  - Reading the law at its source found an error in a Step itself (NIS2 Article 20), where an entry had copied it.
    Before an entry repeats a Step's legal or numbered claim, read the claim at its source.
  - New content can expose a layout fault the old content hid. On a phone, a page opened from a Step aimed 12px
    high, and only a word page long enough to scroll showed it. When a walk's example changes, run the walk's
    checks on the new example before the gate does.
  - The gate ran 56 of 56 for the fourth and fifth batches before they shipped; this batch shipped first and its gate
    follows. Queue the gate the moment a build is frozen, because the browser line now runs hours deep.
  - A word that gains an entry changes form on every Step that names it: it leaves the padded list of bare words and
    becomes a button inside a sentence. The touch probe had never met that form on the Step it walks. When a batch
    gives an entry to a word a walked Step names, measure that Step in the pane at phone size before the walks run.
  - A list made by eye missed five of the articles the course cites, and one of the five was wrong. When the job is
    "every X", count every X with a search first, then read; and leave a probe behind so the count stays true.
  - A source can be replaced after a Step cites it. The IIA's 2020 paper now says it is superseded. When reading a
    source for an entry, look on the page for that notice and cite the current document beside the old one.
  - A timing probe and a build cannot share the machine: probe-ensemble read 416 ms beside a build and 67 ms alone.
    The gate runs every probe itself, so a private probe loop stops when the gate starts.
  - Retargeting the one queued ticket to the newest frozen build, before shipping it, turned two gates into one:
    the ticket came up a minute later and the release covers parts one to six.

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
