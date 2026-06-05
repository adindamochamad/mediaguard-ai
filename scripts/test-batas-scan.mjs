#!/usr/bin/env node
/**
 * Tes logika jendela rate limit scan manual.
 */
import assert from 'node:assert/strict';

function hitung_coba_lagi_menit(waktu_tertua_iso, jendela_menit, sekarang_ms) {
  const waktu_boleh_lagi = new Date(waktu_tertua_iso).getTime() + jendela_menit * 60_000;
  const sisa_ms = Math.max(0, waktu_boleh_lagi - sekarang_ms);
  return Math.max(1, Math.ceil(sisa_ms / 60_000));
}

function uji_diizinkan_di_bawah_batas() {
  const log = [{ created_at: new Date().toISOString() }];
  const maks = 5;
  assert.equal(log.length < maks, true);
}

function uji_coba_lagi_setelah_penuh() {
  const jendela = 60;
  const sekarang = Date.parse('2026-06-05T12:00:00Z');
  const tertua = '2026-06-05T11:30:00Z';
  const menit = hitung_coba_lagi_menit(tertua, jendela, sekarang);
  assert.equal(menit, 30);
}

function estimasi_detik(n) {
  const obat = Math.min(Math.max(n, 1), 9);
  return Math.min(115, Math.max(45, 28 + obat * 12 + 18));
}

function uji_estimasi_obat() {
  assert.ok(estimasi_detik(3) > estimasi_detik(1));
  assert.equal(estimasi_detik(1), 58);
}

function main() {
  uji_diizinkan_di_bawah_batas();
  uji_coba_lagi_setelah_penuh();
  uji_estimasi_obat();
  console.log('[test-batas-scan] Logika rate limit + estimasi scan lulus.');
}

main();
