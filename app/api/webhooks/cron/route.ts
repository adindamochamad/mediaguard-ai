import { NextRequest, NextResponse } from 'next/server';

/**
 * Placeholder Hari 6+ — Nimble pipeline. Hari 1: hanya memverifikasi secret.
 */
export async function GET(permintaan: NextRequest) {
  const header_auth = permintaan.headers.get('authorization');
  const rahasia_cron = process.env.CRON_SECRET;

  if (!rahasia_cron) {
    return NextResponse.json({ kesalahan: 'CRON_SECRET belum diatur' }, { status: 500 });
  }

  if (header_auth !== `Bearer ${rahasia_cron}`) {
    return NextResponse.json({ kesalahan: 'Unauthorized' }, { status: 401 });
  }

  return NextResponse.json({ status: 'ok', pesan: 'Webhook cron aktif — pipeline diisi Hari 6+' });
}
