import type { Metadata } from 'next';
import Link from 'next/link';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { regionCounts } from '@/lib/ranges';

export const metadata: Metadata = {
  title: 'Poligoni di tiro per regione',
  description:
    'Esplora i poligoni di tiro sportivo in Italia, organizzati per regione. Orari, contatti e disponibilità delle linee di tiro.',
};

export default async function RegioniIndexPage() {
  const regions = await regionCounts();

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Regioni' }]} />

      <Container className="py-10">
        <h1 className="text-2xl font-black uppercase tracking-tight text-ink md:text-3xl">
          Poligoni di tiro per regione
        </h1>
        <p className="mt-2 text-ink-muted">{regions.length} regioni censite</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {regions.map((region) => (
            <Link
              key={region.slug}
              href={`/poligoni/${region.slug}`}
              className="flex items-center justify-between rounded-panel border border-hairline bg-surface px-5 py-4 transition-colors hover:border-accent hover:shadow-panel"
            >
              <span className="font-bold uppercase tracking-tight text-ink">{region.name}</span>
              <span className="rounded-full bg-accent-wash px-2 py-0.5 font-mono text-xs font-bold text-accent">
                {region.count}
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
