/**
 * Limiti di detenzione delle munizioni — art. 97 TULPS.
 *
 * ⚠️  CODICE A RILEVANZA NORMATIVA.
 * Un errore in questo modulo fornisce a un utente un'informazione sbagliata su un
 * obbligo di legge con conseguenze sanzionatorie. Copertura di test richiesta: 100%,
 * casi limite inclusi (Piano_Sviluppo_App.md §10).
 *
 * Riferimenti: Business_Plan_Poligoni_Italia_v2.md §3.5.4 e Allegato A.
 */

// ---------------------------------------------------------------------------
// Tipi
// ---------------------------------------------------------------------------

/**
 * Categorie di detenzione previste dall'art. 97 TULPS.
 * I limiti si applicano PER CATEGORIA, non per calibro: è l'errore più facile
 * da commettere e il più grave (BP §3.5.4).
 */
export type AmmoCategory =
  | 'arma_corta'
  | 'arma_lunga_caccia'
  | 'spezzone'
  | 'polvere';

export type AmmoUnit = 'pezzi' | 'grammi';

export type AmmoLevel = 'ok' | 'attenzione' | 'limite' | 'oltre';

export interface LegalAmmoLimit {
  readonly category: AmmoCategory;
  /** Quantità massima detenibile senza licenza della Prefettura. */
  readonly maxQuantity: number;
  /** Soglia oltre la quale scatta l'obbligo di denuncia, se prevista. */
  readonly declarationFrom: number | null;
  readonly unit: AmmoUnit;
  readonly legalReference: string;
  readonly label: string;
}

export interface AmmoInventoryItem {
  readonly caliber: string;
  readonly category: AmmoCategory;
  readonly quantity: number;
}

export interface AmmoStatus {
  readonly category: AmmoCategory;
  readonly label: string;
  /** Somma delle quantità di tutti i calibri della categoria. */
  readonly quantity: number;
  readonly limit: number;
  readonly unit: AmmoUnit;
  /** Percentuale del limite, arrotondata a un decimale. Può superare 100. */
  readonly percentUsed: number;
  /** Quanto manca al limite. Zero se raggiunto o superato. */
  readonly remaining: number;
  readonly level: AmmoLevel;
  readonly declarationRequired: boolean;
  readonly legalReference: string;
  /** Calibri che concorrono al totale, per rendere verificabile l'aggregazione. */
  readonly calibers: readonly string[];
  readonly message: string;
}

export type AmmoMovementReason =
  | 'acquisto'
  | 'consumo_sessione'
  | 'ricarica'
  | 'correzione'
  | 'cessione';

export interface AmmoMovement {
  readonly caliber: string;
  readonly category: AmmoCategory;
  /** Positivo = carico, negativo = scarico. */
  readonly delta: number;
  readonly reason: AmmoMovementReason;
  readonly occurredAt: Date;
}

// ---------------------------------------------------------------------------
// Avvertenza obbligatoria
// ---------------------------------------------------------------------------

/**
 * Da mostrare in OGNI superficie che espone questi dati (BP §3.5.4).
 * È definita qui, e non nelle singole schermate, perché non possa essere
 * dimenticata in una di esse.
 */
export const AMMO_DISCLAIMER =
  'Strumento di ausilio al calcolo. Non costituisce certificazione di conformità: ' +
  'la responsabilità della detenzione resta del detentore.';

// ---------------------------------------------------------------------------
// Limiti di legge
// ---------------------------------------------------------------------------

/**
 * Valori iniziali. In produzione questi dati vivono nella tabella
 * `legal_ammo_limits` (Piano_Sviluppo_App.md §4.5): una modifica normativa deve
 * essere una riga di dati, non un rilascio dell'app — che sugli store
 * richiederebbe giorni di review mentre l'utente vede un limite sbagliato.
 */
export const DEFAULT_LEGAL_LIMITS: readonly LegalAmmoLimit[] = [
  {
    category: 'arma_corta',
    maxQuantity: 200,
    declarationFrom: null,
    unit: 'pezzi',
    legalReference: 'art. 97 TULPS',
    label: 'Cartucce per arma corta',
  },
  {
    category: 'arma_lunga_caccia',
    maxQuantity: 1500,
    declarationFrom: null,
    unit: 'pezzi',
    legalReference: 'art. 97 TULPS',
    label: 'Cartucce a palla per arma lunga',
  },
  {
    category: 'spezzone',
    maxQuantity: 1500,
    declarationFrom: 1000,
    unit: 'pezzi',
    legalReference: 'art. 97 TULPS',
    label: 'Cartucce a pallini (spezzone)',
  },
  {
    category: 'polvere',
    maxQuantity: 2000,
    declarationFrom: null,
    unit: 'grammi',
    legalReference: 'art. 97 TULPS',
    label: 'Polvere da sparo',
  },
];

/** Soglia di allerta anticipata: 80% del limite (BP §3.5.4). */
export const WARNING_THRESHOLD = 0.8;

// ---------------------------------------------------------------------------
// Valutazione
// ---------------------------------------------------------------------------

function levelFor(quantity: number, limit: number): AmmoLevel {
  if (quantity > limit) return 'oltre';
  if (quantity === limit) return 'limite';
  if (limit > 0 && quantity / limit >= WARNING_THRESHOLD) return 'attenzione';
  return 'ok';
}

function messageFor(
  level: AmmoLevel,
  limit: LegalAmmoLimit,
  quantity: number,
  declarationRequired: boolean,
): string {
  const u = limit.unit === 'grammi' ? 'g' : 'pezzi';
  const base = (() => {
    switch (level) {
      case 'oltre':
        return `Hai superato il limite di ${limit.maxQuantity} ${u} per "${limit.label}" (${limit.legalReference}). L'eccedenza è detenibile solo con licenza della Prefettura.`;
      case 'limite':
        return `Hai raggiunto il limite di ${limit.maxQuantity} ${u} per "${limit.label}" (${limit.legalReference}).`;
      case 'attenzione':
        return `Stai per raggiungere il limite di ${limit.maxQuantity} ${u} per "${limit.label}": ne detieni ${quantity}.`;
      case 'ok':
        return `${quantity} di ${limit.maxQuantity} ${u} per "${limit.label}".`;
    }
  })();

  return declarationRequired
    ? `${base} Oltre ${limit.declarationFrom} ${u} è previsto l'obbligo di denuncia.`
    : base;
}

/**
 * Valuta l'inventario rispetto ai limiti di legge, aggregando PER CATEGORIA.
 *
 * Restituisce una voce per ogni categoria presente nei limiti, anche a quantità
 * zero: la schermata deve poter mostrare tutte le categorie senza dover sapere
 * quali siano popolate.
 */
export function evaluateAmmoLimits(
  inventory: readonly AmmoInventoryItem[],
  limits: readonly LegalAmmoLimit[] = DEFAULT_LEGAL_LIMITS,
): AmmoStatus[] {
  return limits.map((limit) => {
    const items = inventory.filter((i) => i.category === limit.category);
    const quantity = items.reduce((sum, i) => sum + i.quantity, 0);

    const calibers = [...new Set(items.filter((i) => i.quantity !== 0).map((i) => i.caliber))].sort();

    const level = levelFor(quantity, limit.maxQuantity);
    const declarationRequired =
      limit.declarationFrom !== null && quantity > limit.declarationFrom;

    const percentUsed =
      limit.maxQuantity > 0
        ? Math.round((quantity / limit.maxQuantity) * 1000) / 10
        : 0;

    return {
      category: limit.category,
      label: limit.label,
      quantity,
      limit: limit.maxQuantity,
      unit: limit.unit,
      percentUsed,
      remaining: Math.max(0, limit.maxQuantity - quantity),
      level,
      declarationRequired,
      legalReference: limit.legalReference,
      calibers,
      message: messageFor(level, limit, quantity, declarationRequired),
    };
  });
}

/** True se almeno una categoria richiede attenzione dell'utente. */
export function hasAmmoWarnings(statuses: readonly AmmoStatus[]): boolean {
  return statuses.some(
    (s) => s.level !== 'ok' || s.declarationRequired,
  );
}

// ---------------------------------------------------------------------------
// Inventario derivato dai movimenti
// ---------------------------------------------------------------------------

/**
 * L'inventario è la somma dei movimenti, non un contatore scritto direttamente
 * (Piano_Sviluppo_App.md §4.4). Se un utente contesta il conteggio — e su un dato
 * con rilevanza sanzionatoria può succedere — deve essere possibile ricostruire
 * ogni variazione.
 *
 * Le quantità negative vengono azzerate: possono derivare solo da correzioni
 * manuali incoerenti, e una scorta negativa non esiste nel mondo fisico.
 */
export function computeInventoryFromMovements(
  movements: readonly AmmoMovement[],
): AmmoInventoryItem[] {
  const totals = new Map<string, AmmoInventoryItem>();

  for (const m of movements) {
    const key = `${m.category}::${m.caliber}`;
    const current = totals.get(key);
    const quantity = (current?.quantity ?? 0) + m.delta;
    totals.set(key, { caliber: m.caliber, category: m.category, quantity });
  }

  return [...totals.values()]
    .map((i) => ({ ...i, quantity: Math.max(0, i.quantity) }))
    .sort((a, b) =>
      a.category === b.category
        ? a.caliber.localeCompare(b.caliber)
        : a.category.localeCompare(b.category),
    );
}
