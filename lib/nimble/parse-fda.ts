import { BATAS_ITEM_TERSTRUKTUR } from '@/lib/nimble/konstanta';
import type { ItemPeringatanFda } from '@/lib/tipe-nimble';

/** Decode entitas HTML sederhana dari RSS atau halaman FDA. */
function decode_entitas_html(teks: string): string {
  return teks
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .trim();
}

/** Ekstrak item dari feed RSS FDA (MedWatch). */
export function parse_rss_fda(xml: string): ItemPeringatanFda[] {
  const item_tercocok = xml.match(/<item[\s\S]*?<\/item>/gi) ?? [];
  const hasil: ItemPeringatanFda[] = [];

  for (const blok of item_tercocok) {
    const judul = decode_entitas_html(blok.match(/<title>([\s\S]*?)<\/title>/i)?.[1] ?? '');
    const url = (blok.match(/<link>([\s\S]*?)<\/link>/i)?.[1] ?? '').trim();
    const tanggal = (blok.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] ?? '').trim();

    if (judul && url) {
      hasil.push({
        judul,
        url,
        tanggal_terbit: tanggal || undefined,
      });
    }

    if (hasil.length >= BATAS_ITEM_TERSTRUKTUR) break;
  }

  return hasil;
}

/**
 * Parse HTML/markdown halaman FDA Drug Safety Communications.
 * Mencari tautan ke artikel /drugs/ dengan teks judul.
 */
export function parse_halaman_fda(konten: string): ItemPeringatanFda[] {
  const hasil: ItemPeringatanFda[] = [];
  const url_sudah = new Set<string>();

  const pola_tautan =
    /href="(\/drugs\/[^"]+|https:\/\/www\.fda\.gov\/drugs\/[^"]+)"[^>]*>([^<]{8,200})<\/a>/gi;

  let cocok: RegExpExecArray | null;
  while ((cocok = pola_tautan.exec(konten)) !== null) {
    const path_atau_url = cocok[1];
    const judul = decode_entitas_html(cocok[2].replace(/\s+/g, ' '));
    const url = path_atau_url.startsWith('http')
      ? path_atau_url
      : `https://www.fda.gov${path_atau_url}`;

    if (url_sudah.has(url) || !judul) continue;
    url_sudah.add(url);

    hasil.push({ judul, url });
    if (hasil.length >= BATAS_ITEM_TERSTRUKTUR) break;
  }

  if (hasil.length === 0) {
    const pola_markdown = /\[([^\]]{8,200})\]\((https:\/\/www\.fda\.gov\/drugs\/[^)]+)\)/gi;
    while ((cocok = pola_markdown.exec(konten)) !== null) {
      const judul = decode_entitas_html(cocok[1].replace(/\s+/g, ' '));
      const url = cocok[2];
      if (url_sudah.has(url)) continue;
      url_sudah.add(url);
      hasil.push({ judul, url });
      if (hasil.length >= BATAS_ITEM_TERSTRUKTUR) break;
    }
  }

  return hasil;
}
