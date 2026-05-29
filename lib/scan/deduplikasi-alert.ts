import type { SupabaseClient } from '@supabase/supabase-js';
import { normalisasi_url_sumber } from '@/lib/scan/normalisasi-url';
import type { ItemAlertAnalisis } from '@/lib/tipe-alert';

export type IndeksDuplikat = {
  url_sudah_ada: Set<string>;
  kunci_tanpa_url: Set<string>;
};

/**
 * Muat indeks alert yang sudah ada untuk pengguna (dedup sebelum insert).
 */
export async function muat_indeks_duplikat(
  supabase: SupabaseClient,
  id_pengguna: string,
): Promise<IndeksDuplikat> {
  const { data, error } = await supabase
    .from('alerts')
    .select('source_url, medication_id, title')
    .eq('user_id', id_pengguna);

  if (error) {
    throw new Error(`Gagal memuat alert untuk deduplikasi: ${error.message}`);
  }

  const url_sudah_ada = new Set<string>();
  const kunci_tanpa_url = new Set<string>();

  for (const baris of data ?? []) {
    const url = typeof baris.source_url === 'string' ? baris.source_url.trim() : '';
    if (url) {
      url_sudah_ada.add(normalisasi_url_sumber(url));
      continue;
    }
    const id_obat = baris.medication_id ?? '';
    const judul = typeof baris.title === 'string' ? baris.title.trim().toLowerCase() : '';
    kunci_tanpa_url.add(`${id_obat}|${judul}`);
  }

  return { url_sudah_ada, kunci_tanpa_url };
}

export function apakah_alert_duplikat(
  alert: ItemAlertAnalisis,
  id_obat: string | null,
  indeks: IndeksDuplikat,
): boolean {
  const url = alert.source_url?.trim();
  if (url) {
    return indeks.url_sudah_ada.has(normalisasi_url_sumber(url));
  }

  const kunci = `${id_obat ?? ''}|${alert.title.trim().toLowerCase()}`;
  return indeks.kunci_tanpa_url.has(kunci);
}

/** Perbarui indeks in-memory setelah insert agar duplikat dalam satu batch terdeteksi. */
export function tandai_alert_di_indeks(
  alert: ItemAlertAnalisis,
  id_obat: string | null,
  indeks: IndeksDuplikat,
): void {
  const url = alert.source_url?.trim();
  if (url) {
    indeks.url_sudah_ada.add(normalisasi_url_sumber(url));
    return;
  }
  const kunci = `${id_obat ?? ''}|${alert.title.trim().toLowerCase()}`;
  indeks.kunci_tanpa_url.add(kunci);
}
