/**
 * Ekstrak JSON dari teks respons Claude — tangani markdown fence atau teks tambahan.
 */
export function parse_json_dari_teks_model(teks: string): unknown {
  const trimmed = teks.trim();

  const match_fence = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const kandidat = match_fence ? match_fence[1].trim() : trimmed;

  const awal_objek = kandidat.indexOf('{');
  const akhir_objek = kandidat.lastIndexOf('}');
  if (awal_objek === -1 || akhir_objek === -1 || akhir_objek <= awal_objek) {
    throw new Error('Respons model tidak mengandung objek JSON.');
  }

  const potongan_json = kandidat.slice(awal_objek, akhir_objek + 1);
  return JSON.parse(potongan_json) as unknown;
}
