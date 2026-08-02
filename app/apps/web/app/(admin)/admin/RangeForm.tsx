'use client';

import { useActionState } from 'react';
import type { AdminRangeDetail } from '@poligoni/db/queries/admin-ranges';
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

function Field({
  label,
  name,
  defaultValue,
  type = 'text',
  required,
  placeholder,
}: {
  label: string;
  name: string;
  defaultValue?: string | number | null | undefined;
  type?: string;
  required?: boolean;
  placeholder?: string;
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
    </label>
  );
}

function Select({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue?: string | undefined;
  options: { value: string; label: string }[];
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-bold uppercase tracking-wide text-ink-muted">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
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
  action,
}: {
  mode: 'create' | 'edit';
  initial?: AdminRangeDetail;
  action: (prevState: RangeFormState, formData: FormData) => Promise<RangeFormState>;
}) {
  const [state, formAction, pending] = useActionState<RangeFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex max-w-3xl flex-col gap-8">
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
          <Field label="Comune" name="comune" defaultValue={initial?.comune} required />
          <Field label="Provincia" name="provincia" defaultValue={initial?.provincia} required />
          <Field label="Regione" name="regione" defaultValue={initial?.regione} required />
        </div>
      </section>

      <section>
        <h2 className="text-sm font-bold uppercase tracking-wide text-ink-muted">Coordinate</h2>
        <p className="mt-1 text-xs text-ink-faint">
          Obbligatorie: senza coordinate la struttura non può essere salvata (usate per la mappa
          e la ricerca per zona).
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
