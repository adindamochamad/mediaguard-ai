export default function LoadingRiwayatScan() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse space-y-6">
      <div className="h-8 w-48 rounded-lg bg-stone-200" />
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-stone-100" />
        ))}
      </div>
      <div className="h-64 rounded-2xl bg-stone-100" />
    </div>
  );
}
