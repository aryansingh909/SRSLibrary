-- Fix admin access to gallery_images table
-- Problem: Current SELECT policy only allows active=true records
-- Solution: Add a policy that allows anon to SELECT all records for admin purposes

-- Drop the restrictive policy for gallery_images SELECT
DROP POLICY IF EXISTS anon_select_gallery ON gallery_images;

-- Create new admin SELECT policy that allows seeing ALL records
CREATE POLICY "admin_select_all_gallery_images" ON gallery_images
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Verify the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'gallery_images' 
ORDER BY ordinal_position;