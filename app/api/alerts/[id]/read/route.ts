import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';

/**
 * PATCH — tandai alert milik pengguna sebagai sudah dibaca.
 */
export async function PATCH(
  _permintaan: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;
  const { id } = await params;

  if (!id) {
    return NextResponse.json({ kesalahan: 'Alert id is required.' }, { status: 400 });
  }

  const waktu_dibaca = new Date().toISOString();
  const { data, error } = await supabase
    .from('alerts')
    .update({ read_at: waktu_dibaca })
    .eq('id', id)
    .eq('user_id', pengguna.id)
    .select('id, read_at')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to update alert status.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ kesalahan: 'Alert not found.' }, { status: 404 });
  }

  return NextResponse.json({
    id: data.id,
    read_at: data.read_at,
  });
}
