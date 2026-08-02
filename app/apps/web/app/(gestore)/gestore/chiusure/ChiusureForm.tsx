'use client';

import { useActionState, useState } from 'react';
import type { GestoreClosure } from '@poligoni/db/queries/gestore';
import type { GestoreFormState } from '../actions';

interface Closure {
  key: string;
  dateFrom: string;
  dateTo: string;
  reason: string;
  isRecurring: boolean;
}

let nextKey = 0;

export function ChiusureForm({
  initial,
  action,
}: {
  initial: GestoreClosure[];
  action: (prevState: GestoreFormState, formData: FormData) => Promise<GestoreFormState>;
}) {
  const [closures, setClosures] = useState<Closure[]>(() =>
    initial.map((c) => ({ key: c.id, ...c })),
  );
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ dateFrom: '', dateTo: '', reason: '', isRecurring: false });
  const [state, formAction, pending] = useActionState<GestoreFormState, FormData>(action, {});

  const addClosure = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.dateFrom || !form.dateTo || !form.reason) return;
    nextKey += 1;
    setClosures((prev) => [...prev, { key: `new-${nextKey}`, ...form }]);
    setForm({ dateFrom: '', dateTo: '', reason: '', isRecurring: false });
    setShowForm(false);
  };

  const removeClosure = (key: string) => {
    setClosures((prev) => prev.filter((c) => c.key !== key));
  };

  const handleSubmit = (formData: FormData) => {
    formData.set(
      'closuresJson',
      JSON.stringify(closures.map(({ dateFrom, dateTo, reason, isRecurring }) => ({ dateFrom, dateTo, reason, isRecurring }))),
    );
    formAction(formData);
  };

  return (
    <>
      <section className="gest-section">
        <div className="gest-section-header">
          <h2>Chiusure programmate</h2>
          <button type="button" className="btn btn-primary" onClick={() => setShowForm(true)}>
            + Nuova chiusura
          </button>
        </div>

        {state?.error && <p className="ch-error">{state.error}</p>}

        {closures.length === 0 ? (
          <p className="ch-empty">Nessuna chiusura programmata.</p>
        ) : (
          <div className="ch-list">
            {closures.map((c) => (
              <div key={c.key} className="ch-card">
                <div className="ch-info">
                  <span className="ch-dates">
                    {new Date(c.dateFrom).toLocaleDateString('it-IT')} — {new Date(c.dateTo).toLocaleDateString('it-IT')}
                  </span>
                  <span className="ch-reason">{c.reason}</span>
                  {c.isRecurring && <span className="ch-badge">Ricorrente</span>}
                </div>
                <button type="button" className="ch-remove" onClick={() => removeClosure(c.key)} aria-label="Rimuovi chiusura">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        <form action={handleSubmit} className="str-footer" style={{ marginTop: 'var(--space-6)' }}>
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? 'Salvataggio…' : 'Salva modifiche'}
          </button>
        </form>
      </section>

      {showForm && (
        <div className="ch-modal-overlay" onClick={() => setShowForm(false)}>
          <div className="ch-modal" onClick={(e) => e.stopPropagation()}>
            <h3>Nuova chiusura</h3>
            <form onSubmit={addClosure} className="ch-form">
              <div className="ch-form-grid">
                <div className="str-field">
                  <label>Dal</label>
                  <input
                    type="date"
                    className="str-input"
                    value={form.dateFrom}
                    onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                    required
                  />
                </div>
                <div className="str-field">
                  <label>Al</label>
                  <input
                    type="date"
                    className="str-input"
                    value={form.dateTo}
                    onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="str-field">
                <label>Motivo</label>
                <input
                  className="str-input"
                  placeholder="es. Gara nazionale, manutenzione..."
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  required
                />
              </div>
              <label className="ch-checkbox">
                <input
                  type="checkbox"
                  checked={form.isRecurring}
                  onChange={(e) => setForm({ ...form, isRecurring: e.target.checked })}
                />
                <span>Ricorrente (si ripete ogni anno)</span>
              </label>
              <div className="ch-form-actions">
                <button type="button" className="btn btn-ghost" onClick={() => setShowForm(false)}>
                  Annulla
                </button>
                <button type="submit" className="btn btn-primary">
                  Aggiungi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
