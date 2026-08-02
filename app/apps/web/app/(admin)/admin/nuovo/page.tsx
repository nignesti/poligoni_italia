import Link from 'next/link';
import { RangeForm } from '../RangeForm';
import { createRangeAction } from '../actions';

export default function NewRangePage() {
  return (
    <div>
      <Link href="/admin" className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover">
        ← Tutte le strutture
      </Link>
      <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-ink">Nuova struttura</h1>
      <p className="mt-1 text-sm text-ink-muted">
        I campi con * sono obbligatori. Se non conosci un dato, lascialo vuoto — meglio vuoto che inventato.
      </p>

      <div className="mt-8">
        <RangeForm mode="create" action={createRangeAction} />
      </div>
    </div>
  );
}
