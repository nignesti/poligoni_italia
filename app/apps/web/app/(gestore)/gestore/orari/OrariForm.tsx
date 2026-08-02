'use client';

import { useActionState, useState } from 'react';
import type { AdminRangeHour } from '@poligoni/db/queries/admin-ranges';
import type { GestoreFormState } from '../actions';

// weekday: 0 = Domenica ... 6 = Sabato (Date.getDay()), stessa convenzione
// usata in packages/db/src/queries/ranges.ts e nell'equivalente admin.
const DAYS: { weekday: number; label: string }[] = [
  { weekday: 1, label: 'Lunedì' },
  { weekday: 2, label: 'Martedì' },
  { weekday: 3, label: 'Mercoledì' },
  { weekday: 4, label: 'Giovedì' },
  { weekday: 5, label: 'Venerdì' },
  { weekday: 6, label: 'Sabato' },
  { weekday: 0, label: 'Domenica' },
];

interface Slot {
  key: string;
  weekday: number;
  opensAt: string;
  closesAt: string;
}

let nextKey = 0;
function makeSlot(weekday: number, opensAt = '09:00', closesAt = '18:00'): Slot {
  nextKey += 1;
  return { key: `new-${nextKey}`, weekday, opensAt, closesAt };
}

export function OrariForm({
  initial,
  action,
}: {
  initial: AdminRangeHour[];
  action: (prevState: GestoreFormState, formData: FormData) => Promise<GestoreFormState>;
}) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    initial.map((h) => ({ key: h.id, weekday: h.weekday, opensAt: h.opensAt, closesAt: h.closesAt })),
  );
  const [state, formAction, pending] = useActionState<GestoreFormState, FormData>(action, {});

  const updateSlot = (key: string, field: 'opensAt' | 'closesAt', value: string) => {
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)));
  };
  const addSlot = (weekday: number) => setSlots((prev) => [...prev, makeSlot(weekday)]);
  const removeSlot = (key: string) => setSlots((prev) => prev.filter((s) => s.key !== key));

  const handleSubmit = (formData: FormData) => {
    formData.set(
      'hoursJson',
      JSON.stringify(slots.map(({ weekday, opensAt, closesAt }) => ({ weekday, opensAt, closesAt }))),
    );
    formAction(formData);
  };

  return (
    <form action={handleSubmit}>
      {state?.error && <p className="orari-error">{state.error}</p>}

      <div className="orari-list">
        {DAYS.map(({ weekday, label }) => {
          const daySlots = slots.filter((s) => s.weekday === weekday);
          return (
            <div key={weekday} className="orari-day">
              <div className="orari-day-header">
                <span className="orari-day-name">{label}</span>
              </div>
              <div className="orari-slots">
                {daySlots.length === 0 && <span className="orari-closed">Chiuso</span>}
                {daySlots.map((slot) => (
                  <div key={slot.key} className="orari-slot">
                    <input
                      type="time"
                      value={slot.opensAt}
                      onChange={(e) => updateSlot(slot.key, 'opensAt', e.target.value)}
                      className="orari-time"
                    />
                    <span className="orari-sep">—</span>
                    <input
                      type="time"
                      value={slot.closesAt}
                      onChange={(e) => updateSlot(slot.key, 'closesAt', e.target.value)}
                      className="orari-time"
                    />
                    <button
                      type="button"
                      className="orari-toggle"
                      onClick={() => removeSlot(slot.key)}
                      aria-label="Rimuovi fascia oraria"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button type="button" className="orari-add" onClick={() => addSlot(weekday)}>
                  + Aggiungi fascia
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="str-footer">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Salvataggio…' : 'Salva orari'}
        </button>
      </div>
    </form>
  );
}
