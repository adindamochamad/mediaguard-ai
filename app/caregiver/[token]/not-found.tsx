import Link from 'next/link';

export default function KaregiverTidakDitemukan() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-border bg-card/80 px-6 py-4">
        <div className="mx-auto max-w-4xl">
          <span className="text-base font-semibold text-foreground">MediGuard AI</span>
        </div>
      </header>

      <main className="mx-auto flex max-w-4xl flex-col items-center px-6 py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-muted">Access denied</p>
        <h1 className="mt-3 text-2xl font-semibold text-foreground">
          This link is invalid or has expired
        </h1>
        <p className="mt-4 max-w-sm text-sm text-muted">
          The caregiver access link you followed doesn&apos;t exist or has been revoked by the
          account owner.
        </p>
        <Link
          href="/"
          className="mt-8 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Go to MediGuard
        </Link>
      </main>
    </div>
  );
}
