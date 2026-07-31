/**
 * Connessione al database per il runtime dell'app (non gli script CLI, che
 * aprono la propria connessione — vedi scripts/run-seed.ts).
 *
 * Lazy: non apre nulla all'import. Solo la prima query reale richiede
 * DATABASE_URL, così l'import del modulo non fa fallire il build in
 * contesti che non toccano il database (es. tipi condivisi).
 */
import postgres from 'postgres';
import { drizzle } from 'drizzle-orm/postgres-js';
import * as schema from './schema/index.js';

const globalForDb = globalThis as unknown as {
  __poligoniSql?: ReturnType<typeof postgres>;
};

function sqlClient(): ReturnType<typeof postgres> {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      'DATABASE_URL non impostata: impossibile interrogare il database. ' +
        'In locale, imposta DATABASE_URL su Postgres.app; su Vercel, aggiungila alle Environment Variables del progetto.',
    );
  }
  // Riusa la connessione tra invocazioni "warm" della stessa funzione
  // serverless (e tra hot-reload in dev): senza, ogni richiesta ne aprirebbe
  // una nuova ed esaurirebbe presto il limite di connessioni del database.
  if (!globalForDb.__poligoniSql) {
    globalForDb.__poligoniSql = postgres(url, { max: 5 });
  }
  return globalForDb.__poligoniSql;
}

export function getDb() {
  return drizzle(sqlClient(), { schema });
}
