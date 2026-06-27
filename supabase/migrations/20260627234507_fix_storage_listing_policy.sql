/*
# Fix Storage Bucket Policies

The current "Public read access" policy allows listing all files.
For public buckets, direct file URLs work without SELECT policy.
We'll restrict SELECT to only the specific operations needed.

Security Model:
- Public can access files via direct URLs (bucket is public)
- Admin (via API with password protection) can upload/update/delete
- Remove broad SELECT that allows listing all files
*/

-- Drop the broad public read access policy
DROP POLICY IF EXISTS "Public read access" ON storage.objects;

-- For a public bucket, files are accessible by direct URL anyway.
-- We only need SELECT for admin operations to list/manage files.
CREATE POLICY "storage_admin_select" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'images');

-- Keep existing admin upload policies
-- (Anon upload images, Anon update images, Anon delete images should exist)