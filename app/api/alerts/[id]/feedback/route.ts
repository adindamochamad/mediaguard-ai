import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { id_obat_valid } from '@/lib/validasi-obat';
import { validasi_body_feedback_alert } from '@/lib/validasi-feedback-alert';

/**
 * POST — simpan feedback relevansi alert (helpful: true | false).
 */
export async function POST(
  permintaan: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;
  const { id } = await params;

  if (!id || !id_obat_valid(id)) {
    return NextResponse.json({ kesalahan: 'Invalid alert id.' }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await permintaan.json();
  } catch {
    return NextResponse.json({ kesalahan: 'Invalid JSON body.' }, { status: 400 });
  }

  const hasil_validasi = validasi_body_feedback_alert(body);
  if (!hasil_validasi.valid) {
    return NextResponse.json({ kesalahan: hasil_validasi.pesan }, { status: 400 });
  }

  const waktu_feedback = new Date().toISOString();
  const { data, error } = await supabase
    .from('alerts')
    .update({
      user_helpful: hasil_validasi.data.helpful,
      feedback_at: waktu_feedback,
    })
    .eq('id', id)
    .eq('user_id', pengguna.id)
    .select('id, user_helpful, feedback_at')
    .maybeSingle();

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to save feedback.' }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ kesalahan: 'Alert not found.' }, { status: 404 });
  }

  return NextResponse.json({
    status: 'tersimpan',
    id: data.id,
    user_helpful: data.user_helpful,
    feedback_at: data.feedback_at,
  });
}
