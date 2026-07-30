import Link from 'next/link';
import { Target } from '@phosphor-icons/react/ssr';
import { Container } from './Container';

export function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface-sunken">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.2fr_1fr_1fr_1fr]">
        <div>
          <Link href="/" className="flex items-center gap-2 font-semibold text-ink">
            <Target size={20} weight="bold" className="text-accent" aria-hidden />
            <span>Poligoni Italia</span>
          </Link>
          <p className="mt-3 max-w-[32ch] text-sm leading-relaxed text-ink-muted">
            Trova e prenota poligoni di tiro sportivo in Italia.
          </p>
        </div>

        <FooterColumn
          title="Esplora"
          links={[
            { label: 'Cerca poligoni', href: '/cerca' },
            { label: 'Tutte le regioni', href: '/poligoni' },
            { label: 'Guide e risorse', href: '/guide' },
          ]}
        />

        <FooterColumn
          title="Per i gestori"
          links={[{ label: 'Aggiungi la tua struttura', href: '/gestori' }]}
        />

        <FooterColumn
          title="Legale"
          links={[
            { label: 'Privacy', href: '/privacy' },
            { label: 'Termini di servizio', href: '/termini' },
          ]}
        />
      </Container>

      <div className="border-t border-hairline">
        <Container className="py-6">
          <p className="text-xs text-ink-faint">
            © {new Date().getFullYear()} Poligoni Italia. Tutti i diritti riservati.
          </p>
        </Container>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-ink">{title}</h4>
      <ul className="mt-3 flex flex-col gap-2.5">
        {links.map((link) => (
          <li key={link.href}>
            <Link href={link.href} className="text-sm text-ink-muted hover:text-ink">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
