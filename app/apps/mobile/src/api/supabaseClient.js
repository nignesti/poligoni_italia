import { createClient } from '@supabase/supabase-js';

// Solo anon/public key: questo client gira nel browser, mai la service
// role key (quella resta lato server, vedi apps/web/app/api/v1/billing/*).
export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY,
);
