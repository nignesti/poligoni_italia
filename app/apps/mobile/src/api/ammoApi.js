import { listLocal, insertLocal } from '@/lib/localStore';

/**
 * Movimenti munizioni — dati solo-locali, mai trasmessi ai nostri server.
 * L'inventario è la somma dei movimenti, calcolata client-side.
 */
export async function listAmmoMovements() {
  return [...listLocal('ammo_movements')].sort(
    (a, b) => new Date(b.occurred_at) - new Date(a.occurred_at)
  );
}

export async function createAmmoMovement({ caliber, category, delta, reason, sessionId }) {
  return insertLocal('ammo_movements', {
    caliber,
    category,
    delta,
    reason,
    occurred_at: new Date().toISOString(),
    session_id: sessionId || null,
  });
}
