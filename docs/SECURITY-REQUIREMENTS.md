# StepSAFE's security requirements, and the test that holds each

Written 2026-11-14 for SSDF practice PO.1 (docs/SSDF.md). Each requirement names where it is set and what fails
when it breaks. A requirement with no test is marked. Change a requirement here and in its test together.

## What a page may do

| Requirement | Set in | Held by |
| --- | --- | --- |
| A page runs only scripts loaded from this site: no inline script, no eval, no plugins. | vercel.json, Content-Security-Policy (`script-src 'self'`, `object-src 'none'`) | probe-csp (any violation fails the walk); probe-selfread reads the header and fails a copy that lets inline or outside scripts in |
| No other site can show StepSAFE in a frame. | vercel.json (`frame-ancestors 'none'`, `X-Frame-Options: DENY`) | probe-selfread |
| A page reaches only the sites the privacy page names. | vercel.json (`connect-src`, `style-src`, `font-src`) | probe-trust (the privacy page names every `connect-src` site); probe-selfread (the own record names every allowed site, and none more); the walks' stray-request checks |
| Links out send no referrer. | vercel.json (`Referrer-Policy: no-referrer`) | probe-selfread |
| The camera, location and payments are off; the microphone is allowed for this site only. | vercel.json (`Permissions-Policy`) | probe-selfread |
| Browsers stay on HTTPS. | Vercel sends Strict-Transport-Security; vercel.json adds `upgrade-insecure-requests` | The own record reads HSTS on the live site; no test runs against production by itself |
| Nothing outside is read until the learner presses for it. | Each page's read buttons | probe-read-walk and probe-ownrecord-walk ("nothing is read before the button") |
| Visitors are not tracked: the app carries no analytics code and sets no cookie. | No analytics code; no `Set-Cookie` | The own record reads cookies and the sites a visit reached; probe-csp |

## Keys and records

| Requirement | Set in | Held by |
| --- | --- | --- |
| A pasted key stays in memory for the visit, and reaches storage only when the learner seals it. | src/lib/keyring.ts | probe-keyring |
| A kept key is sealed with AES-256-GCM under a key drawn from the passphrase by PBKDF2-SHA256 at 600,000 rounds; a short passphrase is refused; a tampered seal is refused. | src/lib/keyring.ts | probe-keyring |
| The learner's record is saved with every key blanked; a key in a settings change is ignored. | src/lib/state.tsx, keyring.ts | probe-keyring |
| A treasury check stays out of the main record, its export and its import. | src/lib/checkstore.ts, keyring.ts | probe-keyring |
| The own record shows only the names and sizes of what the browser keeps, and keeps contents and keys off the page. | src/lib/selfread.ts | probe-selfread; probe-ownrecord-walk plants a key-shaped string and checks the page never shows it |

## The server

| Requirement | Set in | Held by |
| --- | --- | --- |
| The guides' server refuses another site's requests and the wrong content type. | api/seva.ts | probe-seva-door |
| It limits each network (6 a minute, 60 a day, per instance) and caps a conversation at 24,000 characters. | api/seva.ts | probe-seva-door. The per-instance limit is not a ceiling; the Anthropic Console's monthly limit is, and that is set by August |
| It ignores a system prompt sent by a client. | api/seva.ts | probe-seva-door |
| The Anthropic key lives only in the server's environment. | Vercel project settings | No test reads production settings; the secret scan keeps it out of the repository |

## Releases

| Requirement | Set in | Held by |
| --- | --- | --- |
| No key or token is committed. | scripts/secret-scan.mjs, run by scripts/keep.sh | A hit stops the push |
| No shipped package carries a known flaw. | scripts/vulns.mjs, run by scripts/ship.sh | OSV.dev is asked before each release; a flaw or no answer stops it |
| The bill of materials matches the lockfile. | scripts/sbom.mjs | probe-trust and ship.sh (`--check`) |
| The security contact is real before anything ships, and security.txt is current. | public/.well-known/security.txt | probe-trust (fields and dates); ship.sh refuses `[[SECURITY CONTACT]]` |
| The offline worker keeps only the app, and only from a good page response. | public/sw.js | probe-trust (pins the navigation handler) |
| Every gate line says exit 0 before a release, and production waits for August's go-ahead for that build. | scripts/gate/gate.sh, docs/RELEASE.md | The gate's own log; the go-ahead is a person, not a test |
