import { PanelKosongPeringatan } from '@/components/panel-kosong-peringatan';

export default function HalamanDashboard() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">Alerts</h1>
          <p className="mt-1 text-sm text-muted">
            Personalized safety updates for your medication list.
          </p>
        </div>

        <div className="flex flex-col items-start gap-2 sm:items-end">
          <button
            type="button"
            disabled
            title="Scan pipeline ships on Day 6"
            className="inline-flex cursor-not-allowed items-center rounded-xl bg-accent/50 px-5 py-2.5 text-sm font-semibold text-white opacity-70"
          >
            Scan now
          </button>
          <p className="text-xs text-muted">Last scanned: not yet</p>
        </div>
      </div>

      <div className="mt-8">
        <PanelKosongPeringatan />
      </div>
    </div>
  );
}
