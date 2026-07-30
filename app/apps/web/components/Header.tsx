import Link from 'next/link';
import { Target } from '@phosphor-icons/react/ssr';
import { Container } from './Container';

/**
 * Header condiviso da tutte le pagine pubbliche (Piano_Sviluppo_App.md §7.1).
 *
 * Sempre su superficie neutra, mai dentro il gradiente dell'hero: un nav
 * prevedibile conta più di un effetto per un pubblico che cerca informazioni
 * pratiche in un settore vigilato (BP §6.1). Altezza 64px, una sola riga,
 * un solo intento di CTA ("Aggiungi la tua struttura", coerente ovunque nel
 * sito - vedi §4.5 della skill sul divieto di CTA duplicate).
 */
export function Header() {
  return (
    <header className="sticky top-0 z-20 h-16 border-b border-hairline bg-surface">
      <Container className="flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
          <Target size={22} weight="bold" className="text-accent" aria-hidden />
          <span>Poligoni Italia</span>
        </Link>

        <nav aria-label="Principale" className="hidden items-center gap-6 md:flex">
          <Link href="/cerca" className="text-sm font-medium text-ink-muted hover:text-ink">
            Cerca poligoni
          </Link>
          <Link href="/guide" className="text-sm font-medium text-ink-muted hover:text-ink">
            Guide
          </Link>
        </nav>

        <Link
          href="/gestori"
          className="rounded-control border border-hairline-strong px-3.5 py-2 text-sm font-medium text-ink hover:border-accent hover:text-accent"
        >
          Aggiungi la tua struttura
        </Link>
      </Container>
    </header>
  );
}
