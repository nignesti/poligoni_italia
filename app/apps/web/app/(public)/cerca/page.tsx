'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';

// ---------------------------------------------------------------------------
// Cerca — pagina interattiva con filtri
// Piano_Sviluppo_App.md §7.1 — /cerca → Client, mappa e filtri interattivi
// ---------------------------------------------------------------------------

const MOCK_RESULTS = [
  {
    slug: 'tsn-milano',
    name: 'TSN Milano',
    comune: 'Milano',
    provincia: 'Milano',
    regione: 'Lombardia',
    type: 'tsn',
    lines: ['10 m', '25 m', '50 m'],
    distance: null as number | null,
  },
  {
    slug: 'tsn-roma',
    name: 'TSN Roma',
    comune: 'Roma',
    provincia: 'Roma',
    regione: 'Lazio',
    type: 'tsn',
    lines: ['10 m', '25 m', '50 m'],
    distance: null as number | null,
  },
  {
    slug: 'poligono-corsico',
    name: 'Poligono di Corsico',
    comune: 'Corsico',
    provincia: 'Milano',
    regione: 'Lombardia',
    type: 'privato',
    lines: ['25 m', '50 m'],
    distance: null as number | null,
  },
];

const TYPE_FILTERS = [
  { value: '', label: 'Tutti i tipi' },
  { value: 'tsn', label: 'Sezioni TSN' },
  { value: 'privato', label: 'Poligoni Privati' },
  { value: 'tiro_a_volo', label: 'Tiro a Volo' },
] as const;

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = MOCK_RESULTS.filter((r) => {
    if (search) {
      const q = search.toLowerCase();
      if (
        !r.name.toLowerCase().includes(q) &&
        !r.comune.toLowerCase().includes(q) &&
        !r.provincia.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    if (typeFilter && r.type !== typeFilter) return false;
    return true;
  });

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="search-page">
      {/* Header */}
      <header className="search-header">
        <nav className="container search-nav">
          <Link href="/" className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Poligoni Italia</span>
          </Link>
        </nav>
        <div className="container">
          <h1 className="search-title">Cerca un poligono</h1>
          <form onSubmit={handleSubmit} className="search-form">
            <div className="search-input-wrap">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Città, provincia o nome del poligono…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="search-input"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="search-select"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </form>
        </div>
      </header>

      {/* Results */}
      <div className="container search-results">
        <p className="results-count">{filtered.length} risultati</p>
        {filtered.length === 0 ? (
          <div className="no-results">
            <p>Nessun poligono trovato. Prova a modificare i filtri.</p>
          </div>
        ) : (
          <div className="results-list">
            {filtered.map((r) => (
              <Link
                key={r.slug}
                href={`/poligoni/${r.regione.toLowerCase()}/${r.provincia.toLowerCase()}/${r.slug}`}
                className="result-card"
              >
                <div className="result-info">
                  <h2 className="result-name">{r.name}</h2>
                  <p className="result-location">
                    {r.comune} ({r.provincia})
                  </p>
                  <p className="result-lines">
                    Linee: {r.lines.join(', ')}
                  </p>
                </div>
                <div className="result-meta">
                  <span className="result-type">
                    {r.type === 'tsn'
                      ? 'TSN'
                      : r.type === 'privato'
                        ? 'Privato'
                        : 'Tiro a Volo'}
                  </span>
                  <span className="result-arrow">→</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .search-header {
          background: linear-gradient(135deg, #0d3b0d 0%, #1b5e20 100%);
          color: white;
          padding-bottom: var(--space-12);
        }
        .search-nav {
          display: flex;
          align-items: center;
          padding-top: var(--space-6);
          padding-bottom: var(--space-8);
        }
        .search-nav .logo { color: white; }
        .search-title {
          font-size: 2rem;
          color: white;
          margin-bottom: var(--space-6);
        }
        .search-form {
          display: flex;
          gap: var(--space-3);
          max-width: 640px;
        }
        .search-input-wrap {
          flex: 1;
          position: relative;
        }
        .search-icon {
          position: absolute;
          left: var(--space-4);
          top: 50%;
          transform: translateY(-50%);
          font-size: 1.125rem;
        }
        .search-input {
          width: 100%;
          padding: var(--space-4) var(--space-4) var(--space-4) var(--space-10);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 1rem;
          background: white;
          color: var(--color-gray-900);
        }
        .search-input::placeholder { color: var(--color-gray-400); }
        .search-input:focus { outline: 2px solid var(--color-green-400); }
        .search-select {
          padding: var(--space-4);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: white;
          color: var(--color-gray-700);
        }
        .search-select:focus { outline: 2px solid var(--color-green-400); }

        .search-results { padding: var(--space-8) 0 var(--space-16); }
        .results-count {
          font-size: 0.875rem;
          color: var(--color-gray-500);
          margin-bottom: var(--space-4);
        }
        .results-list { display: flex; flex-direction: column; gap: var(--space-3); }
        .result-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-5) var(--space-6);
          background: white;
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-lg);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .result-card:hover {
          border-color: var(--color-green-400);
          box-shadow: var(--shadow-md);
        }
        .result-name { font-size: 1.125rem; margin-bottom: var(--space-1); }
        .result-location { font-size: 0.875rem; color: var(--color-gray-500); margin-bottom: var(--space-1); }
        .result-lines { font-size: 0.8125rem; color: var(--color-gray-400); }
        .result-meta { display: flex; align-items: center; gap: var(--space-4); }
        .result-type {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-green-700);
          background: var(--color-green-50);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-md);
        }
        .result-arrow { color: var(--color-gray-300); font-size: 1.25rem; }

        .no-results {
          text-align: center;
          padding: var(--space-16) 0;
          color: var(--color-gray-500);
        }

        @media (max-width: 768px) {
          .search-form { flex-direction: column; }
          .search-title { font-size: 1.5rem; }
        }
      `}</style>
    </div>
  );
}
