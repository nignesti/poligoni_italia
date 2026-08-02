'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { slugify } from '@/lib/slugify';
import {
  insertRangeAdmin,
  updateRangeAdmin,
  isSlugTaken,
  type AdminRangeInput,
} from '@poligoni/db/queries/admin-ranges';
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
  redirect(`/admin/${id}`);
}

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

  await updateRangeAdmin(id, toInput(parsed.data));
  revalidatePath('/admin');
  revalidatePath(`/admin/${id}`);
  return { error: undefined };
}
