/**
 * Schemi del dominio Pass Pro — abbonamento premium del tiratore.
 * Piano_Sviluppo_App.md task 70 (T5), Business_Plan §4.2.
 */
import { z } from 'zod';
import { isoDateSchema, uuidSchema } from './common.js';

export const passProTierSchema = z.enum(['gratuito', 'pass_pro']);

export type PassProTier = z.infer<typeof passProTierSchema>;

export const premiumFeatureSchema = z.enum([
  'bersagli_illimitati',
  'statistiche_avanzate',
  'libretto_gpg_export',
  'storico_illimitato',
  'backup_cloud',
]);

export type PremiumFeature = z.infer<typeof premiumFeatureSchema>;

export const passProBillingPeriodSchema = z.enum(['mensile', 'annuale']);

export type PassProBillingPeriod = z.infer<typeof passProBillingPeriodSchema>;

// ---------------------------------------------------------------------------
// Abbonamento
// ---------------------------------------------------------------------------
export const userSubscriptionSchema = z.object({
  id: uuidSchema.optional(),
  userId: uuidSchema,
  tier: passProTierSchema,
  billingPeriod: passProBillingPeriodSchema.nullable().optional(),
  startedAt: isoDateSchema.optional(),
  renewsAt: isoDateSchema.nullable().optional(),
  cancelledAt: isoDateSchema.nullable().optional(),
  stripeSubscriptionId: z.string().nullable().optional(),
});

export type UserSubscription = z.infer<typeof userSubscriptionSchema>;

export const subscribeToPassProSchema = z.object({
  billingPeriod: passProBillingPeriodSchema,
});

export type SubscribeToPassPro = z.infer<typeof subscribeToPassProSchema>;

// ---------------------------------------------------------------------------
// Quote (risposta API)
// ---------------------------------------------------------------------------
export const quotaCheckSchema = z.object({
  allowed: z.boolean(),
  limit: z.number(),
  used: z.number(),
  remaining: z.number(),
});

export type QuotaCheck = z.infer<typeof quotaCheckSchema>;

export const passProStatusResponseSchema = z.object({
  tier: passProTierSchema,
  renewsAt: isoDateSchema.nullable(),
  firearmsQuota: quotaCheckSchema,
  targetsQuota: quotaCheckSchema,
  lockedFeatures: z.array(premiumFeatureSchema),
});

export type PassProStatusResponse = z.infer<typeof passProStatusResponseSchema>;
