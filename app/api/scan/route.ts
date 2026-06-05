import { NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { jalankan_scan_untuk_pengguna } from '@/lib/scan';
import { sisipkan_alert_demo } from '@/lib/scan/demo-fallback';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  BATAS_WAKTU_SCAN_MANUAL_MS,
  JENDELA_BATAS_SCAN_MENIT,
  MAKS_SCAN_MANUAL_PER_JAM,
} from '@/lib/konstanta';
import {
  GalatBatasWaktuScan,
  dengan_batas_waktu_scan,
} from '@/lib/scan/dengan-batas-waktu-scan';

/**
 * POST — pemindaian manual (Scan Now).
 * Nimble crawl → Claude → deduplikasi → insert alerts + scan_logs.
 *
 * Ketika DEMO_FALLBACK=true, lewati Nimble/Claude dan sisipkan alert
 * yang sudah di-cache — berguna saat demo live agar tidak bergantung
 * pada ketersediaan API eksternal.
 */
export async function POST() {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;

  const batas = await checkRateLimit(supabase, pengguna.id, 'scan', {
    maxRequests: MAKS_SCAN_MANUAL_PER_JAM,
    windowMinutes: JENDELA_BATAS_SCAN_MENIT,
  });

  if (!batas.allowed) {
    const menit = batas.retryAfter ?? 1;
    return NextResponse.json(
      {
        kesalahan: `Rate limit exceeded. Try again in ${menit} minute${menit === 1 ? '' : 's'}.`,
        status: 'gagal',
      },
      { status: 429 },
    );
  }

  if (process.env.DEMO_FALLBACK === 'true') {
    try {
      const hasil_demo = await sisipkan_alert_demo(supabase, pengguna.id);
      return NextResponse.json({
        status: 'selesai',
        scan: {
          id_pengguna: pengguna.id,
          jenis_scan: 'manual',
          jumlah_sumber: 3,
          jumlah_alert_relevan: hasil_demo.jumlah_alert_baru + hasil_demo.jumlah_alert_duplikat,
          jumlah_alert_baru: hasil_demo.jumlah_alert_baru,
          jumlah_alert_duplikat: hasil_demo.jumlah_alert_duplikat,
          jumlah_email_kritis_terkirim: 0,
          durasi_ms: hasil_demo.durasi_ms,
        },
      });
    } catch (galat) {
      const pesan = galat instanceof Error ? galat.message : 'Demo fallback failed.';
      return NextResponse.json({ kesalahan: pesan }, { status: 502 });
    }
  }

  try {
    const hasil = await dengan_batas_waktu_scan(
      jalankan_scan_untuk_pengguna({
        supabase,
        id_pengguna: pengguna.id,
        jenis_scan: 'manual',
      }),
    );

    return NextResponse.json({
      status: 'selesai',
      scan: hasil,
    });
  } catch (galat) {
    const pesan = galat instanceof Error ? galat.message : 'Scan failed.';
    const status = galat instanceof GalatBatasWaktuScan ? 504 : 502;

    if (galat instanceof GalatBatasWaktuScan) {
      console.warn(
        `[SCAN] status=timeout_client user=${pengguna.id} type=manual duration_cap_ms=${BATAS_WAKTU_SCAN_MANUAL_MS} — pipeline may still finish in background; check scan_logs and [SCAN] status=ok`,
      );
    }

    return NextResponse.json({ kesalahan: pesan, status: 'gagal' }, { status });
  }
}
