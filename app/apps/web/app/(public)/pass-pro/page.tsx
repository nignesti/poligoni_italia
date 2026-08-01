import type { Metadata } from 'next';
import {
  Target,
  ChartLineUp,
  FilePdf,
  ClockCounterClockwise,
  CloudArrowUp,
  Check,
} from '@phosphor-icons/react/ssr';
import { Container } from '@/components/Container';
import { IconBox } from '@/components/IconBox';
import { formatPrice } from '@/lib/format';
import {
  FREE_TIER_LIMITS,
  PASS_PRO_ANNUAL_PRICE_CENTS,
  PASS_PRO_MONTHLY_PRICE_CENTS,
  PREMIUM_FEATURES,
  type PremiumFeature,
} from '@poligoni/core/premium';

export const metadata: Metadata = {
  title: 'Pass Pro — sblocca il diario di tiro completo',
  description:
    'Bersagli illimitati, statistiche avanzate e libretto GPG esportabile. Il piano gratuito resta sempre disponibile per iniziare.',
  keywords: ['pass pro', 'diario di tiro', 'statistiche di tiro', 'libretto GPG'],
};

const FEATURE_ICON: Record<PremiumFeature, typeof Target> = {
  bersagli_illimitati: Target,
  statistiche_avanzate: ChartLineUp,
  libretto_gpg_export: FilePdf,
  storico_illimitato: ClockCounterClockwise,
  backup_cloud: CloudArrowUp,
};

const FREE_INCLUDED = [
  `Fino a ${FREE_TIER_LIMITS.maxFirearms} armi in rubrica`,
  `${FREE_TIER_LIMITS.maxTargetsPerMonth} bersagli marcati al mese`,
  `Storico sessioni degli ultimi ${FREE_TIER_LIMITS.sessionHistoryDays} giorni`,
  'Contatore munizioni e limiti di legge',
];

export default function PassProPage() {
  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline bg-gradient-to-br from-[var(--surface-dark-from)] to-[var(--surface-dark-to)]">
        <Container className="py-20 text-center">
          <h1 className="mx-auto max-w-2xl text-4xl font-black uppercase leading-[0.98] tracking-tight text-ink md:text-5xl">
            Il tuo diario di tiro, senza limiti
          </h1>
          <p className="mx-auto mt-6 max-w-md text-lg leading-relaxed text-ink-muted">
            Il piano gratuito basta per iniziare. Pass Pro toglie i limiti quando il diario
            diventa un&apos;abitudine.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#piani"
              className="rounded-control bg-accent px-7 py-3.5 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover"
            >
              Vedi i piani
            </a>
          </div>
        </Container>
      </section>

      {/* Funzionalità Pass Pro */}
      <section className="bg-surface-sunken py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
              Cosa sblocca Pass Pro
            </h2>
            <p className="mt-3 text-ink-muted">
              Tutto ciò che serve a un tiratore che si allena con costanza.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {PREMIUM_FEATURES.map((f) => {
              const Icon = FEATURE_ICON[f.feature];
              return (
                <div key={f.feature} className="rounded-panel border border-hairline bg-surface p-8 shadow-panel">
                  <IconBox icon={Icon} />
                  <h3 className="mt-4 text-lg font-bold uppercase tracking-tight text-ink">
                    {f.label}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-muted">{f.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      {/* Piani */}
      <section id="piani" className="bg-surface-sunken py-20">
        <Container>
          <div className="mx-auto max-w-xl text-center">
            <h2 className="text-3xl font-black uppercase tracking-tight text-ink">
              Piani e prezzi
            </h2>
            <p className="mt-3 text-ink-muted">
              Nessuna carta richiesta per iniziare con il piano gratuito.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-3xl items-start gap-6 sm:grid-cols-2">
            {/* Gratuito */}
            <div className="relative flex flex-col gap-6 rounded-panel border border-hairline bg-surface p-8 shadow-panel">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-ink">Gratuito</h3>
                <p className="mt-1">
                  <span className="text-3xl font-bold text-ink">Gratis</span>
                </p>
              </div>
              <ul className="flex flex-col gap-2.5">
                {FREE_INCLUDED.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-ink-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="/cerca"
                className="mt-auto rounded-control border border-hairline-strong px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-ink hover:border-accent hover:text-accent"
              >
                Inizia gratis
              </a>
            </div>

            {/* Pass Pro */}
            <div className="relative flex flex-col gap-6 rounded-panel border border-accent bg-surface p-8 shadow-panel">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold uppercase tracking-wide text-accent-ink">
                Consigliato
              </span>
              <div>
                <h3 className="text-lg font-bold uppercase tracking-tight text-ink">Pass Pro</h3>
                <p className="mt-1">
                  <span className="text-3xl font-bold text-ink">
                    {formatPrice(PASS_PRO_MONTHLY_PRICE_CENTS)}
                  </span>
                  <span className="text-sm text-ink-muted">/mese</span>
                </p>
                <p className="mt-1 text-xs text-ink-muted">
                  oppure {formatPrice(PASS_PRO_ANNUAL_PRICE_CENTS)}/anno
                </p>
              </div>
              <ul className="flex flex-col gap-2.5">
                <li className="flex items-start gap-2 text-sm text-ink-muted">
                  <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                  Tutto del piano Gratuito, senza limiti
                </li>
                {PREMIUM_FEATURES.map((f) => (
                  <li key={f.feature} className="flex items-start gap-2 text-sm text-ink-muted">
                    <Check size={16} className="mt-0.5 shrink-0 text-accent" aria-hidden />
                    {f.label}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:info@poligoniitalia.it"
                className="mt-auto rounded-control bg-accent px-6 py-3 text-center text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover"
              >
                Passa a Pro
              </a>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA finale */}
      <section className="py-20">
        <Container>
          <div className="rounded-panel border border-hairline bg-surface-sunken px-8 py-12 text-center">
            <h2 className="text-2xl font-black uppercase tracking-tight text-ink">Hai domande?</h2>
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
