import { supabase } from '@/api/supabaseClient';
import { getDeviceId } from '@/lib/deviceId';

/** Prenotazioni del dispositivo corrente, con nome/comune della struttura. */
export async function listBookings() {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, ranges(name, comune)')
    .eq('user_id', getDeviceId())
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
