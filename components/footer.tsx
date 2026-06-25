'use client';

import Link from 'next/link';
import { BookOpen, Phone, Mail, MapPin, Facebook, Instagram, Youtube, Twitter, Linkedin } from 'lucide-react';
import { useSettings, usePrograms } from '@/hooks/use-settings';

const FOOTER_LINKS = {
  services: [
    { label: 'Study Library', href: '/library' },
    { label: 'Library Membership', href: '/library#membership' },
    { label: 'Online Degrees', href: '/degrees' },
    { label: 'Free Counselling', href: '/degrees#counselling' },
    { label: 'Admission Process', href: '/degrees#process' },
  ],
  company: [
    { label: 'About Us', href: '/#about' },
    { label: 'Gallery', href: '/gallery' },
    { label: 'Blog', href: '/blog' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Admin Panel', href: '/admin' },
  ],
};

export default function Footer() {
  const { settings } = useSettings();
  const { programs } = usePrograms();

  const socialLinks = [
    { key: 'facebook', icon: Facebook, url: settings.social_facebook },
    { key: 'instagram', icon: Instagram, url: settings.social_instagram },
    { key: 'youtube', icon: Youtube, url: settings.social_youtube },
    { key: 'twitter', icon: Twitter, url: settings.social_twitter },
    { key: 'linkedin', icon: Linkedin, url: settings.social_linkedin },
  ].filter(s => s.url);

  const badges = (settings.partner_university_badges || '').split(',').filter(Boolean);

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-xl text-white">
                {settings.business_name?.split(' ').map((word, i) =>
                  i === 0 ? <span key={i}>{word} </span> : <span key={i} className="text-blue-400">{word}</span>
                ) || <>SRS <span className="text-blue-400">Library</span></>}
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-5">
              Premium study library &amp; online education consultancy. Your success is our mission.
              UGC-approved degrees from {settings.partner_university_name || 'Mangalayatan University'}.
            </p>
            <div className="flex flex-col gap-2.5 text-sm">
              <a href={`tel:${settings.phone_primary}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {settings.phone_primary}
              </a>
              <a href={`mailto:${settings.email}`} className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-blue-400 flex-shrink-0" />
                {settings.email}
              </a>
              <div className="flex items-start gap-2 text-slate-400">
                <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
            </div>
            {socialLinks.length > 0 && (
              <div className="flex gap-3 mt-5">
                {socialLinks.map(({ key, icon: Icon, url }) => (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center hover:bg-blue-600 transition-colors"
                    aria-label={key}
                  >
                    <Icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Services</h3>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.services.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Courses */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Courses</h3>
            <ul className="flex flex-col gap-2.5">
              {programs.map((prog) => (
                <li key={prog.code}>
                  <Link href={`/courses/${prog.code.toLowerCase()}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {prog.code} — {prog.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">Company</h3>
            <ul className="flex flex-col gap-2.5">
              {FOOTER_LINKS.company.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6 p-4 rounded-xl bg-blue-600/10 border border-blue-500/20">
              <p className="text-xs text-blue-300 font-medium mb-1">Partner University</p>
              <p className="text-sm text-white font-semibold">{settings.partner_university_name}</p>
              <p className="text-xs text-slate-400 mt-1">{badges.join(' · ')}</p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} {settings.business_name}. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">Terms of Service</Link>
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
