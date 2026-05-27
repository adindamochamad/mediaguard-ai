#!/usr/bin/env node
/**
 * Pemeriksaan deterministik struktur MediGuard untuk ci lokal cepat-hackathon.
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const akarProyek = path.join(__dirname, '..');

/** @type {readonly string[]} */
const daftarWajib = [
  'README.md',
  'AGENTS.md',
  '.env.example',
  '.cursor/rules/mediguard-project.mdc',
  '.cursor/rules/mediguard-prompt-ai.mdc',
  'prompts/konstanta-kebijakan.json',
  'prompts/analis-keselamatan-obat.md',
  'prompts/asisten-chat.md',
  'docs/01-CONCEPT.md',
  'docs/02-TECH_STACK.md',
  'docs/03-ARCHITECTURE.md',
  'docs/04-FEATURES.md',
  'docs/05-PITCH.md',
  'docs/06-TIMELINE.md',
  'docs/07-API_INTEGRATIONS.md',
  'docs/08-BUSINESS_MODEL.md',
  'docs/09-UNIQUENESS.md',
  'docs/10-FOLDER-INDEX.md',
  'docs/11-GOVERNANCE.md',
  'docs/12-GIT-PRIVASI.md',
  'scripts/setup-git-hooks.mjs',
  'agents/templates/laporan-pengujian.md',
  'agents/templates/laporan-verifikasi.md',
];

/** Pola kunci nyata (bukan placeholder dokumentasi). */
const polaRahasiaBerbahaya = [
  /\bsk-ant-[a-zA-Z0-9_-]{20,}\b/,
  /\bsk_live_[a-zA-Z0-9]{20,}\b/,
  /BEGIN (RSA |EC)?PRIVATE KEY\b/,
];

/** Ambang keyakinan yang tidak boleh muncul lagi di docs (konflik lama). */
const polaAmbangKonflik = [
  /\b0\.85\b.*confidence/i,
  /above 0\.85 confidence/i,
  /confidence.*0\.85/i,
];

/**
 * @param {string} jalurAbsolut
 * @param {string} relatifUntuklaporan
 */
async function pindaiPolaBahaya(jalurAbsolut, relatifUntuklaporan) {
  /** @type {string[]} */
  const temuan = [];
  const namaBawah = path.basename(jalurAbsolut).toLowerCase();
  const abaikanNama =
    namaBawah === 'verify-project.mjs' ||
    namaBawah === 'run-agents.mjs' ||
    namaBawah === 'post-tool-verify.mjs';

  if (abaikanNama || relatifUntuklaporan.includes(`${path.sep}.git${path.sep}`)) {
    return temuan;
  }

  try {
    const isi = await fs.readFile(jalurAbsolut, 'utf8');
    for (const pola of polaRahasiaBerbahaya) {
      if (pola.test(isi)) {
        temuan.push(`${relatifUntuklaporan}: cocokan pola sensitif (${pola})`);
      }
    }
    if (relatifUntuklaporan.startsWith(`docs${path.sep}`)) {
      for (const pola of polaAmbangKonflik) {
        if (pola.test(isi)) {
          temuan.push(
            `${relatifUntuklaporan}: ambang keyakinan 0.85 masih ada — gunakan 0.75 dari konstanta-kebijakan.json`,
          );
        }
      }
    }
  } catch {
    /* abaikan file non-teks */
  }
  return temuan;
}

async function verifikasiKonstantaKebijakan() {
  /** @type {string[]} */
  const galat = [];
  const lokasi = path.join(akarProyek, 'prompts/konstanta-kebijakan.json');
  try {
    const obj = JSON.parse(await fs.readFile(lokasi, 'utf8'));
    if (obj.ambang_keyakinan_minimum !== 0.75) {
      galat.push(
        `prompts/konstanta-kebijakan.json: ambang_keyakinan_minimum harus 0.75 (ditemukan ${obj.ambang_keyakinan_minimum})`,
      );
    }
  } catch {
    galat.push('prompts/konstanta-kebijakan.json tidak valid.');
  }
  return galat;
}

async function jalanankan() {
  /** @type {string[]} */
  const galat = [];

  for (const rel of daftarWajib) {
    const penuh = path.join(akarProyek, rel);
    try {
      await fs.access(penuh);
    } catch {
      galat.push(`Hilang file wajib: ${rel}`);
    }
  }

  const lokasiPaket = path.join(akarProyek, 'package.json');
  try {
    const paket = JSON.parse(await fs.readFile(lokasiPaket, 'utf8'));
    if (!paket.scripts?.agents || !paket.scripts?.verify) {
      galat.push('package.json: scripts agents/verify wajib ada.');
    }
  } catch {
    galat.push('package.json tidak valid atau hilang.');
  }

  const lokasiHooks = path.join(akarProyek, '.cursor/hooks.json');
  try {
    const objHooks = JSON.parse(await fs.readFile(lokasiHooks, 'utf8'));
    if (!objHooks.hooks?.postToolUse?.length) {
      galat.push('.cursor/hooks.json: postToolUse tidak terkonfigurasi.');
    }
  } catch {
    galat.push('.cursor/hooks.json hilang atau JSON tidak parse.');
  }

  try {
    await fs.access(path.join(akarProyek, '.cursor/hooks/post-tool-verify.mjs'));
  } catch {
    galat.push('.cursor/hooks/post-tool-verify.mjs tidak ditemukan.');
  }

  galat.push(...(await verifikasiKonstantaKebijakan()));

  const daftarAkarnyaUntukdipindai = ['.', '.cursor/rules', 'docs', 'scripts', 'prompts', 'agents'];

  /** @type {string[]} */
  let temuanPolaSeluruh = [];

  async function rekursipindai(relDirSaatIni) {
    const absDir = path.join(akarProyek, relDirSaatIni);
    let entri;
    try {
      entri = await fs.readdir(absDir, { withFileTypes: true });
    } catch {
      return;
    }
    for (const item of entri) {
      if (item.name === 'node_modules' || item.name === '.git') continue;
      const relBaru =
        relDirSaatIni === '.' ? item.name : path.join(relDirSaatIni, item.name);
      if (item.isDirectory()) await rekursipindai(relBaru);
      else {
        temuanPolaSeluruh = temuanPolaSeluruh.concat(
          await pindaiPolaBahaya(path.join(absDir, item.name), relBaru),
        );
      }
    }
  }

  for (const direktoriDasar of daftarAkarnyaUntukdipindai) await rekursipindai(direktoriDasar);

  galat.push(...temuanPolaSeluruh);

  if (galat.length) {
    console.error('verify-project GAGAL:');
    for (const pesan of galat) console.error(` - ${pesan}`);
    process.exit(1);
  }

  console.log('verify-project OK — struktur, konstanta, dan kebijakan MediGuard konsisten.');
  process.exit(0);
}

await jalanankan();
