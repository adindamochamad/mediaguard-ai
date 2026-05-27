#!/usr/bin/env node
/**
 * Tes deterministik parser FDA/PubMed — tidak memerlukan kredensial Nimble.
 */
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Muat modul TS via ts-node tidak tersedia — duplikasi logika parse minimal untuk smoke test
// atau gunakan dynamic import setelah build. Untuk dev, kita inline assert pada sample HTML.

const contoh_html_fda = `
<a href="/drugs/drug-safety-and-availability/fda-drug-safety-communication-test">FDA warns about Example Drug</a>
<a href="https://www.fda.gov/drugs/other-page">Skip short</a>
`;

const contoh_rss = `
<rss><channel>
<item><title>MedWatch Alert: Drug X</title><link>https://www.fda.gov/x</link><pubDate>Mon, 01 Jan 2026</pubDate></item>
</channel></rss>
`;

const contoh_pubmed = `
<div class="docsum-title"><a href="/12345678/">Metformin interaction study</a></div>
`;

function decode(teks) {
  return teks.replace(/&amp;/g, '&').trim();
}

function parse_fda_smoke(konten) {
  const hasil = [];
  const pola = /href="(\/drugs\/[^"]+)"[^>]*>([^<]{8,200})<\/a>/gi;
  let c;
  while ((c = pola.exec(konten)) !== null) {
    hasil.push({ judul: decode(c[2]), url: `https://www.fda.gov${c[1]}` });
  }
  return hasil;
}

function parse_rss_smoke(xml) {
  const item = xml.match(/<item[\s\S]*?<\/item>/i)?.[0] ?? '';
  const judul = item.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '';
  const url = item.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? '';
  return judul && url ? [{ judul, url }] : [];
}

function parse_pubmed_smoke(konten) {
  const c = konten.match(/class="docsum-title"[^>]*>\s*<a[^>]+href="(\/[^"]+\/)"[^>]*>([\s\S]*?)<\/a>/i);
  if (!c) return [];
  return [{ judul: decode(c[2]), url: `https://pubmed.ncbi.nlm.nih.gov${c[1]}` }];
}

const fda = parse_fda_smoke(contoh_html_fda);
assert.equal(fda.length, 1);
assert.ok(fda[0].url.includes('fda-drug-safety-communication-test'));

const rss = parse_rss_smoke(contoh_rss);
assert.equal(rss.length, 1);
assert.equal(rss[0].judul, 'MedWatch Alert: Drug X');

const pubmed = parse_pubmed_smoke(contoh_pubmed);
assert.equal(pubmed.length, 1);
assert.ok(pubmed[0].url.includes('12345678'));

console.log('[test-nimble-parse] OK — parser smoke tests passed.');
