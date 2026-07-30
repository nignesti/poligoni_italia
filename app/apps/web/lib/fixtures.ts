import type { Range, RangeSearchResult } from '@poligoni/schemas/ranges';
import { slugify } from './slugify';

/**
 * DATI DIMOSTRATIVI - sostituiscono i quattro dataset mock in precedenza
 * duplicati (per copia-incolla) fra home, scheda struttura, pagina provincia,
 * ricerca e le tre API route.
 *
 * CORREZIONE (audit del 30/07/2026): la versione precedente attribuiva orari,
 * telefoni ed email inventati a organizzazioni realmente esistenti e
 * identificabili ("TSN Milano", "TSN Roma", "TSN Napoli", "TSN Torino",
 * "TSN Bologna", "TSN Firenze" sono le denominazioni ufficiali di sezioni
 * reali dell'Unione Italiana Tiro a Segno). Pubblicare informazioni false a
 * loro nome è un problema serio, non un dettaglio estetico.
 *
 * Qui i comuni sono reali (i link a regione/provincia hanno senso), ma il
 * NOME della struttura, l'indirizzo, i recapiti e gli orari sono
 * chiaramente inventati - lo stesso principio con cui un sito demo di
 * e-commerce userebbe "Trattoria da Mario, Milano" come esercizio di
 * fantasia in una città vera.
 *
 * Il censimento reale nasce dal lavoro di T1 (Piano_Sviluppo_App.md, task
 * 3-4) e sostituirà interamente questo file.
 */

export const DEMO_RANGES: Range[] = [
  {
    id: 'a1b2c3d4-1001-4000-8000-000000000101',
    slug: 'poligono-cascina-rossa',
    name: 'Poligono Cascina Rossa',
    type: 'privato',
    address: 'Via delle Fornaci 44',
    comune: 'Corsico',
    provincia: 'Milano',
    regione: 'Lombardia',
    cap: '20094',
    location: { lat: 45.4297, lng: 9.1119 },
    phone: '+39 02 5551 0142',
    email: 'segreteria@cascinarossa.example',
    website: null,
    description:
      'Sei linee coperte a 10 e 25 metri e un campo a 50 metri, aperto anche il martedì e il giovedì sera.',
    externalBookingUrl: null,
    managementSoftware: 'GESTIT',
    status: 'partner',
    dataSource: 'verifica_diretta',
    verifiedAt: '2026-07-24T09:00:00.000Z',
    lines: [
      {
        name: 'Linea 10 m, stand coperto',
        distanceMeters: 10,
        isIndoor: true,
        capacity: 6,
        calibers: ['.22 LR', 'aria compressa'],
        disciplines: ['tiro_a_segno'],
      },
      {
        name: 'Linea 25 m, stand coperto',
        distanceMeters: 25,
        isIndoor: true,
        capacity: 6,
        calibers: ['.22 LR', '9x21', '.38 Special', '.45 ACP'],
        disciplines: ['tiro_a_segno', 'tiro_difensivo'],
      },
      {
        name: 'Campo 50 m',
        distanceMeters: 50,
        isIndoor: false,
        capacity: 4,
        calibers: ['.22 LR', '.308 Win', '6.5 Creedmoor'],
        disciplines: ['tiro_a_segno'],
      },
    ],
    hours: [
      { day: 'Martedì', opensAt: '15:00', closesAt: '22:00' },
      { day: 'Mercoledì', opensAt: '15:00', closesAt: '19:30' },
      { day: 'Giovedì', opensAt: '15:00', closesAt: '22:00' },
      { day: 'Venerdì', opensAt: '15:00', closesAt: '19:30' },
      { day: 'Sabato', opensAt: '09:00', closesAt: '18:00' },
      { day: 'Domenica', opensAt: '09:00', closesAt: '13:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1500 },
      { service: 'Istruttore', available: true, priceCents: 3500 },
      { service: 'Armadietto personale', available: true },
      { service: 'Parcheggio', available: true },
      { service: 'Accesso senza barriere', available: true },
    ],
    pricing: [
      { item: 'Linea 10 m', priceCents: 900, unit: 'ora' },
      { item: 'Linea 25 m', priceCents: 1200, unit: 'ora' },
      { item: 'Campo 50 m', priceCents: 1600, unit: 'ora' },
      { item: 'Quota associativa', priceCents: 8000, unit: 'anno', note: 'Obbligatoria per l’accesso continuativo' },
    ],
  },
  {
    id: 'a1b2c3d4-1002-4000-8000-000000000102',
    slug: 'tsn-valdiserra',
    name: 'TSN Valdiserra',
    type: 'tsn',
    address: 'Via del Tiro 8',
    comune: 'Rho',
    provincia: 'Milano',
    regione: 'Lombardia',
    cap: '20017',
    location: { lat: 45.531, lng: 9.038 },
    phone: '+39 02 5551 0287',
    email: null,
    website: null,
    description:
      'Sezione di tiro a segno con due linee a 10 e 25 metri, rilascio del DIMA su appuntamento.',
    externalBookingUrl: null,
    managementSoftware: null,
    status: 'censito',
    dataSource: 'censimento_pubblico',
    verifiedAt: '2026-06-30T09:00:00.000Z',
    lines: [
      {
        name: 'Linea 10 m',
        distanceMeters: 10,
        isIndoor: true,
        capacity: 10,
        calibers: ['.22 LR', 'aria compressa'],
        disciplines: ['tiro_a_segno'],
      },
      {
        name: 'Linea 25 m',
        distanceMeters: 25,
        isIndoor: true,
        capacity: 8,
        calibers: ['.22 LR', '9x21', '.45 ACP'],
        disciplines: ['tiro_a_segno', 'tiro_difensivo'],
      },
    ],
    hours: [
      { day: 'Lunedì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Mercoledì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Venerdì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Sabato', opensAt: '09:00', closesAt: '17:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1200 },
      { service: 'Bar', available: true },
      { service: 'Parcheggio', available: true },
    ],
    pricing: [
      { item: 'Ingresso giornaliero', priceCents: 1000, unit: 'giorno' },
      { item: 'Abbonamento annuale', priceCents: 22000, unit: 'anno' },
    ],
  },
  {
    id: 'a1b2c3d4-1003-4000-8000-000000000103',
    slug: 'campo-tiro-santilario',
    name: 'Campo di Tiro Sant’Ilario',
    type: 'long_range',
    address: 'Strada Provinciale 14, km 3',
    comune: 'Frascati',
    provincia: 'Roma',
    regione: 'Lazio',
    cap: '00044',
    location: { lat: 41.807, lng: 12.682 },
    phone: '+39 06 5551 0398',
    email: 'info@santilario.example',
    website: 'https://santilario.example',
    description:
      'Campo aperto fino a 300 metri, attivo nei fine settimana da marzo a novembre.',
    externalBookingUrl: null,
    managementSoftware: null,
    status: 'censito',
    dataSource: 'censimento_pubblico',
    verifiedAt: '2026-07-10T09:00:00.000Z',
    lines: [
      {
        name: 'Campo 100-300 m',
        distanceMeters: 300,
        isIndoor: false,
        capacity: 4,
        calibers: ['.308 Win', '6.5 Creedmoor', '.30-06'],
        disciplines: ['long_range'],
      },
    ],
    hours: [
      { day: 'Sabato', opensAt: '09:00', closesAt: '17:00' },
      { day: 'Domenica', opensAt: '09:00', closesAt: '13:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: false },
      { service: 'Parcheggio', available: true },
    ],
    pricing: [{ item: 'Sessione 100-300 m', priceCents: 2500, unit: 'ora' }],
  },
  {
    id: 'a1b2c3d4-1004-4000-8000-000000000104',
    slug: 'tsn-collealto',
    name: 'TSN Collealto',
    type: 'tsn',
    address: 'Via Foro Nuovo 3',
    comune: 'Roma',
    provincia: 'Roma',
    regione: 'Lazio',
    cap: '00135',
    location: { lat: 41.924, lng: 12.462 },
    phone: '+39 06 5551 0119',
    email: null,
    website: null,
    description: 'Tre linee coperte a 10, 25 e 50 metri, impianto di ventilazione recente.',
    externalBookingUrl: null,
    managementSoftware: 'T.A.R.G.E.T.',
    status: 'partner',
    dataSource: 'verifica_diretta',
    verifiedAt: '2026-07-18T09:00:00.000Z',
    lines: [
      {
        name: 'Linea 10 m',
        distanceMeters: 10,
        isIndoor: true,
        capacity: 12,
        calibers: ['.22 LR', 'aria compressa'],
        disciplines: ['tiro_a_segno'],
      },
      {
        name: 'Linea 25 m',
        distanceMeters: 25,
        isIndoor: true,
        capacity: 8,
        calibers: ['.22 LR', '9x21', '.45 ACP'],
        disciplines: ['tiro_a_segno', 'tiro_difensivo'],
      },
      {
        name: 'Linea 50 m',
        distanceMeters: 50,
        isIndoor: true,
        capacity: 6,
        calibers: ['.22 LR', '.308 Win'],
        disciplines: ['tiro_a_segno'],
      },
    ],
    hours: [
      { day: 'Martedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Mercoledì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Giovedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Venerdì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Sabato', opensAt: '09:00', closesAt: '17:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1500 },
      { service: 'Istruttore', available: true, priceCents: 3500 },
      { service: 'Bar', available: true },
      { service: 'Parcheggio', available: true },
    ],
    pricing: [
      { item: 'Ingresso giornaliero', priceCents: 1000, unit: 'giorno' },
      { item: 'Abbonamento annuale', priceCents: 25000, unit: 'anno' },
    ],
  },
  {
    id: 'a1b2c3d4-1005-4000-8000-000000000105',
    slug: 'poligono-monteserra',
    name: 'Poligono Monteserra',
    type: 'dinamico',
    address: 'Via Industriale 21',
    comune: 'Napoli',
    provincia: 'Napoli',
    regione: 'Campania',
    cap: '80144',
    location: { lat: 40.853, lng: 14.25 },
    phone: '+39 081 555 0176',
    email: 'segreteria@monteserra.example',
    website: null,
    description: 'Campo dinamico coperto, due stage attrezzati per IDPA e tiro pratico.',
    externalBookingUrl: null,
    managementSoftware: null,
    status: 'censito',
    dataSource: 'censimento_pubblico',
    verifiedAt: '2026-07-05T09:00:00.000Z',
    lines: [
      {
        name: 'Stage dinamico A',
        distanceMeters: 25,
        isIndoor: true,
        capacity: 1,
        calibers: ['9x21', '.40 S&W'],
        disciplines: ['tiro_dinamico'],
      },
    ],
    hours: [
      { day: 'Lunedì', opensAt: '17:00', closesAt: '21:00' },
      { day: 'Giovedì', opensAt: '17:00', closesAt: '21:00' },
      { day: 'Sabato', opensAt: '10:00', closesAt: '18:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1800 },
      { service: 'Istruttore', available: true, priceCents: 4000 },
    ],
    pricing: [{ item: 'Stage dinamico', priceCents: 1800, unit: 'ora' }],
  },
  {
    id: 'a1b2c3d4-1006-4000-8000-000000000106',
    slug: 'tsn-portafiore',
    name: 'TSN Portafiore',
    type: 'tsn',
    address: 'Corso Regina 210',
    comune: 'Torino',
    provincia: 'Torino',
    regione: 'Piemonte',
    cap: '10152',
    location: { lat: 45.07, lng: 7.687 },
    phone: '+39 011 555 0143',
    email: null,
    website: null,
    description: 'Sezione storica con linee a 10, 25 e 50 metri, tesseramento UITS e FITDS.',
    externalBookingUrl: 'https://prenotazioni-portafiore.example',
    managementSoftware: 'ArMa Informatica',
    status: 'partner',
    dataSource: 'verifica_diretta',
    verifiedAt: '2026-07-21T09:00:00.000Z',
    lines: [
      {
        name: 'Linea 10 m',
        distanceMeters: 10,
        isIndoor: true,
        capacity: 10,
        calibers: ['.22 LR', 'aria compressa'],
        disciplines: ['tiro_a_segno'],
      },
      {
        name: 'Linea 25 m',
        distanceMeters: 25,
        isIndoor: true,
        capacity: 8,
        calibers: ['.22 LR', '9x21', '.45 ACP'],
        disciplines: ['tiro_a_segno', 'tiro_difensivo'],
      },
      {
        name: 'Linea 50 m',
        distanceMeters: 50,
        isIndoor: true,
        capacity: 6,
        calibers: ['.22 LR', '.308 Win', '6.5 Creedmoor'],
        disciplines: ['tiro_a_segno'],
      },
    ],
    hours: [
      { day: 'Lunedì', opensAt: '09:00', closesAt: '12:30' },
      { day: 'Lunedì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Mercoledì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Venerdì', opensAt: '14:00', closesAt: '19:00' },
      { day: 'Sabato', opensAt: '09:00', closesAt: '18:00' },
    ],
    services: [
      { service: 'Noleggio armi', available: true, priceCents: 1500 },
      { service: 'Armadietto personale', available: true },
      { service: 'Parcheggio', available: true },
    ],
    pricing: [
      { item: 'Ingresso giornaliero', priceCents: 1100, unit: 'giorno' },
      { item: 'Abbonamento annuale', priceCents: 24000, unit: 'anno' },
    ],
  },
];

// ---------------------------------------------------------------------------
// Indici derivati
// ---------------------------------------------------------------------------

export function findRangeBySlug(slug: string): Range | undefined {
  return DEMO_RANGES.find((r) => r.slug === slug);
}

export function rangesByProvincia(provinciaSlug: string): Range[] {
  return DEMO_RANGES.filter((r) => slugify(r.provincia) === provinciaSlug);
}

export function toSearchResult(
  range: Range,
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
    lines: range.lines.map((l) => `${l.distanceMeters} m`),
    hasIndoor: range.lines.some((l) => l.isIndoor),
    status: range.status ?? 'censito',
    lat: range.location.lat,
    lng: range.location.lng,
  };
}

/** Regioni con conteggio strutture, per la homepage. Deriva dai dati, non è dichiarato a mano. */
export function regionCounts(): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of DEMO_RANGES) {
    counts.set(r.regione, (counts.get(r.regione) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}

/** Nome della regione a partire dallo slug, o undefined se non censita. */
export function regionNameFromSlug(regioneSlug: string): string | undefined {
  return DEMO_RANGES.find((r) => slugify(r.regione) === regioneSlug)?.regione;
}

/** Province con conteggio strutture all'interno di una regione. */
export function provinceCountsInRegion(
  regioneSlug: string,
): { name: string; slug: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const r of DEMO_RANGES) {
    if (slugify(r.regione) !== regioneSlug) continue;
    counts.set(r.provincia, (counts.get(r.provincia) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name, slug: slugify(name), count }))
    .sort((a, b) => b.count - a.count);
}
