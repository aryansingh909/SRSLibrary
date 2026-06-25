'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export type SiteSettings = Record<string, string>;

const DEFAULT_SETTINGS: SiteSettings = {
  business_name: 'SRS Library',
  phone_primary: '+91 99999 99999',
  whatsapp_number: '+91 99999 99999',
  email: 'hello@studynest.in',
  address: '123, Main Market Road, Your City, State — 000000',
  google_maps_embed_url: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.0!2d77.2!3d28.6!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM2JzAwLjAiTiA3N8KwMTInMDAuMCJF!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin',
  hero_tagline: 'Premium Study Experience',
  hero_headline_line1: 'Where Focus',
  hero_headline_highlight: 'Meets',
  hero_headline_line2: 'Excellence',
  hero_description: 'Experience the perfect study environment — premium AC library with 40 individual seats, high-speed WiFi, and expert guidance for online degree admissions from Mangalayatan University.',
  hero_image_url: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800&h=600&fit=crop',
  hero_cta_primary_text: 'Join Library',
  hero_cta_secondary_text: 'Apply for Degree',
  hero_stat_students: '500+',
  hero_stat_seats: '40',
  hero_rating: '5.0',
  about_title: 'About StudyNest',
  about_subtitle: 'Your Gateway to Academic Excellence',
  about_description: 'StudyNest is a premium study library and education consultancy dedicated to helping students achieve their dreams.',
  stat_seats: '40',
  stat_members: '500+',
  stat_rating: '5.0',
  stat_years: '3+',
  stat_reviews: '500+',
  stat_power_value: '24/7',
  stat_power_label: 'Power Backup',
  stat_wifi_value: '100+',
  stat_wifi_label: 'Mbps WiFi',
  stat_cctv_value: 'CCTV',
  stat_cctv_label: 'Surveillance',
  social_facebook: '',
  social_instagram: '',
  social_youtube: '',
  social_twitter: '',
  partner_university_name: 'Mangalayatan University',
  partner_university_description: 'UGC-approved university recognized by DEB.',
  partner_university_badges: 'UGC Approved,DEB Recognized,NAAC Accredited,Govt Job Valid',
  features_title: 'Everything You Need to Excel',
  features_subtitle: 'We have invested in every detail so you can focus entirely on what matters — your studies.',
  services_title: 'Two Powerful Paths to Success',
  services_description: 'Whether you need the perfect environment to study, or expert guidance to unlock a university degree — we have got you covered.',
  library_title: 'Premium Study Library',
  library_description: '40 comfortable air-conditioned study seats with individual desks, high-speed WiFi, CCTV surveillance, dedicated parking, and 24x7 power backup. The ideal environment for serious learners.',
  degrees_title: 'Online Degree Admissions',
  degrees_description: 'Get expert guidance for online degree admissions from Mangalayatan University. UGC-approved programs recognized for government jobs and higher studies.',
};

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data, error } = await supabase
          .from('site_settings')
          .select('key, value');

        if (!error && data) {
          const fetchedSettings: SiteSettings = { ...DEFAULT_SETTINGS };
          data.forEach((item) => {
            fetchedSettings[item.key] = item.value || '';
          });
          setSettings(fetchedSettings);
        }
      } catch (error) {
        console.error('Failed to fetch settings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  return { settings, loading };
}

export function usePlans() {
  const [plans, setPlans] = useState<Array<{
    id: string;
    plan_key: string;
    name: string;
    price: number;
    duration: string;
    duration_days: number;
    badge: string | null;
    badge_color: string;
    features: string[];
    sort_order: number;
    is_active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const { data, error } = await supabase
          .from('membership_plans')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data) {
          setPlans(data);
        }
      } catch (error) {
        console.error('Failed to fetch plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  return { plans, loading };
}

export function usePrograms() {
  const [programs, setPrograms] = useState<Array<{
    id: string;
    code: string;
    name: string;
    duration: string;
    eligibility: string;
    fee: number;
    seats: number;
    color: string;
    description: string;
    careers: string[];
    is_active: boolean;
    sort_order: number;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrograms = async () => {
      try {
        const { data, error } = await supabase
          .from('degree_programs')
          .select('*')
          .eq('is_active', true)
          .order('sort_order');

        if (!error && data) {
          setPrograms(data);
        }
      } catch (error) {
        console.error('Failed to fetch programs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);

  return { programs, loading };
}

export function useGallery() {
  const [images, setImages] = useState<Array<{
    id: string;
    url: string;
    caption: string | null;
    category: string;
    span_cols: number;
    span_rows: number;
    sort_order: number;
    active: boolean;
  }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data, error } = await supabase
          .from('gallery_images')
          .select('*')
          .eq('active', true)
          .order('sort_order');

        if (!error && data) {
          setImages(data);
        }
      } catch (error) {
        console.error('Failed to fetch gallery:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  return { images, loading };
}
