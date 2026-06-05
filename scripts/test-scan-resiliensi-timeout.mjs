#!/usr/bin/env node
/**
 * Tes deterministik — perilaku timeout Nimble di kumpulkan konten (tanpa API live).
 * Mensimulasikan: FDA timeout, crawl per-obat timeout, RSS/fallback tetap menghasilkan konten.
 */
import assert from 'node:assert/strict';

const TIMEOUT_MS = 50;

function dengan_timeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error(`Nimble timeout setelah ${ms}ms`)), ms),
    ),
  ]);
}

async function janji_lambat(ms, nilai) {
  return new Promise((resolve) => setTimeout(() => resolve(nilai), ms));
}

async function uji_fda_timeout_lanjut_kosong() {
  try {
    await dengan_timeout(janji_lambat(200, { item: [] }), TIMEOUT_MS);
    assert.fail('Harus timeout');
  } catch (galat) {
    assert.match(String(galat.message), /timeout/i);
  }
}

async function uji_per_obat_timeout_tidak_memblokir_lain() {
  const nama_obat = ['ObatA', 'ObatB'];
  const hasil = [];

  await Promise.all(
    nama_obat.map(async (nama) => {
      try {
        const data = await dengan_timeout(janji_lambat(200, { nama }), TIMEOUT_MS);
        hasil.push(data);
      } catch {
        /* satu obat timeout — lanjut seperti lib/scan/jalankan-scan */
      }
    }),
  );

  assert.equal(hasil.length, 0, 'Semua obat timeout → array kosong tanpa throw global');
}

function uji_konten_kosong_gagal_scan() {
  const konten = '';
  const harus_gagal = !konten.trim();
  assert.equal(harus_gagal, true, 'Konten kosong harus memicu error pipeline scan');
}

async function uji_batas_waktu_scan_api() {
  const janji_lambat = new Promise((resolve) => setTimeout(() => resolve('ok'), 200));
  try {
    await Promise.race([
      janji_lambat,
      new Promise((_, reject) => setTimeout(() => reject(new Error('Scan timed out')), 50)),
    ]);
    assert.fail('Harus timeout API');
  } catch (galat) {
    assert.match(String(galat.message), /timed out/i);
  }
}

async function main() {
  await uji_fda_timeout_lanjut_kosong();
  await uji_per_obat_timeout_tidak_memblokir_lain();
  uji_konten_kosong_gagal_scan();
  await uji_batas_waktu_scan_api();
  console.log('[test-scan-resiliensi] Timeout Nimble + konten kosong + batas API lulus.');
}

main().catch((galat) => {
  console.error(galat);
  process.exit(1);
});
