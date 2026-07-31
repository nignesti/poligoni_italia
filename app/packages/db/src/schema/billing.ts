/**
 * SaaS Pro — piani, abbonamenti e fatturazione del gestore
 * (Piano_Sviluppo_App.md task 69, T5).
 *
 * Dominio distinto da `premium.ts` (Pass Pro, l'abbonamento del tiratore):
 * clienti diversi, cicli di fatturazione indipendenti.
 */
import {
  pgTable,
  uuid,
  text,
  pgEnum,
  integer,
  boolean,
  jsonb,
  date,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { ranges } from './ranges.js';
import { users } from './users.js';

/**
 * Allineato ai tre piani già pubblicati su /gestori (Base, Partner, Premium
 * nella copy pubblica — qui rinominati gratuito/partner/premium): un secondo
 * nome per lo stesso prodotto avrebbe disallineato marketing e fatturazione.
 */
export const subscriptionPlanType = pgEnum('subscription_plan_type', [
  'gratuito',
  'partner',
  'premium',
]);

export const subscriptionStatus = pgEnum('subscription_status', [
  'attivo',
  'sospeso',
  'annullato',
  'scaduto',
]);

export const invoiceStatus = pgEnum('invoice_status', [
  'bozza',
  'emessa',
  'pagata',
  'scaduta',
  'annullata',
]);

// ---------------------------------------------------------------------------
// Piani
// ---------------------------------------------------------------------------
export const subscriptionPlans = pgTable('subscription_plans', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  planType: subscriptionPlanType('plan_type').notNull(),
  priceCents: integer('price_cents').notNull(),
  billingPeriodDays: integer('billing_period_days').notNull().default(30),
  maxRanges: integer('max_ranges'),
  maxUsers: integer('max_users'),
  maxMonthlyBookings: integer('max_monthly_bookings'),
  features: text('features').array().notNull().default([]),
});

// ---------------------------------------------------------------------------
// Abbonamento del gestore
// ---------------------------------------------------------------------------
export const rangeSubscriptions = pgTable('range_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeId: uuid('range_id')
    .notNull()
    .references(() => ranges.id, { onDelete: 'cascade' }),
  planId: uuid('plan_id')
    .notNull()
    .references(() => subscriptionPlans.id, { onDelete: 'restrict' }),
  status: subscriptionStatus('status').notNull().default('attivo'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  renewsAt: timestamp('renews_at', { withTimezone: true }).notNull(),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  stripeSubscriptionId: text('stripe_subscription_id'),
  autoRenew: boolean('auto_renew').notNull().default(true),
});

// ---------------------------------------------------------------------------
// Fatture
// ---------------------------------------------------------------------------
export const invoices = pgTable('invoices', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeSubscriptionId: uuid('range_subscription_id')
    .notNull()
    .references(() => rangeSubscriptions.id, { onDelete: 'cascade' }),
  invoiceNumber: text('invoice_number').notNull().unique(),
  invoiceDate: date('invoice_date').notNull(),
  dueDate: date('due_date').notNull(),
  totalCents: integer('total_cents').notNull(),
  vatCents: integer('vat_cents').notNull().default(0),
  status: invoiceStatus('status').notNull().default('bozza'),
  /** Righe di dettaglio: { description, quantity, unitPriceCents, totalPriceCents }[]. */
  lineItems: jsonb('line_items').notNull().default([]),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Storico eventi (audit trail — un evento per ogni cambio di stato)
// ---------------------------------------------------------------------------
export const billingHistory = pgTable('billing_history', {
  id: uuid('id').primaryKey().defaultRandom(),
  rangeSubscriptionId: uuid('range_subscription_id')
    .notNull()
    .references(() => rangeSubscriptions.id, { onDelete: 'cascade' }),
  invoiceId: uuid('invoice_id').references(() => invoices.id, { onDelete: 'set null' }),
  eventType: text('event_type').notNull(),
  amountCents: integer('amount_cents'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

// ---------------------------------------------------------------------------
// Dati fiscali del gestore
// ---------------------------------------------------------------------------
export const managerBillingConfig = pgTable(
  'manager_billing_config',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    rangeId: uuid('range_id')
      .notNull()
      .references(() => ranges.id, { onDelete: 'cascade' }),
    companyName: text('company_name'),
    vatNumber: text('vat_number'),
    fiscalCode: text('fiscal_code'),
    address: text('address'),
    city: text('city'),
    province: text('province'),
    postalCode: text('postal_code'),
    invoiceEmail: text('invoice_email').notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    rangeUserIdx: uniqueIndex('idx_manager_billing_config').on(table.rangeId, table.userId),
  }),
);
