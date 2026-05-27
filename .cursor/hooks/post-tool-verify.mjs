#!/usr/bin/env node
/**
 * Hook pasca penyuntingan: menjalankan verifikasi MediGuard cepat untuk konteks tambahan bagi agen utama.
 */

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function bacaMasukanPenuh() {
  /** @type {Buffer[]} */
  const potong = [];
  for await (const c of process.stdin) potong.push(c);
  return Buffer.concat(potong).toString('utf8').trim();
}

let masukanMentah = '';
try {
  masukanMentah = await bacaMasukanPenuh();
} catch {
  masukanMentah = '{}';
}

let masukanParsed = {};
try {
  masukanParsed = masukanMentah ? JSON.parse(masukanMentah) : {};
} catch {
  masukanParsed = {};
}

// __dirname = .../mediguard-ai/.cursor/hooks → dua tingkat = akar repositori
const akarRepo = path.join(__dirname, '..', '..');
const hasil = spawnSync(process.execPath, ['scripts/run-agents.mjs'], {
  cwd: akarRepo,
  encoding: 'utf8',
  stdio: ['ignore', 'pipe', 'pipe'],
});

const gabunganStdout = `${hasil.stdout || ''}`.trim();
const gabunganStderr = `${hasil.stderr || ''}`.trim();
const teksGabungan =
  gabunganStdout || gabunganStderr
    ? [gabunganStdout, gabunganStderr].filter(Boolean).join('\n')
    : `(tanpa output; keluar=${hasil.status ?? 'unknown'})`;

const statusKeluarRingkas = hasil.status === 0 ? 'BERHASIL' : 'GAGAL';

/** @see Cursor hook postToolUse — menyuntik konteks bagi agen utama lokal */
const additional_context = [
  '[Hooks MediGuard] Pemeriksaan otomatis pasca penyuntingan (npm run agents).',
  `Status agregasi: ${statusKeluarRingkas}.`,
  '--- keluar skrip ---',
  teksGabungan.slice(0, 12_000),
  '--- serpihan stdin hook (dibatasi) ---',
  JSON.stringify(masukanParsed).slice(0, 2_000),
].join('\n');

process.stdout.write(
  `${JSON.stringify({ additional_context })}\n`,
);

process.exit(0);
