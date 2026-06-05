/** URL dan batas ukuran respons Nimble — selaras docs/07-API_INTEGRATIONS.md. */

export const URL_DASAR_NIMBLE_SDK = 'https://sdk.nimbleway.com/v1';
export const URL_DASAR_NIMBLE_LEGACY = 'https://api.nimbleway.com/v1';

export const URL_FDA_SAFETY =
  'https://www.fda.gov/drugs/drug-safety-and-availability/drug-safety-communications';

/** Feed RSS cadangan bila crawl FDA gagal (lihat docs/06-TIMELINE.md). */
export const URL_FDA_RSS_MEDWATCH =
  'https://www.fda.gov/about-fda/contact-fda/stay-informed/rss-feeds/medwatch/rss.xml';

/** Batas karakter cuplikan yang dikirim ke Claude — hindari overflow konteks. */
export const BATAS_CUPLIKAN_KARAKTER = 5000;

/** Maksimum item terstruktur yang diekstrak per sumber. */
export const BATAS_ITEM_TERSTRUKTUR = 15;

/** Percobaan ekstrak/pencarian Nimble sebelum fallback (gangguan jaringan singkat). */
export const MAKS_PERCOBAAN_NIMBLE = 2;

/** Jeda dasar antar percobaan ulang — dikalikan nomor percobaan (backoff linear). */
export const JEDA_RETRY_NIMBLE_MS = 1000;
