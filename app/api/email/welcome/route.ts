import { NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { kirim_email_selamat_datang } from '@/lib/email';

/**
 * POST — kirim email selamat datang (sekali setelah signup dengan sesi aktif).
 */
export async function POST() {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const email = hasil_auth.pengguna.email?.trim();
  if (!email) {
    return NextResponse.json({ kesalahan: 'Email pengguna tidak ditemukan.' }, { status: 400 });
  }

  try {
    const hasil = await kirim_email_selamat_datang(email);
    return NextResponse.json({
      status: hasil.terkirim ? 'terkirim' : 'dilewati',
      email,
      pesan: hasil.pesan,
    });
  } catch (e) {
    const pesan = e instanceof Error ? e.message : String(e);
    console.error('[email/welcome] crash:', pesan);
    return NextResponse.json({ kesalahan: pesan }, { status: 500 });
  }
}
