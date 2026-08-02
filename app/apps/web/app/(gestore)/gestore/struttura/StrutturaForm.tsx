'use client';

import { useActionState } from 'react';
import type { GestoreRangeDetail } from '@poligoni/db/queries/gestore';
import type { GestoreFormState } from '../actions';

const TYPE_OPTIONS: { value: string; label: string }[] = [
  { value: 'tsn', label: 'Sezione TSN' },
  { value: 'privato', label: 'Poligono privato' },
  { value: 'tiro_a_volo', label: 'Tiro a volo' },
  { value: 'dinamico', label: 'Campo dinamico' },
  { value: 'long_range', label: 'Long range' },
];

export function StrutturaForm({
  initial,
  action,
}: {
  initial: GestoreRangeDetail;
  action: (prevState: GestoreFormState, formData: FormData) => Promise<GestoreFormState>;
}) {
  const [state, formAction, pending] = useActionState<GestoreFormState, FormData>(action, {});

  return (
    <form action={formAction} className="str-form">
      {state?.error && <p className="str-error">{state.error}</p>}

      <section className="gest-section">
        <h2>Informazioni di base</h2>
        <div className="str-grid">
          <div className="str-field">
            <label htmlFor="name">Nome della struttura</label>
            <input id="name" name="name" className="str-input" defaultValue={initial.name} required />
          </div>
          <div className="str-field">
            <label htmlFor="type">Tipo</label>
            <select id="type" name="type" className="str-input" defaultValue={initial.type}>
              {TYPE_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
          <div className="str-field">
            <label htmlFor="address">Indirizzo</label>
            <input id="address" name="address" className="str-input" defaultValue={initial.address ?? ''} />
          </div>
          <div className="str-field">
            <label htmlFor="comune">Città</label>
            <input id="comune" name="comune" className="str-input" defaultValue={initial.comune} required />
          </div>
          <div className="str-field">
            <label htmlFor="provincia">Provincia</label>
            <input id="provincia" name="provincia" className="str-input" defaultValue={initial.provincia} required />
          </div>
          <div className="str-field">
            <label htmlFor="cap">CAP</label>
            <input id="cap" name="cap" className="str-input" defaultValue={initial.cap ?? ''} />
          </div>
          <div className="str-field">
            <label htmlFor="phone">Telefono</label>
            <input id="phone" name="phone" className="str-input" defaultValue={initial.phone ?? ''} />
          </div>
          <div className="str-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="str-input"
              defaultValue={initial.email ?? ''}
            />
          </div>
          <div className="str-field">
            <label htmlFor="website">Sito web</label>
            <input id="website" name="website" className="str-input" defaultValue={initial.website ?? ''} />
          </div>
          {/* Regione: hidden, il gestore non la modifica direttamente qui —
              va di pari passo con comune/provincia, cambiarla a sé stante
              rischia disallineamenti. Se serve correggerla, è un caso da admin. */}
          <input type="hidden" name="regione" value={initial.regione} />
        </div>
      </section>

      <div className="str-footer">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Salvataggio…' : 'Salva modifiche'}
        </button>
      </div>
    </form>
  );
}
