import { describe, expect, it } from 'vitest';
import {
  AMMO_DISCLAIMER,
  DEFAULT_LEGAL_LIMITS,
  computeInventoryFromMovements,
  evaluateAmmoLimits,
  hasAmmoWarnings,
  type AmmoInventoryItem,
  type AmmoMovement,
} from './index.js';

const item = (
  caliber: string,
  category: AmmoInventoryItem['category'],
  quantity: number,
): AmmoInventoryItem => ({ caliber, category, quantity });

const statusFor = (inv: AmmoInventoryItem[], cat: string) =>
  evaluateAmmoLimits(inv).find((s) => s.category === cat)!;

describe('limiti di legge — valori dell art. 97 TULPS', () => {
  it('codifica i quattro limiti previsti', () => {
    const byCategory = Object.fromEntries(
      DEFAULT_LEGAL_LIMITS.map((l) => [l.category, l]),
    );
    expect(byCategory['arma_corta']!.maxQuantity).toBe(200);
    expect(byCategory['arma_lunga_caccia']!.maxQuantity).toBe(1500);
    expect(byCategory['spezzone']!.maxQuantity).toBe(1500);
    expect(byCategory['spezzone']!.declarationFrom).toBe(1000);
    expect(byCategory['polvere']!.maxQuantity).toBe(2000);
    expect(byCategory['polvere']!.unit).toBe('grammi');
  });

  it('cita il riferimento normativo su ogni limite', () => {
    for (const limit of DEFAULT_LEGAL_LIMITS) {
      expect(limit.legalReference).toContain('art. 97 TULPS');
    }
  });
});

describe('evaluateAmmoLimits — casi limite', () => {
  it('inventario vuoto: tutte le categorie a zero, nessun avviso', () => {
    const result = evaluateAmmoLimits([]);
    expect(result).toHaveLength(4);
    expect(result.every((s) => s.quantity === 0 && s.level === 'ok')).toBe(true);
    expect(hasAmmoWarnings(result)).toBe(false);
  });

  it('sotto la soglia di attenzione: livello ok', () => {
    const s = statusFor([item('9x21', 'arma_corta', 159)], 'arma_corta');
    expect(s.level).toBe('ok');
    expect(s.percentUsed).toBe(79.5);
    expect(s.remaining).toBe(41);
  });

  it('esattamente all 80%: livello attenzione', () => {
    const s = statusFor([item('9x21', 'arma_corta', 160)], 'arma_corta');
    expect(s.level).toBe('attenzione');
    expect(s.percentUsed).toBe(80);
  });

  it('esattamente al limite: livello limite, non oltre', () => {
    const s = statusFor([item('9x21', 'arma_corta', 200)], 'arma_corta');
    expect(s.level).toBe('limite');
    expect(s.percentUsed).toBe(100);
    expect(s.remaining).toBe(0);
  });

  it('un pezzo oltre il limite: livello oltre, cita la licenza prefettizia', () => {
    const s = statusFor([item('9x21', 'arma_corta', 201)], 'arma_corta');
    expect(s.level).toBe('oltre');
    expect(s.remaining).toBe(0);
    expect(s.message).toContain('Prefettura');
  });
});

describe('evaluateAmmoLimits — aggregazione per categoria', () => {
  it('somma calibri diversi della stessa categoria (errore piu grave da evitare)', () => {
    const inv = [
      item('9x21', 'arma_corta', 120),
      item('.38 Special', 'arma_corta', 60),
      item('.45 ACP', 'arma_corta', 40),
    ];
    const s = statusFor(inv, 'arma_corta');
    expect(s.quantity).toBe(220);
    expect(s.level).toBe('oltre');
  });

  it('non mescola categorie diverse', () => {
    const inv = [
      item('9x21', 'arma_corta', 150),
      item('.308', 'arma_lunga_caccia', 900),
    ];
    expect(statusFor(inv, 'arma_corta').quantity).toBe(150);
    expect(statusFor(inv, 'arma_lunga_caccia').quantity).toBe(900);
  });

  it('elenca i calibri che concorrono al totale, ordinati e senza duplicati', () => {
    const inv = [
      item('9x21', 'arma_corta', 50),
      item('.45 ACP', 'arma_corta', 30),
      item('9x21', 'arma_corta', 20),
      item('.22 LR', 'arma_corta', 0),
    ];
    const s = statusFor(inv, 'arma_corta');
    expect(s.quantity).toBe(100);
    expect(s.calibers).toEqual(['.45 ACP', '9x21']);
  });
});

describe('evaluateAmmoLimits — spezzone e obbligo di denuncia', () => {
  it('fino a 1000 pezzi nessun obbligo di denuncia', () => {
    const s = statusFor([item('12', 'spezzone', 1000)], 'spezzone');
    expect(s.declarationRequired).toBe(false);
  });

  it('oltre 1000 pezzi scatta l obbligo di denuncia', () => {
    const s = statusFor([item('12', 'spezzone', 1001)], 'spezzone');
    expect(s.declarationRequired).toBe(true);
    expect(s.message).toContain('denuncia');
  });

  it('fra 1000 e 1500 e ancora entro il limite ma con denuncia', () => {
    const s = statusFor([item('12', 'spezzone', 1400)], 'spezzone');
    expect(s.level).toBe('attenzione');
    expect(s.declarationRequired).toBe(true);
    expect(hasAmmoWarnings([s])).toBe(true);
  });

  it('oltre 1500 supera il limite massimo', () => {
    const s = statusFor([item('12', 'spezzone', 1600)], 'spezzone');
    expect(s.level).toBe('oltre');
  });
});

describe('evaluateAmmoLimits — polvere', () => {
  it('misura in grammi con limite a 2000', () => {
    const s = statusFor([item('Vectan', 'polvere', 1900)], 'polvere');
    expect(s.unit).toBe('grammi');
    expect(s.level).toBe('attenzione');
    expect(s.message).toContain('g');
  });
});

describe('avvertenza obbligatoria', () => {
  it('dichiara che lo strumento non certifica e che la responsabilita resta del detentore', () => {
    expect(AMMO_DISCLAIMER).toContain('Non costituisce certificazione');
    expect(AMMO_DISCLAIMER).toContain('detentore');
  });
});

describe('computeInventoryFromMovements', () => {
  const mv = (
    caliber: string,
    category: AmmoMovement['category'],
    delta: number,
    reason: AmmoMovement['reason'] = 'acquisto',
  ): AmmoMovement => ({ caliber, category, delta, reason, occurredAt: new Date('2026-01-01T00:00:00Z') });

  it('somma carichi e scarichi dello stesso calibro', () => {
    const inv = computeInventoryFromMovements([
      mv('9x21', 'arma_corta', 100),
      mv('9x21', 'arma_corta', 50),
      mv('9x21', 'arma_corta', -30, 'consumo_sessione'),
    ]);
    expect(inv).toHaveLength(1);
    expect(inv[0]!.quantity).toBe(120);
  });

  it('tiene separati calibri diversi', () => {
    const inv = computeInventoryFromMovements([
      mv('9x21', 'arma_corta', 100),
      mv('.45 ACP', 'arma_corta', 40),
    ]);
    expect(inv).toHaveLength(2);
  });

  it('azzera le quantita negative da correzioni incoerenti', () => {
    const inv = computeInventoryFromMovements([
      mv('9x21', 'arma_corta', 10),
      mv('9x21', 'arma_corta', -50, 'correzione'),
    ]);
    expect(inv[0]!.quantity).toBe(0);
  });

  it('produce un inventario valutabile end-to-end', () => {
    const inv = computeInventoryFromMovements([
      mv('9x21', 'arma_corta', 150),
      mv('.45 ACP', 'arma_corta', 60),
      mv('9x21', 'arma_corta', -20, 'consumo_sessione'),
    ]);
    const s = statusFor(inv, 'arma_corta');
    expect(s.quantity).toBe(190);
    expect(s.level).toBe('attenzione');
  });

  it('senza movimenti restituisce inventario vuoto', () => {
    expect(computeInventoryFromMovements([])).toEqual([]);
  });

  it('ordina per categoria e, a parita di categoria, per calibro', () => {
    const inv = computeInventoryFromMovements([
      mv('9x21', 'arma_corta', 10),
      mv('.308', 'arma_lunga_caccia', 10),
      mv('.45 ACP', 'arma_corta', 10),
    ]);
    expect(inv.map((i) => `${i.category}/${i.caliber}`)).toEqual([
      'arma_corta/.45 ACP',
      'arma_corta/9x21',
      'arma_lunga_caccia/.308',
    ]);
  });
});

describe('robustezza sui dati di limite', () => {
  it('un limite a zero non produce divisione per zero', () => {
    // I limiti arrivano dalla tabella `legal_ammo_limits`: un valore a zero non
    // dovrebbe esistere, ma un dato corrotto non deve produrre NaN o Infinity
    // in una schermata che parla di obblighi di legge.
    const result = evaluateAmmoLimits([item('9x21', 'arma_corta', 50)], [
      {
        category: 'arma_corta',
        maxQuantity: 0,
        declarationFrom: null,
        unit: 'pezzi',
        legalReference: 'art. 97 TULPS',
        label: 'Cartucce per arma corta',
      },
    ]);
    expect(result[0]!.percentUsed).toBe(0);
    expect(Number.isFinite(result[0]!.percentUsed)).toBe(true);
    expect(result[0]!.level).toBe('oltre');
  });
});
