/*
  # Create orders and gallery tables

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `config` (jsonb)
      - `customer` (jsonb)
      - `status` (text)
      - `total_price` (numeric)
    
    - `garage_images`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `title` (text)
      - `description` (text)
      - `image_url` (text)

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users
*/

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  config jsonb NOT NULL,
  customer jsonb NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  total_price numeric NOT NULL
);

-- Create garage_images table
CREATE TABLE IF NOT EXISTS garage_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  title text NOT NULL,
  description text NOT NULL,
  image_url text NOT NULL
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE garage_images ENABLE ROW LEVEL SECURITY;

-- Create policies for orders
CREATE POLICY "Allow authenticated users to read orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to insert orders"
  ON orders
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update orders"
  ON orders
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create policies for garage_images
CREATE POLICY "Allow public to read garage_images"
  ON garage_images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated users to manage garage_images"
  ON garage_images
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);