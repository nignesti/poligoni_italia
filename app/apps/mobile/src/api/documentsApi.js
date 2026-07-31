import { supabase } from '@/api/supabaseClient';
import { getCurrentUserId } from '@/lib/currentUser';

/**
 * Documenti dell'utente autenticato. Caso base (Piano §8.2): solo la data
 * di scadenza, nessun file caricato — è il comportamento raccomandato per
 * dati potenzialmente sanitari come il certificato medico.
 */
export async function listDocuments() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('user_documents')
    .select('*')
    .eq('user_id', userId)
    .order('expires_on');
  if (error) throw error;
  return data || [];
}

export async function createDocument({ type, expiresOn }) {
  const userId = await getCurrentUserId();
  const { error } = await supabase.from('user_documents').insert({
    user_id: userId,
    type,
    expires_on: expiresOn,
    encrypted: 'false',
  });
  if (error) throw error;
}
