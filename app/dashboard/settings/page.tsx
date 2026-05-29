import { PanelKaregiver } from '@/components/panel-karegiver';

export default function HalamanPengaturan() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Settings</h1>
      <p className="mt-1 text-sm text-muted">Alert preferences and caregiver sharing.</p>

      <PanelKaregiver />
    </div>
  );
}
