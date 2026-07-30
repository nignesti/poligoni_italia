import type { Metadata } from 'next';
import Link from 'next/link';
import { CaretRight } from '@phosphor-icons/react/ssr';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { allGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Guide e risorse',
  description: 'Guide pratiche per il tiratore sportivo: normativa, documenti, primo accesso al poligono.',
};

export default function GuideIndexPage() {
  const guides = allGuides();

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Guide' }]} />

      <Container className="py-10">
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">Guide e risorse</h1>
        <p className="mt-2 max-w-prose text-ink-muted">
          Informazioni pratiche su normativa, documenti e primo accesso al poligono.
        </p>

        <div className="mt-8 flex flex-col gap-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guide/${guide.slug}`}
              className="flex items-center justify-between gap-4 rounded-panel border border-hairline bg-surface px-6 py-5 hover:border-accent hover:shadow-panel"
            >
              <div>
                <h2 className="font-medium text-ink">{guide.title}</h2>
                <p className="mt-1 max-w-prose text-sm text-ink-muted">{guide.description}</p>
              </div>
              <CaretRight size={18} className="shrink-0 text-ink-faint" aria-hidden />
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
