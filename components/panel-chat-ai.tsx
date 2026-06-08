'use client';

import { FormEvent, useMemo, useState } from 'react';

type PesanChat = {
  id: string;
  peran: 'pengguna' | 'asisten';
  isi: string;
};

type StatusTool = {
  id: string;
  pesan: string;
};

type SumberChat = {
  judul: string;
  url: string;
  asal: string;
};

/** Pertanyaan disarankan — urutan pertama dioptimalkan untuk demo live Nimble. */
const PERTANYAAN_DEMO_NIMBLE =
  'Any FDA warning about Metformin this week?';

const DAFTAR_PERTANYAAN_SARAN = [
  PERTANYAAN_DEMO_NIMBLE,
  'Is there anything new about my medications I should worry about?',
  'What are the interactions between Warfarin and common over-the-counter drugs?',
  'Are any of my medications currently under Food and Drug Administration (FDA) recall or safety review?',
  'What should I watch out for with Metformin long-term?',
];

function buat_id_chat(): string {
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function parse_baris_sse(baris: string): unknown {
  const awalan = 'data: ';
  if (!baris.startsWith(awalan)) return null;
  const muatan = baris.slice(awalan.length).trim();
  if (!muatan) return null;

  try {
    return JSON.parse(muatan);
  } catch {
    return null;
  }
}

export function PanelChatAi() {
  const [pertanyaan, set_pertanyaan] = useState('');
  const [sedang_mengirim, set_sedang_mengirim] = useState(false);
  const [pesan_galat, set_pesan_galat] = useState<string | null>(null);
  const [daftar_pesan, set_daftar_pesan] = useState<PesanChat[]>([]);
  const [daftar_sumber, set_daftar_sumber] = useState<SumberChat[]>([]);
  const [log_status, set_log_status] = useState<StatusTool[]>([]);

  const bisa_kirim = useMemo(
    () => pertanyaan.trim().length > 0 && !sedang_mengirim,
    [pertanyaan, sedang_mengirim],
  );

  async function kirim_pertanyaan(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!bisa_kirim) return;

    const pertanyaan_aktif = pertanyaan.trim();
    const id_pesan_pengguna = buat_id_chat();
    const id_pesan_asisten = buat_id_chat();

    set_pesan_galat(null);
    set_pertanyaan('');
    set_daftar_sumber([]);
    set_log_status([]);
    set_sedang_mengirim(true);
    set_daftar_pesan((sebelumnya) => [
      ...sebelumnya,
      { id: id_pesan_pengguna, peran: 'pengguna', isi: pertanyaan_aktif },
      { id: id_pesan_asisten, peran: 'asisten', isi: '' },
    ]);

    try {
      const respons = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pertanyaan: pertanyaan_aktif }),
      });

      if (!respons.ok || !respons.body) {
        const body = (await respons.json().catch(() => ({}))) as { kesalahan?: string };
        set_pesan_galat(body.kesalahan ?? 'Failed to generate chat response.');
        set_daftar_pesan((sebelumnya) => sebelumnya.filter((pesan) => pesan.id !== id_pesan_asisten));
        return;
      }

      const pembaca = respons.body.getReader();
      const dekoder = new TextDecoder();
      let buffer = '';
      let lanjut_baca = true;

      while (lanjut_baca) {
        const { value, done } = await pembaca.read();
        if (done) break;

        buffer += dekoder.decode(value, { stream: true });
        const blok = buffer.split('\n\n');
        buffer = blok.pop() ?? '';

        for (const item of blok) {
          const data = parse_baris_sse(item.trim());
          if (!data || typeof data !== 'object') continue;

          const payload = data as {
            tipe?: string;
            token?: string;
            sumber?: SumberChat[];
            pesan?: string;
          };

          if (payload.tipe === 'status' && typeof payload.pesan === 'string') {
            set_log_status((sebelumnya) => [
              ...sebelumnya,
              { id: buat_id_chat(), pesan: payload.pesan! },
            ]);
          } else if (payload.tipe === 'meta' && Array.isArray(payload.sumber)) {
            set_daftar_sumber(payload.sumber);
          } else if (payload.tipe === 'token' && typeof payload.token === 'string') {
            set_daftar_pesan((sebelumnya) =>
              sebelumnya.map((pesan) =>
                pesan.id === id_pesan_asisten ? { ...pesan, isi: `${pesan.isi}${payload.token}` } : pesan,
              ),
            );
          } else if (payload.tipe === 'done') {
            lanjut_baca = false;
            break;
          }
        }
      }
    } catch {
      set_pesan_galat('Network error while streaming response.');
      set_daftar_pesan((sebelumnya) => sebelumnya.filter((pesan) => pesan.id !== id_pesan_asisten));
    } finally {
      set_sedang_mengirim(false);
    }
  }

  return (
    <div className="card-surface p-5">
      <form onSubmit={kirim_pertanyaan} className="space-y-3">
        <label htmlFor="kolom-pertanyaan" className="text-sm font-medium text-foreground">
          Ask about medication safety
        </label>
        <textarea
          id="kolom-pertanyaan"
          value={pertanyaan}
          onChange={(event) => set_pertanyaan(event.target.value)}
          rows={3}
          placeholder="Example: Any FDA warning about Metformin this week?"
          className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm text-foreground outline-none ring-accent transition focus:ring-2"
        />
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={!bisa_kirim}
            className="inline-flex items-center rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {sedang_mengirim ? 'Streaming…' : 'Send'}
          </button>
          <p className="text-xs text-muted">
            MediGuard AI provides educational safety context, not medical diagnosis.
          </p>
        </div>
      </form>

      {log_status.length > 0 ? (
        <div className="mt-4 space-y-1">
          {log_status.map((item) => (
            <p key={item.id} className="flex items-center gap-2 text-xs text-muted">
              <span className="inline-block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent" />
              {item.pesan}
            </p>
          ))}
        </div>
      ) : null}

      {pesan_galat ? (
        <p className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {pesan_galat}
        </p>
      ) : null}

      {daftar_pesan.length === 0 && !sedang_mengirim ? (
        <div className="mt-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">
            Suggested questions
          </p>
          <div className="flex flex-col gap-2">
            {DAFTAR_PERTANYAAN_SARAN.map((prompt) => (
              <button
                key={prompt}
                type="button"
                onClick={() => set_pertanyaan(prompt)}
                className={`rounded-xl border px-4 py-2.5 text-left text-sm transition-colors ${
                  prompt === PERTANYAAN_DEMO_NIMBLE
                    ? 'border-accent/50 bg-accent-soft/40 font-medium text-foreground hover:border-accent'
                    : 'border-border bg-slate-50 text-muted hover:border-accent/40 hover:bg-accent-soft/30 hover:text-foreground'
                }`}
              >
                {prompt === PERTANYAAN_DEMO_NIMBLE ? (
                  <>
                    <span className="mr-1.5 text-[10px] font-bold uppercase tracking-wide text-accent">
                      Live Nimble demo
                    </span>
                    {prompt}
                  </>
                ) : (
                  prompt
                )}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {daftar_pesan.map((pesan) => (
          <div
            key={pesan.id}
            className={`rounded-xl border px-3 py-2 text-sm ${
              pesan.peran === 'pengguna'
                ? 'border-accent/30 bg-accent-soft/40 text-foreground'
                : 'border-border bg-slate-50 text-foreground'
            }`}
          >
            <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-muted">
              {pesan.peran === 'pengguna' ? 'You' : 'MediGuard AI'}
            </p>
            <p className="whitespace-pre-wrap leading-relaxed">
              {pesan.isi || (pesan.peran === 'asisten' && sedang_mengirim ? 'Generating response…' : '')}
            </p>
          </div>
        ))}
      </div>

      {daftar_sumber.length > 0 ? (
        <div className="mt-5 rounded-xl border border-border bg-slate-50/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Nimble sources fetched</p>
          <ul className="mt-2 space-y-1 text-sm">
            {daftar_sumber.map((sumber) => (
              <li key={`${sumber.url}-${sumber.judul}`}>
                <a
                  href={sumber.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {sumber.judul}
                </a>
                <span className="ml-2 text-xs text-muted">({sumber.asal})</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}
