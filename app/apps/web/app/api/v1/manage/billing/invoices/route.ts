/**
 * GET  /api/v1/manage/billing/invoices?rangeId=&from=&to=
 * POST /api/v1/manage/billing/invoices
 *
 * Fatture SaaS Pro di una struttura (Piano_Sviluppo_App.md §6.1, task 69).
 *
 * ⚠️  Nessuna verifica che il chiamante gestisca la struttura collegata
 * all'abbonamento: l'autenticazione Supabase (Piano §7.3 task 13) non è
 * ancora integrata in nessuna rotta del sito.
 */
import { type NextRequest } from 'next/server';
import { billingReportQuerySchema, createInvoiceSchema } from '@poligoni/schemas/billing';
import { badRequest, json, validate } from '../../../../_utils';
import { createInvoiceForSubscription, listInvoicesForRange } from '@poligoni/db/queries/billing';

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = validate(billingReportQuerySchema, params);
  if ('error' in parsed) return parsed.error;

  const { rangeId, from, to } = parsed.data;
  const invoices = await listInvoicesForRange(rangeId, from, to);

  return json({ invoices });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = validate(createInvoiceSchema, body);
  if ('error' in parsed) return parsed.error;

  const { rangeSubscriptionId, lineItems } = parsed.data;
  const invoice = await createInvoiceForSubscription(rangeSubscriptionId, lineItems);
  if (!invoice) return badRequest('Abbonamento non trovato');

  return json(invoice, 201);
}
