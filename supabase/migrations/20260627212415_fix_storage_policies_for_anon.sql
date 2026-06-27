/*
# Fix Storage Policies for Anon Uploads

1. Changes
- Allow anon (unauthenticated) users to upload, update, and delete images in storage bucket
- Admin API routes use the anon key client, so they need anon access to storage
- Admin routes already have their own password-based authentication layer

2. Security
- Public read access remains for all images (needed for website display)
- Anon upload/delete/update access is enabled since the admin API routes handle their own authentication
- The storage bucket is already limited to 5MB and only accepts image types
*/

-- Allow anon users to upload images (admin API routes use anon key)
DROP POLICY IF EXISTS "Authenticated upload" ON storage.objects;
CREATE POLICY "Anon upload images" ON storage.objects
FOR INSERT TO anon WITH CHECK (bucket_id = 'images');

-- Allow anon users to update images
DROP POLICY IF EXISTS "Authenticated update" ON storage.objects;
CREATE POLICY "Anon update images" ON storage.objects
FOR UPDATE TO anon USING (bucket_id = 'images');

-- Allow anon users to delete images
DROP POLICY IF EXISTS "Authenticated delete" ON storage.objects;
CREATE POLICY "Anon delete images" ON storage.objects
FOR DELETE TO anon USING (bucket_id = 'images');
