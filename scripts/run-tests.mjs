#!/usr/bin/env node
/**
 * Rangka tes otomatis — parser Nimble (Hari 4) + placeholder suite penuh.
 */
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const skrip_parse = path.join(__dirname, 'test-nimble-parse.mjs');

const hasil_parse = spawnSync(process.execPath, [skrip_parse], { stdio: 'inherit' });
if (hasil_parse.status !== 0) {
  process.exit(hasil_parse.status ?? 1);
}

const skrip_validasi = path.join(__dirname, 'test-validasi-alert.mjs');
const hasil_validasi = spawnSync(process.execPath, [skrip_validasi], { stdio: 'inherit' });
if (hasil_validasi.status !== 0) {
  process.exit(hasil_validasi.status ?? 1);
}

const skrip_dedup = path.join(__dirname, 'test-deduplikasi-alert.mjs');
const hasil_dedup = spawnSync(process.execPath, [skrip_dedup], { stdio: 'inherit' });
if (hasil_dedup.status !== 0) {
  process.exit(hasil_dedup.status ?? 1);
}

const skrip_resiliensi = path.join(__dirname, 'test-scan-resiliensi-timeout.mjs');
const hasil_resiliensi = spawnSync(process.execPath, [skrip_resiliensi], { stdio: 'inherit' });
if (hasil_resiliensi.status !== 0) {
  process.exit(hasil_resiliensi.status ?? 1);
}

const skrip_retry = path.join(__dirname, 'test-nimble-retry.mjs');
const hasil_retry = spawnSync(process.execPath, [skrip_retry], { stdio: 'inherit' });
if (hasil_retry.status !== 0) {
  process.exit(hasil_retry.status ?? 1);
}

const skrip_feedback = path.join(__dirname, 'test-validasi-feedback-alert.mjs');
const hasil_feedback = spawnSync(process.execPath, [skrip_feedback], { stdio: 'inherit' });
if (hasil_feedback.status !== 0) {
  process.exit(hasil_feedback.status ?? 1);
}

const skrip_perkiraan = path.join(__dirname, 'test-perkiraan-obat-scan.mjs');
const hasil_perkiraan = spawnSync(process.execPath, [skrip_perkiraan], { stdio: 'inherit' });
if (hasil_perkiraan.status !== 0) {
  process.exit(hasil_perkiraan.status ?? 1);
}

const skrip_batas = path.join(__dirname, 'test-batas-scan.mjs');
const hasil_batas = spawnSync(process.execPath, [skrip_batas], { stdio: 'inherit' });
if (hasil_batas.status !== 0) {
  process.exit(hasil_batas.status ?? 1);
}

console.log('[run-tests] Parser Nimble + validasi alert + deduplikasi + resiliensi + retry + batas scan lulus.');
console.log(
  '[run-tests] Gunakan Agen Pengujian di AGENTS.md untuk tes perilaku end-to-end.',
);
process.exit(0);
