import { z } from 'zod';
import { ambang_keyakinan_minimum } from '@/lib/konstanta';
import type { ItemAlertAnalisis, KeluaranAnalisisAlert } from '@/lib/tipe-alert';

export const skema_tingkat_severity = z.enum(['critical', 'warning', 'info']);

export const skema_item_alert = z.object({
  relevant: z.boolean(),
  medication: z.string().min(1).max(200),
  severity: skema_tingkat_severity,
  title: z.string().min(1).max(300),
  summary: z.string().min(1).max(2000),
  action: z.string().min(1).max(1000),
  source_url: z.string().url().max(2000).or(z.literal('')),
  confidence: z.number().min(0).max(1),
});

export const skema_keluaran_alert = z.object({
  alerts: z.array(skema_item_alert),
});

/** Validasi JSON mentah dari Claude; lempar ZodError bila struktur tidak sesuai. */
export function validasi_keluaran_alert(mentah: unknown): KeluaranAnalisisAlert {
  return skema_keluaran_alert.parse(mentah);
}

/**
 * Filter alert yang layak ditampilkan: relevan, keyakinan ≥ ambang, obat ada di daftar pasien.
 */
export function filter_alert_relevan(
  keluaran: KeluaranAnalisisAlert,
  daftar_obat: string[],
): ItemAlertAnalisis[] {
  const daftar_normal = daftar_obat.map((nama) => nama.trim().toLowerCase()).filter(Boolean);

  return keluaran.alerts.filter((alert) => {
    if (!alert.relevant) return false;
    if (alert.confidence < ambang_keyakinan_minimum) return false;

    const nama_alert = alert.medication.trim().toLowerCase();
    return daftar_normal.some(
      (nama) => nama === nama_alert || nama_alert.includes(nama) || nama.includes(nama_alert),
    );
  });
}
