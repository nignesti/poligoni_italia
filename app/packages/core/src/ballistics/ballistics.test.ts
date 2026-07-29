import { describe, expect, it } from 'vitest';
import { computeGroupStats, computeSightCorrection, type Hole } from './index.js';

describe('computeGroupStats', () => {
  it('rifiuta un elenco vuoto', () => {
    expect(() => computeGroupStats([])).toThrow(/almeno un foro/);
  });

  it('un solo foro: raggio, estensione e deviazione a zero', () => {
    const s = computeGroupStats([{ x: 12, y: -8 }]);
    expect(s.shots).toBe(1);
    expect(s.centroid).toEqual({ x: 12, y: -8 });
    expect(s.meanRadius).toBe(0);
    expect(s.extremeSpread).toBe(0);
    expect(s.standardDeviation).toBe(0);
    expect(s.windage).toBe(12);
    expect(s.elevation).toBe(-8);
  });

  it('calcola il centroide come media aritmetica', () => {
    const holes: Hole[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 10 },
    ];
    const s = computeGroupStats(holes);
    expect(s.centroid).toEqual({ x: 5, y: 5 });
  });

  it('quadrato di lato 10: raggio medio e mezza diagonale, estensione e la diagonale', () => {
    const holes: Hole[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 0, y: 10 },
      { x: 10, y: 10 },
    ];
    const s = computeGroupStats(holes);
    // ogni vertice dista dal centro (5,5) di sqrt(50) ≈ 7.07
    expect(s.meanRadius).toBeCloseTo(7.07, 2);
    // diagonale = 10*sqrt(2) ≈ 14.14
    expect(s.extremeSpread).toBeCloseTo(14.14, 2);
    // tutti equidistanti dal centroide → deviazione nulla
    expect(s.standardDeviation).toBe(0);
  });

  it('estensione = massima distanza fra due fori qualsiasi, non dal centro', () => {
    const holes: Hole[] = [
      { x: -50, y: 0 },
      { x: 0, y: 0 },
      { x: 50, y: 0 },
    ];
    const s = computeGroupStats(holes);
    expect(s.extremeSpread).toBe(100);
  });

  it('deriva e alzo coincidono con lo scostamento del centroide', () => {
    const s = computeGroupStats([
      { x: 20, y: 30 },
      { x: 30, y: 40 },
    ]);
    expect(s.windage).toBe(25);
    expect(s.elevation).toBe(35);
  });

  it('senza distanza non calcola il MOA', () => {
    expect(computeGroupStats([{ x: 0, y: 0 }, { x: 10, y: 0 }]).groupSizeMOA).toBeUndefined();
  });

  it('29,09 mm a 100 m corrispondono a circa 1 MOA', () => {
    const s = computeGroupStats([{ x: 0, y: 0 }, { x: 29.089, y: 0 }], 100);
    expect(s.groupSizeMOA).toBeCloseTo(1, 2);
  });

  it('lo stesso gruppo a distanza doppia vale meta MOA', () => {
    const holes: Hole[] = [{ x: 0, y: 0 }, { x: 29.089, y: 0 }];
    expect(computeGroupStats(holes, 200).groupSizeMOA).toBeCloseTo(0.5, 2);
  });

  it('distanza non positiva viene ignorata invece di produrre infinito', () => {
    expect(computeGroupStats([{ x: 0, y: 0 }], 0).groupSizeMOA).toBeUndefined();
    expect(computeGroupStats([{ x: 0, y: 0 }], -5).groupSizeMOA).toBeUndefined();
  });
});

describe('computeSightCorrection', () => {
  it('corregge nella direzione opposta allo scostamento', () => {
    const stats = computeGroupStats([{ x: 30, y: 30 }]);
    // clic da 10 mm a 100 m, tiro a 100 m → 3 clic in ciascun senso
    const c = computeSightCorrection(stats, 100, 10);
    expect(c.horizontal).toBe(-3);
    expect(c.vertical).toBe(-3);
  });

  it('scala il valore del clic con la distanza', () => {
    const stats = computeGroupStats([{ x: 30, y: 0 }]);
    // a 50 m il clic vale 5 mm → 6 clic
    expect(computeSightCorrection(stats, 50, 10).horizontal).toBe(-6);
  });

  it('gruppo centrato: nessuna correzione', () => {
    const stats = computeGroupStats([{ x: 0, y: 0 }]);
    expect(computeSightCorrection(stats, 100, 10)).toEqual({ horizontal: -0, vertical: -0 });
  });

  it('rifiuta parametri non positivi', () => {
    const stats = computeGroupStats([{ x: 0, y: 0 }]);
    expect(() => computeSightCorrection(stats, 0, 10)).toThrow();
    expect(() => computeSightCorrection(stats, 100, 0)).toThrow();
  });
});
