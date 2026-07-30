/**
 * GET /api/v1/ranges/province/:provincia
 *
 * Elenco poligoni per provincia (Piano_Sviluppo_App.md §6.1).
 * Usato dalle pagine provinciali SEO.
 * Pubblica, con cache. In produzione: query Drizzle.
 */
import { type NextRequest } from 'next/server';
import { json, notFound, withCache } from '../../../../_utils';

// ---------------------------------------------------------------------------
// Mock — in produzione: db.ranges.findMany({ where: eq(ranges.provincia, provincia) })
// ---------------------------------------------------------------------------
const MOCK_PROVINCE: Record<string, unknown[]> = {
  milano: [
    { slug: 'tsn-milano', name: 'TSN Milano', type: 'tsn', comune: 'Milano', lines: ['10 m', '25 m', '50 m'], hasIndoor: true, status: 'partner' },
    { slug: 'poligono-corsico', name: 'Poligono di Corsico', type: 'privato', comune: 'Corsico', lines: ['25 m', '50 m'], hasIndoor: false, status: 'censito' },
    { slug: 'tsn-rho', name: 'Tiro a Segno Rho', type: 'tsn', comune: 'Rho', lines: ['10 m', '25 m'], hasIndoor: true, status: 'censito' },
  ],
  roma: [
    { slug: 'tsn-roma', name: 'TSN Roma', type: 'tsn', comune: 'Roma', lines: ['10 m', '25 m', '50 m'], hasIndoor: true, status: 'partner' },
    { slug: 'poligono-tuscolo', name: 'Poligono Tuscolo', type: 'tiro_a_volo', comune: 'Frascati', lines: ['Fossa olimpica'], hasIndoor: false, status: 'censito' },
  ],
  napoli: [
    { slug: 'tsn-napoli', name: 'TSN Napoli', type: 'tsn', comune: 'Napoli', lines: ['10 m', '25 m'], hasIndoor: true, status: 'censito' },
  ],
  torino: [
    { slug: 'tsn-torino', name: 'TSN Torino', type: 'tsn', comune: 'Torino', lines: ['10 m', '25 m', '50 m'], hasIndoor: true, status: 'censito' },
    { slug: 'poligono-nichelino', name: 'Poligono di Nichelino', type: 'privato', comune: 'Nichelino', lines: ['25 m'], hasIndoor: false, status: 'censito' },
  ],
  bologna: [
    { slug: 'tsn-bologna', name: 'TSN Bologna', type: 'tsn', comune: 'Bologna', lines: ['10 m', '25 m', '50 m'], hasIndoor: true, status: 'censito' },
  ],
  firenze: [
    { slug: 'tsn-firenze', name: 'TSN Firenze', type: 'tsn', comune: 'Firenze', lines: ['10 m', '25 m'], hasIndoor: true, status: 'censito' },
  ],
};

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ provincia: string }> },
) {
  const { provincia } = await props.params;

  const normalized = provincia.toLowerCase();
  const ranges = MOCK_PROVINCE[normalized];

  if (!ranges) {
    return notFound(`Nessun poligono trovato in provincia di ${provincia}`);
  }

  return withCache(json({
    provincia: normalized,
    data: ranges,
    total: ranges.length,
  }));
}
