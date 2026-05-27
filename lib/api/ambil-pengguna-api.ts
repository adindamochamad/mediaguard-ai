import { NextResponse } from 'next/server';
import { buat_klien_supabase_server } from '@/lib/supabase/server';
import type { User } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

type HasilAutentikasi =
  | { supabase: SupabaseClient; pengguna: User }
  | { respons_galat: NextResponse };

/**
 * Ambil sesi pengguna untuk Route Handlers — kembalikan 401 bila belum login.
 */
export async function ambil_pengguna_api(): Promise<HasilAutentikasi> {
  const supabase = await buat_klien_supabase_server();
  const {
    data: { user: pengguna },
    error,
  } = await supabase.auth.getUser();

  if (error || !pengguna) {
    return {
      respons_galat: NextResponse.json({ kesalahan: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { supabase, pengguna };
}
