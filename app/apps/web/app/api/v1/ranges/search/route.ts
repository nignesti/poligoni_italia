/**
 * GET /api/v1/ranges/search?lat&lng&radius&calibers&disciplines&indoor&openNow&type&limit
 *
 * Ricerca poligoni per raggio geografico (Piano_Sviluppo_App.md §6.1).
 * Pubblica, con cache. In produzione: query PostGIS con Drizzle.
 */
import { type NextRequest } from 'next/server';
import { rangeSearchQuerySchema } from '@poligoni/schemas/ranges';
import { badRequest, json, methodNotAllowed, validate, withCache } from '../../../_utils';

// ---------------------------------------------------------------------------
// Mock data — in produzione: query Supabase/PostGIS
// ---------------------------------------------------------------------------
import type { RangeSearchResult, RangeType, RangeStatus } from '@poligoni/schemas/ranges';

const MOCK_RESULTS: (RangeSearchResult & { lat: number; lng: number })[] = [
  {
    id: 'a1b2c3d4-0001-4000-8000-000000000001',
    slug: 'tsn-milano',
    name: 'TSN Milano',
    type: 'tsn' as RangeType,
    comune: 'Milano',
    provincia: 'Milano',
    regione: 'Lombardia',
    distanceKm: null,
    lines: ['10 m', '25 m', '50 m'],
    hasIndoor: true,
    openNow: true,
    status: 'partner' as RangeStatus,
    lat: 45.467,
    lng: 9.168,
  },
  {
    id: 'a1b2c3d4-0002-4000-8000-000000000002',
    slug: 'tsn-roma',
    name: 'TSN Roma',
    type: 'tsn' as RangeType,
    comune: 'Roma',
    provincia: 'Roma',
    regione: 'Lazio',
    distanceKm: null,
    lines: ['10 m', '25 m', '50 m'],
    hasIndoor: true,
    openNow: false,
    status: 'partner' as RangeStatus,
    lat: 41.924,
    lng: 12.462,
  },
  {
    id: 'a1b2c3d4-0003-4000-8000-000000000003',
    slug: 'poligono-corsico',
    name: 'Poligono di Corsico',
    type: 'privato' as RangeType,
    comune: 'Corsico',
    provincia: 'Milano',
    regione: 'Lombardia',
    distanceKm: null,
    lines: ['25 m', '50 m'],
    hasIndoor: false,
    openNow: true,
    status: 'censito' as RangeStatus,
    lat: 45.430,
    lng: 9.110,
  },
  {
    id: 'a1b2c3d4-0004-4000-8000-000000000004',
    slug: 'tsn-napoli',
    name: 'TSN Napoli',
    type: 'tsn' as RangeType,
    comune: 'Napoli',
    provincia: 'Napoli',
    regione: 'Campania',
    distanceKm: null,
    lines: ['10 m', '25 m'],
    hasIndoor: true,
    openNow: true,
    status: 'censito' as RangeStatus,
    lat: 40.853,
    lng: 14.250,
  },
  {
    id: 'a1b2c3d4-0005-4000-8000-000000000005',
    slug: 'tsn-torino',
    name: 'TSN Torino',
    type: 'tsn' as RangeType,
    comune: 'Torino',
    provincia: 'Torino',
    regione: 'Piemonte',
    distanceKm: null,
    lines: ['10 m', '25 m', '50 m'],
    hasIndoor: true,
    openNow: false,
    status: 'censito' as RangeStatus,
    lat: 45.070,
    lng: 7.687,
  },
];

/** Distanza approssimativa in km con formula Haversine. */
function haversineKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const params = Object.fromEntries(searchParams.entries());

  const parsed = validate(rangeSearchQuerySchema, params);
  if ('error' in parsed) return parsed.error;

  const { lat, lng, radius, calibers, disciplines, indoor, type, limit } = parsed.data;

  // Filtra e calcola distanze
  const results = MOCK_RESULTS
    .map((r) => ({
      ...r,
      distanceKm: Math.round(haversineKm(lat, lng, r.lat, r.lng) * 10) / 10,
    }))
    .filter((r) => r.distanceKm <= (radius ?? 50))
    .filter((r) => !type || r.type === type)
    .filter((r) => !indoor || r.hasIndoor === indoor)
    .filter((r) => {
      if (!calibers || calibers.length === 0) return true;
      // In produzione: filter per calibri dalle linee
      return true;
    })
    .sort((a, b) => a.distanceKm - b.distanceKm)
    .slice(0, limit);

  // Rimuovi coordinate interne
  const data = results.map(({ lat: _lat, lng: _lng, ...rest }) => rest);

  return withCache(json({
    data,
    total: data.length,
    nextCursor: null,
  }));
}

export async function OPTIONS() {
  return methodNotAllowed();
}
