import Link from 'next/link';
import { getGestoreDashboardSummary } from '@poligoni/db/queries/gestore';
import { getManagedRange } from '@/lib/gestore-auth';
import { NoManagedRange } from './NoManagedRange';

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

export default async function DashboardPage() {
  const range = await getManagedRange();
  if (!range) return <NoManagedRange />;
  const summary = await getGestoreDashboardSummary(range.id);

  return (
    <div>
      <h1 className="gest-page-title">Dashboard</h1>
      <p className="gest-page-subtitle">{range.name} — Riepilogo</p>

      {/* Statistiche: solo conteggi reali — niente prenotazioni o recensioni
          finte, quel sistema non esiste ancora (vedi nota in queries/gestore.ts) */}
      <div className="gest-stats-grid">
        <div className="gest-stat-card">
          <p className="gest-stat-value">{summary.pendingRequests}</p>
          <p className="gest-stat-label">Richieste in attesa</p>
        </div>
        <div className="gest-stat-card">
          <p className="gest-stat-value">{summary.hoursConfigured}</p>
          <p className="gest-stat-label">Fasce orarie configurate</p>
        </div>
        <div className="gest-stat-card">
          <p className="gest-stat-value">{summary.pricingItems}</p>
          <p className="gest-stat-label">Voci di listino</p>
        </div>
        <div className="gest-stat-card">
          <p className="gest-stat-value">
            {summary.nextClosure ? formatDate(summary.nextClosure.dateFrom) : '—'}
          </p>
          <p className="gest-stat-label">
            {summary.nextClosure ? `Prossima chiusura — ${summary.nextClosure.reason}` : 'Nessuna chiusura programmata'}
          </p>
        </div>
      </div>

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

        .gest-section { background: white; border-radius: var(--radius-xl); padding: var(--space-6); margin-bottom: var(--space-6); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); }
        .gest-section h2 { font-size: 1rem; margin-bottom: var(--space-4); }

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
