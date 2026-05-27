'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from '@headlessui/react';
import { daftar_nama_obat_umum } from '@/lib/obat/daftar-nama-umum';

type PropsPilihNamaObat = {
  id: string;
  nilai: string;
  wajib?: boolean;
  on_ubah: (nama: string) => void;
};

export function PilihNamaObat({ id, nilai, wajib = false, on_ubah }: PropsPilihNamaObat) {
  const [kueri, set_kueri] = useState(nilai);

  useEffect(() => {
    set_kueri(nilai);
  }, [nilai]);

  const daftar_saran = useMemo(() => {
    const teks_cari = kueri.trim().toLowerCase();
    if (!teks_cari) return daftar_nama_obat_umum;
    return daftar_nama_obat_umum.filter((nama) => nama.toLowerCase().includes(teks_cari));
  }, [kueri]);

  return (
    <Combobox
      value={nilai}
      onChange={(nama_terpilih) => {
        if (nama_terpilih !== null) {
          on_ubah(nama_terpilih);
          set_kueri(nama_terpilih);
        }
      }}
      nullable
    >
      <div className="relative mt-1.5">
        <ComboboxInput
          id={id}
          required={wajib}
          autoComplete="off"
          displayValue={() => kueri}
          onChange={(event) => {
            const teks_baru = event.target.value;
            set_kueri(teks_baru);
            on_ubah(teks_baru);
          }}
          placeholder="Search or type a medication name"
          className="w-full rounded-xl border border-border bg-card py-2.5 pl-4 pr-10 text-sm text-foreground outline-none ring-accent/30 transition-shadow placeholder:text-muted focus:ring-2"
        />

        <ComboboxButton
          type="button"
          className="absolute inset-y-0 right-0 flex items-center rounded-r-xl px-3 text-muted transition-colors hover:text-foreground"
          aria-label="Show medication suggestions"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </ComboboxButton>

        <ComboboxOptions
          anchor="bottom start"
          className="z-50 mt-1 max-h-60 w-[var(--input-width)] overflow-auto rounded-xl border border-border bg-card py-1 shadow-soft empty:invisible"
        >
          {daftar_saran.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">
              No matches — press Enter to use &ldquo;{kueri.trim()}&rdquo;
            </div>
          ) : (
            daftar_saran.map((nama) => (
              <ComboboxOption
                key={nama}
                value={nama}
                className="cursor-pointer px-4 py-2.5 text-sm text-foreground data-[focus]:bg-accent-soft data-[focus]:text-accent"
              >
                {nama}
              </ComboboxOption>
            ))
          )}
        </ComboboxOptions>
      </div>
    </Combobox>
  );
}
