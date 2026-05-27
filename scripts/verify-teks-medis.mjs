#!/usr/bin/env node
/**
 * Pindai teks UI/email/template untuk frasa berisiko (bukan diagnosis, bukan perintah berhenti obat).
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const akarProyek = path.join(__dirname, '..');

/** @type {{ pola: RegExp; pesan: string }[]} */
const frasaBerisiko = [
  { pola: /\bstop taking\b/i, pesan: 'Hindari "stop taking" tanpa konsultasi dokter' },
  { pola: /\byou have\b.*\b(cancer|diabetes type)\b/i, pesan: 'Hindari diagnosis langsung ke pengguna' },
  { pola: /\btake \d+\s*mg\b/i, pesan: 'Hindari instruksi dosis spesifik' },
  { pola: /\bnot a substitute for professional medical advice\b/i, pesan: null },
];

const ekstensiTarget = new Set(['.tsx', '.ts', '.jsx', '.js', '.md']);

async function jalanankan() {
  /** @type {string[]} */
  const temuan = [];
  const folderKode = ['app', 'components', 'emails', 'lib'];

  for (const folder of folderKode) {
    const abs = path.join(akarProyek, folder);
    try {
      await fs.access(abs);
    } catch {
      continue;
    }
    await pindaiFolder(abs, folder, temuan);
  }

  const yangBerat = temuan.filter((t) => !t.includes('disclaimer'));
  if (yangBerat.length) {
    console.error('verify-teks-medis GAGAL:');
    for (const t of yangBerat) console.error(` - ${t}`);
    process.exit(1);
  }

  if (temuan.length === 0) {
    console.log('verify-teks-medis OK — tidak ada folder kode atau tidak ada temuan.');
  } else {
    console.log('verify-teks-medis OK — disclaimer medis terdeteksi di kode.');
  }
  process.exit(0);
}

/**
 * @param {string} absDir
 * @param {string} relPrefix
 * @param {string[]} temuan
 */
async function pindaiFolder(absDir, relPrefix, temuan) {
  const entri = await fs.readdir(absDir, { withFileTypes: true });
  for (const item of entri) {
    const rel = path.join(relPrefix, item.name);
    const penuh = path.join(absDir, item.name);
    if (item.isDirectory()) await pindaiFolder(penuh, rel, temuan);
    else if (ekstensiTarget.has(path.extname(item.name))) {
      const isi = await fs.readFile(penuh, 'utf8');
      for (const { pola, pesan } of frasaBerisiko) {
        if (pola.test(isi)) {
          if (pesan === null) continue;
          temuan.push(`${rel}: ${pesan}`);
        }
      }
    }
  }
}

await jalanankan();
