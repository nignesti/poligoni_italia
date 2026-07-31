import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/api/supabaseClient";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const next = location.state?.next || "/profilo";

  const [step, setStep] = useState("email"); // email | code
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSendCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    setLoading(false);
    if (error) {
      setError("Non siamo riusciti a inviare il codice. Riprova.");
      return;
    }
    setStep("code");
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({ email, token: code, type: "email" });
    setLoading(false);
    if (error) {
      setError("Codice non valido o scaduto. Controlla e riprova.");
      return;
    }
    navigate(next, { replace: true });
  };

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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center px-6 py-12">
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">🎯</span>
        </div>
        <h1 className="text-xl font-bold text-slate-900">Poligoni Italia</h1>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        {step === "email" ? (
          <>
            <h2 className="font-semibold text-slate-900 mb-1">Accedi</h2>
            <p className="text-sm text-slate-500 mb-5">
              Ti mandiamo un codice via email, senza password.
            </p>

            <form onSubmit={handleSendCode} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="La tua email"
                required
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Invio…" : "Invia codice"}
              </button>
            </form>

            <div className="flex items-center gap-3 my-5 text-xs text-slate-400">
              <div className="flex-1 h-px bg-slate-200" />
              oppure
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 border border-slate-200 rounded-xl py-3 text-sm font-medium text-slate-700 disabled:opacity-50 active:scale-95 transition-transform"
            >
              <GoogleIcon />
              Continua con Google
            </button>
          </>
        ) : (
          <>
            <h2 className="font-semibold text-slate-900 mb-1">Controlla la tua email</h2>
            <p className="text-sm text-slate-500 mb-5">
              Abbiamo mandato un codice a <strong>{email}</strong>.
            </p>

            <form onSubmit={handleVerifyCode} className="space-y-3">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                placeholder="123456"
                required
                disabled={loading}
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-center text-lg tracking-[0.3em] font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              {error && <p className="text-xs text-red-600">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white font-semibold py-3 rounded-xl text-sm disabled:opacity-50 active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Verifica…" : "Verifica e accedi"}
              </button>
            </form>

            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
              className="w-full text-center text-xs text-orange-600 font-medium mt-4"
            >
              Usa un'altra email
            </button>
          </>
        )}
      </div>

      <p className="text-center text-xs text-slate-400 mt-6">
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
