import { PlaceholderFitur } from '@/components/placeholder-fitur';

export default function HalamanPengaturan() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">Alert preferences and caregiver sharing.</p>

      <div className="mt-8">
        <PlaceholderFitur
          judul="Preferences & caregivers"
          deskripsi="Email notifications, alert frequency, and invite links for family members."
          label_hari="Day 10"
        />
      </div>
    </div>
  );
}
