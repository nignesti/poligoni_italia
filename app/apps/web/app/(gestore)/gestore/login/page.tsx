'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');

  return (
    <div className="login-page">
      <div className="login-card">
        <Link href="/" className="login-logo">
          🎯 <span>Poligoni Italia</span>
        </Link>
        <h1 className="login-title">Accedi alla dashboard</h1>
        <p className="login-subtitle">
          Inserisci la tua email per ricevere il link di accesso.
        </p>

        <form
          className="login-form"
          onSubmit={(e) => {
            e.preventDefault();
            alert(`Link di accesso inviato a ${email} (simulazione)`);
          }}
        >
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
          />
          <button type="submit" className="btn btn-primary login-btn">
            Invia link di accesso
          </button>
        </form>

        <p className="login-footer">
          Non hai un account?{' '}
          <Link href="/gestore/rivendica">Rivendica la tua struttura</Link>
        </p>
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
        .login-btn { justify-content: center; padding: var(--space-3); font-size: 0.9375rem; }
        .login-footer { margin-top: var(--space-6); text-align: center; font-size: 0.8125rem; color: var(--color-gray-500); }
        .login-footer a { color: var(--color-green-600); font-weight: 600; text-decoration: none; }
        .login-footer a:hover { text-decoration: underline; }
      `}</style>
    </div>
  );
}
