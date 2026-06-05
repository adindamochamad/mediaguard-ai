/**
 * Kebijakan produk yang dikodifikasi (selaras dokumentasi internal).
 */
export const ambang_keyakinan_minimum = 0.75 as const;

/** Batas waktu total scan manual (POST /api/scan) — cegah UI "Scanning…" tanpa akhir. */
export const BATAS_WAKTU_SCAN_MANUAL_MS = 120_000 as const;

/** Maksimum Scan Now manual per jendela waktu (hemat Nimble + Claude). */
export const MAKS_SCAN_MANUAL_PER_JAM = 5 as const;

/** Jendela rate limit scan manual (menit). */
export const JENDELA_BATAS_SCAN_MENIT = 60 as const;
