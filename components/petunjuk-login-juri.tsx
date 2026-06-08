type PropsPetunjuk = {
  email_demo: string;
  sandi_demo: string;
};

/** Petunjuk login untuk juri hackathon — email + password ditampilkan langsung. */
export function PetunjukLoginJuri({ email_demo, sandi_demo }: PropsPetunjuk) {
  return (
    <div
      role="note"
      className="rounded-xl border border-accent/25 bg-accent-soft/50 px-4 py-3 text-sm text-foreground"
    >
      <p className="font-semibold text-accent">Judge demo account</p>
      <p className="mt-1 text-muted">
        Pre-seeded with 9 medications and 9 alerts. Credentials are pre-filled below — click Sign
        in.
      </p>
      <dl className="mt-3 space-y-1.5 font-mono text-xs">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-sans font-medium text-muted">Email</dt>
          <dd className="text-foreground">{email_demo}</dd>
        </div>
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-sans font-medium text-muted">Password</dt>
          <dd className="text-foreground">{sandi_demo}</dd>
        </div>
      </dl>
    </div>
  );
}
