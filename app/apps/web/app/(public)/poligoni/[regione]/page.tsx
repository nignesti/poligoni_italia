import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { provinceCountsInRegion, regionCounts, regionNameFromSlug } from '@/lib/ranges';

export async function generateStaticParams() {
  const regions = await regionCounts();
  return regions.map((r) => ({ regione: r.slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ regione: string }> },
): Promise<Metadata> {
  const { regione } = await props.params;
  const name = await regionNameFromSlug(regione);
  if (!name) return { title: 'Regione non trovata' };

  return {
    title: `Poligoni di tiro in ${name}`,
    description: `Elenco delle province con poligoni di tiro in ${name}. Orari, contatti e disponibilità delle linee di tiro.`,
  };
}

export default async function RegionePage(
  props: { params: Promise<{ regione: string }> },
) {
  const { regione } = await props.params;
  const name = await regionNameFromSlug(regione);
  if (!name) notFound();

  const province = await provinceCountsInRegion(regione);

  return (
    <>
      <Breadcrumb
        items={[{ label: 'Home', href: '/' }, { label: 'Regioni', href: '/poligoni' }, { label: name }]}
      />

      <Container className="py-10">
        <h1 className="text-2xl font-semibold text-ink md:text-3xl">Poligoni di tiro in {name}</h1>
        <p className="mt-2 text-ink-muted">{province.length} province con strutture censite</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {province.map((p) => (
            <Link
              key={p.slug}
              href={`/poligoni/${regione}/${p.slug}`}
              className="flex items-center justify-between rounded-panel border border-hairline bg-surface px-5 py-4 hover:border-accent hover:shadow-panel"
            >
              <span className="font-medium text-ink">{p.name}</span>
              <span className="text-sm text-ink-muted">{p.count} strutture</span>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
