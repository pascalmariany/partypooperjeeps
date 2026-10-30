"""Eenmalig: zet een JSON-export van de Supabase-tabel highscores in de SQLite-database.

Gebruik in de container:  python import_supabase.py /tmp/highscores.json
Bestaande id's worden overgeslagen, dus opnieuw draaien kan geen kwaad.
"""
import json
import sys

from server import db, init_db

KOLOMMEN = ["id", "player_name", "score", "presents_collected", "created_at",
            "player1_name", "player2_name", "game_mode", "winner_name"]

init_db()
rijen = json.load(open(sys.argv[1], encoding="utf-8"))
with db() as con:
    voor = con.execute("SELECT count(*) FROM highscores").fetchone()[0]
    con.executemany(f"INSERT OR IGNORE INTO highscores ({', '.join(KOLOMMEN)}) VALUES ({', '.join('?' * len(KOLOMMEN))})",
                    [tuple(r[k] for k in KOLOMMEN) for r in rijen])
    na = con.execute("SELECT count(*) FROM highscores").fetchone()[0]
print(f"{na - voor} scores toegevoegd, {na} in totaal")
