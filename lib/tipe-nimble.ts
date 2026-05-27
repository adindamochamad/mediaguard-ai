/** Satu entri peringatan keamanan obat dari FDA (hasil parse terstruktur). */
export type ItemPeringatanFda = {
  judul: string;
  url: string;
  tanggal_terbit?: string;
};

/** Hasil crawl halaman komunikasi keamanan FDA. */
export type HasilCrawlFda = {
  sumber: 'fda_safety_communications' | 'fda_rss_fallback';
  url_sumber: string;
  di_crawl_pada: string;
  item: ItemPeringatanFda[];
  /** Cuplikan teks untuk tahap analisis Claude (bukan salinan penuh label). */
  cuplikan_teks: string;
};

/** Hasil pencarian berita medis terkait satu obat. */
export type HasilBeritaMedis = {
  judul: string;
  url: string;
  cuplikan: string;
  tanggal?: string;
};

/** Satu artikel PubMed dari halaman hasil pencarian. */
export type ItemArtikelPubMed = {
  judul: string;
  url: string;
  cuplikan?: string;
};

/** Hasil crawl PubMed untuk interaksi/efek samping suatu obat. */
export type HasilCrawlPubMed = {
  nama_obat: string;
  url_pencarian: string;
  di_crawl_pada: string;
  artikel: ItemArtikelPubMed[];
  cuplikan_teks: string;
};
