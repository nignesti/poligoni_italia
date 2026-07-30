/**
 * @poligoni/db — Connessione, schema e helper query.
 *
 * Piano_Sviluppo_App.md §9 per ambienti.
 */
export * from './schema/index.js';

// Re-export drizzle-orm per comodità
export { sql, eq, and, or, not, inArray, gte, lte, asc, desc, isNull, isNotNull } from 'drizzle-orm';
