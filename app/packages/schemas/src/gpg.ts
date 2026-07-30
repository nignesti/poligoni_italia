/**
 * Schemi del dominio GPG (Guardie Particolari Giurate).
 * Piano_Sviluppo_App.md §4.4, §5.3, §6.1.
 */
import { z } from 'zod';
import { dateOnlySchema, uuidSchema } from './common.js';

export const exerciseSequenceSchema = z.union([z.literal(1), z.literal(2), z.literal(3)]);

export type ExerciseSequence = z.infer<typeof exerciseSequenceSchema>;

export const gpgAlertLevelSchema = z.enum([
  'ok',
  'in_scadenza',
  'urgente',
  'scaduta',
]);

export type GpgAlertLevel = z.infer<typeof gpgAlertLevelSchema>;

// ---------------------------------------------------------------------------
// Libretto GPG
// ---------------------------------------------------------------------------
export const gpgLogbookSchema = z.object({
  id: uuidSchema.optional(),
  portoArmiExpiresOn: dateOnlySchema,
  instituteName: z.string().max(200).nullable().optional(),
});

export type GpgLogbook = z.infer<typeof gpgLogbookSchema>;

export const createGpgLogbookSchema = gpgLogbookSchema.omit({ id: true });

export type CreateGpgLogbook = z.infer<typeof createGpgLogbookSchema>;

// ---------------------------------------------------------------------------
// Esercitazione
// ---------------------------------------------------------------------------
export const gpgExerciseSchema = z.object({
  id: uuidSchema.optional(),
  logbookId: uuidSchema,
  sequence: exerciseSequenceSchema,
  dueBy: dateOnlySchema,
  performedAt: dateOnlySchema.nullable().optional(),
  rangeId: uuidSchema.nullable().optional(),
  roundsFired: z.number().int().positive().default(50),
  score: z.number().int().nonnegative().nullable().optional(),
  certified: z.boolean().default(false),
});

export type GpgExercise = z.infer<typeof gpgExerciseSchema>;

export const createGpgExerciseSchema = gpgExerciseSchema.omit({
  id: true,
  certified: true,
});

export type CreateGpgExercise = z.infer<typeof createGpgExerciseSchema>;

export const updateGpgExerciseSchema = z.object({
  performedAt: dateOnlySchema,
  rangeId: uuidSchema.optional(),
  roundsFired: z.number().int().positive().default(50),
  score: z.number().int().nonnegative().optional(),
});

export type UpdateGpgExercise = z.infer<typeof updateGpgExerciseSchema>;

// ---------------------------------------------------------------------------
// Status (risposta API)
// ---------------------------------------------------------------------------
export const gpgExerciseStatusSchema = z.object({
  sequence: exerciseSequenceSchema,
  windowFrom: dateOnlySchema,
  dueBy: dateOnlySchema,
  certifying: z.boolean(),
  performed: z.boolean(),
  performedAt: dateOnlySchema.nullable(),
  daysRemaining: z.number().int(),
  level: gpgAlertLevelSchema,
  message: z.string(),
});

export type GpgExerciseStatus = z.infer<typeof gpgExerciseStatusSchema>;

export const gpgStatusResponseSchema = z.object({
  portoArmiExpiresOn: dateOnlySchema,
  exercises: z.array(gpgExerciseStatusSchema),
  nextExercise: gpgExerciseStatusSchema.nullable(),
});

export type GpgStatusResponse = z.infer<typeof gpgStatusResponseSchema>;
