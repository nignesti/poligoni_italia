/**
 * Indicatore di apertura. Il pallino colorato è ammesso qui perché conveys
 * stato semantico reale (aperto/chiuso), non decorazione - l’unica eccezione
 * prevista dalla skill al divieto generale sui pallini decorativi.
 *
 * `open: null` (orari non a sistema) è uno stato distinto da "chiuso": va
 * reso in modo neutro, mai come "Chiuso" — vedi todayStatus() in lib/format.ts.
 */
export function StatusPill({ open, label }: { open: boolean | null; label: string }) {
  const tone =
    open === true
      ? 'bg-state-success-wash text-state-success'
      : open === false
        ? 'bg-state-error-wash text-state-error'
        : 'bg-ink-faint/10 text-ink-muted';
  const dot = open === true ? 'bg-state-success' : open === false ? 'bg-state-error' : 'bg-ink-faint';

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold uppercase tracking-wide ${tone}`}>
      {open !== null && <span className={`h-1.5 w-1.5 rounded-full ${dot}`} aria-hidden />}
      {label}
    </span>
  );
}
