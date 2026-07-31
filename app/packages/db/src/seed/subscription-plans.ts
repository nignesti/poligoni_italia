/**
 * Catalogo statico dei piani SaaS Pro (Piano_Sviluppo_App.md task 69).
 *
 * Prezzi e funzionalità allineati alla copy già pubblicata su
 * apps/web/app/(public)/gestori/page.tsx (`PLANS`): quella pagina è la fonte
 * commerciale, questo è solo lo stesso catalogo in forma interrogabile per
 * l'abbonamento effettivo del gestore.
 *
 * UUID fissi (non `defaultRandom()`): un ri-lancio dello script di seed deve
 * aggiornare le stesse righe, non generarne di nuove — `range_subscriptions`
 * referenzia questi id con una foreign key.
 */
import type { subscriptionPlanType } from '../schema/billing.js';

export interface SubscriptionPlanSeed {
  readonly id: string;
  readonly name: string;
  readonly planType: (typeof subscriptionPlanType.enumValues)[number];
  readonly priceCents: number;
  readonly billingPeriodDays: number;
  readonly maxRanges: number | null;
  readonly maxUsers: number | null;
  readonly maxMonthlyBookings: number | null;
  readonly features: readonly string[];
}

export const SUBSCRIPTION_PLANS_SEED: readonly SubscriptionPlanSeed[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Base',
    planType: 'gratuito',
    priceCents: 0,
    billingPeriodDays: 30,
    maxRanges: 1,
    maxUsers: 2,
    maxMonthlyBookings: null,
    features: ['scheda_struttura_pubblica', 'orari_e_chiusure', 'richieste_disponibilita', 'fino_a_3_linee'],
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Partner',
    planType: 'partner',
    priceCents: 1900,
    billingPeriodDays: 30,
    maxRanges: 1,
    maxUsers: 5,
    maxMonthlyBookings: null,
    features: ['prenotazione_online', 'linee_illimitate', 'checkin_qr', 'export_csv_ical', 'nessuna_commissione'],
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Premium',
    planType: 'premium',
    priceCents: 4900,
    billingPeriodDays: 30,
    maxRanges: null,
    maxUsers: null,
    maxMonthlyBookings: null,
    features: [
      'prenotazione_online',
      'linee_illimitate',
      'checkin_qr',
      'export_csv_ical',
      'nessuna_commissione',
      'integrazione_gestionale',
      'statistiche_occupazione',
      'api_dedicate',
      'priorita_supporto',
    ],
  },
];
