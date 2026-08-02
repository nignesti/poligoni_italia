import { getRangeForGestore } from '@poligoni/db/queries/gestore';
import { getManagedRange } from '@/lib/gestore-auth';
import { updateGestoreRangeAction } from '../actions';
import { NoManagedRange } from '../NoManagedRange';
import { StrutturaForm } from './StrutturaForm';

export default async function StrutturaPage() {
  const range = await getManagedRange();
  if (!range) return <NoManagedRange />;

  const detail = await getRangeForGestore(range.id);
  if (!detail) return <NoManagedRange />;

  return (
    <div>
      <h1 className="gest-page-title">Scheda struttura</h1>
      <p className="gest-page-subtitle">{range.name} — Dati anagrafici</p>

      <StrutturaForm initial={detail} action={updateGestoreRangeAction} />

      <style>{`
        .str-form { display: flex; flex-direction: column; gap: var(--space-6); }
        .str-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-4); }
        .str-field { display: flex; flex-direction: column; gap: var(--space-1); }
        .str-field label { font-size: 0.8125rem; font-weight: 600; color: var(--color-gray-600); }
        .str-input {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: white;
        }
        .str-input:focus { outline: none; border-color: var(--color-green-500); box-shadow: 0 0 0 3px var(--color-green-100); }
        .str-footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-4); }
        .str-error { font-size: 0.875rem; color: var(--color-red-600, #dc2626); font-weight: 600; }

        @media (max-width: 768px) {
          .str-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
