/**
 * GET /api/v1/ranges/search?lat&lng&radius&calibers&disciplines&indoor&openNow&type&limit
 *
 * Ricerca poligoni per raggio geografico (Piano_Sviluppo_App.md §6.1).
 * Pubblica, con cache. In produzione: query PostGIS con Drizzle.
 */
import { type NextRequest } from 'next/server';
import { rangeSearchQuerySchema } from '@poligoni/schemas/ranges';
import { json, methodNotAllowed, validate, withCache } from '../../../_utils';
import { DEMO_RANGES, toSearchResult } from '@/lib/fixtures';

const MOCK_RESULTS = DEMO_RANGES.map(toSearchResult);

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
  void disciplines; // In produzione: filtro per disciplina dalle linee

  const results = MOCK_RESULTS
    .map((r) => ({
      ...r,
      distanceKm: Math.round(haversineKm(lat, lng, r.lat, r.lng) * 10) / 10,
    }))
    .filter((r) => r.distanceKm <= (radius ?? 50))
    .filter((r) => !type || r.type === type)
    .filter((r) => !indoor || r.hasIndoor === indoor)
    .filter(() => !calibers || calibers.length === 0 || true) // In produzione: filtro per calibri dalle linee
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
