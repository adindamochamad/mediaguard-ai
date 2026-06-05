#!/usr/bin/env node
/**
 * Tes deterministik — retry Nimble dengan backoff linear.
 */
import assert from 'node:assert/strict';

async function jalankan_dengan_retry(operasi, opsi = {}) {
  const maks_percobaan = opsi.maks_percobaan ?? 2;
  const jeda_dasar_ms = opsi.jeda_dasar_ms ?? 10;
  let galat_terakhir;

  for (let percobaan = 0; percobaan < maks_percobaan; percobaan++) {
    try {
      return await operasi(percobaan);
    } catch (galat) {
      galat_terakhir = galat;
      if (percobaan >= maks_percobaan - 1) break;
      await new Promise((r) => setTimeout(r, jeda_dasar_ms * (percobaan + 1)));
    }
  }

  if (galat_terakhir instanceof Error) throw galat_terakhir;
  throw new Error('Percobaan habis');
}

async function uji_berhasil_percobaan_kedua() {
  let panggilan = 0;
  const hasil = await jalankan_dengan_retry(async () => {
    panggilan += 1;
    if (panggilan < 2) throw new Error('network blip');
    return 'ok';
  });
  assert.equal(hasil, 'ok');
  assert.equal(panggilan, 2);
}

async function uji_gagal_setelah_maks() {
  let panggilan = 0;
  try {
    await jalankan_dengan_retry(async () => {
      panggilan += 1;
      throw new Error('persistent fail');
    });
    assert.fail('Harus throw');
  } catch (galat) {
    assert.equal(panggilan, 2);
    assert.match(String(galat.message), /persistent/);
  }
}

async function main() {
  await uji_berhasil_percobaan_kedua();
  await uji_gagal_setelah_maks();
  console.log('[test-nimble-retry] Retry + backoff lulus.');
}

main().catch((galat) => {
  console.error(galat);
  process.exit(1);
});
