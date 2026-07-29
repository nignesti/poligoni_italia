/**
 * Statistiche del gruppo di tiro.
 *
 * Nessun apprendimento automatico: geometria elementare sui fori marcati
 * dall'utente (Business_Plan_Poligoni_Italia_v2.md §3.5.7 — l'80% del valore
 * percepito dell'"analisi AI" al 10% dello sforzo).
 *
 * Sistema di riferimento: millimetri dal centro del bersaglio.
 * x positivo = destra, y positivo = alto.
 */

export interface Hole {
  readonly x: number;
  readonly y: number;
}

export interface GroupStats {
  readonly shots: number;
  /** Centro del gruppo: media aritmetica delle coordinate. */
  readonly centroid: Hole;
  /** Media delle distanze di ciascun foro dal centroide. */
  readonly meanRadius: number;
  /** Massima distanza fra due fori qualsiasi. */
  readonly extremeSpread: number;
  /** Deriva: scostamento orizzontale del centroide dal centro bersaglio. */
  readonly windage: number;
  /** Alzo: scostamento verticale del centroide dal centro bersaglio. */
  readonly elevation: number;
  /** Deviazione standard delle distanze dal centroide. */
  readonly standardDeviation: number;
  /** Ampiezza del gruppo in MOA. Presente solo se la distanza è nota. */
  readonly groupSizeMOA?: number;
}

/**
 * Millimetri sottesi da 1 MOA a 1 metro.
 * 1 MOA = 1/60 di grado; 2 * tan(0.5/60 °) * 1000 mm ≈ 0,290888 mm.
 */
const MM_PER_MOA_PER_METER = 0.2908882;

function distance(a: Hole, b: Hole): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

function round(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Calcola le statistiche di un gruppo.
 *
 * @param holes fori marcati, in mm dal centro bersaglio
 * @param distanceMeters distanza di tiro; se omessa, il MOA non viene calcolato
 * @throws se l'elenco dei fori è vuoto
 */
export function computeGroupStats(
  holes: readonly Hole[],
  distanceMeters?: number,
): GroupStats {
  if (holes.length === 0) {
    throw new Error('computeGroupStats: serve almeno un foro');
  }

  const shots = holes.length;
  const centroid: Hole = {
    x: holes.reduce((s, h) => s + h.x, 0) / shots,
    y: holes.reduce((s, h) => s + h.y, 0) / shots,
  };

  const radii = holes.map((h) => distance(h, centroid));
  const meanRadius = radii.reduce((s, r) => s + r, 0) / shots;

  const variance =
    radii.reduce((s, r) => s + (r - meanRadius) ** 2, 0) / shots;
  const standardDeviation = Math.sqrt(variance);

  // Confronto di tutte le coppie: i fori sono al massimo qualche decina,
  // un algoritmo più efficiente non ripagherebbe la complessità.
  let extremeSpread = 0;
  for (let i = 0; i < shots; i++) {
    for (let j = i + 1; j < shots; j++) {
      const d = distance(holes[i]!, holes[j]!);
      if (d > extremeSpread) extremeSpread = d;
    }
  }

  const base = {
    shots,
    centroid: { x: round(centroid.x), y: round(centroid.y) },
    meanRadius: round(meanRadius),
    extremeSpread: round(extremeSpread),
    windage: round(centroid.x),
    elevation: round(centroid.y),
    standardDeviation: round(standardDeviation),
  };

  if (distanceMeters === undefined || distanceMeters <= 0) {
    return base;
  }

  return {
    ...base,
    groupSizeMOA: round(
      extremeSpread / (MM_PER_MOA_PER_METER * distanceMeters),
    ),
  };
}

/**
 * Correzione da applicare alle tacche di mira per centrare il gruppo,
 * espressa in clic. Restituisce valori interi: le torrette si muovono a scatti.
 *
 * @param clickValueMradAt100m valore del clic, tipicamente 0.1 mrad o 1/4 MOA
 */
export function computeSightCorrection(
  stats: GroupStats,
  distanceMeters: number,
  mmPerClickAt100m: number,
): { horizontal: number; vertical: number } {
  if (distanceMeters <= 0 || mmPerClickAt100m <= 0) {
    throw new Error('computeSightCorrection: distanza e valore clic devono essere positivi');
  }
  const mmPerClick = (mmPerClickAt100m * distanceMeters) / 100;
  return {
    // Segno invertito: si corregge nella direzione opposta all'errore.
    horizontal: -Math.round(stats.windage / mmPerClick),
    vertical: -Math.round(stats.elevation / mmPerClick),
  };
}
