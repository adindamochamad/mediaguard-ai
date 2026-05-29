'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { buat_klien_supabase_peramban } from '@/lib/supabase/client';

export function FormDaftar() {
  const router = useRouter();

  const [email, set_email] = useState('');
  const [kata_sandi, set_kata_sandi] = useState('');
  const [sedang_memuat, set_sedang_memuat] = useState(false);
  const [pesan_galat, set_pesan_galat] = useState('');
  const [pesan_sukses, set_pesan_sukses] = useState('');

  async function tangani_kirim(event: React.FormEvent) {
    event.preventDefault();
    set_sedang_memuat(true);
    set_pesan_galat('');
    set_pesan_sukses('');

    const supabase = buat_klien_supabase_peramban();
    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password: kata_sandi,
    });

    if (error) {
      set_pesan_galat(error.message);
      set_sedang_memuat(false);
      return;
    }

    if (data.session) {
      void fetch('/api/email/welcome', { method: 'POST' }).catch(() => {
        /* email opsional — jangan blokir onboarding */
      });
      router.push('/dashboard');
      router.refresh();
      return;
    }

    set_pesan_sukses('Check your email to confirm your account, then sign in.');
    set_sedang_memuat(false);
  }

  return (
    <form onSubmit={tangani_kirim} className="space-y-5">
      {pesan_galat ? (
        <p
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
        >
          {pesan_galat}
        </p>
      ) : null}

      {pesan_sukses ? (
        <p className="rounded-xl border border-accent/30 bg-accent-soft/40 px-4 py-3 text-sm text-foreground">
          {pesan_sukses}
        </p>
      ) : null}

      <div>
        <label htmlFor="email-daftar" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email-daftar"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => set_email(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-accent/30 transition-shadow focus:ring-2"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="sandi-daftar" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="sandi-daftar"
          type="password"
          autoComplete="new-password"
          required
          minLength={8}
          value={kata_sandi}
          onChange={(e) => set_kata_sandi(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground outline-none ring-accent/30 transition-shadow focus:ring-2"
          placeholder="At least 8 characters"
        />
      </div>

      <button
        type="submit"
        disabled={sedang_memuat}
        className="w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white shadow-soft transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {sedang_memuat ? 'Creating account…' : 'Create account'}
      </button>

      <p className="text-center text-sm text-muted">
        Already have an account?{' '}
        <Link href="/login" className="font-medium text-accent hover:underline">
          Sign in
        </Link>
      </p>

      <p className="text-center text-xs leading-relaxed text-muted">
        MediGuard is not medical advice. Always consult your doctor or pharmacist for clinical
        decisions.
      </p>
    </form>
  );
}
