/**
 * Client Supabase con service-role key: bypassa RLS, usa le API Admin
 * (es. auth.admin.listUsers). Solo lato server, mai importato da un client
 * component — la chiave non ha il prefisso NEXT_PUBLIC_ apposta.
 *
 * Serve per /admin/utenti: public.users dovrebbe rispecchiare auth.users
 * via trigger (migrations/0007_auth_sync_trigger.sql), ma quel trigger non
 * risulta applicato sul DB reale (public.users è vuota, auth.users no) —
 * leggere da Auth direttamente evita di dipendere da una sync rotta.
 */
import { createClient } from '@supabase/supabase-js';

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      'SUPABASE_SERVICE_ROLE_KEY non impostata: impossibile usare le API Admin di Supabase. ' +
        'Vedi Settings → API → service_role nel dashboard Supabase.',
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
