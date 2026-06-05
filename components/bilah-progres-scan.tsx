'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  estimasi_durasi_scan_detik,
  indeks_tahap_dari_persen,
  PERSEN_PROGRES_MAKS_SEBELUM_SELESAI,
  TAHAP_PROGRES_SCAN,
} from '@/lib/scan/estimasi-progres-scan';

type PropsBilahProgresScan = {
  jumlah_obat: number;
  aktif: boolean;
};

export function BilahProgresScan({ jumlah_obat, aktif }: PropsBilahProgresScan) {
  const [persen, set_persen] = useState(0);
  const [indeks_tahap, set_indeks_tahap] = useState(0);

  const estimasi_detik = useMemo(
    () => estimasi_durasi_scan_detik(jumlah_obat),
    [jumlah_obat],
  );

  useEffect(() => {
    if (!aktif) {
      set_persen(0);
      set_indeks_tahap(0);
      return;
    }

    const waktu_mulai = Date.now();
    const interval = setInterval(() => {
      const detik_lalu = (Date.now() - waktu_mulai) / 1000;
      const persen_baru = Math.min(
        PERSEN_PROGRES_MAKS_SEBELUM_SELESAI,
        (detik_lalu / estimasi_detik) * 100,
      );
      set_persen(persen_baru);
      set_indeks_tahap(indeks_tahap_dari_persen(persen_baru));
    }, 400);

    return () => clearInterval(interval);
  }, [aktif, estimasi_detik]);

  if (!aktif) return null;

  const tahap = TAHAP_PROGRES_SCAN[indeks_tahap];
  const sisa_detik = Math.max(0, Math.ceil(estimasi_detik * (1 - persen / 100)));

  return (
    <div
      className="w-full min-w-[220px] max-w-sm space-y-2 rounded-xl border border-border bg-card/80 p-3 shadow-soft"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex items-center justify-between gap-2 text-xs">
        <span className="font-medium text-foreground">{tahap.label}</span>
        <span className="shrink-0 text-muted">
          ~{sisa_detik > 0 ? `${sisa_detik}s left` : 'finishing…'}
        </span>
      </div>
      <div
        className="h-2 overflow-hidden rounded-full bg-border"
        aria-valuenow={Math.round(persen)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Scan progress (estimated)"
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
          style={{ width: `${persen}%` }}
        />
      </div>
      <p className="text-[11px] leading-snug text-muted">
        Typical scan: ~{estimasi_detik}s for {jumlah_obat} medication
        {jumlah_obat === 1 ? '' : 's'}. Step {indeks_tahap + 1} of {TAHAP_PROGRES_SCAN.length}.
      </p>
    </div>
  );
}
