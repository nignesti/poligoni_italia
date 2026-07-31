/**
 * GET /api/v1/ranges/:slug
 *
 * Dettaglio struttura (Piano_Sviluppo_App.md §6.1).
 * Pubblica, con cache.
 */
import { type NextRequest } from 'next/server';
import { badRequest, json, notFound, withCache } from '../../../_utils';
import { findRangeBySlug } from '@/lib/ranges';

export async function GET(
  _request: NextRequest,
  props: { params: Promise<{ slug: string }> },
) {
  const { slug } = await props.params;

  // Valida slug
  if (!slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
    return badRequest('Slug non valido');
  }

  const range = await findRangeBySlug(slug);
  if (!range) {
    return notFound('Poligono non trovato');
  }

  return withCache(json(range));
}
