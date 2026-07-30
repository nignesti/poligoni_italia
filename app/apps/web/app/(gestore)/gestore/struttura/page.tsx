'use client';

import { useState } from 'react';

export default function StrutturaPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div>
      <h1 className="gest-page-title">Scheda struttura</h1>
      <p className="gest-page-subtitle">TSN Milano — Dati anagrafici e descrizione</p>

      <form onSubmit={handleSave} className="str-form">
        <section className="gest-section">
          <h2>Informazioni di base</h2>
          <div className="str-grid">
            <div className="str-field">
              <label>Nome della struttura</label>
              <input className="str-input" defaultValue="TSN Milano — Sezione di tiro a segno" />
            </div>
            <div className="str-field">
              <label>Tipo</label>
              <select className="str-input" defaultValue="tsn">
                <option value="tsn">Sezione TSN</option>
                <option value="privato">Poligono Privato</option>
                <option value="tiro_a_volo">Tiro a Volo</option>
                <option value="dinamico">Tiro Dinamico</option>
              </select>
            </div>
            <div className="str-field">
              <label>Indirizzo</label>
              <input className="str-input" defaultValue="Viale dell'Arte, 12" />
            </div>
            <div className="str-field">
              <label>Città</label>
              <input className="str-input" defaultValue="Milano" />
            </div>
            <div className="str-field">
              <label>Provincia</label>
              <input className="str-input" defaultValue="Milano" />
            </div>
            <div className="str-field">
              <label>CAP</label>
              <input className="str-input" defaultValue="20149" />
            </div>
            <div className="str-field">
              <label>Telefono</label>
              <input className="str-input" defaultValue="+39 02 1234567" />
            </div>
            <div className="str-field">
              <label>Email</label>
              <input className="str-input" defaultValue="info@tsnmilano.it" />
            </div>
            <div className="str-field">
              <label>Sito web</label>
              <input className="str-input" defaultValue="https://tsnmilano.it" />
            </div>
          </div>
        </section>

        <section className="gest-section">
          <h2>Descrizione</h2>
          <textarea
            className="str-textarea"
            rows={5}
            defaultValue="Il Tiro a Segno Nazionale di Milano è una delle sezioni più storiche d'Italia, fondata nel 1888. Dispone di linee per tiro a segno da 10 m, 25 m e 50 m."
          />
        </section>

        <div className="str-footer">
          {saved && <span className="str-saved">✅ Modifiche salvate</span>}
          <button type="submit" className="btn btn-primary">
            Salva modifiche
          </button>
        </div>
      </form>

      <style>{`
        .str-form { display: flex; flex-direction: column; gap: var(--space-6); }
        .str-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-4); margin-top: var(--space-4); }
        .str-field { display: flex; flex-direction: column; gap: var(--space-1); }
        .str-field label { font-size: 0.8125rem; font-weight: 600; color: var(--color-gray-600); }
        .str-input {
          padding: var(--space-2) var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          background: white;
        }
        .str-input:focus { outline: none; border-color: var(--color-green-500); box-shadow: 0 0 0 3px var(--color-green-100); }
        .str-textarea {
          width: 100%;
          padding: var(--space-3);
          border: 1px solid var(--color-gray-300);
          border-radius: var(--radius-lg);
          font-size: 0.875rem;
          resize: vertical;
          margin-top: var(--space-4);
        }
        .str-textarea:focus { outline: none; border-color: var(--color-green-500); }
        .str-footer { display: flex; align-items: center; justify-content: flex-end; gap: var(--space-4); }
        .str-saved { font-size: 0.875rem; color: var(--color-green-600); font-weight: 600; }

        @media (max-width: 768px) {
          .str-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
