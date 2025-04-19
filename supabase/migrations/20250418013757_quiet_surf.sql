/*
  # Add visitors tracking and update orders

  1. New Tables
    - `visitors`
      - `id` (uuid, primary key)
      - `visited_at` (timestamp)
      - `page` (text)
      - `user_agent` (text)

  2. Security
    - Enable RLS on visitors table
    - Add policies for authenticated users to read visitors
    - Add policy for public to insert visitors
*/

CREATE TABLE IF NOT EXISTS visitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  visited_at timestamptz DEFAULT now(),
  page text NOT NULL,
  user_agent text
);

ALTER TABLE visitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated users to read visitors"
  ON visitors
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow public to insert visitors"
  ON visitors
  FOR INSERT
  TO anon
  WITH CHECK (true);