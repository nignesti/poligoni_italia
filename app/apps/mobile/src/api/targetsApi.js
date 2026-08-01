import { supabase } from '@/api/supabaseClient';
import { getCurrentUserId } from '@/lib/currentUser';

/**
 * Bersagli e fori marcati — su Supabase, agganciati a una sessione
 * (RLS scoping via sessions.user_id, vedi migrazione 0008). L'arma è
 * identificata solo per nome (firearmLabel): l'armeria è dato solo-locale.
 */
export async function listTargets() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('targets')
    .select('*, sessions!inner(user_id, range_name_manual, started_at)')
    .eq('sessions.user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []).map(({ sessions, ...t }) => ({
    ...t,
    session_range_name: sessions?.range_name_manual,
    session_started_at: sessions?.started_at,
  }));
}

export async function listHoles(targetId) {
  const { data, error } = await supabase
    .from('target_holes')
    .select('*')
    .eq('target_id', targetId)
    .order('id');
  if (error) throw error;
  return data || [];
}

/** Crea un bersaglio e i fori marcati in un'unica operazione. */
export async function createTarget({ sessionId, firearmLabel, targetType, distanceM, holes }) {
  const { data: target, error } = await supabase
    .from('targets')
    .insert({
      session_id: sessionId,
      firearm_label: firearmLabel || null,
      target_type: targetType || null,
      distance_m: distanceM || null,
      scoring_mode: 'manuale',
    })
    .select()
    .single();
  if (error) throw error;

  if (holes && holes.length > 0) {
    const rows = holes.map((h) => ({
      target_id: target.id,
      x_mm: h.x,
      y_mm: h.y,
      score: h.score ?? null,
    }));
    const { error: holesError } = await supabase.from('target_holes').insert(rows);
    if (holesError) throw holesError;
  }

  return target;
}

export async function deleteTarget(id) {
  const { error } = await supabase.from('targets').delete().eq('id', id);
  if (error) throw error;
}
