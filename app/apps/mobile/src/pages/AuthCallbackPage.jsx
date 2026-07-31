import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Loader2 } from "lucide-react";

/**
 * Landing del redirect OAuth (Google). Il client Supabase intercetta il
 * `?code=` nell'URL e completa lo scambio sessione da solo
 * (detectSessionInUrl, attivo di default) — qui si aspetta solo l'evento
 * SIGNED_IN per sapere quando è pronto.
 */
export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const next = searchParams.get("next") || "/profilo";

  useEffect(() => {
    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_IN") {
        navigate(next, { replace: true });
      }
    });

    // Se la sessione è già pronta all'arrivo (evento perso per timing),
    // controlla anche direttamente.
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) navigate(next, { replace: true });
    });

    const timeout = setTimeout(() => navigate("/accedi", { replace: true }), 8000);

    return () => {
      subscription.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, [navigate, next]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
    </div>
  );
}
