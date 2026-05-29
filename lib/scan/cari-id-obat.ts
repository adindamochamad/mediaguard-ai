import type { Obat } from '@/lib/tipe-obat';

/**
 * Cocokkan nama obat dari Claude ke baris medications pengguna.
 */
export function cari_id_obat_dari_nama(
  daftar_obat: Obat[],
  nama_dari_alert: string,
): string | null {
  const nama_normal = nama_dari_alert.trim().toLowerCase();
  if (!nama_normal) return null;

  for (const obat of daftar_obat) {
    const kandidat = [
      obat.brand_name,
      obat.generic_name ?? '',
    ]
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);

    for (const nama of kandidat) {
      if (nama === nama_normal || nama_normal.includes(nama) || nama.includes(nama_normal)) {
        return obat.id;
      }
    }
  }

  return null;
}
