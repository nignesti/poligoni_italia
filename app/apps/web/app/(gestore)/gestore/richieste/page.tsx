import { listBookingRequestsForGestore } from '@poligoni/db/queries/gestore';
import { getManagedRange } from '@/lib/gestore-auth';
import { markGestoreRequestAction } from '../actions';
import { NoManagedRange } from '../NoManagedRange';

const OUTCOME_LABELS: Record<string, string> = {
  confermata: 'Confermata',
  rifiutata: 'Rifiutata',
  nessuna_risposta: 'Nessuna risposta',
};

export default async function RichiestePage() {
  const range = await getManagedRange();
  if (!range) return <NoManagedRange />;

  const requests = await listBookingRequestsForGestore(range.id);
  const pending = requests.filter((r) => !r.outcome);
  // Nuove prima, poi le già gestite.
  const sorted = [...requests].sort((a, b) => (a.outcome ? 1 : 0) - (b.outcome ? 1 : 0));

  return (
    <div>
      <h1 className="gest-page-title">Richieste in arrivo</h1>
      <p className="gest-page-subtitle">{pending.length} richieste da gestire</p>

      {sorted.length === 0 ? (
        <section className="gest-section">
          <p className="rich-empty">
            Nessuna richiesta ancora. Le richieste arrivano da un modulo pubblico sul sito, non ancora
            costruito — quando ci sarà, compariranno qui.
          </p>
        </section>
      ) : (
        <div className="rich-list">
          {sorted.map((r) => {
            const status = r.outcome ?? 'nuova';
            return (
              <div key={r.id} className={`rich-card rich-${r.outcome ? 'gestita' : 'nuova'}`}>
                <div className="rich-header">
                  <div className="rich-user">
                    <span className="rich-name">{r.name}</span>
                    <span className={`rich-badge rich-badge-${r.outcome ? 'gestita' : 'nuova'}`}>
                      {r.outcome ? OUTCOME_LABELS[r.outcome] ?? r.outcome : 'Nuova'}
                    </span>
                  </div>
                  <span className="rich-date">
                    Richiesta per il {new Date(r.requestedFor).toLocaleDateString('it-IT')}
                  </span>
                </div>

                <div className="rich-contacts">
                  <a href={`mailto:${r.email}`} className="rich-contact">
                    ✉️ {r.email}
                  </a>
                  {r.phone && (
                    <a href={`tel:${r.phone}`} className="rich-contact">
                      📞 {r.phone}
                    </a>
                  )}
                </div>

                {r.message && <p className="rich-message">{r.message}</p>}

                {status === 'nuova' && (
                  <div className="rich-actions">
                    <form action={markGestoreRequestAction}>
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="outcome" value="confermata" />
                      <button type="submit" className="btn btn-primary">
                        Conferma
                      </button>
                    </form>
                    <form action={markGestoreRequestAction}>
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="outcome" value="rifiutata" />
                      <button type="submit" className="btn btn-ghost">
                        Rifiuta
                      </button>
                    </form>
                    <form action={markGestoreRequestAction}>
                      <input type="hidden" name="requestId" value={r.id} />
                      <input type="hidden" name="outcome" value="nessuna_risposta" />
                      <button type="submit" className="btn btn-ghost">
                        Nessuna risposta
                      </button>
                    </form>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        .rich-empty { color: var(--color-gray-500); font-size: 0.875rem; padding: var(--space-8) 0; text-align: center; }
        .rich-list { display: flex; flex-direction: column; gap: var(--space-4); }
        .rich-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-6);
          border: 1px solid var(--color-gray-200);
          box-shadow: var(--shadow-sm);
        }
        .rich-nuova { border-left: 4px solid var(--color-green-500); }
        .rich-gestita { opacity: 0.7; }
        .rich-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2); }
        .rich-user { display: flex; align-items: center; gap: var(--space-3); }
        .rich-name { font-weight: 600; font-size: 1rem; }
        .rich-badge { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); }
        .rich-badge-nuova { background: var(--color-green-100); color: var(--color-green-700); }
        .rich-badge-gestita { background: var(--color-gray-100); color: var(--color-gray-500); }
        .rich-date { font-size: 0.8125rem; color: var(--color-gray-500); }
        .rich-contacts { display: flex; gap: var(--space-4); margin-bottom: var(--space-3); flex-wrap: wrap; }
        .rich-contact { font-size: 0.8125rem; color: var(--color-green-600); text-decoration: none; }
        .rich-contact:hover { text-decoration: underline; }
        .rich-message { font-size: 0.875rem; color: var(--color-gray-600); line-height: 1.6; margin-bottom: var(--space-4); background: var(--color-gray-50); padding: var(--space-3); border-radius: var(--radius-lg); }
        .rich-actions { display: flex; gap: var(--space-3); }
      `}</style>
    </div>
  );
}
