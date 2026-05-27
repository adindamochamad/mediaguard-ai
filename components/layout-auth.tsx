import Link from 'next/link';
import { BrandLogo } from '@/components/brand-logo';

type PropsLayoutAuth = {
  children: React.ReactNode;
  judul: string;
  deskripsi: string;
};

export function LayoutAuth({ children, judul, deskripsi }: PropsLayoutAuth) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/80 bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center px-6">
          <Link href="/" className="flex items-center gap-2.5">
            <BrandLogo ukuran={32} />
            <span className="text-lg font-semibold tracking-tight text-foreground">MediGuard AI</span>
          </Link>
        </div>
      </header>

      <main className="mx-auto flex max-w-md flex-col px-6 py-12 sm:py-16">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">{judul}</h1>
          <p className="mt-2 text-sm text-muted">{deskripsi}</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-soft sm:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
