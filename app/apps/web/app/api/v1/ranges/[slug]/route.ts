/**
 * GET /api/v1/ranges/:slug
 *
 * Dettaglio struttura (Piano_Sviluppo_App.md §6.1).
 * Pubblica, con cache. In produzione: query Drizzle su Supabase.
 */
import { type NextRequest } from 'next/server';
import { badRequest, json, notFound, withCache } from '../../../_utils';

// ---------------------------------------------------------------------------
// Mock — in produzione: db.ranges.findFirst({ where: eq(ranges.slug, slug) })
// ---------------------------------------------------------------------------
const MOCK_DB: Record<string, unknown> = {
  'tsn-milano': {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    slug: 'tsn-milano',
    name: 'TSN Milano — Sezione di tiro a segno',
    type: 'tsn',
    address: "Viale dell'Arte, 12",
    comune: 'Milano',
    provincia: 'Milano',
    regione: 'Lombardia',
    cap: '20149',
    location: { lat: 45.467, lng: 9.168 },
    phone: '+39 02 1234567',
    email: 'info@tsnmilano.it',
    website: 'https://tsnmilano.it',
    description:
      "Il Tiro a Segno Nazionale di Milano è una delle sezioni più storiche d'Italia, fondata nel 1888. Dispone di linee per tiro a segno da 10 m, 25 m e 50 m, sia coperte che scoperte, con attrezzature elettroniche SIUS per la rilevazione dei colpi.",
    externalBookingUrl: null,
    managementSoftware: null,
    status: 'partner',
    dataSource: 'verifica_diretta',
    verifiedAt: '2026-07-15T10:00:00.000Z',
    lines: [
      { id: 'b1c2d3e4-0001-4000-8000-000000000001', name: '10 m — coperta', distanceMeters: 10, isIndoor: true, capacity: 10, calibers: ['.22 LR', '9x21', 'aria compressa'], disciplines: ['tiro_a_segno'] },
      { id: 'b1c2d3e4-0002-4000-8000-000000000002', name: '25 m — coperta', distanceMeters: 25, isIndoor: true, capacity: 8, calibers: ['.22 LR', '9x21', '.38 Special', '.357 Magnum', '.45 ACP'], disciplines: ['tiro_a_segno', 'tiro_difensivo'] },
      { id: 'b1c2d3e4-0003-4000-8000-000000000003', name: '50 m — coperta', distanceMeters: 50, isIndoor: true, capacity: 6, calibers: ['.22 LR', '.308 Win', '6.5 Creedmoor'], disciplines: ['tiro_a_segno'] },
    ],
    hours: [
      { day: 'Lunedì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Lunedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Martedì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Martedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Mercoledì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Mercoledì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Giovedì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Giovedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Venerdì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Venerdì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Sabato', opensAt: '09:00', closesAt: '18:00' },
      { day: 'Domenica', opensAt: '09:00', closesAt: '13:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1500 },
      { service: 'Istruttore', available: true, priceCents: 3000 },
      { service: 'Armiario', available: true },
      { service: 'Bar/Ristoro', available: true },
      { service: 'Parcheggio', available: true },
      { service: 'Vendita munizioni', available: true },
    ],
    pricing: [
      { item: 'Ingresso linea 10 m', priceCents: 800, unit: 'sessione' },
      { item: 'Ingresso linea 25 m', priceCents: 1200, unit: 'sessione' },
      { item: 'Ingresso linea 50 m', priceCents: 1500, unit: 'sessione' },
      { item: 'Abbonamento mensile', priceCents: 5000, unit: 'mese' },
    ],
  },
  'tsn-roma': {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    slug: 'tsn-roma',
    name: 'TSN Roma — Sezione di tiro a segno',
    type: 'tsn',
    address: 'Via del Tiro a Segno, 45',
    comune: 'Roma',
    provincia: 'Roma',
    regione: 'Lazio',
    cap: '00135',
    location: { lat: 41.924, lng: 12.462 },
    phone: '+39 06 9876543',
    email: 'info@tsnroma.it',
    website: null,
    description:
      "Il Tiro a Segno Nazionale di Roma, fondato nel 1897, si trova all'interno del comprensorio del Foro Italico. Linee da 10 m, 25 m e 50 m coperte, con impianto di ventilazione e sistema di punteria elettronica.",
    externalBookingUrl: null,
    managementSoftware: null,
    status: 'partner',
    dataSource: 'verifica_diretta',
    verifiedAt: '2026-07-20T14:00:00.000Z',
    lines: [
      { id: 'b1c2d3e4-0004-4000-8000-000000000004', name: '10 m — coperta', distanceMeters: 10, isIndoor: true, capacity: 12, calibers: ['.22 LR', 'aria compressa'], disciplines: ['tiro_a_segno'] },
      { id: 'b1c2d3e4-0005-4000-8000-000000000005', name: '25 m — coperta', distanceMeters: 25, isIndoor: true, capacity: 8, calibers: ['.22 LR', '9x21', '.45 ACP'], disciplines: ['tiro_a_segno', 'tiro_difensivo'] },
      { id: 'b1c2d3e4-0006-4000-8000-000000000006', name: '50 m — coperta', distanceMeters: 50, isIndoor: true, capacity: 6, calibers: ['.22 LR', '.308 Win'], disciplines: ['tiro_a_segno'] },
    ],
    hours: [
      { day: 'Martedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Mercoledì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Mercoledì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Giovedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Venerdì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Venerdì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Sabato', opensAt: '09:00', closesAt: '17:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1500 },
      { service: 'Istruttore', available: true, priceCents: 3500 },
      { service: 'Bar/Ristoro', available: true },
      { service: 'Parcheggio', available: true },
    ],
    pricing: [
      { item: 'Ingresso giornaliero', priceCents: 1000, unit: 'giorno' },
      { item: 'Abbonamento annuale', priceCents: 25000, unit: 'anno' },
    ],
  },
};

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;

  // Valida slug
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return badRequest('Slug non valido');
  }

  const range = MOCK_DB[slug];
  if (!range) {
    return notFound('Poligono non trovato');
  }

  return withCache(json(range));
}
