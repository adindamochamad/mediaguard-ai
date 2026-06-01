export default function LoadingSettings() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="h-8 w-24 rounded-xl bg-slate-200" />
      <div className="mt-2 h-4 w-72 rounded-lg bg-slate-100" />

      <div className="mt-8 space-y-6">
        <div className="card-surface animate-pulse p-6">
          <div className="h-5 w-48 rounded-lg bg-slate-200" />
          <div className="mt-2 h-4 w-80 rounded-lg bg-slate-100" />
          <div className="mt-5 flex gap-3">
            <div className="h-10 flex-1 rounded-xl bg-slate-100" />
            <div className="h-10 w-20 rounded-xl bg-slate-200" />
          </div>
        </div>
        <div className="card-surface animate-pulse p-6">
          <div className="h-5 w-36 rounded-lg bg-slate-200" />
          <div className="mt-4 h-4 w-64 rounded-lg bg-slate-100" />
        </div>
      </div>
    </div>
  );
}
