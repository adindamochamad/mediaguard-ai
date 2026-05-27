import { DaftarObat } from '@/components/daftar-obat';

export default function HalamanObat() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Medications</h1>
      <p className="mt-1 text-sm text-muted">
        Manage the medications we monitor for you. Always confirm changes with your doctor or
        pharmacist.
      </p>

      <div className="mt-8">
        <DaftarObat />
      </div>
    </div>
  );
}
