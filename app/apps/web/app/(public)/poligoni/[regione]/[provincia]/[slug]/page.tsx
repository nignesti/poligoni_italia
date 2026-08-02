import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  Phone,
  EnvelopeSimple,
  Globe,
  House,
  CloudSun,
  NavigationArrow,
} from '@phosphor-icons/react/ssr';
import { Breadcrumb } from '@/components/Breadcrumb';
import { Container } from '@/components/Container';
import { StatusPill } from '@/components/StatusPill';
import { allRegioneProvinciaSlugParams, findRangeBySlug } from '@/lib/ranges';
import {
  DISCIPLINE_LABEL,
  RANGE_TYPE_LABEL,
  formatDayRange,
  formatPrice,
  groupHours,
  todayStatus,
} from '@/lib/format';

// ---------------------------------------------------------------------------
// generateStaticParams - corretto con slugify() al posto del solo
// .toLowerCase() (bug che rompeva le rotte con regioni/province accentate
// o con spazi, es. "Reggio Emilia"). Vedi lib/slugify.ts.
// ---------------------------------------------------------------------------
export async function generateStaticParams() {
  return allRegioneProvinciaSlugParams();
}

export async function generateMetadata(
  props: { params: Promise<{ slug: string }> },
): Promise<Metadata> {
  const { slug } = await props.params;
  const range = await findRangeBySlug(slug);
  if (!range) return { title: 'Poligono non trovato' };

  return {
    title: range.name,
    description:
      range.description?.slice(0, 160) ??
      `Poligono di tiro a ${range.comune}, ${range.provincia}.`,
    openGraph: {
      title: range.name,
      description:
        range.lines.length > 0
          ? `Poligono di tiro a ${range.comune}, con ${range.lines.length} linee disponibili.`
          : `Poligono di tiro a ${range.comune}.`,
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

export default async function RangePage(
  props: { params: Promise<{ regione: string; provincia: string; slug: string }> },
) {
  const { regione, provincia, slug } = await props.params;
  const range = await findRangeBySlug(slug);
  if (!range) notFound();

  const status = todayStatus(range.hours, new Date());
  const hourGroups = groupHours(range.hours);
  const availableServices = range.services.filter((s) => s.available);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SportsActivityLocation',
    name: range.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: range.address,
      addressLocality: range.comune,
      postalCode: range.cap,
      addressRegion: range.regione,
      addressCountry: 'IT',
    },
    telephone: range.phone ?? undefined,
    url: range.website ?? undefined,
  };

  return (
    <>
      {/* JSON-LD statico, nessun input utente */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Breadcrumb
        items={[
          { label: 'Home', href: '/' },
          { label: range.regione, href: `/poligoni/${regione}` },
          { label: range.provincia, href: `/poligoni/${regione}/${provincia}` },
          { label: range.name },
        ]}
      />

      <Container className="py-8">
        {/* Intestazione */}
        <header className="flex flex-wrap items-start justify-between gap-8 border-b border-hairline pb-8">
          <div>
            <span className="inline-block rounded-full bg-accent-wash px-3 py-1 text-xs font-bold uppercase tracking-wide text-accent">
              {RANGE_TYPE_LABEL[range.type]}
            </span>
            <h1 className="mt-3 text-2xl font-black uppercase tracking-tight text-ink md:text-3xl">
              {range.name}
            </h1>
            <p className="mt-2 text-ink-muted">
              {range.address && `${range.address}, `}
              {range.cap && `${range.cap} `}
              {range.comune} ({range.provincia})
            </p>
            <div className="mt-3">
              <StatusPill open={status.open} label={status.label} />
              {status.detail && <span className="ml-2 text-sm text-ink-muted">{status.detail}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {range.phone && (
              <a href={`tel:${range.phone}`} className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover">
                <Phone size={16} aria-hidden />
                {range.phone}
              </a>
            )}
            {range.email && (
              <a href={`mailto:${range.email}`} className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover">
                <EnvelopeSimple size={16} aria-hidden />
                {range.email}
              </a>
            )}
            {range.website && (
              <a
                href={range.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-accent hover:text-accent-hover"
              >
                <Globe size={16} aria-hidden />
                Sito web
              </a>
            )}
          </div>
        </header>

        <div className="grid gap-10 py-8 md:grid-cols-2">
          {/* Descrizione */}
          {range.description && (
            <section className="md:col-span-2">
              <h2 className="border-b-2 border-accent-wash pb-2 text-lg font-black uppercase tracking-tight text-ink">
                Descrizione
              </h2>
              <p className="mt-4 leading-relaxed text-ink-muted">{range.description}</p>
            </section>
          )}

          {/* Orari - assente per le strutture solo censite, non verificate */}
          {hourGroups.length > 0 && (
            <section>
              <h2 className="border-b-2 border-accent-wash pb-2 text-lg font-black uppercase tracking-tight text-ink">
                Orari di apertura
              </h2>
              <dl className="mt-4 flex flex-col gap-2 text-sm">
                {hourGroups.map((group) => (
                  <div key={group.days.join()} className="flex justify-between">
                    <dt className="text-ink-muted">{formatDayRange(group.days)}</dt>
                    <dd className="font-medium text-ink">
                      {group.opensAt} - {group.closesAt}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Linee di tiro - assenti per le strutture solo censite, non verificate */}
          {range.lines.length > 0 && (
            <section>
              <h2 className="border-b-2 border-accent-wash pb-2 text-lg font-black uppercase tracking-tight text-ink">
                Linee di tiro
              </h2>
              <div className="mt-4 flex flex-col gap-3">
                {range.lines.map((line) => (
                  <div key={line.name} className="rounded-panel border border-hairline bg-surface-sunken p-4">
                    <div className="flex items-center justify-between gap-3">
                      <h3 className="font-medium text-ink">{line.name}</h3>
                      <span className="flex items-center gap-1.5 text-xs text-ink-muted">
                        {line.isIndoor ? (
                          <House size={14} aria-hidden />
                        ) : (
                          <CloudSun size={14} aria-hidden />
                        )}
                        {line.isIndoor ? 'Coperta' : 'Scoperta'}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-ink-muted">
                      <span className="font-medium text-ink">Calibri:</span> {line.calibers.join(', ')}
                    </p>
                    {line.disciplines.length > 0 && (
                      <p className="mt-1 text-sm text-ink-muted">
                        <span className="font-medium text-ink">Discipline:</span>{' '}
                        {line.disciplines.map((d) => DISCIPLINE_LABEL[d]).join(', ')}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Listino */}
          {range.pricing.length > 0 && (
            <section>
              <h2 className="border-b-2 border-accent-wash pb-2 text-lg font-black uppercase tracking-tight text-ink">
                Listino
              </h2>
              <dl className="mt-4 flex flex-col gap-3 text-sm">
                {range.pricing.map((p) => (
                  <div key={p.item} className="flex items-baseline justify-between gap-4">
                    <dt className="text-ink-muted">
                      {p.item}
                      {p.note && <span className="block text-xs text-ink-faint">{p.note}</span>}
                    </dt>
                    <dd className="whitespace-nowrap font-medium text-ink">
                      {formatPrice(p.priceCents)}
                      {p.unit && <span className="text-ink-faint"> / {p.unit}</span>}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {/* Servizi - solo in positivo: quello che manca non interessa chi legge */}
          {availableServices.length > 0 && (
            <section>
              <h2 className="border-b-2 border-accent-wash pb-2 text-lg font-black uppercase tracking-tight text-ink">
                Servizi
              </h2>
              <ul className="mt-4 flex flex-wrap gap-2">
                {availableServices.map((s) => (
                  <li
                    key={s.service}
                    className="rounded-full bg-surface-sunken px-3 py-1.5 text-sm text-ink"
                  >
                    {s.service}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Mappa */}
        <section className="border-t border-hairline py-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-black uppercase tracking-tight text-ink">Dove si trova</h2>
            <a
              href={`https://www.google.com/maps/dir/?api=1&destination=${range.location.lat},${range.location.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-accent hover:text-accent-hover"
            >
              <NavigationArrow size={16} aria-hidden />
              Indicazioni stradali
            </a>
          </div>
          <div className="mt-4 overflow-hidden rounded-panel border border-hairline">
            <iframe
              key={`${range.location.lat},${range.location.lng}`}
              title={`Mappa di ${range.name}`}
              src={`https://www.google.com/maps?q=${range.location.lat},${range.location.lng}&z=15&output=embed`}
              className="h-80 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        {/* CTA prenotazione */}
        <div className="border-t border-hairline py-10 text-center">
          <Link
            href={`/cerca?range=${range.slug}`}
            className="inline-block rounded-control bg-accent px-8 py-3 text-sm font-bold uppercase tracking-wide text-accent-ink hover:bg-accent-hover"
          >
            Verifica disponibilità e prenota
          </Link>
        </div>
      </Container>
    </>
  );
}
