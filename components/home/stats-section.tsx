'use client';

import { Users, Zap, Wifi, ShieldCheck } from 'lucide-react';
import { useSettings } from '@/hooks/use-settings';

export default function StatsSection() {
  const { settings } = useSettings();

  const stats = [
    { icon: Users, value: settings.stat_seats || 'Premium', label: 'Study Seats', sub: 'Individual desks', color: 'bg-blue-600' },
    { icon: Zap, value: settings.stat_power_value || '24/7', label: settings.stat_power_label || 'Power Backup', sub: 'Uninterrupted study', color: 'bg-amber-500' },
    { icon: Wifi, value: settings.stat_wifi_value || '100+', label: settings.stat_wifi_label || 'Mbps WiFi', sub: 'High-speed internet', color: 'bg-green-500' },
    { icon: ShieldCheck, value: settings.stat_cctv_value || 'CCTV', label: settings.stat_cctv_label || 'Surveillance', sub: 'Full security coverage', color: 'bg-rose-500' },
  ];

  return (
    <section className="py-16 bg-background relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map(({ icon: Icon, value, label, sub, color }) => (
            <div
              key={label}
              className="relative group card-hover bg-white dark:bg-slate-900 rounded-2xl p-6 border border-border shadow-sm overflow-hidden"
            >
              <div className={`absolute inset-x-0 bottom-0 h-1 ${color} opacity-60 group-hover:opacity-100 transition-opacity`} />
              <div className={`w-12 h-12 rounded-xl ${color} bg-opacity-10 flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 text-white`} style={{ filter: 'drop-shadow(0 0 4px currentColor)' }} />
              </div>
              <p className="text-3xl font-bold text-foreground">{value}</p>
              <p className="font-semibold text-foreground/80 mt-1">{label}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
