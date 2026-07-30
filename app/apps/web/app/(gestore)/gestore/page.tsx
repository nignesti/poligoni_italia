'use client';

import Link from 'next/link';

// ---------------------------------------------------------------------------
// Dashboard Home
// ---------------------------------------------------------------------------
const STATS = [
  { label: 'Prenotazioni oggi', value: '7', change: '+3', positive: true },
  { label: 'Richieste in arrivo', value: '4', change: '+2', positive: true },
  { label: 'Occupazione linee', value: '68%', change: '+12%', positive: true },
  { label: 'Recensioni', value: '4.8★', change: '', positive: true },
];

const RECENT_BOOKINGS = [
  { name: 'Marco Rossi', line: '25 m coperta', time: '09:00–10:00', status: 'confermata' },
  { name: 'Luca Bianchi', line: '50 m coperta', time: '10:00–11:30', status: 'confermata' },
  { name: 'Giuseppe Verdi', line: '10 m coperta', time: '11:00–12:00', status: 'richiesta' },
  { name: 'Andrea Ferrari', line: '25 m coperta', time: '14:00–15:00', status: 'completata' },
];

export default function DashboardPage() {
  return (
    <div>
      <h1 className="gest-page-title">Dashboard</h1>
      <p className="gest-page-subtitle">TSN Milano — Riepilogo di oggi</p>

      {/* Statistiche */}
      <div className="gest-stats-grid">
        {STATS.map((s) => (
          <div key={s.label} className="gest-stat-card">
            <p className="gest-stat-value">{s.value}</p>
            <p className="gest-stat-label">{s.label}</p>
            {s.change && (
              <span className={`gest-stat-change ${s.positive ? 'positive' : ''}`}>
                {s.change}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* Prenotazioni recenti */}
      <section className="gest-section">
        <div className="gest-section-header">
          <h2>Prenotazioni di oggi</h2>
          <Link href="/gestore/richieste" className="gest-link">Vedi tutte</Link>
        </div>
        <div className="gest-table-wrap">
          <table className="gest-table">
            <thead>
              <tr>
                <th>Tiratore</th>
                <th>Linea</th>
                <th>Orario</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {RECENT_BOOKINGS.map((b) => (
                <tr key={`${b.name}-${b.time}`}>
                  <td className="gest-td-name">{b.name}</td>
                  <td>{b.line}</td>
                  <td>{b.time}</td>
                  <td>
                    <span className={`gest-badge gest-badge-${b.status}`}>
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Link rapidi */}
      <section className="gest-section">
        <h2>Azioni rapide</h2>
        <div className="gest-actions">
          <Link href="/gestore/orari" className="gest-action-card">
            <span className="gest-action-icon">🕐</span>
            <span>Gestisci orari</span>
          </Link>
          <Link href="/gestore/chiusure" className="gest-action-card">
            <span className="gest-action-icon">🔒</span>
            <span>Aggiungi chiusura</span>
          </Link>
          <Link href="/gestore/listino" className="gest-action-card">
            <span className="gest-action-icon">💰</span>
            <span>Aggiorna listino</span>
          </Link>
          <Link href="/gestore/struttura" className="gest-action-card">
            <span className="gest-action-icon">🏠</span>
            <span>Modifica scheda</span>
          </Link>
        </div>
      </section>

      <style>{`
        .gest-page-title { font-size: 1.5rem; margin-bottom: var(--space-1); }
        .gest-page-subtitle { color: var(--color-gray-500); margin-bottom: var(--space-8); font-size: 0.875rem; }

        .gest-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-8); }
        .gest-stat-card { background: white; border-radius: var(--radius-xl); padding: var(--space-6); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); }
        .gest-stat-value { font-size: 2rem; font-weight: 700; color: var(--color-gray-900); }
        .gest-stat-label { font-size: 0.8125rem; color: var(--color-gray-500); margin-top: var(--space-1); }
        .gest-stat-change { font-size: 0.75rem; font-weight: 600; color: var(--color-green-600); display: inline-block; margin-top: var(--space-1); }

        .gest-section { background: white; border-radius: var(--radius-xl); padding: var(--space-6); margin-bottom: var(--space-6); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); }
        .gest-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
        .gest-section h2 { font-size: 1rem; }
        .gest-link { font-size: 0.8125rem; color: var(--color-green-600); font-weight: 600; text-decoration: none; }
        .gest-link:hover { text-decoration: underline; }

        .gest-table-wrap { overflow-x: auto; }
        .gest-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .gest-table th { text-align: left; font-weight: 600; color: var(--color-gray-500); padding: var(--space-3) var(--space-2); border-bottom: 1px solid var(--color-gray-200); white-space: nowrap; }
        .gest-table td { padding: var(--space-3) var(--space-2); border-bottom: 1px solid var(--color-gray-100); white-space: nowrap; }
        .gest-td-name { font-weight: 600; color: var(--color-gray-800); }

        .gest-badge { font-size: 0.75rem; padding: var(--space-1) var(--space-2); border-radius: var(--radius-md); font-weight: 600; }
        .gest-badge-confermata { background: var(--color-green-100); color: var(--color-green-700); }
        .gest-badge-richiesta { background: var(--color-amber-100, #fef3c7); color: var(--color-amber-700, #92400e); }
        .gest-badge-completata { background: var(--color-gray-100); color: var(--color-gray-600); }

        .gest-actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: var(--space-4); margin-top: var(--space-4); }
        .gest-action-card { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); text-decoration: none; color: var(--color-gray-700); font-size: 0.875rem; font-weight: 500; transition: border-color 0.15s; }
        .gest-action-card:hover { border-color: var(--color-green-400); }
        .gest-action-icon { font-size: 1.25rem; }

        @media (max-width: 768px) {
          .gest-content { padding: var(--space-4); }
          .gest-stats-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
