-- Drop ALL existing RLS policies on all public tables
-- This is a clean slate for security policies

DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN 
    SELECT schemaname, tablename, policyname 
    FROM pg_policies 
    WHERE schemaname = 'public'
    AND tablename IN (
      'site_settings', 'gallery_images', 'blog_posts', 'faqs', 
      'degree_programs', 'membership_plans', 'navigation_menu', 
      'page_sections', 'reviews', 'contact_requests', 
      'degree_enquiries', 'library_memberships', 'admissions',
      'payments', 'notifications'
    )
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
      r.policyname, r.schemaname, r.tablename);
  END LOOP;
END $$;