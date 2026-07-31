/**
 * GET  /api/v1/manage/billing/config?rangeId=
 * POST /api/v1/manage/billing/config
 *
 * Dati fiscali del gestore per la fatturazione (Piano_Sviluppo_App.md §6.1,
 * task 69). L'utente è quello della sessione, mai un id passato dal client.
 */
import { type NextRequest } from 'next/server';
import { billingConfigQuerySchema, upsertManagerBillingConfigSchema } from '@poligoni/schemas/billing';
import { validateFiscalCode, validateVATNumber } from '@poligoni/core/billing';
import { badRequest, json, notFound, validate } from '../../../../_utils';
import { getBillingConfig, upsertBillingConfig } from '@poligoni/db/queries/billing';
import { requireManagerOf } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = validate(billingConfigQuerySchema, params);
  if ('error' in parsed) return parsed.error;

  const auth = await requireManagerOf(parsed.data.rangeId);
  if ('error' in auth) return auth.error;

  const config = await getBillingConfig(parsed.data.rangeId, auth.userId);
  if (!config) return notFound('Configurazione di fatturazione non trovata');

  return json(config);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = validate(upsertManagerBillingConfigSchema, body);
  if ('error' in parsed) return parsed.error;

  const { rangeId, ...data } = parsed.data;

  const auth = await requireManagerOf(rangeId);
  if ('error' in auth) return auth.error;

  if (data.vatNumber && !validateVATNumber(data.vatNumber)) {
    return badRequest('Partita IVA non valida');
  }
  if (data.fiscalCode && !validateFiscalCode(data.fiscalCode)) {
    return badRequest('Codice fiscale non valido');
  }

  const config = await upsertBillingConfig(rangeId, auth.userId, data);
  return json(config, 201);
}
