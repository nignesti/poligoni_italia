import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AMMO_DISCLAIMER } from '@poligoni/core/ammo';

// ---------------------------------------------------------------------------
// Tipi (in produzione arrivano dal database — Drizzle + Supabase)
// ---------------------------------------------------------------------------
interface RangeData {
  slug: string;
  name: string;
  type: string;
  address: string;
  comune: string;
  provincia: string;
  regione: string;
  cap: string;
  phone: string | null;
  email: string | null;
  website: string | null;
  description: string | null;
  services: { name: string; available: boolean }[];
  lines: { name: string; distance: number; indoor: boolean; calibers: string[] }[];
  hours: { day: string; opens: string; closes: string }[];
}

// ---------------------------------------------------------------------------
// Mock data — in produzione: query Supabase → Drizzle → cache React
// ---------------------------------------------------------------------------
const MOCK_RANGES: Record<string, RangeData> = {
  'tsn-milano': {
    slug: 'tsn-milano',
    name: 'TSN Milano — Sezione di tiro a segno',
    type: 'tsn',
    address: 'Viale dell\'Arte, 12',
    comune: 'Milano',
    provincia: 'Milano',
    regione: 'Lombardia',
    cap: '20149',
    phone: '+39 02 1234567',
    email: 'info@tsnmilano.it',
    website: 'https://tsnmilano.it',
    description:
      'Il Tiro a Segno Nazionale di Milano è una delle sezioni più storiche d\'Italia, fondata nel 1888. Dispone di linee per tiro a segno da 10 m, 25 m e 50 m, sia coperte che scoperte, con attrezzature elettroniche SIUS per la rilevazione dei colpi.',
    services: [
      { name: 'Noleggio armi', available: true },
      { name: 'Istruttore', available: true },
      { name: 'Armiario', available: true },
      { name: 'Bar/Ristoro', available: true },
      { name: 'Parcheggio', available: true },
      { name: 'Vendita munizioni', available: true },
    ],
    lines: [
      { name: '10 m — coperta', distance: 10, indoor: true, calibers: ['.22 LR', '9x21', 'aria compressa'] },
      { name: '25 m — coperta', distance: 25, indoor: true, calibers: ['.22 LR', '9x21', '.38 Special', '.357 Magnum', '.45 ACP'] },
      { name: '50 m — coperta', distance: 50, indoor: true, calibers: ['.22 LR', '.308 Win', '6.5 Creedmoor'] },
    ],
    hours: [
      { day: 'Lunedì', opens: '09:00', closes: '12:30' },
      { day: 'Lunedì', opens: '14:00', closes: '19:00' },
      { day: 'Martedì', opens: '09:00', closes: '12:30' },
      { day: 'Martedì', opens: '14:00', closes: '19:00' },
      { day: 'Mercoledì', opens: '09:00', closes: '12:30' },
      { day: 'Mercoledì', opens: '14:00', closes: '19:00' },
      { day: 'Giovedì', opens: '09:00', closes: '12:30' },
      { day: 'Giovedì', opens: '14:00', closes: '19:00' },
      { day: 'Venerdì', opens: '09:00', closes: '12:30' },
      { day: 'Venerdì', opens: '14:00', closes: '19:00' },
      { day: 'Sabato', opens: '09:00', closes: '18:00' },
      { day: 'Domenica', opens: '09:00', closes: '13:00' },
    ],
  },
  'tsn-roma': {
    slug: 'tsn-roma',
    name: 'TSN Roma — Sezione di tiro a segno',
    type: 'tsn',
    address: 'Via del Tiro a Segno, 45',
    comune: 'Roma',
    provincia: 'Roma',
    regione: 'Lazio',
    cap: '00135',
    phone: '+39 06 9876543',
    email: 'info@tsnroma.it',
    website: null,
    description:
      'Il Tiro a Segno Nazionale di Roma, fondato nel 1897, si trova all\'interno del comprensorio del Foro Italico. Linee da 10 m, 25 m e 50 m coperte, con impianto di ventilazione e sistema di punteria elettronica.',
    services: [
      { name: 'Noleggio armi', available: true },
      { name: 'Istruttore', available: true },
      { name: 'Armiario', available: false },
      { name: 'Bar/Ristoro', available: true },
      { name: 'Parcheggio', available: true },
      { name: 'Vendita munizioni', available: false },
    ],
    lines: [
      { name: '10 m — coperta', distance: 10, indoor: true, calibers: ['.22 LR', 'aria compressa'] },
      { name: '25 m — coperta', distance: 25, indoor: true, calibers: ['.22 LR', '9x21', '.45 ACP'] },
      { name: '50 m — coperta', distance: 50, indoor: true, calibers: ['.22 LR', '.308 Win'] },
    ],
    hours: [
      { day: 'Martedì', opens: '14:00', closes: '19:00' },
      { day: 'Mercoledì', opens: '09:00', closes: '12:30' },
      { day: 'Mercoledì', opens: '14:00', closes: '19:00' },
      { day: 'Giovedì', opens: '14:00', closes: '19:00' },
      { day: 'Venerdì', opens: '09:00', closes: '12:30' },
      { day: 'Venerdì', opens: '14:00', closes: '19:00' },
      { day: 'Sabato', opens: '09:00', closes: '17:00' },
    ],
  },
};

// ---------------------------------------------------------------------------
// Static params per SSG (in produzione: query DB → lista slug univoci)
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return Object.keys(MOCK_RANGES).map((slug) => {
    const range = MOCK_RANGES[slug]!;
    return {
      regione: range.regione.toLowerCase(),
      provincia: range.provincia.toLowerCase(),
      slug,
    };
  });
}

// ---------------------------------------------------------------------------
// Metadata dinamica
// ---------------------------------------------------------------------------
export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const range = MOCK_RANGES[slug];
  if (!range) return { title: 'Poligono non trovato' };

  return {
    title: range.name,
    description:
      range.description?.slice(0, 160) ??
      `Poligono di tiro a ${range.comune}, ${range.provincia}. Linee disponibili: ${range.lines.map((l) => `${l.distance} m`).join(', ')}. Orari e informazioni.`,
    openGraph: {
      title: range.name,
      description: `Poligono di tiro a ${range.comune} — ${range.lines.length} linee disponibili.`,
      type: 'article',
      locale: 'it_IT',
    },
    keywords: [
      `poligono ${range.comune}`,
      `tiro a segno ${range.comune}`,
      `linee di tiro ${range.comune}`,
      ...range.lines.flatMap((l) => l.calibers),
    ],
  };
}

// ---------------------------------------------------------------------------
// Pagina
// ---------------------------------------------------------------------------
export default async function RangePage(
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;
  const range = MOCK_RANGES[slug];
  if (!range) notFound();

  const typeLabels: Record<string, string> = {
    tsn: 'Sezione TSN',
    privato: 'Poligono Privato',
    tiro_a_volo: 'Tiro a Volo',
    dinamico: 'Tiro Dinamico',
    long_range: 'Long Range',
  };

  const today = new Date().toLocaleDateString('it-IT', { weekday: 'long' });
  const todayHours = range.hours.filter(
    (h) => h.day.toLowerCase() === today.toLowerCase(),
  );

  return (
    <>
      {/* Breadcrumb */}
      <nav className="breadcrumb container">
        <Link href="/">Home</Link>
        <span className="sep">›</span>
        <Link href={`/poligoni/${range.regione.toLowerCase()}`}>
          {range.regione}
        </Link>
        <span className="sep">›</span>
        <Link
          href={`/poligoni/${range.regione.toLowerCase()}/${range.provincia.toLowerCase()}`}
        >
          {range.provincia}
        </Link>
        <span className="sep">›</span>
        <span>{range.name}</span>
      </nav>

      <article className="container range-page">
        {/* Header */}
        <header className="range-header">
          <div>
            <span className="range-type">{typeLabels[range.type] ?? range.type}</span>
            <h1 className="range-name">{range.name}</h1>
            <p className="range-address">
              {range.address}, {range.cap} {range.comune} ({range.provincia})
            </p>
          </div>
          <div className="range-contacts">
            {range.phone && (
              <a href={`tel:${range.phone}`} className="contact-link">
                📞 {range.phone}
              </a>
            )}
            {range.email && (
              <a href={`mailto:${range.email}`} className="contact-link">
                ✉️ {range.email}
              </a>
            )}
            {range.website && (
              <a
                href={range.website}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-link"
              >
                🌐 Sito web
              </a>
            )}
          </div>
        </header>

        <div className="range-grid">
          {/* Descrizione */}
          <section className="range-section">
            <h2>Descrizione</h2>
            <p>{range.description}</p>
          </section>

          {/* Orari */}
          <section className="range-section">
            <h2>Orari di apertura</h2>
            <table className="hours-table">
              <thead>
                <tr>
                  <th>Giorno</th>
                  <th>Apertura</th>
                  <th>Chiusura</th>
                </tr>
              </thead>
              <tbody>
                {range.hours.map((h, i) => (
                  <tr
                    key={i}
                    className={
                      h.day.toLowerCase() === today.toLowerCase()
                        ? 'today-row'
                        : ''
                    }
                  >
                    <td>{h.day}</td>
                    <td>{h.opens}</td>
                    <td>{h.closes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            {todayHours.length > 0 && (
              <p className="today-hours">
                Oggi: {todayHours.map((h) => `${h.opens}–${h.closes}`).join(', ')}
              </p>
            )}
          </section>

          {/* Linee di tiro */}
          <section className="range-section">
            <h2>Linee di tiro</h2>
            <div className="lines-grid">
              {range.lines.map((line, i) => (
                <div key={i} className="line-card">
                  <h3 className="line-name">{line.name}</h3>
                  <span className="line-badge">
                    {line.indoor ? '🛖 Coperta' : '🌤️ Scoperta'}
                  </span>
                  <div className="line-calibers">
                    <strong>Calibri:</strong>{' '}
                    {line.calibers.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Servizi */}
          <section className="range-section">
            <h2>Servizi</h2>
            <div className="services-grid">
              {range.services.map((s, i) => (
                <div key={i} className="service-item">
                  <span className={s.available ? 'check' : 'cross'}>
                    {s.available ? '✅' : '❌'}
                  </span>
                  {s.name}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* CTA prenotazione */}
        <div className="range-cta">
          <Link
            href={`/cerca?range=${range.slug}`}
            className="btn btn-primary btn-large"
          >
            Verifica disponibilità e prenota
          </Link>
        </div>

        {/* Avvertenza — visibile su ogni scheda */}
        <p className="ammo-disclaimer">{AMMO_DISCLAIMER}</p>
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

        .range-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: var(--space-8);
          padding: var(--space-8) 0;
          border-bottom: 1px solid var(--color-gray-200);
          flex-wrap: wrap;
        }
        .range-type {
          display: inline-block;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: var(--color-green-700);
          background: var(--color-green-100);
          padding: var(--space-1) var(--space-3);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-3);
        }
        .range-name { font-size: 1.75rem; margin-bottom: var(--space-2); }
        .range-address { color: var(--color-gray-500); }
        .range-contacts { display: flex; flex-direction: column; gap: var(--space-2); }
        .contact-link {
          color: var(--color-green-700);
          font-size: 0.875rem;
          transition: color 0.15s;
        }
        .contact-link:hover { color: var(--color-green-500); }

        .range-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-8);
          padding: var(--space-8) 0;
        }
        .range-section h2 {
          font-size: 1.125rem;
          margin-bottom: var(--space-4);
          padding-bottom: var(--space-2);
          border-bottom: 2px solid var(--color-green-100);
        }
        .range-section p { color: var(--color-gray-600); line-height: 1.7; }

        .hours-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
        .hours-table th {
          text-align: left;
          font-weight: 600;
          color: var(--color-gray-500);
          padding-bottom: var(--space-2);
          border-bottom: 1px solid var(--color-gray-200);
        }
        .hours-table td { padding: var(--space-2) 0; border-bottom: 1px solid var(--color-gray-100); }
        .today-row td { color: var(--color-green-700); font-weight: 600; }
        .today-hours {
          margin-top: var(--space-3);
          font-weight: 600;
          color: var(--color-green-700);
          font-size: 0.875rem;
        }

        .lines-grid { display: flex; flex-direction: column; gap: var(--space-4); }
        .line-card {
          padding: var(--space-4);
          background: var(--color-gray-50);
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-gray-200);
        }
        .line-name { font-size: 1rem; margin-bottom: var(--space-2); }
        .line-badge { font-size: 0.8125rem; color: var(--color-gray-500); }
        .line-calibers { font-size: 0.875rem; color: var(--color-gray-600); margin-top: var(--space-2); }

        .services-grid { display: grid; grid-template-columns: 1fr 1fr; gap: var(--space-2); }
        .service-item { font-size: 0.875rem; display: flex; align-items: center; gap: var(--space-2); }

        .range-cta {
          text-align: center;
          padding: var(--space-12) 0;
          border-top: 1px solid var(--color-gray-200);
        }

        .ammo-disclaimer {
          font-size: 0.75rem;
          color: var(--color-gray-400);
          text-align: center;
          padding: var(--space-4) 0 var(--space-8);
          max-width: 500px;
          margin: 0 auto;
          line-height: 1.5;
        }

        @media (max-width: 768px) {
          .range-grid { grid-template-columns: 1fr; }
          .range-header { flex-direction: column; }
          .services-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </>
  );
}
