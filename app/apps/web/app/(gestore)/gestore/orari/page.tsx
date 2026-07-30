'use client';

import { useState } from 'react';

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica'];

const INITIAL_HOURS: Record<string, { opens: string; closes: string; enabled: boolean }[]> = {
  'Lunedì': [{ opens: '09:00', closes: '12:30', enabled: true }, { opens: '14:00', closes: '19:00', enabled: true }],
  'Martedì': [{ opens: '09:00', closes: '12:30', enabled: true }, { opens: '14:00', closes: '19:00', enabled: true }],
  'Mercoledì': [{ opens: '09:00', closes: '12:30', enabled: true }, { opens: '14:00', closes: '19:00', enabled: true }],
  'Giovedì': [{ opens: '09:00', closes: '12:30', enabled: true }, { opens: '14:00', closes: '19:00', enabled: true }],
  'Venerdì': [{ opens: '09:00', closes: '12:30', enabled: true }, { opens: '14:00', closes: '19:00', enabled: true }],
  'Sabato': [{ opens: '09:00', closes: '18:00', enabled: true }],
  'Domenica': [{ opens: '09:00', closes: '13:00', enabled: true }],
};

export default function OrariPage() {
  const [hours, setHours] = useState(INITIAL_HOURS);
  const [saved, setSaved] = useState(false);

  const updateSlot = (day: string, idx: number, field: 'opens' | 'closes', value: string) => {
    setHours((prev) => {
      const slots = [...prev[day]!];
      slots[idx] = { ...slots[idx]!, [field]: value };
      return { ...prev, [day]: slots };
    });
  };

  const toggleSlot = (day: string, idx: number) => {
    setHours((prev) => {
      const slots = [...prev[day]!];
      slots[idx] = { ...slots[idx]!, enabled: !slots[idx]!.enabled };
      return { ...prev, [day]: slots };
    });
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="gest-page-title">Orari di apertura</h1>
      <p className="gest-page-subtitle">Gestisci gli orari ricorrenti della struttura</p>

      <form onSubmit={handleSave}>
        <section className="gest-section">
          <h2>Orari settimanali</h2>
          <div className="orari-list">
            {DAYS.map((day) => (
              <div key={day} className="orari-day">
                <div className="orari-day-header">
                  <span className="orari-day-name">{day}</span>
                </div>
                <div className="orari-slots">
                  {hours[day]!.map((slot, idx) => (
                    <div key={idx} className={`orari-slot ${!slot.enabled ? 'disabled' : ''}`}>
                      <input
                        type="time"
                        value={slot.opens}
                        onChange={(e) => updateSlot(day, idx, 'opens', e.target.value)}
                        className="orari-time"
                        disabled={!slot.enabled}
                      />
                      <span className="orari-sep">—</span>
                      <input
                        type="time"
                        value={slot.closes}
                        onChange={(e) => updateSlot(day, idx, 'closes', e.target.value)}
                        className="orari-time"
                        disabled={!slot.enabled}
                      />
                      <button
                        type="button"
                        className={`orari-toggle ${!slot.enabled ? 'off' : ''}`}
                        onClick={() => toggleSlot(day, idx)}
                      >
                        {slot.enabled ? '✕' : '✓'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="str-footer">
          {saved && <span className="str-saved">✅ Orari salvati</span>}
          <button type="submit" className="btn btn-primary">Salva orari</button>
        </div>
      </form>

      <style>{`
        .orari-list { display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4); }
        .orari-day {
          display: flex; align-items: center; gap: var(--space-4);
          padding: var(--space-3) var(--space-4);
          border-bottom: 1px solid var(--color-gray-100);
        }
        .orari-day-name { width: 120px; font-weight: 600; font-size: 0.875rem; color: var(--color-gray-700); flex-shrink: 0; }
        .orari-slots { display: flex; gap: var(--space-3); flex-wrap: wrap; }
        .orari-slot { display: flex; align-items: center; gap: var(--space-2); }
        .orari-slot.disabled { opacity: 0.4; }
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
        .orari-toggle.off { background: var(--color-green-50); color: var(--color-green-600); border-color: var(--color-green-300); }

        @media (max-width: 768px) {
          .orari-day { flex-direction: column; align-items: flex-start; gap: var(--space-2); }
        }
      `}</style>
    </div>
  );
}
