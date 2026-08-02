/**
 * Query di lettura/scrittura per la dashboard admin (app/(admin)/admin).
 *
 * Separate da queries/ranges.ts (di sole letture pubbliche, con valori
 * normalizzati per la visualizzazione) perché qui vale l'opposto: l'admin
 * deve vedere i valori grezzi così come stanno nel DB — è lo strumento con
 * cui si correggono comune/provincia/regione scritti male, normalizzarli in
 * lettura nasconderebbe proprio i problemi da sistemare.
 */
import { asc, eq, sql } from 'drizzle-orm';
import type { RangeType, RangeStatus } from '@poligoni/schemas/ranges';
import { getDb } from '../client.js';
import { ranges, rangeHours } from '../schema/ranges.js';

export interface AdminRangeSummary {
  id: string;
  slug: string;
  name: string;
  type: RangeType;
  comune: string;
  provincia: string;
  regione: string;
  status: RangeStatus;
}

export interface AdminRangeDetail {
  id: string;
  slug: string;
  name: string;
  type: RangeType;
  address: string | null;
  comune: string;
  provincia: string;
  regione: string;
  cap: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: RangeStatus;
  dataSource: string | null;
}

export interface AdminRangeInput {
  name: string;
  type: RangeType;
  address: string | null;
  comune: string;
  provincia: string;
  regione: string;
  cap: string | null;
  lat: number;
  lng: number;
  phone: string | null;
  email: string | null;
  website: string | null;
  status: RangeStatus;
  dataSource: string | null;
}

function parseGeoJsonPoint(geoJson: string | null): { lat: number; lng: number } {
  if (!geoJson) return { lat: 0, lng: 0 };
  const parsed = JSON.parse(geoJson) as { coordinates?: [number, number] };
  const [lng, lat] = parsed.coordinates ?? [0, 0];
  return { lat, lng };
}

const locationGeoJson = sql<string>`ST_AsGeoJSON(${ranges.location})`;

/** Tutte le strutture, ogni status incluso 'inattivo' — a differenza delle query pubbliche. */
export async function listAllRangesForAdmin(): Promise<AdminRangeSummary[]> {
  const db = getDb();
  return db
    .select({
      id: ranges.id,
      slug: ranges.slug,
      name: ranges.name,
      type: ranges.type,
      comune: ranges.comune,
      provincia: ranges.provincia,
      regione: ranges.regione,
      status: ranges.status,
    })
    .from(ranges)
    .orderBy(asc(ranges.name));
}

export async function findRangeByIdForAdmin(id: string): Promise<AdminRangeDetail | null> {
  const db = getDb();
  const [row] = await db
    .select({
      id: ranges.id,
      slug: ranges.slug,
      name: ranges.name,
      type: ranges.type,
      address: ranges.address,
      comune: ranges.comune,
      provincia: ranges.provincia,
      regione: ranges.regione,
      cap: ranges.cap,
      phone: ranges.phone,
      email: ranges.email,
      website: ranges.website,
      status: ranges.status,
      dataSource: ranges.dataSource,
      locationGeoJson,
    })
    .from(ranges)
    .where(eq(ranges.id, id))
    .limit(1);

  if (!row) return null;
  const { locationGeoJson: geoJson, ...rest } = row;
  return { ...rest, ...parseGeoJsonPoint(geoJson) };
}

/** True se lo slug è già in uso da un'altra struttura (o da qualunque struttura, se excludeId omesso). */
export async function isSlugTaken(slug: string, excludeId?: string): Promise<boolean> {
  const db = getDb();
  const rows = await db.select({ id: ranges.id }).from(ranges).where(eq(ranges.slug, slug));
  return rows.some((r) => r.id !== excludeId);
}

export async function insertRangeAdmin(
  input: AdminRangeInput & { slug: string },
): Promise<{ id: string }> {
  const db = getDb();
  const [row] = await db
    .insert(ranges)
    .values({
      slug: input.slug,
      name: input.name,
      type: input.type,
      address: input.address,
      comune: input.comune,
      provincia: input.provincia,
      regione: input.regione,
      cap: input.cap,
      location: { lat: input.lat, lng: input.lng },
      phone: input.phone,
      email: input.email,
      website: input.website,
      status: input.status,
      dataSource: input.dataSource,
    })
    .returning({ id: ranges.id });
  return row!;
}

export async function updateRangeAdmin(id: string, input: AdminRangeInput): Promise<void> {
  const db = getDb();
  await db
    .update(ranges)
    .set({
      name: input.name,
      type: input.type,
      address: input.address,
      comune: input.comune,
      provincia: input.provincia,
      regione: input.regione,
      cap: input.cap,
      location: { lat: input.lat, lng: input.lng },
      phone: input.phone,
      email: input.email,
      website: input.website,
      status: input.status,
      dataSource: input.dataSource,
      updatedAt: new Date(),
    })
    .where(eq(ranges.id, id));
}

export interface AdminRangeHour {
  id: string;
  weekday: number;
  opensAt: string;
  closesAt: string;
}

export interface AdminRangeHourInput {
  weekday: number;
  opensAt: string;
  closesAt: string;
}

/** weekday: 0 = Domenica ... 6 = Sabato (Date.getDay()), stessa convenzione di queries/ranges.ts. */
export async function listRangeHoursForAdmin(rangeId: string): Promise<AdminRangeHour[]> {
  const db = getDb();
  return db
    .select({
      id: rangeHours.id,
      weekday: rangeHours.weekday,
      opensAt: rangeHours.opensAt,
      closesAt: rangeHours.closesAt,
    })
    .from(rangeHours)
    .where(eq(rangeHours.rangeId, rangeId))
    .orderBy(asc(rangeHours.weekday), asc(rangeHours.opensAt));
}

/**
 * Sostituisce tutte le fasce orarie della struttura con `slots` (delete +
 * insert in transazione): più semplice di un diff riga-per-riga, e la UI
 * gestisce già l'intera settimana come un unico form salvato in blocco.
 */
export async function replaceRangeHoursForAdmin(
  rangeId: string,
  slots: AdminRangeHourInput[],
): Promise<void> {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.delete(rangeHours).where(eq(rangeHours.rangeId, rangeId));
    if (slots.length > 0) {
      await tx.insert(rangeHours).values(
        slots.map((s) => ({
          rangeId,
          weekday: s.weekday,
          opensAt: s.opensAt,
          closesAt: s.closesAt,
        })),
      );
    }
  });
}
