'use client';

import { useActionState, useState } from 'react';
import type { GestorePricingItem, GestoreServiceItem } from '@poligoni/db/queries/gestore';
import type { GestoreFormState } from '../actions';

interface PricingRow {
  key: string;
  item: string;
  price: string; // stringa "12,50" in UI, convertita in centesimi al submit
  unit: string;
}

interface ServiceRow {
  key: string;
  service: string;
  available: boolean;
  price: string; // vuota = nessun prezzo (nullable in DB)
}

let nextKey = 0;
const newKey = () => `new-${(nextKey += 1)}`;

function centsToPriceString(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',');
}

function priceStringToCents(price: string): number {
  const normalized = price.trim().replace(',', '.');
  const n = Number.parseFloat(normalized);
  return Number.isFinite(n) ? Math.round(n * 100) : 0;
}

export function ListinoForm({
  initialPricing,
  initialServices,
  action,
}: {
  initialPricing: GestorePricingItem[];
  initialServices: GestoreServiceItem[];
  action: (prevState: GestoreFormState, formData: FormData) => Promise<GestoreFormState>;
}) {
  const [pricing, setPricing] = useState<PricingRow[]>(() =>
    initialPricing.map((p) => ({ key: p.id, item: p.item, price: centsToPriceString(p.priceCents), unit: p.unit ?? 'sessione' })),
  );
  const [services, setServices] = useState<ServiceRow[]>(() =>
    initialServices.map((s) => ({
      key: s.id,
      service: s.service,
      available: s.available,
      price: s.priceCents != null ? centsToPriceString(s.priceCents) : '',
    })),
  );
  const [state, formAction, pending] = useActionState<GestoreFormState, FormData>(action, {});

  const handleSubmit = (formData: FormData) => {
    formData.set(
      'pricingJson',
      JSON.stringify(
        pricing
          .filter((p) => p.item.trim())
          .map((p) => ({ item: p.item.trim(), priceCents: priceStringToCents(p.price), unit: p.unit, note: null })),
      ),
    );
    formData.set(
      'servicesJson',
      JSON.stringify(
        services
          .filter((s) => s.service.trim())
          .map((s) => ({
            service: s.service.trim(),
            available: s.available,
            priceCents: s.price.trim() ? priceStringToCents(s.price) : null,
          })),
      ),
    );
    formAction(formData);
  };

  return (
    <form action={handleSubmit}>
      {state?.error && <p className="ch-error">{state.error}</p>}

      <section className="gest-section">
        <h2>Prezzi</h2>
        <div className="listino-table-wrap">
          <table className="listino-table">
            <thead>
              <tr>
                <th>Voce</th>
                <th>Prezzo (€)</th>
                <th>Unità</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {pricing.map((p) => (
                <tr key={p.key}>
                  <td>
                    <input
                      className="listino-input"
                      value={p.item}
                      onChange={(e) => setPricing((prev) => prev.map((x) => (x.key === p.key ? { ...x, item: e.target.value } : x)))}
                      placeholder="es. Ingresso linea 25 m"
                    />
                  </td>
                  <td>
                    <input
                      className="listino-input listino-price"
                      value={p.price}
                      onChange={(e) => setPricing((prev) => prev.map((x) => (x.key === p.key ? { ...x, price: e.target.value } : x)))}
                      placeholder="0,00"
                    />
                  </td>
                  <td>
                    <select
                      className="listino-input"
                      value={p.unit}
                      onChange={(e) => setPricing((prev) => prev.map((x) => (x.key === p.key ? { ...x, unit: e.target.value } : x)))}
                    >
                      <option value="sessione">sessione</option>
                      <option value="giorno">giorno</option>
                      <option value="mese">mese</option>
                      <option value="anno">anno</option>
                    </select>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="listino-remove"
                      onClick={() => setPricing((prev) => prev.filter((x) => x.key !== p.key))}
                      aria-label="Rimuovi voce"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          className="btn btn-ghost listino-add"
          onClick={() => setPricing((prev) => [...prev, { key: newKey(), item: '', price: '', unit: 'sessione' }])}
        >
          + Aggiungi voce
        </button>
      </section>

      <section className="gest-section">
        <h2>Servizi</h2>
        <div className="serv-list">
          {services.map((s) => (
            <div key={s.key} className="serv-item">
              <button
                type="button"
                className={`serv-toggle ${s.available ? 'on' : 'off'}`}
                onClick={() => setServices((prev) => prev.map((x) => (x.key === s.key ? { ...x, available: !x.available } : x)))}
                aria-label={s.available ? 'Disponibile' : 'Non disponibile'}
              >
                {s.available ? '✅' : '❌'}
              </button>
              <input
                className="serv-name-input"
                value={s.service}
                onChange={(e) => setServices((prev) => prev.map((x) => (x.key === s.key ? { ...x, service: e.target.value } : x)))}
                placeholder="es. Noleggio armi"
              />
              <input
                className="serv-price-input"
                value={s.price}
                onChange={(e) => setServices((prev) => prev.map((x) => (x.key === s.key ? { ...x, price: e.target.value } : x)))}
                placeholder="€ (opzionale)"
              />
              <button
                type="button"
                className="listino-remove"
                onClick={() => setServices((prev) => prev.filter((x) => x.key !== s.key))}
                aria-label="Rimuovi servizio"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-ghost listino-add"
          onClick={() => setServices((prev) => [...prev, { key: newKey(), service: '', available: true, price: '' }])}
        >
          + Aggiungi servizio
        </button>
      </section>

      <div className="str-footer">
        <button type="submit" className="btn btn-primary" disabled={pending}>
          {pending ? 'Salvataggio…' : 'Salva listino'}
        </button>
      </div>
    </form>
  );
}
