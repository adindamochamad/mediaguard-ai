'use client';

import type { Obat } from '@/lib/tipe-obat';

type PropsKartuObat = {
  obat: Obat;
  sedang_mengubah: boolean;
  on_ubah: (obat: Obat) => void;
  on_hapus: (id: string) => void;
};

export function KartuObat({ obat, sedang_mengubah, on_ubah, on_hapus }: PropsKartuObat) {
  const label_tampilan =
    obat.dosage && obat.dosage.length > 0
      ? `${obat.brand_name} · ${obat.dosage}`
      : obat.brand_name;

  return (
    <article className="rounded-2xl border border-border bg-card p-5 shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold text-foreground">{label_tampilan}</h3>
          {obat.generic_name ? (
            <p className="mt-0.5 text-sm text-muted">Generic: {obat.generic_name}</p>
          ) : null}
          {obat.condition_note ? (
            <p className="mt-2 text-sm leading-relaxed text-muted">{obat.condition_note}</p>
          ) : null}
          <p className="mt-3 text-xs text-muted">
            Added{' '}
            {new Date(obat.created_at).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => on_ubah(obat)}
            disabled={sedang_mengubah}
            className="rounded-xl border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => on_hapus(obat.id)}
            disabled={sedang_mengubah}
            className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Remove
          </button>
        </div>
      </div>
    </article>
  );
}
