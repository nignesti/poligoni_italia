'use client';

import { useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { MagnifyingGlass, CaretRight, MapPin } from '@phosphor-icons/react/ssr';
import { Container } from '@/components/Container';
import { slugify } from '@/lib/slugify';
import { RANGE_TYPE_LABEL } from '@/lib/format';
import type { RangeType } from '@poligoni/schemas/ranges';
import type { RangeSummary } from '@/lib/ranges';

// ---------------------------------------------------------------------------
// Client component: riceve l'elenco già caricato dal server (page.tsx) e
// applica solo il filtro interattivo lato browser. Non può interrogare il
// database direttamente — `postgres` non è bundlabile nel client (Piano
// §7.1, mappa e filtri interattivi demandati a T3).
// ---------------------------------------------------------------------------

const TYPE_FILTERS: { value: RangeType | ''; label: string }[] = [
  { value: '', label: 'Tutti i tipi' },
  { value: 'tsn', label: 'Sezioni TSN' },
  { value: 'privato', label: 'Poligoni privati' },
  { value: 'tiro_a_volo', label: 'Tiro a volo' },
  { value: 'dinamico', label: 'Campi dinamici' },
  { value: 'long_range', label: 'Long range' },
];

export function SearchClient({ ranges }: { ranges: RangeSummary[] }) {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<RangeType | ''>('');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ranges.filter((r) => {
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
  }, [ranges, search, typeFilter]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="pb-16">
      <div className="border-b border-hairline bg-surface-sunken py-10">
        <Container>
          <h1 className="text-2xl font-black uppercase tracking-tight text-ink md:text-3xl">
            Cerca un poligono
          </h1>
          <form onSubmit={handleSubmit} className="mt-6 max-w-2xl">
            <div className="relative">
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
          </form>

          <div role="group" aria-label="Filtra per tipo" className="mt-4 flex flex-wrap gap-2">
            {TYPE_FILTERS.map((f) => (
              <button
                key={f.value}
                type="button"
                aria-pressed={typeFilter === f.value}
                onClick={() => setTypeFilter(f.value)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-wide transition-colors ${
                  typeFilter === f.value
                    ? 'bg-accent text-accent-ink'
                    : 'border border-hairline-strong text-ink-muted hover:border-accent hover:text-accent'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
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
                className="flex items-center justify-between gap-4 rounded-panel border border-hairline bg-surface px-6 py-5 transition-colors hover:border-accent hover:shadow-panel"
              >
                <div>
                  <h2 className="font-bold uppercase tracking-tight text-ink">{r.name}</h2>
                  <p className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
                    <MapPin size={14} className="shrink-0 text-ink-faint" aria-hidden />
                    {r.comune} ({r.provincia})
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-full bg-accent-wash px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
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
