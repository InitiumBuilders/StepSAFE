#!/usr/bin/env bash
# Keep the private repo in step: commit what changed, scan the whole tree for secrets, and push to
# github.com/InitiumBuilders/UnitiaSafeStep. The push runs in WSL, where gh holds the GitHub sign-in; this
# machine's Windows side has no gh. A hit in the scan stops the push and leaves the commit local.
#   bash scripts/keep.sh "what changed"
set -euo pipefail
cd "$(dirname "$0")/.."
msg=${1:?say what changed: bash scripts/keep.sh "what changed"}
git add -A
if git diff --cached --quiet; then
  echo "nothing new to commit"
else
  git commit -q -m "$msg"
  git log --oneline -1
fi
node scripts/secret-scan.mjs || { echo "REFUSED: the scan found something that looks like a secret. Nothing was pushed." >&2; exit 1; }
wsl.exe -e bash -lc "cd /mnt/c/Users/Initi/stepsafe && git -c credential.helper= -c credential.helper='!gh auth git-credential' -c core.fileMode=false push origin main 2>&1 | tail -2"
