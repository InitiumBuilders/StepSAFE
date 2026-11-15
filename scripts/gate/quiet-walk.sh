#!/usr/bin/env bash
# One StepSAFE walk, started when no other browser walk is running on this machine (or after a short wait for that),
# with its whole output kept and a note of what else was running while it ran.
#   bash scripts/gate/quiet-walk.sh <walk file> <output file> [base address] [seconds to wait for quiet, default 90]
# Prints one summary line. The exit code is the walk's own.
# Written 14 Nov 2026: two walks of a gate threw timeouts while other sessions ran their own headless browsers and
# the machine had about 1 GB of memory free. A walk that passes under load has passed. One that throws is run again.
cd "$(dirname "$0")/../.." || exit 1
W="$1"; OUT="$2"; BASE="${3:-http://localhost:5189}"; CAP="${4:-90}"
PS='(Get-CimInstance Win32_Process | Where-Object { $_.Name -match "^(chrome|msedge)\.exe$" -and $_.CommandLine -match "--headless" -and $_.CommandLine -notmatch "--type=" } | Measure-Object).Count'
win() { powershell.exe -NoProfile -Command "$PS" 2>/dev/null | tr -d '\r\n '; }
lin() { wsl.exe -e bash -c 'pgrep -fc "ms-playwrigh[t]|chrom.*--headles[s]"' 2>/dev/null | tr -d '\r\n '; }
mem() { powershell.exe -NoProfile -Command '[int]((Get-CimInstance Win32_OperatingSystem).FreePhysicalMemory/1024)' 2>/dev/null | tr -d '\r\n '; }

t0=$(date +%s); quiet=0; a=0; b=0
while [ "$quiet" -lt 2 ] && [ $(( $(date +%s) - t0 )) -lt "$CAP" ]; do
  a=$(win); b=$(lin)
  if [ "${a:-0}" = 0 ] && [ "${b:-0}" = 0 ]; then quiet=$((quiet + 1)); else quiet=0; fi
  [ "$quiet" -lt 2 ] && sleep 3
done
start=$(date '+%H:%M:%S'); m0=$(mem)
[ "$quiet" -ge 2 ] && note="quiet at the start" || note="not quiet after ${CAP}s (windows ${a:-?}, wsl ${b:-?}); run anyway"

SAMPLES="$OUT.samples"; : > "$SAMPLES"
( while true; do echo "$(date '+%H:%M:%S') windows $(win) wsl $(lin) free $(mem)MB" >> "$SAMPLES"; sleep 6; done ) &
sampler=$!
node "$W" "$BASE" > "$OUT" 2>&1; code=$?
kill "$sampler" 2>/dev/null; wait "$sampler" 2>/dev/null

n=$(grep -c '^ok ' "$OUT")
maxwin=$(awk '{print $3}' "$SAMPLES" | sort -n | tail -1); maxlin=$(awk '{print $5}' "$SAMPLES" | sort -n | tail -1)
minfree=$(awk '{gsub("MB","",$7); print $7}' "$SAMPLES" | sort -n | head -1)
{
  echo "---- $W started $start ($note), finished $(date '+%H:%M:%S'), exit $code"
  echo "---- while it ran: at most ${maxwin:-?} main headless browsers on Windows (this walk's own is one of them for a Chromium walk), at most ${maxlin:-?} browser processes in WSL, least free memory ${minfree:-?} MB (free at the start ${m0:-?} MB)"
} >> "$OUT"
echo "$W exit $code | ok $n | $(grep -E '^PROBLEMS' "$OUT" | head -1) | $start to $(date '+%H:%M:%S') | $note | others: windows max ${maxwin:-?}, wsl max ${maxlin:-?}, least free ${minfree:-?} MB"
exit $code
