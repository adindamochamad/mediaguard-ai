import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { kirim_undangan_karegiver } from '@/lib/email';

/** GET — daftar karegiver milik user yang sedang login. */
export async function GET() {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;

  const { data, error } = await supabase
    .from('caregiver_access')
    .select('id, caregiver_email, access_level, invited_at, accepted_at')
    .eq('owner_id', pengguna.id)
    .order('invited_at', { ascending: false });

  if (error) {
    return NextResponse.json({ kesalahan: error.message }, { status: 500 });
  }

  return NextResponse.json({ caregivers: data ?? [] });
}

/** POST — undang karegiver baru via email. */
export async function POST(permintaan: NextRequest) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;

  let body: unknown;
  try {
    body = await permintaan.json();
  } catch {
    return NextResponse.json({ kesalahan: 'Request body tidak valid.' }, { status: 400 });
  }

  const email = (body as Record<string, unknown>)?.email;
  if (typeof email !== 'string' || !email.trim() || !email.includes('@')) {
    return NextResponse.json({ kesalahan: 'Email karegiver tidak valid.' }, { status: 400 });
  }

  const email_bersih = email.trim().toLowerCase();
  const email_pemilik = pengguna.email?.trim() ?? '';

  if (email_bersih === email_pemilik.toLowerCase()) {
    return NextResponse.json(
      { kesalahan: 'Tidak bisa mengundang diri sendiri sebagai karegiver.' },
      { status: 400 },
    );
  }

  const { data: sudah_ada } = await supabase
    .from('caregiver_access')
    .select('id')
    .eq('owner_id', pengguna.id)
    .eq('caregiver_email', email_bersih)
    .maybeSingle();

  if (sudah_ada) {
    return NextResponse.json(
      { kesalahan: 'Karegiver dengan email ini sudah diundang.' },
      { status: 409 },
    );
  }

  const { data: baris_baru, error: galat_insert } = await supabase
    .from('caregiver_access')
    .insert({ owner_id: pengguna.id, caregiver_email: email_bersih })
    .select('id, caregiver_email, access_level, invited_at, accepted_at')
    .single();

  if (galat_insert || !baris_baru) {
    return NextResponse.json(
      { kesalahan: galat_insert?.message ?? 'Gagal menyimpan karegiver.' },
      { status: 500 },
    );
  }

  await kirim_undangan_karegiver({
    email_penerima: email_bersih,
    email_pemilik,
    token: baris_baru.id,
  });

  return NextResponse.json({ caregiver: baris_baru }, { status: 201 });
}
