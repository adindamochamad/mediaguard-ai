import { BATAS_KONTEN_CRAWL_KARAKTER, MODEL_CLAUDE_ANALIS } from '@/lib/claude/konstanta';
import { ambil_klien_claude } from '@/lib/claude/klien';
import { parse_json_dari_teks_model } from '@/lib/claude/parse-json-model';
import { bangun_pesan_pengguna_analisis, PROMPT_SISTEM_ANALIS } from '@/lib/claude/prompt-analis';
import type { KeluaranAnalisisAlert } from '@/lib/tipe-alert';
import { validasi_keluaran_alert } from '@/lib/validasi-alert';

/**
 * Analisis konten crawl + daftar obat → JSON alert tervalidasi (Zod).
 * System prompt di-cache ephemeral untuk mengurangi biaya repeated scans.
 */
export async function analyzeForAlerts(
  konten_crawl: string,
  daftar_obat: string[],
): Promise<KeluaranAnalisisAlert> {
  if (daftar_obat.length === 0) {
    return { alerts: [] };
  }

  const klien = ambil_klien_claude();
  const pesan_pengguna = bangun_pesan_pengguna_analisis(
    daftar_obat,
    konten_crawl,
    BATAS_KONTEN_CRAWL_KARAKTER,
  );

  const respons = await klien.messages.create({
    model: MODEL_CLAUDE_ANALIS,
    max_tokens: 2048,
    system: [
      {
        type: 'text',
        text: PROMPT_SISTEM_ANALIS,
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      {
        role: 'user',
        content: pesan_pengguna,
      },
    ],
  });

  const blok_teks = respons.content.find((blok) => blok.type === 'text');
  if (!blok_teks || blok_teks.type !== 'text') {
    throw new Error('Claude tidak mengembalikan teks — tipe respons tidak dikenali.');
  }

  const mentah = parse_json_dari_teks_model(blok_teks.text);
  return validasi_keluaran_alert(mentah);
}
