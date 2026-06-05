/** Tahapan yang ditampilkan saat Scan Now — perkiraan, bukan telemetry server. */
export const TAHAP_PROGRES_SCAN = [
  { id: 'fda', label: 'Fetching FDA alerts…', bobot: 0.28 },
  { id: 'berita', label: 'Crawling medical news & PubMed…', bobot: 0.38 },
  { id: 'ai', label: 'Analyzing with AI…', bobot: 0.27 },
  { id: 'simpan', label: 'Saving results…', bobot: 0.07 },
] as const;

const BATAS_OBAT_PIPELINE = 9;
const DETIK_DASAR_FDA = 28;
const DETIK_PER_OBAT = 12;
const DETIK_ANALISIS_CLAUDE = 18;
const DETIK_MINIMUM = 45;
const DETIK_MAKSIMUM = 115;

/**
 * Perkiraan durasi scan manual (detik) dari jumlah obat di profil.
 * Selaras pipeline: FDA → crawl per obat (maks 9) → Claude → simpan.
 */
export function estimasi_durasi_scan_detik(jumlah_obat: number): number {
  const obat_efektif = Math.min(Math.max(jumlah_obat, 1), BATAS_OBAT_PIPELINE);
  const total = DETIK_DASAR_FDA + obat_efektif * DETIK_PER_OBAT + DETIK_ANALISIS_CLAUDE;
  return Math.min(DETIK_MAKSIMUM, Math.max(DETIK_MINIMUM, total));
}

/** Indeks tahap dari persen progres estimasi (0–100). */
export function indeks_tahap_dari_persen(persen: number): number {
  const nilai = Math.min(100, Math.max(0, persen));
  let ambang_kumulatif = 0;

  for (let i = 0; i < TAHAP_PROGRES_SCAN.length; i++) {
    ambang_kumulatif += TAHAP_PROGRES_SCAN[i].bobot * 100;
    if (nilai < ambang_kumulatif) return i;
  }

  return TAHAP_PROGRES_SCAN.length - 1;
}

/** Persen maksimum sebelum respons API selesai — hindari bar penuh lalu macet. */
export const PERSEN_PROGRES_MAKS_SEBELUM_SELESAI = 92;
