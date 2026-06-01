'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { buat_klien_supabase_peramban } from '@/lib/supabase/client';

export function FormMasuk() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect_to = searchParams.get('redirectTo') ?? '/dashboard';
  const error_awal = searchParams.get('error');

  const [email, set_email] = useState('');
  const [kata_sandi, set_kata_sandi] = useState('');
  const [sedang_memuat, set_sedang_memuat] = useState(false);
  const [pesan_galat, set_pesan_galat] = useState(
    error_awal === 'auth_callback_failed'
      ? 'Sign-in link expired or invalid. Please try again.'
      : '',
  );

  async function tangani_kirim(event: React.FormEvent) {
    event.preventDefault();
    set_sedang_memuat(true);
    set_pesan_galat('');

    const supabase = buat_klien_supabase_peramban();
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: kata_sandi,
    });

    if (error) {
      set_pesan_galat(error.message);
      set_sedang_memuat(false);
      return;
    }

    router.push(redirect_to);
    router.refresh();
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

      <div>
        <label htmlFor="email-masuk" className="block text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email-masuk"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => set_email(e.target.value)}
          className="input-field"
          placeholder="you@example.com"
        />
      </div>

      <div>
        <label htmlFor="sandi-masuk" className="block text-sm font-medium text-foreground">
          Password
        </label>
        <input
          id="sandi-masuk"
          type="password"
          autoComplete="current-password"
          required
          minLength={8}
          value={kata_sandi}
          onChange={(e) => set_kata_sandi(e.target.value)}
          className="input-field"
          placeholder="••••••••"
        />
      </div>

      <button
        type="submit"
        disabled={sedang_memuat}
        className="btn-primary w-full py-3"
      >
        {sedang_memuat ? 'Signing in…' : 'Sign in'}
      </button>

      <p className="text-center text-sm text-muted">
        No account yet?{' '}
        <Link href="/signup" className="font-medium text-accent hover:underline">
          Create one
        </Link>
      </p>
    </form>
  );
}
