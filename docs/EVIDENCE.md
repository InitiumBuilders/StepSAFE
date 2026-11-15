# Shown, not said: which public records the page can read

Tested 2026-11-04, from a headless Chrome page on a real https origin, so each provider's CORS answered as it
would for StepSAFE. No read needs a key or a server. The page contacts only the hosts below, and vercel.json's
connect-src names each of them; probe-check.mts fails if a host `src/lib/evidence.ts` reads is missing from it.

## Used

| Record | Host | What it gives | Shows |
|---|---|---|---|
| RDAP, .org and .foundation | rdap.publicinterestregistry.org | lock statuses, expiry | the domain locks (accounts: domain-lock) |
| RDAP, .com and .net | rdap.verisign.com | lock statuses, expiry | the same |
| RDAP, .team .ai .finance .network .money .info .cash .systems | rdap.identitydigital.services | lock statuses, expiry | the same |
| RDAP, .xyz | rdap.centralnic.com | lock statuses, expiry | the same |
| RDAP, .app and .dev | pubapi.registry.google | lock statuses, expiry, registry locks | the same |
| Dash explorer | insight.dash.org | an address's transactions, with each input's script | m of n for a 7 address once it has spent (treasury: two-agree, lose-one) |
| OpenSSF Scorecard | api.scorecard.dev | a repository's published checks: score, reason, details, scan date | seven code statements (review, branch-rules, token-perms, signed, provenance, dep-alerts, disclosure) |
| DNS over HTTPS | dns.google | a domain's NS, A, AAAA, MX and CAA records | where the records point on the day, and what changed since the reading before (accounts: dns-watch); it does not settle the statement |
| Platform Explorer, mainnet and testnet | platform-explorer.pshenmic.dev, testnet.platform-explorer.pshenmic.dev | a data contract, the transition that created it, and that transition decoded | who holds each power of a token (the page at `#/read`) |

Platform Explorer (tested 2026-11-14): a community service by pshenmic that indexes Dash Platform. It answers a
browser page with `access-control-allow-origin: *`, needs no key, and its preflight allows the JSON content type the
decode call sends. A reading takes three requests: the contract (owner, version, supply today, groups), the
transition that created it, and the explorer's decoding of that transition, which carries each token rule as
`authorizedToMakeChange` and `adminActionTakers`. A token's own id takes one more, to find its contract. The
explorer's short flags (`mintable` and the rest) are not read, because a flag does not say who holds the power.
Its decoder fails on contracts that use the protocol 14 shorthands (`identifier`, `bytes` with a size); the page
then says the rules were not read and shows the supply alone. The decoding leaves out four rules: the direct
purchase price, the claim every identity may make once, who may change the schedule, and who may change where new
tokens go. Each token's reading names them. The Platform book (read the same day) says a direct purchase mints new
tokens, a once-per-identity claim is bounded only by the maximum supply, and a mint checks the maximum, so a
closed minting rule is reported as that rule and no more. Twelve real records are saved in
research/evidence/onchain/, five from mainnet and seven from testnet. probe-onchain.mts holds the parser to them,
and probe-read-walk.mjs walks the page with the explorer stood in for by those records.

DNS (tested 2026-11-10): Google's JSON API answers a browser page with `access-control-allow-origin: *` for every
type asked, needs no key and no account, and Google calls it "a web-friendly API". A reading keeps each record as a
line, with TTLs left out because they count down, so the next reading of the same domain, in the same run or an
earlier run of the same check, can say what was added and what was removed. It stays open: whether the records point
where they should is the project's to say, and nothing watches while the page is closed. A record whose data holds
characters outside the ones these record types use is kept only as a fingerprint, so a change to it still shows and
its text does not reach the page or the record. The fixtures are doh-dash-org.json and doh-github.json (a CAA set
and an alias).

Scorecard (tested 2026-11-05): the API answers a browser page with `access-control-allow-origin: *`, on a 404 too,
and keeps GitHub's letter case (`microsoft/TypeScript` is found, `microsoft/typescript` is not), so the page tries
the typed name and then its lower case once. Its README says it scans more than 1.3 million repositories every week
and that the weekly scan leaves out Dependency-Update-Tool; a project's own Scorecard Action with
`publish_results: true` publishes the full set. On the day: dashevo/dashcore-lib has published results;
dashpay/dash, dashpay/platform, dashpay/dashj, dashpay/dash-wallet, dashpay/dash-evo-tool and dashpay/dips do not.

A Scorecard check limits an answer only where its own docs say it sees what the statement claims. Code-Review
(about the last 30 changes) and Branch-Protection (force pushes and deletion are its first tier, 3 of 10) can.
Token-Permissions cannot see the repository's read-only setting, Signed-Releases verifies nothing, Dependency-Update-
Tool calls a low score not definitive, and Security-Policy cannot see GitHub's private reporting. For those, a high
score backs the answer and a low one is open: the reading says what Scorecard found and limits nothing. The same
rule now covers a 7 address that has not spent. The fixtures are scorecard-dashevo-dashcore-lib.json and
scorecard-ossf-scorecard.json, trimmed to the six checks the parser reads.

RDAP bases come from IANA's bootstrap (data.iana.org/rdap/dns.json, publication 2026-10-28). That file lists 379
RDAP hosts; the page allows only these five, for the endings Dash projects use most, and says plainly when a
domain's registry is not one of them. .io, .co and .me publish no RDAP in the bootstrap at all.

## Tested and not used

| Record | Host | Why not |
|---|---|---|
| rdap.org | rdap.org | redirects to the registry, so the policy would have to allow every registry host |
| Certificate Transparency | crt.sh | does not answer a browser page (no CORS); the request timed out after a minute |
| Certificate Transparency | api.certspotter.com | readable and keyless, 10 queries an hour without a key; but its reference (read 2026-11-10) allows unauthenticated queries "for personal or evaluation purposes" and asks a production site to sign up and authenticate. A key needs a server, so the read is not used (accounts: cert-watch stays the project's word) |
| DNS over HTTPS | cloudflare-dns.com | readable; dns.google is used instead, one host being enough |
| Dash explorer | api.blockchair.com | its block count was about 17,000 ahead of insight and cryptoID, which agreed with each other |
| Dash explorer | chainz.cryptoid.info | readable; a second explorer if insight is down |
| Masternode list | insight.dash.org/insight-api/masternodes/list | refused (403) |

insight.dash.org puts non-browser clients behind a Cloudflare check, so scripts that read it (for fixtures) run
in a browser. The fixtures in research/evidence/ are real responses, trimmed to the fields the parsers read.

## What a reading can and cannot do

- It shows a state on the day it was read, not the practice behind it. A lock set today says nothing about who
  can remove it.
- A record is text a project could edit. The record names each link and date so a reviewer reads them again.
- A read tells its provider which domain or address is being checked. The page says so before the first read,
  and nothing is read until the learner presses for it.
- An answer is never overwritten. When it claims more than the record allows, the page says so and the project
  chooses; the record a reviewer receives says it either way.
- A reading that cannot settle a statement says so. It is marked open, and the record lists it as "The public
  record:" with no verdict, so a low score that proves nothing is never shown as a contradiction.
