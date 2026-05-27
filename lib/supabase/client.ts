import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase untuk komponen klien (butuh NEXT_PUBLIC_* di .env.local).
 */
export function buat_klien_supabase_peramban() {
  const url_supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunci_anonim = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url_supabase || !kunci_anonim) {
    throw new Error(
      'Supabase: atur NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local',
    );
  }

  return createBrowserClient(url_supabase, kunci_anonim);
}
