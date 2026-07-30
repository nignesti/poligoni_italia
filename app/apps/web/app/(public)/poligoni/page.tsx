import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { regionCounts } from '@/lib/fixtures';

export const metadata: Metadata = {
  title: 'Poligoni di tiro per regione',
  description:
    'Esplora i poligoni di tiro sportivo in Italia, organizzati per regione. Orari, contatti e disponibilità delle linee di tiro.',
};

export default function RegioniIndexPage() {
  const regions = regionCounts();

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Regioni' }]} />

      <Container className="py-10">
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">
          Poligoni di tiro per regione
        </h1>
        <p className="mt-2 text-ink-muted">{regions.length} regioni censite</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/poligoni/${region.slug}`}
              className="flex items-center justify-between rounded-panel border border-hairline bg-surface px-5 py-4 hover:border-accent hover:shadow-panel"
            >
              <span className="font-medium text-ink">{region.name}</span>
              <span className="text-sm text-ink-muted">{region.count} strutture</span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
