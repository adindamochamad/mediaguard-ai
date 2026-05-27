import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * GET — cek koneksi ke Supabase (tanpa cookie; pakai kunci anonim).
 * Berguna untuk Day 1: pastikan env + migrasi SQL sudah jalan.
 */
export async function GET() {
  const url_supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const kunci_anonim = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url_supabase || !kunci_anonim) {
    return NextResponse.json(
      {
        status_database: 'env_belum_lengkap',
        pesan:
          'Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart npm run dev.',
        hint_dashboard:
          'Supabase → Project Settings → API: copy Project URL and Publishable (anon) key.',
      },
      { status: 503 },
    );
  }

  const klien = createClient(url_supabase, kunci_anonim);
  const { error } = await klien.from('medications').select('id').limit(1);

  if (error) {
    return NextResponse.json(
      {
        status_database: 'gagal',
        pesan_ringkas: error.message,
        hint: 'Run SQL in supabase/migrations/ via Supabase SQL Editor or supabase db push',
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    status_database: 'terhubung',
    pesan: 'medications table is reachable (RLS may limit anonymous rows — expected).',
  });
}
