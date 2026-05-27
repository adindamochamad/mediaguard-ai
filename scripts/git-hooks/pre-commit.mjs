#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { periksaBerkasStage } from './lib-pintasan.mjs';

const hasilGit = spawnSync('git', ['diff', '--cached', '--name-only', '--diff-filter=ACM'], {
  encoding: 'utf8',
});

if (hasilGit.status !== 0) {
  console.error('pre-commit: gagal membaca daftar file staged.');
  process.exit(1);
}

const daftarBerkas = hasilGit.stdout
  .split('\n')
  .map((s) => s.trim())
  .filter(Boolean);

const galat = await periksaBerkasStage(daftarBerkas);

if (galat.length) {
  console.error('\n⛔ pre-commit MediGuard — push dibatalkan demi privasi:\n');
  for (const g of galat) console.error(`  • ${g}`);
  console.error('\nHapus file dari stage: git reset HEAD -- <file>');
  console.error('Pastikan hanya .env.example yang berisi placeholder kosong.\n');
  process.exit(1);
}

process.exit(0);
