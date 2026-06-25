import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import FloatingActions from '@/components/floating-actions';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://srslibrary.com'),
  title: {
    default: 'SRS Library — Premium Study Library & Online Degree Admissions',
    template: '%s | SRS Library',
  },
  description:
    'SRS Library offers a premium air-conditioned study library with 40 seats, high-speed WiFi, CCTV security, and expert guidance for online degree admissions from Mangalayatan University.',
  keywords: [
    'study library',
    'online degree',
    'Mangalayatan University',
    'BCA admission',
    'MBA admission',
    'study hall',
    'premium library',
    'education consultancy',
    'online education',
    'SRS Library',
  ],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'SRS Library',
    title: 'SRS Library — Premium Study Library & Online Degree Admissions',
    description:
      'Premium air-conditioned study library with 40 seats + expert online degree admissions guidance from Mangalayatan University.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SRS Library — Premium Study Library & Online Degree Admissions',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={inter.variable}>
      <body className={`${inter.className} min-h-screen bg-background`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <FloatingActions />
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}
