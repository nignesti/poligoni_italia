/**
 * Query di lettura pubblica su `ranges`, usate dal sito (apps/web).
 *
 * Sostituiscono apps/web/lib/fixtures.ts: stesse firme di funzione dove
 * possibile, per minimizzare le modifiche alle pagine che le consumano.
 *
 * Le tabelle figlie (range_lines, range_hours, range_pricing,
 * range_services) sono nello schema ma il censimento (packages/db/src/seed)
 * non le popola: non abbiamo linee/orari/prezzi verificati per queste 81
 * strutture, solo anagrafica e posizione. Meglio liste vuote che inventare
 * dati — le pagine già gestiscono il caso vuoto.
 */
import { and, asc, eq, ne, sql } from 'drizzle-orm';
import { slugify } from '@poligoni/core/slug';
import type { Range, RangeType, RangeStatus } from '@poligoni/schemas/ranges';
import { getDb } from '../client.js';
import { PROVINCIA_BY_SIGLA } from '../seed/province-sigle.js';
import {
  ranges,
  rangeHours,
  rangeLines,
  rangePricing,
  rangeServices,
} from '../schema/ranges.js';

export interface RangeSummary {
  id: string;
  slug: string;
  name: string;
  type: RangeType;
  comune: string;
  provincia: string;
  regione: string;
  status: RangeStatus;
  location: { lat: number; lng: number };
}

function parseGeoJsonPoint(geoJson: string | null): { lat: number; lng: number } {
  if (!geoJson) return { lat: 0, lng: 0 };
  const parsed = JSON.parse(geoJson) as { coordinates?: [number, number] };
  const [lng, lat] = parsed.coordinates ?? [0, 0];
  return { lat, lng };
}

/**
 * Le 20 regioni italiane, forma canonica. Alcune fonti importate (es. lo
 * scraping Targetfun, TARGETFUN_IMPORT_LOG.md) scrivono il nome regione in
 * MAIUSCOLO invece che in Title Case: senza normalizzazione, "Sicilia" e
 * "SICILIA" diventano due voci distinte nei raggruppamenti (regionCounts),
 * mostrate come due bottoni "duplicati" sulla home.
 */
const REGIONI_CANONICHE = [
  'Abruzzo',
  'Basilicata',
  'Calabria',
  'Campania',
  'Emilia-Romagna',
  'Friuli-Venezia Giulia',
  'Lazio',
  'Liguria',
  'Lombardia',
  'Marche',
  'Molise',
  'Piemonte',
  'Puglia',
  'Sardegna',
  'Sicilia',
  'Toscana',
  'Trentino-Alto Adige',
  'Umbria',
  "Valle d'Aosta",
  'Veneto',
];
const REGIONE_CANONICA_BY_LOWER = new Map(
  REGIONI_CANONICHE.map((regione) => [regione.toLowerCase(), regione]),
);

/** Riconduce varianti di casing/spazi al nome regione canonico. */
function normalizeRegione(raw: string): string {
  const trimmed = raw.trim();
  return REGIONE_CANONICA_BY_LOWER.get(trimmed.toLowerCase()) ?? trimmed;
}

/**
 * Stesso problema di normalizeRegione ma per il comune: alcune fonti
 * importate scrivono il nome in TUTTO MAIUSCOLO (es. "GUASTALLA" invece di
 * "Guastalla"). Qui non esiste un elenco canonico di ~8000 comuni italiani
 * da usare come lookup: normalizziamo solo quando la stringa è interamente
 * maiuscola (pattern netto e riconoscibile), senza toccare le altre — un
 * title-case generico applicato a tutti rischierebbe di corrompere nomi
 * già corretti (es. "L'Aquila", "Reggio nell'Emilia").
 */
function normalizeComune(raw: string): string {
  const trimmed = raw.trim();
  if (trimmed !== trimmed.toUpperCase() || trimmed === trimmed.toLowerCase()) {
    return trimmed;
  }
  return trimmed
    .toLowerCase()
    .split(/(\s+|'|’|-)/)
    .map((part) => (/^[a-zà-öø-ÿ]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part))
    .join('');
}

/**
 * Alcune fonti importate (Targetfun, tutte le 72 righe del batch — vedi
 * TARGETFUN_IMPORT_LOG.md) scrivono la provincia come sigla ("LE") invece
 * che per esteso ("Lecce"), a differenza del censimento originale: senza
 * normalizzazione, le pagine provincia si frammentano nello stesso modo
 * delle regioni duplicate. Espande solo le sigle a 2 lettere riconosciute
 * in PROVINCIA_BY_SIGLA; il resto (già per esteso) resta invariato.
 */
function normalizeProvincia(raw: string): string {
  const trimmed = raw.trim();
  if (/^[A-Za-z]{2}$/.test(trimmed)) {
    const nomeCompleto = PROVINCIA_BY_SIGLA[trimmed.toUpperCase()];
    if (nomeCompleto) return nomeCompleto;
  }
  return trimmed;
}

const locationGeoJson = sql<string>`ST_AsGeoJSON(${ranges.location})`;

/** Tutte le strutture pubblicabili (esclude 'inattivo'), ordinate per nome. */
export async function listRangeSummaries(): Promise<RangeSummary[]> {
  const db = getDb();
  const rows = await db
    .select({
      id: ranges.id,
      slug: ranges.slug,
      name: ranges.name,
      type: ranges.type,
      comune: ranges.comune,
      provincia: ranges.provincia,
      regione: ranges.regione,
      status: ranges.status,
      locationGeoJson,
    })
    .from(ranges)
    .where(ne(ranges.status, 'inattivo'))
    .orderBy(asc(ranges.name));

  return rows.map(({ locationGeoJson: geoJson, ...r }) => ({
    ...r,
    comune: normalizeComune(r.comune),
    provincia: normalizeProvincia(r.provincia),
    regione: normalizeRegione(r.regione),
    location: parseGeoJsonPoint(geoJson),
  }));
}

/** Dettaglio completo per slug, o null se non trovato/inattivo. */
export async function findRangeBySlug(slug: string): Promise<Range | null> {
  const db = getDb();

  const [base] = await db
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
      externalBookingUrl: ranges.externalBookingUrl,
      managementSoftware: ranges.managementSoftware,
      status: ranges.status,
      dataSource: ranges.dataSource,
      verifiedAt: ranges.verifiedAt,
      locationGeoJson,
    })
    .from(ranges)
    .where(and(eq(ranges.slug, slug), ne(ranges.status, 'inattivo')))
    .limit(1);

  if (!base) return null;

  const [lines, hours, pricing, services] = await Promise.all([
    db.select().from(rangeLines).where(eq(rangeLines.rangeId, base.id)),
    db.select().from(rangeHours).where(eq(rangeHours.rangeId, base.id)),
    db.select().from(rangePricing).where(eq(rangePricing.rangeId, base.id)),
    db.select().from(rangeServices).where(eq(rangeServices.rangeId, base.id)),
  ]);

  const WEEKDAY_LABEL = [
    'Domenica',
    'Lunedì',
    'Martedì',
    'Mercoledì',
    'Giovedì',
    'Venerdì',
    'Sabato',
  ] as const;

  return {
    id: base.id,
    slug: base.slug,
    name: base.name,
    type: base.type,
    // Il seed scrive stringa vuota invece di NULL per address/cap mancanti
    // (packages/db/scripts/run-seed.ts) — normalizzati qui perché lo schema
    // Zod richiede min(1) quando il campo è valorizzato.
    address: base.address || null,
    comune: normalizeComune(base.comune),
    provincia: normalizeProvincia(base.provincia),
    regione: normalizeRegione(base.regione),
    cap: base.cap || null,
    location: parseGeoJsonPoint(base.locationGeoJson),
    phone: base.phone,
    email: base.email,
    website: base.website,
    description: null,
    externalBookingUrl: base.externalBookingUrl,
    managementSoftware: base.managementSoftware,
    status: base.status,
    dataSource: base.dataSource ?? undefined,
    verifiedAt: base.verifiedAt?.toISOString() ?? null,
    lines: lines.map((l) => ({
      name: l.name,
      distanceMeters: l.distanceMeters,
      isIndoor: l.isIndoor,
      capacity: l.capacity,
      calibers: l.calibers,
      disciplines: l.disciplines,
    })),
    hours: hours.map((h) => ({
      day: WEEKDAY_LABEL[h.weekday] ?? 'Lunedì',
      opensAt: h.opensAt,
      closesAt: h.closesAt,
    })),
    services: services.map((s) => ({
      service: s.service,
      available: s.available,
      ...(s.priceCents != null ? { priceCents: s.priceCents } : {}),
    })),
    pricing: pricing.map((p) => ({
      item: p.item,
      priceCents: p.priceCents,
      ...(p.unit ? { unit: p.unit } : {}),
      ...(p.note ? { note: p.note } : {}),
    })),
  };
}

/** Conteggio strutture per regione, ordinato per conteggio decrescente. */
export async function regionCounts(): Promise<{ name: string; slug: string; count: number }[]> {
  const summaries = await listRangeSummaries();
  const counts = new Map<string, number>();
  for (const r of summaries) {
    counts.set(r.regione, (counts.get(r.regione) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

/** Nome regione a partire dallo slug, o undefined se non censita. */
export async function regionNameFromSlug(regioneSlug: string): Promise<string | undefined> {
  const summaries = await listRangeSummaries();
  return summaries.find((r) => slugify(r.regione) === regioneSlug)?.regione;
}

/** Conteggio strutture per provincia, filtrato su una regione (per slug). */
export async function provinceCountsInRegion(
  regioneSlug: string,
): Promise<{ name: string; slug: string; count: number }[]> {
  const summaries = await listRangeSummaries();
  const counts = new Map<string, number>();
  for (const r of summaries) {
    if (slugify(r.regione) !== regioneSlug) continue;
    counts.set(r.provincia, (counts.get(r.provincia) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

/** Strutture in una provincia (per slug). */
export async function rangesByProvincia(provinciaSlug: string): Promise<RangeSummary[]> {
  const summaries = await listRangeSummaries();
  return summaries.filter((r) => slugify(r.provincia) === provinciaSlug);
}

/** Coppie regione+provincia distinte, per generateStaticParams. */
export async function distinctRegioneProvinciaPairs(): Promise<
  { regione: string; provincia: string }[]
> {
  const summaries = await listRangeSummaries();
  const seen = new Set<string>();
  const pairs: { regione: string; provincia: string }[] = [];
  for (const r of summaries) {
    const key = `${r.regione}::${r.provincia}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pairs.push({ regione: slugify(r.regione), provincia: slugify(r.provincia) });
  }
  return pairs;
}

/** Terne regione+provincia+slug per ogni struttura, per generateStaticParams. */
export async function allRegioneProvinciaSlugParams(): Promise<
  { regione: string; provincia: string; slug: string }[]
> {
  const summaries = await listRangeSummaries();
  return summaries.map((r) => ({
    regione: slugify(r.regione),
    provincia: slugify(r.provincia),
    slug: r.slug,
  }));
}
