/**
 * GET /api/v1/manage/billing/plans
 *
 * Catalogo piani SaaS Pro (Piano_Sviluppo_App.md §6.1, task 69).
 * Pubblica, con cache: è lo stesso catalogo mostrato su /gestori.
 */
import { json, withCache } from '../../../../_utils';
import { listActivePlans } from '@poligoni/db/queries/billing';

export async function GET() {
  const plans = await listActivePlans();
  return withCache(json({ plans }), 3600);
}
