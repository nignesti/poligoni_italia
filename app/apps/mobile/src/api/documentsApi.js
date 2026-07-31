import { supabase } from '@/api/supabaseClient';
import { getDeviceId } from '@/lib/deviceId';

/**
 * Documenti del dispositivo corrente. Caso base (Piano §8.2): solo la data
 * di scadenza, nessun file caricato — è il comportamento raccomandato per
 * dati potenzialmente sanitari come il certificato medico.
 */
export async function listDocuments() {
  const { data, error } = await supabase
    .from('user_documents')
    .select('*')
    .eq('user_id', getDeviceId())
    .order('expires_on');
  if (error) throw error;
  return data || [];
}

export async function createDocument({ type, expiresOn }) {
  const { error } = await supabase.from('user_documents').insert({
    user_id: getDeviceId(),
    type,
    expires_on: expiresOn,
    encrypted: 'false',
  });
  if (error) throw error;
}
