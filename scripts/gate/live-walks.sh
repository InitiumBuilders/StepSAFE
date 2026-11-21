#!/usr/bin/env bash
# The walks that follow a StepSAFE ship, against the live address, one after another, each with its whole output
# kept in a folder. Then one real read of a mainnet token through the live page.
#   bash scripts/gate/live-walks.sh <log file> <folder for the outputs>
# A walk that stops on a thrown timeout (no PROBLEMS line) is run once more. A walk that prints a FAIL is not run
# again: read it. Every line of the log must say exit 0 and PROBLEMS (0).
G="$(cd "$(dirname "$0")" && pwd)"
cd "$G/../.." || exit 1
P=https://unitium-safe.vercel.app
LOG="${1:?give a log file}"; OUT="${2:?give a folder for the outputs}"
# the walks empty their log first, so a gate log handed here by mistake would be lost; a release needs that log
if head -1 "$LOG" 2>/dev/null | grep -q '^gate started'; then
  echo "REFUSED: $LOG is a gate log (the release needs it). Give the live walks a log of their own." >&2; exit 2
fi
mkdir -p "$OUT"; : > "$LOG"
say() { echo "$@" | tee -a "$LOG"; }
say "live walks started $(date '+%H:%M:%S') against $P"
for w in probe-read-walk.mjs probe-read-webkit.mjs probe-csp.mjs probe-touch.mjs probe-tabbar.mjs probe-back.mjs probe-check-walk.mjs probe-dasha.mjs probe-table-walk.mjs probe-tabrow-walk.mjs probe-wide-walk.mjs; do
  line=$(bash "$G/quiet-walk.sh" "$w" "$OUT/$w.out" "$P" 20); code=$?
  say "$line"
  if [ $code -ne 0 ] && ! grep -q '^PROBLEMS' "$OUT/$w.out"; then
    say "   it stopped before its last line: $(grep -v '^----' "$OUT/$w.out" | tail -3 | tr '\n' ' ' | cut -c1-260)"
    cp "$OUT/$w.out" "$OUT/$w.first.out"
    line=$(bash "$G/quiet-walk.sh" "$w" "$OUT/$w.out" "$P" 30); code=$?
    say "   again: $line"
  fi
done
# a public token contract on mainnet, read with the real explorer and the site's real policy
out=$(node "$G/live-read.mjs" $P ENDv6HL8MrkAhotcM5vBDaTy4ameZzyHN4MWB7mp13TR mainnet 2>&1)
say "live read: $(echo "$out" | tr -d '\n' | cut -c1-600)"
say "live walks finished $(date '+%H:%M:%S')"
