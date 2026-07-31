/**
 * SaaS Pro — piani, fatturazione e limiti di utilizzo per il gestore.
 *
 * Dominio distinto da `premium` (Pass Pro, il piano a pagamento del
 * tiratore): clienti diversi, ciclo di fatturazione diverso. Vedi
 * Piano_Sviluppo_App.md task 69 (T5).
 */

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

export type SubscriptionPlanType = 'gratuito' | 'partner' | 'premium';
export type SubscriptionStatus = 'attivo' | 'sospeso' | 'annullato' | 'scaduto';
export type InvoiceStatus = 'bozza' | 'emessa' | 'pagata' | 'scaduta' | 'annullata';

export interface SubscriptionPlan {
  readonly id: string;
  readonly name: string;
  readonly planType: SubscriptionPlanType;
  readonly priceCents: number;
  /** Durata del ciclo di fatturazione, in giorni. */
  readonly billingPeriod: number;
  readonly maxRanges?: number;
  readonly maxUsers?: number;
  readonly maxMonthlyBookings?: number;
}

export interface InvoiceLine {
  readonly description: string;
  readonly quantity: number;
  readonly unitPriceCents: number;
  readonly totalPriceCents: number;
}

export interface Invoice {
  readonly id: string;
  readonly invoiceNumber: string;
  readonly invoiceDate: Date;
  readonly dueDate: Date;
  readonly totalCents: number;
  readonly vatCents: number;
  readonly status: InvoiceStatus;
  readonly lineItems: readonly InvoiceLine[];
  readonly paidAt?: Date;
}

// ---------------------------------------------------------------------------
// IVA e fatturazione
// ---------------------------------------------------------------------------

/**
 * Aliquota IVA ordinaria italiana. A differenza della sales tax USA, l'IVA
 * italiana è un'imposta nazionale: non varia per regione.
 */
export const ITALIAN_VAT_RATE = 22;

/** Calcola IVA e totale a partire dall'imponibile, arrotondando al centesimo. */
export function calculateVAT(
  subtotalCents: number,
  vatRate: number,
): { vatCents: number; totalCents: number } {
  const vatCents = Math.round((subtotalCents * vatRate) / 100);
  return { vatCents, totalCents: subtotalCents + vatCents };
}

/** Numero fattura sequenziale e univoco: FT-{anno}-{progressivo}-{range}. */
export function generateInvoiceNumber(rangeId: string, sequenceNumber: number, year: number): string {
  const shortId = rangeId.substring(0, 8).toUpperCase();
  return `FT-${year}-${String(sequenceNumber).padStart(5, '0')}-${shortId}`;
}

/** Data di scadenza a partire dai termini di pagamento (default 30 giorni). */
export function calculateDueDate(invoiceDate: Date, paymentTermsDays = 30): Date {
  const dueDate = new Date(invoiceDate);
  dueDate.setDate(dueDate.getDate() + paymentTermsDays);
  return dueDate;
}

export function isInvoiceOverdue(invoice: Invoice, today: Date = new Date()): boolean {
  return invoice.status !== 'pagata' && today > invoice.dueDate;
}

// ---------------------------------------------------------------------------
// Validazione dati fiscali italiani
// ---------------------------------------------------------------------------

/**
 * Verifica solo il formato (IT + 11 cifre), non il checksum ufficiale
 * dell'Agenzia delle Entrate.
 */
export function validateVATNumber(vat: string): boolean {
  if (!vat || vat.length !== 13 || !vat.startsWith('IT')) return false;
  return /^\d{11}$/.test(vat.slice(2));
}

/** Formato persona fisica (16 caratteri) o persona giuridica (11 cifre). */
export function validateFiscalCode(code: string): boolean {
  if (!code) return false;
  if (code.length === 16) return /^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$/.test(code);
  if (code.length === 11) return /^\d{11}$/.test(code);
  return false;
}

// ---------------------------------------------------------------------------
// Ciclo di vita dell'abbonamento
// ---------------------------------------------------------------------------

export function calculateNextRenewalDate(startDate: Date, billingPeriodDays: number): Date {
  const renewalDate = new Date(startDate);
  renewalDate.setDate(renewalDate.getDate() + billingPeriodDays);
  return renewalDate;
}

/** True se l'abbonamento rinnova entro 7 giorni (e non è già scaduto). */
export function isSubscriptionExpiringSoon(renewalDate: Date, today: Date = new Date()): boolean {
  const daysUntilRenewal = Math.floor((renewalDate.getTime() - today.getTime()) / 86_400_000);
  return daysUntilRenewal > 0 && daysUntilRenewal <= 7;
}

// ---------------------------------------------------------------------------
// Sconti pluriennali
// ---------------------------------------------------------------------------

export function calculateLongTermDiscount(billingPeriodMonths: number): number {
  if (billingPeriodMonths >= 36) return 20;
  if (billingPeriodMonths >= 24) return 15;
  if (billingPeriodMonths >= 12) return 10;
  return 0;
}

/** Costo netto del periodo, con sconto pluriennale ed eventuale sconto aggiuntivo. */
export function calculateSubscriptionCost(
  monthlyCostCents: number,
  billingPeriodMonths: number,
  extraDiscountPercent = 0,
): number {
  const totalDiscount = Math.min(
    calculateLongTermDiscount(billingPeriodMonths) + extraDiscountPercent,
    100,
  );
  const subtotal = monthlyCostCents * billingPeriodMonths;
  return subtotal - Math.round((subtotal * totalDiscount) / 100);
}

// ---------------------------------------------------------------------------
// Limiti del piano
// ---------------------------------------------------------------------------

export interface PlanUsage {
  readonly rangesCount: number;
  readonly staffCount: number;
  readonly monthlyBookings: number;
}

export interface PlanLimitCheck {
  readonly isWithinLimits: boolean;
  readonly violations: readonly string[];
}

export function checkPlanLimits(usage: PlanUsage, plan: SubscriptionPlan): PlanLimitCheck {
  const violations: string[] = [];

  if (plan.maxRanges !== undefined && usage.rangesCount > plan.maxRanges) {
    violations.push(`Numero di poligoni (${usage.rangesCount}) superiore al limite del piano (${plan.maxRanges})`);
  }
  if (plan.maxUsers !== undefined && usage.staffCount > plan.maxUsers) {
    violations.push(`Numero di utenti (${usage.staffCount}) superiore al limite del piano (${plan.maxUsers})`);
  }
  if (plan.maxMonthlyBookings !== undefined && usage.monthlyBookings > plan.maxMonthlyBookings) {
    violations.push(
      `Prenotazioni mensili (${usage.monthlyBookings}) superiore al limite del piano (${plan.maxMonthlyBookings})`,
    );
  }

  return { isWithinLimits: violations.length === 0, violations };
}
