import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Loader2 } from "lucide-react";

/**
 * Landing del link "crea/aggiorna la tua password" (email di recovery
 * Supabase, sia per chi resetta una password esistente sia per chi non ne
 * ha mai avuta una — vedi LoginPage.handleForgotPassword). Supabase non
 * distingue i due casi lato flusso: apre comunque una sessione temporanea e
 * lascia chiamare updateUser({ password }) per fissarla, prima volta o meno.
 *
 * Il client intercetta i token nell'URL (detectSessionInUrl, default) ed
 * emette PASSWORD_RECOVERY. Se l'evento è già passato prima che il
 * listener fosse montato, la sessione è comunque attiva: getSession() lo
 * copre.
 */
export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [status, setStatus] = useState("checking"); // checking | ready | expired
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let settled = false;

    const { data: subscription } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        settled = true;
        setStatus("ready");
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data.session && !settled) {
        settled = true;
        setStatus("ready");
      }
    });

    const timeout = setTimeout(() => {
      if (!settled) setStatus("expired");
    }, 6000);

    return () => {
      subscription.subscription.unsubscribe();
      clearTimeout(timeout);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("La password deve avere almeno 6 caratteri.");
      return;
    }
    if (password !== confirm) {
      setError("Le due password non coincidono.");
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError("Non siamo riusciti a salvare la password. Il link potrebbe essere scaduto: richiedine uno nuovo dalla pagina di accesso.");
      return;
    }

    setDone(true);
    setTimeout(() => navigate("/profilo", { replace: true }), 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">🎯</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Poligoni Italia</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        {status === "checking" && (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <Loader2 className="w-6 h-6 text-orange-500 animate-spin" />
            <p className="text-sm text-slate-500 dark:text-slate-400">Verifica del link in corso…</p>
          </div>
        )}

        {status === "expired" && (
          <div className="text-center">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Link non valido o scaduto</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Richiedi un nuovo link dalla pagina di accesso, sezione &quot;Email e password&quot;.
            </p>
            <Link
              to="/accedi"
              className="inline-block w-full text-center bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm"
            >
              Torna alla pagina di accesso
            </Link>
          </div>
        )}

        {status === "ready" && !done && (
          <>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Crea la tua password</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Scegli una nuova password per il tuo account. Da ora potrai usarla per accedere, oltre al link magico.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nuova password"
                required
                minLength={6}
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                placeholder="Conferma password"
                required
                minLength={6}
                disabled={loading}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />

              {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 disabled:bg-orange-800 disabled:opacity-100 text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Salvataggio…" : "Salva password"}
              </button>
            </form>
          </>
        )}

        {done && (
          <div className="text-center">
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Fatto</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Password salvata. Ti stiamo portando al tuo profilo…
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
