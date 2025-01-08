/*
  # Add player names and game mode tracking

  1. Changes
    - Add player1_name and player2_name columns to track both players
    - Add game_mode column to distinguish between single/multiplayer games
    - Add winner_name column to explicitly track winner
    - Update policies for new columns

  2. Security
    - Maintain existing RLS policies
    - Allow public read/insert access
*/

-- Drop existing policy first
DROP POLICY IF EXISTS "Anyone can insert high scores" ON highscores;

-- Add new columns to highscores table
ALTER TABLE highscores ADD COLUMN IF NOT EXISTS player1_name text NOT NULL DEFAULT 'PLAYER 1';
ALTER TABLE highscores ADD COLUMN IF NOT EXISTS player2_name text NOT NULL DEFAULT 'CPU';
ALTER TABLE highscores ADD COLUMN IF NOT EXISTS game_mode text NOT NULL DEFAULT 'single';
ALTER TABLE highscores ADD COLUMN IF NOT EXISTS winner_name text NOT NULL DEFAULT 'PLAYER 1';

-- Recreate the insert policy
CREATE POLICY "Anyone can insert high scores"
ON highscores
FOR INSERT
TO public
WITH CHECK (true);