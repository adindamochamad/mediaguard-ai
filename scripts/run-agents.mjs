#!/usr/bin/env node
/**
 * Menjalankan agen-deterministik: verifikasi + rangka tes.
 * Persona Composer tambahan dokumentasi ada di AGENTS.md.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const akarProyek = path.join(__dirname, '..');

/** @param {string} skripRelatif */

function jalankan(skripRelatif) {
  return spawnSync(process.execPath, [path.join(akarProyek, skripRelatif)], {
    cwd: akarProyek,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

console.log('');
console.log('=== MediGuard AI — jalankan agents (otomatis) ===');
console.log('');

const keluar_verify = jalankan('scripts/verify-project.mjs');
console.log('[verify-project] keluar=', keluar_verify.status ?? 'unknown');
console.log((keluar_verify.stdout || '').trimEnd());
console.log((keluar_verify.stderr || '').trimEnd());

const keluar_teks = jalankan('scripts/verify-teks-medis.mjs');
console.log('');
console.log('[verify-teks-medis] keluar=', keluar_teks.status ?? 'unknown');
console.log((keluar_teks.stdout || '').trimEnd());

const keluar_test = jalankan('scripts/run-tests.mjs');
console.log('');
console.log('[run-tests] keluar=', keluar_test.status ?? 'unknown');
console.log((keluar_test.stdout || '').trimEnd());

const kodeGabungan =
  (keluar_verify.status ?? 1) !== 0 ||
  (keluar_teks.status ?? 1) !== 0 ||
  (keluar_test.status ?? 1) !== 0
    ? 1
    : 0;

console.log('');
if (kodeGabungan !== 0) {
  console.log('RINGKASAN agents: ADA KEGAGALAN — perbaiki sebelum lanjut.');
} else {
  console.log(
    'RINGKASAN agents: lulus otomatis. Lanjut manfaatkan Agen Pengujian & Verifikasi di AGENTS.md.',
  );
}

process.exit(kodeGabungan);
