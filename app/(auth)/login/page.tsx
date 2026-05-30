import { Suspense } from 'react';
import { LayoutAuth } from '@/components/layout-auth';
import { FormMasuk } from '@/components/form-masuk';

export default function HalamanMasuk() {
  return (
    <LayoutAuth
      judul="Welcome back"
      deskripsi="Sign in to view your medication safety alerts."
    >
      <Suspense fallback={<p className="text-center text-sm text-muted">Loading…</p>}>
        <FormMasuk />
      </Suspense>
    </LayoutAuth>
  );
}