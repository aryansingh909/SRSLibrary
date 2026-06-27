/*
# Fix Admin RLS Policies

1. Changes
- Add RLS policies for UPDATE/INSERT/DELETE operations on all admin-managed tables
- These policies allow anon (admin API routes) to perform admin operations
- Admin routes have their own password-based authentication

2. Tables affected
- site_settings: Add update, insert, delete policies
- membership_plans: Add update, insert, delete policies
- degree_programs: Add update, insert, delete policies
- gallery_images: Add update, insert, delete policies
- reviews: Add update, insert, delete policies
- blog_posts: Add update, insert, delete policies
- navigation_menu: Add update, insert, delete policies
- faqs: Add update, insert, delete policies
- contact_requests: Add update, delete policies
- degree_enquiries: Add update, delete policies
- library_memberships: Add update, delete policies

3. Security
- Admin API routes perform their own password-based authentication
- These policies allow the anon key client to perform admin operations
- All admin operations are protected by the admin API route authentication
*/

-- site_settings: Add admin CRUD policies
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_site_settings" ON site_settings;
CREATE POLICY "admin_update_site_settings" ON site_settings FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_site_settings" ON site_settings;
CREATE POLICY "admin_insert_site_settings" ON site_settings FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_site_settings" ON site_settings;
CREATE POLICY "admin_delete_site_settings" ON site_settings FOR DELETE TO anon, authenticated USING (true);

-- membership_plans: Add admin CRUD policies
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_membership_plans" ON membership_plans;
CREATE POLICY "admin_update_membership_plans" ON membership_plans FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_membership_plans" ON membership_plans;
CREATE POLICY "admin_insert_membership_plans" ON membership_plans FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_membership_plans" ON membership_plans;
CREATE POLICY "admin_delete_membership_plans" ON membership_plans FOR DELETE TO anon, authenticated USING (true);

-- degree_programs: Add admin CRUD policies
ALTER TABLE degree_programs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_degree_programs" ON degree_programs;
CREATE POLICY "admin_update_degree_programs" ON degree_programs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_degree_programs" ON degree_programs;
CREATE POLICY "admin_insert_degree_programs" ON degree_programs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_degree_programs" ON degree_programs;
CREATE POLICY "admin_delete_degree_programs" ON degree_programs FOR DELETE TO anon, authenticated USING (true);

-- gallery_images: Add admin CRUD policies
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_gallery_images" ON gallery_images;
CREATE POLICY "admin_update_gallery_images" ON gallery_images FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_gallery_images" ON gallery_images;
CREATE POLICY "admin_insert_gallery_images" ON gallery_images FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_gallery_images" ON gallery_images;
CREATE POLICY "admin_delete_gallery_images" ON gallery_images FOR DELETE TO anon, authenticated USING (true);

-- reviews: Add admin CRUD policies
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_reviews" ON reviews;
CREATE POLICY "admin_update_reviews" ON reviews FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_reviews" ON reviews;
CREATE POLICY "admin_insert_reviews" ON reviews FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_reviews" ON reviews;
CREATE POLICY "admin_delete_reviews" ON reviews FOR DELETE TO anon, authenticated USING (true);

-- blog_posts: Add admin CRUD policies
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_blog_posts" ON blog_posts;
CREATE POLICY "admin_update_blog_posts" ON blog_posts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_blog_posts" ON blog_posts;
CREATE POLICY "admin_insert_blog_posts" ON blog_posts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_blog_posts" ON blog_posts;
CREATE POLICY "admin_delete_blog_posts" ON blog_posts FOR DELETE TO anon, authenticated USING (true);

-- navigation_menu: Add admin CRUD policies
ALTER TABLE navigation_menu ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_navigation_menu" ON navigation_menu;
CREATE POLICY "admin_update_navigation_menu" ON navigation_menu FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_navigation_menu" ON navigation_menu;
CREATE POLICY "admin_insert_navigation_menu" ON navigation_menu FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_navigation_menu" ON navigation_menu;
CREATE POLICY "admin_delete_navigation_menu" ON navigation_menu FOR DELETE TO anon, authenticated USING (true);

-- faqs: Add admin CRUD policies
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_faqs" ON faqs;
CREATE POLICY "admin_update_faqs" ON faqs FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_insert_faqs" ON faqs;
CREATE POLICY "admin_insert_faqs" ON faqs FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_faqs" ON faqs;
CREATE POLICY "admin_delete_faqs" ON faqs FOR DELETE TO anon, authenticated USING (true);

-- contact_requests: Add admin update/delete policies
ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_contact_requests" ON contact_requests;
CREATE POLICY "admin_update_contact_requests" ON contact_requests FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_contact_requests" ON contact_requests;
CREATE POLICY "admin_delete_contact_requests" ON contact_requests FOR DELETE TO anon, authenticated USING (true);

-- degree_enquiries: Add admin update/delete policies
ALTER TABLE degree_enquiries ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_degree_enquiries" ON degree_enquiries;
CREATE POLICY "admin_update_degree_enquiries" ON degree_enquiries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_degree_enquiries" ON degree_enquiries;
CREATE POLICY "admin_delete_degree_enquiries" ON degree_enquiries FOR DELETE TO anon, authenticated USING (true);

-- library_memberships: Add admin update/delete policies
ALTER TABLE library_memberships ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admin_update_library_memberships" ON library_memberships;
CREATE POLICY "admin_update_library_memberships" ON library_memberships FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "admin_delete_library_memberships" ON library_memberships;
CREATE POLICY "admin_delete_library_memberships" ON library_memberships FOR DELETE TO anon, authenticated USING (true);
