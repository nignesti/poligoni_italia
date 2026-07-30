/**
 * Genera slug conformi a `slugSchema` (@poligoni/schemas/common):
 * solo lettere minuscole, cifre e trattini singoli.
 *
 * Corregge il bug di `generateStaticParams` che usava solo `.toLowerCase()`:
 * "Reggio Emilia" diventava "reggio emilia" (con uno spazio letterale
 * nell'URL) ed "Emilia-Romagna" restava accentata. Entrambe rompono le rotte
 * dinamiche proprio sulle pagine che sono il motore SEO (BP §5.6).
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // rimuove i segni diacritici (é -> e)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
