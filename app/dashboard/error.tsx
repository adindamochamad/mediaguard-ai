'use client';

import { useEffect } from 'react';

export default function ErrorDashboard({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[dashboard] unhandled error:', error.message);
  }, [error]);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex flex-col items-center rounded-2xl border border-red-200 bg-red-50 px-6 py-12 text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-red-600">
          Something went wrong
        </p>
        <h2 className="mt-2 text-xl font-semibold text-foreground">Page failed to load</h2>
        <p className="mt-3 max-w-sm text-sm text-muted">
          An unexpected error occurred. Your data is safe — try refreshing the page.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
