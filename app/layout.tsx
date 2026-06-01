import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { Plus_Jakarta_Sans, Source_Serif_4 } from 'next/font/google';
import { JALUR_BRAND } from '@/lib/jalur-brand';
import './globals.css';

const LatarThreeKesehatan = dynamic(
  () => import('@/components/latar-three-kesehatan').then((m) => m.LatarThreeKesehatan),
  { ssr: false },
);

const url_aplikasi =
  process.env.NEXT_PUBLIC_APP_URL?.trim() || 'http://localhost:3001';

const font_sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const font_display = Source_Serif_4({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(url_aplikasi),
  title: 'MediGuard AI — Medication Safety Intelligence',
  description:
    'Real-time medication safety alerts from curated Food and Drug Administration (FDA) and live web sources — with traceable citations, not medical advice.',
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
      'Personal medication safety alerts from Food and Drug Administration (FDA) labels and live web signals — every alert links to a primary source.',
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
      <body className={`${font_sans.variable} ${font_display.variable} min-h-screen antialiased`}>
        <LatarThreeKesehatan />
        {children}
      </body>
    </html>
  );
}
