import { describe, expect, it } from 'vitest';
import { slugify } from './index.js';

describe('slugify', () => {
  it('converte in minuscolo', () => {
    expect(slugify('Milano')).toBe('milano');
  });

  it('sostituisce gli spazi con trattini', () => {
    expect(slugify('Reggio Emilia')).toBe('reggio-emilia');
  });

  it('rimuove i segni diacritici', () => {
    expect(slugify('Città di Castello')).toBe('citta-di-castello');
  });

  it('gestisce gli apostrofi', () => {
    expect(slugify("Sant'Ilario di Sotto")).toBe('sant-ilario-di-sotto');
  });

  it('collassa i trattini multipli e li rimuove ai bordi', () => {
    expect(slugify('Emilia--Romagna')).toBe('emilia-romagna');
    expect(slugify('-Trento-')).toBe('trento');
  });

  it('non introduce spazi letterali nell URL', () => {
    // Il bug originale: .toLowerCase() da solo produceva "reggio emilia"
    // con uno spazio, rompendo le rotte dinamiche.
    expect(slugify('Reggio Emilia')).not.toContain(' ');
  });
});
