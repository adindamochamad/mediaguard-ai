import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { MODEL_CLAUDE_CHAT } from '@/lib/claude/konstanta';
import { ambil_klien_claude } from '@/lib/claude/klien';
import { crawlFDAAlerts, searchMedicalNews } from '@/lib/nimble';

type BarisSumber = {
  judul: string;
  url: string;
  asal: string;
};

function normalisasi_pertanyaan(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim();
}

function gabung_baris_sumber(daftar_sumber: BarisSumber[]): string {
  if (daftar_sumber.length === 0) return 'No external source retrieved.';

  return daftar_sumber
    .map((sumber, indeks) => `${indeks + 1}. [${sumber.asal}] ${sumber.judul} — ${sumber.url}`)
    .join('\n');
}

function bangun_prompt_chat(
  pertanyaan_pengguna: string,
  daftar_obat: string[],
  daftar_sumber: BarisSumber[],
): string {
  const daftar_obat_teks =
    daftar_obat.length > 0 ? daftar_obat.map((obat) => `- ${obat}`).join('\n') : '- (no medication profile)';
  const daftar_sumber_teks = gabung_baris_sumber(daftar_sumber);

  return [
    'You are MediGuard AI, a consumer medication safety assistant.',
    'Never diagnose disease or tell users to start/stop medication directly.',
    'Use plain English and keep the answer concise.',
    'If risk is moderate/high, advise discussing with doctor/pharmacist.',
    '',
    'User medications:',
    daftar_obat_teks,
    '',
    'Question:',
    pertanyaan_pengguna,
    '',
    'Live source shortlist from Nimble:',
    daftar_sumber_teks,
    '',
    'Response format requirements:',
    '- 1 short answer paragraph',
    '- A section titled "Sources" with bullet links actually used',
  ].join('\n');
}

async function kumpulkan_sumber_chat(daftar_obat: string[]): Promise<BarisSumber[]> {
  const daftar_sumber: BarisSumber[] = [];

  try {
    const hasil_fda = await crawlFDAAlerts();
    daftar_sumber.push(
      ...hasil_fda.item.slice(0, 3).map((item) => ({
        judul: item.judul,
        url: item.url,
        asal: 'FDA',
      })),
    );
  } catch {
    // FDA crawl boleh gagal tanpa memblokir chat.
  }

  await Promise.all(
    daftar_obat.slice(0, 2).map(async (nama_obat) => {
      try {
        const hasil_berita = await searchMedicalNews(nama_obat);
        daftar_sumber.push(
          ...hasil_berita.slice(0, 2).map((item) => ({
            judul: item.judul,
            url: item.url,
            asal: `Medical search: ${nama_obat}`,
          })),
        );
      } catch {
        // Satu kueri gagal, obat lain tetap diproses.
      }
    }),
  );

  const kunci_url = new Set<string>();
  return daftar_sumber.filter((sumber) => {
    if (kunci_url.has(sumber.url)) return false;
    kunci_url.add(sumber.url);
    return true;
  });
}

function encode_sse_data(data: object): Uint8Array {
  const encoder = new TextEncoder();
  return encoder.encode(`data: ${JSON.stringify(data)}\n\n`);
}

export async function POST(request: NextRequest) {
  const hasil_auth = await ambil_pengguna_api();
  if ('respons_galat' in hasil_auth) return hasil_auth.respons_galat;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ kesalahan: 'Body JSON tidak valid.' }, { status: 400 });
  }

  const pertanyaan_pengguna = normalisasi_pertanyaan(
    typeof body === 'object' && body !== null ? (body as { pertanyaan?: unknown }).pertanyaan : undefined,
  );

  if (!pertanyaan_pengguna) {
    return NextResponse.json({ kesalahan: 'Pertanyaan wajib diisi.' }, { status: 400 });
  }

  const { supabase, pengguna } = hasil_auth;
  const { data: data_obat } = await supabase
    .from('medications')
    .select('brand_name, generic_name')
    .eq('user_id', pengguna.id)
    .order('created_at', { ascending: false })
    .limit(6);

  const daftar_obat = (data_obat ?? [])
    .map((obat) => obat.generic_name?.trim() || obat.brand_name?.trim() || '')
    .filter(Boolean);

  const daftar_sumber = await kumpulkan_sumber_chat(daftar_obat);
  const prompt_pengguna = bangun_prompt_chat(pertanyaan_pengguna, daftar_obat, daftar_sumber);

  let jawaban = '';
  try {
    const klien = ambil_klien_claude();
    const respons = await klien.messages.create({
      model: MODEL_CLAUDE_CHAT,
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt_pengguna }],
    });

    const blok_teks = respons.content.find((blok) => blok.type === 'text');
    jawaban = blok_teks && blok_teks.type === 'text' ? blok_teks.text.trim() : '';
  } catch (galat) {
    const pesan = galat instanceof Error ? galat.message : 'Gagal membuat jawaban.';
    return NextResponse.json({ kesalahan: pesan }, { status: 502 });
  }

  if (!jawaban) {
    jawaban =
      'I could not produce a complete response right now. Please try again, and discuss urgent concerns with your doctor or pharmacist.';
  }

  const potongan = jawaban.match(/.{1,120}(\s|$)/g) ?? [jawaban];
  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      controller.enqueue(encode_sse_data({ tipe: 'meta', sumber: daftar_sumber }));
      for (const bagian of potongan) {
        controller.enqueue(encode_sse_data({ tipe: 'token', token: bagian }));
      }
      controller.enqueue(encode_sse_data({ tipe: 'done' }));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
