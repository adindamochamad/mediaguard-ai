/**
 * Tebak kolom source_type dari URL (selaras feed dashboard).
 */
export function tebak_jenis_sumber(url_sumber: string): string {
  const url_bawah = url_sumber.toLowerCase();
  if (url_bawah.includes('fda.gov')) return 'fda';
  if (url_bawah.includes('pubmed') || url_bawah.includes('ncbi.nlm.nih.gov')) return 'pubmed';
  if (url_bawah.includes('dailymed')) return 'dailymed';
  return 'news';
}
