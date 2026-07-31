import { useEffect, useState } from 'react';
import { supabase } from '@/api/supabaseClient';

/**
 * Stato di autenticazione Supabase, aggiornato in tempo reale
 * (onAuthStateChange copre login, logout e refresh token).
 */
export function useAuth() {
  const [user, setUser] = useState(undefined); // undefined = non ancora caricato
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null);
      setLoading(false);
    });

    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => subscription.subscription.unsubscribe();
  }, []);

  return { user, loading, isAuthenticated: !!user };
}
