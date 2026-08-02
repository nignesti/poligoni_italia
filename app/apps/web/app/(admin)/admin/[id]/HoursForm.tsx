'use client';

import { useActionState, useState } from 'react';
import type { AdminRangeHour } from '@poligoni/db/queries/admin-ranges';
import type { HoursFormState } from '../actions';

// weekday: 0 = Domenica ... 6 = Sabato (Date.getDay()), stessa convenzione
// di packages/db/src/queries/ranges.ts. In UI partiamo da Lunedì (1) per
// una visualizzazione settimanale naturale.
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

export function HoursForm({
  initial,
  action,
}: {
  initial: AdminRangeHour[];
  action: (prevState: HoursFormState, formData: FormData) => Promise<HoursFormState>;
}) {
  const [slots, setSlots] = useState<Slot[]>(() =>
    initial.length > 0
      ? initial.map((h) => ({ key: h.id, weekday: h.weekday, opensAt: h.opensAt, closesAt: h.closesAt }))
      : [],
  );
  const [state, formAction, pending] = useActionState<HoursFormState, FormData>(action, {});

  const updateSlot = (key: string, field: 'opensAt' | 'closesAt', value: string) => {
    setSlots((prev) => prev.map((s) => (s.key === key ? { ...s, [field]: value } : s)));
  };

  const addSlot = (weekday: number) => {
    setSlots((prev) => [...prev, makeSlot(weekday)]);
  };

  const removeSlot = (key: string) => {
    setSlots((prev) => prev.filter((s) => s.key !== key));
  };

  const handleSubmit = (formData: FormData) => {
    formData.set(
      'hoursJson',
      JSON.stringify(slots.map(({ weekday, opensAt, closesAt }) => ({ weekday, opensAt, closesAt }))),
    );
    formAction(formData);
  };

  return (
    <form action={handleSubmit} className="flex max-w-3xl flex-col gap-6">
      {state?.error && (
        <p className="rounded-control border border-state-error bg-state-error-wash px-4 py-3 text-sm font-medium text-state-error">
          {state.error}
        </p>
      )}

      <div className="flex flex-col gap-3">
        {DAYS.map(({ weekday, label }) => {
          const daySlots = slots.filter((s) => s.weekday === weekday);
          return (
            <div
              key={weekday}
              className="flex flex-col gap-2 rounded-control border border-hairline bg-surface-sunken p-3.5 sm:flex-row sm:items-start"
            >
              <span className="w-28 shrink-0 pt-2 text-xs font-bold uppercase tracking-wide text-ink-muted">
                {label}
              </span>
              <div className="flex flex-1 flex-col gap-2">
                {daySlots.length === 0 && (
                  <span className="pt-2 text-xs text-ink-faint">Chiuso</span>
                )}
                {daySlots.map((slot) => (
                  <div key={slot.key} className="flex items-center gap-2">
                    <input
                      type="time"
                      value={slot.opensAt}
                      onChange={(e) => updateSlot(slot.key, 'opensAt', e.target.value)}
                      className="rounded-control border border-hairline-strong bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    <span className="text-ink-faint">—</span>
                    <input
                      type="time"
                      value={slot.closesAt}
                      onChange={(e) => updateSlot(slot.key, 'closesAt', e.target.value)}
                      className="rounded-control border border-hairline-strong bg-surface px-3 py-2 text-sm text-ink focus:border-accent focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => removeSlot(slot.key)}
                      aria-label="Rimuovi fascia oraria"
                      className="rounded-control border border-hairline-strong px-2.5 py-2 text-xs font-bold text-ink-muted hover:border-state-error hover:text-state-error"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addSlot(weekday)}
                  className="self-start text-xs font-bold uppercase tracking-wide text-accent hover:text-accent-hover"
                >
                  + Aggiungi fascia
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-end gap-3 border-t border-hairline pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-control bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? 'Salvataggio…' : 'Salva orari'}
        </button>
      </div>
    </form>
  );
}
