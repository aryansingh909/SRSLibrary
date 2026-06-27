'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Settings, Globe, Phone, Mail, MapPin, BookOpen, GraduationCap,
  Camera, Star, Save, Plus, Trash2, Edit, X, Check,
  Facebook, Instagram, Youtube, Twitter, Linkedin, RefreshCw, Layout,
  Home, Library, Award, MessageSquare, Palette, Search, Image as ImageIcon,
  Menu, ChevronLeft, ExternalLink, Eye, AlertCircle, HelpCircle, FileText, Upload,
  Inbox, Filter
} from 'lucide-react';
import Link from 'next/link';
import { ImageUpload } from '@/components/admin/image-upload';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

const DEFAULT_PASSWORD = 'admin123';

type Settings = Record<string, string>;
type SettingsField = { key: string; label: string; type: 'text' | 'textarea' | 'image' | 'color'; help: string; imageUsage?: string };
type SettingsSection = { key: string; label: string; fields: SettingsField[] };
type SettingsGroup = { label: string; icon: React.ComponentType<{ className?: string }>; color: string; sections: SettingsSection[] };
type Plan = { id: string; plan_key: string; name: string; price: number; duration: string; duration_days: number; badge: string | null; badge_color: string; features: string[]; sort_order: number; is_active: boolean; };
type Program = { id: string; code: string; name: string; duration: string; eligibility: string; fee: number; seats: number; color: string; description: string; careers: string[]; is_active: boolean; sort_order: number; };
type GalleryImage = { id: string; url: string; caption: string | null; category: string; span_cols: number; span_rows: number; sort_order: number; active: boolean; };
type Review = { id: string; name: string; role: string | null; rating: number; review: string; service: string | null; approved: boolean; avatar_url: string | null; sort_order: number; };
type NavItem = { id: string; label: string; href: string; parent_id: string | null; sort_order: number; is_active: boolean; open_in_new_tab: boolean; };
type FAQ = { id: string; question: string; answer: string; category: string; sort_order: number; is_active: boolean; };

// Enquiry types
type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  course: string;
  qualification: string | null;
  message: string | null;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

type ContactRequest = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: string;
  admin_notes: string | null;
  created_at: string;
};

type Membership = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  start_date: string | null;
  end_date: string | null;
  seat_number: number | null;
  amount: number | null;
  payment_status: string;
  status: string;
  created_at: string;
};

const ENQUIRY_STATUSES = ['new', 'contacted', 'enrolled', 'rejected', 'closed'];
const CONTACT_STATUSES = ['new', 'in_progress', 'resolved', 'closed'];
const MEMBERSHIP_STATUSES = ['active', 'expired', 'cancelled'];

// Settings groups for organized editing
const SETTINGS_GROUPS: Record<string, SettingsGroup> = {
  homepage: {
    label: 'Homepage',
    icon: Home,
    color: 'bg-blue-600',
    sections: [
      { key: 'hero_section', label: 'Hero Section', fields: [
        { key: 'hero_tagline', label: 'Tagline Badge', type: 'text', help: 'Small badge text above the headline' },
        { key: 'hero_headline_line1', label: 'Headline Line 1', type: 'text', help: 'First line of the main headline' },
        { key: 'hero_headline_highlight', label: 'Highlighted Word', type: 'text', help: 'Word that appears in gradient color' },
        { key: 'hero_headline_line2', label: 'Headline Line 2', type: 'text', help: 'Second line of the main headline' },
        { key: 'hero_description', label: 'Description', type: 'textarea', help: 'Main paragraph below the headline' },
        { key: 'hero_image_url', label: 'Hero Background Image', type: 'image', help: 'Large hero section image', imageUsage: 'Homepage Hero Section' },
        { key: 'hero_cta_primary_text', label: 'Primary Button Text', type: 'text', help: 'Main call-to-action button' },
        { key: 'hero_cta_secondary_text', label: 'Secondary Button Text', type: 'text', help: 'Secondary call-to-action button' },
        { key: 'hero_stat_students', label: 'Student Count', type: 'text', help: 'Number shown in social proof (e.g., 500+)' },
        { key: 'hero_stat_seats', label: 'Hero Seats Count', type: 'text', help: 'Seats shown on floating card' },
        { key: 'hero_rating', label: 'Rating', type: 'text', help: 'Star rating shown (e.g., 5.0)' },
      ]},
      { key: 'features_section', label: 'Features Section', fields: [
        { key: 'features_title', label: 'Section Title', type: 'text', help: 'Features section heading' },
        { key: 'features_subtitle', label: 'Section Description', type: 'textarea', help: 'Features section subheading/description' },
      ]},
      { key: 'services_section', label: 'Services Section', fields: [
        { key: 'services_title', label: 'Section Title', type: 'text', help: 'Services section heading' },
        { key: 'services_description', label: 'Section Description', type: 'textarea', help: 'Services section subheading' },
        { key: 'library_title', label: 'Library Card Title', type: 'text', help: 'Title for library service card' },
        { key: 'library_description', label: 'Library Card Description', type: 'textarea', help: 'Description for library service' },
        { key: 'degrees_title', label: 'Degrees Card Title', type: 'text', help: 'Title for degrees service card' },
        { key: 'degrees_description', label: 'Degrees Card Description', type: 'textarea', help: 'Description for degrees service' },
      ]},
      { key: 'stats_section', label: 'Stats Section', fields: [
        { key: 'stat_seats', label: 'Seats Value', type: 'text', help: 'Number of study seats' },
        { key: 'stat_power_value', label: 'Power Backup Value', type: 'text', help: 'Power backup display value (e.g., 24/7)' },
        { key: 'stat_power_label', label: 'Power Backup Label', type: 'text', help: 'Power backup label text' },
        { key: 'stat_wifi_value', label: 'WiFi Speed Value', type: 'text', help: 'WiFi speed (e.g., 100+)' },
        { key: 'stat_wifi_label', label: 'WiFi Label', type: 'text', help: 'WiFi label text' },
        { key: 'stat_cctv_value', label: 'CCTV Value', type: 'text', help: 'CCTV display value' },
        { key: 'stat_cctv_label', label: 'CCTV Label', type: 'text', help: 'CCTV label text' },
      ]},
      { key: 'testimonials_section', label: 'Testimonials Section', fields: [
        { key: 'testimonials_title', label: 'Section Title', type: 'text', help: 'Testimonials section heading' },
        { key: 'testimonials_subtitle', label: 'Section Subtitle', type: 'text', help: 'Testimonials section subheading' },
      ]},
      { key: 'gallery_section', label: 'Gallery Section', fields: [
        { key: 'gallery_title', label: 'Section Title', type: 'text', help: 'Gallery section heading' },
        { key: 'gallery_subtitle', label: 'Section Subtitle', type: 'text', help: 'Gallery section subheading' },
      ]},
    ]
  },
  library: {
    label: 'Library Page',
    icon: Library,
    color: 'bg-emerald-600',
    sections: [
      { key: 'hero', label: 'Hero Section', fields: [
        { key: 'library_hero_title', label: 'Hero Title', type: 'text', help: 'Main headline on library page' },
        { key: 'library_hero_subtitle', label: 'Hero Subtitle', type: 'textarea', help: 'Description below the headline' },
      ]},
      { key: 'images', label: 'Library Images', fields: [
        { key: 'library_image_1', label: 'Library Image 1', type: 'image', help: 'Main study hall image', imageUsage: 'Library Page Hero' },
        { key: 'library_image_2', label: 'Library Image 2', type: 'image', help: 'Secondary library image', imageUsage: 'Library Page Gallery' },
        { key: 'library_image_3', label: 'Library Image 3', type: 'image', help: 'Reading area image', imageUsage: 'Library Page Gallery' },
        { key: 'library_image_4', label: 'Library Image 4', type: 'image', help: 'Library shelves image', imageUsage: 'Library Page Gallery' },
        { key: 'library_image_5', label: 'Library Image 5', type: 'image', help: 'Facilities image', imageUsage: 'Library Page Gallery' },
        { key: 'library_image_6', label: 'Library Image 6', type: 'image', help: 'Additional library image', imageUsage: 'Library Page Gallery' },
      ]},
      { key: 'content', label: 'Content & Stats', fields: [
        { key: 'library_features_title', label: 'Features Title', type: 'text', help: 'Heading for features list' },
        { key: 'library_amenities', label: 'Amenities (comma-separated)', type: 'textarea', help: 'List of amenities badges' },
        { key: 'library_testimonials_title', label: 'Testimonials Title', type: 'text', help: 'Testimonials section heading' },
        { key: 'library_stats_seats', label: 'Seats Count', type: 'text', help: 'Number of seats available' },
        { key: 'library_stats_members', label: 'Members Count', type: 'text', help: 'Number of happy members' },
        { key: 'library_stats_rating', label: 'Rating', type: 'text', help: 'Star rating' },
        { key: 'library_stats_years', label: 'Years Running', type: 'text', help: 'Years in operation' },
      ]},
    ]
  },
  degrees: {
    label: 'Degrees Page',
    icon: GraduationCap,
    color: 'bg-purple-600',
    sections: [
      { key: 'hero', label: 'Hero Section', fields: [
        { key: 'degrees_hero_title', label: 'Hero Title', type: 'text', help: 'Main headline on degrees page' },
        { key: 'degrees_hero_subtitle', label: 'Hero Subtitle', type: 'textarea', help: 'Description below the headline' },
      ]},
      { key: 'partner', label: 'Partner University', fields: [
        { key: 'partner_university_name', label: 'University Name', type: 'text', help: 'Partner university name' },
        { key: 'partner_university_description', label: 'University Description', type: 'textarea', help: 'University description' },
        { key: 'partner_university_badges', label: 'Badges (comma-separated)', type: 'text', help: 'e.g. UGC Approved,DEB Recognized' },
      ]},
      { key: 'process', label: 'Admission Process', fields: [
        { key: 'degrees_process_title', label: 'Process Section Title', type: 'text', help: 'Heading for admission steps' },
        { key: 'process_step1_title', label: 'Step 1 Title', type: 'text', help: 'First step heading' },
        { key: 'process_step1_desc', label: 'Step 1 Description', type: 'textarea', help: 'First step explanation' },
        { key: 'process_step2_title', label: 'Step 2 Title', type: 'text', help: 'Second step heading' },
        { key: 'process_step2_desc', label: 'Step 2 Description', type: 'textarea', help: 'Second step explanation' },
        { key: 'process_step3_title', label: 'Step 3 Title', type: 'text', help: 'Third step heading' },
        { key: 'process_step3_desc', label: 'Step 3 Description', type: 'textarea', help: 'Third step explanation' },
        { key: 'process_step4_title', label: 'Step 4 Title', type: 'text', help: 'Fourth step heading' },
        { key: 'process_step4_desc', label: 'Step 4 Description', type: 'textarea', help: 'Fourth step explanation' },
      ]},
      { key: 'counselling', label: 'Counselling Form', fields: [
        { key: 'degrees_counselling_title', label: 'Form Title', type: 'text', help: 'Heading for enquiry form' },
        { key: 'degrees_counselling_subtitle', label: 'Form Subtitle', type: 'text', help: 'Subheading for enquiry form' },
      ]},
    ]
  },
  contact: {
    label: 'Contact Info',
    icon: Phone,
    color: 'bg-orange-600',
    sections: [
      { key: 'details', label: 'Contact Details', fields: [
        { key: 'business_name', label: 'Business Name', type: 'text', help: 'Name of your business (shown in navbar and footer)' },
        { key: 'phone_primary', label: 'Primary Phone', type: 'text', help: 'Main contact number' },
        { key: 'phone_secondary', label: 'Secondary Phone', type: 'text', help: 'Alternative contact number' },
        { key: 'whatsapp_number', label: 'WhatsApp Number', type: 'text', help: 'WhatsApp contact number' },
        { key: 'email', label: 'Email Address', type: 'text', help: 'Contact email address' },
        { key: 'address', label: 'Address', type: 'textarea', help: 'Full business address' },
      ]},
      { key: 'maps', label: 'Google Maps', fields: [
        { key: 'google_maps_embed_url', label: 'Maps Embed URL', type: 'textarea', help: 'Google Maps embed iframe URL' },
        { key: 'google_maps_link', label: 'Maps Link', type: 'text', help: 'Link to Google Maps directions' },
      ]},
      { key: 'page', label: 'Contact Page', fields: [
        { key: 'contact_page_title', label: 'Page Title', type: 'text', help: 'Contact page heading' },
        { key: 'contact_page_subtitle', label: 'Page Subtitle', type: 'text', help: 'Contact page subheading' },
        { key: 'contact_form_title', label: 'Form Title', type: 'text', help: 'Contact form heading' },
        { key: 'contact_hours', label: 'Business Hours', type: 'text', help: 'Operating hours' },
      ]},
    ]
  },
  social: {
    label: 'Social Links',
    icon: Globe,
    color: 'bg-cyan-600',
    sections: [
      { key: 'links', label: 'Social Media Links', fields: [
        { key: 'social_facebook', label: 'Facebook URL', type: 'text', help: 'Link to Facebook page' },
        { key: 'social_instagram', label: 'Instagram URL', type: 'text', help: 'Link to Instagram profile' },
        { key: 'social_youtube', label: 'YouTube URL', type: 'text', help: 'Link to YouTube channel' },
        { key: 'social_twitter', label: 'Twitter/X URL', type: 'text', help: 'Link to Twitter profile' },
        { key: 'social_linkedin', label: 'LinkedIn URL', type: 'text', help: 'Link to LinkedIn page' },
      ]},
    ]
  },
  branding: {
    label: 'Branding',
    icon: Palette,
    color: 'bg-pink-600',
    sections: [
      { key: 'brand', label: 'Brand Identity', fields: [
        { key: 'business_name', label: 'Website Name', type: 'text', help: 'Name displayed in header and footer' },
        { key: 'logo_url', label: 'Logo Image URL', type: 'image', help: 'Your brand logo' },
        { key: 'favicon_url', label: 'Favicon URL', type: 'image', help: 'Browser tab icon' },
        { key: 'tagline', label: 'Website Tagline', type: 'text', help: 'Short slogan or tagline' },
        { key: 'primary_color', label: 'Primary Color', type: 'color', help: 'Main brand color (hex code)' },
        { key: 'secondary_color', label: 'Secondary Color', type: 'color', help: 'Accent color (hex code)' },
      ]},
    ]
  },
  seo: {
    label: 'SEO',
    icon: Search,
    color: 'bg-teal-600',
    sections: [
      { key: 'meta', label: 'Meta Information', fields: [
        { key: 'seo_title', label: 'SEO Title', type: 'text', help: 'Title shown in search results (50-60 chars)' },
        { key: 'seo_description', label: 'Meta Description', type: 'textarea', help: 'Description in search results (150-160 chars)' },
        { key: 'seo_keywords', label: 'Keywords', type: 'textarea', help: 'Relevant keywords (comma-separated)' },
        { key: 'og_image_url', label: 'Open Graph Image', type: 'image', help: 'Image shown when shared on social media' },
      ]},
    ]
  },
  footer: {
    label: 'Footer',
    icon: Layout,
    color: 'bg-slate-600',
    sections: [
      { key: 'content', label: 'Footer Content', fields: [
        { key: 'footer_description', label: 'Description', type: 'textarea', help: 'Brief description shown in footer' },
        { key: 'footer_copyright', label: 'Copyright Text', type: 'text', help: 'Copyright notice' },
        { key: 'partner_university_name', label: 'Partner University', type: 'text', help: 'University partnership name' },
        { key: 'partner_university_description', label: 'University Description', type: 'text', help: 'Brief university info' },
        { key: 'partner_university_badges', label: 'University Badges (comma-separated)', type: 'text', help: 'e.g., UGC Approved,DEB Recognized' },
      ]},
    ]
  },
  stats: {
    label: 'Stats',
    icon: Award,
    color: 'bg-amber-600',
    sections: [
      { key: 'homepage_stats', label: 'Homepage Statistics', fields: [
        { key: 'stat_seats', label: 'Seats', type: 'text', help: 'Seat display value (e.g., Premium)' },
        { key: 'stat_members', label: 'Members', type: 'text', help: 'Number of members (e.g., 500+)' },
        { key: 'stat_rating', label: 'Rating', type: 'text', help: 'Star rating (e.g., 5.0)' },
        { key: 'stat_years', label: 'Years Running', type: 'text', help: 'Years in business (e.g., 3+)' },
        { key: 'stat_reviews', label: 'Review Count', type: 'text', help: 'Number of reviews (e.g., 500+)' },
      ]},
    ]
  },
};

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [sessionPassword, setSessionPassword] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('homepage');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Data states
  const [settings, setSettings] = useState<Settings>({});
  const [originalSettings, setOriginalSettings] = useState<Settings>({});
  const [plans, setPlans] = useState<Plan[]>([]);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);

  // Enquiries state
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [contacts, setContacts] = useState<ContactRequest[]>([]);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [enquiryFilter, setEnquiryFilter] = useState<string>('all');
  const [contactFilter, setContactFilter] = useState<string>('all');
  const [membershipFilter, setMembershipFilter] = useState<string>('all');
  const [enquiriesTab, setEnquiriesTab] = useState<'enquiries' | 'contacts' | 'memberships'>('enquiries');
  const [enquiriesSearch, setEnquiriesSearch] = useState<string>('');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [selectedContact, setSelectedContact] = useState<ContactRequest | null>(null);
  const [selectedMembership, setSelectedMembership] = useState<Membership | null>(null);

  // Change password state
  const [cpCurrent, setCpCurrent] = useState('');
  const [cpNew, setCpNew] = useState('');
  const [cpConfirm, setCpConfirm] = useState('');
  const [cpSaving, setCpSaving] = useState(false);

  // Edit states
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [editingProgram, setEditingProgram] = useState<Program | null>(null);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [editingNavItem, setEditingNavItem] = useState<NavItem | null>(null);
  const [editingFaq, setEditingFaq] = useState<FAQ | null>(null);

  // Auth check
  useEffect(() => {
    const saved = sessionStorage.getItem('adminAuth');
    const savedPw = sessionStorage.getItem('adminSessionPw');
    if (saved === 'true') {
      setIsAuthenticated(true);
      if (savedPw) setSessionPassword(savedPw);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadAllData();
  }, [isAuthenticated]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${sessionPassword || DEFAULT_PASSWORD}`,
  }), [sessionPassword]);

  const loadAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([
        loadSettings(),
        loadPlans(),
        loadPrograms(),
        loadGallery(),
        loadReviews(),
        loadNavItems(),
        loadFaqs(),
        loadEnquiries(),
      ]);
    } finally {
      setLoading(false);
    }
  };

  const loadSettings = async () => {
    const { data, error } = await supabase.from('site_settings').select('key, value');
    if (!error && data) {
      const s: Settings = {};
      data.forEach((item) => { s[item.key] = item.value || ''; });
      setSettings(s);
      setOriginalSettings(s);
    }
  };

  const loadPlans = async () => {
    const res = await fetch('/api/admin/plans', { headers: authHeaders() });
    if (res.ok) { const data = await res.json(); setPlans(data.plans || []); }
  };

  const loadPrograms = async () => {
    const res = await fetch('/api/admin/programs', { headers: authHeaders() });
    if (res.ok) { const data = await res.json(); setPrograms(data.programs || []); }
  };

  const loadGallery = async () => {
    const res = await fetch('/api/admin/gallery');
    if (res.ok) { const data = await res.json(); setGallery(data.images || []); }
  };

  const loadReviews = async () => {
    const res = await fetch('/api/admin/reviews', { headers: authHeaders() });
    if (res.ok) { const data = await res.json(); setReviews(data.reviews || []); }
  };

  const loadNavItems = async () => {
    const { data, error } = await supabase.from('navigation_menu').select('*').order('sort_order');
    if (!error && data) setNavItems(data);
  };

  const loadFaqs = async () => {
    const { data, error } = await supabase.from('faqs').select('*').order('sort_order');
    if (!error && data) setFaqs(data);
  };

  const loadEnquiries = async () => {
    const res = await fetch('/api/admin/enquiries', { headers: authHeaders() });
    if (res.ok) {
      const data = await res.json();
      setEnquiries(data.enquiries || []);
      setContacts(data.contacts || []);
      setMemberships(data.memberships || []);
    }
  };

  const updateEnquiryStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/enquiries', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ type: 'enquiry', id, status }),
    });
    if (res.ok) {
      setEnquiries(prev => prev.map(e => e.id === id ? { ...e, status } : e));
      toast.success('Status updated');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to update');
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/enquiries', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ type: 'contact', id, status }),
    });
    if (res.ok) {
      setContacts(prev => prev.map(c => c.id === id ? { ...c, status } : c));
      toast.success('Status updated');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to update');
    }
  };

  const updateMembershipStatus = async (id: string, status: string) => {
    const res = await fetch('/api/admin/enquiries', {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ type: 'membership', id, status }),
    });
    if (res.ok) {
      setMemberships(prev => prev.map(m => m.id === id ? { ...m, status } : m));
      toast.success('Status updated');
    } else {
      const data = await res.json().catch(() => ({}));
      toast.error(data.error || 'Failed to update');
    }
  };

  const deleteEnquiry = async (id: string) => {
    if (!confirm('Delete this enquiry?')) return;
    const res = await fetch(`/api/admin/enquiries?type=enquiry&id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      setEnquiries(prev => prev.filter(e => e.id !== id));
      toast.success('Enquiry deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const deleteContact = async (id: string) => {
    if (!confirm('Delete this contact request?')) return;
    const res = await fetch(`/api/admin/enquiries?type=contact&id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      setContacts(prev => prev.filter(c => c.id !== id));
      toast.success('Contact deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const deleteMembership = async (id: string) => {
    if (!confirm('Delete this membership record?')) return;
    const res = await fetch(`/api/admin/enquiries?type=membership&id=${id}`, {
      method: 'DELETE',
      headers: authHeaders(),
    });
    if (res.ok) {
      setMemberships(prev => prev.filter(m => m.id !== id));
      toast.success('Membership deleted');
    } else {
      toast.error('Failed to delete');
    }
  };

  const updateSetting = (key: string, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const saveAllSettings = async () => {
    setSaving(true);
    try {
      // Find changed settings
      const changes: Record<string, string> = {};
      Object.keys(settings).forEach(key => {
        if (settings[key] !== originalSettings[key]) {
          changes[key] = settings[key];
        }
      });

      if (Object.keys(changes).length === 0) {
        toast.info('No changes to save');
        return;
      }

      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: authHeaders(),
        body: JSON.stringify({ settings: changes }),
      });

      if (res.ok) {
        setOriginalSettings(settings);
        setHasUnsavedChanges(false);
        toast.success('Settings saved successfully!');
      } else {
        const data = await res.json();
        toast.error(data.error || 'Failed to save');
      }
    } finally {
      setSaving(false);
    }
  };

  const discardChanges = () => {
    setSettings(originalSettings);
    setHasUnsavedChanges(false);
    toast.info('Changes discarded');
  };

  const handleLogin = async () => {
    try {
      // Check DB-stored password first, fallback to default
      const { data } = await supabase.from('site_settings').select('value').eq('key', 'admin_password').maybeSingle();
      const validPassword = data?.value || DEFAULT_PASSWORD;
      if (password === validPassword) {
        setIsAuthenticated(true);
        setSessionPassword(password);
        sessionStorage.setItem('adminAuth', 'true');
        sessionStorage.setItem('adminSessionPw', password);
      } else {
        toast.error('Invalid password');
      }
    } catch {
      toast.error('Login failed. Please try again.');
    }
  };

  const handleLogout = () => {
    if (hasUnsavedChanges && !confirm('You have unsaved changes. Are you sure you want to logout?')) return;
    setIsAuthenticated(false);
    setSessionPassword('');
    sessionStorage.removeItem('adminAuth');
    sessionStorage.removeItem('adminSessionPw');
  };

  const handleChangePassword = async () => {
    if (!cpCurrent || !cpNew || !cpConfirm) {
      toast.error('All fields are required');
      return;
    }
    if (cpNew !== cpConfirm) {
      toast.error('New passwords do not match');
      return;
    }
    if (cpNew.length < 6) {
      toast.error('New password must be at least 6 characters');
      return;
    }
    // Verify current password
    const { data } = await supabase.from('site_settings').select('value').eq('key', 'admin_password').maybeSingle();
    const validPassword = data?.value || DEFAULT_PASSWORD;
    if (cpCurrent !== validPassword) {
      toast.error('Current password is incorrect');
      return;
    }
    setCpSaving(true);
    try {
      const { error } = await supabase.from('site_settings').upsert(
        { key: 'admin_password', value: cpNew, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      );
      if (error) throw error;
      setSessionPassword(cpNew);
      sessionStorage.setItem('adminSessionPw', cpNew);
      setCpCurrent('');
      setCpNew('');
      setCpConfirm('');
      toast.success('Password changed successfully');
    } catch {
      toast.error('Failed to change password');
    } finally {
      setCpSaving(false);
    }
  };

  const previewSite = () => {
    window.open('/', '_blank');
  };

  // CRUD Operations
  const savePlan = async (plan: Partial<Plan>) => {
    const method = plan.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/plans', { method, headers: authHeaders(), body: JSON.stringify(plan) });
    if (res.ok) { loadPlans(); setEditingPlan(null); toast.success(plan.id ? 'Plan updated!' : 'Plan created!'); }
    else toast.error('Failed to save plan');
  };

  const deletePlan = async (id: string) => {
    if (!confirm('Delete this plan?')) return;
    const res = await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) { setPlans(prev => prev.filter(p => p.id !== id)); toast.success('Plan deleted'); }
  };

  const saveProgram = async (program: Partial<Program>) => {
    const method = program.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/programs', { method, headers: authHeaders(), body: JSON.stringify(program) });
    if (res.ok) { loadPrograms(); setEditingProgram(null); toast.success(program.id ? 'Program updated!' : 'Program created!'); }
    else toast.error('Failed to save program');
  };

  const deleteProgram = async (id: string) => {
    if (!confirm('Delete this program?')) return;
    const res = await fetch(`/api/admin/programs?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) { setPrograms(prev => prev.filter(p => p.id !== id)); toast.success('Program deleted'); }
  };

  const saveImage = async (image: Partial<GalleryImage>) => {
    const method = image.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/gallery', { method, headers: authHeaders(), body: JSON.stringify(image) });
    if (res.ok) { loadGallery(); setEditingImage(null); toast.success(image.id ? 'Image updated!' : 'Image added!'); }
    else toast.error('Failed to save image');
  };

  const deleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return;
    const res = await fetch(`/api/admin/gallery?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) { setGallery(prev => prev.filter(i => i.id !== id)); toast.success('Image deleted'); }
  };

  const saveReview = async (review: Partial<Review>) => {
    const method = review.id ? 'PUT' : 'POST';
    const res = await fetch('/api/admin/reviews', { method, headers: authHeaders(), body: JSON.stringify(review) });
    if (res.ok) { loadReviews(); setEditingReview(null); toast.success(review.id ? 'Review updated!' : 'Review added!'); }
    else toast.error('Failed to save review');
  };

  const deleteReview = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    const res = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE', headers: authHeaders() });
    if (res.ok) { setReviews(prev => prev.filter(r => r.id !== id)); toast.success('Review deleted'); }
  };

  const saveNavItem = async (item: Partial<NavItem>) => {
    const { error } = await supabase.from('navigation_menu').upsert({
      id: item.id || undefined,
      label: item.label,
      href: item.href,
      sort_order: item.sort_order || 0,
      is_active: item.is_active !== false,
      open_in_new_tab: item.open_in_new_tab || false,
    }, { onConflict: 'id' });
    if (!error) { loadNavItems(); setEditingNavItem(null); toast.success('Menu item saved!'); }
    else toast.error('Failed to save');
  };

  const deleteNavItem = async (id: string) => {
    if (!confirm('Delete this menu item?')) return;
    const { error } = await supabase.from('navigation_menu').delete().eq('id', id);
    if (!error) { setNavItems(prev => prev.filter(n => n.id !== id)); toast.success('Menu item deleted'); }
  };

  const saveFaq = async (faq: Partial<FAQ>) => {
    const { error } = await supabase.from('faqs').upsert({
      id: faq.id || undefined,
      question: faq.question,
      answer: faq.answer,
      category: faq.category || 'general',
      sort_order: faq.sort_order || 0,
      is_active: faq.is_active !== false,
    }, { onConflict: 'id' });
    if (!error) { loadFaqs(); setEditingFaq(null); toast.success('FAQ saved!'); }
    else toast.error('Failed to save');
  };

  const deleteFaq = async (id: string) => {
    if (!confirm('Delete this FAQ?')) return;
    const { error } = await supabase.from('faqs').delete().eq('id', id);
    if (!error) { setFaqs(prev => prev.filter(f => f.id !== id)); toast.success('FAQ deleted'); }
  };

  // Login screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4">
        <Card className="w-full max-w-sm shadow-xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl">SRS Library CMS</CardTitle>
            <CardDescription>Content Management System</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input type="password" placeholder="Enter admin password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleLogin()} />
            <Button className="w-full" onClick={handleLogin}>Login</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentSection = SETTINGS_GROUPS[activeSection as keyof typeof SETTINGS_GROUPS];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex pt-16">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white dark:bg-slate-900 border-r border-border flex flex-col transition-all duration-300 fixed top-16 bottom-0 z-40`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          {sidebarOpen && (
            <div className="flex items-center gap-2 min-w-0">
              <BookOpen className="w-5 h-5 text-blue-600 flex-shrink-0" />
              <span className="font-bold truncate">SRS Library CMS</span>
            </div>
          )}
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(!sidebarOpen)}>
            {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Search */}
        {sidebarOpen && (
          <div className="p-4 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search settings..." className="pl-9" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-2">
          {Object.entries(SETTINGS_GROUPS).map(([key, group]) => (
            <button
              key={key}
              onClick={() => setActiveSection(key)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${
                activeSection === key ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'
              }`}
            >
              <group.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{group.label}</span>}
            </button>
          ))}

          {/* Divider */}
          {sidebarOpen && <div className="border-t border-border my-4 mx-2" />}

          {/* Additional Management Links */}
          {sidebarOpen && (
            <>
              <button onClick={() => setActiveSection('memberships')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'memberships' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <BookOpen className="w-5 h-5" />
                <span className="font-medium">Membership Plans</span>
              </button>
              <button onClick={() => setActiveSection('degrees_mgmt')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'degrees_mgmt' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <GraduationCap className="w-5 h-5" />
                <span className="font-medium">Degree Programs</span>
              </button>
              <button onClick={() => setActiveSection('gallery_mgmt')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'gallery_mgmt' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <Camera className="w-5 h-5" />
                <span className="font-medium">Gallery</span>
              </button>
              <button onClick={() => setActiveSection('testimonials_mgmt')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'testimonials_mgmt' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <Star className="w-5 h-5" />
                <span className="font-medium">Testimonials</span>
              </button>
              <button onClick={() => setActiveSection('navigation')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'navigation' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <Menu className="w-5 h-5" />
                <span className="font-medium">Navigation Menu</span>
              </button>
              <button onClick={() => setActiveSection('faqs_mgmt')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'faqs_mgmt' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">FAQs</span>
              </button>
              <div className="border-t border-border my-4 mx-2" />
              <button onClick={() => setActiveSection('enquiries_mgmt')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'enquiries_mgmt' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <Inbox className="w-5 h-5" />
                <span className="font-medium">Enquiries</span>
              </button>
              <button onClick={() => setActiveSection('guide')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'guide' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <FileText className="w-5 h-5" />
                <span className="font-medium">Admin Guide</span>
              </button>
              <div className="border-t border-border my-4 mx-2" />
              <button onClick={() => setActiveSection('change_password')} className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left transition-colors ${activeSection === 'change_password' ? 'bg-blue-50 dark:bg-blue-950 text-blue-600' : 'hover:bg-accent'}`}>
                <Settings className="w-5 h-5" />
                <span className="font-medium">Change Password</span>
              </button>
            </>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-border">
          <Button variant="outline" size="sm" className="w-full" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`flex-1 ${sidebarOpen ? 'ml-72' : 'ml-20'} transition-all duration-300`}>
        {/* Top Bar */}
        <header className="bg-white dark:bg-slate-900 border-b border-border sticky top-16 z-30">
          <div className="px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div className="flex items-center gap-3">
                {currentSection?.icon && <currentSection.icon className="w-5 h-5 text-blue-600 flex-shrink-0" />}
                <div>
                  <h1 className="text-lg sm:text-xl font-bold text-foreground">
                    {currentSection?.label || (activeSection === 'change_password' ? 'Change Password' : activeSection === 'memberships' ? 'Membership Plans' : activeSection === 'degrees_mgmt' ? 'Degree Programs' : activeSection === 'gallery_mgmt' ? 'Gallery Images' : activeSection === 'testimonials_mgmt' ? 'Testimonials' : activeSection === 'navigation' ? 'Navigation Menu' : activeSection === 'faqs_mgmt' ? 'FAQs' : activeSection === 'enquiries_mgmt' ? 'Enquiries Management' : activeSection === 'guide' ? 'Admin Guide' : 'Content Management')}
                  </h1>
                  <p className="text-xs text-muted-foreground hidden sm:block">Manage your website content</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {hasUnsavedChanges && (
                  <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Unsaved
                  </Badge>
                )}
                <Button variant="outline" size="sm" onClick={previewSite} className="h-8">
                  <Eye className="w-4 h-4 mr-1" />
                  Preview
                </Button>
                <Button variant="outline" size="sm" onClick={discardChanges} disabled={!hasUnsavedChanges} className="h-8">
                  Discard
                </Button>
                <Button size="sm" onClick={saveAllSettings} disabled={saving} className="h-8">
                  <Save className="w-4 h-4 mr-1" />
                  {saving ? 'Saving...' : 'Save All'}
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-8 py-6">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">Loading...</div>
          ) : (
            <>
              {/* Settings Sections */}
              {currentSection && (
                <div className="space-y-6">
                  {currentSection.sections.map((section) => {
                    // Get section keys for per-section tracking
                    const sectionKeys = section.fields.map(f => f.key);
                    const hasSectionChanges = sectionKeys.some(k => settings[k] !== originalSettings[k]);

                    const saveSection = async () => {
                      const changedKeys = sectionKeys.filter(k => settings[k] !== originalSettings[k]);
                      if (changedKeys.length === 0) return;
                      setSaving(true);
                      try {
                        const updates = changedKeys.map(key => ({
                          key,
                          value: String(settings[key] || ''),
                          updated_at: new Date().toISOString(),
                        }));
                        const { error } = await supabase.from('site_settings').upsert(updates, { onConflict: 'key' });
                        if (error) throw error;
                        setOriginalSettings(prev => ({ ...prev, ...Object.fromEntries(changedKeys.map(k => [k, settings[k]])) }));
                        toast.success('Section saved!');
                      } catch {
                        toast.error('Failed to save section');
                      } finally {
                        setSaving(false);
                      }
                    };

                    return (
                      <Card key={section.key}>
                        <CardHeader className="pb-4">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                              <CardTitle className="text-base sm:text-lg">{section.label}</CardTitle>
                              <p className="text-xs text-muted-foreground mt-1">
                                {section.fields.length} field{section.fields.length !== 1 ? 's' : ''} • {section.fields.filter(f => f.type === 'image').length} image{section.fields.filter(f => f.type === 'image').length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              {hasSectionChanges && (
                                <Badge variant="outline" className="text-amber-600 border-amber-600 text-xs">Modified</Badge>
                              )}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => window.open(`/${activeSection === 'homepage' ? '' : activeSection}`, '_blank')}
                                className="h-8 text-xs"
                              >
                                <Eye className="w-3 h-3 mr-1" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                onClick={saveSection}
                                disabled={saving || !hasSectionChanges}
                                className="h-8 text-xs"
                              >
                                <Save className="w-3 h-3 mr-1" />
                                Save
                              </Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-5">
                          {section.fields.map((field) => (
                            <div key={field.key} className="space-y-2">
                              <div className="flex flex-wrap items-center gap-2">
                                <Label className="font-medium text-sm">{field.label}</Label>
                                {field.type === 'image' && field.imageUsage && (
                                  <Badge variant="secondary" className="text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                                    <ImageIcon className="w-3 h-3 mr-1" />
                                    {field.imageUsage}
                                  </Badge>
                                )}
                              </div>
                              {field.help && (
                                <p className="text-xs text-muted-foreground">{field.help}</p>
                              )}

                              {field.type === 'image' ? (
                                <ImageUpload
                                  value={settings[field.key] || ''}
                                  onChange={(url) => updateSetting(field.key, url)}
                                  authHeaders={authHeaders}
                                  folder={section.key}
                                  label={field.label}
                                  usageLabel={field.imageUsage}
                                />
                              ) : field.type === 'color' ? (
                                <div className="flex gap-3 items-center">
                                  <Input
                                    type="color"
                                    value={settings[field.key] || '#2563eb'}
                                    onChange={(e) => updateSetting(field.key, e.target.value)}
                                    className="w-14 h-10 p-1 cursor-pointer"
                                  />
                                  <Input
                                    value={settings[field.key] || ''}
                                    onChange={(e) => updateSetting(field.key, e.target.value)}
                                    placeholder="#2563eb"
                                    className="flex-1 max-w-xs"
                                  />
                                </div>
                              ) : field.type === 'textarea' ? (
                                <Textarea
                                  value={settings[field.key] || ''}
                                  onChange={(e) => updateSetting(field.key, e.target.value)}
                                  rows={3}
                                  className="resize-none"
                                />
                              ) : (
                                <Input
                                  value={settings[field.key] || ''}
                                  onChange={(e) => updateSetting(field.key, e.target.value)}
                                />
                              )}
                            </div>
                          ))}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}

              {/* Membership Plans Management */}
              {activeSection === 'memberships' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Membership Plans</h2>
                    <Button onClick={() => setEditingPlan({ id: '', plan_key: '', name: '', price: 0, duration: '', duration_days: 0, badge: null, badge_color: 'blue', features: [], sort_order: 0, is_active: true } as Plan)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Plan
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {plans.sort((a, b) => a.sort_order - b.sort_order).map((plan) => (
                      <Card key={plan.id} className={!plan.is_active ? 'opacity-50' : ''}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle className="text-lg">{plan.name}</CardTitle>
                              <p className="text-2xl font-bold text-blue-600">₹{plan.price}</p>
                              <p className="text-sm text-muted-foreground">{plan.duration}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPlan(plan)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deletePlan(plan.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          {plan.badge && <Badge className="mt-2 bg-blue-600">{plan.badge}</Badge>}
                        </CardHeader>
                        <CardContent>
                          <ul className="text-sm space-y-1">{plan.features.map((f, i) => <li key={i} className="flex items-center gap-2"><Check className="w-3 h-3 text-green-500" />{f}</li>)}</ul>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Degree Programs Management */}
              {activeSection === 'degrees_mgmt' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Degree Programs</h2>
                    <Button onClick={() => setEditingProgram({ id: '', code: '', name: '', duration: '', eligibility: '', fee: 0, seats: 60, color: 'blue', description: '', careers: [], is_active: true, sort_order: 0 } as Program)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Program
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {programs.sort((a, b) => a.sort_order - b.sort_order).map((prog) => (
                      <Card key={prog.id} className={!prog.is_active ? 'opacity-50' : ''}>
                        <div className={`h-2 rounded-t-lg bg-${prog.color}-600`} />
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <CardTitle>{prog.code}</CardTitle>
                              <p className="text-sm text-muted-foreground">{prog.name}</p>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingProgram(prog)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteProgram(prog.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-2">
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration:</span><span className="font-medium">{prog.duration}</span></div>
                          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Fee:</span><span className="font-medium">₹{prog.fee.toLocaleString()}/year</span></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Gallery Management */}
              {activeSection === 'gallery_mgmt' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Gallery Images</h2>
                    <Button onClick={() => setEditingImage({ id: '', url: '', caption: '', category: 'general', span_cols: 1, span_rows: 1, sort_order: 0, active: true } as GalleryImage)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Image
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {gallery.sort((a, b) => a.sort_order - b.sort_order).map((img) => (
                      <div key={img.id} className={`relative group rounded-xl overflow-hidden aspect-video ${!img.active ? 'opacity-50' : ''}`}>
                        <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                          <p className="text-white text-sm font-medium">{img.caption}</p>
                          <div className="flex gap-2">
                            <Button size="sm" variant="secondary" onClick={() => setEditingImage(img)}><Edit className="w-3 h-3" /></Button>
                            <Button size="sm" variant="destructive" onClick={() => deleteImage(img.id)}><Trash2 className="w-3 h-3" /></Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Testimonials Management */}
              {activeSection === 'testimonials_mgmt' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Testimonials</h2>
                    <Button onClick={() => setEditingReview({ id: '', name: '', role: '', rating: 5, review: '', service: null, approved: true, avatar_url: null, sort_order: 0 } as Review)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Review
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reviews.map((rev) => (
                      <Card key={rev.id} className={!rev.approved ? 'opacity-50' : ''}>
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <img src={rev.avatar_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(rev.name)}&background=random`} alt={rev.name} className="w-10 h-10 rounded-full object-cover" />
                              <div>
                                <CardTitle className="text-base">{rev.name}</CardTitle>
                                <p className="text-sm text-muted-foreground">{rev.role}</p>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingReview(rev)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => deleteReview(rev.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 mt-2">
                            {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />)}
                            <Badge variant={rev.approved ? 'default' : 'secondary'} className="ml-auto">{rev.approved ? 'Approved' : 'Pending'}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent><p className="text-sm text-muted-foreground line-clamp-3">{rev.review}</p></CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Menu Management */}
              {activeSection === 'navigation' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Navigation Menu</h2>
                    <Button onClick={() => setEditingNavItem({ id: '', label: '', href: '', parent_id: null, sort_order: 0, is_active: true, open_in_new_tab: false } as NavItem)}>
                      <Plus className="w-4 h-4 mr-2" /> Add Item
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {navItems.map((item) => (
                      <Card key={item.id} className={!item.is_active ? 'opacity-50' : ''}>
                        <CardContent className="flex items-center justify-between py-4">
                          <div className="flex items-center gap-4">
                            <Badge variant="outline">{item.sort_order}</Badge>
                            <span className="font-medium">{item.label}</span>
                            <span className="text-sm text-muted-foreground">{item.href}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch checked={item.is_active} onCheckedChange={(v) => saveNavItem({ ...item, is_active: v })} />
                            <Button variant="ghost" size="sm" onClick={() => setEditingNavItem(item)}><Edit className="w-4 h-4" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteNavItem(item.id)}><Trash2 className="w-4 h-4" /></Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* FAQs Management */}
              {activeSection === 'faqs_mgmt' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold">Frequently Asked Questions</h2>
                    <Button onClick={() => setEditingFaq({ id: '', question: '', answer: '', category: 'general', sort_order: 0, is_active: true } as FAQ)}>
                      <Plus className="w-4 h-4 mr-2" /> Add FAQ
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {faqs.map((faq) => (
                      <Card key={faq.id} className={!faq.is_active ? 'opacity-50' : ''}>
                        <CardContent className="py-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium">{faq.question}</p>
                              <p className="text-sm text-muted-foreground mt-1">{faq.answer}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant="outline">{faq.category}</Badge>
                              <Switch checked={faq.is_active} onCheckedChange={(v) => saveFaq({ ...faq, is_active: v })} />
                              <Button variant="ghost" size="sm" onClick={() => setEditingFaq(faq)}><Edit className="w-4 h-4" /></Button>
                              <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteFaq(faq.id)}><Trash2 className="w-4 h-4" /></Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Enquiries Management */}
              {activeSection === 'enquiries_mgmt' && (
                <div className="space-y-6">
                  {/* Tabs */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex gap-2 overflow-x-auto">
                      <button
                        onClick={() => { setEnquiriesTab('enquiries'); setEnquiriesSearch(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                          enquiriesTab === 'enquiries' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border hover:bg-accent'
                        }`}
                      >
                        <GraduationCap className="w-4 h-4" />
                        Degree Enquiries
                        {enquiries.filter(e => e.status === 'new').length > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">{enquiries.filter(e => e.status === 'new').length}</Badge>
                        )}
                      </button>
                      <button
                        onClick={() => { setEnquiriesTab('contacts'); setEnquiriesSearch(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                          enquiriesTab === 'contacts' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border hover:bg-accent'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        Contact Messages
                        {contacts.filter(c => c.status === 'new').length > 0 && (
                          <Badge className="bg-red-500 text-white text-xs">{contacts.filter(c => c.status === 'new').length}</Badge>
                        )}
                      </button>
                      <button
                        onClick={() => { setEnquiriesTab('memberships'); setEnquiriesSearch(''); }}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm whitespace-nowrap transition-colors ${
                          enquiriesTab === 'memberships' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border hover:bg-accent'
                        }`}
                      >
                        <BookOpen className="w-4 h-4" />
                        Library Memberships
                        {memberships.filter(m => m.status === 'active').length > 0 && (
                          <Badge className="bg-green-500 text-white text-xs">{memberships.filter(m => m.status === 'active').length}</Badge>
                        )}
                      </button>
                    </div>

                    {/* Search */}
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search by name, email, phone..."
                        className="pl-9"
                        value={enquiriesSearch}
                        onChange={(e) => setEnquiriesSearch(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Degree Enquiries Tab */}
                  {enquiriesTab === 'enquiries' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filter:</span>
                        <button
                          onClick={() => setEnquiryFilter('all')}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${enquiryFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                        >
                          All ({enquiries.length})
                        </button>
                        {ENQUIRY_STATUSES.map(s => (
                          <button
                            key={s}
                            onClick={() => setEnquiryFilter(s)}
                            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${enquiryFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                          >
                            {s.replace('_', ' ')} ({enquiries.filter(e => e.status === s).length})
                          </button>
                        ))}
                      </div>

                      {enquiries.filter(e => {
                        const matchesFilter = enquiryFilter === 'all' || e.status === enquiryFilter;
                        const q = enquiriesSearch.toLowerCase();
                        const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone.includes(q) || e.course.toLowerCase().includes(q);
                        return matchesFilter && matchesSearch;
                      }).length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <Inbox className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No degree enquiries found.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid gap-4">
                          {enquiries.filter(e => {
                            const matchesFilter = enquiryFilter === 'all' || e.status === enquiryFilter;
                            const q = enquiriesSearch.toLowerCase();
                            const matchesSearch = !q || e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || e.phone.includes(q) || e.course.toLowerCase().includes(q);
                            return matchesFilter && matchesSearch;
                          }).map((enquiry) => (
                            <Card key={enquiry.id} className={enquiry.status === 'new' ? 'border-blue-500 border-2' : ''}>
                              <CardContent className="py-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-semibold text-base">{enquiry.name}</span>
                                      <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">{enquiry.course}</Badge>
                                      <Badge className={enquiry.status === 'new' ? 'bg-blue-500 text-white' : enquiry.status === 'enrolled' ? 'bg-green-500 text-white' : enquiry.status === 'rejected' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}>{enquiry.status}</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{enquiry.email}</span>
                                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{enquiry.phone}</span>
                                      {enquiry.qualification && <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" />{enquiry.qualification}</span>}
                                    </div>
                                    {enquiry.message && (
                                      <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mt-2">{enquiry.message}</p>
                                    )}
                                  </div>
                                  <div className="flex flex-col gap-2 sm:items-end">
                                    <select
                                      value={enquiry.status}
                                      onChange={(e) => updateEnquiryStatus(enquiry.id, e.target.value)}
                                      className="px-2 py-1 rounded-md border border-input bg-background text-xs"
                                    >
                                      {ENQUIRY_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                    </select>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm" onClick={() => setSelectedEnquiry(enquiry)}><Eye className="w-4 h-4" /></Button>
                                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteEnquiry(enquiry.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contact Messages Tab */}
                  {enquiriesTab === 'contacts' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filter:</span>
                        <button
                          onClick={() => setContactFilter('all')}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${contactFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                        >
                          All ({contacts.length})
                        </button>
                        {CONTACT_STATUSES.map(s => (
                          <button
                            key={s}
                            onClick={() => setContactFilter(s)}
                            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${contactFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                          >
                            {s.replace('_', ' ')} ({contacts.filter(c => c.status === s).length})
                          </button>
                        ))}
                      </div>

                      {contacts.filter(c => {
                        const matchesFilter = contactFilter === 'all' || c.status === contactFilter;
                        const q = enquiriesSearch.toLowerCase();
                        const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || '').includes(q) || c.message.toLowerCase().includes(q);
                        return matchesFilter && matchesSearch;
                      }).length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No contact messages found.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid gap-4">
                          {contacts.filter(c => {
                            const matchesFilter = contactFilter === 'all' || c.status === contactFilter;
                            const q = enquiriesSearch.toLowerCase();
                            const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || (c.phone || '').includes(q) || c.message.toLowerCase().includes(q);
                            return matchesFilter && matchesSearch;
                          }).map((contact) => (
                            <Card key={contact.id} className={contact.status === 'new' ? 'border-blue-500 border-2' : ''}>
                              <CardContent className="py-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-semibold text-base">{contact.name}</span>
                                      {contact.subject && <Badge variant="outline">{contact.subject}</Badge>}
                                      <Badge className={contact.status === 'new' ? 'bg-blue-500 text-white' : contact.status === 'resolved' ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'}>{contact.status.replace('_', ' ')}</Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{contact.email}</span>
                                      {contact.phone && <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{contact.phone}</span>}
                                    </div>
                                    <p className="text-sm text-muted-foreground bg-muted/50 rounded p-2 mt-2">{contact.message}</p>
                                  </div>
                                  <div className="flex flex-col gap-2 sm:items-end">
                                    <select
                                      value={contact.status}
                                      onChange={(e) => updateContactStatus(contact.id, e.target.value)}
                                      className="px-2 py-1 rounded-md border border-input bg-background text-xs"
                                    >
                                      {CONTACT_STATUSES.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                                    </select>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm" onClick={() => setSelectedContact(contact)}><Eye className="w-4 h-4" /></Button>
                                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteContact(contact.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Library Memberships Tab */}
                  {enquiriesTab === 'memberships' && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Filter className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Filter:</span>
                        <button
                          onClick={() => setMembershipFilter('all')}
                          className={`px-3 py-1 rounded-md text-xs font-medium ${membershipFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                        >
                          All ({memberships.length})
                        </button>
                        {MEMBERSHIP_STATUSES.map(s => (
                          <button
                            key={s}
                            onClick={() => setMembershipFilter(s)}
                            className={`px-3 py-1 rounded-md text-xs font-medium capitalize ${membershipFilter === s ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-900 border border-border'}`}
                          >
                            {s} ({memberships.filter(m => m.status === s).length})
                          </button>
                        ))}
                      </div>

                      {memberships.filter(m => {
                        const matchesFilter = membershipFilter === 'all' || m.status === membershipFilter;
                        const q = enquiriesSearch.toLowerCase();
                        const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q) || m.plan.toLowerCase().includes(q);
                        return matchesFilter && matchesSearch;
                      }).length === 0 ? (
                        <Card>
                          <CardContent className="py-12 text-center text-muted-foreground">
                            <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                            <p>No library membership registrations found.</p>
                          </CardContent>
                        </Card>
                      ) : (
                        <div className="grid gap-4">
                          {memberships.filter(m => {
                            const matchesFilter = membershipFilter === 'all' || m.status === membershipFilter;
                            const q = enquiriesSearch.toLowerCase();
                            const matchesSearch = !q || m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.phone.includes(q) || m.plan.toLowerCase().includes(q);
                            return matchesFilter && matchesSearch;
                          }).map((m) => (
                            <Card key={m.id} className={m.status === 'active' ? 'border-green-500 border-2' : ''}>
                              <CardContent className="py-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                  <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-2 flex-wrap">
                                      <span className="font-semibold text-base">{m.name}</span>
                                      <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 capitalize">{m.plan}</Badge>
                                      <Badge className={m.status === 'active' ? 'bg-green-500 text-white' : m.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-gray-500 text-white'}>{m.status}</Badge>
                                      <Badge variant="outline" className={m.payment_status === 'paid' ? 'text-green-600 border-green-600' : 'text-amber-600 border-amber-600'}>
                                        {m.payment_status}
                                      </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                      <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" />{m.email}</span>
                                      <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" />{m.phone}</span>
                                      {m.seat_number && <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" />Seat #{m.seat_number}</span>}
                                    </div>
                                  </div>
                                  <div className="flex flex-col gap-2 sm:items-end">
                                    <select
                                      value={m.status}
                                      onChange={(e) => updateMembershipStatus(m.id, e.target.value)}
                                      className="px-2 py-1 rounded-md border border-input bg-background text-xs"
                                    >
                                      {MEMBERSHIP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                    <div className="flex gap-1">
                                      <Button variant="ghost" size="sm" onClick={() => setSelectedMembership(m)}><Eye className="w-4 h-4" /></Button>
                                      <Button variant="ghost" size="sm" className="text-red-500" onClick={() => deleteMembership(m.id)}><Trash2 className="w-4 h-4" /></Button>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Admin Guide */}
              {activeSection === 'guide' && (
                <Card>
                  <CardHeader><CardTitle>Admin Guide</CardTitle></CardHeader>
                  <CardContent className="prose dark:prose-invert max-w-none">
                    <h3>Getting Started</h3>
                    <p>Welcome to the Content Management System. This guide explains what each section controls on your website.</p>

                    <h3>Homepage</h3>
                    <p><strong>Hero Section:</strong> Controls the main banner on your homepage including the headline, tagline, description, and hero image.</p>
                    <p><strong>Features Section:</strong> The section showing key features like WiFi, AC, etc.</p>
                    <p><strong>Testimonials Section:</strong> The heading for customer reviews.</p>
                    <p><strong>Gallery Section:</strong> The heading and images for the gallery preview on homepage.</p>

                    <h3>Library Page</h3>
                    <p><strong>Hero Section:</strong> The main banner on your library page.</p>
                    <p><strong>Library Images:</strong> Six images displayed on the library page showing your facilities.</p>
                    <p><strong>Content & Stats:</strong> Statistics like seats, members, rating displayed on the library page.</p>

                    <h3>Degrees Page</h3>
                    <p><strong>Hero Section:</strong> Main banner for degrees page.</p>
                    <p><strong>Admission Process:</strong> The 4-step process explanation shown to prospective students.</p>
                    <p><strong>Counselling Form:</strong> The heading for the enquiry form.</p>

                    <h3>Contact Info</h3>
                    <p><strong>Contact Details:</strong> Phone numbers, email, address displayed in footer and contact page.</p>
                    <p><strong>Google Maps:</strong> Embedded map showing your location.</p>

                    <h3>Branding</h3>
                    <p><strong>Brand Identity:</strong> Logo, favicon, colors, and tagline used throughout the site.</p>

                    <h3>SEO</h3>
                    <p><strong>Meta Information:</strong> Settings that control how your site appears in search results and when shared on social media.</p>

                    <h3>Membership Plans</h3>
                    <p>Add, edit, or delete membership plans. Toggle active status to show/hide plans from visitors.</p>

                    <h3>Degree Programs</h3>
                    <p>Manage all degree programs including fees, eligibility, career options, and descriptions.</p>

                    <h3>Gallery</h3>
                    <p>Manage all images displayed in your gallery page.</p>

                    <h3>Testimonials</h3>
                    <p>Manage customer reviews. Approve/disapprove to control which ones appear on the site.</p>

                    <h3>Enquiries</h3>
                    <p>Manage student admission enquiries, contact messages, and library membership registrations all in one place. Filter by status, search, update statuses, and delete records.</p>

                    <h3>Tips</h3>
                    <ul>
                      <li>Changes are not saved until you click "Save All"</li>
                      <li>Use the "Preview" button to see changes before saving</li>
                      <li>Discard changes if you want to revert to the last saved version</li>
                      <li>Unsaved changes warning will appear if you try to leave without saving</li>
                    </ul>
                  </CardContent>
                </Card>
              )}

              {/* Change Password */}
              {activeSection === 'change_password' && (
                <Card className="max-w-lg">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Settings className="w-5 h-5 text-blue-600" />
                      Change Password
                    </CardTitle>
                    <CardDescription>Update your admin panel login password.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cp-current" className="text-sm font-medium">Current Password</Label>
                      <Input
                        id="cp-current"
                        type="password"
                        placeholder="Enter current password"
                        value={cpCurrent}
                        onChange={(e) => setCpCurrent(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cp-new" className="text-sm font-medium">New Password</Label>
                      <Input
                        id="cp-new"
                        type="password"
                        placeholder="Enter new password (min 6 characters)"
                        value={cpNew}
                        onChange={(e) => setCpNew(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cp-confirm" className="text-sm font-medium">Confirm New Password</Label>
                      <Input
                        id="cp-confirm"
                        type="password"
                        placeholder="Re-enter new password"
                        value={cpConfirm}
                        onChange={(e) => setCpConfirm(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleChangePassword()}
                      />
                    </div>
                    <Button
                      onClick={handleChangePassword}
                      disabled={cpSaving}
                      className="w-full"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {cpSaving ? 'Saving...' : 'Save New Password'}
                    </Button>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </main>

      {/* Edit Modals would go here - simplified for brevity */}
      {editingPlan && <EditModal title="Edit Plan" onClose={() => setEditingPlan(null)} onSave={() => savePlan(editingPlan)}><PlanForm plan={editingPlan} setPlan={setEditingPlan} /></EditModal>}
      {editingProgram && <EditModal title="Edit Program" onClose={() => setEditingProgram(null)} onSave={() => saveProgram(editingProgram)}><ProgramForm program={editingProgram} setProgram={setEditingProgram} /></EditModal>}
      {editingImage && <EditModal title="Edit Image" onClose={() => setEditingImage(null)} onSave={() => saveImage(editingImage)}><ImageForm image={editingImage} setImage={setEditingImage} /></EditModal>}
      {editingReview && <EditModal title="Edit Review" onClose={() => setEditingReview(null)} onSave={() => saveReview(editingReview)}><ReviewForm review={editingReview} setReview={setEditingReview} /></EditModal>}
      {editingNavItem && <EditModal title="Edit Menu Item" onClose={() => setEditingNavItem(null)} onSave={() => saveNavItem(editingNavItem)}><NavItemForm item={editingNavItem} setItem={setEditingNavItem} /></EditModal>}
      {editingFaq && <EditModal title="Edit FAQ" onClose={() => setEditingFaq(null)} onSave={() => saveFaq(editingFaq)}><FaqForm faq={editingFaq} setFaq={setEditingFaq} /></EditModal>}

      {/* Enquiry Detail Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Enquiry Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedEnquiry(null)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><Label className="font-semibold">Name:</Label><p>{selectedEnquiry.name}</p></div>
              <div><Label className="font-semibold">Email:</Label><p>{selectedEnquiry.email}</p></div>
              <div><Label className="font-semibold">Phone:</Label><p>{selectedEnquiry.phone}</p></div>
              <div><Label className="font-semibold">Course:</Label><p>{selectedEnquiry.course}</p></div>
              <div><Label className="font-semibold">Qualification:</Label><p>{selectedEnquiry.qualification || 'N/A'}</p></div>
              <div><Label className="font-semibold">Message:</Label><p className="text-muted-foreground">{selectedEnquiry.message || 'N/A'}</p></div>
              <div><Label className="font-semibold">Status:</Label><p className="capitalize">{selectedEnquiry.status}</p></div>
              <div><Label className="font-semibold">Submitted:</Label><p>{new Date(selectedEnquiry.created_at).toLocaleString('en-IN')}</p></div>
              <div className="pt-2 flex gap-2">
                <a href={`mailto:${selectedEnquiry.email}`}><Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-1" />Email</Button></a>
                <a href={`tel:${selectedEnquiry.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button></a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Contact Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedContact(null)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><Label className="font-semibold">Name:</Label><p>{selectedContact.name}</p></div>
              <div><Label className="font-semibold">Email:</Label><p>{selectedContact.email}</p></div>
              {selectedContact.phone && <div><Label className="font-semibold">Phone:</Label><p>{selectedContact.phone}</p></div>}
              {selectedContact.subject && <div><Label className="font-semibold">Subject:</Label><p>{selectedContact.subject}</p></div>}
              <div><Label className="font-semibold">Message:</Label><p className="text-muted-foreground">{selectedContact.message}</p></div>
              <div><Label className="font-semibold">Status:</Label><p className="capitalize">{selectedContact.status.replace('_', ' ')}</p></div>
              <div><Label className="font-semibold">Submitted:</Label><p>{new Date(selectedContact.created_at).toLocaleString('en-IN')}</p></div>
              <div className="pt-2 flex gap-2">
                <a href={`mailto:${selectedContact.email}`}><Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-1" />Email</Button></a>
                {selectedContact.phone && <a href={`tel:${selectedContact.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button></a>}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Membership Detail Modal */}
      {selectedMembership && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Membership Details</CardTitle>
                <Button variant="ghost" size="icon" onClick={() => setSelectedMembership(null)}><X className="w-4 h-4" /></Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><Label className="font-semibold">Name:</Label><p>{selectedMembership.name}</p></div>
              <div><Label className="font-semibold">Email:</Label><p>{selectedMembership.email}</p></div>
              <div><Label className="font-semibold">Phone:</Label><p>{selectedMembership.phone}</p></div>
              <div><Label className="font-semibold">Plan:</Label><p className="capitalize">{selectedMembership.plan}</p></div>
              {selectedMembership.seat_number && <div><Label className="font-semibold">Seat Number:</Label><p>{selectedMembership.seat_number}</p></div>}
              {selectedMembership.amount && <div><Label className="font-semibold">Amount:</Label><p>₹{selectedMembership.amount}</p></div>}
              <div><Label className="font-semibold">Payment Status:</Label><p className="capitalize">{selectedMembership.payment_status}</p></div>
              <div><Label className="font-semibold">Status:</Label><p className="capitalize">{selectedMembership.status}</p></div>
              {selectedMembership.start_date && <div><Label className="font-semibold">Start Date:</Label><p>{selectedMembership.start_date}</p></div>}
              {selectedMembership.end_date && <div><Label className="font-semibold">End Date:</Label><p>{selectedMembership.end_date}</p></div>}
              <div><Label className="font-semibold">Registered:</Label><p>{new Date(selectedMembership.created_at).toLocaleString('en-IN')}</p></div>
              <div className="pt-2 flex gap-2">
                <a href={`mailto:${selectedMembership.email}`}><Button size="sm" variant="outline"><Mail className="w-4 h-4 mr-1" />Email</Button></a>
                <a href={`tel:${selectedMembership.phone}`}><Button size="sm" variant="outline"><Phone className="w-4 h-4 mr-1" />Call</Button></a>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

// Modal Component
function EditModal({ title, children, onClose, onSave }: { title: string; children: React.ReactNode; onClose: () => void; onSave: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader><div className="flex justify-between items-center"><CardTitle>{title}</CardTitle><Button variant="ghost" size="icon" onClick={onClose}><X className="w-4 h-4" /></Button></div></CardHeader>
        <CardContent className="space-y-4">{children}</CardContent>
        <div className="p-4 border-t flex gap-2"><Button variant="outline" className="flex-1" onClick={onClose}>Cancel</Button><Button className="flex-1" onClick={onSave}>Save</Button></div>
      </Card>
    </div>
  );
}

// Form Components (simplified)
function PlanForm({ plan, setPlan }: { plan: Plan | null; setPlan: (p: Plan | null) => void }) {
  if (!plan) return null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Plan Key</Label><Input value={plan.plan_key} onChange={(e) => setPlan({ ...plan, plan_key: e.target.value })} /></div>
        <div><Label>Name</Label><Input value={plan.name} onChange={(e) => setPlan({ ...plan, name: e.target.value })} /></div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div><Label>Price (₹)</Label><Input type="number" value={plan.price} onChange={(e) => setPlan({ ...plan, price: parseInt(e.target.value) || 0 })} /></div>
        <div><Label>Duration</Label><Input value={plan.duration} onChange={(e) => setPlan({ ...plan, duration: e.target.value })} /></div>
        <div><Label>Days</Label><Input type="number" value={plan.duration_days} onChange={(e) => setPlan({ ...plan, duration_days: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div><Label>Badge (optional)</Label><Input value={plan.badge || ''} onChange={(e) => setPlan({ ...plan, badge: e.target.value || null })} /></div>
      <div><Label>Features (one per line)</Label><Textarea value={plan.features.join('\n')} onChange={(e) => setPlan({ ...plan, features: e.target.value.split('\n').filter(Boolean) })} rows={4} /></div>
      <div className="flex items-center gap-2"><Switch checked={plan.is_active} onCheckedChange={(v) => setPlan({ ...plan, is_active: v })} /><Label>Active</Label></div>
    </div>
  );
}

function ProgramForm({ program, setProgram }: { program: Program | null; setProgram: (p: Program | null) => void }) {
  if (!program) return null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Code</Label><Input value={program.code} onChange={(e) => setProgram({ ...program, code: e.target.value })} /></div>
        <div><Label>Color</Label><Input value={program.color} onChange={(e) => setProgram({ ...program, color: e.target.value })} /></div>
      </div>
      <div><Label>Name</Label><Input value={program.name} onChange={(e) => setProgram({ ...program, name: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Duration</Label><Input value={program.duration} onChange={(e) => setProgram({ ...program, duration: e.target.value })} /></div>
        <div><Label>Fee (₹/year)</Label><Input type="number" value={program.fee} onChange={(e) => setProgram({ ...program, fee: parseInt(e.target.value) || 0 })} /></div>
      </div>
      <div><Label>Eligibility</Label><Input value={program.eligibility} onChange={(e) => setProgram({ ...program, eligibility: e.target.value })} /></div>
      <div><Label>Description</Label><Textarea value={program.description} onChange={(e) => setProgram({ ...program, description: e.target.value })} rows={2} /></div>
      <div><Label>Career Options (one per line)</Label><Textarea value={program.careers.join('\n')} onChange={(e) => setProgram({ ...program, careers: e.target.value.split('\n').filter(Boolean) })} rows={3} /></div>
      <div className="flex items-center gap-2"><Switch checked={program.is_active} onCheckedChange={(v) => setProgram({ ...program, is_active: v })} /><Label>Active</Label></div>
    </div>
  );
}

function ImageForm({ image, setImage }: { image: GalleryImage | null; setImage: (i: GalleryImage | null) => void }) {
  if (!image) return null;
  return (
    <div className="space-y-4">
      <div>
        <Label>Image</Label>
        <ImageUpload
          value={image.url}
          onChange={(url) => setImage({ ...image, url })}
          authHeaders={() => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('adminSessionPw') || 'admin123'}`,
          })}
          folder="gallery"
        />
      </div>
      <div><Label>Caption</Label><Input value={image.caption || ''} onChange={(e) => setImage({ ...image, caption: e.target.value })} /></div>
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Span Cols</Label><Input type="number" value={image.span_cols} onChange={(e) => setImage({ ...image, span_cols: parseInt(e.target.value) || 1 })} /></div>
        <div><Label>Span Rows</Label><Input type="number" value={image.span_rows} onChange={(e) => setImage({ ...image, span_rows: parseInt(e.target.value) || 1 })} /></div>
      </div>
      <div className="flex items-center gap-2"><Switch checked={image.active} onCheckedChange={(v) => setImage({ ...image, active: v })} /><Label>Active</Label></div>
    </div>
  );
}

function ReviewForm({ review, setReview }: { review: Review | null; setReview: (r: Review | null) => void }) {
  if (!review) return null;
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div><Label>Name</Label><Input value={review.name} onChange={(e) => setReview({ ...review, name: e.target.value })} /></div>
        <div><Label>Role</Label><Input value={review.role || ''} onChange={(e) => setReview({ ...review, role: e.target.value })} /></div>
      </div>
      <div>
        <Label>Avatar Image (optional)</Label>
        <ImageUpload
          value={review.avatar_url || ''}
          onChange={(url) => setReview({ ...review, avatar_url: url || null })}
          authHeaders={() => ({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${sessionStorage.getItem('adminSessionPw') || 'admin123'}`,
          })}
          folder="avatars"
        />
      </div>
      <div><Label>Rating</Label><div className="flex gap-1">{[1, 2, 3, 4, 5].map((r) => <button key={r} type="button" onClick={() => setReview({ ...review, rating: r })}><Star className={`w-6 h-6 ${r <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} /></button>)}</div></div>
      <div><Label>Review</Label><Textarea value={review.review} onChange={(e) => setReview({ ...review, review: e.target.value })} rows={4} /></div>
      <div className="flex items-center gap-2"><Switch checked={review.approved} onCheckedChange={(v) => setReview({ ...review, approved: v })} /><Label>Approved</Label></div>
    </div>
  );
}

function NavItemForm({ item, setItem }: { item: NavItem | null; setItem: (i: NavItem | null) => void }) {
  if (!item) return null;
  return (
    <div className="space-y-4">
      <div><Label>Label</Label><Input value={item.label} onChange={(e) => setItem({ ...item, label: e.target.value })} /></div>
      <div><Label>Link (href)</Label><Input value={item.href} onChange={(e) => setItem({ ...item, href: e.target.value })} /></div>
      <div><Label>Sort Order</Label><Input type="number" value={item.sort_order} onChange={(e) => setItem({ ...item, sort_order: parseInt(e.target.value) || 0 })} /></div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2"><Switch checked={item.is_active} onCheckedChange={(v) => setItem({ ...item, is_active: v })} /><Label>Active</Label></div>
        <div className="flex items-center gap-2"><Switch checked={item.open_in_new_tab} onCheckedChange={(v) => setItem({ ...item, open_in_new_tab: v })} /><Label>Open in new tab</Label></div>
      </div>
    </div>
  );
}

function FaqForm({ faq, setFaq }: { faq: FAQ | null; setFaq: (f: FAQ | null) => void }) {
  if (!faq) return null;
  return (
    <div className="space-y-4">
      <div><Label>Question</Label><Input value={faq.question} onChange={(e) => setFaq({ ...faq, question: e.target.value })} /></div>
      <div><Label>Answer</Label><Textarea value={faq.answer} onChange={(e) => setFaq({ ...faq, answer: e.target.value })} rows={4} /></div>
      <div><Label>Category</Label><Input value={faq.category} onChange={(e) => setFaq({ ...faq, category: e.target.value })} /></div>
      <div className="flex items-center gap-2"><Switch checked={faq.is_active} onCheckedChange={(v) => setFaq({ ...faq, is_active: v })} /><Label>Active</Label></div>
    </div>
  );
}
