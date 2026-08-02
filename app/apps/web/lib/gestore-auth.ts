/**
 * Risolve quale struttura gestisce l'utente loggato in (gestore), via
 * range_managers — a differenza di /admin (whitelist email), qui
 * l'autorizzazione è per-struttura, dati reali in DB.
 *
 * V1: se un utente gestisse più strutture, ne prende una sola (la prima per
 * nome) — nessun selettore multi-struttura, non richiesto oggi e nessun
 * dato di test lo esercita ancora.
 */
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

export async function getManagedRange(): Promise<ManagedRange | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const db = getDb();
  const [row] = await db
    .select({ id: ranges.id, slug: ranges.slug, name: ranges.name, role: rangeManagers.role })
    .from(rangeManagers)
    .innerJoin(ranges, eq(rangeManagers.rangeId, ranges.id))
    .where(eq(rangeManagers.userId, user.id))
    .orderBy(ranges.name)
    .limit(1);

  return row ?? null;
}

/** Da chiamare a inizio di ogni pagina/Server Action di (gestore) che legge o scrive dati di struttura. */
export async function requireManagedRange(): Promise<ManagedRange> {
  const range = await getManagedRange();
  if (!range) throw new Error('Nessuna struttura associata a questo account.');
  return range;
}
