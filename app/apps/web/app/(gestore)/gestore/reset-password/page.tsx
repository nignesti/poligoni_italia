'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

/**
 * Landing del link "crea/aggiorna la tua password" (email di recovery
 * Supabase). Arriva qui via /auth/callback, che ha già scambiato il `code`
 * per una sessione lato server (stesso meccanismo del login OAuth/magic
 * link, vedi app/auth/callback/route.ts) — quindi a differenza
 * dell'equivalente mobile non serve ascoltare PASSWORD_RECOVERY: la
 * sessione temporanea è già attiva quando questa pagina monta.
 *
 * Stesso flusso unico sia per chi resetta una password esistente sia per
 * chi (registrato solo via magic link) non ne ha mai avuta una — Supabase
 * non distingue i due casi, quindi non serve indovinarlo lato client.
 */
export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [checking, setChecking] = useState(true);
  const [hasSession, setHasSession] = useState(false);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setHasSession(!!data.session);
      setChecking(false);
    });
  }, [supabase]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('La password deve avere almeno 6 caratteri.');
      return;
    }
    if (password !== confirm) {
      setError('Le due password non coincidono.');
      return;
    }

    setLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      setError('Non siamo riusciti a salvare la password. Il link potrebbe essere scaduto: richiedine uno nuovo dalla pagina di accesso.');
      return;
    }

    setDone(true);
    setTimeout(() => router.replace('/gestore'), 1500);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="login-logo">
          🎯 <span>Poligoni Italia</span>
        </Link>

        {checking && <p className="login-subtitle">Verifica del link in corso…</p>}

        {!checking && !hasSession && (
          <>
            <h1 className="login-title">Link non valido o scaduto</h1>
            <p className="login-subtitle">
              Richiedi un nuovo link dalla pagina di accesso, sezione &quot;Email e password&quot;.
            </p>
            <Link href="/gestore/login" className="btn btn-primary login-btn">
              Torna alla pagina di accesso
            </Link>
          </>
        )}

        {!checking && hasSession && !done && (
          <>
            <h1 className="login-title">Crea la tua password</h1>
            <p className="login-subtitle">
              Scegli una nuova password per il tuo account. Da ora potrai usarla per accedere, oltre al link
              magico.
            </p>

            <form className="login-form" onSubmit={handleSubmit}>
              <label className="login-label" htmlFor="password">
                Nuova password
              </label>
              <input
                id="password"
                type="password"
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />
              <label className="login-label" htmlFor="confirm">
                Conferma password
              </label>
              <input
                id="confirm"
                type="password"
                className="login-input"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={6}
                disabled={loading}
              />

              {error && <p className="login-error">{error}</p>}

              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Salvataggio…' : 'Salva password'}
              </button>
            </form>
          </>
        )}

        {done && (
          <>
            <h1 className="login-title">Fatto</h1>
            <p className="login-subtitle">Password salvata. Ti stiamo portando alla dashboard…</p>
          </>
        )}
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-50);
          padding: var(--space-4);
        }
        .login-card {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-10);
          width: 100%;
          max-width: 420px;
          box-shadow: var(--shadow-lg);
        }
        .login-logo {
          display: inline-flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 700;
          font-size: 1.125rem;
          color: var(--color-gray-900);
          text-decoration: none;
          margin-bottom: var(--space-6);
        }
        .login-title { font-size: 1.5rem; margin-bottom: var(--space-2); }
        .login-subtitle { color: var(--color-gray-500); font-size: 0.9375rem; margin-bottom: var(--space-8); line-height: 1.5; }
        .login-form { display: flex; flex-direction: column; gap: var(--space-4); }
        .login-label { font-size: 0.875rem; font-weight: 600; color: var(--color-gray-700); }
        .login-input {
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          transition: border-color 0.15s;
        }
        .login-input:focus { outline: none; border-color: var(--color-green-500); box-shadow: 0 0 0 3px var(--color-green-100); }
        .login-btn { justify-content: center; padding: var(--space-3); font-size: 0.9375rem; width: 100%; display: inline-flex; }
        .login-error { font-size: 0.8125rem; color: var(--color-red-600, #dc2626); margin: 0; }
      `}</style>
    </div>
  );
}
