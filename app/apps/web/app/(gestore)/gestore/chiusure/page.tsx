'use client';

import { useState } from 'react';

const INITIAL_CLOSURES = [
  { dateFrom: '2026-08-15', dateTo: '2026-08-20', reason: 'Campionato nazionale', isRecurring: false },
  { dateFrom: '2026-12-24', dateTo: '2026-12-26', reason: 'Festività natalizie', isRecurring: true },
];

export default function ChiusurePage() {
  const [closures, setClosures] = useState(INITIAL_CLOSURES);
  const [showForm, setShowForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ dateFrom: '', dateTo: '', reason: '', isRecurring: false });

  const addClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dateFrom || !form.dateTo || !form.reason) return;
    setClosures((prev) => [...prev, form]);
    setForm({ dateFrom: '', dateTo: '', reason: '', isRecurring: false });
    setShowForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const removeClosure = (idx: number) => {
    setClosures((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div>
      <h1 className="gest-page-title">Chiusure e gare</h1>
      <p className="gest-page-subtitle">Gestisci le chiusure straordinarie della struttura</p>

      <section className="gest-section">
        <div className="gest-section-header">
          <h2>Chiusure programmate</h2>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuova chiusura
          </button>
        </div>

        {closures.length === 0 ? (
          <p className="ch-empty">Nessuna chiusura programmata.</p>
        ) : (
          <div className="ch-list">
            {closures.map((c, i) => (
              <div key={i} className="ch-card">
                <div className="ch-info">
                  <span className="ch-dates">
                    {new Date(c.dateFrom).toLocaleDateString('it-IT')} — {new Date(c.dateTo).toLocaleDateString('it-IT')}
                  </span>
                  <span className="ch-reason">{c.reason}</span>
                  {c.isRecurring && <span className="ch-badge">Ricorrente</span>}
                </div>
                <button className="ch-remove" onClick={() => removeClosure(i)}>
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showForm && (
        <div className="ch-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ch-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Nuova chiusura</h3>
            <form onSubmit={addClosure} className="ch-form">
              <div className="ch-form-grid">
                <div className="str-field">
                  <label>Dal</label>
                  <input type="date" className="str-input" value={form.dateFrom} onChange={(e) => setForm({ ...form, dateFrom: e.target.value })} required />
                </div>
                <div className="str-field">
                  <label>Al</label>
                  <input type="date" className="str-input" value={form.dateTo} onChange={(e) => setForm({ ...form, dateTo: e.target.value })} required />
                </div>
              </div>
              <div className="str-field">
                <label>Motivo</label>
                <input className="str-input" placeholder="es. Gara nazionale, manutenzione..." value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required />
              </div>
              <label className="ch-checkbox">
                <input type="checkbox" checked={form.isRecurring} onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })} />
                <span>Ricorrente (si ripete ogni anno)</span>
              </label>
              <div className="ch-form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>Annulla</button>
                <button type="submit" className="btn btn-primary">Aggiungi</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {saved && <div className="ch-toast">✅ Chiusura aggiunta</div>}

      <style>{`
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
        .ch-toast { position: fixed; bottom: var(--space-8); right: var(--space-8); background: var(--color-green-600); color: white; padding: var(--space-3) var(--space-6); border-radius: var(--radius-lg); font-weight: 600; font-size: 0.875rem; box-shadow: var(--shadow-lg); z-index: 60; }
      `}</style>
    </div>
  );
}
