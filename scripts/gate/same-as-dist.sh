#!/usr/bin/env bash
# Is the site at <base> the build in dist, byte for byte? Every file of the build is fetched from the address and
# compared by sha256. Prints the count and every file that differs or is missing. Run it right after a ship.
#   bash scripts/gate/same-as-dist.sh https://unitium-safe.vercel.app
cd "$(dirname "$0")/../../dist" || exit 1
B="${1:?give the address}"; same=0; bad=0; n=0
echo "build: index.html md5 $(md5sum index.html | cut -c1-12), $(find . -type f | wc -l) files"
while IFS= read -r f; do
  f="${f#./}"; n=$((n + 1))
  if [ "$f" = index.html ]; then u="$B/"; else u="$B/$f"; fi
  want=$(sha256sum "$f" | cut -c1-64)
  have=$(curl -s -m 40 --compressed "$u" | sha256sum | cut -c1-64)
  if [ "$want" = "$have" ]; then same=$((same + 1)); else
    # one more try: a first fetch right after a deploy can be cut short
    have=$(curl -s -m 60 --compressed "$u" | sha256sum | cut -c1-64)
    if [ "$want" = "$have" ]; then same=$((same + 1)); else bad=$((bad + 1)); echo "DIFFERS: $f"; fi
  fi
done < <(find . -type f | sort)
echo "$same of $n files are the same at $B; $bad differ"
[ "$bad" = 0 ]
