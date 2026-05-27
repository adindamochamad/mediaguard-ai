import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase untuk Server Components / Route Handlers (ikut cookie sesi).
 */
export async function buat_klien_supabase_server() {
  const penyimpan_kuki = await cookies();

  const url_supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunci_anonim = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url_supabase || !kunci_anonim) {
    throw new Error(
      'Supabase: atur NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY di .env.local',
    );
  }

  return createServerClient(url_supabase, kunci_anonim, {
    cookies: {
      getAll() {
        return penyimpan_kuki.getAll();
      },
      setAll(array_kuki_baru: { name: string; value: string; options?: object }[]) {
        try {
          array_kuki_baru.forEach(({ name, value, options }) =>
            penyimpan_kuki.set(name, value, options),
          );
        } catch {
          /* Server Components terkadang tidak boleh menyet kuki — abaikan */
        }
      },
    },
  });
}
