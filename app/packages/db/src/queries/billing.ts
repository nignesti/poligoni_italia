/**
 * Query e mutazioni SaaS Pro (Piano_Sviluppo_App.md task 69), usate dalle
 * route `/api/v1/manage/billing/*` (apps/web).
 *
 * ⚠️  Nessuna di queste funzioni verifica che il chiamante sia autorizzato a
 * gestire `rangeId`: l'autenticazione Supabase (Piano §7.3 task 13) non è
 * ancora integrata in nessuna rotta del sito. La verifica va aggiunta nella
 * route handler quando l'autenticazione esisterà — vedi commento nelle route.
 */
import { and, asc, count, desc, eq, gte, lte } from 'drizzle-orm';
import { calculateNextRenewalDate, calculateVAT, calculateDueDate, generateInvoiceNumber, ITALIAN_VAT_RATE } from '@poligoni/core/billing';
import { getDb } from '../client.js';
import { subscriptionPlans, rangeSubscriptions, invoices, billingHistory, managerBillingConfig } from '../schema/billing.js';

// ---------------------------------------------------------------------------
// Piani
// ---------------------------------------------------------------------------

/** Catalogo piani, dal più economico al più caro. */
export async function listActivePlans() {
  const db = getDb();
  return db.select().from(subscriptionPlans).orderBy(asc(subscriptionPlans.priceCents));
}

// ---------------------------------------------------------------------------
// Abbonamento
// ---------------------------------------------------------------------------

/** Abbonamento attivo di una struttura, con il piano già risolto. Null se assente. */
export async function getActiveSubscriptionForRange(rangeId: string) {
  const db = getDb();
  const [row] = await db
    .select({ subscription: rangeSubscriptions, plan: subscriptionPlans })
    .from(rangeSubscriptions)
    .innerJoin(subscriptionPlans, eq(rangeSubscriptions.planId, subscriptionPlans.id))
    .where(and(eq(rangeSubscriptions.rangeId, rangeId), eq(rangeSubscriptions.status, 'attivo')))
    .limit(1);
  return row ?? null;
}

/**
 * Sottoscrive una struttura a un piano, annullando l'abbonamento attivo
 * precedente (se esiste). Restituisce null se il piano non esiste.
 */
export async function subscribeRangeToPlan(rangeId: string, planId: string, autoRenew: boolean) {
  const db = getDb();

  const [plan] = await db.select().from(subscriptionPlans).where(eq(subscriptionPlans.id, planId)).limit(1);
  if (!plan) return null;

  await db
    .update(rangeSubscriptions)
    .set({ status: 'annullato', cancelledAt: new Date() })
    .where(and(eq(rangeSubscriptions.rangeId, rangeId), eq(rangeSubscriptions.status, 'attivo')));

  const startedAt = new Date();
  const renewsAt = calculateNextRenewalDate(startedAt, plan.billingPeriodDays);

  const [subscription] = await db
    .insert(rangeSubscriptions)
    .values({ rangeId, planId, status: 'attivo', startedAt, renewsAt, autoRenew })
    .returning();

  if (subscription) {
    await db.insert(billingHistory).values({
      rangeSubscriptionId: subscription.id,
      eventType: 'subscription_created',
      amountCents: plan.priceCents,
    });
  }

  return subscription ?? null;
}

// ---------------------------------------------------------------------------
// Fatture
// ---------------------------------------------------------------------------

export interface InvoiceLineInput {
  readonly description: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
  readonly totalPriceCents: number;
}

/** Fatture di una struttura in un intervallo di date (YYYY-MM-DD), più recenti prima. */
export async function listInvoicesForRange(rangeId: string, from: string, to: string) {
  const db = getDb();
  const rows = await db
    .select({ invoice: invoices })
    .from(invoices)
    .innerJoin(rangeSubscriptions, eq(invoices.rangeSubscriptionId, rangeSubscriptions.id))
    .where(
      and(
        eq(rangeSubscriptions.rangeId, rangeId),
        gte(invoices.invoiceDate, from),
        lte(invoices.invoiceDate, to),
      ),
    )
    .orderBy(desc(invoices.invoiceDate));
  return rows.map((r) => r.invoice);
}

/**
 * Emette una fattura per un abbonamento. Il numero è sequenziale sull'intera
 * struttura (non sul singolo abbonamento): la numerazione fiscale italiana
 * deve essere progressiva per soggetto, non azzerarsi a ogni rinnovo.
 * Restituisce null se l'abbonamento non esiste.
 */
export async function createInvoiceForSubscription(
  rangeSubscriptionId: string,
  lineItems: readonly InvoiceLineInput[],
) {
  const db = getDb();

  const [subscription] = await db
    .select()
    .from(rangeSubscriptions)
    .where(eq(rangeSubscriptions.id, rangeSubscriptionId))
    .limit(1);
  if (!subscription) return null;

  const subtotalCents = lineItems.reduce((sum, item) => sum + item.totalPriceCents, 0);
  const { vatCents, totalCents } = calculateVAT(subtotalCents, ITALIAN_VAT_RATE);

  const [countRow] = await db
    .select({ invoiceCount: count() })
    .from(invoices)
    .innerJoin(rangeSubscriptions, eq(invoices.rangeSubscriptionId, rangeSubscriptions.id))
    .where(eq(rangeSubscriptions.rangeId, subscription.rangeId));
  const invoiceCount = countRow?.invoiceCount ?? 0;

  const invoiceDate = new Date();
  const dueDate = calculateDueDate(invoiceDate);
  const invoiceNumber = generateInvoiceNumber(subscription.rangeId, invoiceCount + 1, invoiceDate.getFullYear());

  const [invoice] = await db
    .insert(invoices)
    .values({
      rangeSubscriptionId,
      invoiceNumber,
      invoiceDate: invoiceDate.toISOString().slice(0, 10),
      dueDate: dueDate.toISOString().slice(0, 10),
      totalCents,
      vatCents,
      status: 'emessa',
      lineItems: lineItems as InvoiceLineInput[],
    })
    .returning();

  if (invoice) {
    await db.insert(billingHistory).values({
      rangeSubscriptionId,
      invoiceId: invoice.id,
      eventType: 'invoice_created',
      amountCents: totalCents,
    });
  }

  return invoice ?? null;
}

// ---------------------------------------------------------------------------
// Dati fiscali del gestore
// ---------------------------------------------------------------------------

export interface BillingConfigInput {
  readonly companyName: string | null;
  readonly vatNumber: string | null;
  readonly fiscalCode: string | null;
  readonly address: string | null;
  readonly city: string | null;
  readonly province: string | null;
  readonly postalCode: string | null;
  readonly invoiceEmail: string;
}

export async function getBillingConfig(rangeId: string, userId: string) {
  const db = getDb();
  const [config] = await db
    .select()
    .from(managerBillingConfig)
    .where(and(eq(managerBillingConfig.rangeId, rangeId), eq(managerBillingConfig.userId, userId)))
    .limit(1);
  return config ?? null;
}

export async function upsertBillingConfig(rangeId: string, userId: string, data: BillingConfigInput) {
  const db = getDb();
  const [config] = await db
    .insert(managerBillingConfig)
    .values({ rangeId, userId, ...data })
    .onConflictDoUpdate({
      target: [managerBillingConfig.rangeId, managerBillingConfig.userId],
      set: { ...data, updatedAt: new Date() },
    })
    .returning();
  return config;
}
