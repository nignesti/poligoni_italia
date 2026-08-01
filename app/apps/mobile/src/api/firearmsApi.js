import { listLocal, insertLocal, deleteLocal } from '@/lib/localStore';

/**
 * Armi dell'utente — dati solo-locali, mai trasmessi ai nostri server (scelta
 * di prodotto: l'armeria resta sul dispositivo dell'utente). Nessuna colonna
 * marca/modello dedicata: solo tipo, calibro, soprannome, note, niente
 * matricole né dati che possano identificare un'arma specifica.
 */
export async function listFirearms() {
  return listLocal('firearms');
}

export async function createFirearm({ nickname, type, caliber, notes }) {
  return insertLocal('firearms', { nickname, type, caliber, notes: notes || null });
}

export async function deleteFirearm(id) {
  deleteLocal('firearms', id);
}
