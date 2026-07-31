/**
 * Verifica di autorizzazione per le route /api/v1/manage/*.
 *
 * Le query di questo layer (@poligoni/db/queries/*) usano Drizzle su una
 * connessione Postgres diretta (DATABASE_URL), non il client Supabase: non
 * passano da PostgREST, quindi non attraversano Row Level Security.
 * auth.uid() lì dentro è sempre NULL. La verifica "questo utente gestisce
 * questa struttura" va quindi fatta qui, a livello applicativo — non è
 * opzionale, è l'unico controllo che esiste su queste rotte.
 */
import { NextResponse } from 'next/server';
import { and, eq } from 'drizzle-orm';
import { getDb } from '@poligoni/db/client';
import { rangeManagers } from '@poligoni/db/schema/ranges';
import { createClient } from '@/lib/supabase/server';
import type { ApiErrorBody } from '../app/api/_utils';

function unauthorized() {
  return NextResponse.json(
    { error: { code: 'UNAUTHORIZED', message: 'Accesso richiesto' } } satisfies ApiErrorBody,
    { status: 401 },
  );
}

function forbidden() {
  return NextResponse.json(
    { error: { code: 'FORBIDDEN', message: 'Non gestisci questa struttura' } } satisfies ApiErrorBody,
    { status: 403 },
  );
}

/** Utente autenticato, o una risposta 401 pronta da restituire. */
export async function requireUser(): Promise<{ userId: string } | { error: NextResponse }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: unauthorized() };
  return { userId: user.id };
}

/** Utente autenticato E gestore di `rangeId`, o una risposta di errore pronta. */
export async function requireManagerOf(rangeId: string): Promise<{ userId: string } | { error: NextResponse }> {
  const userResult = await requireUser();
  if ('error' in userResult) return userResult;

  const db = getDb();
  const [managed] = await db
    .select({ rangeId: rangeManagers.rangeId })
    .from(rangeManagers)
    .where(and(eq(rangeManagers.userId, userResult.userId), eq(rangeManagers.rangeId, rangeId)))
    .limit(1);

  if (!managed) return { error: forbidden() };
  return userResult;
}
