import Link from 'next/link';
import { MapPin, CalendarCheck, NotePencil, Scales } from '@phosphor-icons/react/ssr';
import { Container } from '@/components/Container';
import { regionCounts } from '@/lib/fixtures';

// ---------------------------------------------------------------------------
// Homepage - statica, ottimizzata per SEO. Header e footer arrivano dal
// layout condiviso di questo route group (Piano_Sviluppo_App.md §7.1).
// ---------------------------------------------------------------------------

const FEATURES = [
  {
    title: 'Trova il poligono giusto',
    description:
      'Cerca per posizione, calibro, disciplina o tipo di struttura. Filtra per orari e servizi.',
    icon: MapPin,
  },
  {
    title: 'Prenota la tua linea',
    description: 'Vedi la disponibilità reale e prenota lo slot senza telefonare.',
    icon: CalendarCheck,
  },
  {
    title: 'Tieni traccia dei tuoi tiri',
    description: 'Registra le sessioni, analizza il gruppo e monitora le scadenze dei documenti.',
    icon: NotePencil,
  },
  {
    title: 'Rispetta i limiti di legge',
    description: 'Calcola la tua dotazione di munizioni rispetto ai limiti dell’art. 97 TULPS.',
    icon: Scales,
  },
];

export default function HomePage() {
  const regions = regionCounts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#0d3b0d] to-[#1b5e20]">
        <Container className="py-20 text-center md:py-24">
          <h1 className="mx-auto max-w-2xl text-4xl font-bold leading-tight text-white md:text-5xl">
            Trova un poligono, prenota senza telefonare
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/80">
            Orari, calibri e disponibilità aggiornati. Confronta le strutture vicino a te e
            prenota la tua linea in pochi minuti.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cerca"
              className="rounded-control bg-white px-6 py-3 text-sm font-semibold text-[#1b5e20] hover:bg-white/90"
            >
              Cerca un poligono
            </Link>
            <Link
              href="/gestori"
              className="rounded-control border border-white/40 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10"
            >
              Aggiungi la tua struttura
            </Link>
          </div>
        </Container>
      </section>

      {/* Funzionalità */}
      <section className="bg-surface-sunken py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-semibold text-ink">
              Tutto ciò che serve al tiratore sportivo
            </h2>
            <p className="mt-3 text-ink-muted">
              Una piattaforma pensata per chi frequenta i poligoni, dai principianti ai tiratori
              esperti.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <article
                key={feature.title}
                className="rounded-panel border border-hairline bg-surface p-8 shadow-panel"
              >
                <feature.icon size={28} weight="regular" className="text-accent" aria-hidden />
                <h3 className="mt-4 text-lg font-semibold text-ink">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-muted">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </section>

      {/* Regioni */}
      <section className="py-20">
        <Container>
          <h2 className="text-center text-3xl font-semibold text-ink">Poligoni per regione</h2>
          <p className="mt-3 text-center text-ink-muted">
            Esplora le strutture disponibili nella tua zona.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/poligoni/${region.slug}`}
                className="flex items-center justify-between rounded-control border border-hairline bg-surface-sunken px-5 py-4 hover:border-accent hover:bg-accent-wash"
              >
                <span className="font-medium text-ink">{region.name}</span>
                <span className="text-sm text-ink-muted">{region.count}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA gestori */}
      <section className="bg-surface-sunken py-20">
        <Container>
          <div className="rounded-panel bg-gradient-to-br from-[#145214] to-[#1b5e20] px-8 py-14 text-center">
            <h2 className="text-3xl font-semibold text-white">Gestisci un poligono?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Porta la tua struttura online in pochi minuti. Gestisci orari, prezzi e prenotazioni
              da un’unica dashboard.
            </p>
            <Link
              href="/gestori"
              className="mt-7 inline-block rounded-control bg-white px-6 py-3 text-sm font-semibold text-[#1b5e20] hover:bg-white/90"
            >
              Aggiungi la tua struttura
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
