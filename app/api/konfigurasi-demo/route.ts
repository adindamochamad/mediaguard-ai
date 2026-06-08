import { NextResponse } from 'next/server';
import { ambil_konfigurasi_mode_demo } from '@/lib/konfigurasi-mode-demo';

/**
 * GET — konfigurasi mode demo hybrid untuk UI klien (tanpa secret).
 * Scan bisa cache; chat tetap live Nimble saat kredensial terisi.
 */
export async function GET() {
  return NextResponse.json(ambil_konfigurasi_mode_demo());
}
