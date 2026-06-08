import { apakah_mode_demo_scan } from '@/lib/konfigurasi-mode-demo';

type PropsBanner = {
  /** Konteks halaman — teks disesuaikan. */
  konteks?: 'dashboard' | 'chat';
};

export function BannerModeDemoHybrid({ konteks = 'dashboard' }: PropsBanner) {
  if (!apakah_mode_demo_scan()) return null;

  const teks_dashboard =
    'Stage demo mode: Scan Now inserts cached FDA-style alerts in ~1 second (Realtime still fires). ' +
    'For live Nimble web intelligence, open AI Chat — Claude calls FDA Extract, Search, and PubMed tools in real time.';

  const teks_chat =
    'Live Nimble integration — Claude will call FDA Extract, medical news Search, and PubMed Crawl before answering. ' +
    'Watch the tool status lines below as sources are fetched.';

  return (
    <div
      role="status"
      className="rounded-xl border border-amber-200/80 bg-amber-50/90 px-4 py-3 text-sm text-amber-950"
    >
      <p className="font-semibold text-amber-900">
        {konteks === 'chat' ? 'Live Nimble · Agentic chat' : 'Hybrid demo · Scan cached · Chat live'}
      </p>
      <p className="mt-1 leading-relaxed text-amber-900/90">
        {konteks === 'chat' ? teks_chat : teks_dashboard}
      </p>
    </div>
  );
}
