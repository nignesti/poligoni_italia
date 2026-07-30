import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { GUIDES } from '@/lib/guides';

/**
 * Rende in grassetto i segmenti `**testo**`. Il contenuto è tutto interno
 * (definito in lib/guides.ts, non da input utente), quindi non serve un
 * parser markdown completo.
 */
function renderInline(text: string): React.ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold text-ink">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = GUIDES[slug];
  if (!guide) return { title: 'Guida non trovata' };

  return { title: guide.title, description: guide.description };
}

export default async function GuidePage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const guide = GUIDES[slug];
  if (!guide) notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: 'Guide', href: '/guide' },
          { label: guide.title },
        ]}
      />

      <Container className="py-10 pb-20">
        <article className="max-w-[65ch]">
          <h1 className="text-2xl font-semibold text-ink md:text-3xl">{guide.title}</h1>
          <p className="mt-3 text-lg leading-relaxed text-ink-muted">{guide.description}</p>

          <div className="mt-8 flex flex-col gap-4">
            {guide.content.map((paragraph, i) => {
              if (paragraph.startsWith('## ')) {
                return (
                  <h2 key={i} className="mt-4 border-t border-hairline pt-4 text-xl font-semibold text-ink">
                    {paragraph.replace('## ', '')}
                  </h2>
                );
              }
              if (paragraph.startsWith('- ')) {
                return (
                  <li key={i} className="ml-6 list-disc leading-relaxed text-ink-muted">
                    {renderInline(paragraph.replace('- ', ''))}
                  </li>
                );
              }
              return (
                <p key={i} className="leading-relaxed text-ink-muted">
                  {renderInline(paragraph)}
                </p>
              );
            })}
          </div>
        </article>
      </Container>
    </>
  );
}
