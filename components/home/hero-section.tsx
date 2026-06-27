'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap, Star, Shield, Wifi, Zap, AirVent, ParkingSquare, Bath, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSettings } from '@/hooks/use-settings';

export default function HeroSection() {
  const { settings } = useSettings();

  const features = [
    { icon: AirVent, label: 'Fully AC' },
    { icon: Wifi, label: 'High-Speed WiFi' },
    { icon: Shield, label: 'CCTV Security' },
    { icon: Zap, label: '24x7 Power Backup' },
    { icon: ParkingSquare, label: 'Free Parking' },
    { icon: Bath, label: 'Clean Washrooms' },
    { icon: Volume2, label: 'Silent Zone' },
  ];

  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 hero-gradient" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,hsl(214_100%_44%/0.07)_0%,transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,hsl(214_100%_44%/0.05)_0%,transparent_50%)]" />

      {/* Decorative grid */}
      <div className="absolute inset-0 bg-[linear-gradient(hsl(214_20%_90%/0.3)_1px,transparent_1px),linear-gradient(90deg,hsl(214_20%_90%/0.3)_1px,transparent_1px)] bg-[size:60px_60px] [mask-image:radial-gradient(ellipse_80%_70%_at_50%_50%,black_40%,transparent_100%)] dark:bg-[linear-gradient(hsl(214_25%_18%/0.5)_1px,transparent_1px),linear-gradient(90deg,hsl(214_25%_18%/0.5)_1px,transparent_1px)]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left content */}
          <div>
            <Badge className="mb-6 px-3 py-1.5 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800 rounded-full text-xs font-semibold uppercase tracking-wider">
              <Star className="w-3 h-3 mr-1.5 fill-current" />
              {settings.hero_tagline || 'Premium Study Experience'}
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground leading-[1.1] mb-6">
              {settings.hero_headline_line1 || 'Where Focus'}{' '}
              <span className="text-gradient">{settings.hero_headline_highlight || 'Meets'}</span>
              <br />
              <span className="text-gradient">{settings.hero_headline_line2 || 'Excellence'}</span>
            </h1>

            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
              {settings.hero_description || 'Experience the perfect study environment — premium AC library with premium seats, high-speed WiFi, and expert guidance for online degree admissions from Mangalayatan University.'}
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap gap-2 mb-8">
              {features.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-slate-800 border border-border text-sm text-foreground/70 shadow-sm"
                >
                  <Icon className="w-3.5 h-3.5 text-blue-600" />
                  {label}
                </div>
              ))}
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/library">
                <Button
                  size="lg"
                  className="w-full sm:w-auto rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-500/30 text-base px-8 group"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {settings.hero_cta_primary_text || 'Join Library'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
              <Link href="/degrees">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto rounded-xl border-2 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950 text-base px-8 group"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  {settings.hero_cta_secondary_text || 'Apply for Degree'}
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-0.5 transition-transform" />
                </Button>
              </Link>
            </div>

            {/* Social proof */}
            <div className="flex items-center gap-4 mt-8 pt-8 border-t border-border/50">
              <div className="flex -space-x-2">
                {[
                  'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=60&h=60&fit=crop',
                  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=60&h=60&fit=crop',
                  'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=60&h=60&fit=crop',
                  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=60&h=60&fit=crop',
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="Student"
                    className="w-9 h-9 rounded-full border-2 border-white dark:border-slate-900 object-cover"
                  />
                ))}
              </div>
              <div>
                <div className="flex items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1.5 text-sm font-semibold">{settings.hero_rating || '5.0'}</span>
                </div>
                <p className="text-xs text-muted-foreground">{settings.hero_stat_students || '500+'} students trust us</p>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative hidden lg:block">
            <div className="relative">
              {/* Main image */}
              <div className="rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border border-white/50 dark:border-white/10">
                <img
                  src={settings.hero_image_url || 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?w=800&h=600&fit=crop'}
                  alt="Premium study library"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/50 via-transparent to-transparent rounded-3xl" />
              </div>

              {/* Floating card — seats */}
              <div className="absolute -left-8 top-8 glass rounded-2xl p-4 shadow-xl border border-white/30 dark:border-white/10 animate-float">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-foreground">{settings.hero_stat_seats || 'Premium'}</p>
                    <p className="text-xs text-muted-foreground">Study Seats</p>
                  </div>
                </div>
              </div>

              {/* Floating card — rating */}
              <div className="absolute -right-6 bottom-12 glass rounded-2xl p-4 shadow-xl border border-white/30 dark:border-white/10" style={{ animationDelay: '2s' }}>
                <div className="flex items-center gap-2 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm font-semibold text-foreground">{settings.hero_rating || '5.0'} Rating</p>
                <p className="text-xs text-muted-foreground">Google Reviews</p>
              </div>

              {/* Floating card — UGC */}
              <div className="absolute -right-4 top-4 glass rounded-2xl p-3 shadow-xl border border-white/30 dark:border-white/10">
                <p className="text-xs font-bold text-foreground">UGC Approved</p>
                <p className="text-[10px] text-muted-foreground">Online Degrees</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 80" className="w-full fill-background" preserveAspectRatio="none">
          <path d="M0,40 C240,80 480,0 720,40 C960,80 1200,0 1440,40 L1440,80 L0,80 Z" />
        </svg>
      </div>
    </section>
  );
}
