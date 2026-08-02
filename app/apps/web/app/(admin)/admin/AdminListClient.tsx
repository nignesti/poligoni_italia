'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { AdminRangeSummary } from '@poligoni/db/queries/admin-ranges';
import { RANGE_TYPE_LABEL } from '@/lib/format';

const STATUS_LABEL: Record<string, string> = {
  censito: 'Censito',
  rivendicato: 'Rivendicato',
  partner: 'Partner',
  inattivo: 'Inattivo',
};

export function AdminListClient({ rows }: { rows: AdminRangeSummary[] }) {
  const [q, setQ] = useState('');

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      [r.name, r.comune, r.provincia, r.regione].some((f) => f.toLowerCase().includes(needle)),
    );
  }, [rows, q]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight text-ink">Strutture</h1>
          <p className="mt-1 text-sm text-ink-muted">{rows.length} totali</p>
        </div>
        <Link
          href="/admin/nuovo"
          className="rounded-control bg-accent px-4 py-2.5 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover"
        >
          + Nuova struttura
        </Link>
      </div>

      <input
        type="text"
        placeholder="Cerca per nome, comune, provincia o regione…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="mt-6 w-full max-w-md rounded-control border border-hairline-strong bg-surface px-4 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
      />

      <p className="mt-3 text-sm text-ink-muted">{filtered.length} risultati</p>

      <div className="mt-3 overflow-x-auto rounded-panel border border-hairline">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-hairline bg-surface-sunken text-xs font-bold uppercase tracking-wide text-ink-muted">
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Comune</th>
              <th className="px-4 py-3">Provincia</th>
              <th className="px-4 py-3">Regione</th>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Stato</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((r) => (
              <tr key={r.id} className="border-b border-hairline last:border-0 hover:bg-surface-sunken">
                <td className="px-4 py-3 font-medium text-ink">{r.name}</td>
                <td className="px-4 py-3 text-ink-muted">{r.comune}</td>
                <td className="px-4 py-3 text-ink-muted">{r.provincia}</td>
                <td className="px-4 py-3 text-ink-muted">{r.regione}</td>
                <td className="px-4 py-3 text-ink-muted">{RANGE_TYPE_LABEL[r.type]}</td>
                <td className="px-4 py-3 text-ink-muted">{STATUS_LABEL[r.status] ?? r.status}</td>
                <td className="px-4 py-3 text-right">
                  <Link href={`/admin/${r.id}`} className="font-bold text-accent hover:text-accent-hover">
                    Modifica
                  </Link>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-ink-muted">
                  Nessuna struttura trovata.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
