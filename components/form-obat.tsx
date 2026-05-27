'use client';

import { useEffect, useState } from 'react';
import { PilihNamaObat } from '@/components/pilih-nama-obat';
import type { Obat } from '@/lib/tipe-obat';

type NilaiFormObat = {
  brand_name: string;
  generic_name: string;
  dosage: string;
  condition_note: string;
};

type PropsFormObat = {
  mode: 'tambah' | 'ubah';
  obat_awal?: Obat | null;
  sedang_memuat: boolean;
  pesan_galat: string;
  on_kirim: (nilai: NilaiFormObat) => void;
  on_batal: () => void;
};

const nilai_kosong: NilaiFormObat = {
  brand_name: '',
  generic_name: '',
  dosage: '',
  condition_note: '',
};

export function FormObat({
  mode,
  obat_awal,
  sedang_memuat,
  pesan_galat,
  on_kirim,
  on_batal,
}: PropsFormObat) {
  const [nilai, set_nilai] = useState<NilaiFormObat>(nilai_kosong);

  useEffect(() => {
    if (mode === 'ubah' && obat_awal) {
      set_nilai({
        brand_name: obat_awal.brand_name,
        generic_name: obat_awal.generic_name ?? '',
        dosage: obat_awal.dosage ?? '',
        condition_note: obat_awal.condition_note ?? '',
      });
    } else {
      set_nilai(nilai_kosong);
    }
  }, [mode, obat_awal]);

  function tangani_kirim(event: React.FormEvent) {
    event.preventDefault();
    on_kirim(nilai);
  }

  return (
    <form
      onSubmit={tangani_kirim}
      className="rounded-2xl border border-border bg-card p-5 shadow-soft sm:p-6"
    >
      <h2 className="text-lg font-semibold text-foreground">
        {mode === 'tambah' ? 'Add medication' : 'Edit medication'}
      </h2>
      <p className="mt-1 text-sm text-muted">
        We use this list to personalize safety scans. Not medical advice.
      </p>

      {pesan_galat ? (
        <p
          role="alert"
          className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {pesan_galat}
        </p>
      ) : null}

      <div className="mt-5 space-y-4">
        <div>
          <label htmlFor="brand_name" className="block text-sm font-medium text-foreground">
            Medication name <span className="text-red-600">*</span>
          </label>
          <PilihNamaObat
            id="brand_name"
            nilai={nilai.brand_name}
            wajib
            on_ubah={(nama) => set_nilai((s) => ({ ...s, brand_name: nama }))}
          />
        </div>

        <div>
          <label htmlFor="generic_name" className="block text-sm font-medium text-foreground">
            Generic name <span className="text-muted">(optional)</span>
          </label>
          <input
            id="generic_name"
            value={nilai.generic_name}
            onChange={(e) => set_nilai((s) => ({ ...s, generic_name: e.target.value }))}
            placeholder="e.g. metformin hydrochloride"
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-accent/30 transition-shadow focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="dosage" className="block text-sm font-medium text-foreground">
            Dosage <span className="text-muted">(optional)</span>
          </label>
          <input
            id="dosage"
            value={nilai.dosage}
            onChange={(e) => set_nilai((s) => ({ ...s, dosage: e.target.value }))}
            placeholder="e.g. 500 mg twice daily"
            className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-accent/30 transition-shadow focus:ring-2"
          />
        </div>

        <div>
          <label htmlFor="condition_note" className="block text-sm font-medium text-foreground">
            Why you take it <span className="text-muted">(optional)</span>
          </label>
          <textarea
            id="condition_note"
            rows={2}
            value={nilai.condition_note}
            onChange={(e) => set_nilai((s) => ({ ...s, condition_note: e.target.value }))}
            placeholder="e.g. Type 2 diabetes — helps your care team context"
            className="mt-1.5 w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-accent/30 transition-shadow focus:ring-2"
          />
        </div>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={on_batal}
          disabled={sedang_memuat}
          className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-slate-50 disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={sedang_memuat}
          className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sedang_memuat
            ? 'Saving…'
            : mode === 'tambah'
              ? 'Add medication'
              : 'Save changes'}
        </button>
      </div>
    </form>
  );
}
