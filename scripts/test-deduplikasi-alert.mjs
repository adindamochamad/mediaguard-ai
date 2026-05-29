#!/usr/bin/env node
/**
 * Tes unit deduplikasi URL (Hari 6) — mirror lib/scan/normalisasi-url.ts
 */
function normalisasi_url_sumber(url) {
  try {
    const obj = new URL(url.trim());
    obj.hash = '';
    let jalur = obj.pathname.replace(/\/+$/, '') || '/';
    return `${obj.protocol}//${obj.host.toLowerCase()}${jalur}`;
  } catch {
    return url.trim().toLowerCase();
  }
}

function asert(kondisi, pesan) {
  if (!kondisi) {
    console.error(`[test-deduplikasi] GAGAL: ${pesan}`);
    process.exit(1);
  }
}

const url_a = 'https://www.FDA.gov/drugs/foo/';
const url_b = 'https://www.fda.gov/drugs/foo';
asert(
  normalisasi_url_sumber(url_a) === normalisasi_url_sumber(url_b),
  'URL FDA harus dinormalisasi sama',
);

const url_c = 'https://pubmed.ncbi.nlm.nih.gov/123/?utm=1';
const url_d = 'https://pubmed.ncbi.nlm.nih.gov/123';
asert(
  normalisasi_url_sumber(url_c) === normalisasi_url_sumber(url_d),
  'Query berbeda tetap satu kunci dedup',
);

console.log('[test-deduplikasi] Normalisasi URL lulus.');
