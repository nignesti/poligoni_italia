import { supabase } from '@/api/supabaseClient';

/** Id dell'utente autenticato. Lancia se non c'è sessione — le pagine che lo
 * usano sono tutte dietro AuthGate, quindi non dovrebbe mai succedere. */
export async function getCurrentUserId() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('Non autenticato');
  return user.id;
}
