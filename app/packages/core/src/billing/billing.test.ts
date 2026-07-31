import { describe, it, expect } from 'vitest';
import {
  calculateVAT,
  generateInvoiceNumber,
  calculateDueDate,
  isInvoiceOverdue,
  validateVATNumber,
  validateFiscalCode,
  calculateNextRenewalDate,
  isSubscriptionExpiringSoon,
  calculateLongTermDiscount,
  calculateSubscriptionCost,
  checkPlanLimits,
  type Invoice,
  type SubscriptionPlan,
} from './index.js';

describe('calculateVAT', () => {
  it('calcola correttamente l\'IVA al 22%', () => {
    const { vatCents, totalCents } = calculateVAT(10000, 22);
    expect(vatCents).toBe(2200);
    expect(totalCents).toBe(12200);
  });

  it('calcola correttamente l\'IVA al 0%', () => {
    const { vatCents, totalCents } = calculateVAT(10000, 0);
    expect(vatCents).toBe(0);
    expect(totalCents).toBe(10000);
  });

  it('arrotonda correttamente i centesimi', () => {
    const { vatCents } = calculateVAT(333, 22);
    expect(vatCents).toBe(73); // 333 * 0.22 = 73.26 → 73
  });
});

describe('generateInvoiceNumber', () => {
  it('genera numero di fattura con formato corretto', () => {
    const number = generateInvoiceNumber('550e8400-e29b-41d4-a716-446655440000', 1, 2026);
    expect(number).toMatch(/^FT-2026-00001-550E8400/);
  });

  it('formatta il numero sequenziale con padding', () => {
    const number = generateInvoiceNumber('550e8400-e29b-41d4-a716-446655440000', 12345, 2026);
    expect(number).toMatch(/12345/);
  });
});

describe('calculateDueDate', () => {
  it('calcola correttamente la data di scadenza (30 giorni)', () => {
    const invoiceDate = new Date('2026-01-01');
    expect(calculateDueDate(invoiceDate, 30)).toEqual(new Date('2026-01-31'));
  });

  it('usa 30 giorni come default', () => {
    const invoiceDate = new Date('2026-01-01');
    expect(calculateDueDate(invoiceDate)).toEqual(new Date('2026-01-31'));
  });
});

describe('isInvoiceOverdue', () => {
  it('riconosce una fattura scaduta', () => {
    const invoice = { status: 'emessa', dueDate: new Date('2025-01-01') } as Invoice;
    expect(isInvoiceOverdue(invoice, new Date('2026-01-01'))).toBe(true);
  });

  it('non considera scaduta una fattura pagata', () => {
    const invoice = { status: 'pagata', dueDate: new Date('2025-01-01') } as Invoice;
    expect(isInvoiceOverdue(invoice, new Date('2026-01-01'))).toBe(false);
  });

  it('non considera scaduta una fattura con scadenza futura', () => {
    const invoice = { status: 'emessa', dueDate: new Date('2026-12-31') } as Invoice;
    expect(isInvoiceOverdue(invoice, new Date('2026-01-01'))).toBe(false);
  });
});

describe('validateVATNumber', () => {
  it('accetta una P.IVA valida', () => {
    expect(validateVATNumber('IT12345678901')).toBe(true);
  });

  it('rifiuta una P.IVA con formato non valido', () => {
    expect(validateVATNumber('IT1234567890')).toBe(false); // Troppo corta
    expect(validateVATNumber('US12345678901')).toBe(false); // Non inizia con IT
    expect(validateVATNumber('IT1234567890A')).toBe(false); // Contiene lettere
  });

  it('rifiuta una stringa vuota', () => {
    expect(validateVATNumber('')).toBe(false);
  });
});

describe('validateFiscalCode', () => {
  it('accetta un codice fiscale di persona fisica', () => {
    expect(validateFiscalCode('RSSMRA85L01A001A')).toBe(true);
  });

  it('accetta un codice fiscale di ditta (11 cifre)', () => {
    expect(validateFiscalCode('12345678901')).toBe(true);
  });

  it('rifiuta un codice non valido', () => {
    expect(validateFiscalCode('INVALID')).toBe(false);
    expect(validateFiscalCode('123456')).toBe(false);
  });
});

describe('calculateNextRenewalDate', () => {
  it('aggiunge il periodo di fatturazione correttamente', () => {
    expect(calculateNextRenewalDate(new Date('2026-01-01'), 30)).toEqual(new Date('2026-01-31'));
  });
});

describe('isSubscriptionExpiringSoon', () => {
  const today = new Date('2026-01-01');

  it('riconosce un abbonamento in scadenza (entro 7 giorni)', () => {
    expect(isSubscriptionExpiringSoon(new Date('2026-01-05'), today)).toBe(true);
  });

  it('non segnala abbonamenti che scadono oltre 7 giorni', () => {
    expect(isSubscriptionExpiringSoon(new Date('2026-01-10'), today)).toBe(false);
  });

  it('non segnala abbonamenti già scaduti', () => {
    expect(isSubscriptionExpiringSoon(new Date('2025-12-20'), today)).toBe(false);
  });
});

describe('calculateLongTermDiscount', () => {
  it('applica 10% di sconto per 1 anno', () => {
    expect(calculateLongTermDiscount(12)).toBe(10);
  });

  it('applica 15% di sconto per 2 anni', () => {
    expect(calculateLongTermDiscount(24)).toBe(15);
  });

  it('applica 20% di sconto per 3 anni', () => {
    expect(calculateLongTermDiscount(36)).toBe(20);
  });

  it('non applica sconto per impegno mensile', () => {
    expect(calculateLongTermDiscount(1)).toBe(0);
  });
});

describe('calculateSubscriptionCost', () => {
  it('calcola il costo totale senza sconto', () => {
    expect(calculateSubscriptionCost(2999, 1, 0)).toBe(2999);
  });

  it('applica lo sconto pluriennale', () => {
    const cost = calculateSubscriptionCost(2999, 12, 0);
    expect(cost).toBe(Math.round((2999 * 12 * 90) / 100));
  });

  it('applica sconto aggiuntivo', () => {
    const cost = calculateSubscriptionCost(2999, 1, 10);
    expect(cost).toBe(Math.round((2999 * 90) / 100));
  });

  it('limita lo sconto totale al 100%', () => {
    expect(calculateSubscriptionCost(2999, 36, 100)).toBe(0);
  });
});

describe('checkPlanLimits', () => {
  const plan = { maxRanges: 3, maxUsers: 10, maxMonthlyBookings: 100 } as SubscriptionPlan;

  it('accetta utilizzo dentro i limiti', () => {
    const result = checkPlanLimits({ rangesCount: 2, staffCount: 8, monthlyBookings: 50 }, plan);
    expect(result.isWithinLimits).toBe(true);
    expect(result.violations).toHaveLength(0);
  });

  it('identifica violazione del limite di poligoni', () => {
    const result = checkPlanLimits({ rangesCount: 4, staffCount: 8, monthlyBookings: 50 }, plan);
    expect(result.isWithinLimits).toBe(false);
    expect(result.violations).toContain('Numero di poligoni (4) superiore al limite del piano (3)');
  });

  it('identifica più violazioni', () => {
    const result = checkPlanLimits({ rangesCount: 4, staffCount: 12, monthlyBookings: 150 }, plan);
    expect(result.violations).toHaveLength(3);
  });

  it('ignora limiti non definiti', () => {
    const planNoLimit = {} as SubscriptionPlan;
    const result = checkPlanLimits({ rangesCount: 100, staffCount: 8, monthlyBookings: 50 }, planNoLimit);
    expect(result.isWithinLimits).toBe(true);
  });
});
