'use client';

// ---------------------------------------------------------------------------
// Dashboard Gestore — Piano Premium (Piano_Sviluppo_App.md task 69, T5)
//
// Dati mock, come le altre schermate della dashboard gestore (nessuna di
// queste chiama ancora un'API: l'autenticazione Supabase, Piano §7.3 task 13,
// non è integrata). Il catalogo piani è quello reale pubblicato su
// /gestori — vedi PLANS in app/(public)/gestori/page.tsx — e le API in
// /api/v1/manage/billing/* sono pronte per quando questa schermata passerà a
// dati veri.
// ---------------------------------------------------------------------------

const CURRENT_PLAN = {
  name: 'Partner',
  priceLabel: '19 €/mese',
  renewsOn: '15 settembre 2026',
  autoRenew: true,
  features: [
    'Prenotazione online reale',
    'Linee illimitate',
    'Check-in QR',
    'Esportazione CSV/iCal',
    'Nessuna commissione',
  ],
};

const UPGRADE_FEATURES = [
  'Integrazione gestionale',
  'Statistiche di occupazione',
  'API dedicate',
  'Priorità di supporto',
];

interface Invoice {
  number: string;
  date: string;
  dueDate: string;
  amount: string;
  status: 'pagata' | 'emessa' | 'scaduta';
}

const INVOICES: Invoice[] = [
  { number: 'FT-2026-00003', date: '2026-07-15', dueDate: '2026-08-14', amount: '23,18 €', status: 'pagata' },
  { number: 'FT-2026-00002', date: '2026-06-15', dueDate: '2026-07-15', amount: '23,18 €', status: 'pagata' },
  { number: 'FT-2026-00001', date: '2026-05-15', dueDate: '2026-06-14', amount: '23,18 €', status: 'pagata' },
];

const STATUS_LABEL: Record<Invoice['status'], string> = {
  pagata: 'Pagata',
  emessa: 'Emessa',
  scaduta: 'Scaduta',
};

export default function PremiumPage() {
  return (
    <div>
      <h1 className="gest-page-title">Piano Premium</h1>
      <p className="gest-page-subtitle">Abbonamento, fatture e dati di fatturazione</p>

      <section className="gest-section">
        <div className="gest-section-header">
          <h2>Piano attuale</h2>
          <span className="gest-badge gest-badge-pagata">{CURRENT_PLAN.name}</span>
        </div>
        <div className="gest-plan-grid">
          <div>
            <p className="gest-plan-label">Costo</p>
            <p className="gest-plan-value">{CURRENT_PLAN.priceLabel}</p>
          </div>
          <div>
            <p className="gest-plan-label">Rinnovo</p>
            <p className="gest-plan-value">{CURRENT_PLAN.renewsOn}</p>
          </div>
          <div>
            <p className="gest-plan-label">Rinnovo automatico</p>
            <p className="gest-plan-value">{CURRENT_PLAN.autoRenew ? 'Attivo' : 'Disattivato'}</p>
          </div>
        </div>
        <ul className="gest-feature-list">
          {CURRENT_PLAN.features.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </section>

      <section className="gest-section">
        <div className="gest-section-header">
          <h2>Passa a Premium</h2>
        </div>
        <p className="gest-page-subtitle" style={{ marginBottom: 'var(--space-4)' }}>
          Tutto del piano Partner, più:
        </p>
        <ul className="gest-feature-list gest-feature-list-locked">
          {UPGRADE_FEATURES.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
        <a href="mailto:info@poligoniitalia.it" className="gest-action-card" style={{ maxWidth: 220, marginTop: 'var(--space-4)' }}>
          <span>Richiedi upgrade</span>
        </a>
      </section>

      <section className="gest-section">
        <div className="gest-section-header">
          <h2>Fatture</h2>
        </div>
        <div className="gest-table-wrap">
          <table className="gest-table">
            <thead>
              <tr>
                <th>Numero</th>
                <th>Data</th>
                <th>Scadenza</th>
                <th>Importo</th>
                <th>Stato</th>
              </tr>
            </thead>
            <tbody>
              {INVOICES.map((inv) => (
                <tr key={inv.number}>
                  <td className="gest-td-name">{inv.number}</td>
                  <td>{inv.date}</td>
                  <td>{inv.dueDate}</td>
                  <td>{inv.amount}</td>
                  <td>
                    <span className={`gest-badge gest-badge-${inv.status}`}>
                      {STATUS_LABEL[inv.status]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <style>{`
        .gest-page-title { font-size: 1.5rem; margin-bottom: var(--space-1); }
        .gest-page-subtitle { color: var(--color-gray-500); margin-bottom: var(--space-8); font-size: 0.875rem; }

        .gest-section { background: white; border-radius: var(--radius-xl); padding: var(--space-6); margin-bottom: var(--space-6); box-shadow: var(--shadow-sm); border: 1px solid var(--color-gray-200); }
        .gest-section-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4); }
        .gest-section h2 { font-size: 1rem; }

        .gest-plan-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: var(--space-4); margin-bottom: var(--space-4); }
        .gest-plan-label { font-size: 0.75rem; color: var(--color-gray-500); }
        .gest-plan-value { font-size: 1.125rem; font-weight: 600; color: var(--color-gray-900); margin-top: var(--space-1); }

        .gest-feature-list { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: var(--space-2); list-style: none; padding: 0; margin: 0; font-size: 0.875rem; color: var(--color-gray-700); }
        .gest-feature-list li::before { content: '✓ '; color: var(--color-green-600); font-weight: 700; }
        .gest-feature-list-locked li { color: var(--color-gray-500); }
        .gest-feature-list-locked li::before { content: '+ '; color: var(--color-gray-400); }

        .gest-table-wrap { overflow-x: auto; }
        .gest-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .gest-table th { text-align: left; font-weight: 600; color: var(--color-gray-500); padding: var(--space-3) var(--space-2); border-bottom: 1px solid var(--color-gray-200); white-space: nowrap; }
        .gest-table td { padding: var(--space-3) var(--space-2); border-bottom: 1px solid var(--color-gray-100); white-space: nowrap; }
        .gest-td-name { font-weight: 600; color: var(--color-gray-800); }

        .gest-badge { font-size: 0.75rem; padding: var(--space-1) var(--space-2); border-radius: var(--radius-md); font-weight: 600; }
        .gest-badge-pagata { background: var(--color-green-100); color: var(--color-green-700); }
        .gest-badge-emessa { background: var(--color-amber-100, #fef3c7); color: var(--color-amber-700, #92400e); }
        .gest-badge-scaduta { background: #fee2e2; color: #b91c1c; }

        .gest-action-card { display: inline-flex; align-items: center; justify-content: center; gap: var(--space-3); padding: var(--space-4); background: var(--color-gray-50); border-radius: var(--radius-lg); border: 1px solid var(--color-gray-200); text-decoration: none; color: var(--color-gray-700); font-size: 0.875rem; font-weight: 500; transition: border-color 0.15s; }
        .gest-action-card:hover { border-color: var(--color-green-400); }
      `}</style>
    </div>
  );
}
