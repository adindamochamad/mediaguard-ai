export function LayoutFooter() {
  return (
    <footer className="border-t border-border px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} MediGuard AI · Not medical advice — consult a clinician or
          pharmacist for treatment decisions.
        </p>
        <p className="text-xs text-muted">
          Nimble live web + Claude personalization · Sources linked, not reproduced in full.
        </p>
      </div>
    </footer>
  );
}
