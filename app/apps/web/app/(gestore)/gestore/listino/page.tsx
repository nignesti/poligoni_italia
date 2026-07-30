'use client';

import { useState } from 'react';

const INITIAL_PRICING = [
  { item: 'Ingresso linea 10 m', price: '8,00', unit: 'sessione' },
  { item: 'Ingresso linea 25 m', price: '12,00', unit: 'sessione' },
  { item: 'Ingresso linea 50 m', price: '15,00', unit: 'sessione' },
  { item: 'Abbonamento mensile', price: '50,00', unit: 'mese' },
];

const INITIAL_SERVICES = [
  { service: 'Noleggio armi', available: true, price: '15,00' },
  { service: 'Istruttore', available: true, price: '30,00' },
  { service: 'Armiario', available: true, price: '' },
  { service: 'Bar/Ristoro', available: true, price: '' },
  { service: 'Vendita munizioni', available: true, price: '' },
  { service: 'Parcheggio', available: true, price: '' },
];

export default function ListinoPage() {
  const [pricing, setPricing] = useState(INITIAL_PRICING);
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const toggleService = (idx: number) => {
    setServices((prev) =>
      prev.map((s, i) => (i === idx ? { ...s, available: !s.available } : s)),
    );
  };

  return (
    <div>
      <h1 className="gest-page-title">Listino e servizi</h1>
      <p className="gest-page-subtitle">Prezzi, servizi disponibili e dotazioni</p>

      <form onSubmit={handleSave}>
        <section className="gest-section">
          <h2>Prezzi</h2>
          <div className="listino-table-wrap">
            <table className="listino-table">
              <thead>
                <tr>
                  <th>Voce</th>
                  <th>Prezzo (€)</th>
                  <th>Unità</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((p, i) => (
                  <tr key={i}>
                    <td>
                      <input className="listino-input" defaultValue={p.item} />
                    </td>
                    <td>
                      <input className="listino-input listino-price" defaultValue={p.price} />€
                    </td>
                    <td>
                      <select className="listino-input" defaultValue={p.unit}>
                        <option>sessione</option>
                        <option>giorno</option>
                        <option>mese</option>
                        <option>anno</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button type="button" className="btn btn-ghost listino-add">
            + Aggiungi voce
          </button>
        </section>

        <section className="gest-section">
          <h2>Servizi</h2>
          <div className="serv-list">
            {services.map((s, i) => (
              <div key={i} className="serv-item">
                <button
                  type="button"
                  className={`serv-toggle ${s.available ? 'on' : 'off'}`}
                  onClick={() => toggleService(i)}
                >
                  {s.available ? '✅' : '❌'}
                </button>
                <span className={`serv-name ${!s.available ? 'disabled' : ''}`}>
                  {s.service}
                </span>
                {s.price && (
                  <span className="serv-price">{s.price} €</span>
                )}
              </div>
            ))}
          </div>
        </section>

        <div className="str-footer">
          {saved && <span className="str-saved">✅ Listino salvato</span>}
          <button type="submit" className="btn btn-primary">Salva listino</button>
        </div>
      </form>

      <style>{`
        .listino-table-wrap { overflow-x: auto; margin-top: var(--space-4); }
        .listino-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .listino-table th { text-align: left; font-weight: 600; color: var(--color-gray-500); padding: var(--space-3) var(--space-2); border-bottom: 1px solid var(--color-gray-200); }
        .listino-table td { padding: var(--space-2); border-bottom: 1px solid var(--color-gray-100); }
        .listino-input {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-md);
          font-size: 0.875rem;
          width: 100%;
          min-width: 140px;
          background: white;
        }
        .listino-input:focus { outline: none; border-color: var(--color-green-500); }
        .listino-price { width: 100px; text-align: right; }
        .listino-add { margin-top: var(--space-3); font-size: 0.875rem; }
        .serv-list { display: flex; flex-direction: column; gap: var(--space-2); margin-top: var(--space-4); }
        .serv-item { display: flex; align-items: center; gap: var(--space-3); padding: var(--space-2) 0; border-bottom: 1px solid var(--color-gray-100); }
        .serv-toggle { background: none; border: none; font-size: 1rem; cursor: pointer; padding: var(--space-1); }
        .serv-name { font-size: 0.875rem; flex: 1; }
        .serv-name.disabled { color: var(--color-gray-400); text-decoration: line-through; }
        .serv-price { font-size: 0.8125rem; color: var(--color-gray-500); }
      `}</style>
    </div>
  );
}
