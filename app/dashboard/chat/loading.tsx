export default function LoadingChat() {
  return (
    <div className="mx-auto max-w-4xl animate-pulse">
      <div className="h-8 w-40 rounded-xl bg-slate-200" />
      <div className="mt-2 h-4 w-96 rounded-lg bg-slate-100" />

      <div className="mt-8 rounded-2xl border border-border bg-card p-5">
        <div className="h-4 w-48 rounded-lg bg-slate-200" />
        <div className="mt-3 h-20 w-full rounded-xl bg-slate-100" />
        <div className="mt-3 h-9 w-20 rounded-xl bg-slate-200" />
      </div>
    </div>
  );
}
