/**
 * Unisce i dati arricchiti da Google Places (../../../poligoni_italia_arricchito.json,
 * prodotto da maps_scraping.py) nel database — solo per riempire buchi, mai
 * per sovrascrivere dati già presenti (in particolare gli orari verificati a
 * mano dai siti ufficiali in hours-2026-07.ts restano quelli).
 *
 * Di default gira in dry-run (stampa cosa farebbe, non scrive nulla).
 * Uso:
 *   DATABASE_URL=postgres://... pnpm exec tsx scripts/merge-google-places.ts           # anteprima
 *   DATABASE_URL=postgres://... pnpm exec tsx scripts/merge-google-places.ts --write   # scrive
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import { eq } from 'drizzle-orm';
import { ranges, rangeHours } from '../src/schema/ranges.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const INPUT_FILE = path.join(__dirname, '../../../../poligoni_italia_arricchito.json');
const WRITE = process.argv.includes('--write');

interface GooglePlacesRow {
  slug: string;
  name: string;
  comune: string;
  address: string | null;
  phone: string | null;
  website: string | null;
  indirizzo_completo?: string;
  google_rating?: number;
  google_reviews?: number;
  orari?: string[];
}

const WEEKDAY_MAP: Record<string, number> = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
};

/** "8:45 AM – 5:00 PM" -> ["08:45", "17:00"] o null se non parsabile. */
function parseTimeRange(raw: string): [string, string] | null {
  const normalized = raw.replace(/[   ]/g, ' ').trim();
  const parts = normalized.split(/[–‒-]/).map((s) => s.trim());
  if (parts.length !== 2) return null;

  const parseOne = (s: string): string | null => {
    const m = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i.exec(s);
    if (!m) return null;
    let hour = Number(m[1]);
    const minute = m[2];
    const meridiem = m[3]!.toUpperCase();
    if (meridiem === 'PM' && hour !== 12) hour += 12;
    if (meridiem === 'AM' && hour === 12) hour = 0;
    return `${String(hour).padStart(2, '0')}:${minute}`;
  };

  const start = parseOne(parts[0]!);
  const end = parseOne(parts[1]!);
  if (!start || !end) return null;
  return [start, end];
}

function parseWeekdayText(weekdayText: string[]): { weekday: number; opensAt: string; closesAt: string }[] {
  const out: { weekday: number; opensAt: string; closesAt: string }[] = [];
  for (const line of weekdayText) {
    const [dayName, ...rest] = line.split(': ');
    const weekday = WEEKDAY_MAP[dayName!.trim()];
    if (weekday === undefined) continue;
    const hoursPart = rest.join(': ').trim();
    if (!hoursPart || /closed/i.test(hoursPart)) continue;

    for (const segment of hoursPart.split(',')) {
      const parsed = parseTimeRange(segment);
      if (parsed) out.push({ weekday, opensAt: parsed[0], closesAt: parsed[1] });
    }
  }
  return out;
}

async function main(): Promise<void> {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL non impostata.');
    process.exitCode = 1;
    return;
  }

  const googleRows: GooglePlacesRow[] = JSON.parse(readFileSync(INPUT_FILE, 'utf-8'));

  const client = postgres(databaseUrl, { max: 1 });
  const db = drizzle(client);

  try {
    let addressFilled = 0;
    let phoneFilled = 0;
    let websiteFilled = 0;
    let hoursFilledRanges = 0;
    let hoursFilledRows = 0;
    let skippedNoParse = 0;

    for (const g of googleRows) {
      const [current] = await db
        .select({
          id: ranges.id,
          address: ranges.address,
          phone: ranges.phone,
          website: ranges.website,
        })
        .from(ranges)
        .where(eq(ranges.slug, g.slug))
        .limit(1);

      if (!current) {
        console.warn(`Slug "${g.slug}" non trovato in ranges, salto.`);
        continue;
      }

      const updates: Record<string, string> = {};
      if (!current.address && g.indirizzo_completo) {
        updates.address = g.indirizzo_completo;
        addressFilled++;
      }
      if (!current.phone && g.phone) {
        updates.phone = g.phone;
        phoneFilled++;
      }
      if (!current.website && g.website) {
        updates.website = g.website;
        websiteFilled++;
      }

      if (Object.keys(updates).length > 0) {
        console.log(`${WRITE ? '[SCRITTO]' : '[dry-run]'} ${g.name}:`, updates);
        if (WRITE) {
          await db.update(ranges).set(updates).where(eq(ranges.id, current.id));
        }
      }

      const existingHours = await db
        .select({ id: rangeHours.id })
        .from(rangeHours)
        .where(eq(rangeHours.rangeId, current.id))
        .limit(1);

      if (existingHours.length === 0 && g.orari && g.orari.length > 0) {
        const parsedHours = parseWeekdayText(g.orari);
        if (parsedHours.length > 0) {
          console.log(
            `${WRITE ? '[SCRITTO]' : '[dry-run]'} ${g.name}: ${parsedHours.length} righe orario`,
          );
          if (WRITE) {
            await db.insert(rangeHours).values(
              parsedHours.map((h) => ({ rangeId: current.id, weekday: h.weekday, opensAt: h.opensAt, closesAt: h.closesAt })),
            );
          }
          hoursFilledRanges++;
          hoursFilledRows += parsedHours.length;
        } else {
          skippedNoParse++;
        }
      }
    }

    console.log(`\n${WRITE ? 'SCRITTO' : 'ANTEPRIMA (dry-run, nessuna scrittura)'}`);
    console.log(`Indirizzi riempiti: ${addressFilled}`);
    console.log(`Telefoni riempiti: ${phoneFilled}`);
    console.log(`Siti riempiti: ${websiteFilled}`);
    console.log(`Strutture con orari aggiunti: ${hoursFilledRanges} (${hoursFilledRows} righe)`);
    console.log(`Orari non parsabili (saltati): ${skippedNoParse}`);
  } finally {
    await client.end();
  }
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
