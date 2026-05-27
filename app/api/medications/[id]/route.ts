import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { id_obat_valid, validasi_input_obat_ubah } from '@/lib/validasi-obat';

type ParamsRute = { params: { id: string } };

/** PATCH — ubah detail obat (RLS memastikan hanya milik pengguna). */
export async function PATCH(permintaan: NextRequest, { params }: ParamsRute) {
  const { id } = params;

  if (!id_obat_valid(id)) {
    return NextResponse.json({ kesalahan: 'Invalid medication id.' }, { status: 400 });
  }

  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase } = hasil_auth;

  let body: unknown;
  try {
    body = await permintaan.json();
  } catch {
    return NextResponse.json({ kesalahan: 'Invalid JSON body.' }, { status: 400 });
  }

  const hasil_validasi = validasi_input_obat_ubah(body);
  if (!hasil_validasi.valid) {
    return NextResponse.json({ kesalahan: hasil_validasi.pesan }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('medications')
    .update(hasil_validasi.data)
    .eq('id', id)
    .select('id, user_id, brand_name, generic_name, dosage, condition_note, created_at')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to update medication.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ kesalahan: 'Medication not found.' }, { status: 404 });
  }

  return NextResponse.json({ obat: data });
}

/** DELETE — hapus obat dari profil pengguna. */
export async function DELETE(_permintaan: NextRequest, { params }: ParamsRute) {
  const { id } = params;

  if (!id_obat_valid(id)) {
    return NextResponse.json({ kesalahan: 'Invalid medication id.' }, { status: 400 });
  }

  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase } = hasil_auth;

  const { data, error } = await supabase
    .from('medications')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to delete medication.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ kesalahan: 'Medication not found.' }, { status: 404 });
  }

  return NextResponse.json({ sukses: true });
}
