/*
  # Create high scores table

  1. New Tables
    - `highscores`
      - `id` (uuid, primary key)
      - `player_name` (text)
      - `score` (integer)
      - `presents_collected` (integer)
      - `created_at` (timestamp)
      
  2. Security
    - Enable RLS
    - Add policy for inserting scores
    - Add policy for reading scores
*/

CREATE TABLE IF NOT EXISTS highscores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  presents_collected integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE highscores ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read high scores
CREATE POLICY "Anyone can read high scores"
  ON highscores
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to insert scores
CREATE POLICY "Anyone can insert high scores"
  ON highscores
  FOR INSERT
  TO public
  WITH CHECK (true);