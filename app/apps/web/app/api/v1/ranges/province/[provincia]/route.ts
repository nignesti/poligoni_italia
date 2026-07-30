/**
 * GET /api/v1/ranges/province/:provincia
 *
 * Elenco poligoni per provincia (Piano_Sviluppo_App.md §6.1).
 * Usato dalle pagine provinciali SEO.
 * Pubblica, con cache. In produzione: query Drizzle.
 */
import { type NextRequest } from 'next/server';
import { json, notFound, withCache } from '../../../../_utils';
import { rangesByProvincia } from '@/lib/fixtures';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ provincia: string }> },
) {
  const { provincia } = await props.params;

  // `provincia` arriva già come slug (lib/slugify.ts), non un semplice
  // .toLowerCase(): rangesByProvincia si aspetta lo stesso formato.
  const normalized = provincia;
  const ranges = rangesByProvincia(normalized);

  if (ranges.length === 0) {
    return notFound(`Nessun poligono trovato in provincia di ${provincia}`);
  }

  const data = ranges.map((r) => ({
    slug: r.slug,
    name: r.name,
    type: r.type,
    comune: r.comune,
    lines: r.lines.map((l) => `${l.distanceMeters} m`),
    hasIndoor: r.lines.some((l) => l.isIndoor),
    status: r.status,
  }));

  return withCache(json({
    provincia: normalized,
    data,
    total: data.length,
  }));
}
