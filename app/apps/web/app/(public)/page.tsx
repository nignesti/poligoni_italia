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
import { IconBox } from '@/components/IconBox';
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
      <section className="border-b border-hairline bg-gradient-to-br from-[var(--surface-dark-from)] to-[var(--surface-dark-to)]">
        <Container className="py-20 text-center md:py-28">
          <span className="inline-block rounded-full border border-accent/30 bg-accent-wash px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent">
            Il portale dei tiratori sportivi in Italia
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink md:text-6xl">
            Trova un poligono, richiedi la tua linea{' '}
            <span className="box-decoration-clone bg-accent px-2 text-accent-ink">
              senza telefonare
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            Orari, calibri e disponibilità aggiornati. Confronta le strutture vicino a te e
            invia una richiesta di prenotazione in pochi minuti.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/cerca"
              className="rounded-control bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover"
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
            <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
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
                <IconBox icon={feature.icon} />
                <h3 className="mt-4 text-lg font-bold uppercase tracking-tight text-ink">
                  {feature.title}
                </h3>
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
            <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
              Come funziona
            </h2>
            <p className="mt-3 text-ink-muted">
              Tre passaggi, senza dover chiamare per sapere se c&apos;è una linea libera.
            </p>
          </div>

          <ol className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <li key={step.title} className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold text-accent-ink">
                  {i + 1}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <step.icon size={18} className="text-accent" aria-hidden />
                    <h3 className="font-bold uppercase tracking-tight text-ink">{step.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">{step.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      {/* Regioni */}
      <section className="border-t border-hairline py-20">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
                Poligoni per regione
              </h2>
              <p className="mt-3 text-ink-muted">Esplora le strutture disponibili nella tua zona.</p>
            </div>
            <Link
              href="/poligoni"
              className="text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover"
            >
              Vedi tutte →
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            {regions.map((region) => (
              <Link
                key={region.slug}
                href={`/poligoni/${region.slug}`}
                className="flex items-center gap-2.5 rounded-control border border-hairline bg-surface py-2.5 pl-4 pr-2.5 transition-colors hover:border-accent"
              >
                <span className="text-sm font-semibold text-ink">{region.name}</span>
                <span className="rounded-full bg-accent-wash px-2 py-0.5 font-mono text-xs font-bold text-accent">
                  {region.count}
                </span>
              </Link>
            ))}
          </div>

          <p className="mt-8 text-sm text-ink-muted">
            Copertura in crescita: gestisci un poligono in una regione con poche strutture?{' '}
            <Link href="/gestori" className="font-medium text-accent hover:text-accent-hover">
              Sii il primo a comparire qui
            </Link>
            .
          </p>
        </Container>
      </section>

      {/* App mobile */}
      <section className="border-t border-hairline py-20">
        <Container>
          <div className="rounded-panel bg-accent px-8 py-12 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-accent-ink md:text-3xl">
              Porta i poligoni in tasca
            </h2>
            <p className="mx-auto mt-3 max-w-md text-accent-ink/85">
              L&apos;app mobile è in arrivo. A breve sugli store — nel frattempo puoi già
              provarla in anteprima in versione webapp.
            </p>
            <a
              href="https://poligoni-app.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-control bg-accent-ink px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent hover:bg-white"
            >
              Provala in anteprima in versione webapp
            </a>
          </div>
        </Container>
      </section>

      {/* CTA gestori */}
      <section className="bg-surface-sunken py-20">
        <Container>
          <div className="rounded-panel bg-gradient-to-br from-[var(--surface-dark-from)] to-[var(--surface-dark-to)] px-8 py-14 text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
              Gestisci un poligono?
            </h2>
            <p className="mx-auto mt-3 max-w-md text-ink-muted">
              Porta la tua struttura online in pochi minuti. Gestisci orari, prezzi e prenotazioni
              da un’unica dashboard.
            </p>
            <Link
              href="/gestori"
              className="mt-7 inline-block rounded-control bg-accent px-6 py-3 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover"
            >
              Aggiungi la tua struttura
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}
