/**
 * @poligoni/core — logica di dominio pura.
 *
 * Nessuna dipendenza esterna, nessun I/O, nessun accesso a rete o database.
 * È il pacchetto più importante del repository: contiene le regole che devono
 * comportarsi in modo identico su web, mobile e server e che, se sbagliate,
 * hanno conseguenze legali per l'utente.
 *
 * Vedi Piano_Sviluppo_App.md §5 e §10.
 */

export * as ammo from './ammo/index.js';
export * as ballistics from './ballistics/index.js';
export * as billing from './billing/index.js';
export * as gpg from './gpg/index.js';
export * as documents from './documents/index.js';
export * as booking from './booking/index.js';
export * as premium from './premium/index.js';
export * as slug from './slug/index.js';
