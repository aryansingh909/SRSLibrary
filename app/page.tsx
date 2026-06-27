import HeroSection from '@/components/home/hero-section';
import StatsSection from '@/components/home/stats-section';
import ServicesSection from '@/components/home/services-section';
import FeaturesSection from '@/components/home/features-section';
import TestimonialsSection from '@/components/home/testimonials-section';
import GalleryPreview from '@/components/home/gallery-preview';
import ContactSection from '@/components/home/contact-section';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SRS Library — Premium Study Library & Online Degree Admissions',
  description:
    'Join SRS Library: premium AC study library with high-speed WiFi, CCTV, 24x7 power backup + expert online degree admission guidance for BCA, BBA, MBA and more from Mangalayatan University.',
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <ServicesSection />
      <FeaturesSection />
      <TestimonialsSection />
      <GalleryPreview />
      <ContactSection />
    </>
  );
}
