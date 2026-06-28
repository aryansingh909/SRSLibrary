-- Site Settings Table (stores all key-value settings)
CREATE TABLE site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Membership Plans Table
CREATE TABLE membership_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  price INTEGER NOT NULL,
  duration TEXT NOT NULL,
  duration_days INTEGER NOT NULL,
  badge TEXT,
  badge_color TEXT DEFAULT 'blue',
  features TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Degree Programs Table
CREATE TABLE degree_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  duration TEXT NOT NULL,
  eligibility TEXT NOT NULL,
  fee INTEGER NOT NULL,
  seats INTEGER DEFAULT 60,
  color TEXT DEFAULT 'blue',
  description TEXT,
  careers TEXT[] DEFAULT '{}',
  highlights TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default settings
INSERT INTO site_settings (key, value) VALUES
  -- Business Information
  ('business_name', 'StudyNest'),
  ('logo_url', ''),
  ('phone_primary', '+91 99999 99999'),
  ('phone_secondary', ''),
  ('whatsapp_number', '+91 99999 99999'),
  ('email', 'hello@studynest.in'),
  ('address', '123, Main Market Road, Your City, State — 000000'),
  ('google_maps_embed_url', ''),
  ('google_maps_link', ''),
  
  -- Hero Section
  ('hero_tagline', 'Premium Study Experience'),
  ('hero_headline_line1', 'Where Focus'),
  ('hero_headline_highlight', 'Meets'),
  ('hero_headline_line2', 'Excellence'),
  ('hero_description', 'Experience the perfect study environment — premium AC library with 40 individual seats, high-speed WiFi, and expert guidance for online degree admissions from Mangalayatan University.'),
  ('hero_image_url', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800&h=600&fit=crop'),
  ('hero_cta_primary_text', 'Join Library'),
  ('hero_cta_secondary_text', 'Apply for Degree'),
  ('hero_stat_students', '500+'),
  ('hero_stat_seats', '40'),
  ('hero_rating', '5.0'),
  
  -- About Section
  ('about_title', 'About StudyNest'),
  ('about_subtitle', 'Your Gateway to Academic Excellence'),
  ('about_description', 'StudyNest is a premium study library and education consultancy dedicated to helping students achieve their dreams.'),
  ('about_mission', 'To provide students with the best study environment and educational opportunities.'),
  ('about_vision', 'To become the most trusted name in study library services and online education consultancy.'),
  
  -- Features
  ('features', JSON_build_array('High-Speed WiFi', 'CCTV Security', '24x7 Power Backup', 'Individual Desks', 'AC Environment', 'Free Parking')::text),
  
  -- Social Media Links
  ('social_facebook', ''),
  ('social_instagram', ''),
  ('social_youtube', ''),
  ('social_twitter', ''),
  ('social_linkedin', ''),
  
  -- Stats
  ('stat_seats', '40'),
  ('stat_members', '500+'),
  ('stat_rating', '5.0'),
  ('stat_years', '3+'),
  ('stat_reviews', '500+'),
  
  -- Partner University
  ('partner_university_name', 'Mangalayatan University'),
  ('partner_university_description', 'UGC-approved university recognized by DEB.'),
  ('partner_university_badges', 'UGC Approved,DEB Recognized,NAAC Accredited,Govt Job Valid');

-- Insert default membership plans
INSERT INTO membership_plans (plan_key, name, price, duration, duration_days, badge, badge_color, features, sort_order) VALUES
('daily', 'Daily Pass', 49, '1 Day', 1, NULL, 'slate', ARRAY['Single Day Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security'], 1),
('weekly', 'Weekly Pass', 249, '7 Days', 7, NULL, 'blue', ARRAY['7 Days Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security', 'Power Backup'], 2),
('monthly', 'Monthly Pass', 799, '30 Days', 30, 'Most Popular', 'blue', ARRAY['30 Days Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security', 'Power Backup', 'Priority Seat'], 3),
('quarterly', 'Quarterly Pass', 1999, '90 Days', 90, 'Best Value', 'green', ARRAY['90 Days Access', 'AC Environment', 'WiFi Included', 'Individual Desk', 'CCTV Security', 'Power Backup', 'Priority Seat', 'Free Study Material'], 4);

-- Insert default degree programs
INSERT INTO degree_programs (code, name, duration, eligibility, fee, color, description, careers, sort_order) VALUES
('BCA', 'Bachelor of Computer Applications', '3 Years', '10+2 (any stream)', 15000, 'blue', 'Dive into programming, databases, and IT fundamentals. A gateway to the tech industry.', ARRAY['Software Developer', 'Web Designer', 'Database Admin', 'IT Analyst'], 1),
('BBA', 'Bachelor of Business Administration', '3 Years', '10+2 (any stream)', 14000, 'emerald', 'Build a strong business foundation covering management, marketing, finance, and entrepreneurship.', ARRAY['Business Manager', 'Marketing Executive', 'HR Manager', 'Entrepreneur'], 2),
('BA', 'Bachelor of Arts', '3 Years', '10+2 (any stream)', 12000, 'amber', 'Explore humanities, social sciences, languages, and liberal arts — the foundation for diverse careers.', ARRAY['Civil Services', 'Journalism', 'Teaching', 'Content Writer'], 3),
('MBA', 'Master of Business Administration', '2 Years', 'Graduation in any stream', 20000, 'rose', 'Executive-level business education. Lead organizations with confidence and strategic expertise.', ARRAY['CEO/Manager', 'Consultant', 'Finance Manager', 'Marketing Head'], 4),
('MA', 'Master of Arts', '2 Years', 'BA or equivalent graduation', 13000, 'purple', 'Advanced study in humanities and social sciences — ideal for research, teaching, and civil services.', ARRAY['Lecturer/Professor', 'Researcher', 'Civil Services', 'Content Specialist'], 5),
('M.Com', 'Master of Commerce', '2 Years', 'B.Com or equivalent', 14000, 'cyan', 'Advanced commerce education covering advanced accounting, taxation, business law, and finance.', ARRAY['CA/CMA Preparation', 'Tax Consultant', 'Finance Manager', 'Auditor'], 6);

-- Add avatar_url and sort_order to reviews if not exists
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS sort_order INTEGER DEFAULT 0;

-- Update gallery_images to add needed columns
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS span_cols INTEGER DEFAULT 1;
ALTER TABLE gallery_images ADD COLUMN IF NOT EXISTS span_rows INTEGER DEFAULT 1;

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE degree_programs ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "site_settings_public_read" ON site_settings FOR SELECT TO PUBLIC USING (true);
CREATE POLICY "membership_plans_public_read" ON membership_plans FOR SELECT TO PUBLIC USING (is_active = true);
CREATE POLICY "degree_programs_public_read" ON degree_programs FOR SELECT TO PUBLIC USING (is_active = true);