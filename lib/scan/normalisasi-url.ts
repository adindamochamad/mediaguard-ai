/**
 * Normalisasi URL sumber untuk deduplikasi konsisten.
 */
export function normalisasi_url_sumber(url: string): string {
  try {
    const obj = new URL(url.trim());
    obj.hash = '';
    const jalur = obj.pathname.replace(/\/+$/, '') || '/';
    // Abaikan query string agar ?utm= tidak memecah deduplikasi sumber sama.
    return `${obj.protocol}//${obj.host.toLowerCase()}${jalur}`;
  } catch {
    return url.trim().toLowerCase();
  }
}
