/**
 * Dominio prenotazioni (Piano_Sviluppo_App.md §4.3, §6.1).
 *
 * ⚠️  Il vincolo più importante dell'intero schema:
 *   ALTER TABLE bookings ADD CONSTRAINT no_overlap
 *     EXCLUDE USING GIST (
 *       line_id WITH =,
 *       tstzrange(slot_start, slot_end) WITH &&
 *     ) WHERE (status IN ('richiesta','confermata'));
 *
 * Rischio 6 del business plan (doppio binario online/telefono): le prenotazioni
 * inserite a mano dal gestore passano dallo stesso vincolo.
 *
 * NOTA: il vincolo EXCLUDE con GIST richiede l'estensione btree_gist.
 */
import { pgTable, uuid, text, pgEnum, integer, timestamp, uniqueIndex } from 'drizzle-orm/pg-core';
import { ranges, rangeLines } from './ranges.js';

export const bookingStatus = pgEnum('booking_status', [
  'richiesta',
  'confermata',
  'annullata',
  'completata',
  'no_show',
]);

export const bookingSource = pgEnum('booking_source', [
  'app',
  'web',
  'manuale_gestore',
  'telefono',
]);

/**
 * Prenotazioni.
 *
 * Il vincolo di esclusione (no_overlap) va applicato con una migrazione SQL
 * manuale dopo la creazione della tabella, perché Drizzle non supporta
 * EXCLUDE USING GIST nativamente.
 */
export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id),
  lineId: uuid('line_id')
    .notNull()
    .references(() => rangeLines.id),
  userId: uuid('user_id').notNull(),
  slotStart: timestamp('slot_start', { withTimezone: true }).notNull(),
  slotEnd: timestamp('slot_end', { withTimezone: true }).notNull(),
  status: bookingStatus('status').notNull().default('richiesta'),
  source: bookingSource('source').notNull().default('web'),
  priceCents: integer('price_cents').notNull().default(0),
  feeCents: integer('fee_cents').notNull().default(0),
  stripePaymentIntentId: text('stripe_payment_intent_id'),
  qrToken: text('qr_token').unique(),
  checkedInAt: timestamp('checked_in_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Richieste di disponibilità (fase T2 — senza prenotazione reale).
 */
export const bookingRequests = pgTable('booking_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  requestedFor: timestamp('requested_for', { withTimezone: true }).notNull(),
  message: text('message'),
  forwardedAt: timestamp('forwarded_at', { withTimezone: true }),
  outcome: text('outcome'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
