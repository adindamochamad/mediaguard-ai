'use client';

import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { BilahProgresScan } from '@/components/bilah-progres-scan';
import { BATAS_WAKTU_SCAN_MANUAL_MS } from '@/lib/konstanta';
import { TAHAP_PROGRES_SCAN } from '@/lib/scan/estimasi-progres-scan';
import { buat_klien_supabase_peramban } from '@/lib/supabase/client';

type PropsKontrolScan = {
  waktu_scan_terakhir: string | null;
  pengguna_id: string;
  jumlah_obat: number;
};

function format_waktu_relatif(iso: string): string {
  const selisih_ms = Date.now() - new Date(iso).getTime();
  const menit = Math.floor(selisih_ms / 60_000);
  if (menit < 1) return 'just now';
  if (menit < 60) return `${menit} minute${menit === 1 ? '' : 's'} ago`;
  const jam = Math.floor(menit / 60);
  if (jam < 24) return `${jam} hour${jam === 1 ? '' : 's'} ago`;
  const hari = Math.floor(jam / 24);
  return `${hari} day${hari === 1 ? '' : 's'} ago`;
}

export function KontrolScanDashboard({
  waktu_scan_terakhir,
  pengguna_id,
  jumlah_obat,
}: PropsKontrolScan) {
  const router = useRouter();
  const [waktu_terakhir_lokal, set_waktu_terakhir_lokal] = useState(waktu_scan_terakhir);
  const [sedang_memindai, set_sedang_memindai] = useState(false);

  useEffect(() => {
    set_waktu_terakhir_lokal(waktu_scan_terakhir);
  }, [waktu_scan_terakhir]);

  useEffect(() => {
    const supabase = buat_klien_supabase_peramban();
    const kanal = supabase
      .channel(`dashboard-scan-logs-${pengguna_id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'scan_logs',
          filter: `user_id=eq.${pengguna_id}`,
        },
        (payload) => {
          const log_baru = payload.new as { created_at?: string };
          if (log_baru.created_at) set_waktu_terakhir_lokal(log_baru.created_at);
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(kanal);
    };
  }, [pengguna_id]);

  const jalankan_scan = useCallback(async () => {
    set_sedang_memindai(true);

    const id_toast = toast.loading(`${TAHAP_PROGRES_SCAN[0].label} This may take about a minute.`);

    try {
      const respons = await fetch('/api/scan', {
        method: 'POST',
        signal: AbortSignal.timeout(BATAS_WAKTU_SCAN_MANUAL_MS + 10_000),
      });
      const body = (await respons.json()) as {
        kesalahan?: string;
        scan?: {
          jumlah_alert_baru: number;
          jumlah_alert_duplikat: number;
          durasi_ms: number;
          pesan?: string;
        };
      };

      if (!respons.ok) {
        toast.error(body.kesalahan ?? 'Scan failed. Try again.', { id: id_toast });
        return;
      }

      const scan = body.scan;
      if (scan?.pesan) {
        toast.info(scan.pesan, { id: id_toast });
      } else if (scan) {
        const jumlah = scan.jumlah_alert_baru;
        const detik  = Math.round(scan.durasi_ms / 1000);
        if (jumlah > 0) {
          toast.success(
            `${jumlah} new alert${jumlah === 1 ? '' : 's'} found — check your feed below.`,
            { id: id_toast, duration: 5000 },
          );
        } else {
          toast.success(`All clear — no new alerts (${detik}s).`, { id: id_toast });
        }
      }

      router.refresh();

      try {
        if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
          const kanal_tab = new BroadcastChannel(`dashboard-sinkron-${pengguna_id}`);
          kanal_tab.postMessage({ jenis: 'scan_selesai' });
          kanal_tab.close();
        }
        localStorage.setItem(`dashboard-sinkron-${pengguna_id}`, String(Date.now()));
      } catch {
        // Sinkron tab bersifat tambahan; realtime Postgres tetap jalur utama.
      }
    } catch (galat) {
      const pesan =
        galat instanceof DOMException && galat.name === 'TimeoutError'
          ? 'Scan timed out. The server may still be busy — wait a moment, then try again.'
          : 'Network error during scan.';
      toast.error(pesan, { id: id_toast });
    } finally {
      set_sedang_memindai(false);
    }
  }, [router, pengguna_id]);

  const teks_terakhir = waktu_terakhir_lokal
    ? `Last scanned: ${format_waktu_relatif(waktu_terakhir_lokal)}`
    : 'Last scanned: not yet';

  return (
    <div className="flex w-full flex-col items-stretch gap-3 sm:max-w-sm sm:items-end">
      <button
        type="button"
        onClick={jalankan_scan}
        disabled={sedang_memindai}
        className="btn-primary gap-2 self-start disabled:cursor-wait sm:self-end"
      >
        {sedang_memindai ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Scanning…
          </>
        ) : (
          'Scan now'
        )}
      </button>

      <BilahProgresScan jumlah_obat={jumlah_obat} aktif={sedang_memindai} />

      <p className="text-xs text-muted sm:text-right">{teks_terakhir}</p>
    </div>
  );
}
