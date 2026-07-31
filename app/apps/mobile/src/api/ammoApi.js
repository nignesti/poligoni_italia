import { supabase } from '@/api/supabaseClient';
import { getDeviceId } from '@/lib/deviceId';

/** Movimenti munizioni del dispositivo corrente — l'inventario è la somma dei movimenti. */
export async function listAmmoMovements() {
  const { data, error } = await supabase
    .from('ammo_movements')
    .select('*')
    .eq('user_id', getDeviceId())
    .order('occurred_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return data || [];
}

export async function createAmmoMovement({ caliber, category, delta, reason, sessionId }) {
  const { error } = await supabase.from('ammo_movements').insert({
    user_id: getDeviceId(),
    caliber,
    category,
    delta,
    reason,
    occurred_at: new Date().toISOString(),
    session_id: sessionId || null,
  });
  if (error) throw error;
}
