/**
 * Dominio strutture (Piano_Sviluppo_App.md §4.1).
 *
 * Anagrafica dei poligoni. È l'asset proprietario del progetto (BP §3.1).
 *
 * Indici critici (da aggiungere con migrazione SQL manuale, perché PostGIS
 * non è supportato nativamente da Drizzle):
 *   CREATE INDEX ON ranges USING GIST (location);
 *   CREATE INDEX ON ranges (provincia, status);
 *   CREATE INDEX ON ranges (verified_at);
 */
import {
  pgTable,
  uuid,
  text,
  pgEnum,
  integer,
  boolean,
  date,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { geographyPoint } from './helpers.js';

// ---------------------------------------------------------------------------
// Enums PostgreSQL
// ---------------------------------------------------------------------------
export const rangeType = pgEnum('range_type', [
  'tsn',
  'privato',
  'tiro_a_volo',
  'dinamico',
  'long_range',
]);
export type RangeType = (typeof rangeType.enumValues)[number];

export const rangeStatus = pgEnum('range_status', [
  'censito',
  'rivendicato',
  'partner',
  'inattivo',
]);
export type RangeStatus = (typeof rangeStatus.enumValues)[number];

export const rangeManagerRole = pgEnum('range_manager_role', [
  'proprietario',
  'staff',
]);
export type RangeManagerRole = (typeof rangeManagerRole.enumValues)[number];

export const discipline = pgEnum('discipline', [
  'tiro_a_segno',
  'tiro_a_volo',
  'tiro_dinamico',
  'long_range',
  'tiro_difensivo',
  'avancarica',
]);
export type Discipline = (typeof discipline.enumValues)[number];

// ---------------------------------------------------------------------------
// Tabelle
// ---------------------------------------------------------------------------

export const ranges = pgTable('ranges', {
  id: uuid('id').primaryKey().defaultRandom(),
  slug: text('slug').notNull().unique(),
  name: text('name').notNull(),
  type: rangeType('type').notNull(),
  // address/cap nullable: per le strutture da censimento secondario (non
  // inserite dal gestore) spesso non si conosce l'indirizzo civico esatto.
  // Meglio NULL che un indirizzo o CAP inventato (BP §3.5.8, stesso
  // principio: mai fabbricare precisione che non si ha).
  address: text('address'),
  comune: text('comune').notNull(),
  provincia: text('provincia').notNull(),
  regione: text('regione').notNull(),
  cap: text('cap'),
  location: geographyPoint('location').notNull(),
  phone: text('phone'),
  email: text('email'),
  website: text('website'),
  externalBookingUrl: text('external_booking_url'),
  managementSoftware: text('management_software'),
  status: rangeStatus('status').notNull().default('censito'),
  dataSource: text('data_source'),
  verifiedAt: timestamp('verified_at', { withTimezone: true }),
  verifiedBy: uuid('verified_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const rangeHours = pgTable('range_hours', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  weekday: integer('weekday').notNull(),
  opensAt: text('opens_at').notNull(),
  closesAt: text('closes_at').notNull(),
  seasonFrom: date('season_from'),
  seasonTo: date('season_to'),
});

export const rangeClosures = pgTable('range_closures', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  dateFrom: date('date_from').notNull(),
  dateTo: date('date_to').notNull(),
  reason: text('reason').notNull(),
  isRecurring: boolean('is_recurring').notNull().default(false),
});

export const rangeLines = pgTable('range_lines', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  distanceMeters: integer('distance_m').notNull(),
  isIndoor: boolean('is_indoor').notNull().default(false),
  capacity: integer('capacity').notNull().default(1),
  calibers: text('calibers').array().notNull().default([]),
  disciplines: discipline('disciplines').array().notNull().default([]),
});

export const rangePricing = pgTable('range_pricing', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  item: text('item').notNull(),
  priceCents: integer('price_cents').notNull(),
  unit: text('unit'),
  note: text('note'),
});

export const rangeServices = pgTable('range_services', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  service: text('service').notNull(),
  available: boolean('available').notNull().default(false),
  priceCents: integer('price_cents'),
});

export const rangeManagers = pgTable('range_managers', {
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  userId: uuid('user_id').notNull(),
  role: rangeManagerRole('role').notNull().default('staff'),
}, (table) => ({
  pk: uniqueIndex('idx_range_managers').on(table.rangeId, table.userId),
}));


