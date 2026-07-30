import Link from 'next/link';

// ---------------------------------------------------------------------------
// Homepage — statica, ottimizzata per SEO
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    title: 'Trova il poligono giusto',
    description:
      'Cerca per posizione, calibro, disciplina o tipo di struttura. Filtra per orari di apertura e servizi disponibili.',
    icon: '📍',
  },
  {
    title: 'Prenota la tua linea',
    description:
      'Vedi la disponibilità in tempo reale e prenota il tuo slot senza telefonare. Pagamento online sicuro.',
    icon: '📅',
  },
  {
    title: 'Tieni traccia dei tuoi tiri',
    description:
      'Registra le sessioni, analizza le statistiche del gruppo e monitora le scadenze dei documenti.',
    icon: '🎯',
  },
  {
    title: 'Rispetta i limiti di legge',
    description:
      'Calcola la tua dotazione di munizioni rispetto ai limiti dell\'art. 97 TULPS e ricevi avvisi prima delle scadenze.',
    icon: '⚖️',
  },
];

const REGIONS = [
  { name: 'Lombardia', count: 45 },
  { name: 'Veneto', count: 38 },
  { name: 'Emilia-Romagna', count: 32 },
  { name: 'Toscana', count: 28 },
  { name: 'Piemonte', count: 26 },
  { name: 'Lazio', count: 24 },
  { name: 'Campania', count: 18 },
  { name: 'Sicilia', count: 22 },
];

export default function HomePage() {
  return (
    <>
      {/* ------------------------------------------------------------------ */}
      {/* Hero Section                                                       */}
      {/* ------------------------------------------------------------------ */}
      <header className="hero">
        <nav className="container hero-nav">
          <Link href="/" className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Poligoni Italia</span>
          </Link>
          <div className="nav-links">
            <Link href="/cerca" className="nav-link">
              Cerca
            </Link>
            <Link href="/gestori" className="nav-link">
              Sei un gestore?
            </Link>
          </div>
        </nav>

        <div className="container hero-content">
          <h1 className="hero-title">
            Il poligono giusto,
            <br />
            <span className="hero-highlight">a un click di distanza</span>
          </h1>
          <p className="hero-subtitle">
            Trova, confronta e prenota linee di tiro in tutta Italia.
            Oltre 300 poligoni censiti, orari e disponibilità aggiornati.
          </p>
          <div className="hero-actions">
            <Link href="/cerca" className="btn btn-primary btn-large">
              Trova un poligono
            </Link>
            <Link href="/gestori" className="btn btn-secondary btn-large">
              Aggiungi la tua struttura
            </Link>
          </div>
        </div>

        {/* Statistiche rapide */}
        <div className="container hero-stats">
          <div className="stat">
            <span className="stat-value">370+</span>
            <span className="stat-label">Poligoni censiti</span>
          </div>
          <div className="stat">
            <span className="stat-value">20</span>
            <span className="stat-label">Regioni coperte</span>
          </div>
          <div className="stat">
            <span className="stat-value">100%</span>
            <span className="stat-label">Gratuito per i tiratori</span>
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* Funzionalità                                                      */}
      {/* ------------------------------------------------------------------ */}
      <section className="section features">
        <div className="container">
          <h2 className="section-title">
            Tutto ciò che serve al tiratore sportivo
          </h2>
          <p className="section-subtitle">
            Una piattaforma pensata per chi frequenta i poligoni,
            dai principianti ai tiratori esperti.
          </p>
          <div className="features-grid">
            {FEATURES.map((feature) => (
              <article key={feature.title} className="feature-card">
                <span className="feature-icon">{feature.icon}</span>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Regioni                                                           */}
      {/* ------------------------------------------------------------------ */}
      <section className="section regions">
        <div className="container">
          <h2 className="section-title">Poligoni per regione</h2>
          <p className="section-subtitle">
            Esplora le strutture disponibili nella tua zona.
          </p>
          <div className="regions-grid">
            {REGIONS.map((region) => (
              <Link
                key={region.name}
                href={`/poligoni/${region.name.toLowerCase()}`}
                className="region-card"
              >
                <span className="region-name">{region.name}</span>
                <span className="region-count">{region.count} poligoni</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* CTA gestori                                                        */}
      {/* ------------------------------------------------------------------ */}
      <section className="section cta-gestori">
        <div className="container">
          <div className="cta-card">
            <h2 className="cta-title">Gestisci un poligono?</h2>
            <p className="cta-text">
              Porta la tua struttura online in pochi minuti. Gestisci orari,
              prezzi e prenotazioni da un&apos;unica dashboard. Arrivano nuove richieste
              ogni giorno.
            </p>
            <Link href="/gestori" className="btn btn-primary btn-large">
              Scopri di più
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* Footer                                                            */}
      {/* ------------------------------------------------------------------ */}
      <footer className="footer">
        <div className="container footer-content">
          <div className="footer-main">
            <Link href="/" className="logo">
              <span className="logo-icon">🎯</span>
              <span className="logo-text">Poligoni Italia</span>
            </Link>
            <p className="footer-tagline">
              Trova e prenota poligoni di tiro sportivo in Italia.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Esplora</h4>
              <Link href="/cerca">Cerca poligoni</Link>
              <Link href="/poligoni">Tutte le regioni</Link>
              <Link href="/guide">Guide e risorse</Link>
            </div>
            <div className="footer-col">
              <h4>Per i gestori</h4>
              <Link href="/gestori">Dashboard gestori</Link>
              <Link href="/gestori#pricing">Piani e prezzi</Link>
            </div>
            <div className="footer-col">
              <h4>Legale</h4>
              <Link href="/privacy">Privacy</Link>
              <Link href="/termini">Termini di servizio</Link>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Poligoni Italia. Tutti i diritti riservati.</p>
          </div>
        </div>
      </footer>

      {/* ------------------------------------------------------------------ */}
      {/* Stili                                                              */}
      {/* ------------------------------------------------------------------ */}
      <style>{`
        /* Hero */
        .hero {
          background: linear-gradient(135deg, #0d3b0d 0%, #1b5e20 50%, #2e7d32 100%);
          color: white;
          padding-bottom: var(--space-16);
        }
        .hero-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-6);
          padding-bottom: var(--space-6);
        }
        .logo {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          font-weight: 700;
          font-size: 1.25rem;
        }
        .logo-icon { font-size: 1.5rem; }
        .nav-links { display: flex; gap: var(--space-6); }
        .nav-link {
          color: var(--color-green-100);
          font-weight: 500;
          font-size: 0.875rem;
          transition: color 0.15s;
        }
        .nav-link:hover { color: white; }
        .hero-content {
          padding-top: var(--space-20);
          padding-bottom: var(--space-12);
          text-align: center;
        }
        .hero-title {
          font-size: 3rem;
          font-weight: 700;
          line-height: 1.15;
          margin-bottom: var(--space-6);
          color: white;
        }
        .hero-highlight {
          color: #85c485;
        }
        .hero-subtitle {
          font-size: 1.25rem;
          color: #a8c7a8;
          max-width: 600px;
          margin: 0 auto var(--space-10);
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: var(--space-4);
          justify-content: center;
          flex-wrap: wrap;
        }
        .btn-large {
          padding: var(--space-4) var(--space-8);
          font-size: 1rem;
        }
        .hero .btn-secondary {
          border-color: white;
          color: white;
        }
        .hero .btn-secondary:hover {
          background-color: rgba(255,255,255,0.1);
        }
        .hero-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: var(--space-8);
          padding-top: var(--space-12);
          border-top: 1px solid rgba(255,255,255,0.15);
          margin-top: var(--space-8);
        }
        .stat {
          text-align: center;
        }
        .stat-value {
          display: block;
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: var(--space-1);
        }
        .stat-label {
          font-size: 0.875rem;
          color: var(--color-green-200);
        }

        /* Section */
        .section {
          padding: var(--space-20) 0;
        }
        .section-title {
          font-size: 2rem;
          text-align: center;
          margin-bottom: var(--space-4);
        }
        .section-subtitle {
          text-align: center;
          color: var(--color-gray-500);
          font-size: 1.125rem;
          max-width: 550px;
          margin: 0 auto var(--space-12);
        }

        /* Features */
        .features { background: var(--color-gray-50); }
        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: var(--space-6);
        }
        .feature-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          box-shadow: var(--shadow-md);
          transition: transform 0.2s, box-shadow 0.2s;
        }
        .feature-card:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }
        .feature-icon { font-size: 2rem; display: block; margin-bottom: var(--space-4); }
        .feature-title { font-size: 1.125rem; margin-bottom: var(--space-2); }
        .feature-description { color: var(--color-gray-600); font-size: 0.9375rem; line-height: 1.6; }

        /* Regions */
        .regions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: var(--space-4);
        }
        .region-card {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-4) var(--space-6);
          background: var(--color-gray-50);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-gray-200);
          transition: border-color 0.15s, background 0.15s;
        }
        .region-card:hover {
          border-color: var(--color-green-400);
          background: var(--color-green-50);
        }
        .region-name { font-weight: 600; color: var(--color-gray-800); }
        .region-count { font-size: 0.875rem; color: var(--color-gray-500); }

        /* CTA gestori */
        .cta-gestori { background: var(--color-gray-50); }
        .cta-card {
          background: linear-gradient(135deg, #145214 0%, #2e7d32 100%);
          border-radius: var(--radius-2xl);
          padding: var(--space-16) var(--space-8);
          text-align: center;
          color: white;
        }
        .cta-title {
          font-size: 2rem;
          color: white;
          margin-bottom: var(--space-4);
        }
        .cta-text {
          font-size: 1.125rem;
          color: #a8c7a8;
          max-width: 550px;
          margin: 0 auto var(--space-8);
          line-height: 1.6;
        }

        /* Footer */
        .footer {
          background: var(--color-gray-900);
          color: var(--color-gray-300);
          padding: var(--space-16) 0 var(--space-8);
        }
        .footer .logo {
          color: white;
          margin-bottom: var(--space-4);
        }
        .footer-content {
          display: flex;
          flex-direction: column;
          gap: var(--space-12);
        }
        .footer-main { max-width: 300px; }
        .footer-tagline { font-size: 0.875rem; line-height: 1.6; }
        .footer-links {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
          gap: var(--space-8);
        }
        .footer-col h4 {
          color: white;
          font-size: 0.875rem;
          margin-bottom: var(--space-4);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .footer-col a {
          display: block;
          font-size: 0.875rem;
          color: var(--color-gray-400);
          margin-bottom: var(--space-2);
          transition: color 0.15s;
        }
        .footer-col a:hover { color: white; }
        .footer-bottom {
          padding-top: var(--space-8);
          border-top: 1px solid var(--color-gray-700);
          font-size: 0.8125rem;
          color: var(--color-gray-500);
        }

        /* Responsive */
        @media (max-width: 768px) {
          .hero-title { font-size: 2rem; }
          .hero-subtitle { font-size: 1rem; }
          .hero-stats { grid-template-columns: 1fr; gap: var(--space-6); }
          .hero-nav .nav-links { display: none; }
          .hero-actions { flex-direction: column; align-items: center; }
          .section-title { font-size: 1.5rem; }
          .cta-card { padding: var(--space-10) var(--space-4); }
          .cta-title { font-size: 1.5rem; }
        }
      `}</style>
    </>
  );
}
