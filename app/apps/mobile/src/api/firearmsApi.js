import { supabase } from '@/api/supabaseClient';
import { getCurrentUserId } from '@/lib/currentUser';

/**
 * Armi dell'utente autenticato. Nessuna colonna marca/modello nello schema
 * (Piano §4.4 — solo tipo, calibro, soprannome, note: niente matricole né
 * dati che possano identificare un'arma specifica).
 */
export async function listFirearms() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('firearms')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

export async function createFirearm({ nickname, type, caliber, notes }) {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from('firearms').insert({
    user_id: userId,
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
