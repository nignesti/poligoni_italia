/**
 * Le 20 regioni italiane, forma canonica. Dato pubblico stabile, nessuna
 * dipendenza (come province-sigle.ts) — sicuro da importare anche in
 * componenti client (es. i menu a scelta in app/(admin)/admin/RangeForm.tsx)
 * senza trascinarsi dietro drizzle/postgres come farebbe un import da
 * queries/ranges.ts.
 *
 * Usato anche per normalizzare varianti di casing da fonti importate (es.
 * "SICILIA" vs "Sicilia") in queries/ranges.ts.
 */
export const REGIONI_CANONICHE = [
  'Abruzzo',
  'Basilicata',
  'Calabria',
  'Campania',
  'Emilia-Romagna',
  'Friuli-Venezia Giulia',
  'Lazio',
  'Liguria',
  'Lombardia',
  'Marche',
  'Molise',
  'Piemonte',
  'Puglia',
  'Sardegna',
  'Sicilia',
  'Toscana',
  'Trentino-Alto Adige',
  'Umbria',
  "Valle d'Aosta",
  'Veneto',
] as const;
