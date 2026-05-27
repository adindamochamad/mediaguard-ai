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

/** Folder/file yang boleh berisi contoh env tanpa dianggap rahasia nyata. */
export const prefixAmanContoh = ['docs/', 'prompts/', 'agents/templates/', '.env.example'];

/** Pola isi berbahaya (nilai env dicek per baris, bukan placeholder docs). */
export const polaRahasiaIsi = [
  /\bsk-ant-[a-zA-Z0-9_-]{20,}\b/,
  /\bsk_live_[a-zA-Z0-9]{20,}\b/,
  /BEGIN (RSA |EC)?PRIVATE KEY/,
];

const polaBarisEnv = [
  /^NIMBLE_PASSWORD\s*=\s*(.+)$/im,
  /^NIMBLE_USERNAME\s*=\s*(.+)$/im,
  /^ANTHROPIC_API_KEY\s*=\s*(.+)$/im,
  /^SUPABASE_SERVICE_ROLE_KEY\s*=\s*(.+)$/im,
  /^RESEND_API_KEY\s*=\s*(.+)$/im,
];

/** Nilai contoh dokumentasi — bukan rahasia produksi. */
const nilaiPlaceholder = new Set([
  '',
  '...',
  'your_password',
  'your_username',
  'sk-ant-...',
  're_...',
  'eyJ...',
  'changeme',
  'xxx',
  'placeholder',
]);

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
 * @param {string} nilai
 */
export function apakahNilaiEnvPlaceholder(nilai) {
  const bersih = nilai.trim().replace(/^['"]|['"]$/g, '');
  if (!bersih) return true;
  if (nilaiPlaceholder.has(bersih)) return true;
  if (/^your_/i.test(bersih)) return true;
  if (/^<[^>]+>$/.test(bersih)) return true;
  if (/^\.\.\.$/.test(bersih)) return true;
  return false;
}

/**
 * @param {string} relPath
 */
export function apakahPathContohDokumentasi(relPath) {
  if (relPath === '.env.example') return true;
  return prefixAmanContoh.some((p) => relPath.startsWith(p));
}

/**
 * @param {string} isi
 * @param {string} [relPath]
 */
export function temukanRahasiaDalamIsi(isi, relPath = '') {
  if (apakahPathContohDokumentasi(relPath)) {
    return null;
  }

  for (const pola of polaRahasiaIsi) {
    if (pola.test(isi)) return pola;
  }

  for (const polaBaris of polaBarisEnv) {
    for (const baris of isi.split('\n')) {
      const cocok = baris.match(polaBaris);
      if (!cocok) continue;
      const nilai = cocok[1].trim();
      if (!apakahNilaiEnvPlaceholder(nilai)) {
        return polaBaris;
      }
    }
  }

  const serviceRole = isi.match(/SUPABASE_SERVICE_ROLE_KEY\s*=\s*(eyJ[a-zA-Z0-9._-]{30,})/);
  if (serviceRole && !apakahNilaiEnvPlaceholder(serviceRole[1])) {
    return /SUPABASE_SERVICE_ROLE_KEY/;
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
    const pola = temukanRahasiaDalamIsi(isi, rel);
    if (pola) {
      galat.push(`Kemungkinan rahasia di ${rel} (pola: ${pola})`);
    }
  }
  return galat;
}
