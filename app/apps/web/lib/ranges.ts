/**
 * Accesso ai dati struttura per il sito — sostituisce lib/fixtures.ts.
 *
 * Le query vere vivono in @poligoni/db/queries/ranges (server-only: usano
 * `postgres`, non bundlabile nel browser). Qui solo il re-export e la
 * mappatura verso la forma usata dalle liste di ricerca.
 */
import type { Range, RangeSearchResult } from '@poligoni/schemas/ranges';

export {
  listRangeSummaries,
  findRangeBySlug,
  regionCounts,
  regionNameFromSlug,
  provinceCountsInRegion,
  rangesByProvincia,
  distinctRegioneProvinciaPairs,
  allRegioneProvinciaSlugParams,
  type RangeSummary,
} from '@poligoni/db/queries/ranges';

/**
 * lines/hasIndoor sono sempre vuoti: il censimento non include le linee di
 * tiro verificate per queste strutture, solo anagrafica e posizione. Meglio
 * un campo onestamente vuoto che una linea inventata.
 */
export function toSearchResult(
  range: Pick<Range, 'id' | 'slug' | 'name' | 'type' | 'comune' | 'provincia' | 'regione' | 'status'> & {
    location: { lat: number; lng: number };
  },
): Omit<RangeSearchResult, 'distanceKm' | 'openNow'> & {
  lat: number;
  lng: number;
} {
  return {
    id: range.id ?? range.slug,
    slug: range.slug,
    name: range.name,
    type: range.type,
    comune: range.comune,
    provincia: range.provincia,
    regione: range.regione,
    status: range.status ?? 'censito',
    lines: [],
    hasIndoor: false,
    lat: range.location.lat,
    lng: range.location.lng,
  };
}
