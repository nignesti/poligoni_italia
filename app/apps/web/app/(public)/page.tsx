import Link from 'next/link';
import {
  MapPin,
  CalendarCheck,
  NotePencil,
  Scales,
  MagnifyingGlass,
  ListChecks,
  PaperPlaneTilt,
} from '@phosphor-icons/react/ssr';
import { Container } from '@/components/Container';
import { regionCounts } from '@/lib/ranges';

// ---------------------------------------------------------------------------
// Homepage - statica, ottimizzata per SEO. Header e footer arrivano dal
// layout condiviso di questo route group (Piano_Sviluppo_App.md §7.1).
// ---------------------------------------------------------------------------

const STEPS = [
  {
    title: 'Cerca',
    description: 'Filtra per posizione, tipo di struttura e disciplina.',
    icon: MagnifyingGlass,
  },
  {
    title: 'Confronta',
    description: 'Guarda orari, linee disponibili e listino sulla scheda struttura.',
    icon: ListChecks,
  },
  {
    title: 'Richiedi la linea',
    description: 'Invia la richiesta al gestore senza dover telefonare.',
    icon: PaperPlaneTilt,
  },
];

const FEATURES = [
  {
    title: 'Trova il poligono giusto',
    description:
      'Cerca per posizione, calibro, disciplina o tipo di struttura. Filtra per orari e servizi.',
    icon: MapPin,
  },
  {
    title: 'Richiedi la tua linea',
    description: 'Confronta orari e disponibilità e invia una richiesta senza telefonare.',
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

export default async function HomePage() {
  const regions = await regionCounts();

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[var(--surface-dark-from)] to-[var(--surface-dark-to)]">
        <Container className="py-20 text-center md:py-24">
          <h1 className="mx-auto max-w-2xl text-4xl font-extrabold tracking-tight leading-tight text-white md:text-5xl">
            Trova un poligono, richiedi la tua linea{' '}
            <span className="box-decoration-clone rounded-lg bg-accent px-2 text-accent-ink">
              senza telefonare
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-white/80">
            Orari, calibri e disponibilità aggiornati. Confronta le strutture vicino a te e
            invia una richiesta di prenotazione in pochi minuti.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cerca"
              className="rounded-control bg-accent px-6 py-3 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
            >
              Cerca un poligono
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

      {/* Come funziona */}
      <section className="py-20">
        <Container className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-3xl font-semibold text-ink">Come funziona</h2>
            <p className="mt-3 text-ink-muted">
              Tre passaggi, senza dover chiamare per sapere se c&apos;è una linea libera.
            </p>
          </div>

          <ol className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent-wash text-sm font-semibold text-accent">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon size={18} className="text-accent" aria-hidden />
                    <h3 className="font-semibold text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
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

          <p className="mt-8 text-center text-sm text-ink-muted">
            Copertura in crescita: gestisci un poligono in una regione con poche strutture?{' '}
            <Link href="/gestori" className="font-medium text-accent hover:text-accent-hover">
              Sii il primo a comparire qui
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* CTA gestori */}
      <section className="bg-surface-sunken py-20">
        <Container>
          <div className="rounded-panel bg-gradient-to-br from-[var(--surface-dark-from)] to-[var(--surface-dark-to)] px-8 py-14 text-center">
            <h2 className="text-3xl font-semibold text-white">Gestisci un poligono?</h2>
            <p className="mx-auto mt-3 max-w-md text-white/80">
              Porta la tua struttura online in pochi minuti. Gestisci orari, prezzi e prenotazioni
              da un’unica dashboard.
            </p>
            <Link
              href="/gestori"
              className="mt-7 inline-block rounded-control bg-accent px-6 py-3 text-sm font-semibold text-accent-ink hover:bg-accent-hover"
            >
              Aggiungi la tua struttura
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
