import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Segarkan sesi Supabase di middleware agar cookie JWT tetap valid.
 */
export async function perbarui_sesi_supabase(permintaan: NextRequest) {
  let respons = NextResponse.next({ request: permintaan });

  const url_supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const kunci_anonim = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url_supabase || !kunci_anonim) {
    return { respons, pengguna: null };
  }

  const supabase = createServerClient(url_supabase, kunci_anonim, {
    cookies: {
      getAll() {
        return permintaan.cookies.getAll();
      },
      setAll(array_kuki: { name: string; value: string; options?: object }[]) {
        array_kuki.forEach(({ name, value }) => permintaan.cookies.set(name, value));
        respons = NextResponse.next({ request: permintaan });
        array_kuki.forEach(({ name, value, options }) =>
          respons.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user: pengguna },
  } = await supabase.auth.getUser();

  return { respons, pengguna };
}
