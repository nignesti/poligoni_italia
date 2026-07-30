import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// ---------------------------------------------------------------------------
// Mock data — in produzione: query Supabase
// ---------------------------------------------------------------------------
const PROVINCE_RANGES: Record<string, { name: string; slug: string; comune: string; type: string }[]> = {
  'milano': [
    { name: 'TSN Milano', slug: 'tsn-milano', comune: 'Milano', type: 'tsn' },
    { name: 'Poligono di Corsico', slug: 'poligono-corsico', comune: 'Corsico', type: 'privato' },
    { name: 'Tiro a Segno Rho', slug: 'tsn-rho', comune: 'Rho', type: 'tsn' },
  ],
  'roma': [
    { name: 'TSN Roma', slug: 'tsn-roma', comune: 'Roma', type: 'tsn' },
    { name: 'Poligono Tuscolo', slug: 'poligono-tuscolo', comune: 'Frascati', type: 'tiro_a_volo' },
  ],
  'napoli': [
    { name: 'TSN Napoli', slug: 'tsn-napoli', comune: 'Napoli', type: 'tsn' },
  ],
  'torino': [
    { name: 'TSN Torino', slug: 'tsn-torino', comune: 'Torino', type: 'tsn' },
    { name: 'Poligono di Nichelino', slug: 'poligono-nichelino', comune: 'Nichelino', type: 'privato' },
  ],
};

const PROVINCE_LABELS: Record<string, string> = {
  milano: 'Milano',
  roma: 'Roma',
  napoli: 'Napoli',
  torino: 'Torino',
};

const REGION_LABELS: Record<string, string> = {
  lombardia: 'Lombardia',
  lazio: 'Lazio',
  campania: 'Campania',
  piemonte: 'Piemonte',
};

const REGION_MAP: Record<string, string> = {
  milano: 'lombardia',
  roma: 'lazio',
  napoli: 'campania',
  torino: 'piemonte',
};

export async function generateStaticParams() {
  return Object.keys(PROVINCE_RANGES).map((provincia) => ({
    regione: REGION_MAP[provincia]!,
    provincia,
  }));
}

export async function generateMetadata(
  props: { params: Promise<{ regione: string; provincia: string }> },
): Promise<Metadata> {
  const { provincia } = await props.params;
  const label = PROVINCE_LABELS[provincia];
  if (!label) return { title: 'Provincia non trovata' };

  return {
    title: `Poligoni di tiro a ${label}`,
    description: `Elenco dei poligoni di tiro in provincia di ${label}. Trova orari, contatti e disponibilità delle linee di tiro nella tua zona.`,
    keywords: [`poligoni ${label}`, `tiro a segno ${label}`, `poligono di tiro ${label}`],
  };
}

export default async function ProvinciaPage(
  props: { params: Promise<{ regione: string; provincia: string }> },
) {
  const { regione, provincia } = await props.params;
  const ranges = PROVINCE_RANGES[provincia];
  if (!ranges) notFound();

  const regioneLabel = REGION_LABELS[regione] ?? regione;
  const provinciaLabel = PROVINCE_LABELS[provincia] ?? provincia;
  const typeLabels: Record<string, string> = {
    tsn: 'Sezione TSN',
    privato: 'Poligono Privato',
    tiro_a_volo: 'Tiro a Volo',
  };

  return (
    <>
      <nav className="breadcrumb container">
        <Link href="/">Home</Link>
        <span className="sep">›</span>
        <Link href={`/poligoni/${regione}`}>{regioneLabel}</Link>
        <span className="sep">›</span>
        <span>{provinciaLabel}</span>
      </nav>

      <div className="container provincia-page">
        <header className="provincia-header">
          <h1>Poligoni di tiro in provincia di {provinciaLabel}</h1>
          <p className="provincia-count">{ranges.length} strutture trovate</p>
        </header>

        <div className="ranges-list">
          {ranges.map((r) => (
            <Link
              key={r.slug}
              href={`/poligoni/${regione}/${provincia}/${r.slug}`}
              className="range-item"
            >
              <div className="range-item-info">
                <h2 className="range-item-name">{r.name}</h2>
                <p className="range-item-comune">{r.comune}</p>
              </div>
              <span className="range-item-type">
                {typeLabels[r.type] ?? r.type}
              </span>
              <span className="range-item-arrow">→</span>
            </Link>
          ))}
        </div>
      </div>

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

        .provincia-header { padding: var(--space-8) 0 var(--space-6); }
        .provincia-header h1 { font-size: 1.75rem; margin-bottom: var(--space-2); }
        .provincia-count { color: var(--color-gray-500); }

        .ranges-list { display: flex; flex-direction: column; gap: var(--space-3); padding-bottom: var(--space-16); }
        .range-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: var(--space-5) var(--space-6);
          background: white;
          border: 1px solid var(--color-gray-200);
          border-radius: var(--radius-lg);
          transition: border-color 0.15s, box-shadow 0.15s;
        }
        .range-item:hover {
          border-color: var(--color-green-400);
          box-shadow: var(--shadow-md);
        }
        .range-item-name { font-size: 1rem; margin-bottom: var(--space-1); }
        .range-item-comune { font-size: 0.875rem; color: var(--color-gray-500); }
        .range-item-type {
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-green-700);
          background: var(--color-green-50);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-md);
        }
        .range-item-arrow { color: var(--color-gray-300); font-size: 1.25rem; }

        @media (max-width: 768px) {
          .provincia-header h1 { font-size: 1.375rem; }
        }
      `}</style>
    </>
  );
}
