/**
 * Pass Pro — limiti del piano gratuito e funzionalità premium per il tiratore.
 *
 * Non è codice a rilevanza normativa (a differenza di `ammo` e `gpg`): qui un
 * errore nega o concede una funzionalità, non un'informazione di legge. Resta
 * comunque puro e testato, perché determina cosa un utente paga.
 *
 * Riferimenti: Piano_Sviluppo_App.md task 70 (T5). La Business Plan (§4.2)
 * subordina l'attivazione commerciale di Pass Pro al raggiungimento di 10.000
 * utenti registrati — vedi `isPassProLaunchReady`. Il modulo esiste comunque
 * da ora: le stesse funzioni gestiranno la UI quando la soglia sarà raggiunta.
 */

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

export type PassProTier = 'gratuito' | 'pass_pro';

export type PremiumFeature =
  | 'bersagli_illimitati'
  | 'statistiche_avanzate'
  | 'libretto_gpg_export'
  | 'storico_illimitato'
  | 'backup_cloud';

export interface PremiumFeatureInfo {
  readonly feature: PremiumFeature;
  readonly label: string;
  readonly description: string;
}

export interface QuotaCheck {
  readonly allowed: boolean;
  readonly limit: number;
  readonly used: number;
  /** Zero se il limite è già raggiunto o superato. */
  readonly remaining: number;
}

// ---------------------------------------------------------------------------
// Catalogo funzionalità premium
// ---------------------------------------------------------------------------

/**
 * In produzione questi dati possono spostarsi in tabella, come i limiti
 * munizioni (Piano §4.5): qui restano in codice perché non hanno rilevanza
 * normativa e cambiano solo con una decisione di prodotto.
 */
export const PREMIUM_FEATURES: readonly PremiumFeatureInfo[] = [
  {
    feature: 'bersagli_illimitati',
    label: 'Bersagli illimitati',
    description: 'Marca e conserva tutti i bersagli, senza limite mensile.',
  },
  {
    feature: 'statistiche_avanzate',
    label: 'Statistiche avanzate',
    description: 'Andamento nel tempo per arma, calibro e distanza.',
  },
  {
    feature: 'libretto_gpg_export',
    label: 'Esportazione libretto GPG',
    description: 'PDF del libretto esercitazioni per l\'istituto di vigilanza.',
  },
  {
    feature: 'storico_illimitato',
    label: 'Storico sessioni illimitato',
    description: 'Consulta tutte le sessioni passate, senza finestra temporale.',
  },
  {
    feature: 'backup_cloud',
    label: 'Backup cloud del diario',
    description: 'Diario e inventario munizioni al sicuro anche cambiando telefono.',
  },
] as const;

// ---------------------------------------------------------------------------
// Limiti del piano gratuito
// ---------------------------------------------------------------------------

export interface FreeTierLimits {
  readonly maxFirearms: number;
  readonly maxTargetsPerMonth: number;
  /** Finestra di visibilità dello storico sessioni, in giorni. */
  readonly sessionHistoryDays: number;
}

export const FREE_TIER_LIMITS: FreeTierLimits = {
  maxFirearms: 3,
  maxTargetsPerMonth: 5,
  sessionHistoryDays: 90,
};

// ---------------------------------------------------------------------------
// Prezzi (indicativi — da confermare in Business Plan prima del lancio)
// ---------------------------------------------------------------------------

export const PASS_PRO_MONTHLY_PRICE_CENTS = 490;
export const PASS_PRO_ANNUAL_PRICE_CENTS = 3900; // ~2 mesi gratis rispetto al mensile

// ---------------------------------------------------------------------------
// Accesso alle funzionalità
// ---------------------------------------------------------------------------

export function hasFeatureAccess(tier: PassProTier, _feature: PremiumFeature): boolean {
  return tier === 'pass_pro';
}

/** Funzionalità ancora bloccate per un tier, nell'ordine del catalogo. */
export function lockedFeatures(tier: PassProTier): readonly PremiumFeatureInfo[] {
  if (tier === 'pass_pro') return [];
  return PREMIUM_FEATURES;
}

// ---------------------------------------------------------------------------
// Quote del piano gratuito
// ---------------------------------------------------------------------------

function quota(tier: PassProTier, limit: number, used: number): QuotaCheck {
  if (tier === 'pass_pro') {
    return { allowed: true, limit: Infinity, used, remaining: Infinity };
  }
  const safeUsed = Math.max(0, used);
  return {
    allowed: safeUsed < limit,
    limit,
    used: safeUsed,
    remaining: Math.max(0, limit - safeUsed),
  };
}

export function checkFirearmsQuota(tier: PassProTier, currentCount: number): QuotaCheck {
  return quota(tier, FREE_TIER_LIMITS.maxFirearms, currentCount);
}

export function checkTargetsQuota(tier: PassProTier, targetsThisMonth: number): QuotaCheck {
  return quota(tier, FREE_TIER_LIMITS.maxTargetsPerMonth, targetsThisMonth);
}

/**
 * True se una sessione ricade ancora nella finestra visibile dal piano
 * gratuito. Il piano Pass Pro non ha finestra: sempre visibile.
 */
export function isSessionWithinFreeHistory(
  tier: PassProTier,
  sessionDate: Date,
  today: Date = new Date(),
): boolean {
  if (tier === 'pass_pro') return true;
  const ageMs = today.getTime() - sessionDate.getTime();
  const ageDays = ageMs / (1000 * 60 * 60 * 24);
  return ageDays <= FREE_TIER_LIMITS.sessionHistoryDays;
}

// ---------------------------------------------------------------------------
// Trigger di lancio commerciale (BP §4.2)
// ---------------------------------------------------------------------------

export const PASS_PRO_LAUNCH_USER_THRESHOLD = 10_000;

/**
 * La Business Plan attiva Pass Pro solo a 10.000 utenti registrati: prima di
 * quella soglia manca la massa critica perché il paywall abbia senso
 * commerciale (Piano §12.1, leva "Pass Pro a inizio Anno 2").
 */
export function isPassProLaunchReady(registeredUsers: number): boolean {
  return registeredUsers >= PASS_PRO_LAUNCH_USER_THRESHOLD;
}
