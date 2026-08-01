import type { Metadata } from 'next';
import Link from 'next/link';
import { CaretRight, Compass, Scales, Target, BookOpen, IdentificationCard } from '@phosphor-icons/react/ssr';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { IconBox } from '@/components/IconBox';
import { allGuides } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Guide e risorse',
  description: 'Guide pratiche per il tiratore sportivo: normativa, documenti, primo accesso al poligono.',
};

const GUIDE_ICON: Record<string, typeof Compass> = {
  'come-usare-poligoni-italia': Compass,
  'discipline-tiro-sportivo': Target,
  'limiti-munizioni': Scales,
  'documenti-richiesti': IdentificationCard,
};

export default function GuideIndexPage() {
  const guides = allGuides();

  return (
    <>
      <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: 'Guide' }]} />

      {/* Hero */}
      <section className="border-b border-hairline bg-accent">
        <Container className="py-14">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-ink/30 bg-black/10 px-3 py-1 text-xs font-bold uppercase tracking-widest text-accent-ink">
            <BookOpen size={14} weight="bold" aria-hidden />
            Guide e risorse
          </span>
          <h1 className="mt-4 max-w-2xl text-3xl font-black uppercase leading-[0.98] tracking-tight text-accent-ink md:text-4xl">
            Guide per il tiratore sportivo
          </h1>
          <p className="mt-4 max-w-xl text-accent-ink/85">
            Normativa, discipline e come usare la piattaforma: tutto ciò che serve per
            frequentare i poligoni in modo consapevole.
          </p>
        </Container>
      </section>

      <Container className="py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => {
            const Icon = GUIDE_ICON[guide.slug] ?? BookOpen;
            return (
              <Link
                key={guide.slug}
                href={`/guide/${guide.slug}`}
                className="flex flex-col rounded-panel border border-hairline bg-surface p-6 shadow-panel transition-colors hover:border-accent"
              >
                <IconBox icon={Icon} />
                <h2 className="mt-4 font-bold uppercase tracking-tight text-ink">{guide.title}</h2>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">
                  {guide.description}
                </p>
                <span className="mt-4 flex items-center gap-1 text-sm font-bold uppercase tracking-wide text-accent">
                  Leggi <CaretRight size={14} aria-hidden />
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </>
  );
}
