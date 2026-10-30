"""Highscore-API voor partypooperjeeps.eu (vervangt Supabase sinds 30 okt 2026).

Alleen de standaardbibliotheek: http.server + sqlite3. nginx zet /api/ door naar deze server.

  GET  /api/highscores?limit=10   hoogste scores, nieuwste eerst bij gelijke stand (max 50)
  POST /api/highscores            nieuwe score (JSON, zelfde velden als de oude Supabase-tabel)
  GET  /api/health
"""
import json
import os
import sqlite3
import threading
import time
import uuid
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs, urlparse

DB_PATH = os.environ.get("DB_PATH", "/data/highscores.db")
PORT = int(os.environ.get("PORT", "8000"))
MAX_PER_UUR = int(os.environ.get("MAX_PER_UUR", "60"))  # inzendingen per IP per uur
NAAM_MAX = 10  # NameInputScene staat maximaal 10 tekens toe

lock = threading.Lock()
pogingen: dict[str, list[float]] = {}


def db() -> sqlite3.Connection:
    con = sqlite3.connect(DB_PATH)
    con.row_factory = sqlite3.Row
    return con


def init_db() -> None:
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    with db() as con:
        con.execute("""CREATE TABLE IF NOT EXISTS highscores (
            id TEXT PRIMARY KEY,
            player_name TEXT NOT NULL,
            score INTEGER NOT NULL,
            presents_collected INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            player1_name TEXT NOT NULL DEFAULT 'PLAYER 1',
            player2_name TEXT NOT NULL DEFAULT 'CPU',
            game_mode TEXT NOT NULL DEFAULT 'single',
            winner_name TEXT NOT NULL DEFAULT 'PLAYER 1')""")
        con.execute("CREATE INDEX IF NOT EXISTS idx_score ON highscores (score DESC, created_at DESC)")


def naam(waarde, standaard: str) -> str:
    tekst = str(waarde if waarde is not None else standaard).strip()
    tekst = "".join(t for t in tekst if t.isprintable())[:NAAM_MAX]
    return tekst or standaard


def geheel(waarde, minimum: int, maximum: int) -> int:
    if isinstance(waarde, bool) or not isinstance(waarde, (int, float)):
        raise ValueError("geen getal")
    getal = int(waarde)
    if not minimum <= getal <= maximum:
        raise ValueError("buiten bereik")
    return getal


def te_vaak(ip: str) -> bool:
    nu = time.time()
    with lock:
        recent = [t for t in pogingen.get(ip, []) if t > nu - 3600]
        recent.append(nu)
        pogingen[ip] = recent
        return len(recent) > MAX_PER_UUR


class Handler(BaseHTTPRequestHandler):
    server_version = "highscores"

    def log_message(self, fmt, *args):  # korte regel in de containerlog
        print(f"{self.headers.get('X-Real-IP', self.client_address[0])} {fmt % args}", flush=True)

    def stuur(self, status: int, data) -> None:
        body = json.dumps(data).encode()
        self.send_response(status)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Cache-Control", "no-store")
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        url = urlparse(self.path)
        if url.path == "/api/health":
            return self.stuur(200, {"ok": True})
        if url.path != "/api/highscores":
            return self.stuur(404, {"error": "niet gevonden"})
        try:
            limit = max(1, min(50, int(parse_qs(url.query).get("limit", ["10"])[0])))
        except ValueError:
            limit = 10
        with db() as con:
            rijen = con.execute(
                "SELECT * FROM highscores ORDER BY score DESC, created_at DESC LIMIT ?", (limit,)).fetchall()
        self.stuur(200, [dict(r) for r in rijen])

    def do_POST(self):
        if urlparse(self.path).path != "/api/highscores":
            return self.stuur(404, {"error": "niet gevonden"})
        ip = self.headers.get("X-Real-IP", self.client_address[0])
        if te_vaak(ip):
            return self.stuur(429, {"error": "te veel inzendingen"})
        try:
            lengte = int(self.headers.get("Content-Length", "0"))
            if not 0 < lengte <= 2048:
                raise ValueError("ongeldige lengte")
            data = json.loads(self.rfile.read(lengte))
            if not isinstance(data, dict):
                raise ValueError("geen object")
            modus = data.get("game_mode", "single")
            if modus not in ("single", "multi"):
                raise ValueError("ongeldige spelmodus")
            rij = {
                "id": str(uuid.uuid4()),
                "player_name": naam(data.get("player_name"), "PLAYER 1"),
                "score": geheel(data.get("score"), 0, 1_000_000),
                "presents_collected": geheel(data.get("presents_collected", 0), 0, 10_000),
                "created_at": datetime.now(timezone.utc).isoformat(),
                "player1_name": naam(data.get("player1_name"), "PLAYER 1"),
                "player2_name": naam(data.get("player2_name"), "CPU"),
                "game_mode": modus,
                "winner_name": naam(data.get("winner_name"), "PLAYER 1"),
            }
        except (ValueError, json.JSONDecodeError) as fout:
            return self.stuur(400, {"error": f"ongeldige score: {fout}"})
        with db() as con:
            con.execute(f"INSERT INTO highscores ({', '.join(rij)}) VALUES ({', '.join('?' * len(rij))})",
                        tuple(rij.values()))
        self.stuur(201, {"ok": True, "id": rij["id"]})


if __name__ == "__main__":
    init_db()
    print(f"highscores op poort {PORT}, database {DB_PATH}", flush=True)
    ThreadingHTTPServer(("0.0.0.0", PORT), Handler).serve_forever()
