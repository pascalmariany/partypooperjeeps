// Highscores via de eigen API op partypooperjeeps.eu (vervangt Supabase sinds 30 okt 2026).

export interface HighScore {
  id: string;
  player_name: string;
  score: number;
  presents_collected: number;
  created_at: string;
  player1_name: string;
  player2_name: string;
  game_mode: 'single' | 'multi';
  winner_name: string;
}

export type NewHighScore = Omit<HighScore, 'id' | 'created_at'>;

export async function fetchHighScores(limit: number): Promise<HighScore[]> {
  const res = await fetch(`/api/highscores?limit=${limit}`);
  if (!res.ok) throw new Error(`Highscores laden mislukt (${res.status})`);
  return res.json();
}

export async function saveHighScore(entry: NewHighScore): Promise<void> {
  const res = await fetch('/api/highscores', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry),
  });
  if (!res.ok) throw new Error(`Score opslaan mislukt (${res.status})`);
}
