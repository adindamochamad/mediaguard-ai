import { createClient, type SupabaseClient } from '@supabase/supabase-js';

/**
 * Klien Supabase dengan service role — hanya server (cron, batch scan).
 * Melewati RLS; jangan ekspos ke klien browser.
 */
export function buat_klien_supabase_admin(): SupabaseClient {
  const url_supabase = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const kunci_layanan = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!url_supabase || !kunci_layanan) {
    throw new Error(
      'Supabase admin: atur NEXT_PUBLIC_SUPABASE_URL dan SUPABASE_SERVICE_ROLE_KEY di .env.local',
    );
  }

  return createClient(url_supabase, kunci_layanan, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export function kunci_layanan_supabase_terisi(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}
