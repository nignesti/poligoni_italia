/**
 * Carica il censimento (src/seed/census-2026-07.ts + coords cache) nella
 * tabella `ranges`.
 *
 * Idempotente: usa lo slug come chiave di conflitto, rilanciabile senza
 * duplicare righe. NON inventa orari, listino, calibri o servizi: il
 * censimento originale li segnala esplicitamente come "da raccogliere sul
 * campo" (Piano_Sviluppo_App.md §15.2, T1). Ogni riga inserita ha
 * status='censito' (mai 'partner'): nessuna di queste strutture ha
 * confermato una relazione con la piattaforma.
 *
 * Richiede DATABASE_URL. Senza, esce con un errore chiaro: non finge un
 * seed riuscito che non è avvenuto.
 *
 * Uso: DATABASE_URL=postgres://... pnpm db:seed
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { slugify } from '@poligoni/core/slug';
import { sql } from 'drizzle-orm';
import { ranges } from '../src/schema/ranges.js';
import { CENSUS_ROWS, type CensusRow } from '../src/seed/census-2026-07.js';
import { provinciaFromSigla } from '../src/seed/province-sigle.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COORDS_FILE = path.join(__dirname, '../src/seed/census-2026-07.coords.json');

interface CoordEntry {
  lat: number;
  lng: number;
  precision: 'comune';
}

function buildSlug(row: CensusRow, usedSlugs: Set<string>): string {
  let candidate = slugify(row.name);
  if (usedSlugs.has(candidate)) {
    candidate = slugify(`${row.name} ${row.comune}`);
  }
  let n = 2;
  const base = candidate;
  while (usedSlugs.has(candidate)) {
    candidate = `${base}-${n}`;
    n++;
  }
  usedSlugs.add(candidate);
  return candidate;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error(
      'DATABASE_URL non impostata. Il seed non può essere eseguito senza un database reale ' +
        '(nessun risultato viene simulato). Esempio: DATABASE_URL=postgres://user:pass@host:5432/db pnpm db:seed',
    );
    process.exitCode = 1;
    return;
  }

  const coords = JSON.parse(await readFile(COORDS_FILE, 'utf-8')) as Record<string, CoordEntry>;

  const usedSlugs = new Set<string>();
  const rows = CENSUS_ROWS.map((row) => {
    const coordKey = `${row.comune}|${row.provinciaSigla}`;
    const coord = coords[coordKey];
    if (!coord) {
      throw new Error(
        `Nessuna coordinata per "${row.comune}" (${row.provinciaSigla}). Esegui prima "pnpm db:geocode".`,
      );
    }

    return {
      slug: buildSlug(row, usedSlugs),
      name: row.name,
      type: row.type,
      address: row.address ?? '',
      comune: row.comune,
      provincia: provinciaFromSigla(row.provinciaSigla),
      regione: row.regione,
      cap: '',
      location: { lat: coord.lat, lng: coord.lng },
      phone: row.phone ?? null,
      website: row.website ?? null,
      status: 'censito' as const,
      dataSource: row.source,
      verifiedAt: null,
    };
  });

  console.log(`Preparate ${rows.length} righe. Connessione al database...`);

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  try {
    let inserted = 0;

    for (const row of rows) {
      const result = await db
        .insert(ranges)
        .values(row)
        .onConflictDoUpdate({
          target: ranges.slug,
          set: {
            name: row.name,
            type: row.type,
            comune: row.comune,
            provincia: row.provincia,
            regione: row.regione,
            location: row.location,
            phone: row.phone,
            website: row.website,
            dataSource: row.dataSource,
            updatedAt: sql`now()`,
          },
        })
        .returning({ slug: ranges.slug });

      if (result.length > 0) inserted++;
    }

    console.log(`Fatto. ${inserted} righe inserite o aggiornate su ${rows.length}.`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
