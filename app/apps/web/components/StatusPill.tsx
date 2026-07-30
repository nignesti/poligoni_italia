/**
 * Indicatore di apertura. Il pallino colorato è ammesso qui perché conveys
 * stato semantico reale (aperto/chiuso), non decorazione - l’unica eccezione
 * prevista dalla skill al divieto generale sui pallini decorativi.
 */
export function StatusPill({ open, label }: { open: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
        open
          ? 'bg-state-success/10 text-state-success'
          : 'bg-ink-faint/10 text-ink-muted'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-state-success' : 'bg-ink-faint'}`}
        aria-hidden
      />
      {label}
    </span>
  );
}
