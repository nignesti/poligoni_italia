'use client';

import { useActionState, useState } from 'react';
import type { AdminRangeDetail, AdminRangeHour } from '@poligoni/db/queries/admin-ranges';
import { PROVINCIA_BY_SIGLA } from '@poligoni/db/seed/province-sigle';
import { REGIONI_CANONICHE } from '@poligoni/db/seed/regioni';
import { COMUNI_BY_PROVINCIA } from '@poligoni/db/seed/comuni';
import type { RangeFormState } from './actions';

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'tsn', label: 'Sezione TSN' },
  { value: 'privato', label: 'Poligono privato' },
  { value: 'tiro_a_volo', label: 'Tiro a volo' },
  { value: 'dinamico', label: 'Campo dinamico' },
  { value: 'long_range', label: 'Long range' },
];

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: 'censito', label: 'Censito' },
  { value: 'rivendicato', label: 'Rivendicato' },
  { value: 'partner', label: 'Partner' },
  { value: 'inattivo', label: 'Inattivo' },
];

// Le 107 province italiane (+ VS storica), dato reale già in repo — non
// inventato per questo form (packages/db/src/seed/province-sigle.ts).
const PROVINCIA_OPTIONS = Array.from(new Set(Object.values(PROVINCIA_BY_SIGLA))).sort((a, b) =>
  a.localeCompare(b, 'it'),
);

// weekday: 0 = Domenica ... 6 = Sabato (Date.getDay()), stessa convenzione
// di packages/db/src/queries/ranges.ts.
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

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  placeholder,
  hint,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null | undefined;
  type?: string;
  required?: boolean;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <input
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        required={required}
        placeholder={placeholder}
        step={type === 'number' ? 'any' : undefined}
        className="rounded-control border border-hairline-strong bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
      />
      {hint && <span className="text-xs text-ink-faint">{hint}</span>}
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | undefined;
  options: { value: string; label: string }[];
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
        {label}
        {required && <span className="text-accent"> *</span>}
      </span>
      <select
        name={name}
        defaultValue={defaultValue}
        required={required}
        className="rounded-control border border-hairline-strong bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function RangeForm({
  mode,
  initial,
  initialHours,
  action,
}: {
  mode: 'create' | 'edit';
  initial?: AdminRangeDetail;
  initialHours?: AdminRangeHour[];
  action: (prevState: RangeFormState, formData: FormData) => Promise<RangeFormState>;
}) {
  const [state, formAction, pending] = useActionState<RangeFormState, FormData>(action, {});
  const [slots, setSlots] = useState<Slot[]>(() =>
    (initialHours ?? []).map((h) => ({ key: h.id, weekday: h.weekday, opensAt: h.opensAt, closesAt: h.closesAt })),
  );
  const [provincia, setProvincia] = useState(initial?.provincia ?? '');

  // Comuni della provincia selezionata. Se il comune salvato non compare
  // nell'elenco ISTAT corrente (dato più vecchio, scritto a mano, o
  // provincia non ancora scelta), lo tengo comunque come opzione extra
  // invece di farlo sparire dal form — mai perdere un dato esistente
  // silenziosamente.
  const comuniOptions = COMUNI_BY_PROVINCIA[provincia] ?? [];
  const comuneOptionsWithFallback =
    initial?.comune && !comuniOptions.includes(initial.comune)
      ? [initial.comune, ...comuniOptions]
      : comuniOptions;

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
    <form action={handleSubmit} className="flex max-w-3xl flex-col gap-8">
      {state?.error && (
        <p className="rounded-control border border-state-error bg-state-error-wash px-4 py-3 text-sm font-medium text-state-error">
          {state.error}
        </p>
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        <Field label="Nome" name="name" defaultValue={initial?.name} required />
        <Select label="Tipo" name="type" defaultValue={initial?.type ?? 'privato'} options={TYPE_OPTIONS} />

        {mode === 'create' ? (
          <Field
            label="Slug (opzionale)"
            name="slug"
            placeholder="generato automaticamente dal nome se lasciato vuoto"
          />
        ) : (
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">Slug</span>
            <input
              disabled
              value={initial?.slug}
              className="rounded-control border border-hairline bg-surface-sunken px-3.5 py-2.5 text-sm text-ink-faint"
            />
            <span className="text-xs text-ink-faint">
              Non modificabile qui: cambiarlo rompe l&apos;URL pubblico della scheda.
            </span>
          </label>
        )}
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Indirizzo</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Indirizzo" name="address" defaultValue={initial?.address} />
          <Field label="CAP" name="cap" defaultValue={initial?.cap} />
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Provincia<span className="text-accent"> *</span>
            </span>
            <select
              name="provincia"
              value={provincia}
              onChange={(e) => setProvincia(e.target.value)}
              required
              className="rounded-control border border-hairline-strong bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none"
            >
              <option value="" disabled>
                Scegli provincia…
              </option>
              {PROVINCIA_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">
              Comune<span className="text-accent"> *</span>
            </span>
            <select
              name="comune"
              defaultValue={initial?.comune ?? ''}
              required
              disabled={!provincia}
              className="rounded-control border border-hairline-strong bg-surface px-3.5 py-2.5 text-sm text-ink focus:border-accent focus:outline-none disabled:opacity-60"
            >
              <option value="" disabled>
                {provincia ? 'Scegli comune…' : 'Scegli prima la provincia'}
              </option>
              {comuneOptionsWithFallback.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <Select
            label="Regione"
            name="regione"
            defaultValue={initial?.regione}
            options={REGIONI_CANONICHE.map((r) => ({ value: r, label: r }))}
            required
          />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Coordinate</h2>
        <p className="mt-1 text-xs text-ink-faint">
          Obbligatorie: senza coordinate la struttura non può essere salvata (usate per la mappa
          e la ricerca per zona). Gradi decimali, separatore punto — es. 45.5416, non 45,5416.
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Latitudine" name="lat" type="number" defaultValue={initial?.lat} required />
          <Field label="Longitudine" name="lng" type="number" defaultValue={initial?.lng} required />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Contatti</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Field label="Telefono" name="phone" defaultValue={initial?.phone} />
          <Field label="Email" name="email" type="email" defaultValue={initial?.email} />
          <Field label="Sito web" name="website" defaultValue={initial?.website} />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Stato</h2>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <Select label="Status" name="status" defaultValue={initial?.status ?? 'censito'} options={STATUS_OPTIONS} />
          <Field
            label="Fonte dato"
            name="dataSource"
            defaultValue={initial?.dataSource}
            placeholder="es. admin_manuale_2026-08-01"
          />
        </div>
      </section>

      {mode === 'edit' && (
        <section>
          <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Orari di apertura</h2>
          <div className="mt-3 flex flex-col gap-3">
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
                    {daySlots.length === 0 && <span className="pt-2 text-xs text-ink-faint">Chiuso</span>}
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
        </section>
      )}

      <div className="flex justify-end gap-3 border-t border-hairline pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-control bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover disabled:opacity-60"
        >
          {pending ? 'Salvataggio…' : mode === 'create' ? 'Crea struttura' : 'Salva modifiche'}
        </button>
      </div>
    </form>
  );
}
