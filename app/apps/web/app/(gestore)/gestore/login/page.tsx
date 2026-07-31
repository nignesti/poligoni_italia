'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/gestore';
  const oauthFailed = searchParams.get('error') === 'auth_failed';

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(
    oauthFailed ? 'Accesso con Google non riuscito. Riprova.' : null,
  );

  const supabase = createClient();

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`;

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: redirectTo,
      },
    });

    setLoading(false);
    if (error) {
      setError('Non siamo riusciti a inviare il link di accesso. Riprova.');
      return;
    }

    setEmailSent(true);
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) {
      setLoading(false);
      setError('Accesso con Google non riuscito. Riprova.');
    }
    // In caso di successo il browser viene reindirizzato a Google: nessun
    // altro stato da gestire qui.
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="login-logo">
          🎯 <span>Poligoni Italia</span>
        </Link>

        {!emailSent ? (
          <>
            <h1 className="login-title">Accedi alla dashboard</h1>
            <p className="login-subtitle">
              Inserisci la tua email: ti mandiamo un link per accedere, senza password.
            </p>

            <form className="login-form" onSubmit={handleSendLink}>
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                className="login-input"
                placeholder="nome@poligono.it"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
              {error && <p className="login-error">{error}</p>}
              <button type="submit" className="btn btn-primary login-btn" disabled={loading}>
                {loading ? 'Invio…' : 'Invia link di accesso'}
              </button>
            </form>

            <div className="login-divider">
              <span>oppure</span>
            </div>

            <button
              type="button"
              className="login-google-btn"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <GoogleIcon />
              Continua con Google
            </button>

            <p className="login-footer">
              Non hai un account?{' '}
              <Link href="/gestore/rivendica">Rivendica la tua struttura</Link>
            </p>
          </>
        ) : (
          <>
            <h1 className="login-title">Controlla la tua email</h1>
            <p className="login-subtitle">
              Abbiamo inviato un link di accesso a <strong>{email}</strong>. Aprilo per entrare nella dashboard.
            </p>

            <button
              type="button"
              className="btn btn-primary login-btn"
              onClick={() => {
                setEmailSent(false);
                setEmail('');
                setError(null);
              }}
            >
              Usa un&apos;altra email
            </button>
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
          margin-bottom: var(--space-8);
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
        .login-code-input { letter-spacing: 0.3em; font-variant-numeric: tabular-nums; text-align: center; font-size: 1.25rem; }
        .login-btn { justify-content: center; padding: var(--space-3); font-size: 0.9375rem; }
        .login-error { font-size: 0.8125rem; color: var(--color-red-600, #dc2626); margin: 0; }
        .login-footer { margin-top: var(--space-6); text-align: center; font-size: 0.8125rem; color: var(--color-gray-500); }
        .login-footer a { color: var(--color-green-600); font-weight: 600; text-decoration: none; }
        .login-footer a:hover { text-decoration: underline; }
        .login-back-link {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          color: var(--color-green-600);
          font-weight: 600;
          cursor: pointer;
        }
        .login-back-link:hover { text-decoration: underline; }
        .login-divider {
          display: flex;
          align-items: center;
          gap: var(--space-3);
          margin: var(--space-6) 0;
          color: var(--color-gray-400);
          font-size: 0.8125rem;
        }
        .login-divider::before, .login-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-gray-200);
        }
        .login-google-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-3);
          padding: var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          background: white;
          font-size: 0.9375rem;
          font-weight: 600;
          color: var(--color-gray-700);
          cursor: pointer;
          transition: border-color 0.15s, background 0.15s;
        }
        .login-google-btn:hover { background: var(--color-gray-50); border-color: var(--color-gray-400); }
        .login-google-btn:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
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

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
