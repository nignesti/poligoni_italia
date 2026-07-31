/**
 * GET  /api/v1/manage/billing/config?rangeId=&userId=
 * POST /api/v1/manage/billing/config
 *
 * Dati fiscali del gestore per la fatturazione (Piano_Sviluppo_App.md §6.1,
 * task 69).
 *
 * ⚠️  `userId` arriva nella richiesta invece che da una sessione verificata:
 * l'autenticazione Supabase (Piano §7.3 task 13) non è ancora integrata in
 * nessuna rotta del sito. Va sostituito con l'utente autenticato prima del
 * rilascio pubblico di questa rotta.
 */
import { type NextRequest } from 'next/server';
import { billingConfigQuerySchema, manageBillingConfigRequestSchema } from '@poligoni/schemas/billing';
import { validateFiscalCode, validateVATNumber } from '@poligoni/core/billing';
import { badRequest, json, notFound, validate } from '../../../../_utils';
import { getBillingConfig, upsertBillingConfig } from '@poligoni/db/queries/billing';

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = validate(billingConfigQuerySchema, params);
  if ('error' in parsed) return parsed.error;

  const config = await getBillingConfig(parsed.data.rangeId, parsed.data.userId);
  if (!config) return notFound('Configurazione di fatturazione non trovata');

  return json(config);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = validate(manageBillingConfigRequestSchema, body);
  if ('error' in parsed) return parsed.error;

  const { rangeId, userId, ...data } = parsed.data;

  if (data.vatNumber && !validateVATNumber(data.vatNumber)) {
    return badRequest('Partita IVA non valida');
  }
  if (data.fiscalCode && !validateFiscalCode(data.fiscalCode)) {
    return badRequest('Codice fiscale non valido');
  }

  const config = await upsertBillingConfig(rangeId, userId, data);
  return json(config, 201);
}
