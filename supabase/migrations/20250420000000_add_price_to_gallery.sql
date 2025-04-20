/*
  Add price column to garage_images table
*/

ALTER TABLE garage_images
ADD COLUMN price numeric;

-- Optional: Add a comment to the new column
COMMENT ON COLUMN garage_images.price IS 'Price of the garage';