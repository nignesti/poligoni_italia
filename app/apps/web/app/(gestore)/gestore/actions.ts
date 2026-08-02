'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import {
  updateRangeForGestore,
  replaceClosuresForGestore,
  replacePricingForGestore,
  replaceServicesForGestore,
  markBookingRequestForwardedForGestore,
} from '@poligoni/db/queries/gestore';
import { replaceRangeHoursForAdmin } from '@poligoni/db/queries/admin-ranges';
import { requireManagedRange } from '@/lib/gestore-auth';

// requireManagedRange() risolve la struttura dal lato server a ogni azione,
// non fidandosi mai di un rangeId passato dal client — stesso principio di
// requireAdminUser() in app/(admin)/admin/actions.ts.

export interface GestoreFormState {
  error?: string | undefined;
}

const RangeFormSchema = z.object({
  name: z.string().trim().min(1, 'Il nome è obbligatorio.'),
  type: z.enum(['tsn', 'privato', 'tiro_a_volo', 'dinamico', 'long_range']),
  address: z.string().trim().optional(),
  comune: z.string().trim().min(1, 'Il comune è obbligatorio.'),
  provincia: z.string().trim().min(1, 'La provincia è obbligatoria.'),
  regione: z.string().trim().min(1, 'La regione è obbligatoria.'),
  cap: z.string().trim().optional(),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email non valida.'),
  website: z.string().trim().optional(),
});

export async function updateGestoreRangeAction(
  _prev: GestoreFormState,
  formData: FormData,
): Promise<GestoreFormState> {
  const range = await requireManagedRange();

  const parsed = RangeFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dati non validi.' };
  }

  await updateRangeForGestore(range.id, {
    name: parsed.data.name,
    type: parsed.data.type,
    address: parsed.data.address || null,
    comune: parsed.data.comune,
    provincia: parsed.data.provincia,
    regione: parsed.data.regione,
    cap: parsed.data.cap || null,
    phone: parsed.data.phone || null,
    email: parsed.data.email || null,
    website: parsed.data.website || null,
  });

  revalidatePath('/gestore/struttura');
  revalidatePath('/gestore');
  return { error: undefined };
}

const HourSlotSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  opensAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Orario non valido.'),
  closesAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Orario non valido.'),
});

export async function updateGestoreHoursAction(
  _prev: GestoreFormState,
  formData: FormData,
): Promise<GestoreFormState> {
  const range = await requireManagedRange();

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get('hoursJson') ?? '[]'));
  } catch {
    return { error: 'Dati orari non validi.' };
  }
  const parsed = z.array(HourSlotSchema).safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dati orari non validi.' };
  }

  await replaceRangeHoursForAdmin(range.id, parsed.data);
  revalidatePath('/gestore/orari');
  return { error: undefined };
}

const ClosureSchema = z.object({
  dateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida.'),
  dateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Data non valida.'),
  reason: z.string().trim().min(1, 'Il motivo è obbligatorio.'),
  isRecurring: z.boolean(),
});

export async function updateGestoreClosuresAction(
  _prev: GestoreFormState,
  formData: FormData,
): Promise<GestoreFormState> {
  const range = await requireManagedRange();

  let raw: unknown;
  try {
    raw = JSON.parse(String(formData.get('closuresJson') ?? '[]'));
  } catch {
    return { error: 'Dati non validi.' };
  }
  const parsed = z.array(ClosureSchema).safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dati non validi.' };
  }

  await replaceClosuresForGestore(range.id, parsed.data);
  revalidatePath('/gestore/chiusure');
  return { error: undefined };
}

const PricingItemSchema = z.object({
  item: z.string().trim().min(1, 'Voce obbligatoria.'),
  priceCents: z.number().int().min(0, 'Prezzo non valido.'),
  unit: z.string().trim().nullable(),
  note: z.string().trim().nullable(),
});

const ServiceItemSchema = z.object({
  service: z.string().trim().min(1, 'Servizio obbligatorio.'),
  available: z.boolean(),
  priceCents: z.number().int().min(0, 'Prezzo non valido.').nullable(),
});

export async function updateGestoreListinoAction(
  _prev: GestoreFormState,
  formData: FormData,
): Promise<GestoreFormState> {
  const range = await requireManagedRange();

  let rawPricing: unknown;
  let rawServices: unknown;
  try {
    rawPricing = JSON.parse(String(formData.get('pricingJson') ?? '[]'));
    rawServices = JSON.parse(String(formData.get('servicesJson') ?? '[]'));
  } catch {
    return { error: 'Dati non validi.' };
  }

  const parsedPricing = z.array(PricingItemSchema).safeParse(rawPricing);
  if (!parsedPricing.success) {
    return { error: parsedPricing.error.issues[0]?.message ?? 'Listino non valido.' };
  }
  const parsedServices = z.array(ServiceItemSchema).safeParse(rawServices);
  if (!parsedServices.success) {
    return { error: parsedServices.error.issues[0]?.message ?? 'Servizi non validi.' };
  }

  await Promise.all([
    replacePricingForGestore(range.id, parsedPricing.data),
    replaceServicesForGestore(range.id, parsedServices.data),
  ]);
  revalidatePath('/gestore/listino');
  return { error: undefined };
}

const MarkRequestSchema = z.object({
  requestId: z.string().uuid(),
  outcome: z.enum(['confermata', 'rifiutata', 'nessuna_risposta']),
});

export async function markGestoreRequestAction(formData: FormData): Promise<void> {
  const range = await requireManagedRange();

  const parsed = MarkRequestSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await markBookingRequestForwardedForGestore(range.id, parsed.data.requestId, parsed.data.outcome);
  revalidatePath('/gestore/richieste');
}
