import { listRangeHoursForAdmin } from '@poligoni/db/queries/admin-ranges';
import { getManagedRange } from '@/lib/gestore-auth';
import { updateGestoreHoursAction } from '../actions';
import { NoManagedRange } from '../NoManagedRange';
import { OrariForm } from './OrariForm';

export default async function OrariPage() {
  const range = await getManagedRange();
  if (!range) return <NoManagedRange />;

  const hours = await listRangeHoursForAdmin(range.id);

  return (
    <div>
      <h1 className="gest-page-title">Orari di apertura</h1>
      <p className="gest-page-subtitle">Gestisci gli orari ricorrenti della struttura</p>

      <section className="gest-section">
        <h2>Orari settimanali</h2>
        <OrariForm initial={hours} action={updateGestoreHoursAction} />
      </section>

      <style>{`
        .orari-list { display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4); }
        .orari-day {
          display: flex; align-items: flex-start; gap: var(--space-4);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-gray-100);
        }
        .orari-day-name { width: 120px; font-weight: 600; font-size: 0.875rem; color: var(--color-gray-700); flex-shrink: 0; padding-top: var(--space-1); }
        .orari-slots { display: flex; flex-direction: column; gap: var(--space-2); flex: 1; }
        .orari-slot { display: flex; align-items: center; gap: var(--space-2); }
        .orari-closed { font-size: 0.8125rem; color: var(--color-gray-400); padding-top: var(--space-1); }
        .orari-time {
          padding: var(--space-1) var(--space-2);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          font-family: var(--font-mono, monospace);
          background: white;
          width: 90px;
        }
        .orari-time:focus { outline: none; border-color: var(--color-green-500); }
        .orari-sep { color: var(--color-gray-400); font-size: 0.875rem; }
        .orari-toggle {
          padding: var(--space-1) var(--space-2);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          background: white;
          font-size: 0.75rem;
          cursor: pointer;
          color: var(--color-gray-500);
        }
        .orari-toggle:hover { border-color: var(--color-red-300, #fca5a5); color: var(--color-red-600, #dc2626); }
        .orari-add {
          align-self: flex-start;
          background: none;
          border: none;
          padding: 0;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-green-600);
          cursor: pointer;
        }
        .orari-add:hover { text-decoration: underline; }
        .orari-error { font-size: 0.875rem; color: var(--color-red-600, #dc2626); font-weight: 600; margin: 0 0 var(--space-4); }
        .str-footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-4); margin-top: var(--space-6); }

        @media (max-width: 768px) {
          .orari-day { flex-direction: column; align-items: flex-start; gap: var(--space-2); }
        }
      `}</style>
    </div>
  );
}
