import { BATAS_WAKTU_SCAN_MANUAL_MS } from '@/lib/konstanta';

export class GalatBatasWaktuScan extends Error {
  constructor(ms: number = BATAS_WAKTU_SCAN_MANUAL_MS) {
    super(
      `Scan timed out after ${Math.round(ms / 1000)} seconds. Try again — if this keeps happening, check Nimble and Claude health.`,
    );
    this.name = 'GalatBatasWaktuScan';
  }
}

/** Batasi durasi pipeline scan di level API (Promise.race). */
export function dengan_batas_waktu_scan<T>(
  promise: Promise<T>,
  ms: number = BATAS_WAKTU_SCAN_MANUAL_MS,
): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => {
      setTimeout(() => reject(new GalatBatasWaktuScan(ms)), ms);
    }),
  ]);
}
