#!/usr/bin/env bash
# One name for every file of a build. For each file in the folder, the line "<sha256>  <path>" (the path relative to
# the folder), sorted by path in the C locale; then the SHA-256 of that list, its first 16 hex characters. The lines
# are written here rather than taken from sha256sum, whose Git Bash build marks binary mode with "*" where Linux puts
# a second space, so a build has the same digest on this machine and on GitHub's runner. release.yml's SHA256SUMS
# holds the same list, so its digest is sha256sum SHA256SUMS. The gate names its build by it, and a release finds
# the gate of the build it made by it.
#   bash scripts/gate/build-digest.sh [folder, default dist]
set -euo pipefail
cd "${1:-dist}"
find . -type f | sed 's|^\./||' | LC_ALL=C sort | while IFS= read -r f; do
  printf '%s  %s\n' "$(sha256sum "$f" | cut -c1-64)" "$f"
done | sha256sum | cut -c1-16
