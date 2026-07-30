import { describe, expect, it } from 'vitest';
import { CENSUS_ROWS } from './census-2026-07.js';

describe('CENSUS_ROWS -- integrità del censimento del 30/07/2026', () => {
  it('non contiene righe duplicate (nome + comune)', () => {
    const seen = new Set<string>();
    const duplicates: string[] = [];
    for (const row of CENSUS_ROWS) {
      const key = `${row.name.toLowerCase()}|${row.comune.toLowerCase()}`;
      if (seen.has(key)) duplicates.push(key);
      seen.add(key);
    }
    expect(duplicates).toEqual([]);
  });

  it('non contiene il poligono militare (fuori perimetro del prodotto)', () => {
    const militare = CENSUS_ROWS.find((r) => /militare/i.test(r.name));
    expect(militare).toBeUndefined();
  });

  it('ogni riga ha i campi minimi per essere inserita in ranges', () => {
    for (const row of CENSUS_ROWS) {
      expect(row.name.length).toBeGreaterThan(0);
      expect(row.comune.length).toBeGreaterThan(0);
      expect(row.provinciaSigla).toMatch(/^[A-Z]{2}$/);
      expect(row.regione.length).toBeGreaterThan(0);
      expect(row.source.length).toBeGreaterThan(0);
    }
  });

  it('copre un numero di strutture coerente con la stima del documento originale', () => {
    // Il documento dichiara ~123 righe grezze; dopo la deduplicazione
    // (Carpi, Trap Concaverde, La Folce unite; militare e placeholder
    // esclusi) il numero atteso è più basso. Soglia larga per non
    // rendere il test fragile a piccole correzioni future.
    expect(CENSUS_ROWS.length).toBeGreaterThan(70);
    expect(CENSUS_ROWS.length).toBeLessThan(100);
  });

  it('distingue correttamente i tipi di struttura', () => {
    const byType = new Map<string, number>();
    for (const row of CENSUS_ROWS) {
      byType.set(row.type, (byType.get(row.type) ?? 0) + 1);
    }
    expect(byType.get('tsn')).toBeGreaterThan(50);
    expect(byType.get('privato')).toBeGreaterThan(10);
    expect(byType.get('tiro_a_volo')).toBe(1);
    expect(byType.get('dinamico')).toBe(1);
  });
});
