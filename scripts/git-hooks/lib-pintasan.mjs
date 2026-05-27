import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const akarRepo = path.join(__dirname, '..', '..');

/** Nama file yang tidak boleh masuk indeks Git. */
export const namaFileTerlarang = [
  '.env',
  '.env.local',
  '.env.development',
  '.env.production',
  '.env.test',
];

/** Pola isi berbahaya pada file yang di-stage. */
export const polaRahasiaIsi = [
  /\bsk-ant-[a-zA-Z0-9_-]{20,}\b/,
  /\bsk_live_[a-zA-Z0-9]{20,}\b/,
  /\bNIMBLE_PASSWORD\s*=\s*[^\s#]+/i,
  /\bSUPABASE_SERVICE_ROLE_KEY\s*=\s*eyJ[a-zA-Z0-9._-]{20,}/,
  /BEGIN (RSA |EC)?PRIVATE KEY/,
];

/** Baris pesan commit yang dihapus otomatis (Co-Author, catatan agen, dll.). */
export const polaBarisPesanDihapus = [
  /^co-authored-by:/i,
  /^co-?authored-?by:/i,
  /^assisted-by:/i,
  /^generated-by:/i,
  /^signed-off-by:.*cursor/i,
  /^cursor:/i,
  /^catatan:/i,
  /^note:\s*agen/i,
  /^🤖/,
  /^\[cursor\]/i,
  /^via composer/i,
  /^agent:/i,
];

/**
 * @param {string} namaRelatif
 */
export function apakahNamaFileTerlarang(namaRelatif) {
  const dasar = path.basename(namaRelatif);
  if (namaFileTerlarang.includes(dasar)) return true;
  if (/^\.env(\.|$)/.test(dasar) && dasar !== '.env.example') return true;
  if (dasar.endsWith('.pem') || dasar.endsWith('.key')) return true;
  if (/^credentials.*\.json$/i.test(dasar)) return true;
  return false;
}

/**
 * @param {string} isi
 */
export function temukanRahasiaDalamIsi(isi) {
  for (const pola of polaRahasiaIsi) {
    if (pola.test(isi)) return pola;
  }
  return null;
}

/**
 * @param {string} teksPesan
 */
export function bersihkanPesanCommit(teksPesan) {
  const baris = teksPesan.split('\n');
  const hasil = [];
  let dalamBlokCatatanAgen = false;

  for (const barisAsli of baris) {
    const trimmed = barisAsli.trim();

    if (/^---\s*catatan agen\s*---$/i.test(trimmed)) {
      dalamBlokCatatanAgen = true;
      continue;
    }
    if (dalamBlokCatatanAgen && /^---\s*akhir catatan\s*---$/i.test(trimmed)) {
      dalamBlokCatatanAgen = false;
      continue;
    }
    if (dalamBlokCatatanAgen) continue;

    const harusHapus = polaBarisPesanDihapus.some((p) => p.test(barisAsli));
    if (harusHapus) continue;

    hasil.push(barisAsli);
  }

  return hasil.join('\n').replace(/\n{3,}/g, '\n\n').trimEnd() + '\n';
}

/**
 * @param {string[]} daftarBerkasRelatif
 */
export async function periksaBerkasStage(daftarBerkasRelatif) {
  /** @type {string[]} */
  const galat = [];

  for (const rel of daftarBerkasRelatif) {
    if (apakahNamaFileTerlarang(rel)) {
      galat.push(`File terlarang di-stage: ${rel} (env/rahasia tidak boleh di-push)`);
      continue;
    }
    const penuh = path.join(akarRepo, rel);
    let isi;
    try {
      isi = await fs.promises.readFile(penuh, 'utf8');
    } catch {
      continue;
    }
    const pola = temukanRahasiaDalamIsi(isi);
    if (pola) {
      galat.push(`Kemungkinan rahasia di ${rel} (pola: ${pola})`);
    }
  }
  return galat;
}
