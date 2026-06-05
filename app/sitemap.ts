import type { MetadataRoute } from 'next';

const url_dasar =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') ?? 'http://localhost:3001';

/** Peta situs publik — tanpa rute dashboard yang memerlukan login. */
export default function sitemap(): MetadataRoute.Sitemap {
  const waktu_sekarang = new Date();

  return [
    {
      url: url_dasar,
      lastModified: waktu_sekarang,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${url_dasar}/login`,
      lastModified: waktu_sekarang,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${url_dasar}/signup`,
      lastModified: waktu_sekarang,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];
}
