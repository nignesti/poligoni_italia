/**
 * Dominio munizioni (Piano_Sviluppo_App.md §4.4, §4.5).
 *
 * L'inventario (`ammo_inventory`) è una VISTA MATERIALIZZATA dei movimenti,
 * non una tabella scritta direttamente. Ogni variazione deve essere
 * ricostruibile (Piano §4.4 — motivazione).
 *
 * I limiti di legge stanno in tabella (`legal_ammo_limits`), non nel codice:
 * una modifica normativa deve essere una riga di dati, non un rilascio
 * dell'app (Piano §4.5).
 */
import {
  pgTable,
  uuid,
  text,
  pgEnum,
  integer,
  timestamp,
  uniqueIndex,
  boolean,
} from 'drizzle-orm/pg-core';
import { sessions } from './sessions.js';

export const ammoCategory = pgEnum('ammo_category', [
  'arma_corta',
  'arma_lunga_caccia',
  'spezzone',
  'polvere',
]);

export const ammoMovementReason = pgEnum('ammo_movement_reason', [
  'acquisto',
  'consumo_sessione',
  'ricarica',
  'correzione',
  'cessione',
]);

/**
 * Storico dei movimenti — l'inventario è la somma dei movimenti.
 * Colonna `delta`: positivo = carico, negativo = consumo.
 */
export const ammoMovements = pgTable('ammo_movements', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull(),
  caliber: text('caliber').notNull(),
  category: ammoCategory('category').notNull(),
  delta: integer('delta').notNull(),
  reason: ammoMovementReason('reason').notNull(),
  sessionId: uuid('session_id').references(() => sessions.id),
  occurredAt: timestamp('occurred_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

/**
 * Vista materializzata dell'inventario (da creare con migrazione SQL).
 *
 * CREATE MATERIALIZED VIEW ammo_inventory AS
 * SELECT
 *   user_id,
 *   caliber,
 *   category,
 *   SUM(delta) AS quantity
 * FROM ammo_movements
 * GROUP BY user_id, caliber, category;
 *
 * CREATE UNIQUE INDEX ON ammo_inventory (user_id, caliber, category);
 */

// ---------------------------------------------------------------------------
// Limiti legali (dati di riferimento seed — Piano §4.5)
// ---------------------------------------------------------------------------
export const ammoCategoryEnum = ammoCategory; // alias per comodità

export const legalAmmoLimits = pgTable('legal_ammo_limits', {
  category: ammoCategory('category').primaryKey(),
  maxQuantity: integer('max_quantity').notNull(),
  declarationFrom: integer('declaration_from'),
  legalReference: text('legal_reference').notNull(),
  note: text('note'),
});

// ---------------------------------------------------------------------------
// Tabella audit_log (Piano §8.4 — registro violazioni)
// ---------------------------------------------------------------------------
export const auditLog = pgTable('audit_log', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id'),
  action: text('action').notNull(),
  tableName: text('table_name').notNull(),
  recordId: uuid('record_id'),
  details: text('details'),
  ipAddress: text('ip_address'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// GPG — Libretto e esercitazioni (Piano §4.4)
// ---------------------------------------------------------------------------
export const gpgLogbook = pgTable('gpg_logbook', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().unique(),
  portoArmiExpiresOn: timestamp('porto_armi_expires_on', { withTimezone: true }).notNull(),
  instituteName: text('institute_name'),
});

export const gpgExercises = pgTable('gpg_exercises', {
  id: uuid('id').primaryKey().defaultRandom(),
  logbookId: uuid('logbook_id')
    .notNull()
    .references(() => gpgLogbook.id, { onDelete: 'cascade' }),
  sequence: integer('sequence').notNull(), // 1 | 2 | 3
  dueBy: timestamp('due_by', { withTimezone: true }).notNull(),
  performedAt: timestamp('performed_at', { withTimezone: true }),
  rangeId: uuid('range_id'),
  roundsFired: integer('rounds_fired').notNull().default(50),
  score: integer('score'),
  certified: boolean('certified').notNull().default(false),
}, (table) => ({
  logbookSeqIdx: uniqueIndex('idx_gpg_exercises').on(table.logbookId, table.sequence),
}));
