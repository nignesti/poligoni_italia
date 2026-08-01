import { supabase } from '@/api/supabaseClient';
import { getCurrentUserId } from '@/lib/currentUser';

/** Sessioni di tiro dell'utente autenticato. */
export async function listSessions() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data || [];
}

/**
 * Colpi per arma di tutte le sessioni dell'utente — usato per calcolare
 * il totale colpi per arma nel Diario. `firearm_label` è lo snapshot
 * testuale del soprannome dell'arma inserito al momento della sessione:
 * l'armeria (`firearms`) è dato solo-locale, non c'è più un riferimento a
 * una riga server da cui ricavarlo.
 */
export async function listSessionShots() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('session_shots')
    .select('firearm_label, caliber, rounds_fired, sessions!inner(user_id)')
    .eq('sessions.user_id', userId);
  if (error) throw error;
  return data || [];
}

/**
 * Crea una sessione e, se sono stati indicati calibro e colpi, la relativa
 * riga di colpi sparati. L'arma è identificata solo da un'etichetta di
 * testo locale (`firearmLabel`), mai da un riferimento al database: senza
 * arma selezionata la sessione si registra comunque, solo senza etichetta.
 */
export async function createSession({ rangeName, startedAt, durationMin, distanceM, firearmLabel, caliber, roundsFired, notes }) {
  const userId = await getCurrentUserId();
  const { data: session, error } = await supabase
    .from('sessions')
    .insert({
      user_id: userId,
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

  if (caliber && roundsFired) {
    const { error: shotsError } = await supabase.from('session_shots').insert({
      session_id: session.id,
      firearm_label: firearmLabel || null,
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
