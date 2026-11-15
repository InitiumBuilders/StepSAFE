# StepSAFE accessibility conformance report: a draft

A draft of the report a US federal buyer asks for, laid out like a VPAT 2.5 (Rev 508): WCAG 2.2 levels A and AA,
which include the WCAG 2.0 AA criteria Section 508 adopts, then Section 508's functional criteria and support
documentation. Written 2026-11-14 from machine checks.

**It cannot be issued yet.** A VPAT allows "Not Evaluated" only for level AAA. Every row below marked **Not yet
evaluated** needs the full review with screen readers (NVDA, JAWS, VoiceOver) and a person working by keyboard alone
before this becomes a report StepSAFE can sign.

## The product and how it was checked

- **Product:** StepSAFE :: The Praxis, the web app at unitium-safe.vercel.app, release 00b7a26 and the changes after it.
- **Machine checks, each run on the built site under its real headers:**
  - `probe-a11y.mjs`: 24 places (every main page, the own record, the three policy pages) in the night theme at 1440
    wide. Chrome's accessibility tree for names and roles; landmarks, headings, references, page titles and
    language; 1,820 texts on plain grounds for contrast; the first 18 keyboard stops on each place; targets; reflow
    at 320 wide. Report: `docs/a11y/report.json`.
  - `probe-wide.mts`: 767 places at phone width in all three themes, for sideways scroll.
  - `probe-touch.mjs`: every page at 390 wide: targets of 44 pixels with 16 recorded exceptions, text of 12 pixels or
    more, nothing cut off.
  - `probe-glossary-walk.mjs`, `probe-ownrecord-walk.mjs`: text contrast in all three themes on the glossary, the
    search and the own record; the own record's status marks at 3:1 or more.
  - `probe-keys.mjs`: the one-key shortcuts and the setting that turns them off.
- **Not done:** screen readers, a full keyboard-only walk, text-spacing overrides, a cognitive review, an outside audit.

Statuses: **Supports**, **Partially Supports**, **Does Not Support**, **Not Applicable**, **Not yet evaluated**.

## WCAG 2.2 level A and AA

| Criterion | Level | Status | Remarks |
| --- | --- | --- | --- |
| 1.1.1 Non-text Content | A | Partially Supports | No image without a text alternative and no unnamed control on the 24 places. Charts and the 3D world are not yet reviewed for text equivalents. |
| 1.2.1 Audio-only and Video-only (Prerecorded) | A | Not Applicable | No prerecorded audio or video. Read aloud speaks text already on the page. |
| 1.2.2 Captions (Prerecorded) | A | Not Applicable | As above. |
| 1.2.3 Audio Description or Media Alternative (Prerecorded) | A | Not Applicable | As above. |
| 1.2.4 Captions (Live) | AA | Not Applicable | No live media. |
| 1.2.5 Audio Description (Prerecorded) | AA | Not Applicable | No prerecorded video. |
| 1.3.1 Info and Relationships | A | Partially Supports | One main landmark per page, labelled controls, and no reference to a missing element. On 10 of 24 places the heading levels jump (a page title, then h3 or h4). |
| 1.3.2 Meaningful Sequence | A | Not yet evaluated | |
| 1.3.3 Sensory Characteristics | A | Not yet evaluated | The own record and the token page give every status in words and shape as well as colour. |
| 1.3.4 Orientation | AA | Supports | The site works in either orientation. The installed app's manifest asked for portrait until 2026-11-14; it now asks for any. |
| 1.3.5 Identify Input Purpose | AA | Supports | The one field asking about the person, the handle, declares `autocomplete="nickname"`. |
| 1.4.1 Use of Color | A | Not yet evaluated | Status marks pair colour with shape and words where reviewed. |
| 1.4.2 Audio Control | A | Supports | Nothing plays on its own. Read aloud and the voice call start only when pressed. |
| 1.4.3 Contrast (Minimum) | AA | Partially Supports | None of 1,820 texts on plain grounds fell short, and the glossary, search and own record pass in all three themes. Text over gradient grounds is not yet measured. |
| 1.4.4 Resize Text | AA | Supports | Settings offers Large and Largest text, and browser zoom works; nothing scrolls sideways at 320 pixels wide. |
| 1.4.5 Images of Text | AA | Supports | Text is text. The logo is the only image of text. |
| 1.4.10 Reflow | AA | Supports | Nothing scrolls sideways at 320 wide on the 24 places, or at 390 wide on 767 places in three themes. |
| 1.4.11 Non-text Contrast | AA | Partially Supports | The own record's marks measure 3:1 or more in three themes. Controls and focus rings elsewhere are not yet measured. |
| 1.4.12 Text Spacing | AA | Not yet evaluated | |
| 1.4.13 Content on Hover or Focus | AA | Not yet evaluated | |
| 2.1.1 Keyboard | A | Partially Supports | Every control found takes focus. The 3D world is not yet reviewed by keyboard. |
| 2.1.2 No Keyboard Trap | A | Not yet evaluated | Dialogs close with Escape where walked. |
| 2.1.4 Character Key Shortcuts | A | Supports | The one-key shortcuts (/ and ?, and L and 1 to 4 on a study card) can be turned off in Settings, added 2026-11-14 and walked by probe-keys. |
| 2.2.1 Timing Adjustable | A | Supports | Nothing in StepSAFE has a time limit. |
| 2.2.2 Pause, Stop, Hide | A | Supports | Calm in Settings stills the moving visuals, and the app follows the device's reduced-motion setting. |
| 2.3.1 Three Flashes or Below Threshold | A | Supports | Nothing flashes. Motion is slow drift and fades. |
| 2.4.1 Bypass Blocks | A | Supports | A "Skip to content" link leads to the main region. |
| 2.4.2 Page Titled | A | Supports | Each place names itself in the tab. The checks and token pages gained theirs on 2026-11-14. |
| 2.4.3 Focus Order | A | Not yet evaluated | |
| 2.4.4 Link Purpose (In Context) | A | Partially Supports | Every link has an accessible name. Whether each name says where it goes is not yet reviewed by a person. |
| 2.4.5 Multiple Ways | AA | Supports | The menu, Find (Ctrl or Cmd with K) and links between pages. |
| 2.4.6 Headings and Labels | AA | Supports | Every place has a visible top heading, and fields are labelled. |
| 2.4.7 Focus Visible | AA | Supports | Each of the first 18 keyboard stops on all 24 places changes visibly when focused. |
| 2.4.11 Focus Not Obscured (Minimum) | AA | Not yet evaluated | On a phone the tab bar could cover a control near the bottom. |
| 2.5.1 Pointer Gestures | A | Not yet evaluated | The 3D world. |
| 2.5.2 Pointer Cancellation | A | Not yet evaluated | |
| 2.5.3 Label in Name | A | Not yet evaluated | |
| 2.5.4 Motion Actuation | A | Not Applicable | Nothing responds to device motion. |
| 2.5.7 Dragging Movements | AA | Not yet evaluated | The 3D world. |
| 2.5.8 Target Size (Minimum) | AA | Supports | Every control is at least 24 by 24 pixels, two fixed on 2026-11-14; links inside sentences are exempt. On phones controls are 44 pixels, with 16 recorded exceptions. |
| 3.1.1 Language of Page | A | Supports | Every page declares English. |
| 3.1.2 Language of Parts | AA | Supports | Content is in English; names and terms of art are exempt. |
| 3.2.1 On Focus | A | Not yet evaluated | |
| 3.2.2 On Input | A | Not yet evaluated | |
| 3.2.3 Consistent Navigation | AA | Supports | The same menu, and on phones the same tab bar, on every place. |
| 3.2.4 Consistent Identification | AA | Not yet evaluated | |
| 3.2.6 Consistent Help | A | Not yet evaluated | |
| 3.3.1 Error Identification | A | Not yet evaluated | Where walked, a field error says in words what is wrong. |
| 3.3.2 Labels or Instructions | A | Supports | Every field has a label or an accessible name. |
| 3.3.3 Error Suggestion | AA | Not yet evaluated | |
| 3.3.4 Error Prevention (Legal, Financial, Data) | AA | Supports | No legal or financial step. Reset asks before it erases. |
| 3.3.7 Redundant Entry | A | Supports | No form asks for the same thing twice. |
| 3.3.8 Accessible Authentication (Minimum) | AA | Supports | No sign-in. The optional passphrase field takes paste and a password manager. |
| 4.1.1 Parsing (WCAG 2.0 and 2.1) | A | Supports | Under the WCAG 2.0 and 2.1 errata this is always met by HTML; WCAG 2.2 removed it. |
| 4.1.2 Name, Role, Value | A | Partially Supports | No control without an accessible name on the 24 places. Names, roles and states are not yet checked with a screen reader. |
| 4.1.3 Status Messages | AA | Partially Supports | Results and progress on the token page and the own record are announced. Other places are not yet reviewed. |

## Section 508, chapter 3: functional performance criteria

| Criterion | Status | Remarks |
| --- | --- | --- |
| 302.1 Without Vision | Not yet evaluated | Needs the screen-reader review. |
| 302.2 With Limited Vision | Partially Supports | Large and Largest text, zoom, reflow, and the contrast measured above. |
| 302.3 Without Perception of Color | Not yet evaluated | |
| 302.4 Without Hearing | Supports | Nothing depends on sound. |
| 302.5 With Limited Hearing | Supports | As above. |
| 302.6 Without Speech | Supports | The voice call is optional; every guide also takes typing. |
| 302.7 With Limited Manipulation | Partially Supports | Targets of 24 pixels or more, 44 on phones, and keyboard access; the 3D world is not yet reviewed. |
| 302.8 With Limited Reach and Strength | Partially Supports | As above. |
| 302.9 With Limited Language, Cognitive, and Learning Abilities | Not yet evaluated | |

## Section 508, chapter 6: support documentation and services

| Criterion | Status | Remarks |
| --- | --- | --- |
| 602.2 Accessibility and Compatibility Features | Supports | /accessibility.html describes the features and what is checked. |
| 602.3 Electronic Support Documentation | Supports | The policy pages pass the same checks as the app. |
| 603 Support Services | Supports | Barriers go to August@Outlier.Systems, answered within three business days. |

## What it takes to issue

1. The screen-reader review, place by place, with each "Not yet evaluated" row settled.
2. A keyboard-only walk of the whole app, the 3D world included.
3. Contrast measured over the gradient grounds, and text-spacing overrides applied.
4. The heading levels fixed where they jump.
5. Then date it, name who evaluated it, and publish it beside /accessibility.html.
