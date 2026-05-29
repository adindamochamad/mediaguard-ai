import { NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { jalankan_scan_untuk_pengguna } from '@/lib/scan';
import { sisipkan_alert_demo } from '@/lib/scan/demo-fallback';

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

  if (process.env.DEMO_FALLBACK === 'true') {
    try {
      const jumlah = await sisipkan_alert_demo(supabase, pengguna.id);
      return NextResponse.json({
        status: 'selesai',
        scan: {
          id_pengguna: pengguna.id,
          jenis_scan: 'manual',
          jumlah_sumber: 3,
          jumlah_alert_relevan: jumlah,
          jumlah_alert_baru: jumlah,
          jumlah_alert_duplikat: 0,
          jumlah_email_kritis_terkirim: 0,
          durasi_ms: 1100,
        },
      });
    } catch (galat) {
      const pesan = galat instanceof Error ? galat.message : 'Demo fallback failed.';
      return NextResponse.json({ kesalahan: pesan }, { status: 502 });
    }
  }

  try {
    const hasil = await jalankan_scan_untuk_pengguna({
      supabase,
      id_pengguna: pengguna.id,
      jenis_scan: 'manual',
    });

    return NextResponse.json({
      status: 'selesai',
      scan: hasil,
    });
  } catch (galat) {
    const pesan = galat instanceof Error ? galat.message : 'Scan failed.';
    return NextResponse.json({ kesalahan: pesan }, { status: 502 });
  }
}
