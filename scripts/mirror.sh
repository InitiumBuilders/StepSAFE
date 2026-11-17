#!/usr/bin/env bash
# The public copy of StepSAFE at github.com/InitiumBuilders/StepSAFE. August chose, on 2026-11-14, to make everything
# public. One folder stays out: research/outlier holds private security assessments of real systems, his own live
# sites among them, which its own brief says never ship. The app already ships their public cut.
#
# It takes the files this repository holds at HEAD (commit first: run it after scripts/keep.sh), leaves out
# research/outlier, adds the workflows and Dependabot's settings from scripts/mirror/, scans the copy for secrets and
# for private details, and pushes one commit. A hit in a scan stops it before anything leaves this machine.
#   bash scripts/mirror.sh                            after notes or tooling
#   bash scripts/mirror.sh --release --gate <log>     after a ship. The gate log must be the one the shipped build
#       passed: its first line names the build in dist (index.html by MD5, every file by
#       scripts/gate/build-digest.sh), it reached "gate finished", and the last line of every check says exit 0 (a
#       walk run again alone with scripts/gate/quiet-walk.sh adds a later line of its own). The live site must be that
#       build. The log is kept as releases/gate-<md5>.txt and committed here first. Then the commit is tagged
#       (v2026.11.17, then v2026.11.17.2 the same day), and the Release workflow builds the site from it, checks the
#       live site is that build file for file, finds the gate of that same build, signs the provenance for both and
#       publishes the release
# The copy is kept in C:\Users\Initi\outputs\stepsafe-public between runs. The push runs in WSL, where gh holds the
# GitHub sign-in.
set -euo pipefail
cd "$(dirname "$0")/.."
RELEASE=0; GATE=''
while [ $# -gt 0 ]; do
  case "$1" in
    --release) RELEASE=1 ;;
    --gate) GATE="${2:-}"; shift ;;
    *) echo "unknown argument: $1" >&2; exit 2 ;;
  esac
  shift
done
[ "$RELEASE" = 1 ] && [ -z "$GATE" ] && { echo "REFUSED: a release publishes the gate it passed: --release --gate <gate log>" >&2; exit 2; }
SRC=$(pwd)
OUT=/c/Users/Initi/outputs/stepsafe-public
WSL_OUT=/mnt/c/Users/Initi/outputs/stepsafe-public
REPO=https://github.com/InitiumBuilders/StepSAFE.git
GIT_GH="git -c credential.helper= -c credential.helper='!gh auth git-credential' -c core.fileMode=false"
git diff --quiet && git diff --cached --quiet || { echo "REFUSED: commit first (scripts/keep.sh); the copy is made from HEAD" >&2; exit 2; }
# the gate of the build that shipped, kept with the code before the copy is made
if [ -n "$GATE" ]; then
  [ -f "$GATE" ] || { echo "REFUSED: no gate log at $GATE" >&2; exit 2; }
  MD5=$(md5sum dist/index.html | cut -c1-12); DIGEST=$(bash scripts/gate/build-digest.sh dist)
  head -1 "$GATE" | grep -q "on $MD5 build $DIGEST" ||
    { echo "REFUSED: $GATE is not the gate of the build in dist (index.html $MD5, build $DIGEST)" >&2; exit 2; }
  grep -q '^gate finished' "$GATE" || { echo "REFUSED: $GATE did not finish" >&2; exit 2; }
  awk -F' exit ' 'NF > 1 { c = $2; sub(/[^0-9].*$/, "", c); last[$1] = c }
    END { for (k in last) { n++; if (last[k] != "0") { print "  " k " ended with exit " last[k]; bad = 1 } } exit (bad || !n) }' "$GATE" >&2 ||
    { echo "REFUSED: in $GATE, not every check ends with exit 0" >&2; exit 2; }
  LIVE=$(curl -fsS --compressed -m 60 https://unitium-safe.vercel.app/ | md5sum | cut -c1-12) || LIVE=none
  [ "$LIVE" = "$MD5" ] || { echo "REFUSED: the live index.html ($LIVE) is not the build in dist ($MD5); ship it first" >&2; exit 2; }
  mkdir -p releases
  if [ ! -f "releases/gate-$MD5.txt" ]; then
    cp "$GATE" "releases/gate-$MD5.txt"
    bash scripts/keep.sh "Release evidence: the gate that build $MD5 passed

Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
  fi
fi
HEAD_SHA=$(git rev-parse --short HEAD); SUBJECT=$(git log -1 --format=%s)

mkdir -p "$OUT"
if [ ! -d "$OUT/.git" ]; then
  git -C "$OUT" init -q -b main
  git -C "$OUT" remote add origin "$REPO"
fi
git -C "$OUT" config user.name "Initium Builders"
git -C "$OUT" config user.email "207097273+InitiumBuilders@users.noreply.github.com"
git -C "$OUT" config core.autocrlf false
# the last published state, so the new commit follows it (nothing to fetch on the very first run)
wsl.exe -e bash -lc "cd $WSL_OUT && $GIT_GH fetch -q origin main 2>/dev/null && git reset -q --soft origin/main || true"

# the copy: everything at HEAD but research/outlier, plus the workflows
find "$OUT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
git archive --format=tar HEAD | tar -x -C "$OUT"
rm -rf "$OUT/research/outlier"
mkdir -p "$OUT/.github/workflows" && cp scripts/mirror/scorecard.yml scripts/mirror/codeql.yml scripts/mirror/release.yml "$OUT/.github/workflows/"
cp scripts/mirror/dependabot.yml "$OUT/.github/dependabot.yml"

cd "$OUT"
git add -A
[ -e research/outlier ] && { echo "REFUSED: research/outlier is in the copy" >&2; exit 2; }
node "$SRC/scripts/secret-scan.mjs" || { echo "REFUSED: the secret scan found something in the copy. Nothing was pushed." >&2; exit 1; }
# private details that must never be published: a personal address, an identity tied to one, the wallet's names
# (written in pieces, so this script does not match itself)
PRIVATE='august''decentral|@g''mail[.]com|imagine''change|DEV_''MNEMONIC|IDENTITY_''ID_HEX|DEV_''ADDRESS'
if git grep -I -i -l -E "$PRIVATE" >/dev/null; then
  echo "REFUSED: the copy holds a private detail:" >&2; git grep -I -i -l -E "$PRIVATE" >&2; exit 1
fi
if git diff --cached --quiet; then
  echo "mirror: the public copy already matches $HEAD_SHA"
else
  git commit -q -m "Sync from $HEAD_SHA: $SUBJECT" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
  git log --oneline -1
  # pipefail inside, so a refused push (main's ruleset refuses force pushes) fails here instead of reading as pushed
  wsl.exe -e bash -lc "set -o pipefail; cd $WSL_OUT && $GIT_GH push -q origin main 2>&1 | tail -2" \
    || { echo "REFUSED: the push to $REPO failed (see above). The commit stays in $OUT." >&2; exit 1; }
  echo "mirror: pushed $(git rev-parse --short HEAD) to $REPO"
fi

[ "$RELEASE" = 1 ] || exit 0
# the release tag: the day, and a count when there is more than one release that day
DAY="v$(date +%Y.%m.%d)"; TAG="$DAY"; n=1
while [ -n "$(git ls-remote --tags origin "refs/tags/$TAG" 2>/dev/null)" ]; do n=$((n + 1)); TAG="$DAY.$n"; done
git tag -a "$TAG" -m "StepSAFE $TAG: the build live at https://unitium-safe.vercel.app, from $HEAD_SHA"
wsl.exe -e bash -lc "set -o pipefail; cd $WSL_OUT && $GIT_GH push -q origin refs/tags/$TAG 2>&1 | tail -2" \
  || { echo "REFUSED: the tag $TAG did not reach $REPO (see above)." >&2; exit 1; }
echo "mirror: tagged $TAG. The Release workflow now builds it, checks the live site file by file, signs and publishes:"
echo "  https://github.com/InitiumBuilders/StepSAFE/actions/workflows/release.yml"
