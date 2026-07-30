/**
 * Genera slug conformi a `slugSchema` (@poligoni/schemas/common): solo
 * lettere minuscole, cifre e trattini singoli.
 *
 * Condiviso tra apps/web (rotte pubbliche) e packages/db (seed): prima
 * esisteva solo in apps/web/lib/slugify.ts, spostato qui per evitare che il
 * seed del database duplicasse la stessa logica (Piano_Sviluppo_App.md §5).
 *
 * Corregge il bug di un `generateStaticParams` che usava solo
 * `.toLowerCase()`: "Reggio Emilia" diventava "reggio emilia" (con uno
 * spazio letterale nell'URL) ed "Emilia-Romagna" restava accentata.
 */
export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // rimuove i segni diacritici (é -> e)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
