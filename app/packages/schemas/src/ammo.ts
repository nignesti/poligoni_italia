/**
 * Schemi del dominio munizioni (Piano_Sviluppo_App.md §4.4, §4.5, §6.1).
 *
 * I limiti di legge risiedono nella tabella `legal_ammo_limits` (Piano §4.5),
 * non nel codice. I tipi qui sono quelli di scambio API.
 */
import { z } from 'zod';
import { isoDateSchema, uuidSchema } from './common.js';

// ---------------------------------------------------------------------------
// Enums (allineati a @poligoni/core/ammo)
// ---------------------------------------------------------------------------
export const ammoCategorySchema = z.enum([
  'arma_corta',
  'arma_lunga_caccia',
  'spezzone',
  'polvere',
]);

export type AmmoCategory = z.infer<typeof ammoCategorySchema>;

export const ammoUnitSchema = z.enum(['pezzi', 'grammi']);

export type AmmoUnit = z.infer<typeof ammoUnitSchema>;

export const ammoLevelSchema = z.enum([
  'ok',
  'attenzione',
  'limite',
  'oltre',
]);

export type AmmoLevel = z.infer<typeof ammoLevelSchema>;

export const ammoMovementReasonSchema = z.enum([
  'acquisto',
  'consumo_sessione',
  'ricarica',
  'correzione',
  'cessione',
]);

export type AmmoMovementReason = z.infer<typeof ammoMovementReasonSchema>;

// ---------------------------------------------------------------------------
// Movimenti (l'inventario è la somma dei movimenti — Piano §4.4)
// ---------------------------------------------------------------------------
export const ammoMovementSchema = z.object({
  caliber: z.string().min(1).max(50),
  category: ammoCategorySchema,
  /** Positivo = carico, negativo = consumo. */
  delta: z.number().int(),
  reason: ammoMovementReasonSchema,
  occurredAt: isoDateSchema,
  sessionId: uuidSchema.nullable().optional(),
});

export type AmmoMovement = z.infer<typeof ammoMovementSchema>;

export const createAmmoMovementSchema = ammoMovementSchema;

export type CreateAmmoMovement = z.infer<typeof createAmmoMovementSchema>;

// ---------------------------------------------------------------------------
// Status (risposta API — valutazione limiti)
// ---------------------------------------------------------------------------
export const ammoStatusSchema = z.object({
  category: ammoCategorySchema,
  label: z.string(),
  quantity: z.number().int().nonnegative(),
  limit: z.number().int().nonnegative(),
  unit: ammoUnitSchema,
  percentUsed: z.number().nonnegative(),
  remaining: z.number().int().nonnegative(),
  level: ammoLevelSchema,
  declarationRequired: z.boolean(),
  legalReference: z.string(),
  calibers: z.array(z.string()),
  message: z.string(),
});

export type AmmoStatus = z.infer<typeof ammoStatusSchema>;

export const ammoStatusResponseSchema = z.object({
  statuses: z.array(ammoStatusSchema),
  hasWarnings: z.boolean(),
  /** L'avvertenza obbligatoria di BP §3.5.4. */
  disclaimer: z.string(),
});

export type AmmoStatusResponse = z.infer<typeof ammoStatusResponseSchema>;

// ---------------------------------------------------------------------------
// Limiti legali (dati di riferimento dalla tabella `legal_ammo_limits`)
// ---------------------------------------------------------------------------
export const legalAmmoLimitSchema = z.object({
  category: ammoCategorySchema,
  maxQuantity: z.number().int().nonnegative(),
  declarationFrom: z.number().int().nonnegative().nullable(),
  unit: ammoUnitSchema,
  legalReference: z.string(),
  label: z.string(),
});

export type LegalAmmoLimit = z.infer<typeof legalAmmoLimitSchema>;
