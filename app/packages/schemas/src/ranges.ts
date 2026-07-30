/**
 * Schemi del dominio strutture (Piano_Sviluppo_App.md §4.1, §6.1).
 */
import { z } from 'zod';
import { coordinatesSchema, slugSchema, uuidSchema } from './common.js';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const rangeTypeSchema = z.enum([
  'tsn',
  'privato',
  'tiro_a_volo',
  'dinamico',
  'long_range',
]);

export type RangeType = z.infer<typeof rangeTypeSchema>;

export const rangeStatusSchema = z.enum([
  'censito',
  'rivendicato',
  'partner',
  'inattivo',
]);

export type RangeStatus = z.infer<typeof rangeStatusSchema>;

export const rangeManagerRoleSchema = z.enum(['proprietario', 'staff']);

export type RangeManagerRole = z.infer<typeof rangeManagerRoleSchema>;

// ---------------------------------------------------------------------------
// Discipline
// ---------------------------------------------------------------------------
export const disciplineSchema = z.enum([
  'tiro_a_segno',
  'tiro_a_volo',
  'tiro_dinamico',
  'long_range',
  'tiro_difensivo',
  'avancarica',
]);

export type Discipline = z.infer<typeof disciplineSchema>;

// ---------------------------------------------------------------------------
// Orari
// ---------------------------------------------------------------------------
export const dayOfWeekSchema = z.enum([
  'Lunedì',
  'Martedì',
  'Mercoledì',
  'Giovedì',
  'Venerdì',
  'Sabato',
  'Domenica',
]);

export const timeStringSchema = z.string().regex(
  /^([01]\d|2[0-3]):([0-5]\d)$/,
  'Formato ora atteso: HH:MM',
);

export const openingHoursSchema = z.object({
  day: dayOfWeekSchema,
  opensAt: timeStringSchema,
  closesAt: timeStringSchema,
  /** Opzionale: data di inizio stagione (per orari stagionali). */
  seasonFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  /** Opzionale: data di fine stagione. */
  seasonTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

export type OpeningHours = z.infer<typeof openingHoursSchema>;

// ---------------------------------------------------------------------------
// Chiusure straordinarie
// ---------------------------------------------------------------------------
export const rangeClosureSchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  reason: z.string().min(1).max(500),
  isRecurring: z.boolean().default(false),
});

export type RangeClosure = z.infer<typeof rangeClosureSchema>;

// ---------------------------------------------------------------------------
// Linee di tiro
// ---------------------------------------------------------------------------
export const rangeLineSchema = z.object({
  id: uuidSchema.optional(),
  name: z.string().min(1).max(200),
  distanceMeters: z.number().int().positive(),
  isIndoor: z.boolean(),
  capacity: z.number().int().positive().default(1),
  calibers: z.array(z.string()).default([]),
  disciplines: z.array(disciplineSchema).default([]),
});

export type RangeLine = z.infer<typeof rangeLineSchema>;

// ---------------------------------------------------------------------------
// Servizi
// ---------------------------------------------------------------------------
export const rangeServiceSchema = z.object({
  service: z.string().min(1).max(100),
  available: z.boolean(),
  priceCents: z.number().int().nonnegative().optional(),
});

export type RangeService = z.infer<typeof rangeServiceSchema>;

// ---------------------------------------------------------------------------
// Prezzi
// ---------------------------------------------------------------------------
export const rangePricingSchema = z.object({
  item: z.string().min(1).max(100),
  priceCents: z.number().int().nonnegative(),
  unit: z.string().max(50).optional(),
  note: z.string().max(500).optional(),
});

export type RangePricing = z.infer<typeof rangePricingSchema>;

// ---------------------------------------------------------------------------
// Struttura completa
// ---------------------------------------------------------------------------
export const rangeSchema = z.object({
  id: uuidSchema.optional(),
  slug: slugSchema,
  name: z.string().min(1).max(300),
  type: rangeTypeSchema,
  // Nullable: le strutture da censimento secondario spesso non hanno un
  // indirizzo civico o CAP verificato. Vedi schema Drizzle in packages/db
  // per la stessa motivazione.
  address: z.string().min(1).max(300).nullable().optional(),
  comune: z.string().min(1).max(100),
  provincia: z.string().min(1).max(100),
  regione: z.string().min(1).max(100),
  cap: z.string().regex(/^\d{5}$/, 'CAP: 5 cifre').nullable().optional(),
  location: coordinatesSchema,
  phone: z.string().max(30).nullable().optional(),
  email: z.string().email().max(200).nullable().optional(),
  website: z.string().url().max(500).nullable().optional(),
  description: z.string().max(5000).nullable().optional(),
  externalBookingUrl: z.string().url().nullable().optional(),
  managementSoftware: z.string().max(100).nullable().optional(),
  status: rangeStatusSchema.default('censito'),
  dataSource: z.string().max(100).optional(),
  verifiedAt: z.string().datetime().nullable().optional(),
  lines: z.array(rangeLineSchema).default([]),
  hours: z.array(openingHoursSchema).default([]),
  services: z.array(rangeServiceSchema).default([]),
  pricing: z.array(rangePricingSchema).default([]),
});

export type Range = z.infer<typeof rangeSchema>;

// ---------------------------------------------------------------------------
// API — Request / Response
// ---------------------------------------------------------------------------

/** Ricerca per raggio geografico (Piano §6.1). */
export const rangeSearchQuerySchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  radius: z.coerce.number().positive().max(200).default(50),
  calibers: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : []))
    .optional(),
  disciplines: z
    .union([z.string(), z.array(z.string())])
    .transform((v) => (Array.isArray(v) ? v : v ? [v] : []))
    .optional(),
  indoor: z.coerce.boolean().optional(),
  openNow: z.coerce.boolean().optional(),
  type: rangeTypeSchema.optional(),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type RangeSearchQuery = z.infer<typeof rangeSearchQuerySchema>;

export const rangeSearchResultSchema = z.object({
  id: uuidSchema,
  slug: slugSchema,
  name: z.string(),
  type: rangeTypeSchema,
  comune: z.string(),
  provincia: z.string(),
  regione: z.string(),
  /** Distanza in km dal punto di ricerca. */
  distanceKm: z.number().nonnegative().nullable(),
  lines: z.array(z.string()),
  hasIndoor: z.boolean(),
  openNow: z.boolean().optional(),
  status: rangeStatusSchema,
});

export type RangeSearchResult = z.infer<typeof rangeSearchResultSchema>;

export const rangeSearchResponseSchema = z.object({
  data: z.array(rangeSearchResultSchema),
  total: z.number().int().nonnegative(),
  nextCursor: z.string().nullable(),
});

export type RangeSearchResponse = z.infer<typeof rangeSearchResponseSchema>;

/** Dettaglio struttura (GET /api/v1/ranges/:slug). */
export const rangeDetailResponseSchema = rangeSchema;

export type RangeDetailResponse = z.infer<typeof rangeDetailResponseSchema>;

// ---------------------------------------------------------------------------
// Gestore — update schede
// ---------------------------------------------------------------------------
export const rangeUpdateSchema = rangeSchema.partial().omit({
  id: true,
  slug: true,
  dataSource: true,
  status: true,
  verifiedAt: true,
});

export type RangeUpdate = z.infer<typeof rangeUpdateSchema>;

export const rangeHoursUpdateSchema = z.object({
  hours: z.array(openingHoursSchema).min(1),
});

export type RangeHoursUpdate = z.infer<typeof rangeHoursUpdateSchema>;

export const rangeClosureCreateSchema = rangeClosureSchema.extend({
  rangeId: uuidSchema,
});

export type RangeClosureCreate = z.infer<typeof rangeClosureCreateSchema>;
