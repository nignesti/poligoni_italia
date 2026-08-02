/**
 * Risolve quale struttura gestisce l'utente loggato in (gestore), via
 * range_managers — a differenza di /admin (whitelist email), qui
 * l'autorizzazione è per-struttura, dati reali in DB.
 *
 * Un gestore normale ha sempre una sola struttura, ma i due account admin
 * sono ora proprietari di tutti i 152 poligoni (assegnazione massiva via
 * script una tantum) per poter vedere cosa vede un gestore reale — per loro
 * serve poter scegliere quale struttura guardare. La scelta si ricorda in
 * un cookie (COOKIE_NAME), validato ogni volta contro range_managers così
 * non è mai possibile "switchare" su una struttura non autorizzata.
 */
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { getDb } from '@poligoni/db/client';
import { ranges, rangeManagers, type RangeManagerRole } from '@poligoni/db/schema/ranges';
import { createClient } from '@/lib/supabase/server';

export interface ManagedRange {
  id: string;
  slug: string;
  name: string;
  role: RangeManagerRole;
}

const COOKIE_NAME = 'gestore_active_range';

/** Tutte le strutture gestite dall'utente loggato, ordinate per nome. */
export async function listManagedRanges(): Promise<ManagedRange[]> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const db = getDb();
  return db
    .select({ id: ranges.id, slug: ranges.slug, name: ranges.name, role: rangeManagers.role })
    .from(rangeManagers)
    .innerJoin(ranges, eq(rangeManagers.rangeId, ranges.id))
    .where(eq(rangeManagers.userId, user.id))
    .orderBy(ranges.name);
}

/**
 * Struttura attiva: quella scelta via cookie se ancora tra quelle gestite,
 * altrimenti la prima per nome (comportamento invariato per chi ne gestisce
 * una sola).
 */
export async function getManagedRange(): Promise<ManagedRange | null> {
  const all = await listManagedRanges();
  if (all.length === 0) return null;

  const cookieStore = await cookies();
  const selectedId = cookieStore.get(COOKIE_NAME)?.value;
  if (selectedId) {
    const match = all.find((r) => r.id === selectedId);
    if (match) return match;
  }

  return all[0] ?? null;
}

/** Da chiamare a inizio di ogni pagina/Server Action di (gestore) che legge o scrive dati di struttura. */
export async function requireManagedRange(): Promise<ManagedRange> {
  const range = await getManagedRange();
  if (!range) throw new Error('Nessuna struttura associata a questo account.');
  return range;
}

/**
 * Cambia la struttura attiva. Valida sempre rangeId contro le strutture
 * gestite dall'utente — impossibile impostare via cookie una struttura non
 * propria, anche forzando il valore lato client.
 */
export async function setActiveManagedRange(rangeId: string): Promise<boolean> {
  const all = await listManagedRanges();
  if (!all.some((r) => r.id === rangeId)) return false;

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, rangeId, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });
  return true;
}
