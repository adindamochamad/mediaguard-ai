#!/usr/bin/env node
/**
 * Mengaktifkan hook Git proyek (privasi push). Jalankan sekali setelah git init / clone.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const akarRepo = path.join(__dirname, '..');
const folderGithooks = path.join(akarRepo, '.githooks');

const hookDefs = [
  { nama: 'pre-commit', skrip: 'pre-commit.mjs' },
  { nama: 'commit-msg', skrip: 'commit-msg.mjs' },
  { nama: 'pre-push', skrip: 'pre-push.mjs' },
];

if (!fs.existsSync(path.join(akarRepo, '.git'))) {
  console.log('Belum ada repositori Git — menjalankan git init...');
  const init = spawnSync('git', ['init'], { cwd: akarRepo, stdio: 'inherit' });
  if (init.status !== 0) process.exit(init.status ?? 1);
}

fs.mkdirSync(folderGithooks, { recursive: true });

for (const { nama, skrip } of hookDefs) {
  const jalurHook = path.join(folderGithooks, nama);
  const isi = `#!/bin/sh
cd "$(git rev-parse --show-toplevel)" || exit 1
exec node "scripts/git-hooks/${skrip}" "$@"
`;
  fs.writeFileSync(jalurHook, isi, { mode: 0o755 });
}

const setPath = spawnSync('git', ['config', 'core.hooksPath', '.githooks'], {
  cwd: akarRepo,
  encoding: 'utf8',
});

if (setPath.status !== 0) {
  console.error('Gagal set core.hooksPath:', setPath.stderr);
  process.exit(1);
}

console.log('✓ Hook Git aktif: .githooks → pre-commit, commit-msg, pre-push');
console.log('  • commit-msg: hapus Co-Author & catatan agen dari pesan');
console.log('  • pre-commit / pre-push: blokir .env & pola kunci');
console.log('');
console.log('Set identitas commit (sekali per mesin, ganti dengan data Anda):');
console.log('  git config user.name "Nama Anda"');
console.log('  git config user.email "email@github Anda"');
