/**
 * Re-export da @poligoni/core/slug: la funzione era duplicata qui e nel
 * seed del database (packages/db). Spostata in core, condivisa da entrambi.
 */
export { slugify } from '@poligoni/core/slug';
