export default function LoadingObat() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="h-8 w-36 rounded-xl bg-slate-200" />
      <div className="mt-2 h-4 w-80 rounded-lg bg-slate-100" />

      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <div className="h-4 w-40 rounded-lg bg-slate-100" />
          <div className="h-10 w-36 rounded-xl bg-slate-200" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="h-5 w-1/3 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-1/4 rounded-lg bg-slate-100" />
            <div className="mt-4 flex gap-2">
              <div className="h-8 w-16 rounded-lg bg-slate-100" />
              <div className="h-8 w-16 rounded-lg bg-slate-100" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
