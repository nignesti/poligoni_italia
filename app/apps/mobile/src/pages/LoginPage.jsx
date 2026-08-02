import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const location = useLocation();
  const next = location.state?.next || "/profilo";

  // Stati per magic link
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Stati per login con password
  const [loginEmail, setLoginEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false); // true = registrazione, false = login
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Stati per "password dimenticata": stesso flusso sia per chi resetta una
  // password esistente sia per chi (registrato via magic link) non ne ha
  // mai avuta una. Supabase non distingue i due casi — l'email di recovery
  // apre comunque una sessione temporanea, e ResetPasswordPage lascia
  // impostare la password lì, prima volta o meno che sia.
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Modalità attiva: "magic" o "password"
  const [activeMode, setActiveMode] = useState("magic");

  // --- MAGIC LINK ---
  const handleSendLink = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    setLoading(false);
    if (error) {
      setError("Non siamo riusciti a inviare il link di accesso. Riprova.");
      return;
    }
    setEmailSent(true);
  };

  // --- GOOGLE ---
  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}` },
    });
    if (error) {
      setLoading(false);
      setError("Accesso con Google non riuscito. Riprova.");
    }
  };

  // --- PASSWORD LOGIN / REGISTRAZIONE ---
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setSuccessMessage(null);

    if (isSignUp) {
      // REGISTRAZIONE
      const { data, error } = await supabase.auth.signUp({
        email: loginEmail,
        password: password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      setPasswordLoading(false);

      if (error) {
        if (error.message.includes("User already registered")) {
          setPasswordError("Questa email è già registrata. Prova ad accedere.");
        } else {
          setPasswordError("Registrazione fallita: " + error.message);
        }
        return;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setPasswordError("Questa email è già registrata ma senza password. Usa il magic link o reimposta la password.");
        return;
      }

      setSuccessMessage("Registrazione completata! Controlla la tua email per confermare l'indirizzo (se richiesto).");
      // Resetta i campi
      setLoginEmail("");
      setPassword("");
      // Se la conferma email non è richiesta, puoi fare login automatico qui
      // altrimenti l'utente deve confermare prima di fare login
      
    } else {
      // LOGIN
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: password,
      });

      setPasswordLoading(false);

      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          setPasswordError("Email o password errati.");
        } else {
          setPasswordError("Accesso fallito: " + error.message);
        }
        return;
      }

      // Login riuscito: redirect
      window.location.href = next;
    }
  };

  // --- PASSWORD DIMENTICATA ---
  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setPasswordError("Inserisci prima la tua email qui sopra, poi tocca di nuovo \"Password dimenticata?\".");
      return;
    }
    setForgotLoading(true);
    setPasswordError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setForgotLoading(false);
    if (error) {
      setPasswordError("Non siamo riusciti a inviare l'email. Riprova.");
      return;
    }
    setForgotSent(true);
  };

  // --- RENDER ---
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col justify-center px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">🎯</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900 dark:text-white">Poligoni Italia</h1>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5">
        {/* TABS per switchare tra i metodi */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 mb-5">
          <button
            onClick={() => setActiveMode("magic")}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeMode === "magic"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            Link magico
          </button>
          <button
            onClick={() => {
              setActiveMode("password");
              setPasswordError(null);
              setSuccessMessage(null);
            }}
            className={`flex-1 py-2 text-sm font-medium rounded-lg transition ${
              activeMode === "password"
                ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-700"
            }`}
          >
            Email e password
          </button>
        </div>

        {/* MODO MAGIC LINK */}
        {activeMode === "magic" && (
          <>
            {!emailSent ? (
              <>
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Accedi</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Ti mandiamo un link per accedere, senza password.
                </p>

                <form onSubmit={handleSendLink} className="space-y-3">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="La tua email"
                    required
                    disabled={loading}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-orange-600 disabled:bg-orange-800 disabled:opacity-100 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
                  >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? "Invio…" : "Invia link di accesso"}
                  </button>
                </form>
              </>
            ) : (
              <>
                <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Controlla la tua email</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
                  Abbiamo inviato un link di accesso a <strong>{email}</strong>. Aprilo per entrare.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                    setError(null);
                  }}
                  className="w-full text-center text-xs text-orange-600 font-medium"
                >
                  Usa un'altra email
                </button>
              </>
            )}
          </>
        )}

        {/* MODO PASSWORD */}
        {activeMode === "password" && forgotSent && (
          <>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1">Controlla la tua email</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              Abbiamo inviato a <strong>{loginEmail}</strong> un link per creare una nuova password. Se il tuo
              account non ne aveva mai avuta una (perché registrato solo con il link magico), questo te la fa
              impostare per la prima volta.
            </p>
            <button
              type="button"
              onClick={() => {
                setForgotSent(false);
                setPasswordError(null);
              }}
              className="w-full text-center text-xs text-orange-600 dark:text-orange-400 font-medium"
            >
              Torna al login
            </button>
          </>
        )}

        {activeMode === "password" && !forgotSent && (
          <>
            <h2 className="font-semibold text-slate-900 dark:text-white mb-1">
              {isSignUp ? "Crea un account" : "Accedi con password"}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-5">
              {isSignUp
                ? "Registrati con email e password per accedere sempre."
                : "Inserisci le tue credenziali per accedere."}
            </p>

            <form onSubmit={handlePasswordSubmit} className="space-y-3">
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="La tua email"
                required
                disabled={passwordLoading}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isSignUp ? "Scegli una password" : "La tua password"}
                required
                disabled={passwordLoading}
                minLength={6}
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              
              {passwordError && <p className="text-xs text-red-600 dark:text-red-400">{passwordError}</p>}
              {successMessage && <p className="text-xs text-green-700 dark:text-green-400">{successMessage}</p>}

              <button
                type="submit"
                disabled={passwordLoading}
                className="w-full bg-orange-600 disabled:bg-orange-800 disabled:opacity-100 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {passwordLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {passwordLoading
                  ? isSignUp ? "Registrazione…" : "Accesso…"
                  : isSignUp ? "Registrati" : "Accedi"}
              </button>
            </form>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPasswordError(null);
                  setSuccessMessage(null);
                }}
                className="text-xs text-orange-600 dark:text-orange-400 font-medium hover:underline"
              >
                {isSignUp
                  ? "Hai già un account? Accedi"
                  : "Non hai un account? Registrati"}
              </button>
            </div>

            {!isSignUp && (
              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                  className="text-xs text-slate-500 dark:text-slate-400 hover:underline disabled:no-underline disabled:cursor-not-allowed"
                >
                  {forgotLoading ? "Invio…" : "Password dimenticata?"}
                </button>
              </div>
            )}
          </>
        )}

        {/* SEPARATORE e GOOGLE (visibile in entrambi i modi) */}
        <div className="flex items-center gap-3 my-5 text-xs text-slate-400 dark:text-slate-500">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
          oppure
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-700" />
        </div>

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading || passwordLoading}
          className="w-full flex items-center justify-center gap-2.5 border border-slate-200 dark:border-slate-700 rounded-xl py-3 text-sm font-medium text-slate-700 dark:text-slate-300 disabled:cursor-not-allowed active:scale-95 transition-transform"
        >
          <GoogleIcon />
          Continua con Google
        </button>
      </div>

      <p className="text-center text-xs text-slate-400 dark:text-slate-500 mt-6">
        Strumento sportivo. Nessuna intermediazione su armi o munizioni.
      </p>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.68-3.87 2.68-6.62z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.95 10.7A5.4 5.4 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z" />
      <path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z" />
    </svg>
  );
}