import { BATAS_KONTEN_CRAWL_KARAKTER } from '@/lib/claude/konstanta';
import type {
  HasilBeritaMedis,
  HasilCrawlFda,
  HasilCrawlPubMed,
} from '@/lib/tipe-nimble';

type InputKontenCrawl = {
  fda?: HasilCrawlFda;
  berita_per_obat?: Array<{ nama_obat: string; hasil: HasilBeritaMedis[] }>;
  pubmed_per_obat?: HasilCrawlPubMed[];
};

/**
 * Gabungkan hasil Nimble/RSS menjadi satu string untuk `analyzeForAlerts`.
 */
export function siapkan_konten_crawl_untuk_analisis(input: InputKontenCrawl): string {
  const bagian: string[] = [];

  if (input.fda) {
    bagian.push(`=== FDA SOURCE: ${input.fda.sumber} ===`);
    bagian.push(`Fetched at: ${input.fda.di_crawl_pada}`);
    for (const item of input.fda.item) {
      bagian.push(`- ${item.judul} | ${item.url}`);
    }
    if (input.fda.cuplikan_teks) {
      bagian.push('--- excerpt ---');
      bagian.push(input.fda.cuplikan_teks);
    }
  }

  if (input.berita_per_obat?.length) {
    bagian.push('=== MEDICAL NEWS SEARCH ===');
    for (const blok of input.berita_per_obat) {
      bagian.push(`Medication: ${blok.nama_obat}`);
      for (const berita of blok.hasil) {
        bagian.push(`- ${berita.judul} | ${berita.url}`);
        if (berita.cuplikan) bagian.push(`  ${berita.cuplikan}`);
      }
    }
  }

  if (input.pubmed_per_obat?.length) {
    bagian.push('=== PUBMED SEARCH ===');
    for (const pubmed of input.pubmed_per_obat) {
      bagian.push(`Medication: ${pubmed.nama_obat} | ${pubmed.url_pencarian}`);
      for (const artikel of pubmed.artikel) {
        bagian.push(`- ${artikel.judul} | ${artikel.url}`);
      }
      if (pubmed.cuplikan_teks) {
        bagian.push('--- excerpt ---');
        bagian.push(pubmed.cuplikan_teks.slice(0, 1500));
      }
    }
  }

  return bagian.join('\n\n').slice(0, BATAS_KONTEN_CRAWL_KARAKTER);
}
