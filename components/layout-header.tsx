import { BrandLogo } from '@/components/brand-logo';

export function LayoutHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-card/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <BrandLogo ukuran={36} prioritas />
          <span className="text-lg font-semibold tracking-tight text-foreground">MediGuard AI</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm font-medium text-muted sm:flex" aria-label="Main">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#preview" className="transition-colors hover:text-foreground">
            See it in action
          </a>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="/login"
            className="hidden rounded-xl border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-50 sm:inline-flex"
          >
            Sign in
          </a>
          <a
            href="/signup"
            className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
