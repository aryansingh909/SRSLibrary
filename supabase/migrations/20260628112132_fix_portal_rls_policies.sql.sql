-- Fix portal_sessions and site_settings RLS policies to allow anon key operations
-- These are server-side API operations with validated inputs

-- Portal sessions: Allow all operations for anon key (server-side API routes only)
CREATE POLICY "portal_sessions_all_operations" ON portal_sessions
  FOR ALL TO anon, authenticated
  USING (true)
  WITH CHECK (true);

-- Site settings: Allow INSERT/UPDATE/DELETE for anon key (server-side API routes)
CREATE POLICY "site_settings_insert" ON site_settings
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "site_settings_update" ON site_settings
  FOR UPDATE TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "site_settings_delete" ON site_settings
  FOR DELETE TO anon, authenticated
  USING (true);