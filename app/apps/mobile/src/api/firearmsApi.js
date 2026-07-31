import { supabase } from '@/api/supabaseClient';
import { getDeviceId } from '@/lib/deviceId';

/**
 * Armi del dispositivo corrente. Nessuna colonna marca/modello nello schema
 * (Piano §4.4 — solo tipo, calibro, soprannome, note: niente matricole né
 * dati che possano identificare un'arma specifica).
 */
export async function listFirearms() {
  const { data, error } = await supabase
    .from('firearms')
    .select('*')
    .eq('user_id', getDeviceId())
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function createFirearm({ nickname, type, caliber, notes }) {
  const { error } = await supabase.from('firearms').insert({
    user_id: getDeviceId(),
    nickname,
    type,
    caliber,
    notes: notes || null,
  });
  if (error) throw error;
}

export async function deleteFirearm(id) {
  const { error } = await supabase.from('firearms').delete().eq('id', id);
  if (error) throw error;
}
