/**
 * Pass Pro — abbonamento premium del tiratore (Piano_Sviluppo_App.md task 70).
 *
 * Tabella separata da `range_subscriptions` (SaaS Pro dei gestori, task 69):
 * sono due prodotti diversi, con clienti diversi (tiratore vs gestore) e cicli
 * di fatturazione indipendenti.
 *
 * La Business Plan (§4.2) attiva Pass Pro solo a 10.000 utenti registrati
 * (vedi `@poligoni/core/premium` — `isPassProLaunchReady`): la tabella esiste
 * comunque da ora, come già fatto per `gpg_logbook` prima della relativa UI.
 */
import { pgTable, uuid, text, pgEnum, timestamp } from 'drizzle-orm/pg-core';
import { users } from './users.js';

export const passProTier = pgEnum('pass_pro_tier', ['gratuito', 'pass_pro']);

export const passProBillingPeriod = pgEnum('pass_pro_billing_period', ['mensile', 'annuale']);

export const userSubscriptions = pgTable('user_subscriptions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id')
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: 'cascade' }),
  tier: passProTier('tier').notNull().default('gratuito'),
  billingPeriod: passProBillingPeriod('billing_period'),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  renewsAt: timestamp('renews_at', { withTimezone: true }),
  cancelledAt: timestamp('cancelled_at', { withTimezone: true }),
  stripeSubscriptionId: text('stripe_subscription_id'),
});
