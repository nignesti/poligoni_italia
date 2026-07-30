/**
 * Schemi comuni condivisi — UUID, date, coordinate, paginazione, errori.
 *
 * Piano_Sviluppo_App.md §6.2 per le convenzioni API.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// UUID v7 — ordinabili nel tempo (Piano §4)
// ---------------------------------------------------------------------------
export const uuidSchema = z.string().uuid();

// ---------------------------------------------------------------------------
// Date & timestamp
// ---------------------------------------------------------------------------
/** Stringa ISO 8601 (es. "2026-09-12T09:00:00.000Z"). */
export const isoDateSchema = z.string().datetime({ offset: true });

/** Solo data, senza orario (es. "2026-09-12"). */
export const dateOnlySchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato data atteso: YYYY-MM-DD');

// ---------------------------------------------------------------------------
// Coordinate geografiche (PostGIS Geography(Point,4326))
// ---------------------------------------------------------------------------
export const coordinatesSchema = z.object({
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
});

export type Coordinates = z.infer<typeof coordinatesSchema>;

// ---------------------------------------------------------------------------
// Paginazione basata su cursore (Piano §6.2)
// ---------------------------------------------------------------------------
export const cursorPaginationSchema = z.object({
  /** Cursore opaco per la pagina successiva. */
  cursor: z.string().optional(),
  /** Limite risultati (default 20, max 100). */
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CursorPagination = z.infer<typeof cursorPaginationSchema>;

export const cursorResponseSchema = <T extends z.ZodTypeAny>(item: T) =>
  z.object({
    data: z.array(item),
    /** Cursore per la pagina successiva. Null = ultima pagina. */
    nextCursor: z.string().nullable(),
    /** Totale approssimativo, se disponibile. */
    total: z.number().int().nonnegative().optional(),
  });

// ---------------------------------------------------------------------------
// Errori API (Piano §6.2)
// ---------------------------------------------------------------------------
export const apiErrorSchema = z.object({
  error: z.object({
    /** Codice errore stabile e documentato. */
    code: z.string(),
    /** Messaggio leggibile. */
    message: z.string(),
    /** Dettagli aggiuntivi (es. errori di validazione campo per campo). */
    details: z.unknown().optional(),
  }),
});

export type ApiError = z.infer<typeof apiErrorSchema>;

/** Errore di validazione campo per campo (Zod). */
export const validationErrorDetailSchema = z.object({
  field: z.string(),
  message: z.string(),
  code: z.string().optional(),
});

export type ValidationErrorDetail = z.infer<typeof validationErrorDetailSchema>;

// ---------------------------------------------------------------------------
// Idempotenza (Piano §6.2)
// ---------------------------------------------------------------------------
export const idempotencyKeySchema = z.string().min(1).max(256);

// ---------------------------------------------------------------------------
// Versione client (Piano §6.2 — X-App-Version)
// ---------------------------------------------------------------------------
export const appVersionSchema = z.string().regex(
  /^\d+\.\d+\.\d+$/,
  'Versione attesa in formato semver (es. 1.2.3)',
);

// ---------------------------------------------------------------------------
// Helper — slug
// ---------------------------------------------------------------------------
export const slugSchema = z
  .string()
  .min(1)
  .max(200)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Solo lettere minuscole, numeri e trattini');
