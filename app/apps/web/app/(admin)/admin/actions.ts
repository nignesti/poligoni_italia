'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { slugify } from '@/lib/slugify';
import {
  insertRangeAdmin,
  updateRangeAdmin,
  isSlugTaken,
  replaceRangeHoursForAdmin,
  type AdminRangeInput,
} from '@poligoni/db/queries/admin-ranges';
import { addRangeManagerForAdmin, removeRangeManagerForAdmin } from '@poligoni/db/queries/admin-users';
import { requireAdminUser } from '@/lib/admin-auth';

// requireAdminUser() va chiamata a inizio di OGNI azione qui sotto, non solo
// nel layout: le server action sono endpoint invocabili direttamente, il
// controllo del layout non le copre (vedi nota in lib/admin-auth.ts).

const RangeFormSchema = z.object({
  name: z.string().trim().min(1, 'Il nome è obbligatorio.'),
  type: z.enum(['tsn', 'privato', 'tiro_a_volo', 'dinamico', 'long_range']),
  address: z.string().trim().optional(),
  comune: z.string().trim().min(1, 'Il comune è obbligatorio.'),
  provincia: z.string().trim().min(1, 'La provincia è obbligatoria.'),
  regione: z.string().trim().min(1, 'La regione è obbligatoria.'),
  cap: z.string().trim().optional(),
  lat: z.coerce.number().min(-90, 'Latitudine non valida.').max(90, 'Latitudine non valida.'),
  lng: z.coerce.number().min(-180, 'Longitudine non valida.').max(180, 'Longitudine non valida.'),
  phone: z.string().trim().optional(),
  email: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), 'Email non valida.'),
  website: z.string().trim().optional(),
  status: z.enum(['censito', 'rivendicato', 'partner', 'inattivo']),
  dataSource: z.string().trim().optional(),
  slug: z.string().trim().optional(),
});

export interface RangeFormState {
  error?: string | undefined;
}

function toInput(raw: z.infer<typeof RangeFormSchema>): AdminRangeInput {
  return {
    name: raw.name,
    type: raw.type,
    address: raw.address || null,
    comune: raw.comune,
    provincia: raw.provincia,
    regione: raw.regione,
    cap: raw.cap || null,
    lat: raw.lat,
    lng: raw.lng,
    phone: raw.phone || null,
    email: raw.email || null,
    website: raw.website || null,
    status: raw.status,
    dataSource: raw.dataSource || null,
  };
}

/** Aggiunge un suffisso numerico finché lo slug non è libero. */
async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = base;
  let i = 2;
  while (await isSlugTaken(slug, excludeId)) {
    slug = `${base}-${i}`;
    i += 1;
  }
  return slug;
}

export async function createRangeAction(
  _prev: RangeFormState,
  formData: FormData,
): Promise<RangeFormState> {
  await requireAdminUser();

  const parsed = RangeFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dati non validi.' };
  }

  const input = toInput(parsed.data);
  const base = slugify((parsed.data.slug || parsed.data.name).trim());
  const slug = await uniqueSlug(base);

  const { id } = await insertRangeAdmin({ ...input, slug });
  revalidatePath('/admin');
  // Stesso motivo di updateRangeAction: pagine pubbliche statiche, nessun
  // revalidate a tempo. Un poligono nuovo cambia anche i conteggi in / e
  // /poligoni (assenti da updateRangeAction perché una modifica non cambia
  // il numero di strutture, solo una creazione lo fa).
  revalidatePath('/');
  revalidatePath('/poligoni');
  revalidatePath('/poligoni/[regione]', 'page');
  revalidatePath('/poligoni/[regione]/[provincia]', 'page');
  revalidatePath('/poligoni/[regione]/[provincia]/[slug]', 'page');
  redirect(`/admin/${id}`);
}

const HourSlotSchema = z.object({
  weekday: z.number().int().min(0).max(6),
  opensAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Orario non valido.'),
  closesAt: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Orario non valido.'),
});
const HoursFormSchema = z.array(HourSlotSchema);

/**
 * Un unico salvataggio per anagrafica + orari, invece di due bottoni
 * separati — l'admin li vede come un solo form, li salva come tale.
 * Le due scritture restano due query distinte (updateRangeAdmin +
 * replaceRangeHoursForAdmin, quest'ultima già nella sua transazione), non
 * un'unica transazione DB: non è un'operazione finanziaria, il rischio di
 * un disallineamento a metà è accettabile per questo caso d'uso.
 *
 * Revalida anche le pagine pubbliche della struttura, non solo /admin:
 * quelle sono statiche (generateStaticParams, nessun revalidate a tempo),
 * senza questa chiamata un salvataggio da admin non si vedrebbe online
 * fino al prossimo deploy.
 */
export async function updateRangeAction(
  id: string,
  _prev: RangeFormState,
  formData: FormData,
): Promise<RangeFormState> {
  await requireAdminUser();

  const parsed = RangeFormSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dati non validi.' };
  }

  let rawHours: unknown;
  try {
    rawHours = JSON.parse(String(formData.get('hoursJson') ?? '[]'));
  } catch {
    return { error: 'Dati orari non validi.' };
  }
  const parsedHours = HoursFormSchema.safeParse(rawHours);
  if (!parsedHours.success) {
    return { error: parsedHours.error.issues[0]?.message ?? 'Dati orari non validi.' };
  }

  await updateRangeAdmin(id, toInput(parsed.data));
  await replaceRangeHoursForAdmin(id, parsedHours.data);

  revalidatePath('/admin');
  revalidatePath(`/admin/${id}`);
  revalidatePath('/poligoni/[regione]/[provincia]/[slug]', 'page');
  revalidatePath('/poligoni/[regione]/[provincia]', 'page');
  revalidatePath('/poligoni/[regione]', 'page');
  return { error: undefined };
}

export interface ManagerFormState {
  error?: string | undefined;
}

const AddManagerSchema = z.object({
  rangeId: z.string().uuid('Struttura non valida.'),
  userId: z.string().uuid('Utente non valido.'),
  role: z.enum(['proprietario', 'staff']),
});

export async function addRangeManagerAction(
  _prev: ManagerFormState,
  formData: FormData,
): Promise<ManagerFormState> {
  await requireAdminUser();

  const parsed = AddManagerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? 'Dati non validi.' };
  }

  await addRangeManagerForAdmin(parsed.data.rangeId, parsed.data.userId, parsed.data.role);
  revalidatePath('/admin/utenti');
  return { error: undefined };
}

const RemoveManagerSchema = z.object({
  rangeId: z.string().uuid(),
  userId: z.string().uuid(),
});

export async function removeRangeManagerAction(formData: FormData): Promise<void> {
  await requireAdminUser();

  const parsed = RemoveManagerSchema.safeParse(Object.fromEntries(formData));
  if (!parsed.success) return;

  await removeRangeManagerForAdmin(parsed.data.rangeId, parsed.data.userId);
  revalidatePath('/admin/utenti');
}
