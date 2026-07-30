import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react/ssr';
import { Container } from './Container';

export interface Crumb {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Percorso di navigazione" className="border-b border-hairline">
      <Container>
        <ol className="flex flex-wrap items-center gap-1.5 py-3 text-sm text-ink-muted">
          {items.map((item, i) => (
            <li key={i} className="flex items-center gap-1.5">
              {i > 0 && <CaretRight size={12} className="text-ink-faint" aria-hidden />}
              {item.href ? (
                <Link href={item.href} className="hover:text-accent">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink" aria-current="page">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </Container>
    </nav>
  );
}
