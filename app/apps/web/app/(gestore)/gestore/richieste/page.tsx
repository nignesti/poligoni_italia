'use client';

import { useState } from 'react';

interface Request {
  id: number;
  name: string;
  email: string;
  phone: string;
  date: string;
  message: string;
  status: 'nuova' | 'contattata' | 'archiviata';
}

const INITIAL_REQUESTS: Request[] = [
  {
    id: 1,
    name: 'Marco Rossi',
    email: 'marco.rossi@email.it',
    phone: '+39 333 1234567',
    date: '2026-08-15',
    message: 'Buongiorno, vorrei prenotare una linea da 25 m per sabato 15 agosto, possibilmente al mattino. Grazie!',
    status: 'nuova',
  },
  {
    id: 2,
    name: 'Luca Bianchi',
    email: 'luca.b@email.it',
    phone: '+39 334 7654321',
    date: '2026-08-20',
    message: 'Sarei interessato a provare il tiro da 50 m. Avete disponibilità per il 20 agosto?',
    status: 'nuova',
  },
  {
    id: 3,
    name: 'Giuseppe Verdi',
    email: 'g.verdi@email.it',
    phone: '',
    date: '2026-08-10',
    message: 'Richiedo informazioni per un corso introduttivo al tiro sportivo.',
    status: 'contattata',
  },
];

export default function RichiestePage() {
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const updateStatus = (id: number, status: Request['status']) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r)),
    );
  };

  const statusLabels: Record<string, string> = {
    nuova: 'Nuova',
    contattata: 'Contattata',
    archiviata: 'Archiviata',
  };

  const sorted = [...requests].sort((a, b) => {
    if (a.status === 'nuova' && b.status !== 'nuova') return -1;
    if (b.status === 'nuova' && a.status !== 'nuova') return 1;
    return 0;
  });

  return (
    <div>
      <h1 className="gest-page-title">Richieste in arrivo</h1>
      <p className="gest-page-subtitle">
        {requests.filter((r) => r.status === 'nuova').length} richieste da gestire
      </p>

      {sorted.length === 0 ? (
        <section className="gest-section">
          <p className="rich-empty">Nessuna richiesta.</p>
        </section>
      ) : (
        <div className="rich-list">
          {sorted.map((r) => (
            <div key={r.id} className={`rich-card rich-${r.status}`}>
              <div className="rich-header">
                <div className="rich-user">
                  <span className="rich-name">{r.name}</span>
                  <span className={`rich-badge rich-badge-${r.status}`}>
                    {statusLabels[r.status]}
                  </span>
                </div>
                <span className="rich-date">
                  Richiesta per il {new Date(r.date).toLocaleDateString('it-IT')}
                </span>
              </div>

              <div className="rich-contacts">
                <a href={`mailto:${r.email}`} className="rich-contact">✉️ {r.email}</a>
                {r.phone && (
                  <a href={`tel:${r.phone}`} className="rich-contact">📞 {r.phone}</a>
                )}
              </div>

              <p className="rich-message">{r.message}</p>

              <div className="rich-actions">
                {r.status === 'nuova' && (
                  <>
                    <button
                      className="btn btn-primary"
                      onClick={() => updateStatus(r.id, 'contattata')}
                    >
                      Segna come contattata
                    </button>
                    <button
                      className="btn btn-ghost"
                      onClick={() => updateStatus(r.id, 'archiviata')}
                    >
                      Archivia
                    </button>
                  </>
                )}
                {r.status === 'contattata' && (
                  <button
                    className="btn btn-ghost"
                    onClick={() => updateStatus(r.id, 'archiviata')}
                  >
                    Archivia
                  </button>
                )}
              </div>
            </div>
          ))}
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
        .rich-contattata { border-left: 4px solid var(--color-amber-400, #fbbf24); }
        .rich-archiviata { opacity: 0.7; }
        .rich-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: var(--space-3); flex-wrap: wrap; gap: var(--space-2); }
        .rich-user { display: flex; align-items: center; gap: var(--space-3); }
        .rich-name { font-weight: 600; font-size: 1rem; }
        .rich-badge { font-size: 0.6875rem; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; padding: var(--space-1) var(--space-2); border-radius: var(--radius-sm); }
        .rich-badge-nuova { background: var(--color-green-100); color: var(--color-green-700); }
        .rich-badge-contattata { background: var(--color-amber-100, #fef3c7); color: var(--color-amber-700, #92400e); }
        .rich-badge-archiviata { background: var(--color-gray-100); color: var(--color-gray-500); }
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
