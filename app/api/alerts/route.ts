import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';

/**
 * GET — daftar alert pengguna (urut terbaru).
 * Query: limit (default 20, max 50)
 */
export async function GET(permintaan: NextRequest) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  const { supabase, pengguna } = hasil_auth;
  const params = permintaan.nextUrl.searchParams;
  const limit_mentah = Number(params.get('limit') ?? '20');
  const limit = Number.isFinite(limit_mentah)
    ? Math.min(Math.max(1, Math.floor(limit_mentah)), 50)
    : 20;

  const { data, error } = await supabase
    .from('alerts')
    .select(
      'id, user_id, medication_id, severity, title, summary, source_url, source_type, ai_confidence, read_at, user_helpful, feedback_at, created_at',
    )
    .eq('user_id', pengguna.id)
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    return NextResponse.json({ kesalahan: 'Failed to load alerts.' }, { status: 500 });
  }

  const { data: log_terakhir } = await supabase
    .from('scan_logs')
    .select('created_at, alerts_generated, sources_crawled, duration_ms')
    .eq('user_id', pengguna.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    alerts: data ?? [],
    scan_terakhir: log_terakhir ?? null,
  });
}
