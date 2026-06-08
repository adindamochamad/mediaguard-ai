import { Suspense } from 'react';
import { LayoutAuth } from '@/components/layout-auth';
import { FormMasuk } from '@/components/form-masuk';
import { PetunjukLoginJuri } from '@/components/petunjuk-login-juri';
import { email_demo_juri, sandi_demo_juri, tampilkan_petunjuk_login_juri } from '@/lib/konfigurasi-mode-demo';

export default function HalamanMasuk() {
  const tampilkan_petunjuk = tampilkan_petunjuk_login_juri();
  const email_demo = email_demo_juri();
  const sandi_demo = sandi_demo_juri();
  const kredensial_demo_lengkap = Boolean(tampilkan_petunjuk && email_demo && sandi_demo);

  return (
    <LayoutAuth
      judul="Welcome back"
      deskripsi="Sign in to view your medication safety alerts."
    >
      {kredensial_demo_lengkap ? (
        <div className="mb-6">
          <PetunjukLoginJuri email_demo={email_demo!} sandi_demo={sandi_demo!} />
        </div>
      ) : null}
      <Suspense fallback={<p className="text-center text-sm text-muted">Loading…</p>}>
        <FormMasuk
          email_demo_awal={kredensial_demo_lengkap ? email_demo! : undefined}
          sandi_demo_awal={kredensial_demo_lengkap ? sandi_demo! : undefined}
        />
      </Suspense>
    </LayoutAuth>
  );
}