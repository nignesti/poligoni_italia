import type { Metadata } from 'next';
import Link from 'next/link';
import {
  ChartBar,
  TrendUp,
  Phone,
  CheckCircle,
  DownloadSimple,
  Handshake,
  Check,
} from '@phosphor-icons/react/ssr';
import { Container } from '@/components/Container';

export const metadata: Metadata = {
  title: 'Sei un gestore? Porta il tuo poligono online',
  description:
    'Dashboard gratuita per gestire orari, prezzi e prenotazioni del tuo poligono. Arrivano nuove richieste ogni giorno.',
  keywords: ['gestore poligono', 'prenotazioni poligono', 'software gestione poligono', 'B2B poligoni'],
};

const BENEFITS = [
  {
    title: 'Dashboard gratuita',
    description: 'Gestisci orari, prezzi, servizi e chiusure da un’unica interfaccia.',
    icon: ChartBar,
  },
  {
    title: 'Nuove richieste ogni giorno',
    description: 'I tiratori ti trovano su Google grazie alle pagine SEO, senza fare nulla.',
    icon: TrendUp,
  },
  {
    title: 'Prenotazione telefonica integrata',
    description: 'Inserisci le prenotazioni ricevute al telefono: non si sovrappongono.',
    icon: Phone,
  },
  {
    title: 'Check-in digitale',
    description: 'QR code per il check-in dei tiratori, addio foglietti e registri cartacei.',
    icon: CheckCircle,
  },
  {
    title: 'Esportazione CSV/iCal',
    description: 'Esporta il calendario prenotazioni in formato compatibile con i tuoi sistemi.',
    icon: DownloadSimple,
  },
  {
    title: 'Nessun vincolo di esclusiva',
    description: 'Continua a usare il tuo gestionale: Poligoni Italia si affianca, non sostituisce.',
    icon: Handshake,
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
      <section className="bg-gradient-to-br from-[#0d3b0d] to-[#1b5e20]">
        <Container className="py-20 text-center">
          <h1 className="mx-auto max-w-xl text-4xl font-bold leading-tight text-white">
            Porta il tuo poligono online
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/80">
            La dashboard gratuita per gestire orari, prezzi e prenotazioni. Nuovi tiratori ti
            trovano ogni giorno su Google.
          </p>
          <a
            href="#piani"
            className="mt-8 inline-block rounded-control bg-white px-6 py-3 text-sm font-semibold text-[#1b5e20] hover:bg-white/90"
          >
            Vedi i piani
          </a>
        </Container>
      </section>

      {/* Benefici */}
      <section className="py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold text-ink">
              Perché aggiungere la tua struttura
            </h2>
            <p className="mt-3 text-ink-muted">
              Tutto ciò che serve per far decollare le prenotazioni.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BENEFITS.map((b) => (
              <div key={b.title} className="rounded-panel border border-hairline bg-surface p-8 shadow-panel">
                <b.icon size={26} className="text-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-ink">{b.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">{b.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Piani */}
      <section id="piani" className="bg-surface-sunken py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold text-ink">Piani e prezzi</h2>
            <p className="mt-3 text-ink-muted">
              Scegli il piano adatto al tuo poligono. Nessun costo di attivazione.
            </p>
          </div>

          <div className="mt-12 grid items-start gap-6 lg:grid-cols-3">
            {PLANS.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col gap-6 rounded-panel border bg-surface p-8 ${
                  plan.highlighted
                    ? 'border-accent shadow-panel lg:-translate-y-2'
                    : 'border-hairline'
                }`}
              >
                {plan.highlighted && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-semibold uppercase tracking-wide text-accent-ink">
                    Consigliato
                  </span>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-ink">{plan.name}</h3>
                  <p className="mt-1">
                    <span className="text-3xl font-bold text-ink">{plan.price}</span>
                    <span className="text-sm text-ink-muted">{plan.period}</span>
                  </p>
                </div>
                <ul className="flex flex-col gap-2.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                      <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                      {f}
                    </li>
                  ))}
                </ul>
                <a
                  href="mailto:info@poligoniitalia.it"
                  className={`mt-auto rounded-control px-5 py-2.5 text-center text-sm font-semibold ${
                    plan.highlighted
                      ? 'bg-accent text-accent-ink hover:bg-accent-hover'
                      : 'border border-hairline-strong text-ink hover:border-accent hover:text-accent'
                  }`}
                >
                  {plan.highlighted ? 'Inizia ora' : 'Contattaci'}
                </a>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA finale */}
      <section className="py-20">
        <Container>
          <div className="rounded-panel border border-hairline bg-surface-sunken px-8 py-12 text-center">
            <h2 className="text-2xl font-semibold text-ink">Hai domande?</h2>
            <p className="mt-3 text-ink-muted">
              Scrivici a{' '}
              <a href="mailto:info@poligoniitalia.it" className="font-medium text-accent hover:text-accent-hover">
                info@poligoniitalia.it
              </a>
              . Ti rispondiamo entro 24 ore.
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
