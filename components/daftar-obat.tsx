'use client';

import { useCallback, useEffect, useState } from 'react';
import { FormObat } from '@/components/form-obat';
import { KartuObat } from '@/components/kartu-obat';
import { ModalKonfirmasi } from '@/components/modal-konfirmasi';
import type { Obat } from '@/lib/tipe-obat';

type ModeForm = 'tutup' | 'tambah' | 'ubah';

export function DaftarObat() {
  const [daftar_obat, set_daftar_obat] = useState<Obat[]>([]);
  const [sedang_memuat, set_sedang_memuat] = useState(true);
  const [sedang_menyimpan, set_sedang_menyimpan] = useState(false);
  const [mode_form, set_mode_form] = useState<ModeForm>('tutup');
  const [obat_diedit, set_obat_diedit] = useState<Obat | null>(null);
  const [pesan_galat, set_pesan_galat] = useState('');
  const [pesan_sukses, set_pesan_sukses] = useState('');
  const [obat_menunggu_hapus, set_obat_menunggu_hapus] = useState<Obat | null>(null);

  const muat_obat = useCallback(async () => {
    set_sedang_memuat(true);
    set_pesan_galat('');

    try {
      const respons = await fetch('/api/medications');
      const data = await respons.json();

      if (!respons.ok) {
        set_pesan_galat(data.kesalahan ?? 'Could not load medications.');
        set_daftar_obat([]);
        return;
      }

      set_daftar_obat(data.obat ?? []);
    } catch {
      set_pesan_galat('Network error while loading medications.');
      set_daftar_obat([]);
    } finally {
      set_sedang_memuat(false);
    }
  }, []);

  useEffect(() => {
    void muat_obat();
  }, [muat_obat]);

  function buka_form_tambah() {
    set_obat_diedit(null);
    set_mode_form('tambah');
    set_pesan_galat('');
    set_pesan_sukses('');
  }

  function buka_form_ubah(obat: Obat) {
    set_obat_diedit(obat);
    set_mode_form('ubah');
    set_pesan_galat('');
    set_pesan_sukses('');
  }

  function tutup_form() {
    set_mode_form('tutup');
    set_obat_diedit(null);
    set_pesan_galat('');
  }

  async function tangani_tambah(nilai: {
    brand_name: string;
    generic_name: string;
    dosage: string;
    condition_note: string;
  }) {
    set_sedang_menyimpan(true);
    set_pesan_galat('');

    try {
      const respons = await fetch('/api/medications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: nilai.brand_name,
          generic_name: nilai.generic_name || null,
          dosage: nilai.dosage || null,
          condition_note: nilai.condition_note || null,
        }),
      });

      const data = await respons.json();

      if (!respons.ok) {
        set_pesan_galat(data.kesalahan ?? 'Could not add medication.');
        return;
      }

      set_daftar_obat((sebelumnya) => [data.obat, ...sebelumnya]);
      set_mode_form('tutup');
      set_pesan_sukses(`${data.obat.brand_name} added to your list.`);
    } catch {
      set_pesan_galat('Network error while saving.');
    } finally {
      set_sedang_menyimpan(false);
    }
  }

  async function tangani_ubah(nilai: {
    brand_name: string;
    generic_name: string;
    dosage: string;
    condition_note: string;
  }) {
    if (!obat_diedit) return;

    set_sedang_menyimpan(true);
    set_pesan_galat('');

    try {
      const respons = await fetch(`/api/medications/${obat_diedit.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          brand_name: nilai.brand_name,
          generic_name: nilai.generic_name || null,
          dosage: nilai.dosage || null,
          condition_note: nilai.condition_note || null,
        }),
      });

      const data = await respons.json();

      if (!respons.ok) {
        set_pesan_galat(data.kesalahan ?? 'Could not update medication.');
        return;
      }

      set_daftar_obat((sebelumnya) =>
        sebelumnya.map((item) => (item.id === data.obat.id ? data.obat : item)),
      );
      set_mode_form('tutup');
      set_obat_diedit(null);
      set_pesan_sukses('Medication updated.');
    } catch {
      set_pesan_galat('Network error while saving.');
    } finally {
      set_sedang_menyimpan(false);
    }
  }

  function minta_konfirmasi_hapus(id: string) {
    const obat = daftar_obat.find((item) => item.id === id);
    if (!obat) return;
    set_obat_menunggu_hapus(obat);
    set_pesan_galat('');
    set_pesan_sukses('');
  }

  function tutup_modal_hapus() {
    if (sedang_menyimpan) return;
    set_obat_menunggu_hapus(null);
  }

  async function eksekusi_hapus() {
    if (!obat_menunggu_hapus) return;

    const id = obat_menunggu_hapus.id;
    set_sedang_menyimpan(true);
    set_pesan_galat('');
    set_pesan_sukses('');

    try {
      const respons = await fetch(`/api/medications/${id}`, { method: 'DELETE' });

      if (!respons.ok) {
        const data = await respons.json();
        set_pesan_galat(data.kesalahan ?? 'Could not remove medication.');
        set_obat_menunggu_hapus(null);
        return;
      }

      set_daftar_obat((sebelumnya) => sebelumnya.filter((item) => item.id !== id));
      if (obat_diedit?.id === id) {
        tutup_form();
      }
      set_obat_menunggu_hapus(null);
      set_pesan_sukses('Medication removed.');
    } catch {
      set_pesan_galat('Network error while removing.');
      set_obat_menunggu_hapus(null);
    } finally {
      set_sedang_menyimpan(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          {sedang_memuat
            ? 'Loading your list…'
            : daftar_obat.length === 0
              ? 'No medications yet — add your first one below.'
              : `${daftar_obat.length} medication${daftar_obat.length === 1 ? '' : 's'} on your list`}
        </p>

        {mode_form === 'tutup' ? (
          <button
            type="button"
            onClick={buka_form_tambah}
            className="inline-flex items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-700"
          >
            Add medication
          </button>
        ) : null}
      </div>

      {pesan_sukses && mode_form === 'tutup' ? (
        <p className="rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm text-foreground">
          {pesan_sukses}
        </p>
      ) : null}

      {pesan_galat && mode_form === 'tutup' ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {pesan_galat}
        </p>
      ) : null}

      {mode_form === 'tambah' ? (
        <FormObat
          mode="tambah"
          sedang_memuat={sedang_menyimpan}
          pesan_galat={pesan_galat}
          on_kirim={tangani_tambah}
          on_batal={tutup_form}
        />
      ) : null}

      {mode_form === 'ubah' && obat_diedit ? (
        <FormObat
          mode="ubah"
          obat_awal={obat_diedit}
          sedang_memuat={sedang_menyimpan}
          pesan_galat={pesan_galat}
          on_kirim={tangani_ubah}
          on_batal={tutup_form}
        />
      ) : null}

      {sedang_memuat ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-2xl border border-border bg-slate-100"
            />
          ))}
        </div>
      ) : daftar_obat.length === 0 && mode_form === 'tutup' ? (
        <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
          <h2 className="text-lg font-semibold text-foreground">Your list is empty</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted">
            Add the prescriptions you take regularly. MediGuard uses this to find FDA and PubMed
            updates that matter to you.
          </p>
          <button
            type="button"
            onClick={buka_form_tambah}
            className="mt-6 inline-flex rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white shadow-soft hover:bg-teal-700"
          >
            Add your first medication
          </button>
        </div>
      ) : (
        <ul className="space-y-3" aria-label="Medication list">
          {daftar_obat.map((obat) => (
            <li key={obat.id}>
              <KartuObat
                obat={obat}
                sedang_mengubah={sedang_menyimpan}
                on_ubah={buka_form_ubah}
                on_hapus={minta_konfirmasi_hapus}
              />
            </li>
          ))}
        </ul>
      )}

      <ModalKonfirmasi
        terbuka={obat_menunggu_hapus !== null}
        judul="Remove medication?"
        deskripsi={
          obat_menunggu_hapus
            ? `${obat_menunggu_hapus.brand_name} will be removed from your monitored list. You can add it back anytime.`
            : ''
        }
        label_konfirmasi="Remove"
        label_batal="Keep it"
        varian="bahaya"
        sedang_memuat={sedang_menyimpan}
        on_konfirmasi={eksekusi_hapus}
        on_tutup={tutup_modal_hapus}
      />
    </div>
  );
}
