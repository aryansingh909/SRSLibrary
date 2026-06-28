-- Extended CMS Settings Tables

-- Add more settings for complete CMS control
INSERT INTO site_settings (key, value) VALUES
  -- Branding
  ('favicon_url', ''),
  ('tagline', 'Premium Study Library & Online Degree Admissions'),
  ('primary_color', '#2563eb'),
  ('secondary_color', '#1e40af'),
  
  -- SEO
  ('seo_title', 'StudyNest — Premium Study Library & Online Degree Admissions'),
  ('seo_description', 'StudyNest offers a premium air-conditioned study library with 40 seats, high-speed WiFi, CCTV security, and expert guidance for online degree admissions from Mangalayatan University.'),
  ('seo_keywords', 'study library, online degree, Mangalayatan University, BCA admission, MBA admission, study hall, premium library'),
  ('og_image_url', ''),
  
  -- Homepage Sections
  ('features_title', 'Why Choose Us'),
  ('features_subtitle', 'Everything you need for success'),
  ('features_list', 'High-Speed WiFi,CCTV Security,24x7 Power Backup,Individual Desks,AC Environment,Free Parking'),
  
  ('stats_title', 'Our Impact'),
  ('services_title', 'Our Services'),
  ('services_subtitle', 'Comprehensive solutions for your educational journey'),
  
  ('testimonials_title', 'What Our Students Say'),
  ('testimonials_subtitle', 'Real experiences from real students'),
  
  ('gallery_title', 'See Our Premium Space'),
  ('gallery_subtitle', 'A glimpse of our modern facilities'),
  
  ('contact_title', 'Get in Touch'),
  ('contact_subtitle', 'We are here to help you'),
  
  -- About Page
  ('about_page_title', 'About StudyNest'),
  ('about_page_subtitle', 'Your Gateway to Academic Excellence'),
  ('about_page_content', 'StudyNest is a premium study library and education consultancy dedicated to helping students achieve their dreams. We provide a world-class study environment along with expert guidance for online degree admissions.'),
  ('about_mission_title', 'Our Mission'),
  ('about_mission_content', 'To provide students with the best study environment and educational opportunities to help them achieve their career goals.'),
  ('about_vision_title', 'Our Vision'),
  ('about_vision_content', 'To become the most trusted name in study library services and online education consultancy.'),
  
  -- Library Page
  ('library_hero_title', 'Your Perfect Study Space Awaits You'),
  ('library_hero_subtitle', 'Premium study environment designed for serious learners'),
  ('library_features_title', 'World-Class Facilities'),
  ('library_amenities', 'Fully AC,High-Speed WiFi,CCTV 24x7,Power Backup,Free Parking,Clean Washrooms,Silent Zone,40 Seats'),
  ('library_testimonials_title', 'What Members Say'),
  ('library_stats_seats', '40'),
  ('library_stats_members', '500+'),
  ('library_stats_rating', '5.0'),
  ('library_stats_years', '3+'),
  
  -- Degrees Page
  ('degrees_hero_title', 'UGC-Approved Online Degrees'),
  ('degrees_hero_subtitle', 'Earn a recognized university degree online'),
  ('degrees_process_title', 'Simple 4-Step Process'),
  ('degrees_counselling_title', 'Free Counselling'),
  ('degrees_counselling_subtitle', 'Get expert guidance — completely free'),
  
  -- Contact Page
  ('contact_page_title', 'Contact Us'),
  ('contact_page_subtitle', 'Get in touch with us'),
  ('contact_form_title', 'Send us a message'),
  ('contact_hours', 'Mon-Sat: 9:00 AM - 9:00 PM'),
  
  -- Footer
  ('footer_description', 'Premium study library & online education consultancy. Your success is our mission.'),
  ('footer_copyright', 'All rights reserved.'),
  
  -- Admission Process Steps
  ('process_step1_title', 'Enquire'),
  ('process_step1_desc', 'Fill the form or call us. Our counsellor will guide you on course selection.'),
  ('process_step2_title', 'Apply'),
  ('process_step2_desc', 'Submit your application form with required documents online.'),
  ('process_step3_title', 'Pay Fee'),
  ('process_step3_desc', 'Pay the admission fee securely through our payment gateway.'),
  ('process_step4_title', 'Start Learning'),
  ('process_step4_desc', 'Receive your student ID and access the LMS to begin your degree.'),
  
  -- Library Images (URLs for carousel/gallery)
  ('library_image_1', 'https://images.pexels.com/photos/3184328/pexels-photo-3184328.jpeg?w=600&h=400&fit=crop'),
  ('library_image_2', 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?w=600&h=400&fit=crop'),
  ('library_image_3', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=600&h=400&fit=crop'),
  ('library_image_4', 'https://images.pexels.com/photos/256541/pexels-photo-256541.jpeg?w=600&h=400&fit=crop'),
  ('library_image_5', 'https://images.pexels.com/photos/1438081/pexels-photo-1438081.jpeg?w=600&h=400&fit=crop'),
  ('library_image_6', 'https://images.pexels.com/photos/2041627/pexels-photo-2041627.jpeg?w=600&h=400&fit=crop')
ON CONFLICT (key) DO NOTHING;

-- Create navigation menu table
CREATE TABLE navigation_menu (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  label TEXT NOT NULL,
  href TEXT NOT NULL,
  parent_id UUID REFERENCES navigation_menu(id),
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  open_in_new_tab BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert default navigation items
INSERT INTO navigation_menu (label, href, sort_order) VALUES
  ('Home', '/', 1),
  ('Library', '/library', 2),
  ('Degrees', '/degrees', 3),
  ('Gallery', '/gallery', 4),
  ('Blog', '/blog', 5),
  ('Contact', '/contact', 6);

-- Create FAQ table
CREATE TABLE faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT DEFAULT 'general',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, sort_order) VALUES
  ('What are the library timings?', 'Our library is open from 8:00 AM to 10:00 PM, 7 days a week.', 'library', 1),
  ('Can I get a refund on my membership?', 'Refunds are available within 3 days of purchase with a valid reason.', 'library', 2),
  ('Are the online degrees UGC approved?', 'Yes, all degrees from Mangalayatan University are UGC and DEB approved.', 'degrees', 3),
  ('What documents are required for admission?', 'You need 10th/12th marksheet, ID proof, and passport size photos.', 'degrees', 4);

-- Create page sections table for dynamic content
CREATE TABLE page_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page TEXT NOT NULL,
  section TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  content TEXT,
  image_url TEXT,
  button_text TEXT,
  button_link TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, section)
);

-- Enable RLS
ALTER TABLE navigation_menu ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_sections ENABLE ROW LEVEL SECURITY;

-- Create policies - PUBLIC READ for active items
CREATE POLICY "navigation_menu_public_read" ON navigation_menu FOR SELECT TO PUBLIC USING (is_active = true);
CREATE POLICY "faqs_public_read" ON faqs FOR SELECT TO PUBLIC USING (is_active = true);
CREATE POLICY "page_sections_public_read" ON page_sections FOR SELECT TO PUBLIC USING (is_active = true);

-- Create policies - AUTHENTICATED ONLY for admin operations
CREATE POLICY "navigation_menu_admin_insert" ON navigation_menu FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "navigation_menu_admin_update" ON navigation_menu FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "navigation_menu_admin_delete" ON navigation_menu FOR DELETE TO authenticated USING (true);

CREATE POLICY "faqs_admin_insert" ON faqs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "faqs_admin_update" ON faqs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "faqs_admin_delete" ON faqs FOR DELETE TO authenticated USING (true);

CREATE POLICY "page_sections_admin_insert" ON page_sections FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "page_sections_admin_update" ON page_sections FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "page_sections_admin_delete" ON page_sections FOR DELETE TO authenticated USING (true);