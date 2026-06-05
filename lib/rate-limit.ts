import type { SupabaseClient } from '@supabase/supabase-js';
import {
  JENDELA_BATAS_SCAN_MENIT,
  MAKS_SCAN_MANUAL_PER_JAM,
} from '@/lib/konstanta';

export type OpsiBatasPermintaan = {
  /** Alias Inggris — selaras contoh integrasi API. */
  maxRequests?: number;
  maks_permintaan?: number;
  windowMinutes?: number;
  jendela_menit?: number;
};

export type HasilBatasPermintaan = {
  diizinkan: boolean;
  /** Menit sampai slot scan manual tersedia lagi. */
  coba_lagi_menit?: number;
  /** Alias untuk respons API / klien. */
  allowed: boolean;
  retryAfter?: number;
};

function normalisasi_opsi(opsi: OpsiBatasPermintaan): {
  maks_permintaan: number;
  jendela_menit: number;
} {
  return {
    maks_permintaan: opsi.maks_permintaan ?? opsi.maxRequests ?? MAKS_SCAN_MANUAL_PER_JAM,
    jendela_menit: opsi.jendela_menit ?? opsi.windowMinutes ?? JENDELA_BATAS_SCAN_MENIT,
  };
}

function ke_hasil(diizinkan: boolean, coba_lagi_menit?: number): HasilBatasPermintaan {
  return {
    diizinkan,
    allowed: diizinkan,
    coba_lagi_menit,
    retryAfter: coba_lagi_menit,
  };
}

/**
 * Cek batas frekuensi scan manual dari `scan_logs` (tanpa tabel baru).
 * `jenis` disiapkan untuk perluasan (mis. chat) — saat ini hanya `scan`.
 */
export async function cek_batas_permintaan(
  supabase: SupabaseClient,
  id_pengguna: string,
  jenis: 'scan',
  opsi: OpsiBatasPermintaan = {},
): Promise<HasilBatasPermintaan> {
  if (jenis !== 'scan') {
    return ke_hasil(true);
  }

  const { maks_permintaan, jendela_menit } = normalisasi_opsi(opsi);
  const waktu_sejak = new Date(Date.now() - jendela_menit * 60_000).toISOString();

  const { data: log_dalam_jendela, error } = await supabase
    .from('scan_logs')
    .select('created_at')
    .eq('user_id', id_pengguna)
    .eq('scan_type', 'manual')
    .gte('created_at', waktu_sejak)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[rate-limit] gagal menghitung scan_logs:', error.message);
    return ke_hasil(true);
  }

  const jumlah = log_dalam_jendela?.length ?? 0;
  if (jumlah < maks_permintaan) {
    return ke_hasil(true);
  }

  const waktu_tertua = log_dalam_jendela?.[0]?.created_at;
  if (!waktu_tertua) {
    return ke_hasil(false, jendela_menit);
  }

  const waktu_boleh_lagi =
    new Date(waktu_tertua).getTime() + jendela_menit * 60_000;
  const sisa_ms = Math.max(0, waktu_boleh_lagi - Date.now());
  const coba_lagi_menit = Math.max(1, Math.ceil(sisa_ms / 60_000));

  return ke_hasil(false, coba_lagi_menit);
}

/** Alias Inggris — dipakai di rute API. */
export const checkRateLimit = cek_batas_permintaan;
