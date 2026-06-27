'use client';

import { AirVent, Lock, ParkingSquare, Bath, Lightbulb, Volume2, MonitorSmartphone, Users } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

const FEATURES = [
  {
    icon: AirVent,
    title: 'Fully Air Conditioned',
    description: 'Premium AC maintained at an optimal temperature so you can study without discomfort in all seasons.',
    color: 'text-blue-600',
    bg: 'bg-blue-50 dark:bg-blue-950',
  },
  {
    icon: Lock,
    title: 'CCTV Surveillance',
    description: '24x7 CCTV monitoring across all areas for your safety and complete peace of mind.',
    color: 'text-rose-600',
    bg: 'bg-rose-50 dark:bg-rose-950',
  },
  {
    icon: ParkingSquare,
    title: 'Dedicated Parking',
    description: 'Ample dedicated parking space for two-wheelers and four-wheelers — no parking stress.',
    color: 'text-amber-600',
    bg: 'bg-amber-50 dark:bg-amber-950',
  },
  {
    icon: Bath,
    title: 'Clean Washrooms',
    description: 'Hygienically maintained washrooms, cleaned regularly throughout the day.',
    color: 'text-green-600',
    bg: 'bg-green-50 dark:bg-green-950',
  },
  {
    icon: Lightbulb,
    title: '24x7 Power Backup',
    description: 'Uninterrupted electricity with full generator backup so your study sessions are never disrupted.',
    color: 'text-yellow-600',
    bg: 'bg-yellow-50 dark:bg-yellow-950',
  },
  {
    icon: Volume2,
    title: 'Noise-Free Zone',
    description: 'Strict no-noise policy to ensure a distraction-free, productive study atmosphere.',
    color: 'text-purple-600',
    bg: 'bg-purple-50 dark:bg-purple-950',
  },
  {
    icon: MonitorSmartphone,
    title: 'High-Speed WiFi',
    description: 'Blazing-fast broadband internet — perfect for research, online exams, and video lectures.',
    color: 'text-cyan-600',
    bg: 'bg-cyan-50 dark:bg-cyan-950',
  },
  {
    icon: Users,
    title: 'Premium Individual Desks',
    description: 'Ergonomically designed individual study desks with personal charging points at every seat.',
    color: 'text-indigo-600',
    bg: 'bg-indigo-50 dark:bg-indigo-950',
  },
];

export default function FeaturesSection() {
  const { settings } = useSettings();

  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-3">Facilities</p>
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            {settings.features_title || 'Everything You Need to Excel'}
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {settings.features_subtitle || 'We have invested in every detail so you can focus entirely on what matters — your studies.'}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
            <div
              key={title}
              className="group card-hover bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
