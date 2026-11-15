#!/usr/bin/env bash
# Build, deploy to production, then keep the private repo in step with what went live.
#   bash scripts/ship.sh "what changed"
# The prebuilt tarball deploy is the one that holds on this network; it aliases unitium-safe.vercel.app itself.
set -euo pipefail
cd "$(dirname "$0")/.."
msg=${1:?say what changed: bash scripts/ship.sh "what changed"}
stray=$(find src -name '*.js' | wc -l)
[ "$stray" = 0 ] || { echo "REFUSED: $stray .js files beside the sources (the build trap; Vite would load them first)" >&2; exit 2; }
# the outline the app starts from must match the curriculum, or a learner would see old titles until the rest loads
npx tsx scripts/content-outline.mts --check || { echo "REFUSED: run npx tsx scripts/content-outline.mts and commit the outline" >&2; exit 2; }
# the public promises carry a real contact: a security.txt or a policy page that still says [[SECURITY CONTACT]] never ships
if grep -rlF '[[SECURITY CONTACT]]' public src >/dev/null 2>&1; then echo "REFUSED: the security contact is not set (public/.well-known/security.txt and the policy pages say [[SECURITY CONTACT]])" >&2; exit 2; fi
node scripts/sbom.mjs --check || { echo "REFUSED: run node scripts/sbom.mjs, so the served bill of materials is the lockfile's" >&2; exit 2; }
# no package that ships may carry a known flaw: OSV.dev is asked about each one, and no answer is no release
node scripts/vulns.mjs || { echo "REFUSED: a package that ships has a known flaw, or OSV.dev could not be asked (see above)" >&2; exit 2; }
vercel build --prod
vercel deploy --prebuilt --prod --yes --archive=tgz
bash scripts/keep.sh "$msg"
