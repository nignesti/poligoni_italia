'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { MagnifyingGlass, CaretRight } from '@phosphor-icons/react/ssr';
import { Container } from '@/components/Container';
import { DEMO_RANGES } from '@/lib/fixtures';
import { slugify } from '@/lib/slugify';
import { RANGE_TYPE_LABEL } from '@/lib/format';
import type { RangeType } from '@poligoni/schemas/ranges';

// ---------------------------------------------------------------------------
// Cerca: pagina interattiva con filtri (Piano_Sviluppo_App.md §7.1, client,
// mappa e filtri interattivi). La mappa è demandata a T3: qui solo elenco e
// filtri testuali, che coprono già la maggior parte dei casi d'uso.
// ---------------------------------------------------------------------------

const TYPE_FILTERS: { value: RangeType | ''; label: string }[] = [
  { value: '', label: 'Tutti i tipi' },
  { value: 'tsn', label: 'Sezioni TSN' },
  { value: 'privato', label: 'Poligoni privati' },
  { value: 'tiro_a_volo', label: 'Tiro a volo' },
  { value: 'dinamico', label: 'Campi dinamici' },
  { value: 'long_range', label: 'Long range' },
];

export default function SearchPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<RangeType | ''>('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DEMO_RANGES.filter((r) => {
      if (q) {
        const matches =
          r.name.toLowerCase().includes(q) ||
          r.comune.toLowerCase().includes(q) ||
          r.provincia.toLowerCase().includes(q);
        if (!matches) return false;
      }
      if (typeFilter && r.type !== typeFilter) return false;
      return true;
    });
  }, [search, typeFilter]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="pb-16">
      <div className="border-b border-hairline bg-surface-sunken py-10">
        <Container>
          <h1 className="text-2xl font-semibold text-ink md:text-3xl">Cerca un poligono</h1>
          <form onSubmit={handleSubmit} className="mt-6 flex max-w-2xl flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <MagnifyingGlass
                size={18}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-faint"
                aria-hidden
              />
              <input
                type="text"
                placeholder="Città, provincia o nome del poligono"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-control border border-hairline-strong bg-surface py-3 pl-11 pr-4 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
              />
            </div>
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as RangeType | '')}
              className="rounded-control border border-hairline-strong bg-surface px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
            >
              {TYPE_FILTERS.map((f) => (
                <option key={f.value} value={f.value}>
                  {f.label}
                </option>
              ))}
            </select>
          </form>
        </Container>
      </div>

      <Container className="pt-8">
        <p className="text-sm text-ink-muted">{filtered.length} risultati</p>

        {filtered.length === 0 ? (
          <p className="py-16 text-center text-ink-muted">
            Nessun poligono trovato. Prova a modificare i filtri.
          </p>
        ) : (
          <div className="mt-4 flex flex-col gap-3">
            {filtered.map((r) => (
              <Link
                key={r.slug}
                href={`/poligoni/${slugify(r.regione)}/${slugify(r.provincia)}/${r.slug}`}
                className="flex items-center justify-between gap-4 rounded-panel border border-hairline bg-surface px-6 py-5 hover:border-accent hover:shadow-panel"
              >
                <div>
                  <h2 className="font-medium text-ink">{r.name}</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    {r.comune} ({r.provincia})
                  </p>
                  <p className="mt-1 text-xs text-ink-faint">
                    Linee: {r.lines.map((l) => `${l.distanceMeters} m`).join(', ')}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-accent-wash px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
                    {RANGE_TYPE_LABEL[r.type]}
                  </span>
                  <CaretRight size={18} className="text-ink-faint" aria-hidden />
                </div>
              </Link>
            ))}
          </div>
        )}
      </Container>
    </div>
  );
}
