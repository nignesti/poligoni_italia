import { listClosuresForGestore } from '@poligoni/db/queries/gestore';
import { getManagedRange } from '@/lib/gestore-auth';
import { updateGestoreClosuresAction } from '../actions';
import { NoManagedRange } from '../NoManagedRange';
import { ChiusureForm } from './ChiusureForm';

export default async function ChiusurePage() {
  const range = await getManagedRange();
  if (!range) return <NoManagedRange />;

  const closures = await listClosuresForGestore(range.id);

  return (
    <div>
      <h1 className="gest-page-title">Chiusure e gare</h1>
      <p className="gest-page-subtitle">Gestisci le chiusure straordinarie della struttura</p>

      <ChiusureForm initial={closures} action={updateGestoreClosuresAction} />

      <style>{`
        .ch-error { font-size: 0.875rem; color: var(--color-red-600, #dc2626); font-weight: 600; margin: 0 0 var(--space-4); }
        .ch-empty { color: var(--color-gray-500); font-size: 0.875rem; padding: var(--space-8) 0; text-align: center; }
        .ch-list { display: flex; flex-direction: column; gap: var(--space-3); margin-top: var(--space-4); }
        .ch-card { display: flex; justify-content: space-between; align-items: center; padding: var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); }
        .ch-info { display: flex; flex-direction: column; gap: var(--space-1); }
        .ch-dates { font-weight: 600; font-size: 0.875rem; }
        .ch-reason { font-size: 0.8125rem; color: var(--color-gray-600); }
        .ch-badge { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; background: var(--color-amber-100, #fef3c7); color: var(--color-amber-700, #92400e); padding: 2px var(--space-2); border-radius: var(--radius-sm); display: inline-block; width: fit-content; }
        .ch-remove { background: none; border: none; color: var(--color-gray-400); font-size: 1rem; cursor: pointer; padding: var(--space-2); }
        .ch-remove:hover { color: var(--color-red-500); }

        .ch-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 50; }
        .ch-modal { background: white; border-radius: var(--radius-2xl); padding: var(--space-8); width: 100%; max-width: 480px; box-shadow: var(--shadow-xl); }
        .ch-modal h3 { font-size: 1.25rem; margin-bottom: var(--space-6); }
        .ch-form { display: flex; flex-direction: column; gap: var(--space-4); }
        .ch-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); }
        .ch-checkbox { display: flex; align-items: center; gap: var(--space-2); font-size: 0.875rem; color: var(--color-gray-600); cursor: pointer; }
        .ch-form-actions { display: flex; justify-content: flex-end; gap: var(--space-3); margin-top: var(--space-2); }
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
      `}</style>
    </div>
  );
}
