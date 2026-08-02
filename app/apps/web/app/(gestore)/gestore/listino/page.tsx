import { listPricingForGestore, listServicesForGestore } from '@poligoni/db/queries/gestore';
import { getManagedRange } from '@/lib/gestore-auth';
import { updateGestoreListinoAction } from '../actions';
import { NoManagedRange } from '../NoManagedRange';
import { ListinoForm } from './ListinoForm';

export default async function ListinoPage() {
  const range = await getManagedRange();
  if (!range) return <NoManagedRange />;

  const [pricing, services] = await Promise.all([
    listPricingForGestore(range.id),
    listServicesForGestore(range.id),
  ]);

  return (
    <div>
      <h1 className="gest-page-title">Listino e servizi</h1>
      <p className="gest-page-subtitle">Prezzi, servizi disponibili e dotazioni</p>

      <ListinoForm initialPricing={pricing} initialServices={services} action={updateGestoreListinoAction} />

      <style>{`
        .ch-error { font-size: 0.875rem; color: var(--color-red-600, #dc2626); font-weight: 600; margin: 0 0 var(--space-4); }
        .listino-table-wrap { overflow-x: auto; margin-top: var(--space-4); }
        .listino-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .listino-table th { text-align: left; font-weight: 600; color: var(--color-gray-500); padding: var(--space-3) var(--space-2); border-bottom: 1px solid var(--color-gray-200); }
        .listino-table td { padding: var(--space-2); border-bottom: 1px solid var(--color-gray-100); }
        .listino-input {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          width: 100%;
          min-width: 140px;
          background: white;
        }
        .listino-input:focus { outline: none; border-color: var(--color-green-500); }
        .listino-price { width: 100px; min-width: 100px; text-align: right; }
        .listino-add { margin-top: var(--space-3); font-size: 0.875rem; }
        .listino-remove { background: none; border: none; color: var(--color-gray-400); font-size: 1rem; cursor: pointer; padding: var(--space-2); }
        .listino-remove:hover { color: var(--color-red-500); }

        .serv-list { display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4); }
        .serv-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-gray-100); }
        .serv-toggle { background: none; border: none; font-size: 1rem; cursor: pointer; padding: var(--space-1); }
        .serv-name-input {
          font-size: 0.875rem; flex: 1;
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          background: white;
        }
        .serv-name-input:focus { outline: none; border-color: var(--color-green-500); }
        .serv-price-input {
          font-size: 0.8125rem; width: 110px;
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          background: white;
        }
        .serv-price-input:focus { outline: none; border-color: var(--color-green-500); }
        .str-footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-4); }
      `}</style>
    </div>
  );
}
