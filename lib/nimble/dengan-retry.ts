import { JEDA_RETRY_NIMBLE_MS, MAKS_PERCOBAAN_NIMBLE } from '@/lib/nimble/konstanta';

function jeda_ms(percobaan: number, jeda_dasar: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, jeda_dasar * (percobaan + 1));
  });
}

/**
 * Jalankan operasi Nimble dengan percobaan ulang + backoff linear.
 * Default 2 percobaan — cukup untuk gangguan jaringan singkat tanpa menahan scan terlalu lama.
 */
export async function jalankan_dengan_retry<T>(
  operasi: () => Promise<T>,
  opsi?: {
    maks_percobaan?: number;
    jeda_dasar_ms?: number;
  },
): Promise<T> {
  const maks_percobaan = opsi?.maks_percobaan ?? MAKS_PERCOBAAN_NIMBLE;
  const jeda_dasar_ms = opsi?.jeda_dasar_ms ?? JEDA_RETRY_NIMBLE_MS;
  let galat_terakhir: unknown;

  for (let percobaan = 0; percobaan < maks_percobaan; percobaan++) {
    try {
      return await operasi();
    } catch (galat) {
      galat_terakhir = galat;
      if (percobaan >= maks_percobaan - 1) break;
      await jeda_ms(percobaan, jeda_dasar_ms);
    }
  }

  if (galat_terakhir instanceof Error) throw galat_terakhir;
  throw new Error('Percobaan Nimble habis tanpa hasil.');
}
