import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Premium Study Library — AC Seats, WiFi, CCTV | SRS Library',
  description:
    'Join SRS Library premium study library. Premium AC individual study seats, high-speed WiFi, CCTV security, 24x7 power backup, clean washrooms, dedicated parking. Daily, weekly, monthly and quarterly plans.',
};

export default function LibraryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
