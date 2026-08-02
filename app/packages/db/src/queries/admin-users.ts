/**
 * Query di scrittura per le autorizzazioni gestori (range_managers), per la
 * dashboard admin (app/(admin)/admin/utenti).
 *
 * La lista utenti in sé viene da Supabase Auth Admin API
 * (apps/web/lib/supabase/admin.ts), non da public.users: quella tabella
 * dovrebbe sincronizzarsi da auth.users via trigger
 * (migrations/0007_auth_sync_trigger.sql), ma il trigger non risulta
 * applicato sul DB reale — public.users è vuota mentre auth.users ha righe
 * vere. Meglio leggere la fonte di verità (Auth) che una sync rotta.
 */
import { and, asc, eq } from 'drizzle-orm';
import { getDb } from '../client.js';
import { ranges, rangeManagers, type RangeManagerRole } from '../schema/ranges.js';

export interface AdminRangeManagerRow {
  userId: string;
  rangeId: string;
  rangeName: string;
  role: RangeManagerRole;
}

export async function listAllRangeManagersForAdmin(): Promise<AdminRangeManagerRow[]> {
  const db = getDb();
  return db
    .select({
      userId: rangeManagers.userId,
      rangeId: rangeManagers.rangeId,
      rangeName: ranges.name,
      role: rangeManagers.role,
    })
    .from(rangeManagers)
    .innerJoin(ranges, eq(rangeManagers.rangeId, ranges.id))
    .orderBy(asc(ranges.name));
}

export async function addRangeManagerForAdmin(
  rangeId: string,
  userId: string,
  role: RangeManagerRole,
): Promise<void> {
  const db = getDb();
  await db
    .insert(rangeManagers)
    .values({ rangeId, userId, role })
    .onConflictDoUpdate({ target: [rangeManagers.rangeId, rangeManagers.userId], set: { role } });
}

export async function removeRangeManagerForAdmin(rangeId: string, userId: string): Promise<void> {
  const db = getDb();
  await db
    .delete(rangeManagers)
    .where(and(eq(rangeManagers.rangeId, rangeId), eq(rangeManagers.userId, userId)));
}
