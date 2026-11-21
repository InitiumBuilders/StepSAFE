#!/usr/bin/env bash
# The StepSAFE gate, one step after another, each result on one line. It needs the built site served locally
# (the stepsafe-serve preview, port 5189) and takes about 27 minutes on a quiet machine.
#   bash scripts/gate/gate.sh <log file> [base address, default http://localhost:5189]
# It runs: the type check, the outline check, every probe-*.mts, the wide crawl in three themes, then nineteen
# walks. Every line of the log must say exit 0. The whole output of each walk is kept in <log file>.out/.
# Its first line names the build: index.html by MD5, and every file by scripts/gate/build-digest.sh. A release finds
# the gate of its build by both (scripts/mirror.sh, scripts/mirror/release.yml).
# Kept here from 14 Nov 2026, when it had run five times in one day from a session's scratch folder.
#
# Two things that day taught:
# - A source change after a pass means the gate runs again. The gated build is the built one.
# - A walk that stops without a PROBLEMS line has thrown, usually on a timeout. That day six sessions shared the
#   machine, others ran headless browsers, about 1 GB of memory was free, and two walks stopped that way. Run such a
#   walk again alone with scripts/gate/quiet-walk.sh and read its output before reading anything into it. Two
#   browser walks at once make both lie.
cd "$(dirname "$0")/../.." || exit 1
LOG="${1:?give a log file}"; BASE="${2:-http://localhost:5189}"; : > "$LOG"; mkdir -p "$LOG.out"; rm -f "$LOG.fail"
say() { echo "$@" | tee -a "$LOG"; }
say "gate started $(date '+%H:%M:%S') on $(md5sum dist/index.html 2>/dev/null | cut -c1-12) build $(bash scripts/gate/build-digest.sh dist 2>/dev/null)"
npx tsc --noEmit > "$LOG.tsc" 2>&1; say "tsc exit $?"
npx tsx scripts/content-outline.mts --check > "$LOG.outline" 2>&1; say "outline exit $? $(tail -1 "$LOG.outline")"
for f in probe-*.mts; do
  [ "$f" = probe-wide.mts ] && continue
  out=$(npx tsx "$f" 2>&1); code=$?
  say "$f exit $code | $(echo "$out" | grep -E '^PROBLEMS' | head -1) | $(echo "$out" | grep -v '^PROBLEMS' | tail -1 | cut -c1-150)"
  [ $code -ne 0 ] && echo "$out" | tail -25 >> "$LOG.fail"
done
for t in nocturne meridian mov; do
  out=$(npx tsx probe-wide.mts "$BASE" --theme=$t 2>&1); code=$?
  say "probe-wide $t exit $code | $(echo "$out" | tail -2 | tr '\n' ' ' | cut -c1-220)"
  [ $code -ne 0 ] && echo "$out" | tail -25 >> "$LOG.fail"
done
for w in probe-tabbar.mjs probe-back.mjs probe-touch.mjs probe-play-walk.mjs probe-check-walk.mjs probe-glossary-walk.mjs probe-glossary-webkit.mjs probe-csp.mjs probe-motrus.mjs probe-dasha.mjs probe-dasha-voice.mjs probe-paxt-walk.mjs probe-read-walk.mjs probe-read-webkit.mjs probe-ownrecord-walk.mjs probe-keys.mjs probe-table-walk.mjs probe-tabrow-walk.mjs probe-wide-walk.mjs; do
  out=$(node "$w" "$BASE" 2>&1); code=$?
  echo "$out" > "$LOG.out/$w.txt"
  n=$(echo "$out" | grep -c '^ok ')
  say "$w exit $code | ok $n | $(echo "$out" | grep -E '^PROBLEMS' | head -1) | $(date '+%H:%M:%S')"
  [ $code -ne 0 ] && { echo "== $w" >> "$LOG.fail"; echo "$out" | grep -E 'FAIL|PROBLEMS' -A4 | tail -30 >> "$LOG.fail"; }
  # a walk that throws prints no PROBLEMS line: keep its last lines, which say where it stopped
  [ $code -ne 0 ] && ! echo "$out" | grep -q '^PROBLEMS' && { echo "-- it stopped before its last line; the end of its output:" >> "$LOG.fail"; echo "$out" | tail -14 >> "$LOG.fail"; }
done
say "gate finished $(date '+%H:%M:%S')"
