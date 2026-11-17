# Releasing StepSAFE, and taking a release back

Written 2026-11-14. StepSAFE's own record (#/trust) says these steps are written down. Keep them true.

## A release

1. Build and run the gate on the build: `bash scripts/gate/gate.sh <log>`, with the built site served on port 5189
   (the `stepsafe-serve` preview). The last line of every check must say exit 0. A walk that stops under load is run
   again alone, and its line is added to the log: `bash scripts/gate/quiet-walk.sh <walk> <output file> >> <log>`.
2. Production needs August's own go-ahead for that build in the session that built it.
3. `bash scripts/ship.sh "what changed"`. Before it builds, it refuses when:
   - a `.js` file sits beside the sources;
   - the outline is out of date;
   - the security contact is still `[[SECURITY CONTACT]]`;
   - `public/sbom.cdx.json` does not match the lockfile;
   - OSV.dev lists a known flaw in a package that ships, or cannot be asked (`scripts/vulns.mjs`).
   Then it builds, deploys the prebuilt tarball to production, and `scripts/keep.sh` commits, scans every tracked
   file for secrets, and pushes to the private repository.
4. After it: `bash scripts/gate/same-as-dist.sh` (the live site against `dist`, file by file) and
   `bash scripts/gate/live-walks.sh` (the walks and one real read against production).
5. Then `bash scripts/mirror.sh --release --gate <gate log>`, with the log of the gate the shipped build passed. It
   refuses a log that names another build or has a check whose last line is not exit 0, and it refuses while the live
   site is another build. The log is kept as releases/gate-<md5>.txt and committed; the public copy at
   github.com/InitiumBuilders/StepSAFE takes the new commit, without research/outlier, after a secret scan and a
   privacy scan of the copy, with Dependabot's weekly updates and the workflows; and the commit is tagged
   (v2026.11.17, or v2026.11.17.2 for a second release that day). The push runs OpenSSF Scorecard and CodeQL. The tag
   runs the Release workflow: it builds the site again from that commit, checks the live site is that build file by
   file, finds the gate of that same build and checks it the same way, and only then signs SLSA build provenance
   through Sigstore for the files and the gate and publishes the release. A file that differs, or a gate that is
   missing or has a failing check, stops it, and nothing is signed. After notes or tooling only,
   `bash scripts/mirror.sh` syncs without a tag.

## Taking a release back

Vercel keeps every deployment. Production can be pointed back at the last good one without a rebuild.

1. Find the last good production deployment: `vercel ls`. The list shows each deployment's address, its environment
   and its age.
2. Point production back at it: `vercel rollback <deployment address> --yes`. `vercel rollback status` shows a
   rollback still in progress.
3. Check the live site is that deployment: `bash scripts/gate/same-as-dist.sh` against a `dist` built from that
   commit, or read a file you know changed.
4. When the fix is ready, ship it the usual way. `vercel promote <deployment address> --yes` also moves production to
   a chosen deployment.
5. Write down what happened, when, and why, in `docs/NEXT-MOVE.md`.

A rollback has not been practiced yet. Practicing one moves production, so it waits for August's word.
