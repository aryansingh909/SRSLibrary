/*
# Study Library & Education Consultancy — Full Schema

1. New Tables
  - `contact_requests`: Stores general contact form submissions (name, email, phone, message, status)
  - `library_memberships`: Stores library seat booking / membership registrations (plan, name, contact, payment_status)
  - `degree_enquiries`: Stores university admission enquiry leads (course, name, contact, status, notes)
  - `reviews`: Public testimonials/reviews (name, rating, review, course_or_service, approved)
  - `blog_posts`: SEO blog articles (title, slug, content, excerpt, category, published)
  - `gallery_images`: Photo gallery entries (url, caption, category, sort_order)
  - `notifications`: Internal admin notification log (type, title, body, read)
  - `admissions`: Formal admission applications linked to degree_enquiries (applicant details, docs, status)
  - `payments`: Payment records for memberships and admission fees (reference, amount, status, type)

2. Security
  - RLS enabled on all tables.
  - Anon + authenticated can INSERT contact_requests, degree_enquiries, admissions (public-facing forms).
  - Only authenticated (admin) can SELECT/UPDATE/DELETE sensitive tables.
  - Reviews readable by anon when approved; insert allowed by anon.
  - Blog posts and gallery readable by anon; manageable by authenticated.

3. Important Notes
  - All tables use UUID primary keys with gen_random_uuid().
  - `created_at` / `updated_at` timestamps auto-set.
  - Status enums are text with CHECK constraints for safety without requiring a migration to extend.
*/

-- ─── contact_requests ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS contact_requests (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text,
  subject      text,
  message      text NOT NULL,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new','in_progress','resolved','closed')),
  admin_notes  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE contact_requests ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_contact" ON contact_requests;
CREATE POLICY "anon_insert_contact" ON contact_requests FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_contact" ON contact_requests;
CREATE POLICY "auth_select_contact" ON contact_requests FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_contact" ON contact_requests;
CREATE POLICY "auth_update_contact" ON contact_requests FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_contact" ON contact_requests;
CREATE POLICY "auth_delete_contact" ON contact_requests FOR DELETE
  TO authenticated USING (true);

-- ─── library_memberships ─────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS library_memberships (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  plan            text NOT NULL CHECK (plan IN ('daily','weekly','monthly','quarterly')),
  start_date      date,
  end_date        date,
  seat_number     int,
  amount          numeric(10,2),
  payment_status  text NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending','paid','failed','refunded')),
  payment_ref     text,
  status          text NOT NULL DEFAULT 'active' CHECK (status IN ('active','expired','cancelled')),
  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE library_memberships ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_membership" ON library_memberships;
CREATE POLICY "anon_insert_membership" ON library_memberships FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_membership" ON library_memberships;
CREATE POLICY "auth_select_membership" ON library_memberships FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_membership" ON library_memberships;
CREATE POLICY "auth_update_membership" ON library_memberships FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_membership" ON library_memberships;
CREATE POLICY "auth_delete_membership" ON library_memberships FOR DELETE
  TO authenticated USING (true);

-- ─── degree_enquiries ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS degree_enquiries (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text NOT NULL,
  email        text NOT NULL,
  phone        text NOT NULL,
  course       text NOT NULL CHECK (course IN ('BCA','BBA','BA','MBA','MA','M.Com')),
  qualification text,
  message      text,
  status       text NOT NULL DEFAULT 'new' CHECK (status IN ('new','contacted','enrolled','rejected','closed')),
  follow_up_date date,
  assigned_to  text,
  admin_notes  text,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE degree_enquiries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_enquiry" ON degree_enquiries;
CREATE POLICY "anon_insert_enquiry" ON degree_enquiries FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_enquiry" ON degree_enquiries;
CREATE POLICY "auth_select_enquiry" ON degree_enquiries FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_enquiry" ON degree_enquiries;
CREATE POLICY "auth_update_enquiry" ON degree_enquiries FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_enquiry" ON degree_enquiries;
CREATE POLICY "auth_delete_enquiry" ON degree_enquiries FOR DELETE
  TO authenticated USING (true);

-- ─── admissions ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admissions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  enquiry_id      uuid REFERENCES degree_enquiries(id) ON DELETE SET NULL,
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text NOT NULL,
  dob             date,
  course          text NOT NULL,
  qualification   text NOT NULL,
  address         text,
  documents_url   text,
  registration_fee_paid boolean NOT NULL DEFAULT false,
  payment_ref     text,
  status          text NOT NULL DEFAULT 'applied' CHECK (status IN ('applied','documents_pending','under_review','approved','rejected')),
  admin_notes     text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE admissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_admission" ON admissions;
CREATE POLICY "anon_insert_admission" ON admissions FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_admission" ON admissions;
CREATE POLICY "auth_select_admission" ON admissions FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_admission" ON admissions;
CREATE POLICY "auth_update_admission" ON admissions FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_admission" ON admissions;
CREATE POLICY "auth_delete_admission" ON admissions FOR DELETE
  TO authenticated USING (true);

-- ─── reviews ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS reviews (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        text NOT NULL,
  role        text,
  rating      int NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  review      text NOT NULL,
  service     text CHECK (service IN ('library','degree','both')),
  approved    boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_review" ON reviews;
CREATE POLICY "anon_insert_review" ON reviews FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_approved_review" ON reviews;
CREATE POLICY "anon_select_approved_review" ON reviews FOR SELECT
  TO anon, authenticated USING (approved = true);

DROP POLICY IF EXISTS "auth_select_all_reviews" ON reviews;
CREATE POLICY "auth_select_all_reviews" ON reviews FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_review" ON reviews;
CREATE POLICY "auth_update_review" ON reviews FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_review" ON reviews;
CREATE POLICY "auth_delete_review" ON reviews FOR DELETE
  TO authenticated USING (true);

-- ─── blog_posts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title       text NOT NULL,
  slug        text UNIQUE NOT NULL,
  excerpt     text,
  content     text,
  category    text,
  cover_image text,
  published   boolean NOT NULL DEFAULT false,
  meta_title  text,
  meta_desc   text,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_published_blog" ON blog_posts;
CREATE POLICY "anon_select_published_blog" ON blog_posts FOR SELECT
  TO anon, authenticated USING (published = true);

DROP POLICY IF EXISTS "auth_select_all_blog" ON blog_posts;
CREATE POLICY "auth_select_all_blog" ON blog_posts FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_insert_blog" ON blog_posts;
CREATE POLICY "auth_insert_blog" ON blog_posts FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_blog" ON blog_posts;
CREATE POLICY "auth_update_blog" ON blog_posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_blog" ON blog_posts;
CREATE POLICY "auth_delete_blog" ON blog_posts FOR DELETE
  TO authenticated USING (true);

-- ─── gallery_images ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS gallery_images (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  url         text NOT NULL,
  caption     text,
  category    text NOT NULL DEFAULT 'general' CHECK (category IN ('study_hall','ac_facilities','parking','reading_zone','infrastructure','general')),
  sort_order  int NOT NULL DEFAULT 0,
  active      boolean NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_gallery" ON gallery_images;
CREATE POLICY "anon_select_gallery" ON gallery_images FOR SELECT
  TO anon, authenticated USING (active = true);

DROP POLICY IF EXISTS "auth_insert_gallery" ON gallery_images;
CREATE POLICY "auth_insert_gallery" ON gallery_images FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_gallery" ON gallery_images;
CREATE POLICY "auth_update_gallery" ON gallery_images FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_gallery" ON gallery_images;
CREATE POLICY "auth_delete_gallery" ON gallery_images FOR DELETE
  TO authenticated USING (true);

-- ─── payments ────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS payments (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference_id    uuid,
  reference_type  text CHECK (reference_type IN ('membership','admission')),
  name            text NOT NULL,
  email           text NOT NULL,
  phone           text,
  amount          numeric(10,2) NOT NULL,
  currency        text NOT NULL DEFAULT 'INR',
  gateway         text DEFAULT 'razorpay',
  gateway_order_id text,
  gateway_payment_id text,
  status          text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending','paid','failed','refunded')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_payment" ON payments;
CREATE POLICY "anon_insert_payment" ON payments FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_select_payment" ON payments;
CREATE POLICY "auth_select_payment" ON payments FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_payment" ON payments;
CREATE POLICY "auth_update_payment" ON payments FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- ─── notifications ────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type        text NOT NULL CHECK (type IN ('contact','membership','enquiry','admission','review','payment','system')),
  title       text NOT NULL,
  body        text,
  read        boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_notification" ON notifications;
CREATE POLICY "auth_select_notification" ON notifications FOR SELECT
  TO authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_notification" ON notifications;
CREATE POLICY "anon_insert_notification" ON notifications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_notification" ON notifications;
CREATE POLICY "auth_update_notification" ON notifications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_notification" ON notifications;
CREATE POLICY "auth_delete_notification" ON notifications FOR DELETE
  TO authenticated USING (true);

-- ─── Indexes ─────────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_contact_requests_status ON contact_requests(status);
CREATE INDEX IF NOT EXISTS idx_library_memberships_status ON library_memberships(status);
CREATE INDEX IF NOT EXISTS idx_library_memberships_email ON library_memberships(email);
CREATE INDEX IF NOT EXISTS idx_degree_enquiries_status ON degree_enquiries(status);
CREATE INDEX IF NOT EXISTS idx_degree_enquiries_course ON degree_enquiries(course);
CREATE INDEX IF NOT EXISTS idx_admissions_status ON admissions(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_gallery_images_category ON gallery_images(category);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(reference_id);
CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);

-- ─── Seed: sample approved reviews ──────────────────────────────────────────
INSERT INTO reviews (name, role, rating, review, service, approved) VALUES
  ('Priya Sharma','UPSC Aspirant',5,'The peaceful environment at this library helped me crack my prelims. The AC, clean washrooms and 24x7 power backup are a game changer!','library',true),
  ('Rahul Verma','B.Tech Student',5,'Best study library in the area. The individual desks and high-speed WiFi make it perfect for serious studying. Highly recommend!','library',true),
  ('Anjali Singh','MBA Graduate',5,'Got admitted to MBA at Mangalayatan University through their counselling. The team guided me through every step of the process. Very professional!','degree',true),
  ('Amit Kumar','BCA Student',4,'Enrolled for BCA online degree and the counsellors were extremely helpful. The fee structure is affordable and the university is UGC approved.','degree',true),
  ('Sneha Patel','CA Aspirant',5,'The study environment here is second to none. Quiet, clean and the CCTV makes me feel safe even during late-night study sessions.','library',true),
  ('Vikram Joshi','MBA Aspirant',5,'Both services — the library and the degree guidance — are top notch. Worth every rupee. My career is on the right track now!','both',true)
ON CONFLICT DO NOTHING;

-- ─── Seed: sample blog posts ─────────────────────────────────────────────────
INSERT INTO blog_posts (title, slug, excerpt, category, published, meta_title, meta_desc) VALUES
  ('Top 5 Tips to Crack Competitive Exams in 2024','top-5-tips-crack-competitive-exams-2024','Proven strategies that toppers use to prepare efficiently and score high in UPSC, SSC, and banking exams.','Study Tips',true,'Top 5 Tips to Crack Competitive Exams 2024 | StudyLib','Discover proven strategies to crack UPSC, SSC and banking exams in 2024. Expert tips from top scorers.'),
  ('Why UGC-Approved Online Degrees Are the Future of Education','ugc-approved-online-degrees-future','Online degrees from UGC-approved universities are now recognized for government jobs, further studies and careers. Here''s everything you need to know.','Online Education',true,'UGC-Approved Online Degrees — Everything You Need to Know | StudyLib','UGC-approved online degrees are now valid for jobs and further studies. Learn about BCA, BBA, MBA and more from Mangalayatan University.'),
  ('How to Choose the Right MBA Specialization for Your Career','choose-right-mba-specialization','With so many MBA specializations available, choosing the right one can make or break your career. We break down each option.','Career Guidance',true,'How to Choose the Right MBA Specialization | StudyLib','Confused about MBA specializations? Read our complete guide to pick the right MBA path for your career goals.'),
  ('Benefits of Studying in a Dedicated Study Library vs Home','study-library-vs-home','Studying at home is convenient but comes with endless distractions. Here''s why serious students prefer a professional study library.','Study Environment',true,'Study Library vs Home: Which is Better for Serious Learners? | StudyLib','Discover why a dedicated study library with AC, WiFi and quiet environment beats studying at home for serious competitive exam aspirants.'),
  ('BCA vs BBA: Which Online Degree Should You Choose?','bca-vs-bba-which-online-degree-choose','BCA and BBA are two popular online degree programs. Learn the key differences in syllabus, career scope and salary to make the right choice.','Course Comparison',true,'BCA vs BBA: Which Online Degree is Right for You? | StudyLib','Confused between BCA and BBA? Compare syllabus, career scope and salary package for both courses from Mangalayatan University.')
ON CONFLICT DO NOTHING;
