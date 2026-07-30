/**
 * Schemi del dominio armi.
 *
 * ⚠️  NESSUN numero di matricola. NESSUN documento di detenzione.
 * (Business_Plan_Poligoni_Italia_v2.md §3.5.8, Piano_Sviluppo_App.md §8.1 regola 1)
 */
import { z } from 'zod';
import { uuidSchema } from './common.js';

export const firearmTypeSchema = z.enum([
  'pistola',
  'revolver',
  'carabina',
  'fucile',
  'avancarica',
]);

export type FirearmType = z.infer<typeof firearmTypeSchema>;

export const firearmSchema = z.object({
  id: uuidSchema.optional(),
  nickname: z.string().min(1).max(100),
  type: firearmTypeSchema,
  caliber: z.string().min(1).max(50),
  /** Anno di acquisto approssimativo (opzionale). */
  yearAcquired: z.number().int().min(1900).max(2100).optional(),
  /** Note libere dell'utente. */
  notes: z.string().max(1000).optional(),
});

export type Firearm = z.infer<typeof firearmSchema>;

export const createFirearmSchema = firearmSchema.omit({ id: true });

export type CreateFirearm = z.infer<typeof createFirearmSchema>;

export const updateFirearmSchema = createFirearmSchema.partial();

export type UpdateFirearm = z.infer<typeof updateFirearmSchema>;

export const firearmListResponseSchema = z.object({
  data: z.array(firearmSchema),
});

export type FirearmListResponse = z.infer<typeof firearmListResponseSchema>;
