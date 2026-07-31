/**
 * @poligoni/schemas — Contratti Zod condivisi tra client e server.
 *
 * Ogni schema funge da contratto API: validazione lato server, tipi derivati
 * lato client. Un unico punto di verità per la forma dei dati.
 *
 * Piano_Sviluppo_App.md §2.2 (REST versionato, non tRPC) e §6.
 */

export * from './common.js';
export * from './billing.js';
export * from './ranges.js';
export * from './bookings.js';
export * from './sessions.js';
export * from './firearms.js';
export * from './ammo.js';
export * from './documents.js';
export * from './gpg.js';
export * from './premium.js';
