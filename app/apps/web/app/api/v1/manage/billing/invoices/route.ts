/**
 * GET  /api/v1/manage/billing/invoices?rangeId=&from=&to=
 * POST /api/v1/manage/billing/invoices
 *
 * Fatture SaaS Pro di una struttura (Piano_Sviluppo_App.md §6.1, task 69).
 */
import { type NextRequest } from 'next/server';
import { billingReportQuerySchema, createInvoiceSchema } from '@poligoni/schemas/billing';
import { badRequest, json, notFound, validate } from '../../../../_utils';
import {
  createInvoiceForSubscription,
  getRangeIdForSubscription,
  listInvoicesForRange,
} from '@poligoni/db/queries/billing';
import { requireManagerOf } from '@/lib/authGuard';

export async function GET(request: NextRequest) {
  const params = Object.fromEntries(request.nextUrl.searchParams.entries());
  const parsed = validate(billingReportQuerySchema, params);
  if ('error' in parsed) return parsed.error;

  const { rangeId, from, to } = parsed.data;

  const auth = await requireManagerOf(rangeId);
  if ('error' in auth) return auth.error;

  const invoices = await listInvoicesForRange(rangeId, from, to);

  return json({ invoices });
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = validate(createInvoiceSchema, body);
  if ('error' in parsed) return parsed.error;

  const { rangeSubscriptionId, lineItems } = parsed.data;

  const rangeId = await getRangeIdForSubscription(rangeSubscriptionId);
  if (!rangeId) return notFound('Abbonamento non trovato');

  const auth = await requireManagerOf(rangeId);
  if ('error' in auth) return auth.error;

  const invoice = await createInvoiceForSubscription(rangeSubscriptionId, lineItems);
  if (!invoice) return badRequest('Abbonamento non trovato');

  return json(invoice, 201);
}
