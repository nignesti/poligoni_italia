/**
 * Schemi del dominio SaaS Pro — piani e fatturazione del gestore.
 * Piano_Sviluppo_App.md task 69 (T5), §6.1 (endpoint `/manage`).
 */
import { z } from 'zod';
import { dateOnlySchema, isoDateSchema, uuidSchema } from './common.js';

export const subscriptionPlanTypeSchema = z.enum(['gratuito', 'partner', 'premium']);

export type SubscriptionPlanType = z.infer<typeof subscriptionPlanTypeSchema>;

export const subscriptionStatusSchema = z.enum(['attivo', 'sospeso', 'annullato', 'scaduto']);

export type SubscriptionStatus = z.infer<typeof subscriptionStatusSchema>;

export const invoiceStatusSchema = z.enum(['bozza', 'emessa', 'pagata', 'scaduta', 'annullata']);

export type InvoiceStatus = z.infer<typeof invoiceStatusSchema>;

// ---------------------------------------------------------------------------
// Piani
// ---------------------------------------------------------------------------
export const subscriptionPlanSchema = z.object({
  id: uuidSchema,
  name: z.string().min(1),
  planType: subscriptionPlanTypeSchema,
  priceCents: z.number().int().nonnegative(),
  billingPeriodDays: z.number().int().positive(),
  maxRanges: z.number().int().positive().nullable(),
  maxUsers: z.number().int().positive().nullable(),
  maxMonthlyBookings: z.number().int().positive().nullable(),
  features: z.array(z.string()),
});

export type SubscriptionPlan = z.infer<typeof subscriptionPlanSchema>;

// ---------------------------------------------------------------------------
// Abbonamento del gestore
// ---------------------------------------------------------------------------
export const rangeSubscriptionSchema = z.object({
  id: uuidSchema,
  rangeId: uuidSchema,
  planId: uuidSchema,
  status: subscriptionStatusSchema,
  startedAt: isoDateSchema,
  renewsAt: isoDateSchema,
  cancelledAt: isoDateSchema.nullable(),
  stripeSubscriptionId: z.string().nullable(),
  autoRenew: z.boolean(),
});

export type RangeSubscription = z.infer<typeof rangeSubscriptionSchema>;

export const subscribeToPlanSchema = z.object({
  rangeId: uuidSchema,
  planId: uuidSchema,
  autoRenew: z.boolean().default(true),
});

export type SubscribeToPlan = z.infer<typeof subscribeToPlanSchema>;

export const cancelSubscriptionSchema = z.object({
  rangeSubscriptionId: uuidSchema,
  reason: z.string().max(500).optional(),
});

export type CancelSubscription = z.infer<typeof cancelSubscriptionSchema>;

// ---------------------------------------------------------------------------
// Fatture
// ---------------------------------------------------------------------------
export const invoiceLineSchema = z.object({
  description: z.string().min(1),
  quantity: z.number().int().positive(),
  unitPriceCents: z.number().int().nonnegative(),
  totalPriceCents: z.number().int().nonnegative(),
});

export type InvoiceLine = z.infer<typeof invoiceLineSchema>;

export const invoiceSchema = z.object({
  id: uuidSchema,
  rangeSubscriptionId: uuidSchema,
  invoiceNumber: z.string().min(1),
  invoiceDate: dateOnlySchema,
  dueDate: dateOnlySchema,
  totalCents: z.number().int().nonnegative(),
  vatCents: z.number().int().nonnegative(),
  status: invoiceStatusSchema,
  lineItems: z.array(invoiceLineSchema),
  paidAt: isoDateSchema.nullable(),
});

export type Invoice = z.infer<typeof invoiceSchema>;

export const createInvoiceSchema = z.object({
  rangeSubscriptionId: uuidSchema,
  lineItems: z.array(invoiceLineSchema).min(1),
});

export type CreateInvoice = z.infer<typeof createInvoiceSchema>;

// ---------------------------------------------------------------------------
// Storico eventi (audit trail)
// ---------------------------------------------------------------------------
export const billingHistorySchema = z.object({
  id: uuidSchema,
  rangeSubscriptionId: uuidSchema,
  invoiceId: uuidSchema.nullable(),
  eventType: z.string().min(1),
  amountCents: z.number().int().nonnegative().nullable(),
  createdAt: isoDateSchema,
});

export type BillingHistory = z.infer<typeof billingHistorySchema>;

// ---------------------------------------------------------------------------
// Dati fiscali del gestore
// ---------------------------------------------------------------------------
export const managerBillingConfigSchema = z.object({
  id: uuidSchema,
  userId: uuidSchema,
  rangeId: uuidSchema,
  companyName: z.string().min(1).nullable(),
  vatNumber: z.string().length(13).nullable(),
  fiscalCode: z.string().min(11).max(16).nullable(),
  address: z.string().min(1).nullable(),
  city: z.string().min(1).nullable(),
  province: z.string().length(2).nullable(),
  postalCode: z.string().length(5).nullable(),
  invoiceEmail: z.string().email(),
});

export type ManagerBillingConfig = z.infer<typeof managerBillingConfigSchema>;

export const upsertManagerBillingConfigSchema = managerBillingConfigSchema.omit({
  id: true,
  userId: true,
});

export type UpsertManagerBillingConfig = z.infer<typeof upsertManagerBillingConfigSchema>;

/**
 * `userId` è nel corpo della richiesta, non ricavato da una sessione:
 * l'autenticazione Supabase (Piano §7.3 task 13) non è ancora integrata
 * in nessuna rotta del sito. Da rivedere quando lo sarà.
 */
export const manageBillingConfigRequestSchema = upsertManagerBillingConfigSchema.extend({
  userId: uuidSchema,
});

export type ManageBillingConfigRequest = z.infer<typeof manageBillingConfigRequestSchema>;

export const subscriptionQuerySchema = z.object({
  rangeId: uuidSchema,
});

export type SubscriptionQuery = z.infer<typeof subscriptionQuerySchema>;

export const billingConfigQuerySchema = z.object({
  rangeId: uuidSchema,
  userId: uuidSchema,
});

export type BillingConfigQuery = z.infer<typeof billingConfigQuerySchema>;

// ---------------------------------------------------------------------------
// Report di fatturazione (risposta API — Piano §6.1 `/manage/export`)
// ---------------------------------------------------------------------------
export const billingReportQuerySchema = z.object({
  rangeId: uuidSchema,
  from: dateOnlySchema,
  to: dateOnlySchema,
});

export type BillingReportQuery = z.infer<typeof billingReportQuerySchema>;

export const billingReportSchema = z.object({
  totalRevenueCents: z.number().int().nonnegative(),
  totalVatCents: z.number().int().nonnegative(),
  invoiceCount: z.number().int().nonnegative(),
  paidInvoices: z.number().int().nonnegative(),
  pendingInvoices: z.number().int().nonnegative(),
  overdueInvoices: z.number().int().nonnegative(),
});

export type BillingReport = z.infer<typeof billingReportSchema>;
