#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { akarRepo, apakahNamaFileTerlarang, temukanRahasiaDalamIsi } from './lib-pintasan.mjs';

/**
 * Memastikan tidak ada file terlacak yang menyerupai env atau berisi pola kunci.
 */
function periksaFileTerlacak() {
  const hasil = spawnSync('git', ['ls-files'], { cwd: akarRepo, encoding: 'utf8' });
  if (hasil.status !== 0) return [];

  /** @type {string[]} */
  const galat = [];
  const daftar = hasil.stdout.split('\n').map((s) => s.trim()).filter(Boolean);

  for (const rel of daftar) {
    if (apakahNamaFileTerlarang(rel)) {
      galat.push(`File terlacak terlarang: ${rel}`);
      continue;
    }
    const penuh = path.join(akarRepo, rel);
    try {
      const isi = fs.readFileSync(penuh, 'utf8');
      const pola = temukanRahasiaDalamIsi(isi);
      if (pola) galat.push(`Rahasia terdeteksi di ${rel}`);
    } catch {
      /* binary / skip */
    }
  }
  return galat;
}

/**
 * Cek commit yang akan di-push tidak menyertakan Co-Author di pesan.
 */
function periksaPesanCommitAkanDipush() {
  const remote = process.argv[2] || 'origin';
  const url = process.argv[3] || '';

  void url;

  const hasilRef = spawnSync('git', ['rev-parse', '--abbrev-ref', '@{u}'], {
    cwd: akarRepo,
    encoding: 'utf8',
  });

  let rentang = 'HEAD';
  if (hasilRef.status === 0 && hasilRef.stdout.trim()) {
    rentang = `${hasilRef.stdout.trim()}..HEAD`;
  } else {
    const cekRemote = spawnSync('git', ['rev-parse', '--verify', `${remote}/main`], {
      cwd: akarRepo,
      encoding: 'utf8',
    });
    if (cekRemote.status === 0) {
      rentang = `${remote}/main..HEAD`;
    }
  }

  const log = spawnSync('git', ['log', rentang, '--format=%H%n%B%n---END---'], {
    cwd: akarRepo,
    encoding: 'utf8',
  });

  if (log.status !== 0 || !log.stdout.trim()) return [];

  /** @type {string[]} */
  const galat = [];
  const blok = log.stdout.split('---END---').filter((b) => b.trim());

  for (const b of blok) {
    const baris = b.split('\n');
    const hash = baris[0]?.trim();
    const badan = baris.slice(1).join('\n');
    if (/co-authored-by:/i.test(badan)) {
      galat.push(
        `Commit ${hash?.slice(0, 7)} masih berisi Co-Author. Amend: git commit --amend lalu commit-msg hook membersihkan.`,
      );
    }
  }
  return galat;
}

const galatTerlacak = periksaFileTerlacak();
const galatPesan = periksaPesanCommitAkanDipush();
const semua = [...galatTerlacak, ...galatPesan];

if (semua.length) {
  console.error('\n⛔ pre-push MediGuard — push dibatalkan:\n');
  for (const g of semua) console.error(`  • ${g}`);
  console.error('\nPerbaiki lalu push lagi. Lihat docs/12-GIT-PRIVASI.md\n');
  process.exit(1);
}

console.log('pre-push: tidak ada env/rahasia terlacak; pesan commit bebas Co-Author.');
process.exit(0);
