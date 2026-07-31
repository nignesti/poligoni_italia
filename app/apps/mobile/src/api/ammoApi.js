import { supabase } from '@/api/supabaseClient';
import { getCurrentUserId } from '@/lib/currentUser';

/** Movimenti munizioni dell'utente autenticato — l'inventario è la somma dei movimenti. */
export async function listAmmoMovements() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('ammo_movements')
    .select('*')
    .eq('user_id', userId)
    .order('occurred_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function createAmmoMovement({ caliber, category, delta, reason, sessionId }) {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from('ammo_movements').insert({
    user_id: userId,
    caliber,
    category,
    delta,
    reason,
    occurred_at: new Date().toISOString(),
    session_id: sessionId || null,
  });
  if (error) throw error;
}
