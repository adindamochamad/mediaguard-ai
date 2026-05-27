import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { validasi_input_obat_buat } from '@/lib/validasi-obat';

/** GET — daftar obat milik pengguna yang sedang login. */
export async function GET() {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;

  const { data, error } = await supabase
    .from('medications')
    .select('id, user_id, brand_name, generic_name, dosage, condition_note, created_at')
    .eq('user_id', pengguna.id)
    .order('created_at', { ascending: false });

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to load medications.' }, { status: 500 });
  }

  return NextResponse.json({ obat: data ?? [] });
}

/** POST — tambah obat baru ke profil pengguna. */
export async function POST(permintaan: NextRequest) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;

  let body: unknown;
  try {
    body = await permintaan.json();
  } catch {
    return NextResponse.json({ kesalahan: 'Invalid JSON body.' }, { status: 400 });
  }

  const hasil_validasi = validasi_input_obat_buat(body);
  if (!hasil_validasi.valid) {
    return NextResponse.json({ kesalahan: hasil_validasi.pesan }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('medications')
    .insert({
      user_id: pengguna.id,
      brand_name: hasil_validasi.data.brand_name,
      generic_name: hasil_validasi.data.generic_name ?? null,
      dosage: hasil_validasi.data.dosage ?? null,
      condition_note: hasil_validasi.data.condition_note ?? null,
    })
    .select('id, user_id, brand_name, generic_name, dosage, condition_note, created_at')
    .single();

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to save medication.' }, { status: 500 });
  }

  return NextResponse.json({ obat: data }, { status: 201 });
}
