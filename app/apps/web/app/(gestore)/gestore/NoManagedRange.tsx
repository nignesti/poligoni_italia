import Link from 'next/link';

/** Stato per un account loggato ma senza righe in range_managers — non un errore, un caso valido. */
export function NoManagedRange() {
  return (
    <div className="gest-section" style={{ textAlign: 'center', padding: 'var(--space-10)' }}>
      <h1 className="gest-page-title">Nessuna struttura associata</h1>
      <p className="gest-page-subtitle" style={{ marginBottom: 'var(--space-6)' }}>
        Il tuo account non risulta gestore di nessuna struttura. Se pensi sia un errore, contatta chi
        amministra il sito, oppure rivendica la tua struttura.
      </p>
      <Link href="/gestore/rivendica" className="btn btn-primary">
        Rivendica la tua struttura
      </Link>
    </div>
  );
}
