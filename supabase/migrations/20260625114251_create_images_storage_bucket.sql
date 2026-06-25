/*
# Create images storage bucket

1. Storage Bucket
- Create 'images' bucket for admin image uploads
- Set as public bucket (images need to be publicly viewable on the website)
2. Security
- Allow public read access for all users (images displayed on public website)
- Allow authenticated admin uploads via service role (handled in API route)
*/

-- Create the storage bucket for images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'images',
  'images',
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Policy: Allow public read access to all images
DROP POLICY IF EXISTS "Public read access" ON storage.objects;
CREATE POLICY "Public read access" ON storage.objects
FOR SELECT TO public USING (bucket_id = 'images');

-- Policy: Allow authenticated users to upload images
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
CREATE POLICY "Authenticated upload" ON storage.objects
FOR INSERT TO authenticated WITH CHECK (bucket_id = 'images');

-- Policy: Allow authenticated users to update their images
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;
CREATE POLICY "Authenticated update" ON storage.objects
FOR UPDATE TO authenticated USING (bucket_id = 'images');

-- Policy: Allow authenticated users to delete images
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
CREATE POLICY "Authenticated delete" ON storage.objects
FOR DELETE TO authenticated USING (bucket_id = 'images');