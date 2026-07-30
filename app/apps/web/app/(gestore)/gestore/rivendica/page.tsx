'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function RivendicaPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="riv-page">
      <div className="riv-card">
        <Link href="/" className="riv-logo">
          🎯 <span>Poligoni Italia</span>
        </Link>

        {step === 1 && (
          <>
            <h1 className="riv-title">Rivendica la tua struttura</h1>
            <p className="riv-subtitle">
              Sei il gestore di un poligono già censito? Inserisci il nome per iniziare.
            </p>
            <form
              className="riv-form"
              onSubmit={(e) => {
                e.preventDefault();
                setStep(2);
              }}
            >
              <label className="riv-label">Nome del poligono</label>
              <input
                className="riv-input"
                placeholder="es. TSN Milano"
                required
              />
              <label className="riv-label">La tua email</label>
              <input
                type="email"
                className="riv-input"
                placeholder="nome@poligono.it"
                required
              />
              <button type="submit" className="btn btn-primary riv-btn">
                Cerca e rivendica
              </button>
            </form>
          </>
        )}

        {step === 2 && (
          <>
            <h1 className="riv-title">Conferma identità</h1>
            <p className="riv-subtitle">
              Per verificare che tu sia il gestore, ti invieremo un codice
              all&apos;indirizzo email o al telefono registrato per questa struttura.
            </p>
            <div className="riv-success">
              ✅ Richiesta inviata a <strong>info@tsnmilano.it</strong>
            </div>
            <p className="riv-note">
              Riceverai una email con le istruzioni per completare la verifica.
              Se non riconosci questi dati,{' '}
              <a href="mailto:info@poligoniitalia.it">contattaci</a>.
            </p>
            <button
              className="btn btn-primary riv-btn"
              onClick={() => setStep(3)}
            >
              Simula verifica
            </button>
          </>
        )}

        {step === 3 && (
          <>
            <h1 className="riv-title">✅ Struttura rivendicata!</h1>
            <p className="riv-subtitle">
              Ora puoi gestire orari, prezzi e prenotazioni di TSN Milano.
            </p>
            <div className="riv-actions">
              <Link href="/gestore" className="btn btn-primary">
                Vai alla dashboard
              </Link>
              <Link href="/gestore/struttura" className="btn btn-secondary">
                Completa la scheda
              </Link>
            </div>
          </>
        )}

        {step < 3 && (
          <p className="riv-footer">
            Già registrato?{' '}
            <Link href="/gestore/login">Accedi</Link>
          </p>
        )}
      </div>

      <style>{`
        .riv-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--color-gray-50);
          padding: var(--space-4);
        }
        .riv-card {
          background: white;
          border-radius: var(--radius-2xl);
          padding: var(--space-10);
          width: 100%;
          max-width: 480px;
          box-shadow: var(--shadow-lg);
        }
        .riv-logo {
          display: inline-flex; align-items: center; gap: var(--space-2);
          font-weight: 700; font-size: 1.125rem; color: var(--color-gray-900);
          text-decoration: none; margin-bottom: var(--space-8);
        }
        .riv-title { font-size: 1.5rem; margin-bottom: var(--space-2); }
        .riv-subtitle { color: var(--color-gray-500); font-size: 0.9375rem; margin-bottom: var(--space-8); line-height: 1.5; }
        .riv-form { display: flex; flex-direction: column; gap: var(--space-4); }
        .riv-label { font-size: 0.875rem; font-weight: 600; color: var(--color-gray-700); }
        .riv-input {
          padding: var(--space-3) var(--space-4);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
        }
        .riv-input:focus { outline: none; border-color: var(--color-green-500); box-shadow: 0 0 0 3px var(--color-green-100); }
        .riv-btn { justify-content: center; padding: var(--space-3); margin-top: var(--space-2); }
        .riv-success {
          background: var(--color-green-50);
          color: var(--color-green-700);
          padding: var(--space-4);
          border-radius: var(--radius-lg);
          font-size: 0.9375rem;
          margin-bottom: var(--space-6);
        }
        .riv-note { font-size: 0.8125rem; color: var(--color-gray-500); line-height: 1.6; margin-bottom: var(--space-6); }
        .riv-note a { color: var(--color-green-600); }
        .riv-actions { display: flex; gap: var(--space-4); margin-top: var(--space-6); }
        .riv-footer { margin-top: var(--space-6); text-align: center; font-size: 0.8125rem; color: var(--color-gray-500); }
        .riv-footer a { color: var(--color-green-600); font-weight: 600; text-decoration: none; }
      `}</style>
    </div>
  );
}
