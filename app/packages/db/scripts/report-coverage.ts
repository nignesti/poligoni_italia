/**
 * Genera una tabella di stato: per ogni struttura, quali campi di
 * arricchimento (sito/social, telefono, indirizzo, orari) sono presenti.
 * Utile per capire cosa manca ancora dopo il censimento iniziale.
 *
 * Uso: DATABASE_URL=postgres://... pnpm exec tsx scripts/report-coverage.ts
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { ranges, rangeHours } from '../src/schema/ranges.js';

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL non impostata.');
    process.exitCode = 1;
    return;
  }

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  try {
    const [baseRows, hoursRows] = await Promise.all([
      db
        .select({
          id: ranges.id,
          slug: ranges.slug,
          name: ranges.name,
          type: ranges.type,
          comune: ranges.comune,
          provincia: ranges.provincia,
          regione: ranges.regione,
          address: ranges.address,
          phone: ranges.phone,
          website: ranges.website,
        })
        .from(ranges)
        .orderBy(ranges.regione, ranges.provincia, ranges.name),
      db.select({ rangeId: rangeHours.rangeId }).from(rangeHours),
    ]);

    const hoursCountByRangeId = new Map<string, number>();
    for (const h of hoursRows) {
      hoursCountByRangeId.set(h.rangeId, (hoursCountByRangeId.get(h.rangeId) ?? 0) + 1);
    }

    const rows = baseRows.map((r) => ({ ...r, hoursCount: hoursCountByRangeId.get(r.id) ?? 0 }));

    const total = rows.length;
    const withWebsite = rows.filter((r) => r.website).length;
    const withPhone = rows.filter((r) => r.phone).length;
    const withAddress = rows.filter((r) => r.address).length;
    const withHours = rows.filter((r) => r.hoursCount > 0).length;

    const lines: string[] = [];
    lines.push(`# Copertura dati — ${total} strutture`);
    lines.push('');
    lines.push(`Generato: ${new Date().toISOString()}`);
    lines.push('');
    lines.push(`| Campo | Presente | % |`);
    lines.push(`|---|---|---|`);
    lines.push(`| Sito/social | ${withWebsite}/${total} | ${Math.round((withWebsite / total) * 100)}% |`);
    lines.push(`| Telefono | ${withPhone}/${total} | ${Math.round((withPhone / total) * 100)}% |`);
    lines.push(`| Indirizzo | ${withAddress}/${total} | ${Math.round((withAddress / total) * 100)}% |`);
    lines.push(`| Orari | ${withHours}/${total} | ${Math.round((withHours / total) * 100)}% |`);
    lines.push('');
    lines.push('## Dettaglio per struttura');
    lines.push('');
    lines.push('| Nome | Comune (Prov) | Regione | Sito | Tel | Indirizzo | Orari |');
    lines.push('|---|---|---|---|---|---|---|');
    for (const r of rows) {
      const ok = (v: unknown) => (v ? '✅' : '—');
      lines.push(
        `| ${r.name} | ${r.comune} (${r.provincia}) | ${r.regione} | ${ok(r.website)} | ${ok(r.phone)} | ${ok(r.address)} | ${r.hoursCount > 0 ? `✅ (${r.hoursCount})` : '—'} |`,
      );
    }

    console.log(lines.join('\n'));
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
