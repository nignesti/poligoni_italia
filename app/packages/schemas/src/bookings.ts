/**
 * Schemi del dominio prenotazioni (Piano_Sviluppo_App.md §4.3, §6.1).
 */
import { z } from 'zod';
import { isoDateSchema, uuidSchema, idempotencyKeySchema } from './common.js';
import { slugSchema } from './common.js';

// ---------------------------------------------------------------------------
// Enums
// ---------------------------------------------------------------------------
export const bookingStatusSchema = z.enum([
  'richiesta',
  'confermata',
  'annullata',
  'completata',
  'no_show',
]);

export type BookingStatus = z.infer<typeof bookingStatusSchema>;

export const bookingSourceSchema = z.enum([
  'app',
  'web',
  'manuale_gestore',
  'telefono',
]);

export type BookingSource = z.infer<typeof bookingSourceSchema>;

// ---------------------------------------------------------------------------
// Richiesta disponibilità
// ---------------------------------------------------------------------------
export const availabilityQuerySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lineId: uuidSchema.optional(),
  /** Durata slot in minuti. Default 60. */
  slotMinutes: z.coerce.number().int().positive().default(60),
});

export type AvailabilityQuery = z.infer<typeof availabilityQuerySchema>;

export const availabilitySlotSchema = z.object({
  start: isoDateSchema,
  end: isoDateSchema,
  available: z.boolean(),
});

export type AvailabilitySlot = z.infer<typeof availabilitySlotSchema>;

export const availabilityResponseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lineId: uuidSchema,
  lineName: z.string(),
  slots: z.array(availabilitySlotSchema),
});

export type AvailabilityResponse = z.infer<typeof availabilityResponseSchema>;

// ---------------------------------------------------------------------------
// Creazione prenotazione
// ---------------------------------------------------------------------------
export const createBookingSchema = z.object({
  rangeId: uuidSchema,
  lineId: uuidSchema,
  slotStart: isoDateSchema,
  slotEnd: isoDateSchema,
  /** Opzionale: note per il gestore. */
  notes: z.string().max(1000).optional(),
});

export type CreateBooking = z.infer<typeof createBookingSchema>;

export const createBookingRequestSchema = createBookingSchema.extend({
  /** Idempotenza: stesso key = stessa prenotazione (Piano §6.2). */
  idempotencyKey: idempotencyKeySchema,
});

export type CreateBookingRequest = z.infer<typeof createBookingRequestSchema>;

// ---------------------------------------------------------------------------
// Risposta prenotazione
// ---------------------------------------------------------------------------
export const bookingSchema = z.object({
  id: uuidSchema,
  rangeId: uuidSchema,
  rangeName: z.string(),
  lineId: uuidSchema,
  lineName: z.string(),
  slotStart: isoDateSchema,
  slotEnd: isoDateSchema,
  status: bookingStatusSchema,
  source: bookingSourceSchema,
  priceCents: z.number().int().nonnegative(),
  feeCents: z.number().int().nonnegative().default(0),
  qrToken: z.string().nullable().optional(),
  checkedInAt: isoDateSchema.nullable().optional(),
  createdAt: isoDateSchema,
});

export type Booking = z.infer<typeof bookingSchema>;

export const bookingListResponseSchema = z.object({
  data: z.array(bookingSchema),
  nextCursor: z.string().nullable(),
});

export type BookingListResponse = z.infer<typeof bookingListResponseSchema>;

// ---------------------------------------------------------------------------
// Disponibilità — richiesta gestore (vista settimanale)
// ---------------------------------------------------------------------------
export const managerAvailabilityQuerySchema = z.object({
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  lineId: uuidSchema.optional(),
});

export type ManagerAvailabilityQuery = z.infer<typeof managerAvailabilityQuerySchema>;

// ---------------------------------------------------------------------------
// Richiesta di disponibilità (T2 — senza prenotazione reale)
// ---------------------------------------------------------------------------
export const bookingRequestSchema = z.object({
  rangeSlug: slugSchema,
  requestedFor: isoDateSchema,
  message: z.string().max(2000).optional(),
  name: z.string().min(1).max(200),
  email: z.string().email(),
  phone: z.string().max(30).optional(),
});

export type BookingRequest = z.infer<typeof bookingRequestSchema>;

// ---------------------------------------------------------------------------
// Annulla prenotazione
// ---------------------------------------------------------------------------
export const cancelBookingSchema = z.object({
  reason: z.string().max(500).optional(),
});

export type CancelBooking = z.infer<typeof cancelBookingSchema>;

// ---------------------------------------------------------------------------
// Check-in (gestore)
// ---------------------------------------------------------------------------
export const checkInSchema = z.object({
  qrToken: z.string().min(1),
});

export type CheckIn = z.infer<typeof checkInSchema>;
