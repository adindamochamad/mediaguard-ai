import { BATAS_ITEM_TERSTRUKTUR } from '@/lib/nimble/konstanta';
import type { ItemArtikelPubMed } from '@/lib/tipe-nimble';

function decode_entitas_html(teks: string): string {
  return teks
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

/** Ekstrak entri artikel dari HTML hasil pencarian PubMed. */
export function parse_halaman_pubmed(konten: string): ItemArtikelPubMed[] {
  const hasil: ItemArtikelPubMed[] = [];
  const url_sudah = new Set<string>();

  const pola_html =
    /class="docsum-title"[^>]*>\s*<a[^>]+href="(\/[^"]+\/)"[^>]*>([\s\S]*?)<\/a>/gi;

  let cocok: RegExpExecArray | null;
  while ((cocok = pola_html.exec(konten)) !== null) {
    const path = cocok[1];
    const judul = decode_entitas_html(cocok[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' '));
    const url = `https://pubmed.ncbi.nlm.nih.gov${path}`;

    if (!judul || url_sudah.has(url)) continue;
    url_sudah.add(url);
    hasil.push({ judul, url });
    if (hasil.length >= BATAS_ITEM_TERSTRUKTUR) break;
  }

  if (hasil.length === 0) {
    const pola_markdown =
      /\[([^\]]{8,300})\]\((https:\/\/pubmed\.ncbi\.nlm\.nih\.gov\/\d+\/)\)/gi;
    while ((cocok = pola_markdown.exec(konten)) !== null) {
      const judul = decode_entitas_html(cocok[1].replace(/\s+/g, ' '));
      const url = cocok[2];
      if (url_sudah.has(url)) continue;
      url_sudah.add(url);
      hasil.push({ judul, url });
      if (hasil.length >= BATAS_ITEM_TERSTRUKTUR) break;
    }
  }

  for (const artikel of hasil) {
    const id_pmid = artikel.url.match(/\/(\d+)\/?$/)?.[1];
    if (!id_pmid) continue;
    const pola_abstrak = new RegExp(
      `${id_pmid}[\\s\\S]{0,400}?class="docsum-content"[^>]*>([\\s\\S]*?)<\\/div>`,
      'i',
    );
    const abstrak = konten.match(pola_abstrak)?.[1];
    if (abstrak) {
      artikel.cuplikan = decode_entitas_html(abstrak.replace(/<[^>]+>/g, '').slice(0, 300));
    }
  }

  return hasil;
}
