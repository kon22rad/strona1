/*
  # Fix orders table RLS policies

  1. Changes
    - Drop existing RLS policies for orders table
    - Create new, more specific RLS policies:
      - INSERT: Allow authenticated users to create orders
      - SELECT: Allow users to read their own orders
      - UPDATE: Allow users to update their own orders' status
  
  2. Security
    - Ensures users can only access their own orders
    - Maintains data isolation between users
    - Preserves existing RLS enabled state
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Allow authenticated users to insert orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to read orders" ON orders;
DROP POLICY IF EXISTS "Allow authenticated users to update orders" ON orders;

-- Create new, more specific policies
CREATE POLICY "Enable insert for authenticated users only" 
ON public.orders
FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read access for users to their own orders" 
ON public.orders
FOR SELECT 
TO authenticated 
USING (
  (customer->>'user_id')::text = auth.uid()::text
);

CREATE POLICY "Enable update for users to their own orders" 
ON public.orders
FOR UPDATE
TO authenticated 
USING (
  (customer->>'user_id')::text = auth.uid()::text
) 
WITH CHECK (
  (customer->>'user_id')::text = auth.uid()::text
);