'use client';

import { useEffect, useId, useRef } from 'react';

type VarianModal = 'default' | 'bahaya';

type PropsModalKonfirmasi = {
  terbuka: boolean;
  judul: string;
  deskripsi: string;
  label_konfirmasi?: string;
  label_batal?: string;
  varian?: VarianModal;
  sedang_memuat?: boolean;
  on_konfirmasi: () => void;
  on_tutup: () => void;
};

export function ModalKonfirmasi({
  terbuka,
  judul,
  deskripsi,
  label_konfirmasi = 'Confirm',
  label_batal = 'Cancel',
  varian = 'default',
  sedang_memuat = false,
  on_konfirmasi,
  on_tutup,
}: PropsModalKonfirmasi) {
  const id_judul = useId();
  const id_deskripsi = useId();
  const ref_tombol_batal = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!terbuka) return;

    const handler_escape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !sedang_memuat) on_tutup();
    };

    document.addEventListener('keydown', handler_escape);
    document.body.style.overflow = 'hidden';
    ref_tombol_batal.current?.focus();

    return () => {
      document.removeEventListener('keydown', handler_escape);
      document.body.style.overflow = '';
    };
  }, [terbuka, sedang_memuat, on_tutup]);

  if (!terbuka) return null;

  const kelas_tombol_konfirmasi =
    varian === 'bahaya'
      ? 'rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60'
      : 'rounded-xl bg-accent px-4 py-2.5 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60';

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px]"
        onClick={sedang_memuat ? undefined : on_tutup}
        tabIndex={-1}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={id_judul}
        aria-describedby={id_deskripsi}
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-soft"
      >
        <div
          className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl ${
            varian === 'bahaya' ? 'bg-red-50 text-red-600' : 'bg-accent-soft text-accent'
          }`}
          aria-hidden
        >
          {varian === 'bahaya' ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          )}
        </div>

        <h2 id={id_judul} className="text-lg font-semibold text-foreground">
          {judul}
        </h2>
        <p id={id_deskripsi} className="mt-2 text-sm leading-relaxed text-muted">
          {deskripsi}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            ref={ref_tombol_batal}
            type="button"
            onClick={on_tutup}
            disabled={sedang_memuat}
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {label_batal}
          </button>
          <button
            type="button"
            onClick={on_konfirmasi}
            disabled={sedang_memuat}
            className={kelas_tombol_konfirmasi}
          >
            {sedang_memuat ? 'Working…' : label_konfirmasi}
          </button>
        </div>
      </div>
    </div>
  );
}
