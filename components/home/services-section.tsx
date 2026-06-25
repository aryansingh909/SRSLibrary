'use client';

import Link from 'next/link';
import { ArrowRight, BookOpen, GraduationCap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSettings } from '@/hooks/use-settings';

export default function ServicesSection() {
  const { settings } = useSettings();

  return (
    <section className="py-20 section-gradient">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Our Services</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {settings.services_title || 'Two Powerful Paths to Success'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {settings.services_description || 'Whether you need the perfect environment to study, or expert guidance to unlock a university degree — we have got you covered.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Library Card */}
          <div className="group relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-blue-700 p-8 text-white shadow-2xl shadow-blue-500/30 card-hover">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/15 flex items-center justify-center mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold mb-3">{settings.library_title || 'Premium Study Library'}</h3>
              <p className="text-blue-100 leading-relaxed mb-6">
                {settings.library_description || '40 comfortable air-conditioned study seats with individual desks, high-speed WiFi, CCTV surveillance, dedicated parking, and 24x7 power backup. The ideal environment for serious learners.'}
              </p>
              <ul className="grid grid-cols-2 gap-2 mb-8">
                {['AC Environment', 'High-Speed WiFi', '40 Seats', 'CCTV 24x7', 'Power Backup', 'Quiet Zone', 'Clean Washrooms', 'Parking'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-blue-100">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/70 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/library">
                <Button className="bg-white text-blue-700 hover:bg-blue-50 font-semibold rounded-xl group-hover:shadow-lg transition-all">
                  Explore Library
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Degree Card */}
          <div className="group relative rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-border p-8 shadow-xl card-hover">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 dark:bg-blue-950/30 rounded-full -translate-y-32 translate-x-32" />

            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-blue-600/10 dark:bg-blue-600/20 flex items-center justify-center mb-6">
                <GraduationCap className="w-7 h-7 text-blue-600" />
              </div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-950 text-green-700 dark:text-green-400 text-xs font-semibold border border-green-200 dark:border-green-800 mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
                {settings.partner_university_badges?.split(',')[0] || 'UGC Approved'} · {settings.partner_university_badges?.split(',')[1] || 'DEB Recognized'}
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{settings.degrees_title || 'Online Degree Admissions'}</h3>
              <p className="text-muted-foreground leading-relaxed mb-6">
                {settings.degrees_description || `Get expert guidance for online degree admissions from ${settings.partner_university_name || 'Mangalayatan University'}. UGC-approved programs recognized for government jobs and higher studies.`}
              </p>
              <div className="grid grid-cols-3 gap-2 mb-8">
                {['BCA', 'BBA', 'BA', 'MBA', 'MA', 'M.Com'].map((course) => (
                  <Link key={course} href={`/courses/${course.toLowerCase().replace('.', '')}`}>
                    <div className="text-center p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-400 text-sm font-semibold hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-100 dark:border-blue-900">
                      {course}
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/degrees">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-lg shadow-blue-500/25">
                  Explore Programs
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
