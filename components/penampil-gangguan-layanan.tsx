type PropsPenampilGangguan = {
  judul?: string;
  pesan: string;
  saran?: string[];
};

/**
 * Peringatan server-side bila Supabase/query gagal — bukan error boundary.
 */
export function PenampilGangguanLayanan({
  judul = 'Some dashboard data could not be loaded',
  pesan,
  saran = [
    'Check that Supabase is running and migrations are applied.',
    'Verify NEXT_PUBLIC_SUPABASE_URL and keys in .env.local.',
    'Run health check: GET /api/health/db',
  ],
}: PropsPenampilGangguan) {
  return (
    <div
      className="rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4"
      role="status"
    >
      <p className="text-sm font-semibold text-amber-900">{judul}</p>
      <p className="mt-2 text-sm text-amber-800">{pesan}</p>
      <ul className="mt-3 list-inside list-disc space-y-1 text-xs text-amber-800/90">
        {saran.map((baris) => (
          <li key={baris}>{baris}</li>
        ))}
      </ul>
    </div>
  );
}
