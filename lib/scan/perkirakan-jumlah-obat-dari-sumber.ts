/**
 * Perkiraan jumlah obat yang di-crawl dari `sources_crawled` di scan_logs.
 * Pipeline: 1 sumber FDA + 2 sumber per obat (berita + PubMed).
 */
export function perkirakan_jumlah_obat_dari_sumber(jumlah_sumber: number | null): number | null {
  if (jumlah_sumber == null || jumlah_sumber <= 0) return null;
  if (jumlah_sumber === 1) return 0;
  return Math.max(0, Math.floor((jumlah_sumber - 1) / 2));
}
