import { PlaceholderFitur } from '@/components/placeholder-fitur';

export default function HalamanChat() {
  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Ask MediGuard</h1>
      <p className="mt-1 text-sm text-muted">
        Chat with AI that can search live FDA and medical sources.
      </p>

      <div className="mt-8">
        <PlaceholderFitur
          judul="AI chat interface"
          deskripsi="Streaming answers with Nimble-powered web search and citations to primary sources."
          label_hari="Day 8"
        />
      </div>
    </div>
  );
}
