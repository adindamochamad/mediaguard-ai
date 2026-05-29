import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';

/** DELETE — cabut akses karegiver. */
export async function DELETE(
  _permintaan: NextRequest,
  { params }: { params: { id: string } },
) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;
  const { id } = params;

  const { error } = await supabase
    .from('caregiver_access')
    .delete()
    .eq('id', id)
    .eq('owner_id', pengguna.id);

  if (error) {
    return NextResponse.json({ kesalahan: error.message }, { status: 500 });
  }

  return NextResponse.json({ status: 'dicabut' });
}
