import { supabase } from '@/api/supabaseClient';
import { getCurrentUserId } from '@/lib/currentUser';

/** Prenotazioni dell'utente autenticato, con nome/comune della struttura. */
export async function listBookings() {
  const userId = await getCurrentUserId();
  const { data, error } = await supabase
    .from('bookings')
    .select('*, ranges(name, comune)')
    .eq('user_id', userId)
    .order('slot_start', { ascending: false })
    .limit(50);
  if (error) throw error;
  return (data || []).map(({ ranges, ...b }) => ({
    ...b,
    range_name: ranges?.name,
    range_comune: ranges?.comune,
  }));
}

export async function cancelBooking(id) {
  const { error } = await supabase.from('bookings').update({ status: 'annullata' }).eq('id', id);
  if (error) throw error;
}
