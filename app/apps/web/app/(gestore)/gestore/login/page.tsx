'use client';

import Link from 'next/link';
import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') || '/gestore';
  const oauthFailed = searchParams.get('error') === 'auth_failed';

  const [activeMode, setActiveMode] = useState<'magic' | 'password'>('magic');

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(
    oauthFailed ? 'Accesso con Google non riuscito. Riprova.' : null,
  );

  // Login con email + password (stessa logica dell'app mobile:
  // signUp/signInWithPassword/resetPasswordForEmail — vedi
  // apps/mobile/src/pages/LoginPage.jsx).
  const [loginEmail, setLoginEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // "Password dimenticata": stesso flusso unico usato in mobile, valido sia
  // per chi ha già una password sia per chi (registrato solo via magic
  // link) non ne ha mai avuta una — Supabase non distingue i due casi.
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

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

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordError(null);
    setSuccessMessage(null);

    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({
        email: loginEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });

      setPasswordLoading(false);

      if (error) {
        if (error.message.includes('User already registered')) {
          setPasswordError('Questa email è già registrata. Prova ad accedere.');
        } else {
          setPasswordError('Registrazione fallita: ' + error.message);
        }
        return;
      }

      if (data.user && data.user.identities && data.user.identities.length === 0) {
        setPasswordError('Questa email è già registrata ma senza password. Usa il link magico o reimposta la password.');
        return;
      }

      setSuccessMessage("Registrazione completata! Controlla la tua email per confermare l'indirizzo (se richiesto).");
      setLoginEmail('');
      setPassword('');
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password,
      });

      setPasswordLoading(false);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setPasswordError('Email o password errati.');
        } else {
          setPasswordError('Accesso fallito: ' + error.message);
        }
        return;
      }

      window.location.href = next;
    }
  };

  const handleForgotPassword = async () => {
    if (!loginEmail) {
      setPasswordError('Inserisci prima la tua email qui sopra, poi tocca di nuovo "Password dimenticata?".');
      return;
    }
    setForgotLoading(true);
    setPasswordError(null);
    setSuccessMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(loginEmail, {
      redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent('/gestore/reset-password')}`,
    });

    setForgotLoading(false);
    if (error) {
      setPasswordError("Non siamo riusciti a inviare l'email. Riprova.");
      return;
    }
    setForgotSent(true);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="login-logo">
          🎯 <span>Poligoni Italia</span>
        </Link>

        <div className="login-tabs">
          <button
            type="button"
            className={`login-tab ${activeMode === 'magic' ? 'login-tab-active' : ''}`}
            onClick={() => setActiveMode('magic')}
          >
            Link magico
          </button>
          <button
            type="button"
            className={`login-tab ${activeMode === 'password' ? 'login-tab-active' : ''}`}
            onClick={() => {
              setActiveMode('password');
              setError(null);
            }}
          >
            Email e password
          </button>
        </div>

        {activeMode === 'magic' && (
          !emailSent ? (
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
          )
        )}

        {activeMode === 'password' && forgotSent && (
          <>
            <h1 className="login-title">Controlla la tua email</h1>
            <p className="login-subtitle">
              Abbiamo inviato a <strong>{loginEmail}</strong> un link per creare una nuova password. Se il tuo
              account non ne aveva mai avuta una (perché registrato solo con il link magico), questo te la fa
              impostare per la prima volta.
            </p>
            <button
              type="button"
              className="login-back-link"
              onClick={() => {
                setForgotSent(false);
                setPasswordError(null);
              }}
            >
              Torna al login
            </button>
          </>
        )}

        {activeMode === 'password' && !forgotSent && (
          <>
            <h1 className="login-title">{isSignUp ? 'Crea un account' : 'Accedi con password'}</h1>
            <p className="login-subtitle">
              {isSignUp
                ? 'Registrati con email e password per accedere sempre.'
                : 'Inserisci le tue credenziali per accedere.'}
            </p>

            <form className="login-form" onSubmit={handlePasswordSubmit}>
              <label className="login-label" htmlFor="loginEmail">
                Email
              </label>
              <input
                id="loginEmail"
                type="email"
                className="login-input"
                placeholder="nome@poligono.it"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={passwordLoading}
              />
              <label className="login-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="login-input"
                placeholder={isSignUp ? 'Scegli una password' : 'La tua password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                disabled={passwordLoading}
              />

              {passwordError && <p className="login-error">{passwordError}</p>}
              {successMessage && <p className="login-success">{successMessage}</p>}

              <button type="submit" className="btn btn-primary login-btn" disabled={passwordLoading}>
                {passwordLoading
                  ? isSignUp
                    ? 'Registrazione…'
                    : 'Accesso…'
                  : isSignUp
                    ? 'Registrati'
                    : 'Accedi'}
              </button>
            </form>

            <div className="login-secondary-actions">
              <button
                type="button"
                className="login-back-link"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setPasswordError(null);
                  setSuccessMessage(null);
                }}
              >
                {isSignUp ? 'Hai già un account? Accedi' : 'Non hai un account? Registrati'}
              </button>

              {!isSignUp && (
                <button
                  type="button"
                  className="login-forgot-link"
                  onClick={handleForgotPassword}
                  disabled={forgotLoading}
                >
                  {forgotLoading ? 'Invio…' : 'Password dimenticata?'}
                </button>
              )}
            </div>
          </>
        )}

        <div className="login-divider">
          <span>oppure</span>
        </div>

        <button
          type="button"
          className="login-google-btn"
          onClick={handleGoogleLogin}
          disabled={loading || passwordLoading}
        >
          <GoogleIcon />
          Continua con Google
        </button>

        <p className="login-footer">
          Non hai un account?{' '}
          <Link href="/gestore/rivendica">Rivendica la tua struttura</Link>
        </p>
      </div>

      <style>{`
        .login-page {
          /* :root fissa color-scheme: dark per il redesign pubblico
             (app/styles/globals.css) — senza questo override i controlli
             nativi (input, ecc.) ereditano i colori UA dark anche qui,
             dove il tema deve restare chiaro: testo bianco su sfondo
             bianco, illeggibile. (gestore) è volutamente escluso dal
             redesign, vedi CLAUDE.md. */
          color-scheme: light;
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
        .login-tabs {
          display: flex;
          background: var(--color-gray-100);
          border-radius: var(--radius-lg);
          padding: 4px;
          margin-bottom: var(--space-6);
        }
        .login-tab {
          flex: 1;
          border: none;
          background: transparent;
          padding: var(--space-2) var(--space-3);
          font-size: 0.8125rem;
          font-weight: 600;
          color: var(--color-gray-700);
          border-radius: calc(var(--radius-lg) - 4px);
          cursor: pointer;
          transition: background 0.15s, color 0.15s;
        }
        .login-tab-active {
          background: white;
          color: var(--color-gray-900);
          box-shadow: var(--shadow-sm, 0 1px 2px rgba(0,0,0,0.06));
        }
        .login-title { font-size: 1.5rem; margin-bottom: var(--space-2); }
        .login-subtitle { color: var(--color-gray-500); font-size: 0.9375rem; margin-bottom: var(--space-8); line-height: 1.5; }
        .login-form { display: flex; flex-direction: column; gap: var(--space-4); }
        .login-label { font-size: 0.875rem; font-weight: 600; color: var(--color-gray-700); }
        .login-input {
          background: white;
          color: var(--color-gray-900);
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          transition: border-color 0.15s;
        }
        .login-input::placeholder { color: var(--color-gray-400); }
        .login-input:focus { outline: none; border-color: var(--color-green-500); box-shadow: 0 0 0 3px var(--color-green-100); }
        .login-code-input { letter-spacing: 0.3em; font-variant-numeric: tabular-nums; text-align: center; font-size: 1.25rem; }
        .login-btn { justify-content: center; padding: var(--space-3); font-size: 0.9375rem; }
        .login-error { font-size: 0.8125rem; color: var(--color-red-600, #dc2626); margin: 0; }
        .login-success { font-size: 0.8125rem; color: var(--color-green-700, #004a87); margin: 0; }
        .login-footer { margin-top: var(--space-6); text-align: center; font-size: 0.8125rem; color: var(--color-gray-500); }
        .login-footer a { color: var(--color-green-600); font-weight: 600; text-decoration: none; }
        .login-footer a:hover { text-decoration: underline; }
        .login-secondary-actions {
          margin-top: var(--space-4);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-2);
        }
        .login-back-link {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          font-size: 0.8125rem;
          color: var(--color-green-600);
          font-weight: 600;
          cursor: pointer;
        }
        .login-back-link:hover { text-decoration: underline; }
        .login-forgot-link {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          font-size: 0.8125rem;
          color: var(--color-gray-500);
          cursor: pointer;
        }
        .login-forgot-link:hover { text-decoration: underline; }
        .login-forgot-link:disabled { cursor: not-allowed; }
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
        .login-google-btn:disabled { cursor: not-allowed; }
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
