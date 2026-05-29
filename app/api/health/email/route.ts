import { NextResponse } from 'next/server';
import { alamat_pengirim } from '@/lib/email/konstanta';
import { kunci_resend_terisi } from '@/lib/email';

/**
 * GET — cek konfigurasi Resend tanpa mengirim email.
 */
export async function GET() {
  if (!kunci_resend_terisi()) {
    return NextResponse.json(
      {
        status_email: 'env_belum_lengkap',
        pesan: 'Atur RESEND_API_KEY di .env.local untuk mengaktifkan email.',
      },
      { status: 503 },
    );
  }

  return NextResponse.json({
    status_email: 'siap',
    pengirim: alamat_pengirim(),
    catatan:
      'Domain pengirim harus terverifikasi di Resend. Dev: gunakan onboarding@resend.dev atau RESEND_FROM.',
  });
}
