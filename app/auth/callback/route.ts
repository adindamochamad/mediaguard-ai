import { NextResponse } from 'next/server';
import { buat_klien_supabase_server } from '@/lib/supabase/server';

/**
 * Callback OAuth / magic link Supabase — tukar code menjadi sesi cookie.
 */
export async function GET(permintaan: Request) {
  const url = new URL(permintaan.url);
  const kode = url.searchParams.get('code');
  const redirect_to = url.searchParams.get('redirectTo') ?? '/dashboard';

  if (kode) {
    const supabase = await buat_klien_supabase_server();
    const { error } = await supabase.auth.exchangeCodeForSession(kode);

    if (!error) {
      return NextResponse.redirect(new URL(redirect_to, url.origin));
    }
  }

  const url_gagal = new URL('/login', url.origin);
  url_gagal.searchParams.set('error', 'auth_callback_failed');
  return NextResponse.redirect(url_gagal);
}
