#!/usr/bin/env bash
# The public copy of StepSAFE at github.com/InitiumBuilders/StepSAFE. August chose, on 2026-11-14, to make everything
# public. One folder stays out: research/outlier holds private security assessments of real systems, his own live
# sites among them, which its own brief says never ship. The app already ships their public cut.
#
# It takes the files this repository holds at HEAD (commit first: run it after scripts/keep.sh), leaves out
# research/outlier, adds the Scorecard and CodeQL workflows (scripts/mirror/), scans the copy for secrets and for
# private details, and pushes one commit. A hit in a scan stops it before anything leaves this machine.
#   bash scripts/mirror.sh
# The copy is kept in C:\Users\Initi\outputs\stepsafe-public between runs. The push runs in WSL, where gh holds the
# GitHub sign-in.
set -euo pipefail
cd "$(dirname "$0")/.."
SRC=$(pwd)
OUT=/c/Users/Initi/outputs/stepsafe-public
WSL_OUT=/mnt/c/Users/Initi/outputs/stepsafe-public
REPO=https://github.com/InitiumBuilders/StepSAFE.git
git diff --quiet && git diff --cached --quiet || { echo "REFUSED: commit first (scripts/keep.sh); the copy is made from HEAD" >&2; exit 2; }
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
wsl.exe -e bash -lc "cd $WSL_OUT && git -c credential.helper= -c credential.helper='!gh auth git-credential' fetch -q origin main 2>/dev/null && git reset -q --soft origin/main || true"

# the copy: everything at HEAD but research/outlier, plus the two workflows
find "$OUT" -mindepth 1 -maxdepth 1 ! -name .git -exec rm -rf {} +
git archive --format=tar HEAD | tar -x -C "$OUT"
rm -rf "$OUT/research/outlier"
mkdir -p "$OUT/.github/workflows" && cp scripts/mirror/scorecard.yml scripts/mirror/codeql.yml "$OUT/.github/workflows/"

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
if git diff --cached --quiet; then echo "mirror: the public copy already matches $HEAD_SHA"; exit 0; fi
git commit -q -m "Sync from $HEAD_SHA: $SUBJECT" -m "Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>"
git log --oneline -1
wsl.exe -e bash -lc "cd $WSL_OUT && git -c credential.helper= -c credential.helper='!gh auth git-credential' -c core.fileMode=false push -q origin main 2>&1 | tail -2"
echo "mirror: pushed $(git rev-parse --short HEAD) to $REPO"
