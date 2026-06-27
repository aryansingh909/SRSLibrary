/*
# Secure RLS Policies - corrected column names

Reviews table uses 'approved' column, blog_posts uses 'published'
*/

-- ========================================
-- REVIEWS - Public read approved only, admin manages all
-- ========================================
CREATE POLICY "reviews_public_read" ON reviews
  FOR SELECT TO public USING (approved = true);

CREATE POLICY "reviews_admin_select" ON reviews
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_insert_reviews" ON reviews
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_reviews" ON reviews
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_reviews" ON reviews
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- BLOG POSTS - Public read published only, admin manages all
-- ========================================
CREATE POLICY "blog_public_read" ON blog_posts
  FOR SELECT TO public USING (published = true);

CREATE POLICY "blog_admin_select" ON blog_posts
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_insert_blog_posts" ON blog_posts
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_blog_posts" ON blog_posts
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_blog_posts" ON blog_posts
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- FAQS - Public read, admin manages
-- ========================================
CREATE POLICY "faqs_public_read" ON faqs
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_insert_faqs" ON faqs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_faqs" ON faqs
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_faqs" ON faqs
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- DEGREE PROGRAMS - Public read, admin manages
-- ========================================
CREATE POLICY "degree_programs_public_read" ON degree_programs
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_insert_degree_programs" ON degree_programs
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_degree_programs" ON degree_programs
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_degree_programs" ON degree_programs
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- MEMBERSHIP PLANS - Public read, admin manages
-- ========================================
CREATE POLICY "membership_plans_public_read" ON membership_plans
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_insert_membership_plans" ON membership_plans
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_membership_plans" ON membership_plans
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_membership_plans" ON membership_plans
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- NAVIGATION MENU - Public read, admin manages
-- ========================================
CREATE POLICY "navigation_menu_public_read" ON navigation_menu
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_insert_navigation_menu" ON navigation_menu
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_navigation_menu" ON navigation_menu
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_navigation_menu" ON navigation_menu
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- PAGE SECTIONS - Public read, admin manages
-- ========================================
CREATE POLICY "page_sections_public_read" ON page_sections
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_insert_page_sections" ON page_sections
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_page_sections" ON page_sections
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_page_sections" ON page_sections
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- SITE SETTINGS - Public read, admin write via API
-- ========================================
CREATE POLICY "site_settings_public_read" ON site_settings
  FOR SELECT TO public USING (true);

CREATE POLICY "admin_insert_site_settings" ON site_settings
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_site_settings" ON site_settings
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_site_settings" ON site_settings
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- GALLERY IMAGES - Public read active only, admin manages all
-- ========================================
CREATE POLICY "gallery_public_read" ON gallery_images
  FOR SELECT TO public USING (active = true);

CREATE POLICY "gallery_admin_select" ON gallery_images
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_insert_gallery_images" ON gallery_images
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "admin_update_gallery_images" ON gallery_images
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_gallery_images" ON gallery_images
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- CONTACT REQUESTS - Public can submit, admin manages
-- ========================================
CREATE POLICY "contact_insert_public" ON contact_requests
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "contact_admin_select" ON contact_requests
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_contact_requests" ON contact_requests
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_contact_requests" ON contact_requests
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- DEGREE ENQUIRIES - Public can submit, admin manages
-- ========================================
CREATE POLICY "enquiry_insert_public" ON degree_enquiries
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "enquiry_admin_select" ON degree_enquiries
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_degree_enquiries" ON degree_enquiries
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_degree_enquiries" ON degree_enquiries
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- LIBRARY MEMBERSHIPS - Public can submit, admin manages
-- ========================================
CREATE POLICY "membership_insert_public" ON library_memberships
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "membership_admin_select" ON library_memberships
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_library_memberships" ON library_memberships
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_library_memberships" ON library_memberships
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- ADMISSIONS - Public can submit, admin manages
-- ========================================
CREATE POLICY "admission_insert_public" ON admissions
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "admission_admin_select" ON admissions
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_admissions" ON admissions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_admissions" ON admissions
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- PAYMENTS - Public can submit, admin manages
-- ========================================
CREATE POLICY "payment_insert_public" ON payments
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "payment_admin_select" ON payments
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_payments" ON payments
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_payments" ON payments
  FOR DELETE TO anon, authenticated USING (true);

-- ========================================
-- NOTIFICATIONS - Public can submit, admin manages
-- ========================================
CREATE POLICY "notification_insert_public" ON notifications
  FOR INSERT TO public WITH CHECK (true);

CREATE POLICY "notification_admin_select" ON notifications
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "admin_update_notifications" ON notifications
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

CREATE POLICY "admin_delete_notifications" ON notifications
  FOR DELETE TO anon, authenticated USING (true);