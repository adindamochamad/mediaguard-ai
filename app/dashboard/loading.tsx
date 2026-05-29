export default function LoadingDashboard() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="h-8 w-24 rounded-xl bg-slate-200" />
          <div className="mt-2 h-4 w-64 rounded-lg bg-slate-100" />
        </div>
        <div className="h-10 w-28 rounded-xl bg-slate-200" />
      </div>

      <div className="mt-8 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex gap-2">
              <div className="h-5 w-16 rounded-lg bg-slate-200" />
              <div className="h-5 w-20 rounded-lg bg-slate-100" />
            </div>
            <div className="mt-3 h-5 w-3/4 rounded-lg bg-slate-200" />
            <div className="mt-2 h-4 w-full rounded-lg bg-slate-100" />
            <div className="mt-1 h-4 w-2/3 rounded-lg bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}
