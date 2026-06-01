export function LayoutFooter() {
  return (
    <footer className="section-kaca px-6 py-12">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} MediGuard AI
        </p>
        <p className="mt-2 max-w-2xl text-xs leading-relaxed text-stone-400">
          Not medical advice — consult a clinician or pharmacist for treatment decisions.
          Sources linked, not reproduced in full.
        </p>
      </div>
    </footer>
  );
}
