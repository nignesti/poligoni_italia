import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Guide {
  slug: string;
  title: string;
  description: string;
  content: string[];
}

const GUIDES: Record<string, Guide> = {
  'limiti-munizioni': {
    slug: 'limiti-munizioni',
    title: 'Limiti di detenzione munizioni — art. 97 TULPS',
    description: 'Guida ai limiti di detenzione delle munizioni secondo l\'articolo 97 del TULPS. Categorie, quantità massime e obblighi di denuncia.',
    content: [
      "L'articolo 97 del Testo Unico delle Leggi di Pubblica Sicurezza (TULPS, R.D. 18 giugno 1931, n. 773) stabilisce i limiti massimi di munizioni che un privato cittadino può detenere senza licenza della Prefettura.",
      '## Le quattro categorie',
      'La legge distingue quattro categorie di munizioni con limiti diversi:',
      '- **Armi corte**: fino a 200 cartucce per tutte le armi corte detenute (la somma, non per calibro);',
      '- **Armi lunghe da caccia**: fino a 1.500 cartucce a palla;',
      '- **Spezzone (pallini)**: fino a 1.500 cartucce, con obbligo di denuncia oltre 1.000 pezzi;',
      '- **Polvere da sparo**: fino a 2.000 grammi.',
      '## L\'errore più comune',
      'Il limite si applica per **categoria**, non per calibro. Se possiedi una pistola 9×21 e una .45 ACP, il limite di 200 cartucce per arma corta è unico: la somma delle munizioni per entrambi i calibri non deve superare 200 pezzi. Superarlo senza licenza della Prefettura è reato.',
      '## Obbligo di denuncia',
      'Per lo spezzone, scatta l\'obbligo di denuncia alla locale Autorità di Pubblica Sicurezza quando si detengono più di 1.000 pezzi. La denuncia è un atto formale, non una richiesta di autorizzazione.',
      '## Cosa fare se si supera il limite',
      'Chi detiene quantità eccedenti deve richiedere alla Prefettura competente una licenza che autorizzi la detenzione eccedentaria. In assenza di questa licenza, l\'eccedenza configura il reato di detenzione abusiva di munizioni.',
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(GUIDES).map((slug) => ({ slug }));
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const guide = GUIDES[slug];
  if (!guide) return { title: 'Guida non trovata' };

  return {
    title: guide.title,
    description: guide.description,
  };
}

export default async function GuidePage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const guide = GUIDES[slug];
  if (!guide) notFound();

  return (
    <>
      <nav className="breadcrumb container">
        <Link href="/">Home</Link>
        <span className="sep">›</span>
        <Link href="/guide">Guide</Link>
        <span className="sep">›</span>
        <span>{guide.title}</span>
      </nav>

      <article className="container guide-page">
        <h1>{guide.title}</h1>
        <p className="guide-desc">{guide.description}</p>
        <div className="guide-content">
          {guide.content.map((paragraph, i) => {
            if (paragraph.startsWith('## ')) {
              return <h2 key={i}>{paragraph.replace('## ', '')}</h2>;
            }
            if (paragraph.startsWith('- ')) {
              return <li key={i}>{paragraph.replace('- ', '')}</li>;
            }
            return <p key={i}>{paragraph}</p>;
          })}
        </div>
      </article>

      <style>{`
        .breadcrumb {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          padding-top: var(--space-6);
          padding-bottom: var(--space-6);
          font-size: 0.875rem;
          color: var(--color-gray-500);
        }
        .breadcrumb a { color: var(--color-green-600); }
        .breadcrumb a:hover { text-decoration: underline; }
        .sep { color: var(--color-gray-300); }

        .guide-page { padding-bottom: var(--space-20); max-width: 720px; }
        .guide-page h1 { font-size: 1.75rem; margin-bottom: var(--space-4); }
        .guide-desc { color: var(--color-gray-500); font-size: 1.0625rem; margin-bottom: var(--space-8); line-height: 1.6; }
        .guide-content { display: flex; flex-direction: column; gap: var(--space-4); }
        .guide-content h2 { font-size: 1.25rem; margin-top: var(--space-4); padding-top: var(--space-4); border-top: 1px solid var(--color-gray-100); }
        .guide-content p { color: var(--color-gray-600); line-height: 1.7; }
        .guide-content li { color: var(--color-gray-600); line-height: 1.7; margin-left: var(--space-6); list-style: disc; }
      `}</style>
    </>
  );
}
