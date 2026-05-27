type PropsPlaceholderFitur = {
  judul: string;
  deskripsi: string;
  label_hari: string;
};

export function PlaceholderFitur({ judul, deskripsi, label_hari }: PropsPlaceholderFitur) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-card/50 px-6 py-12 text-center">
      <span className="inline-flex rounded-full bg-accent-soft px-3 py-1 text-xs font-semibold text-accent">
        {label_hari}
      </span>
      <h2 className="mt-4 text-lg font-semibold text-foreground">{judul}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{deskripsi}</p>
    </div>
  );
}
