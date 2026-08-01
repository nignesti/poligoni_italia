import { listLocal, insertLocal } from '@/lib/localStore';

/**
 * Documenti e scadenze — dati solo-locali, mai trasmessi ai nostri server.
 * Coerente col caso base già previsto dal Piano §8.2 (solo la data di
 * scadenza, nessun file caricato), portato però interamente sul dispositivo
 * invece che su database: per dati potenzialmente sanitari come il
 * certificato medico è la scelta più prudente.
 */
export async function listDocuments() {
  return [...listLocal('documents')].sort(
    (a, b) => new Date(a.expires_on) - new Date(b.expires_on)
  );
}

export async function createDocument({ type, expiresOn }) {
  return insertLocal('documents', { type, expires_on: expiresOn, encrypted: false });
}
