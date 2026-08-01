import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CaretRight } from '@phosphor-icons/react/ssr';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { distinctRegioneProvinciaPairs, rangesByProvincia } from '@/lib/ranges';
import { RANGE_TYPE_LABEL } from '@/lib/format';

export async function generateStaticParams() {
  return distinctRegioneProvinciaPairs();
}

export async function generateMetadata(
  props: { params: Promise<{ regione: string; provincia: string }> },
): Promise<Metadata> {
  const { provincia } = await props.params;
  const ranges = await rangesByProvincia(provincia);
  if (ranges.length === 0) return { title: 'Provincia non trovata' };

  const label = ranges[0]!.provincia;
  return {
    title: `Poligoni di tiro a ${label}`,
    description: `Elenco dei poligoni di tiro in provincia di ${label}. Orari, contatti e disponibilità delle linee di tiro.`,
    keywords: [`poligoni ${label}`, `tiro a segno ${label}`, `poligono di tiro ${label}`],
  };
}

export default async function ProvinciaPage(
  props: { params: Promise<{ regione: string; provincia: string }> },
) {
  const { regione, provincia } = await props.params;
  const ranges = await rangesByProvincia(provincia);
  if (ranges.length === 0) notFound();

  const regioneLabel = ranges[0]!.regione;
  const provinciaLabel = ranges[0]!.provincia;

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: regioneLabel, href: `/poligoni/${regione}` },
          { label: provinciaLabel },
        ]}
      />

      <Container className="py-8">
        <header className="pb-6">
          <h1 className="text-2xl font-black uppercase tracking-tight text-ink md:text-3xl">
            Poligoni di tiro in provincia di {provinciaLabel}
          </h1>
          <p className="mt-2 text-ink-muted">{ranges.length} strutture trovate</p>
        </header>

        <div className="flex flex-col gap-3 pb-16">
          {ranges.map((r) => (
            <Link
              key={r.slug}
              href={`/poligoni/${regione}/${provincia}/${r.slug}`}
              className="flex items-center justify-between gap-4 rounded-panel border border-hairline bg-surface px-6 py-5 transition-colors hover:border-accent hover:shadow-panel"
            >
              <div>
                <h2 className="font-bold uppercase tracking-tight text-ink">{r.name}</h2>
                <p className="mt-1 text-sm text-ink-muted">{r.comune}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="rounded-full bg-accent-wash px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
                  {RANGE_TYPE_LABEL[r.type]}
                </span>
                <CaretRight size={18} className="text-ink-faint" aria-hidden />
              </div>
            </Link>
          ))}
        </div>
      </Container>
    </>
  );
}
