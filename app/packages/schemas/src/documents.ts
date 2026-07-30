/**
 * Schemi del dominio documenti utente (Piano_Sviluppo_App.md §4.2, §8.2).
 *
 * Nel caso base si conserva SOLO la data di scadenza (BP §14.2, Piano §8.2).
 * Il file cifrato è facoltativo.
 */
import { z } from 'zod';
import { dateOnlySchema, uuidSchema } from './common.js';

export const documentTypeSchema = z.enum([
  'porto_armi_tav',
  'porto_armi_caccia',
  'porto_armi_difesa',
  'porto_gpg',
  'certificato_medico',
  'tessera_federale',
]);

export type DocumentType = z.infer<typeof documentTypeSchema>;

export const documentAlertLevelSchema = z.enum([
  'ok',
  'in_scadenza',
  'urgente',
  'scaduto',
]);

export type DocumentAlertLevel = z.infer<typeof documentAlertLevelSchema>;

// ---------------------------------------------------------------------------
// Documento utente
// ---------------------------------------------------------------------------
export const userDocumentSchema = z.object({
  id: uuidSchema.optional(),
  type: documentTypeSchema,
  expiresOn: dateOnlySchema,
  /** Riferimento al file cifrato (solo se l'utente carica l'immagine). */
  storageRef: z.string().nullable().optional(),
  encrypted: z.boolean().default(false),
});

export type UserDocument = z.infer<typeof userDocumentSchema>;

export const createUserDocumentSchema = userDocumentSchema.omit({
  id: true,
  encrypted: true,
});

export type CreateUserDocument = z.infer<typeof createUserDocumentSchema>;

export const updateUserDocumentSchema = z.object({
  expiresOn: dateOnlySchema.optional(),
  storageRef: z.string().nullable().optional(),
});

export type UpdateUserDocument = z.infer<typeof updateUserDocumentSchema>;

// ---------------------------------------------------------------------------
// Alert (risposta API)
// ---------------------------------------------------------------------------
export const documentAlertSchema = z.object({
  type: documentTypeSchema,
  label: z.string(),
  expiresOn: dateOnlySchema,
  daysRemaining: z.number().int(),
  level: documentAlertLevelSchema,
  message: z.string(),
});

export type DocumentAlert = z.infer<typeof documentAlertSchema>;

export const documentAlertsResponseSchema = z.object({
  alerts: z.array(documentAlertSchema),
  pendingCount: z.number().int().nonnegative(),
});

export type DocumentAlertsResponse = z.infer<typeof documentAlertsResponseSchema>;
