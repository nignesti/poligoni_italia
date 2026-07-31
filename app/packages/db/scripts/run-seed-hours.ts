/**
 * Carica HOURS_ROWS (src/seed/hours-2026-07.ts) nella tabella `range_hours`.
 *
 * Idempotente per struttura: prima di inserire, cancella le righe esistenti
 * per quello slug così un rilancio non duplica gli orari né lascia residui
 * se un orario cambia tra un lotto di scraping e il successivo.
 *
 * Uso: DATABASE_URL=postgres://... pnpm exec tsx scripts/run-seed-hours.ts
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { ranges, rangeHours } from '../src/schema/ranges.js';
import { HOURS_ROWS } from '../src/seed/hours-2026-07.js';

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
    const bySlug = new Map<string, typeof HOURS_ROWS>();
    for (const row of HOURS_ROWS) {
      const list = bySlug.get(row.slug) ?? [];
      list.push(row);
      bySlug.set(row.slug, list);
    }

    let structuresUpdated = 0;
    let rowsInserted = 0;

    for (const [slug, hoursForSlug] of bySlug) {
      const [range] = await db.select({ id: ranges.id }).from(ranges).where(eq(ranges.slug, slug)).limit(1);
      if (!range) {
        console.warn(`Slug "${slug}" non trovato in ranges, salto.`);
        continue;
      }

      await db.delete(rangeHours).where(eq(rangeHours.rangeId, range.id));
      await db.insert(rangeHours).values(
        hoursForSlug.map((h) => ({
          rangeId: range.id,
          weekday: h.weekday,
          opensAt: h.opensAt,
          closesAt: h.closesAt,
        })),
      );

      structuresUpdated++;
      rowsInserted += hoursForSlug.length;
    }

    console.log(`Fatto. ${structuresUpdated} strutture aggiornate, ${rowsInserted} righe orario inserite.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
