import { type NextRequest, NextResponse } from 'next/server';
import { perbarui_sesi_supabase } from '@/lib/supabase/middleware';

export async function middleware(permintaan: NextRequest) {
  const { respons, pengguna } = await perbarui_sesi_supabase(permintaan);
  const jalur = permintaan.nextUrl.pathname;

  if (jalur.startsWith('/dashboard') && !pengguna) {
    const url_tujuan = permintaan.nextUrl.clone();
    url_tujuan.pathname = '/login';
    url_tujuan.searchParams.set('redirectTo', jalur);
    return NextResponse.redirect(url_tujuan);
  }

  if ((jalur === '/login' || jalur === '/signup') && pengguna) {
    const url_tujuan = permintaan.nextUrl.clone();
    url_tujuan.pathname = '/dashboard';
    url_tujuan.search = '';
    return NextResponse.redirect(url_tujuan);
  }

  return respons;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login', '/signup'],
};
