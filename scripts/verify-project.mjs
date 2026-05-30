#!/usr/bin/env node
/**
 * Pemeriksaan deterministik — file publik di Git vs dokumentasi lokal.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const akarProyek = path.join(__dirname, '..');

/** File yang wajib ada di repo publik GitHub. */
const daftarWajibPublik = [
  'README.md',
  'REPO-PUBLIK.md',
  '.env.example',
  '.cursor/rules/mediguard-project.mdc',
  '.cursor/rules/mediguard-prompt-ai.mdc',
  '.cursor/rules/mediguard-api.mdc',
  'scripts/setup-git-hooks.mjs',
  'scripts/run-agents.mjs',
  'package.json',
  'next.config.mjs',
  'app/layout.tsx',
  'vercel.json',
  'supabase/migrations/001_schema_rls.sql',
  'supabase/README.md',
  'DEPLOY.md',
];

/** File strategi — wajib di mesin lokal, tidak di remote. */
const daftarWajibLokal = [
  'AGENTS.md',
  'docs/01-CONCEPT.md',
  'docs/04-FEATURES.md',
  'docs/05-PITCH.md',
  'docs/08-MANUAL-TESTING.md',
  'prompts/konstanta-kebijakan.json',
];

const polaRahasiaBerbahaya = [
  /\bsk-ant-[a-zA-Z0-9_-]{20,}\b/,
  /\bsk_live_[a-zA-Z0-9]{20,}\b/,
  /BEGIN (RSA |EC)?PRIVATE KEY/,
];

const prefixAmanContoh = ['docs/', 'prompts/', 'agents/templates/', '.env.example'];

async function pindaiPolaBahaya(jalurAbsolut, relatifUntuklaporan) {
  const temuan = [];
  const namaBawah = path.basename(jalurAbsolut).toLowerCase();
  if (
    namaBawah === 'verify-project.mjs' ||
    namaBawah === 'run-agents.mjs' ||
    namaBawah === 'post-tool-verify.mjs' ||
    namaBawah === '.env.local' ||
    namaBawah === '.env'
  ) {
    return temuan;
  }
  if (prefixAmanContoh.some((p) => relatifUntuklaporan.startsWith(p))) return temuan;

  try {
    const isi = await fs.readFile(jalurAbsolut, 'utf8');
    for (const pola of polaRahasiaBerbahaya) {
      if (pola.test(isi)) temuan.push(`${relatifUntuklaporan}: pola sensitif (${pola})`);
    }
  } catch {
    /* skip */
  }
  return temuan;
}

async function jalanankan() {
  const galat = [];
  const peringatan = [];

  for (const rel of daftarWajibPublik) {
    try {
      await fs.access(path.join(akarProyek, rel));
    } catch {
      galat.push(`Hilang file publik wajib: ${rel}`);
    }
  }

  for (const rel of daftarWajibLokal) {
    try {
      await fs.access(path.join(akarProyek, rel));
    } catch {
      peringatan.push(`Lokal (tidak di-push): ${rel} belum ada di mesin ini`);
    }
  }

  try {
    const paket = JSON.parse(await fs.readFile(path.join(akarProyek, 'package.json'), 'utf8'));
    if (!paket.scripts?.agents) galat.push('package.json: script agents wajib ada.');
  } catch {
    galat.push('package.json tidak valid.');
  }

  try {
    const objHooks = JSON.parse(
      await fs.readFile(path.join(akarProyek, '.cursor/hooks.json'), 'utf8'),
    );
    if (!objHooks.hooks?.postToolUse?.length) {
      galat.push('.cursor/hooks.json: postToolUse tidak terkonfigurasi.');
    }
  } catch {
    galat.push('.cursor/hooks.json hilang atau tidak valid.');
  }

  const daftarPindai = ['.', 'scripts', '.cursor/rules'];
  let temuanPola = [];
  async function rekursipindai(relDir) {
    const absDir = path.join(akarProyek, relDir);
    let entri;
    try {
      entri = await fs.readdir(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of entri) {
      if (
        item.name === 'node_modules' ||
        item.name === '.git' ||
        item.name === 'docs' ||
        item.name === 'prompts' ||
        item.name === 'agents'
      ) {
        continue;
      }
      const relBaru = relDir === '.' ? item.name : path.join(relDir, item.name);
      if (item.isDirectory()) await rekursipindai(relBaru);
      else {
        temuanPola = temuanPola.concat(await pindaiPolaBahaya(path.join(absDir, item.name), relBaru));
      }
    }
  }
  for (const d of daftarPindai) await rekursipindai(d);
  galat.push(...temuanPola);

  if (peringatan.length) {
    console.warn('verify-project peringatan (lokal):');
    for (const p of peringatan) console.warn(` - ${p}`);
  }

  if (galat.length) {
    console.error('verify-project GAGAL:');
    for (const pesan of galat) console.error(` - ${pesan}`);
    process.exit(1);
  }

  console.log('verify-project OK — repo publik siap; docs/AGENTS hanya lokal.');
  process.exit(0);
}

await jalanankan();
