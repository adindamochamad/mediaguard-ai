import { BrandLogo } from '@/components/brand-logo';

export function LayoutHeader() {
  return (
    <header className="header-kaca sticky top-0 z-50">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" className="flex items-center gap-2.5">
          <BrandLogo ukuran={34} prioritas />
          <span className="text-base font-semibold tracking-tight text-foreground">MediGuard AI</span>
        </a>
        <nav className="hidden items-center gap-8 text-sm text-muted sm:flex" aria-label="Main">
          <a href="#features" className="transition-colors hover:text-foreground">
            Features
          </a>
          <a href="#preview" className="transition-colors hover:text-foreground">
            Preview
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <a
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-muted transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </a>
          <a href="/signup" className="btn-primary !px-4 !py-2">
            Get started
          </a>
        </div>
      </div>
    </header>
  );
}
