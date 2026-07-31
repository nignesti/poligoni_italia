import { supabase } from '@/api/supabaseClient';

/**
 * Richiesta di disponibilità (Piano_Sviluppo_App.md §4.3 booking_requests) —
 * per strutture non partner o per prenotazioni che richiedono conferma del
 * gestore. Non crea una prenotazione reale.
 */
export async function createBookingRequest({ rangeId, name, email, phone, requestedFor, message }) {
  const { error } = await supabase.from('booking_requests').insert({
    range_id: rangeId,
    name,
    email,
    phone: phone || null,
    requested_for: requestedFor,
    message: message || null,
  });
  if (error) throw error;
}
