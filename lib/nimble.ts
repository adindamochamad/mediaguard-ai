/**
 * Integrasi Nimble — crawl FDA, pencarian berita medis, crawl PubMed.
 * Selaras docs/07-API_INTEGRATIONS.md dan checkpoint Hari 4.
 */
import {
  ambil_rss_fda,
  cari_web_medical,
  ekstrak_halaman,
  potong_teks,
} from '@/lib/nimble/klien';
import { jalankan_dengan_retry } from '@/lib/nimble/dengan-retry';
import { URL_FDA_SAFETY } from '@/lib/nimble/konstanta';
import { parse_halaman_fda, parse_rss_fda } from '@/lib/nimble/parse-fda';
import { parse_halaman_pubmed } from '@/lib/nimble/parse-pubmed';
import type {
  HasilBeritaMedis,
  HasilCrawlFda,
  HasilCrawlPubMed,
} from '@/lib/tipe-nimble';

export { kredensial_nimble_terisi } from '@/lib/nimble/klien';
export { jalankan_dengan_retry } from '@/lib/nimble/dengan-retry';

/** Ekstrak halaman Nimble dengan retry sebelum fallback RSS / gagal total. */
async function ekstrak_halaman_dengan_retry(url: string, render_js = false): Promise<string> {
  return jalankan_dengan_retry(() => ekstrak_halaman(url, render_js));
}
export type {
  HasilBeritaMedis,
  HasilCrawlFda,
  HasilCrawlPubMed,
  ItemArtikelPubMed,
  ItemPeringatanFda,
} from '@/lib/tipe-nimble';

/**
 * Crawl halaman FDA Drug Safety Communications via Nimble.
 * Mengembalikan item terstruktur (judul + URL) plus cuplikan teks untuk Claude.
 * Jika crawl gagal, fallback ke feed RSS MedWatch FDA.
 */
export async function crawlFDAAlerts(): Promise<HasilCrawlFda> {
  const waktu_crawl = new Date().toISOString();

  try {
    const konten = await ekstrak_halaman_dengan_retry(URL_FDA_SAFETY, false);
    const item = parse_halaman_fda(konten);

    if (item.length > 0) {
      return {
        sumber: 'fda_safety_communications',
        url_sumber: URL_FDA_SAFETY,
        di_crawl_pada: waktu_crawl,
        item,
        cuplikan_teks: potong_teks(konten),
      };
    }
  } catch {
    /* lanjut ke RSS fallback */
  }

  const xml_rss = await ambil_rss_fda();
  const item_rss = parse_rss_fda(xml_rss);

  return {
    sumber: 'fda_rss_fallback',
    url_sumber: URL_FDA_SAFETY,
    di_crawl_pada: waktu_crawl,
    item: item_rss,
    cuplikan_teks: potong_teks(xml_rss),
  };
}

/**
 * Cari berita medis terkait satu obat (Nimble Search API).
 */
export async function searchMedicalNews(nama_obat: string): Promise<HasilBeritaMedis[]> {
  const kueri = `"${nama_obat}" (safety warning OR recall OR FDA alert OR adverse effects) 2026`;
  const hasil_mentah = await jalankan_dengan_retry(() => cari_web_medical(kueri, 5));

  return hasil_mentah.map((baris) => ({
    judul: baris.judul,
    url: baris.url,
    cuplikan: baris.cuplikan,
    tanggal: baris.tanggal,
  }));
}

/**
 * Crawl hasil pencarian PubMed untuk interaksi/efek samping suatu obat.
 */
export async function crawlPubMed(nama_obat: string): Promise<HasilCrawlPubMed> {
  const istilah = `${nama_obat} interaction adverse effect`;
  const url_pencarian = `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(istilah)}&filter=dates.2025-2026`;

  const konten = await ekstrak_halaman_dengan_retry(url_pencarian, false);
  const artikel = parse_halaman_pubmed(konten);

  return {
    nama_obat,
    url_pencarian,
    di_crawl_pada: new Date().toISOString(),
    artikel,
    cuplikan_teks: potong_teks(konten),
  };
}
