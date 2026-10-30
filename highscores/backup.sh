#!/usr/bin/env bash
# Dagelijkse back-up van de highscore-database (cron op Contabo). Bewaart 30 dagen.
# Gebruikt de online-backup van SQLite, dus veilig terwijl de API draait.
set -euo pipefail
DIR=/root/partypooperjeeps/backups
mkdir -p "$DIR"
docker exec partypooperjeeps-highscores python -c "import sqlite3; s=sqlite3.connect('/data/highscores.db'); d=sqlite3.connect('/tmp/backup.db'); s.backup(d); d.close()"
docker cp partypooperjeeps-highscores:/tmp/backup.db "$DIR/highscores-$(date +%F).db"
docker exec partypooperjeeps-highscores rm -f /tmp/backup.db
find "$DIR" -name 'highscores-*.db' -mtime +30 -delete
