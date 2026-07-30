import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Sei un gestore? — Porta il tuo poligono online',
  description:
    'Dashboard gratuita per gestire orari, prezzi e prenotazioni del tuo poligono. Arrivano nuove richieste ogni giorno.',
  keywords: ['gestore poligono', 'prenotazioni poligono', 'software gestione poligono', 'B2B poligoni'],
};

const BENEFITS = [
  {
    title: 'Dashboard gratuita',
    description: 'Gestisci orari, prezzi, servizi e chiusure da un\'unica interfaccia. Nessun costo di attivazione.',
    icon: '📊',
  },
  {
    title: 'Nuove richieste ogni giorno',
    description: 'I tiratori ti trovano su Google grazie alle pagine SEO. Ricevi richieste di disponibilità senza fare nulla.',
    icon: '📈',
  },
  {
    title: 'Prenotazione telefonica integrata',
    description: 'Inserisci tu le prenotazioni ricevute al telefono: passano dallo stesso sistema e non si sovrappongono.',
    icon: '📞',
  },
  {
    title: 'Check-in digitale',
    description: 'QR code per il check-in dei tiratori. Addio foglietti e registri cartacei.',
    icon: '✅',
  },
  {
    title: 'Esportazione CSV/iCal',
    description: 'Esporta il calendario prenotazioni in formato compatibile con i tuoi sistemi esistenti.',
    icon: '📥',
  },
  {
    title: 'Nessun vincolo di esclusiva',
    description: 'Continua a usare il tuo gestionale attuale. Poligoni Italia si affianca, non sostituisce.',
    icon: '🤝',
  },
];

const PLANS = [
  {
    name: 'Base',
    price: 'Gratuito',
    period: '',
    features: [
      'Scheda struttura pubblica',
      'Gestione orari e chiusure',
      'Richieste di disponibilità',
      'Fino a 3 linee',
    ],
    highlighted: false,
  },
  {
    name: 'Partner',
    price: 'Da 19 €',
    period: '/mese',
    features: [
      'Tutto del piano Base',
      'Prenotazione online reale',
      'Linee illimitate',
      'Check-in QR',
      'Esportazione CSV/iCal',
      'Nessuna commissione',
    ],
    highlighted: true,
  },
  {
    name: 'Premium',
    price: 'Da 49 €',
    period: '/mese',
    features: [
      'Tutto del piano Partner',
      'Integrazione gestionale',
      'Statistiche di occupazione',
      'API dedicate',
      'Priorità di supporto',
    ],
    highlighted: false,
  },
];

export default function GestoriPage() {
  return (
    <>
      {/* Hero */}
      <header className="gest-hero">
        <nav className="container gest-nav">
          <Link href="/" className="logo">
            <span className="logo-icon">🎯</span>
            <span className="logo-text">Poligoni Italia</span>
          </Link>
          <Link href="/cerca" className="nav-link">Trova poligoni</Link>
        </nav>
        <div className="container gest-hero-content">
          <h1 className="gest-hero-title">
            Porta il tuo poligono <span className="gest-highlight">online</span>
          </h1>
          <p className="gest-hero-subtitle">
            La dashboard gratuita per gestire orari, prezzi e prenotazioni.
            Nuovi tiratori ti trovano ogni giorno su Google.
          </p>
          <a href="#piani" className="btn btn-primary btn-large">
            Vedi i piani
          </a>
        </div>
      </header>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">Perché aggiungere la tua struttura</h2>
          <p className="section-subtitle">
            Tutto ciò che serve per far decollare le prenotazioni.
          </p>
          <div className="benefits-grid">
            {BENEFITS.map((b) => (
              <div key={b.title} className="benefit-card">
                <span className="benefit-icon">{b.icon}</span>
                <h3 className="benefit-title">{b.title}</h3>
                <p className="benefit-desc">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans */}
      <section id="piani" className="section plans-section">
        <div className="container">
          <h2 className="section-title">Piani e prezzi</h2>
          <p className="section-subtitle">
            Scegli il piano adatto al tuo poligono. Nessun costo di attivazione,
            nessun vincolo.
          </p>
          <div className="plans-grid">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`plan-card${plan.highlighted ? ' highlighted' : ''}`}
              >
                {plan.highlighted && <span className="plan-badge">Consigliato</span>}
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-price">
                  <span className="plan-amount">{plan.price}</span>
                  <span className="plan-period">{plan.period}</span>
                </p>
                <ul className="plan-features">
                  {plan.features.map((f) => (
                    <li key={f} className="plan-feature">
                      ✅ {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:info@poligoniitalia.it"
                  className={`btn ${plan.highlighted ? 'btn-primary' : 'btn-secondary'}`}
                >
                  {plan.highlighted ? 'Inizia ora' : 'Contattaci'}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section gest-cta">
        <div className="container">
          <div className="gest-cta-card">
            <h2 className="gest-cta-title">Hai domande?</h2>
            <p className="gest-cta-text">
              Scrivici a <a href="mailto:info@poligoniitalia.it">info@poligoniitalia.it</a>.
              Ti rispondiamo entro 24 ore.
            </p>
          </div>
        </div>
      </section>

      <style>{`
        .gest-hero {
          background: linear-gradient(135deg, #0d3b0d 0%, #1b5e20 100%);
          color: white;
          padding-bottom: var(--space-16);
        }
        .gest-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding-top: var(--space-6);
          padding-bottom: var(--space-6);
        }
        .gest-nav .logo { color: white; }
        .gest-nav .nav-link { color: var(--color-green-100); font-weight: 500; font-size: 0.875rem; }
        .gest-hero-content { text-align: center; padding-top: var(--space-16); }
        .gest-hero-title {
          font-size: 2.75rem;
          font-weight: 700;
          color: white;
          margin-bottom: var(--space-6);
          line-height: 1.15;
        }
        .gest-highlight { color: #85c485; }
        .gest-hero-subtitle {
          font-size: 1.25rem;
          color: #a8c7a8;
          max-width: 550px;
          margin: 0 auto var(--space-8);
          line-height: 1.6;
        }

        .benefits-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-6);
        }
        .benefit-card {
          padding: var(--space-8);
          background: white;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-md);
          border: 1px solid var(--color-gray-100);
        }
        .benefit-icon { font-size: 2rem; display: block; margin-bottom: var(--space-4); }
        .benefit-title { font-size: 1.125rem; margin-bottom: var(--space-2); }
        .benefit-desc { color: var(--color-gray-600); font-size: 0.9375rem; line-height: 1.6; }

        .plans-section { background: var(--color-gray-50); }
        .plans-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-6);
          align-items: start;
        }
        .plan-card {
          background: white;
          border-radius: var(--radius-xl);
          padding: var(--space-8);
          border: 1px solid var(--color-gray-200);
          position: relative;
          display: flex;
          flex-direction: column;
          gap: var(--space-6);
        }
        .plan-card.highlighted {
          border-color: var(--color-green-500);
          box-shadow: var(--shadow-lg);
          transform: scale(1.03);
        }
        .plan-badge {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: var(--color-green-600);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: var(--space-1) var(--space-4);
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        .plan-name { font-size: 1.25rem; }
        .plan-price { margin: 0; }
        .plan-amount { font-size: 2rem; font-weight: 700; }
        .plan-period { font-size: 0.875rem; color: var(--color-gray-500); }
        .plan-features { list-style: none; display: flex; flex-direction: column; gap: var(--space-3); }
        .plan-feature { font-size: 0.875rem; color: var(--color-gray-600); }
        .plan-card .btn { margin-top: auto; }

        .gest-cta-card {
          text-align: center;
          padding: var(--space-12);
          background: var(--color-gray-50);
          border-radius: var(--radius-2xl);
          border: 1px solid var(--color-gray-200);
        }
        .gest-cta-title { font-size: 1.75rem; margin-bottom: var(--space-4); }
        .gest-cta-text { font-size: 1.125rem; color: var(--color-gray-600); }
        .gest-cta-text a { color: var(--color-green-600); font-weight: 600; }
        .gest-cta-text a:hover { text-decoration: underline; }

        @media (max-width: 768px) {
          .gest-hero-title { font-size: 1.75rem; }
          .gest-hero-subtitle { font-size: 1rem; }
          .plan-card.highlighted { transform: none; }
        }
      `}</style>
    </>
  );
}
