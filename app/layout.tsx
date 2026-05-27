import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { JALUR_BRAND } from '@/lib/jalur-brand';
import './globals.css';

const url_aplikasi =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3001';

const font_sans = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const font_mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(url_aplikasi),
  title: 'MediGuard AI — Medication Safety Intelligence',
  description:
    'Real-time medication safety alerts from curated FDA and live web sources — with traceable citations, not medical advice.',
  manifest: '/site.webmanifest',
  icons: {
    icon: [
      { url: JALUR_BRAND.favicon32, sizes: '32x32', type: 'image/png' },
      { url: JALUR_BRAND.icon192, sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: JALUR_BRAND.appleTouch, sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MediGuard AI',
    title: 'MediGuard AI — Medication Safety Intelligence',
    description:
      'Personal medication safety alerts from FDA labels and live web signals — every alert links to a primary source.',
    images: [
      {
        url: JALUR_BRAND.ogSocial,
        width: 1200,
        height: 630,
        alt: 'MediGuard AI — medication safety with traceable sources',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MediGuard AI',
    description:
      'Medication safety intelligence with traceable sources — not medical advice.',
    images: [JALUR_BRAND.ogSocial],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${font_sans.variable} ${font_mono.variable} min-h-screen antialiased`}>
        {children}
      </body>
    </html>
  );
}
