import { supabase } from '@/api/supabaseClient';
import { getDeviceId } from '@/lib/deviceId';

/** Sessioni di tiro del dispositivo corrente. */
export async function listSessions() {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', getDeviceId())
    .order('started_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

/**
 * Colpi per arma di tutte le sessioni del dispositivo — usato per calcolare
 * il totale colpi per arma nel Diario, dato che `firearms` non ha una
 * colonna contatore (Piano §4.4: il totale si ricostruisce dai movimenti,
 * mai un contatore scritto direttamente).
 */
export async function listSessionShots() {
  const { data, error } = await supabase
    .from('session_shots')
    .select('firearm_id, rounds_fired, sessions!inner(user_id)')
    .eq('sessions.user_id', getDeviceId());
  if (error) throw error;
  return data || [];
}

/**
 * Crea una sessione e, se è stata indicata un'arma, la relativa riga di
 * colpi sparati. `session_shots.firearm_id` è NOT NULL: senza arma
 * selezionata la sessione si registra comunque, solo senza il dettaglio
 * colpi/calibro per arma.
 */
export async function createSession({ rangeName, startedAt, durationMin, distanceM, firearmId, caliber, roundsFired, notes }) {
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: getDeviceId(),
      range_name_manual: rangeName,
      started_at: startedAt,
      duration_min: durationMin,
      distance_m: distanceM,
      confirmed_by_user: true,
      auto_generated: false,
      notes: notes || null,
    })
    .select()
    .single();
  if (error) throw error;

  if (firearmId && roundsFired) {
    const { error: shotsError } = await supabase.from('session_shots').insert({
      session_id: session.id,
      firearm_id: firearmId,
      caliber,
      rounds_fired: roundsFired,
    });
    if (shotsError) throw shotsError;
  }

  return session;
}

export async function deleteSession(id) {
  const { error } = await supabase.from('sessions').delete().eq('id', id);
  if (error) throw error;
}
