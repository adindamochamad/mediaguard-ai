import { NextRequest, NextResponse } from 'next/server';
import { buat_klien_supabase_admin, kunci_layanan_supabase_terisi } from '@/lib/supabase/admin';
import { jalankan_scan_untuk_pengguna } from '@/lib/scan';

/**
 * GET — cron Vercel setiap 6 jam: scan semua pengguna yang punya obat.
 */
export async function GET(permintaan: NextRequest) {
  try {
    const header_auth = permintaan.headers.get('authorization');
    const rahasia_cron = process.env.CRON_SECRET;

    if (!rahasia_cron) {
      return NextResponse.json({ kesalahan: 'CRON_SECRET belum diatur' }, { status: 500 });
    }

    if (header_auth !== `Bearer ${rahasia_cron}`) {
      return NextResponse.json({ kesalahan: 'Unauthorized' }, { status: 401 });
    }

    if (!kunci_layanan_supabase_terisi()) {
      return NextResponse.json(
        { kesalahan: 'SUPABASE_SERVICE_ROLE_KEY belum diatur untuk cron batch.' },
        { status: 500 },
      );
    }

    const supabase = buat_klien_supabase_admin();

    let baris_obat: Array<{ user_id: string | null }> | null = null;
    try {
      const { data, error } = await supabase.from('medications').select('user_id');
      if (error) {
        return NextResponse.json(
          { kesalahan: `Gagal memuat daftar user cron: ${error.message}` },
          { status: 500 },
        );
      }
      baris_obat = data;
    } catch (galat_supabase) {
      const pesan_galat =
        galat_supabase instanceof Error ? galat_supabase.message : String(galat_supabase);
      return NextResponse.json(
        { kesalahan: `Koneksi Supabase gagal saat memuat medications: ${pesan_galat}` },
        { status: 502 },
      );
    }

    const daftar_id_pengguna = Array.from(
      new Set((baris_obat ?? []).map((b) => b.user_id).filter(Boolean)),
    ) as string[];

    const ringkasan: Array<{
      id_pengguna: string;
      berhasil: boolean;
      jumlah_alert_baru?: number;
      pesan?: string;
    }> = [];

    for (const id_pengguna of daftar_id_pengguna) {
      try {
        const hasil = await jalankan_scan_untuk_pengguna({
          supabase,
          id_pengguna,
          jenis_scan: 'cron',
        });
        ringkasan.push({
          id_pengguna,
          berhasil: true,
          jumlah_alert_baru: hasil.jumlah_alert_baru,
        });
      } catch (galat) {
        ringkasan.push({
          id_pengguna,
          berhasil: false,
          pesan: galat instanceof Error ? galat.message : String(galat),
        });
      }
    }

    return NextResponse.json({
      status: 'ok',
      jumlah_pengguna: daftar_id_pengguna.length,
      hasil: ringkasan,
    });
  } catch (galat) {
    const pesan_galat = galat instanceof Error ? galat.message : String(galat);
    return NextResponse.json(
      { kesalahan: `Kegagalan tidak terduga pada endpoint cron: ${pesan_galat}` },
      { status: 500 },
    );
  }
}
