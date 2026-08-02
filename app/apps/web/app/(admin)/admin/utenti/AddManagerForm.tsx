'use client';

import { useActionState } from 'react';
import type { ManagerFormState } from '../actions';

const ROLE_OPTIONS = [
  { value: 'proprietario', label: 'Proprietario' },
  { value: 'staff', label: 'Staff' },
];

export function AddManagerForm({
  userId,
  ranges,
  action,
}: {
  userId: string;
  ranges: { id: string; name: string }[];
  action: (prevState: ManagerFormState, formData: FormData) => Promise<ManagerFormState>;
}) {
  const [state, formAction, pending] = useActionState<ManagerFormState, FormData>(action, {});

  return (
    <form action={formAction} className="flex flex-wrap items-center gap-2">
      <input type="hidden" name="userId" value={userId} />
      <select
        name="rangeId"
        required
        defaultValue=""
        className="rounded-control border border-hairline-strong bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
      >
        <option value="" disabled>
          Struttura…
        </option>
        {ranges.map((r) => (
          <option key={r.id} value={r.id}>
            {r.name}
          </option>
        ))}
      </select>
      <select
        name="role"
        defaultValue="staff"
        className="rounded-control border border-hairline-strong bg-surface px-2.5 py-1.5 text-xs text-ink focus:border-accent focus:outline-none"
      >
        {ROLE_OPTIONS.map((r) => (
          <option key={r.value} value={r.value}>
            {r.label}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={pending}
        className="rounded-control border border-hairline-strong px-2.5 py-1.5 text-xs font-bold uppercase tracking-wide text-accent hover:border-accent disabled:opacity-60"
      >
        {pending ? 'Aggiunta…' : '+ Aggiungi'}
      </button>
      {state?.error && <span className="text-xs text-state-error">{state.error}</span>}
    </form>
  );
}
