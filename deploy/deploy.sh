#!/usr/bin/env bash
# Bouw lokaal en zet de build als nieuwe release op Contabo (atomaire symlink-wissel).
# Gebruik: ./deploy/deploy.sh                 nieuwe release op https://partypooperjeeps.eu
#          ./deploy/deploy.sh rollback   terug naar de vorige release
set -euo pipefail
HOST=contabo
BASE=/var/www/partypooperjeeps.eu
KEEP=5
cd "$(dirname "$0")/.."

if [ "${1:-}" = rollback ]; then
  ssh "$HOST" "set -e; cd $BASE/releases; prev=\$(ls -1 | sort | tail -2 | head -1); cur=\$(readlink $BASE/current | xargs basename); [ \"\$prev\" != \"\$cur\" ] || { echo 'geen vorige release'; exit 1; }; ln -sfn $BASE/releases/\$prev $BASE/current.tmp && mv -T $BASE/current.tmp $BASE/current; rm -rf $BASE/releases/\$cur; echo \"terug naar \$prev\""
  exit 0
fi

npm ci --silent
npm run build
REL=$(date +%Y%m%d-%H%M%S)-$(git rev-parse --short HEAD)$(git diff --quiet HEAD || echo -dirty)
ssh "$HOST" "mkdir -p $BASE/releases/$REL"
# vorige release als basis, zodat ongewijzigde bestanden niet opnieuw over de lijn gaan
PREV=$(ssh "$HOST" "readlink $BASE/current 2>/dev/null || true")
rsync -az --delete ${PREV:+--link-dest="$PREV"} dist/ "$HOST:$BASE/releases/$REL/"
ssh "$HOST" "set -e; chown -R www-data:www-data $BASE/releases/$REL; ln -sfn $BASE/releases/$REL $BASE/current.tmp && mv -T $BASE/current.tmp $BASE/current; cd $BASE/releases && ls -1 | sort | head -n -$KEEP | xargs -r rm -rf; echo \"live: $REL\""
