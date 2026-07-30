/**
 * Utility condivise per gli API route handlers.
 *
 * Piano_Sviluppo_App.md §6.2 per le convenzioni API.
 */
import { NextResponse } from 'next/server';
import type { ZodType } from 'zod';

// ---------------------------------------------------------------------------
// Errori strutturati (Piano §6.2)
// ---------------------------------------------------------------------------
export interface ApiErrorBody {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    { error: { code: 'BAD_REQUEST', message, details } } satisfies ApiErrorBody,
    { status: 400 },
  );
}

export function notFound(message = 'Risorsa non trovata') {
  return NextResponse.json(
    { error: { code: 'NOT_FOUND', message } } satisfies ApiErrorBody,
    { status: 404 },
  );
}

export function internalError(message = 'Errore interno del server') {
  return NextResponse.json(
    { error: { code: 'INTERNAL_ERROR', message } } satisfies ApiErrorBody,
    { status: 500 },
  );
}

export function methodNotAllowed() {
  return NextResponse.json(
    { error: { code: 'METHOD_NOT_ALLOWED', message: 'Metodo non supportato' } } satisfies ApiErrorBody,
    { status: 405 },
  );
}

// ---------------------------------------------------------------------------
// Validazione Zod
// ---------------------------------------------------------------------------
/**
 * Valida i dati con uno schema Zod.
 * Restituisce un oggetto con `{ data: T }` in caso di successo
 * o `{ error: NextResponse }` in caso di fallimento.
 * Usare `if ('error' in result)` per discriminare.
 */
export function validate<T>(
  schema: ZodType<T>,
  data: unknown,
): { data: T } | { error: NextResponse } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { data: result.data };
  }
  const details = result.error.issues.map((i) => ({
    field: i.path.join('.'),
    message: i.message,
    code: i.code,
  }));
  return { error: badRequest('Parametri non validi', details) };
}

// ---------------------------------------------------------------------------
// Cache headers (Piano §6.2)
// ---------------------------------------------------------------------------
/**
 * Applica header di cache per risposte pubbliche.
 * s-maxage=300 (5 minuti) sulle ricerche pubbliche.
 * I dati delle strutture cambiano raramente.
 */
export function withCache(response: NextResponse, maxAge = 300): NextResponse {
  response.headers.set(
    'Cache-Control',
    `public, s-maxage=${maxAge}, stale-while-revalidate=${maxAge * 2}`,
  );
  return response;
}

// ---------------------------------------------------------------------------
// JSON helper
// ---------------------------------------------------------------------------
export function json<T>(data: T, status = 200): NextResponse {
  return NextResponse.json(data, { status });
}

// ---------------------------------------------------------------------------
// CORS per route pubbliche
// ---------------------------------------------------------------------------
export function corsHeaders(): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
