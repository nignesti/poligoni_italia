/**
 * Query di lettura/scrittura per la dashboard gestore (app/(gestore)),
 * sempre scoperte a un singolo rangeId — il chiamante (Server Action) deve
 * aver già verificato con requireManagedRange() che l'utente gestisce
 * proprio quella struttura, queste funzioni non lo ricontrollano.
 *
 * Orari (range_hours) riusa listRangeHoursForAdmin/replaceRangeHoursForAdmin
 * da admin-ranges.ts invece di duplicarle: prendono già solo un rangeId,
 * nessuna logica admin-specifica dentro, funzionano identiche qui.
 */
import { and, asc, count, eq, gte, isNull } from 'drizzle-orm';
import type { RangeType } from '@poligoni/schemas/ranges';
import { getDb } from '../client.js';
import { ranges, rangeClosures, rangeHours, rangePricing, rangeServices } from '../schema/ranges.js';
import { bookingRequests } from '../schema/bookings.js';

// --- Anagrafica ---
// Sottoinsieme di AdminRangeInput: lat/lng, status e dataSource restano
// admin-only (non toccati da un gestore singola-struttura).

export interface GestoreRangeDetail {
  id: string;
  name: string;
  type: RangeType;
  address: string | null;
  comune: string;
  provincia: string;
  regione: string;
  cap: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

export interface GestoreRangeInput {
  name: string;
  type: RangeType;
  address: string | null;
  comune: string;
  provincia: string;
  regione: string;
  cap: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
}

export async function getRangeForGestore(rangeId: string): Promise<GestoreRangeDetail | null> {
  const db = getDb();
  const [row] = await db
    .select({
      id: ranges.id,
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
    })
    .from(ranges)
    .where(eq(ranges.id, rangeId))
    .limit(1);
  return row ?? null;
}

export async function updateRangeForGestore(rangeId: string, input: GestoreRangeInput): Promise<void> {
  const db = getDb();
  await db
    .update(ranges)
    .set({ ...input, updatedAt: new Date() })
    .where(eq(ranges.id, rangeId));
}

// --- Chiusure straordinarie ---

export interface GestoreClosure {
  id: string;
  dateFrom: string;
  dateTo: string;
  reason: string;
  isRecurring: boolean;
}

export interface GestoreClosureInput {
  dateFrom: string;
  dateTo: string;
  reason: string;
  isRecurring: boolean;
}

export async function listClosuresForGestore(rangeId: string): Promise<GestoreClosure[]> {
  const db = getDb();
  return db
    .select({
      id: rangeClosures.id,
      dateFrom: rangeClosures.dateFrom,
      dateTo: rangeClosures.dateTo,
      reason: rangeClosures.reason,
      isRecurring: rangeClosures.isRecurring,
    })
    .from(rangeClosures)
    .where(eq(rangeClosures.rangeId, rangeId))
    .orderBy(asc(rangeClosures.dateFrom));
}

export async function replaceClosuresForGestore(rangeId: string, slots: GestoreClosureInput[]): Promise<void> {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.delete(rangeClosures).where(eq(rangeClosures.rangeId, rangeId));
    if (slots.length > 0) {
      await tx.insert(rangeClosures).values(slots.map((s) => ({ rangeId, ...s })));
    }
  });
}

// --- Listino (prezzi) ---

export interface GestorePricingItem {
  id: string;
  item: string;
  priceCents: number;
  unit: string | null;
  note: string | null;
}

export interface GestorePricingInput {
  item: string;
  priceCents: number;
  unit: string | null;
  note: string | null;
}

export async function listPricingForGestore(rangeId: string): Promise<GestorePricingItem[]> {
  const db = getDb();
  return db
    .select({
      id: rangePricing.id,
      item: rangePricing.item,
      priceCents: rangePricing.priceCents,
      unit: rangePricing.unit,
      note: rangePricing.note,
    })
    .from(rangePricing)
    .where(eq(rangePricing.rangeId, rangeId))
    .orderBy(asc(rangePricing.item));
}

export async function replacePricingForGestore(rangeId: string, items: GestorePricingInput[]): Promise<void> {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.delete(rangePricing).where(eq(rangePricing.rangeId, rangeId));
    if (items.length > 0) {
      await tx.insert(rangePricing).values(items.map((i) => ({ rangeId, ...i })));
    }
  });
}

// --- Servizi ---

export interface GestoreServiceItem {
  id: string;
  service: string;
  available: boolean;
  priceCents: number | null;
}

export interface GestoreServiceInput {
  service: string;
  available: boolean;
  priceCents: number | null;
}

export async function listServicesForGestore(rangeId: string): Promise<GestoreServiceItem[]> {
  const db = getDb();
  return db
    .select({
      id: rangeServices.id,
      service: rangeServices.service,
      available: rangeServices.available,
      priceCents: rangeServices.priceCents,
    })
    .from(rangeServices)
    .where(eq(rangeServices.rangeId, rangeId))
    .orderBy(asc(rangeServices.service));
}

export async function replaceServicesForGestore(rangeId: string, items: GestoreServiceInput[]): Promise<void> {
  const db = getDb();
  await db.transaction(async (tx) => {
    await tx.delete(rangeServices).where(eq(rangeServices.rangeId, rangeId));
    if (items.length > 0) {
      await tx.insert(rangeServices).values(items.map((i) => ({ rangeId, ...i })));
    }
  });
}

// --- Richieste di disponibilità ---
// Create-side (form pubblico) non ancora costruito: questa tabella è
// verosimilmente vuota finché non esiste un flusso che ci scrive. La
// dashboard gestore qui sotto legge e aggiorna l'esito, non crea richieste.

export interface GestoreBookingRequest {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  requestedFor: string;
  message: string | null;
  forwardedAt: string | null;
  outcome: string | null;
  createdAt: string;
}

export async function listBookingRequestsForGestore(rangeId: string): Promise<GestoreBookingRequest[]> {
  const db = getDb();
  const rows = await db
    .select()
    .from(bookingRequests)
    .where(eq(bookingRequests.rangeId, rangeId))
    .orderBy(asc(bookingRequests.requestedFor));
  return rows.map((r) => ({
    id: r.id,
    name: r.name,
    email: r.email,
    phone: r.phone,
    requestedFor: r.requestedFor.toISOString(),
    message: r.message,
    forwardedAt: r.forwardedAt?.toISOString() ?? null,
    outcome: r.outcome,
    createdAt: r.createdAt.toISOString(),
  }));
}

// --- Riepilogo dashboard ---
// Niente prenotazioni/recensioni finte: quel sistema non esiste ancora
// (booking_requests è "fase T2 — senza prenotazione reale", vedi schema
// bookings.ts). Solo conteggi reali su ciò che è già configurato.

export interface GestoreDashboardSummary {
  pendingRequests: number;
  hoursConfigured: number;
  pricingItems: number;
  nextClosure: { dateFrom: string; reason: string } | null;
}

export async function getGestoreDashboardSummary(rangeId: string): Promise<GestoreDashboardSummary> {
  const db = getDb();
  const today = new Date().toISOString().slice(0, 10);

  const [[pending], [hours], [pricing], [closure]] = await Promise.all([
    db
      .select({ n: count() })
      .from(bookingRequests)
      .where(and(eq(bookingRequests.rangeId, rangeId), isNull(bookingRequests.outcome))),
    db.select({ n: count() }).from(rangeHours).where(eq(rangeHours.rangeId, rangeId)),
    db.select({ n: count() }).from(rangePricing).where(eq(rangePricing.rangeId, rangeId)),
    db
      .select({ dateFrom: rangeClosures.dateFrom, reason: rangeClosures.reason })
      .from(rangeClosures)
      .where(and(eq(rangeClosures.rangeId, rangeId), gte(rangeClosures.dateTo, today)))
      .orderBy(asc(rangeClosures.dateFrom))
      .limit(1),
  ]);

  return {
    pendingRequests: pending?.n ?? 0,
    hoursConfigured: hours?.n ?? 0,
    pricingItems: pricing?.n ?? 0,
    nextClosure: closure ?? null,
  };
}

export async function markBookingRequestForwardedForGestore(
  rangeId: string,
  requestId: string,
  outcome: string,
): Promise<void> {
  const db = getDb();
  await db
    .update(bookingRequests)
    .set({ forwardedAt: new Date(), outcome })
    .where(and(eq(bookingRequests.id, requestId), eq(bookingRequests.rangeId, rangeId)));
}
