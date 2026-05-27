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

console.log('[run-tests] Parser Nimble + validasi alert lulus.');
console.log(
  '[run-tests] Gunakan Agen Pengujian di AGENTS.md untuk tes perilaku end-to-end.',
);
process.exit(0);
