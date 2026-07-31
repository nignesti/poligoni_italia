/**
 * GET  /api/v1/manage/billing/subscription?rangeId=
 * POST /api/v1/manage/billing/subscription
 *
 * Abbonamento SaaS Pro di una struttura (Piano_Sviluppo_App.md §6.1, task 69).
 */
import { type NextRequest } from 'next/server';
import { subscribeToPlanSchema, subscriptionQuerySchema } from '@poligoni/schemas/billing';
import { badRequest, json, notFound, validate } from '../../../../_utils';
import { getActiveSubscriptionForRange, subscribeRangeToPlan } from '@poligoni/db/queries/billing';
import { requireManagerOf } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = validate(subscriptionQuerySchema, params);
  if ('error' in parsed) return parsed.error;

  const auth = await requireManagerOf(parsed.data.rangeId);
  if ('error' in auth) return auth.error;

  const result = await getActiveSubscriptionForRange(parsed.data.rangeId);
  if (!result) return notFound('Nessun abbonamento attivo per questa struttura');

  return json(result);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = validate(subscribeToPlanSchema, body);
  if ('error' in parsed) return parsed.error;

  const { rangeId, planId, autoRenew } = parsed.data;

  const auth = await requireManagerOf(rangeId);
  if ('error' in auth) return auth.error;

  const subscription = await subscribeRangeToPlan(rangeId, planId, autoRenew ?? true);
  if (!subscription) return badRequest('Piano non trovato');

  return json(subscription, 201);
}
