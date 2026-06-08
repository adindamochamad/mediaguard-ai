import type Anthropic from '@anthropic-ai/sdk';
import type { MessageParam, Tool, ToolResultBlockParam } from '@anthropic-ai/sdk/resources/messages';
import { NextRequest, NextResponse } from 'next/server';
import { ambil_pengguna_api } from '@/lib/api/ambil-pengguna-api';
import { MODEL_CLAUDE_CHAT } from '@/lib/claude/konstanta';
import { ambil_klien_claude } from '@/lib/claude/klien';
import { crawlFDAAlerts, crawlPubMed, searchMedicalNews } from '@/lib/nimble';

type BarisSumber = {
  judul: string;
  url: string;
  asal: string;
};

const PERINTAH_SISTEM =
  'You are MediGuard AI, a consumer medication safety assistant with access to live web intelligence tools.\n' +
  'You MUST call at least one tool before answering — never rely on training data alone for safety questions.\n' +
  'Never diagnose disease or tell users to start/stop medication directly.\n' +
  'Use plain English and keep the answer concise (1-2 paragraphs).\n' +
  'If risk is moderate/high, advise discussing with doctor/pharmacist.\n' +
  'End your response with a "Sources:" section listing URLs you actually retrieved.';

const DAFTAR_TOOL: Tool[] = [
  {
    name: 'cari_berita_obat',
    description:
      'Search for recent medical news, FDA warnings, and safety alerts for a specific medication using the Nimble Search API. Call this for any medication the user asks about.',
    input_schema: {
      type: 'object',
      properties: {
        nama_obat: {
          type: 'string',
          description: 'Medication name (generic or brand) to search for',
        },
      },
      required: ['nama_obat'],
    },
  },
  {
    name: 'crawl_fda_alerts',
    description:
      'Crawl the FDA Drug Safety Communications page for the latest official drug safety alerts, warnings, and recalls via Nimble Extract.',
    input_schema: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
  {
    name: 'crawl_pubmed',
    description:
      'Search PubMed for recent peer-reviewed studies on drug interactions and adverse effects for a specific medication via Nimble Extract.',
    input_schema: {
      type: 'object',
      properties: {
        nama_obat: {
          type: 'string',
          description: 'Medication name to search on PubMed',
        },
      },
      required: ['nama_obat'],
    },
  },
];

function normalisasi_pertanyaan(input: unknown): string {
  if (typeof input !== 'string') return '';
  return input.trim();
}

function encode_sse(data: object): Uint8Array {
  return new TextEncoder().encode(`data: ${JSON.stringify(data)}\n\n`);
}

async function jalankan_tool(
  nama: string,
  input: unknown,
  sumber_terkumpul: BarisSumber[],
  enqueue: (chunk: Uint8Array) => void,
): Promise<string> {
  if (nama === 'cari_berita_obat') {
    const { nama_obat } = input as { nama_obat: string };
    enqueue(encode_sse({ tipe: 'status', pesan: `Searching Nimble for "${nama_obat}" safety news…` }));
    const berita = await searchMedicalNews(nama_obat);
    sumber_terkumpul.push(
      ...berita.slice(0, 3).map((b) => ({
        judul: b.judul,
        url: b.url,
        asal: `Medical news: ${nama_obat}`,
      })),
    );
    return JSON.stringify(
      berita.map((b) => ({ judul: b.judul, url: b.url, cuplikan: b.cuplikan })),
    );
  }

  if (nama === 'crawl_fda_alerts') {
    enqueue(encode_sse({ tipe: 'status', pesan: 'Crawling FDA Drug Safety Communications via Nimble…' }));
    const fda = await crawlFDAAlerts();
    sumber_terkumpul.push(
      ...fda.item.slice(0, 4).map((i) => ({
        judul: i.judul,
        url: i.url,
        asal: 'FDA Drug Safety Communications',
      })),
    );
    return JSON.stringify(fda.item.slice(0, 8).map((i) => ({ judul: i.judul, url: i.url })));
  }

  if (nama === 'crawl_pubmed') {
    const { nama_obat } = input as { nama_obat: string };
    enqueue(encode_sse({ tipe: 'status', pesan: `Searching PubMed for "${nama_obat}" via Nimble…` }));
    const pubmed = await crawlPubMed(nama_obat);
    sumber_terkumpul.push(
      ...pubmed.artikel.slice(0, 2).map((a) => ({
        judul: a.judul,
        url: a.url ?? pubmed.url_pencarian,
        asal: `PubMed: ${nama_obat}`,
      })),
    );
    return JSON.stringify(pubmed.artikel.slice(0, 4));
  }

  return JSON.stringify({ error: `Tool "${nama}" tidak dikenal.` });
}

async function stream_chat_agentic(
  klien: ReturnType<typeof ambil_klien_claude>,
  pertanyaan_pengguna: string,
  daftar_obat: string[],
  controller: ReadableStreamDefaultController<Uint8Array>,
): Promise<void> {
  const sumber_terkumpul: BarisSumber[] = [];
  const enqueue = (chunk: Uint8Array) => controller.enqueue(chunk);

  const konteks_obat =
    daftar_obat.length > 0
      ? `User's medication list:\n${daftar_obat.map((o) => `- ${o}`).join('\n')}`
      : 'User has not added any medications yet.';

  const riwayat: MessageParam[] = [
    {
      role: 'user',
      content: `${konteks_obat}\n\nQuestion: ${pertanyaan_pengguna}`,
    },
  ];

  // Agentic tool-use loop — Claude calls Nimble tools until it has enough context
  for (let iterasi = 0; iterasi < 6; iterasi++) {
    const respons = await (klien as unknown as Anthropic).messages.create({
      model: MODEL_CLAUDE_CHAT,
      max_tokens: 1024,
      system: PERINTAH_SISTEM,
      tools: DAFTAR_TOOL,
      messages: riwayat,
    });

    if (respons.stop_reason === 'end_turn') {
      enqueue(encode_sse({ tipe: 'meta', sumber: sumber_terkumpul }));

      const blok_teks = respons.content.find((b) => b.type === 'text');
      const jawaban = blok_teks && blok_teks.type === 'text' ? blok_teks.text.trim() : '';

      const potongan = jawaban
        ? (jawaban.match(/\S+[ \t]*/g) ?? [jawaban])
        : ['Unable to generate a response. Please try again.'];

      for (const bagian of potongan) {
        enqueue(encode_sse({ tipe: 'token', token: bagian }));
      }
      enqueue(encode_sse({ tipe: 'done' }));
      return;
    }

    if (respons.stop_reason === 'tool_use') {
      riwayat.push({ role: 'assistant', content: respons.content });

      const panggilan = respons.content.filter(
        (b): b is Extract<typeof b, { type: 'tool_use' }> => b.type === 'tool_use',
      );

      const hasil_tool: ToolResultBlockParam[] = await Promise.all(
        panggilan.map(async (blok) => {
          let hasil: string;
          try {
            hasil = await jalankan_tool(blok.name, blok.input, sumber_terkumpul, enqueue);
          } catch (e) {
            hasil = JSON.stringify({ error: e instanceof Error ? e.message : 'Tool call failed.' });
          }
          return {
            type: 'tool_result' as const,
            tool_use_id: blok.id,
            content: hasil,
          };
        }),
      );

      riwayat.push({ role: 'user', content: hasil_tool });
      continue;
    }

    // Unexpected stop reason — emit whatever text we have
    const blok_teks = respons.content.find((b) => b.type === 'text');
    const jawaban = blok_teks && blok_teks.type === 'text' ? blok_teks.text.trim() : 'Unexpected AI response.';
    enqueue(encode_sse({ tipe: 'meta', sumber: sumber_terkumpul }));
    enqueue(encode_sse({ tipe: 'token', token: jawaban }));
    enqueue(encode_sse({ tipe: 'done' }));
    return;
  }

  // Max iterations reached — emit partial result
  enqueue(encode_sse({ tipe: 'meta', sumber: sumber_terkumpul }));
  enqueue(encode_sse({ tipe: 'token', token: 'Reached maximum tool call depth. Please rephrase your question.' }));
  enqueue(encode_sse({ tipe: 'done' }));
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
    .order('created_at', { ascending: false });

  const daftar_obat = (data_obat ?? [])
    .map((obat) => obat.generic_name?.trim() || obat.brand_name?.trim() || '')
    .filter(Boolean);

  const klien = ambil_klien_claude();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        await stream_chat_agentic(klien, pertanyaan_pengguna, daftar_obat, controller);
      } catch (galat) {
        const pesan = galat instanceof Error ? galat.message : 'Internal server error.';
        try {
          controller.enqueue(encode_sse({ tipe: 'error', pesan }));
          controller.enqueue(encode_sse({ tipe: 'done' }));
        } catch {
          // controller may already be closed
        }
      } finally {
        try {
          controller.close();
        } catch {
          // already closed
        }
      }
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
