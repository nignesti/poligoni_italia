import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import { CENSUS_ROWS } from './census-2026-07.js';
import { provinciaFromSigla } from './province-sigle.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const coords = JSON.parse(
  readFileSync(path.join(__dirname, 'census-2026-07.coords.json'), 'utf-8'),
) as Record<string, { lat: number; lng: number; precision: string }>;

/**
 * Verifica la pipeline che scripts/run-seed.ts usa per costruire le righe
 * da inserire, senza bisogno di un database reale: se questo test passa,
 * il seed può fallire solo per motivi di connessione, non di dati mancanti.
 */
describe('copertura geocodifica del censimento', () => {
  it('ha una coordinata per ogni comune usato in CENSUS_ROWS', () => {
    const missing: string[] = [];
    for (const row of CENSUS_ROWS) {
      const key = `${row.comune}|${row.provinciaSigla}`;
      if (!(key in coords)) missing.push(key);
    }
    expect(missing).toEqual([]);
  });

  it('tutte le coordinate cadono entro i confini geografici italiani', () => {
    const outOfBounds = Object.entries(coords).filter(
      ([, c]) => c.lat < 35.2 || c.lat > 47.5 || c.lng < 6.0 || c.lng > 19.0,
    );
    expect(outOfBounds).toEqual([]);
  });

  it('ogni coordinata è a precisione comune, mai un indirizzo fabbricato', () => {
    for (const c of Object.values(coords)) {
      expect(c.precision).toBe('comune');
    }
  });

  it('ogni sigla provinciale del censimento è risolvibile', () => {
    for (const row of CENSUS_ROWS) {
      expect(() => provinciaFromSigla(row.provinciaSigla)).not.toThrow();
    }
  });
});
